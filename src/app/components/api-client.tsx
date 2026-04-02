import { projectId, publicAnonKey } from "/utils/supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0d8dae93`;

let accessToken: string | null = null;

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
    Authorization: `Bearer ${token || publicAnonKey}`,
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`API error [${res.status}] ${path}:`, data);
      throw new ApiError(data.error || `Erreur ${res.status}`, res.status, data);
    }

    return data;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    console.error(`Network error ${path}:`, e);
    throw new ApiError("Erreur reseau. Verifiez votre connexion.", 0);
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
