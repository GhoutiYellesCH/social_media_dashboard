export type NavSection = "main" | "marketing" | "collaboration" | "utility";

export type NavConfigItem = {
  label: string;
  path: string;
  section: NavSection;
};

export const DEFAULT_NAV = "Tableau de Bord";

export const NAV_ITEMS: NavConfigItem[] = [
  { label: "Tableau de Bord", path: "/app/dashboard", section: "main" },
  { label: "Calendrier", path: "/app/calendar", section: "main" },
  { label: "Composer", path: "/app/composer", section: "main" },
  { label: "Analytiques", path: "/app/analytics", section: "main" },
  { label: "Comptes", path: "/app/accounts", section: "main" },

  { label: "Ads Manager", path: "/app/ads", section: "marketing" },
  { label: "Blog", path: "/app/blog", section: "marketing" },
  { label: "Email Marketing", path: "/app/email", section: "marketing" },
  { label: "Funnels", path: "/app/funnels", section: "marketing" },
  { label: "Link-in-Bio", path: "/app/link-in-bio", section: "marketing" },
  { label: "UTM Builder", path: "/app/utm-builder", section: "marketing" },
  { label: "Hashtags", path: "/app/hashtags", section: "marketing" },

  { label: "Inbox", path: "/app/inbox", section: "collaboration" },
  { label: "Social Listening", path: "/app/social-listening", section: "collaboration" },
  { label: "Equipe", path: "/app/team", section: "collaboration" },
  { label: "Mediatheque", path: "/app/media-library", section: "collaboration" },

  { label: "Tokens", path: "/app/tokens", section: "utility" },
  { label: "Parametres", path: "/app/settings", section: "utility" },
  { label: "Aide", path: "/app/help", section: "utility" },
];

export const NAV_TO_ROUTE: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.label, item.path])
);

export const ROUTE_TO_NAV: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.path, item.label])
);

export const NAV_SECTIONS: Record<NavSection, NavConfigItem[]> = {
  main: NAV_ITEMS.filter((item) => item.section === "main"),
  marketing: NAV_ITEMS.filter((item) => item.section === "marketing"),
  collaboration: NAV_ITEMS.filter((item) => item.section === "collaboration"),
  utility: NAV_ITEMS.filter((item) => item.section === "utility"),
};
