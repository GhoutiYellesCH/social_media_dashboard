export type AppPage = "landing" | "login" | "dashboard";

export const NAV_TO_ROUTE: Record<string, string> = {
  "Tableau de Bord": "/app/dashboard",
  "Calendrier": "/app/calendar",
  "Composer": "/app/composer",
  "Analytiques": "/app/analytics",
  "Comptes": "/app/accounts",
  "Parametres": "/app/settings",
  "Aide": "/app/help",
  "Ads Manager": "/app/ads",
  "Blog": "/app/blog",
  "Email Marketing": "/app/email",
  "Funnels": "/app/funnels",
  "Link-in-Bio": "/app/link-in-bio",
  "UTM Builder": "/app/utm-builder",
  "Hashtags": "/app/hashtags",
  "Inbox": "/app/inbox",
  "Social Listening": "/app/social-listening",
  "Equipe": "/app/team",
  "Mediatheque": "/app/media-library",
  "Tokens": "/app/tokens",
};

const ROUTE_TO_NAV: Record<string, string> = Object.fromEntries(
  Object.entries(NAV_TO_ROUTE).map(([label, path]) => [path, label])
);

const PUBLIC_ROUTES = new Set(["/", "/login"]);
const APP_ROUTES = new Set(Object.values(NAV_TO_ROUTE));

export const DEFAULT_NAV = "Tableau de Bord";
export const DEFAULT_APP_ROUTE = NAV_TO_ROUTE[DEFAULT_NAV];

function sanitizePath(input: string) {
  const trimmed = (input || "").trim();
  if (!trimmed) return "/";

  let pathname = "/";
  try {
    const parsed = new URL(trimmed, "http://localhost");
    pathname = parsed.pathname;
  } catch {
    pathname = "/";
  }

  if (!pathname.startsWith("/")) return "/";
  if (pathname.includes("..") || pathname.includes("\\")) return "/";
  if (pathname.length > 256) return "/";
  return pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
}

export function safeRouteForNav(label: string) {
  const route = NAV_TO_ROUTE[label] || DEFAULT_APP_ROUTE;
  return APP_ROUTES.has(route) ? route : DEFAULT_APP_ROUTE;
}

export function isAllowedRoute(pathname: string) {
  const path = sanitizePath(pathname);
  return PUBLIC_ROUTES.has(path) || APP_ROUTES.has(path);
}

export function pushSafeRoute(pathname: string, replace = false) {
  const safePath = isAllowedRoute(pathname) ? sanitizePath(pathname) : "/";
  const current = sanitizePath(window.location.pathname);
  if (safePath === current) return;
  if (replace) {
    window.history.replaceState({}, "", safePath);
    return;
  }
  window.history.pushState({}, "", safePath);
}

export function resolveSecureRoute(pathname: string, isAuthenticated: boolean): {
  page: AppPage;
  nav: string;
  postLoginRedirect?: string;
} {
  const path = sanitizePath(pathname);

  if (!isAuthenticated) {
    if (APP_ROUTES.has(path)) {
      return { page: "login", nav: DEFAULT_NAV, postLoginRedirect: path };
    }
    if (path === "/login") {
      return { page: "login", nav: DEFAULT_NAV };
    }
    return { page: "landing", nav: DEFAULT_NAV };
  }

  if (APP_ROUTES.has(path)) {
    return { page: "dashboard", nav: ROUTE_TO_NAV[path] || DEFAULT_NAV };
  }

  return { page: "dashboard", nav: DEFAULT_NAV };
}
