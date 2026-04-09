import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;
const REQUEST_TIMEOUT_MS = 10000;

let accessToken: string | null = null;

function extractErrorMessage(data: any, status: number): string {
  if (!data) return `Erreur ${status}`;
  if (typeof data === "string" && data.trim()) return data.trim();

  const candidates = [
    data.error,
    data.message,
    data.msg,
    data.error_description,
    data.details,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return `Erreur ${status}`;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem("socialdz_token", token);
  } else {
    localStorage.removeItem("socialdz_token");
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  const stored = localStorage.getItem("socialdz_token");
  if (stored) {
    accessToken = stored;
    return stored;
  }
  return null;
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: publicAnonKey,
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    const raw = await res.text();
    const contentType = res.headers.get("content-type") || "";
    let data: any = {};
    if (raw) {
      if (contentType.includes("application/json")) {
        try {
          data = JSON.parse(raw);
        } catch {
          data = { error: raw };
        }
      } else {
        try {
          data = JSON.parse(raw);
        } catch {
          data = { error: raw };
        }
      }
    }

    if (!res.ok) {
      console.error(`API error [${res.status}] ${path}:`, data);
      const message = extractErrorMessage(data, res.status);

      if (res.status === 401) {
        const lower = message.toLowerCase();
        if (
          lower.includes("invalid jwt") ||
          lower.includes("jwt") ||
          lower.includes("missing authorization header") ||
          lower.includes("authorization header")
        ) {
          logout();
          throw new ApiError("Session expiree. Veuillez vous reconnecter.", res.status, data);
        }
      }

      if (res.status === 404) {
        throw new ApiError("Route backend introuvable (404). Deployez la derniere version de la fonction server.", res.status, data);
      }
      throw new ApiError(message, res.status, data);
    }

    return data;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new ApiError("Le serveur met trop de temps a repondre.", 408);
    }
    if (e && e.status !== undefined) throw e;
    console.error(`Network error ${path}:`, e);
    throw new ApiError("Erreur reseau. Verifiez votre connexion.", 0);
  } finally {
    clearTimeout(timeoutId);
  }
}

export class ApiError extends Error {
  status: number;
  data?: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// ---- Auth ----

export async function signup(email: string, password: string, name: string) {
  const data = await request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
  if (data.access_token) {
    setAccessToken(data.access_token);
  }
  return data;
}

export async function login(email: string, password: string) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.access_token) {
    setAccessToken(data.access_token);
  }
  return data;
}

export async function getMe() {
  return request("/auth/me");
}

export async function resetPassword(email: string) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function updatePassword(password: string) {
  return request("/auth/update-password", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export async function getSecuritySettings() {
  return request("/auth/security");
}

export async function setupTwoFactor() {
  return request("/auth/security/2fa/setup", {
    method: "POST",
  });
}

export async function enableTwoFactor(code: string) {
  return request("/auth/security/2fa/enable", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function disableTwoFactor(code: string) {
  return request("/auth/security/2fa/disable", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function getActiveSessions() {
  return request("/auth/sessions");
}

export async function revokeOtherSessions() {
  return request("/auth/sessions/revoke-all", {
    method: "POST",
  });
}

export async function deleteAccount(confirm: string) {
  return request("/auth/account", {
    method: "DELETE",
    body: JSON.stringify({ confirm }),
  });
}

export function logout() {
  setAccessToken(null);
  localStorage.removeItem("socialdz_user");
}

// ---- Tokens ----

export async function getTokens() {
  return request("/tokens");
}

export async function consumeTokens(amount: number, action: string, module: string) {
  return request("/tokens/consume", {
    method: "POST",
    body: JSON.stringify({ amount, action, module }),
  });
}

export async function purchaseTokens(amount: number) {
  return request("/tokens/purchase", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function createBaridimobPayment(amount: number) {
  return request("/tokens/baridimob/payment", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function getTokenHistory() {
  return request("/tokens/history");
}

export async function upgradePlan(plan: string) {
  return request("/tokens/upgrade", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
}

// ---- Posts ----

export async function getPosts() {
  return request("/posts");
}

export async function createPost(postData: any) {
  return request("/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
}

export async function updatePost(id: string, updates: any) {
  return request(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deletePost(id: string) {
  return request(`/posts/${id}`, { method: "DELETE" });
}

// ---- Settings ----

export async function getSettings() {
  return request("/settings");
}

export async function updateSettings(updates: any) {
  return request("/settings", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function getProfileSettings() {
  const data = await request("/settings/profile");
  if (data && typeof data === "object" && data.profile && typeof data.profile === "object") {
    return data;
  }
  return { profile: data || {}, security: null };
}

export async function updateProfileSettings(updates: any) {
  const data = await request("/settings/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (data && typeof data === "object" && data.profile && typeof data.profile === "object") {
    return data;
  }
  return { profile: data || {}, security: null };
}

export async function getNotificationSettings() {
  return request("/settings/notifications");
}

export async function updateNotificationSettings(updates: any) {
  return request("/settings/notifications", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function getAppearanceSettings() {
  return request("/settings/appearance");
}

export async function updateAppearanceSettings(updates: any) {
  return request("/settings/appearance", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function getIntegrationSettings() {
  return request("/settings/integrations");
}

export async function updateIntegrationSettings(updates: any) {
  return request("/settings/integrations", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function getBillingSettings() {
  return request("/settings/billing");
}

export async function updateBillingSettings(updates: any) {
  return request("/settings/billing", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// ---- Accounts ----

export async function getAccounts() {
  return request("/accounts");
}

export async function addAccount(accountData: any) {
  return request("/accounts", {
    method: "POST",
    body: JSON.stringify(accountData),
  });
}

export async function removeAccount(id: string) {
  return request(`/accounts/${id}`, { method: "DELETE" });
}

export interface ApiDiagnosticResult {
  name: string;
  ok: boolean;
  status?: number;
  message: string;
}

export async function runApiDiagnostics(): Promise<ApiDiagnosticResult[]> {
  const checks: Array<{ name: string; path: string; options?: RequestInit }> = [
    { name: "health", path: "/health" },
    {
      name: "auth-login-route",
      path: "/auth/login",
      options: { method: "POST", body: JSON.stringify({ email: "", password: "" }) },
    },
    {
      name: "auth-signup-route",
      path: "/auth/signup",
      options: { method: "POST", body: JSON.stringify({ email: "", password: "", name: "" }) },
    },
  ];

  const results: ApiDiagnosticResult[] = [];
  for (const check of checks) {
    try {
      await request(check.path, check.options);
      results.push({
        name: check.name,
        ok: true,
        message: "OK",
      });
    } catch (e: any) {
      const reachableValidationError = e?.status === 400 || e?.status === 401 || e?.status === 422;
      results.push({
        name: check.name,
        ok: reachableValidationError,
        status: e?.status,
        message: e?.message || "Erreur inconnue",
      });
    }
  }

  return results;
}
