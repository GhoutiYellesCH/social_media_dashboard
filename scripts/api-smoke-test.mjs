import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const infoPath = path.resolve(__dirname, "../utils/supabase/info.tsx");
const infoContent = readFileSync(infoPath, "utf8");

const projectIdMatch = infoContent.match(/export const projectId = "([^"]+)"/);
const anonKeyMatch = infoContent.match(/export const publicAnonKey = "([^"]+)"/);

if (!projectIdMatch?.[1] || !anonKeyMatch?.[1]) {
  console.error("Unable to parse Supabase keys from utils/supabase/info.tsx");
  process.exit(1);
}

const projectId = projectIdMatch[1];
const publicAnonKey = anonKeyMatch[1];

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;
const TEST_EMAIL = process.env.API_TEST_EMAIL;
const TEST_PASSWORD = process.env.API_TEST_PASSWORD;

const checks = [
  {
    group: "public",
    name: "health",
    path: "/health",
    method: "GET",
    expectedStatus: [200],
  },
  {
    group: "public",
    name: "diagnostics",
    path: "/diagnostics",
    method: "GET",
    expectedStatus: [200],
  },
  {
    group: "auth",
    name: "auth-login-validation",
    path: "/auth/login",
    method: "POST",
    body: { email: "", password: "" },
    expectedStatus: [400, 401],
  },
  {
    group: "auth",
    name: "auth-signup-validation",
    path: "/auth/signup",
    method: "POST",
    body: { email: "", password: "", name: "" },
    expectedStatus: [400],
  },
  {
    group: "security",
    name: "protected-tokens-unauthorized",
    path: "/tokens",
    method: "GET",
    expectedStatus: [401],
  },
  {
    group: "security",
    name: "webhook-without-signature",
    path: "/webhooks/baridimob",
    method: "POST",
    body: { transactionId: "missing-signature", status: "success" },
    expectedStatus: [401, 503],
  },
];

function logResult(result) {
  const statusText = result.ok ? "PASS" : "FAIL";
  console.log(`${statusText} [${result.group}] ${result.name} -> ${result.status}`);
  if (!result.ok && result.message) {
    console.log(`  ${result.message}`);
  }
}

async function doRequest(pathname, options = {}, accessToken) {
  const headers = {
    "Content-Type": "application/json",
    apikey: publicAnonKey,
    ...(options.headers || {}),
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${pathname}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }

  return { res, payload };
}

async function runAuthenticatedChecks(results) {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.log("INFO [auth] Skipping authenticated checks. Set API_TEST_EMAIL and API_TEST_PASSWORD to enable.");
    return;
  }

  let accessToken = null;
  try {
    const login = await doRequest(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
      },
    );

    if (login.res.status !== 200 || !login.payload?.access_token) {
      results.push({
        group: "auth",
        name: "auth-login-test-user",
        ok: false,
        status: login.res.status,
        message: login.payload?.error || "Unable to login with API_TEST_* credentials",
      });
      return;
    }

    accessToken = login.payload.access_token;
    results.push({
      group: "auth",
      name: "auth-login-test-user",
      ok: true,
      status: login.res.status,
      message: "OK",
    });

    const me = await doRequest("/auth/me", { method: "GET" }, accessToken);
    results.push({
      group: "protected",
      name: "auth-me-authorized",
      ok: me.res.status === 200 && !!me.payload?.user?.id,
      status: me.res.status,
      message: me.payload?.error || "OK",
    });

    const tokens = await doRequest("/tokens", { method: "GET" }, accessToken);
    results.push({
      group: "protected",
      name: "tokens-authorized",
      ok: tokens.res.status === 200 && typeof tokens.payload?.balance === "number",
      status: tokens.res.status,
      message: tokens.payload?.error || "OK",
    });
  } catch (err) {
    results.push({
      group: "auth",
      name: "authenticated-checks-runtime",
      ok: false,
      status: 0,
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

async function run() {
  const results = [];

  for (const check of checks) {
    try {
      const { res, payload } = await doRequest(check.path, {
        method: check.method,
        body: check.body ? JSON.stringify(check.body) : undefined,
      });

      const ok = check.expectedStatus.includes(res.status);
      results.push({
        group: check.group,
        name: check.name,
        ok,
        status: res.status,
        message: payload?.error || "",
      });
    } catch (err) {
      results.push({
        group: check.group,
        name: check.name,
        ok: false,
        status: 0,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  await runAuthenticatedChecks(results);

  results.forEach(logResult);

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log("\nAll API smoke tests passed.");
}

run();