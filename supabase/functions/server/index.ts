import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.ts";

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
    const logEntry = {
      id: crypto.randomUUID(),
      action: action || "Action IA",
      tokens: amount,
      module: module || "Inconnu",
      timestamp: new Date().toISOString(),
    };
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
      history.unshift({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        action: "Achat Baridimob",
        amount: addedTokens,
        type: "earn",
      });
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
    return c.json(history);
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

// =========================
// SETTINGS ROUTES
// =========================

// GET /settings
app.get(`${PREFIX}/settings`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const settings = (await kv.get(`user:${userId}:settings`)) || {};
    return c.json(sanitizeSettings(settings));
  } catch (e) {
    console.log("Get settings error:", e);
    return c.json({ error: `Erreur lors de la recuperation des parametres: ${e}` }, 500);
  }
});

// PUT /settings
app.put(`${PREFIX}/settings`, async (c) => {
  const userId = await getUserId(c);
  const authErr = requireAuth(c, userId);
  if (authErr) return authErr;

  try {
    const updates = await c.req.json();
    const validation = validateSettingsUpdatePayload(updates);
    if (!validation.ok) {
      return c.json({ error: validation.error }, 400);
    }

    const existing = sanitizeSettings((await kv.get(`user:${userId}:settings`)) || {});
    const merged = { ...existing, ...validation.value };
    await kv.set(`user:${userId}:settings`, merged);
    return c.json({ success: true, settings: merged });
  } catch (e) {
    console.log("Update settings error:", e);
    return c.json({ error: `Erreur lors de la sauvegarde des parametres: ${e}` }, 500);
  }
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
