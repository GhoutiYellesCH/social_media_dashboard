import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.ts";
import { registerSettingsRoutes } from "./routes/settings.ts";

const app = new Hono();
const PREFIX = "/server"; // Supabase edge runtime exposes this function name in the internal request path
const APP_ORIGIN = Deno.env.get("APP_ORIGIN") || "http://localhost:5173";

// Supabase client for auth
const supabaseAdmin = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

const supabaseAnon = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

app.use("*", logger(console.log));

app.use(
  "/*",
  cors({
    origin: APP_ORIGIN,
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-baridi-signature", "x-baridi-timestamp"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

app.use("/*", async (c, next) => {
  await next();
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("X-Frame-Options", "DENY");
  c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  c.res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
});

// --- Helpers ---

async function getUserId(c: any): Promise<string | null> {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return null;
    const token = authHeader.split(" ")[1];
    if (!token) return null;
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user?.id) return null;
    return data.user.id;
  } catch (e) {
    console.log("Auth error:", e);
    return null;
  }
}

function requireAuth(c: any, userId: string | null) {
  if (!userId) {
    return c.json({ error: "Non autorise. Veuillez vous connecter." }, 401);
  }
  return null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string) {
  return typeof password === "string" && password.length >= 8;
}

async function hmacSHA256Hex(secret: string, payload: string): Promise<string> {
  const keyData = new TextEncoder().encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function generateBase32Secret(length = 32): string {
  const random = crypto.getRandomValues(new Uint8Array(length));
  let secret = "";
  for (let i = 0; i < random.length; i++) {
    secret += BASE32_ALPHABET[random[i] % 32];
  }
  return secret;
}

function decodeBase32(input: string): Uint8Array {
  const clean = input.toUpperCase().replace(/=+$/g, "").replace(/\s+/g, "");
  let bits = "";
  for (const char of clean) {
    const val = BASE32_ALPHABET.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}

async function generateTotpCode(secret: string, timestampMs = Date.now()): Promise<string> {
  const counter = Math.floor(timestampMs / 30000);
  const counterBytes = new Uint8Array(8);
  const view = new DataView(counterBytes.buffer);
  view.setUint32(4, counter, false);

  const key = await crypto.subtle.importKey(
    "raw",
    decodeBase32(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBytes));
  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(code % 1000000).padStart(6, "0");
}

async function verifyTotpCode(secret: string, code: string, window = 1): Promise<boolean> {
  const normalized = code.replace(/\D/g, "");
  if (normalized.length !== 6) return false;

  const now = Date.now();
  for (let step = -window; step <= window; step++) {
    const candidate = await generateTotpCode(secret, now + step * 30000);
    if (timingSafeEqual(candidate, normalized)) return true;
  }
  return false;
}

type UserSecuritySettings = {
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  pendingTwoFactorSecret?: string;
  updatedAt: string;
};

async function getSecuritySettings(userId: string): Promise<UserSecuritySettings> {
  const current = await kv.get(`user:${userId}:security`);
  if (current && typeof current === "object") {
    return {
      twoFactorEnabled: Boolean((current as any).twoFactorEnabled),
      twoFactorSecret: typeof (current as any).twoFactorSecret === "string" ? (current as any).twoFactorSecret : undefined,
      pendingTwoFactorSecret:
        typeof (current as any).pendingTwoFactorSecret === "string" ? (current as any).pendingTwoFactorSecret : undefined,
      updatedAt: typeof (current as any).updatedAt === "string" ? (current as any).updatedAt : new Date().toISOString(),
    };
  }

  return {
    twoFactorEnabled: false,
    updatedAt: new Date().toISOString(),
  };
}

type UserSession = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
};

function defaultCurrentSession(c: any): UserSession {
  const userAgent = c.req.header("user-agent") || "Navigateur";
  const forwardedFor = c.req.header("x-forwarded-for") || "IP masquee";
  const normalizedIp = forwardedFor.split(",")[0]?.trim() || "IP masquee";

  return {
    id: "current",
    device: userAgent.slice(0, 120),
    location: normalizedIp,
    lastActive: new Date().toISOString(),
    current: true,
  };
}

function sanitizeSessions(input: unknown): UserSession[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((raw) => raw && typeof raw === "object")
    .map((raw: any, index) => ({
      id: typeof raw.id === "string" && raw.id ? raw.id : `session-${index + 1}`,
      device: typeof raw.device === "string" && raw.device ? raw.device.slice(0, 120) : "Navigateur",
      location: typeof raw.location === "string" && raw.location ? raw.location.slice(0, 120) : "Inconnu",
      lastActive: isIsoDateString(raw.lastActive) ? raw.lastActive : new Date().toISOString(),
      current: Boolean(raw.current),
    }));
}

async function getUserSessions(c: any, userId: string): Promise<UserSession[]> {
  const stored = await kv.get(`user:${userId}:security:sessions`);
  const sessions = sanitizeSessions(stored);

  if (sessions.length === 0) {
    return [defaultCurrentSession(c)];
  }

  const hasCurrent = sessions.some((session) => session.current);
  if (!hasCurrent) {
    sessions.unshift(defaultCurrentSession(c));
  }

  return sessions;
}

// Default token config per plan
const PLAN_TOKENS: Record<string, number> = {
  Decouverte: 500,
  Pro: 5000,
  Entreprise: 20000,
};

const POST_STATUSES = new Set(["scheduled", "published", "draft"]);
const SUPPORTED_PLATFORMS = new Set(["Facebook", "Instagram", "LinkedIn", "X", "TikTok", "YouTube"]);

function isIsoDateString(value: unknown) {
  if (typeof value !== "string") return false;
  const parsed = Date.parse(value);
  return !Number.isNaN(parsed);
}

function normalizePlatforms(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const unique = new Set<string>();
  for (const item of value) {
    if (typeof item !== "string") continue;
    const platform = item.trim();
    if (SUPPORTED_PLATFORMS.has(platform)) unique.add(platform);
  }
  return Array.from(unique);
}

function validatePostCreatePayload(input: any): { ok: true; value: any } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Payload publication invalide." };
  }

  const content = typeof input.content === "string" ? input.content.trim() : "";
  if (!content) {
    return { ok: false, error: "Le contenu de la publication est requis." };
  }
  if (content.length > 5000) {
    return { ok: false, error: "Le contenu depasse la limite autorisee (5000 caracteres)." };
  }

  const status = typeof input.status === "string" ? input.status : "draft";
  if (!POST_STATUSES.has(status)) {
    return { ok: false, error: "Statut de publication invalide." };
  }

  const date = input.date;
  if (date !== undefined && !isIsoDateString(date)) {
    return { ok: false, error: "Date de publication invalide." };
  }

  const time = typeof input.time === "string" ? input.time.trim() : "";
  if (time && time.length > 30) {
    return { ok: false, error: "Heure de publication invalide." };
  }

  const platforms = normalizePlatforms(input.platforms);
  if (platforms.length === 0) {
    return { ok: false, error: "Au moins une plateforme valide est requise." };
  }

  const image = typeof input.image === "string" ? input.image.trim() : undefined;

  return {
    ok: true,
    value: {
      content,
      time,
      platforms,
      status,
      image,
      date: date || new Date().toISOString(),
    },
  };
}

function validatePostUpdatePayload(input: any): { ok: true; value: any } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Payload de mise a jour invalide." };
  }

  const updates: Record<string, unknown> = {};

  if ("content" in input) {
    if (typeof input.content !== "string" || !input.content.trim()) {
      return { ok: false, error: "Contenu invalide." };
    }
    if (input.content.trim().length > 5000) {
      return { ok: false, error: "Le contenu depasse la limite autorisee (5000 caracteres)." };
    }
    updates.content = input.content.trim();
  }

  if ("status" in input) {
    if (typeof input.status !== "string" || !POST_STATUSES.has(input.status)) {
      return { ok: false, error: "Statut de publication invalide." };
    }
    updates.status = input.status;
  }

  if ("time" in input) {
    if (typeof input.time !== "string" || input.time.trim().length > 30) {
      return { ok: false, error: "Heure de publication invalide." };
    }
    updates.time = input.time.trim();
  }

  if ("date" in input) {
    if (!isIsoDateString(input.date)) {
      return { ok: false, error: "Date de publication invalide." };
    }
    updates.date = input.date;
  }

  if ("platforms" in input) {
    const platforms = normalizePlatforms(input.platforms);
    if (platforms.length === 0) {
      return { ok: false, error: "Au moins une plateforme valide est requise." };
    }
    updates.platforms = platforms;
  }

  if ("image" in input) {
    if (input.image !== null && typeof input.image !== "string") {
      return { ok: false, error: "Image invalide." };
    }
    updates.image = input.image === null ? undefined : input.image.trim();
  }

  if (Object.keys(updates).length === 0) {
    return { ok: false, error: "Aucune propriete de mise a jour valide fournie." };
  }

  return { ok: true, value: updates };
}

const SETTINGS_ALLOWED_KEYS = new Set(["name", "email", "company", "role", "timezone", "language"]);
const SETTINGS_MAX_LENGTH: Record<string, number> = {
  name: 120,
  email: 254,
  company: 120,
  role: 120,
  timezone: 100,
  language: 50,
};

const NOTIFICATION_ALLOWED_KEYS = new Set([
  "email",
  "push",
  "postPublished",
  "weeklyReport",
  "teamActivity",
  "newFollower",
  "tokenLow",
]);

const APPEARANCE_THEME_VALUES = new Set(["Clair", "Sombre", "Systeme"]);

const INTEGRATION_ALLOWED_KEYS = new Set([
  "Canva",
  "Google Analytics",
  "WhatsApp Business",
  "Shopify",
  "CIB / Dahabia",
]);

const BILLING_ALLOWED_KEYS = new Set(["cardBrand", "cardLast4", "cardExpiry"]);

function sanitizeSettings(input: unknown) {
  if (!input || typeof input !== "object") return {};
  const obj = input as Record<string, unknown>;
  const sanitized: Record<string, string> = {};

  for (const key of Object.keys(obj)) {
    if (!SETTINGS_ALLOWED_KEYS.has(key)) continue;
    if (typeof obj[key] !== "string") continue;

    const value = obj[key].trim();
    const max = SETTINGS_MAX_LENGTH[key] || 120;
    sanitized[key] = value.slice(0, max);
  }

  return sanitized;
}

function validateSettingsUpdatePayload(input: unknown): { ok: true; value: Record<string, string> } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Payload de parametres invalide." };
  }

  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return { ok: false, error: "Aucune propriete de parametre fournie." };
  }

  for (const key of keys) {
    if (!SETTINGS_ALLOWED_KEYS.has(key)) {
      return { ok: false, error: `Champ de parametre non autorise: ${key}` };
    }

    const value = obj[key];
    if (typeof value !== "string") {
      return { ok: false, error: `Le champ ${key} doit etre une chaine de caracteres.` };
    }

    const trimmed = value.trim();
    const maxLength = SETTINGS_MAX_LENGTH[key] || 120;
    if (trimmed.length > maxLength) {
      return { ok: false, error: `Le champ ${key} depasse la limite autorisee (${maxLength} caracteres).` };
    }

    if (key === "email" && trimmed && !isValidEmail(trimmed)) {
      return { ok: false, error: "Format d'email invalide." };
    }
  }

  return { ok: true, value: sanitizeSettings(obj) };
}

function sanitizeNotificationSettings(input: unknown) {
  const defaults = {
    email: true,
    push: true,
    postPublished: true,
    weeklyReport: true,
    teamActivity: false,
    newFollower: false,
    tokenLow: true,
  };

  if (!input || typeof input !== "object") return defaults;
  const obj = input as Record<string, unknown>;
  const sanitized: Record<string, boolean> = { ...defaults };
  for (const key of Object.keys(obj)) {
    if (!NOTIFICATION_ALLOWED_KEYS.has(key)) continue;
    sanitized[key] = Boolean(obj[key]);
  }
  return sanitized;
}

function validateNotificationSettingsUpdatePayload(input: unknown): { ok: true; value: Record<string, boolean> } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Payload notifications invalide." };
  }

  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return { ok: false, error: "Aucune propriete notification fournie." };
  }

  for (const key of keys) {
    if (!NOTIFICATION_ALLOWED_KEYS.has(key)) {
      return { ok: false, error: `Champ notification non autorise: ${key}` };
    }
    if (typeof obj[key] !== "boolean") {
      return { ok: false, error: `Le champ ${key} doit etre un booleen.` };
    }
  }

  return { ok: true, value: sanitizeNotificationSettings(obj) };
}

function sanitizeAppearanceSettings(input: unknown) {
  const defaults = {
    theme: "Systeme",
    accentColor: "#2563EB",
  };

  if (!input || typeof input !== "object") return defaults;
  const obj = input as Record<string, unknown>;
  const theme = typeof obj.theme === "string" && APPEARANCE_THEME_VALUES.has(obj.theme)
    ? obj.theme
    : defaults.theme;
  const accentColor = typeof obj.accentColor === "string" && /^#[0-9a-fA-F]{6}$/.test(obj.accentColor)
    ? obj.accentColor.toUpperCase()
    : defaults.accentColor;
  return { theme, accentColor };
}

function validateAppearanceSettingsUpdatePayload(input: unknown): { ok: true; value: { theme: string; accentColor: string } } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Payload apparence invalide." };
  }

  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return { ok: false, error: "Aucune propriete apparence fournie." };
  }

  for (const key of keys) {
    if (key !== "theme" && key !== "accentColor") {
      return { ok: false, error: `Champ apparence non autorise: ${key}` };
    }
  }

  if ("theme" in obj && (typeof obj.theme !== "string" || !APPEARANCE_THEME_VALUES.has(obj.theme))) {
    return { ok: false, error: "Theme invalide." };
  }
  if ("accentColor" in obj && (typeof obj.accentColor !== "string" || !/^#[0-9a-fA-F]{6}$/.test(obj.accentColor))) {
    return { ok: false, error: "Couleur d'accent invalide." };
  }

  return { ok: true, value: sanitizeAppearanceSettings(obj) };
}

function sanitizeIntegrationSettings(input: unknown) {
  const defaults: Record<string, boolean> = {
    "Canva": true,
    "Google Analytics": true,
    "WhatsApp Business": false,
    "Shopify": false,
    "CIB / Dahabia": true,
  };

  if (!input || typeof input !== "object") return defaults;
  const obj = input as Record<string, unknown>;
  const sanitized: Record<string, boolean> = { ...defaults };
  for (const key of Object.keys(obj)) {
    if (!INTEGRATION_ALLOWED_KEYS.has(key)) continue;
    sanitized[key] = Boolean(obj[key]);
  }
  return sanitized;
}

function validateIntegrationSettingsUpdatePayload(input: unknown): { ok: true; value: Record<string, boolean> } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Payload integrations invalide." };
  }

  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return { ok: false, error: "Aucune propriete integration fournie." };
  }

  for (const key of keys) {
    if (!INTEGRATION_ALLOWED_KEYS.has(key)) {
      return { ok: false, error: `Champ integration non autorise: ${key}` };
    }
    if (typeof obj[key] !== "boolean") {
      return { ok: false, error: `Le champ ${key} doit etre un booleen.` };
    }
  }

  return { ok: true, value: sanitizeIntegrationSettings(obj) };
}

function sanitizeBillingSettings(input: unknown) {
  const defaults = {
    cardBrand: "CIB / Dahabia",
    cardLast4: "8742",
    cardExpiry: "06/2028",
  };

  if (!input || typeof input !== "object") return defaults;

  const obj = input as Record<string, unknown>;
  const cardBrand = typeof obj.cardBrand === "string" && obj.cardBrand.trim()
    ? obj.cardBrand.trim().slice(0, 80)
    : defaults.cardBrand;
  const cardLast4 = typeof obj.cardLast4 === "string" && /^[0-9]{4}$/.test(obj.cardLast4)
    ? obj.cardLast4
    : defaults.cardLast4;
  const cardExpiry = typeof obj.cardExpiry === "string" && /^(0[1-9]|1[0-2])\/(20[0-9]{2})$/.test(obj.cardExpiry)
    ? obj.cardExpiry
    : defaults.cardExpiry;

  return { cardBrand, cardLast4, cardExpiry };
}

function validateBillingSettingsUpdatePayload(input: unknown): { ok: true; value: { cardBrand: string; cardLast4: string; cardExpiry: string } } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Payload facturation invalide." };
  }

  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return { ok: false, error: "Aucune propriete facturation fournie." };
  }

  for (const key of keys) {
    if (!BILLING_ALLOWED_KEYS.has(key)) {
      return { ok: false, error: `Champ facturation non autorise: ${key}` };
    }

    if (typeof obj[key] !== "string") {
      return { ok: false, error: `Le champ ${key} doit etre une chaine de caracteres.` };
    }
  }

  const payload = sanitizeBillingSettings(obj);

  if (!payload.cardBrand) {
    return { ok: false, error: "Le type de carte est requis." };
  }
  if (!/^[0-9]{4}$/.test(payload.cardLast4)) {
    return { ok: false, error: "Les 4 derniers chiffres de la carte sont invalides." };
  }
  if (!/^(0[1-9]|1[0-2])\/(20[0-9]{2})$/.test(payload.cardExpiry)) {
    return { ok: false, error: "La date d'expiration doit etre au format MM/YYYY." };
  }

  return { ok: true, value: payload };
}

type TokenHistoryType = "consume" | "earn";

function normalizeTokenAmount(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.trunc(parsed);
  }
  return 0;
}

function normalizeTokenHistoryEntry(entry: any) {
  const rawType = entry?.type;
  const inferredType: TokenHistoryType = rawType === "earn" || rawType === "purchase"
    ? "earn"
    : "consume";

  const rawAmount = normalizeTokenAmount(entry?.tokens ?? entry?.amount ?? 0);
  const normalizedAmount = Math.abs(rawAmount);

  return {
    id: typeof entry?.id === "string" && entry.id ? entry.id : crypto.randomUUID(),
    action: typeof entry?.action === "string" && entry.action.trim() ? entry.action.trim() : "Action IA",
    module: typeof entry?.module === "string" && entry.module.trim() ? entry.module.trim() : "General",
    tokens: normalizedAmount,
    type: inferredType,
    timestamp: isIsoDateString(entry?.timestamp)
      ? entry.timestamp
      : isIsoDateString(entry?.date)
      ? entry.date
      : new Date().toISOString(),
  };
}

function createTokenHistoryEntry(input: {
  action: string;
  module?: string;
  tokens: number;
  type: TokenHistoryType;
}) {
  return {
    id: crypto.randomUUID(),
    action: input.action,
    module: input.module || "General",
    tokens: Math.abs(Math.trunc(input.tokens)),
    type: input.type,
    timestamp: new Date().toISOString(),
  };
}

async function ensureUserData(userId: string, email?: string, name?: string) {
  try {
    // Check if user tokens exist, if not, initialize
    const existing = await kv.get(`user:${userId}:tokens`);
    if (!existing) {
      const tokenData = {
        balance: 500, // Decouverte free tokens
        totalUsed: 0,
        plan: "Decouverte",
        monthlyAllowance: 500,
        createdAt: new Date().toISOString(),
      };
      await kv.set(`user:${userId}:tokens`, tokenData);
      await kv.set(`user:${userId}:token_history`, []);
      await kv.set(`user:${userId}:posts`, []);
      await kv.set(`user:${userId}:settings`, {
        name: name || "Utilisateur",
        email: email || "",
        company: "",
        role: "",
        timezone: "UTC+1 (Alger)",
        language: "Francais",
      });
      await kv.set(`user:${userId}:accounts`, []);
      console.log(`Initialized data for user ${userId}`);
    }
  } catch (e) {
    // Keep auth available even when KV table is not initialized yet.
    console.error("KV bootstrap skipped:", e);
  }
}

// --- Health ---
app.get(`${PREFIX}/health`, (c) => {
  return c.json({ status: "ok", service: "SocialdZ API", version: "1.0.0" });
});

app.get(`${PREFIX}/diagnostics`, (c) => {
  return c.json({
    status: "ok",
    checks: {
      health: true,
      authRoutesMounted: true,
      tokenRoutesMounted: true,
      webhookRouteMounted: true,
    },
  });
});

// =========================
// AUTH ROUTES
// =========================

// POST /signup
app.post(`${PREFIX}/auth/signup`, async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email et mot de passe requis." }, 400);
    }
    if (!isValidEmail(email)) {
      return c.json({ error: "Email invalide." }, 400);
    }
    if (!isStrongPassword(password)) {
      return c.json({ error: "Mot de passe trop faible (8 caracteres minimum)." }, 400);
    }

    const supabase = supabaseAdmin();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || "Utilisateur" },
      // Automatically confirm since no email server configured
      email_confirm: true,
    });

    if (error) {
      console.log("Signup error:", error.message);
      return c.json({ error: `Erreur lors de l'inscription: ${error.message}` }, 400);
    }

    // Initialize user data
    await ensureUserData(data.user.id, email, name);

    // Sign in immediately to get a session
    const anonClient = supabaseAnon();
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.log("Auto sign-in after signup failed:", signInError.message);
      return c.json({
        success: true,
        user: { id: data.user.id, email, name },
        message: "Compte cree. Veuillez vous connecter.",
      });
    }

    return c.json({
      success: true,
      user: { id: data.user.id, email, name },
      access_token: signInData.session?.access_token,
      message: "Compte cree avec succes ! 500 tokens IA offerts.",
    });
  } catch (e) {
    console.log("Signup exception:", e);
    return c.json({ error: `Erreur serveur lors de l'inscription: ${e}` }, 500);
  }
});

// POST /login
app.post(`${PREFIX}/auth/login`, async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email et mot de passe requis." }, 400);
    }
    if (!isValidEmail(email)) {
      return c.json({ error: "Email invalide." }, 400);
    }

    const supabase = supabaseAnon();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Login error:", error.message);
      return c.json({ error: `Erreur de connexion: ${error.message}` }, 401);
    }

    // Ensure user data exists
    await ensureUserData(
      data.user.id,
      email,
      data.user.user_metadata?.name
    );

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "Utilisateur",
      },
      access_token: data.session?.access_token,
    });
  } catch (e) {
    console.log("Login exception:", e);
    return c.json({ error: `Erreur serveur lors de la connexion: ${e}` }, 500);
  }
});

// POST /reset-password
app.post(`${PREFIX}/auth/reset-password`, async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email) return c.json({ error: "Email requis." }, 400);
    if (!isValidEmail(email)) return c.json({ error: "Email invalide." }, 400);

    const supabase = supabaseAnon();
    
    // Usually requires configure email templates in Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(c.req.url).origin}/reset-password`,
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ success: true, message: "Lien de reinitialisation envoye." });
  } catch(e) {
    return c.json({ error: `Erreur serveur: ${e}` }, 500);
  }
});

// POST /update-password
app.post(`${PREFIX}/auth/update-password`, async (c) => {
  try {
    const userId = await getUserId(c);
    const authError = requireAuth(c, userId);
    if (authError) return authError;
    
    const { password } = await c.req.json();
    if (!password) return c.json({ error: "Mot de passe requis." }, 400);

    if (!isStrongPassword(password)) {
      return c.json({ error: "Mot de passe trop faible (8 caracteres minimum)." }, 400);
    }

    const supabase = supabaseAdmin();
    const { error } = await supabase.auth.admin.updateUserById(userId as string, { password });
    if (error) return c.json({ error: error.message }, 400);
    
    return c.json({ success: true });
  } catch(e) {
    return c.json({ error: `Erreur serveur: ${e}` }, 500);
  }
});

// GET /auth/security
app.get(`${PREFIX}/auth/security`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const security = await getSecuritySettings(userId as string);
    return c.json({
      twoFactorEnabled: security.twoFactorEnabled,
      pendingSetup: Boolean(security.pendingTwoFactorSecret),
      updatedAt: security.updatedAt,
    });
  } catch (e) {
    return c.json({ error: `Erreur serveur: ${e}` }, 500);
  }
});

// POST /auth/security/2fa/setup
app.post(`${PREFIX}/auth/security/2fa/setup`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const security = await getSecuritySettings(userId as string);
    if (security.twoFactorEnabled) {
      return c.json({ error: "2FA deja activee." }, 400);
    }

    const secret = generateBase32Secret(32);
    const settings = await kv.get(`user:${userId}:settings`);
    const email = (settings && typeof settings === "object" && typeof (settings as any).email === "string")
      ? (settings as any).email
      : "utilisateur@socialdz.app";

    await kv.set(`user:${userId}:security`, {
      ...security,
      pendingTwoFactorSecret: secret,
      updatedAt: new Date().toISOString(),
    });

    const issuer = "SocialdZ";
    const account = encodeURIComponent(email);
    const otpauthUri = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&digits=6&period=30`;

    return c.json({
      success: true,
      secret,
      otpauthUri,
      message: "Scannez le code dans votre application d'authentification puis confirmez avec un code a 6 chiffres.",
    });
  } catch (e) {
    return c.json({ error: `Erreur serveur: ${e}` }, 500);
  }
});

// POST /auth/security/2fa/enable
app.post(`${PREFIX}/auth/security/2fa/enable`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const { code } = await c.req.json();
    if (!code) return c.json({ error: "Code 2FA requis." }, 400);

    const security = await getSecuritySettings(userId as string);
    if (!security.pendingTwoFactorSecret) {
      return c.json({ error: "Aucune configuration 2FA en attente." }, 400);
    }

    const valid = await verifyTotpCode(security.pendingTwoFactorSecret, String(code));
    if (!valid) {
      return c.json({ error: "Code 2FA invalide." }, 400);
    }

    await kv.set(`user:${userId}:security`, {
      twoFactorEnabled: true,
      twoFactorSecret: security.pendingTwoFactorSecret,
      pendingTwoFactorSecret: undefined,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, twoFactorEnabled: true });
  } catch (e) {
    return c.json({ error: `Erreur serveur: ${e}` }, 500);
  }
});

// POST /auth/security/2fa/disable
app.post(`${PREFIX}/auth/security/2fa/disable`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const { code } = await c.req.json();
    if (!code) return c.json({ error: "Code 2FA requis." }, 400);

    const security = await getSecuritySettings(userId as string);
    if (!security.twoFactorEnabled || !security.twoFactorSecret) {
      return c.json({ error: "2FA non activee." }, 400);
    }

    const valid = await verifyTotpCode(security.twoFactorSecret, String(code));
    if (!valid) {
      return c.json({ error: "Code 2FA invalide." }, 400);
    }

    await kv.set(`user:${userId}:security`, {
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
      pendingTwoFactorSecret: undefined,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, twoFactorEnabled: false });
  } catch (e) {
    return c.json({ error: `Erreur serveur: ${e}` }, 500);
  }
});

// GET /auth/sessions
app.get(`${PREFIX}/auth/sessions`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const sessions = await getUserSessions(c, userId as string);
    await kv.set(`user:${userId}:security:sessions`, sessions);
    return c.json({ sessions });
  } catch (e) {
    return c.json({ error: `Erreur serveur: ${e}` }, 500);
  }
});

// POST /auth/sessions/revoke-all
app.post(`${PREFIX}/auth/sessions/revoke-all`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const currentSession = defaultCurrentSession(c);
    await kv.set(`user:${userId}:security:sessions`, [currentSession]);
    return c.json({
      success: true,
      sessions: [currentSession],
      message: "Les autres sessions ont ete deconnectees.",
    });
  } catch (e) {
    return c.json({ error: `Erreur serveur: ${e}` }, 500);
  }
});

// DELETE /auth/account
app.delete(`${PREFIX}/auth/account`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const body = await c.req.json().catch(() => ({}));
    const confirmation = typeof body?.confirm === "string" ? body.confirm.trim().toUpperCase() : "";
    if (confirmation !== "SUPPRIMER" && confirmation !== "DELETE") {
      return c.json({ error: "Confirmation invalide. Utilisez SUPPRIMER." }, 400);
    }

    const supabase = supabaseAdmin();
    const { error } = await supabase.auth.admin.deleteUser(userId as string);
    if (error) {
      return c.json({ error: `Suppression du compte echouee: ${error.message}` }, 400);
    }

    const cleanupKeys = [
      `user:${userId}:settings`,
      `user:${userId}:settings:notifications`,
      `user:${userId}:settings:appearance`,
      `user:${userId}:settings:integrations`,
      `user:${userId}:settings:billing`,
      `user:${userId}:security`,
      `user:${userId}:security:sessions`,
      `user:${userId}:tokens`,
      `user:${userId}:token_history`,
      `user:${userId}:posts`,
      `user:${userId}:accounts`,
    ];

    await Promise.all(cleanupKeys.map((key) => kv.del(key).catch(() => undefined)));

    return c.json({ success: true, message: "Compte supprime." });
  } catch (e) {
    return c.json({ error: `Erreur serveur: ${e}` }, 500);
  }
});

// GET /auth/me - get current user info
app.get(`${PREFIX}/auth/me`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const settings = await kv.get(`user:${userId}:settings`);
    const tokens = await kv.get(`user:${userId}:tokens`);
    return c.json({ user: { id: userId, ...settings }, tokens });
  } catch (e) {
    console.log("Get user fallback:", e);
    return c.json({
      user: { id: userId, name: "Utilisateur", email: "" },
      tokens: {
        balance: 500,
        totalUsed: 0,
        plan: "Decouverte",
        monthlyAllowance: 500,
      },
    });
  }
});

// =========================
// TOKEN ROUTES
// =========================

// GET /tokens - get token balance
app.get(`${PREFIX}/tokens`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const tokens = await kv.get(`user:${userId}:tokens`);
    if (!tokens) {
      return c.json({
        balance: 500,
        totalUsed: 0,
        plan: "Decouverte",
        monthlyAllowance: 500,
      });
    }
    return c.json(tokens);
  } catch (e) {
    console.log("Get tokens fallback:", e);
    return c.json({
      balance: 500,
      totalUsed: 0,
      plan: "Decouverte",
      monthlyAllowance: 500,
    });
  }
});

// POST /tokens/consume - use tokens for AI
app.post(`${PREFIX}/tokens/consume`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const { amount, action, module } = await c.req.json();
    if (!amount || amount <= 0) {
      return c.json({ error: "Montant de tokens invalide." }, 400);
    }

    const tokens = await kv.get(`user:${userId}:tokens`);
    if (!tokens) {
      return c.json({ error: "Donnees tokens non trouvees." }, 404);
    }

    if (tokens.balance < amount) {
      return c.json({
        error: "Tokens insuffisants.",
        balance: tokens.balance,
        required: amount,
      }, 402);
    }

    // Deduct tokens
    tokens.balance -= amount;
    tokens.totalUsed += amount;
    await kv.set(`user:${userId}:tokens`, tokens);

    // Add to history
    const history = (await kv.get(`user:${userId}:token_history`)) || [];
    const logEntry = createTokenHistoryEntry({
      action: action || "Action IA",
      module: module || "Inconnu",
      tokens: amount,
      type: "consume",
    });
    history.unshift(logEntry);
    // Keep only last 100 entries
    if (history.length > 100) history.length = 100;
    await kv.set(`user:${userId}:token_history`, history);

    return c.json({
      success: true,
      balance: tokens.balance,
      used: amount,
      logEntry,
    });
  } catch (e) {
    console.log("Consume tokens error:", e);
    return c.json({ error: `Erreur lors de la consommation des tokens: ${e}` }, 500);
  }
});

// POST /tokens/baridimob/payment
app.post(`${PREFIX}/tokens/baridimob/payment`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const { amount } = await c.req.json();
    if (!amount || amount <= 0) return c.json({ error: "Montant invalide." }, 400);

    const transactionId = crypto.randomUUID();
    
    await kv.set(`payment:${transactionId}`, {
      userId,
      amount,
      status: "pending",
      createdAt: new Date().toISOString()
    });

    const paymentUrl = `https://checkout.baridimob.dz/checkout?token=${transactionId}&amount=${amount}`;
    
    return c.json({ success: true, paymentUrl, transactionId });
  } catch(e) {
    return c.json({ error: `Erreur serveur: ${e}` }, 500);
  }
});

// POST /webhooks/baridimob
app.post(`${PREFIX}/webhooks/baridimob`, async (c) => {
  try {
    const secret = Deno.env.get("BARIDIMOB_WEBHOOK_SECRET");
    if (!secret) {
      return c.json({ error: "Webhook secret non configure." }, 503);
    }

    const signature = c.req.header("x-baridi-signature") || "";
    const timestamp = c.req.header("x-baridi-timestamp") || "";
    const rawPayload = await c.req.text();
    const expected = await hmacSHA256Hex(secret, `${timestamp}.${rawPayload}`);
    if (!timingSafeEqual(signature, expected)) {
      return c.json({ error: "Signature invalide." }, 401);
    }

    const payload = JSON.parse(rawPayload);
    const { transactionId, status } = payload;

    if (!transactionId || status !== "success") {
      return c.json({ error: "Invalid payload or payment not successful" }, 400);
    }
    
    const payment = await kv.get(`payment:${transactionId}`);
    if (!payment || payment.status !== "pending") {
      return c.json({ error: "Transaction not found or already processed" }, 400);
    }
    
    // Process payment
    const userId = payment.userId;
    const tokens = await kv.get(`user:${userId}:tokens`);
    if (tokens) {
      // e.g. 100 DZD = 1000 tokens
      const addedTokens = Number(payment.amount) * 10;
      tokens.balance += addedTokens; 
      
      await kv.set(`user:${userId}:tokens`, tokens);
      
      const history = await kv.get(`user:${userId}:token_history`) || [];
      history.unshift(createTokenHistoryEntry({
        action: "Achat Baridimob",
        module: "Paiement",
        tokens: addedTokens,
        type: "earn",
      }));
      if (history.length > 100) history.length = 100;
      await kv.set(`user:${userId}:token_history`, history);
    }
    
    payment.status = "completed";
    await kv.set(`payment:${transactionId}`, payment);
    
    return c.json({ success: true });
  } catch(e) {
    return c.json({ error: `Webhook error: ${e}` }, 500);
  }
});

// POST /tokens/purchase - buy more tokens
app.post(`${PREFIX}/tokens/purchase`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const { amount } = await c.req.json();
    if (!amount || amount <= 0) {
      return c.json({ error: "Montant invalide." }, 400);
    }

    const tokens = await kv.get(`user:${userId}:tokens`);
    if (!tokens) {
      return c.json({ error: "Donnees tokens non trouvees." }, 404);
    }

    tokens.balance += amount;
    await kv.set(`user:${userId}:tokens`, tokens);

    const history = (await kv.get(`user:${userId}:token_history`)) || [];
    history.unshift(createTokenHistoryEntry({
      action: "Achat de tokens",
      module: "Paiement",
      tokens: amount,
      type: "earn",
    }));
    if (history.length > 100) history.length = 100;
    await kv.set(`user:${userId}:token_history`, history);

    return c.json({
      success: true,
      balance: tokens.balance,
      added: amount,
      message: `${amount} tokens ajoutes avec succes !`,
    });
  } catch (e) {
    console.log("Purchase tokens error:", e);
    return c.json({ error: `Erreur lors de l'achat de tokens: ${e}` }, 500);
  }
});

// GET /tokens/history - get usage history
app.get(`${PREFIX}/tokens/history`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const history = (await kv.get(`user:${userId}:token_history`)) || [];
    const normalizedHistory = Array.isArray(history)
      ? history.map((entry: any) => normalizeTokenHistoryEntry(entry))
      : [];
    return c.json(normalizedHistory);
  } catch (e) {
    console.log("Get token history error:", e);
    return c.json({ error: `Erreur lors de la recuperation de l'historique: ${e}` }, 500);
  }
});

// POST /tokens/upgrade - upgrade plan
app.post(`${PREFIX}/tokens/upgrade`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const { plan } = await c.req.json();
    if (!PLAN_TOKENS[plan]) {
      return c.json({ error: "Forfait invalide." }, 400);
    }

    const tokens = await kv.get(`user:${userId}:tokens`);
    if (!tokens) {
      return c.json({ error: "Donnees tokens non trouvees." }, 404);
    }

    const oldAllowance = tokens.monthlyAllowance;
    tokens.plan = plan;
    tokens.monthlyAllowance = PLAN_TOKENS[plan];
    // Add the difference in tokens
    const bonus = Math.max(0, PLAN_TOKENS[plan] - oldAllowance);
    tokens.balance += bonus;
    await kv.set(`user:${userId}:tokens`, tokens);

    return c.json({
      success: true,
      plan,
      balance: tokens.balance,
      monthlyAllowance: tokens.monthlyAllowance,
      message: `Forfait mis a jour vers ${plan} ! ${bonus} tokens bonus ajoutes.`,
    });
  } catch (e) {
    console.log("Upgrade plan error:", e);
    return c.json({ error: `Erreur lors de la mise a jour du forfait: ${e}` }, 500);
  }
});

// =========================
// POSTS ROUTES
// =========================

// GET /posts
app.get(`${PREFIX}/posts`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const posts = (await kv.get(`user:${userId}:posts`)) || [];
    return c.json(posts);
  } catch (e) {
    console.log("Get posts error:", e);
    return c.json({ error: `Erreur lors de la recuperation des publications: ${e}` }, 500);
  }
});

// POST /posts - create a post
app.post(`${PREFIX}/posts`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const postData = await c.req.json();
    const validation = validatePostCreatePayload(postData);
    if (!validation.ok) {
      return c.json({ error: validation.error }, 400);
    }

    const posts = (await kv.get(`user:${userId}:posts`)) || [];

    const newPost = {
      id: crypto.randomUUID(),
      ...validation.value,
      createdAt: new Date().toISOString(),
    };
    posts.push(newPost);
    await kv.set(`user:${userId}:posts`, posts);

    return c.json({ success: true, post: newPost });
  } catch (e) {
    console.log("Create post error:", e);
    return c.json({ error: `Erreur lors de la creation de la publication: ${e}` }, 500);
  }
});

// PUT /posts/:id - update a post
app.put(`${PREFIX}/posts/:id`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const postId = c.req.param("id");
    if (!postId || postId.length > 128) {
      return c.json({ error: "Identifiant de publication invalide." }, 400);
    }

    const updateData = await c.req.json();
    const validation = validatePostUpdatePayload(updateData);
    if (!validation.ok) {
      return c.json({ error: validation.error }, 400);
    }

    const posts = (await kv.get(`user:${userId}:posts`)) || [];

    const index = posts.findIndex((p: any) => p.id === postId);
    if (index === -1) {
      return c.json({ error: "Publication non trouvee." }, 404);
    }

    posts[index] = { ...posts[index], ...validation.value, updatedAt: new Date().toISOString() };
    await kv.set(`user:${userId}:posts`, posts);

    return c.json({ success: true, post: posts[index] });
  } catch (e) {
    console.log("Update post error:", e);
    return c.json({ error: `Erreur lors de la mise a jour: ${e}` }, 500);
  }
});

// DELETE /posts/:id
app.delete(`${PREFIX}/posts/:id`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const postId = c.req.param("id");
    if (!postId || postId.length > 128) {
      return c.json({ error: "Identifiant de publication invalide." }, 400);
    }

    let posts = (await kv.get(`user:${userId}:posts`)) || [];
    const before = posts.length;
    posts = posts.filter((p: any) => p.id !== postId);

    if (posts.length === before) {
      return c.json({ error: "Publication non trouvee." }, 404);
    }

    await kv.set(`user:${userId}:posts`, posts);
    return c.json({ success: true });
  } catch (e) {
    console.log("Delete post error:", e);
    return c.json({ error: `Erreur lors de la suppression: ${e}` }, 500);
  }
});

registerSettingsRoutes({
  app,
  prefix: PREFIX,
  getUserId,
  requireAuth,
  ensureUserData,
  supabaseAdmin,
  getSecuritySettings,
  sanitizeSettings,
  validateSettingsUpdatePayload,
  sanitizeNotificationSettings,
  validateNotificationSettingsUpdatePayload,
  sanitizeAppearanceSettings,
  validateAppearanceSettingsUpdatePayload,
  sanitizeIntegrationSettings,
  validateIntegrationSettingsUpdatePayload,
  sanitizeBillingSettings,
  validateBillingSettingsUpdatePayload,
  kv,
});

// =========================
// ACCOUNTS (social) ROUTES
// =========================

// GET /accounts
app.get(`${PREFIX}/accounts`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const accounts = (await kv.get(`user:${userId}:accounts`)) || [];
    return c.json(accounts);
  } catch (e) {
    console.log("Get accounts error:", e);
    return c.json({ error: `Erreur: ${e}` }, 500);
  }
});

// POST /accounts
app.post(`${PREFIX}/accounts`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const accountData = await c.req.json();
    const accounts = (await kv.get(`user:${userId}:accounts`)) || [];
    const newAccount = { id: crypto.randomUUID(), ...accountData, connectedAt: new Date().toISOString() };
    accounts.push(newAccount);
    await kv.set(`user:${userId}:accounts`, accounts);
    return c.json({ success: true, account: newAccount });
  } catch (e) {
    console.log("Add account error:", e);
    return c.json({ error: `Erreur: ${e}` }, 500);
  }
});

// DELETE /accounts/:id
app.delete(`${PREFIX}/accounts/:id`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const accountId = c.req.param("id");
    let accounts = (await kv.get(`user:${userId}:accounts`)) || [];
    accounts = accounts.filter((a: any) => a.id !== accountId);
    await kv.set(`user:${userId}:accounts`, accounts);
    return c.json({ success: true });
  } catch (e) {
    console.log("Delete account error:", e);
    return c.json({ error: `Erreur: ${e}` }, 500);
  }
});

Deno.serve(app.fetch);
