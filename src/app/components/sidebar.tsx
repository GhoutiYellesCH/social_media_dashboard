import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  PenSquare,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  Megaphone,
  BookOpen,
  Mail,
  GitBranch,
  Link2,
  Ear,
  UserCog,
  Hash,
  ExternalLink,
  FolderOpen,
  Inbox,
  Coins,
} from "lucide-react";
import { useTokens } from "./token-context";
import { NAV_SECTIONS } from "../navigation-config";

const NAV_ICONS: Record<string, typeof LayoutDashboard> = {
  "Tableau de Bord": LayoutDashboard,
  Calendrier: CalendarDays,
  Composer: PenSquare,
  Analytiques: BarChart3,
  Comptes: Users,
  "Ads Manager": Megaphone,
  Blog: BookOpen,
  "Email Marketing": Mail,
  Funnels: GitBranch,
  "Link-in-Bio": Link2,
  "UTM Builder": ExternalLink,
  Hashtags: Hash,
  Inbox,
  "Social Listening": Ear,
  Equipe: UserCog,
  Mediatheque: FolderOpen,
  Parametres: Settings,
  Aide: HelpCircle,
  Tokens: Coins,
};

const accounts = [
  { platform: "Facebook", color: "#1877F2" },
  { platform: "Instagram", color: "#E4405F" },
  { platform: "TikTok", color: "#000000" },
  { platform: "LinkedIn", color: "#0A66C2" },
];

export function Sidebar({
  activeNav,
  onNavChange,
  darkMode,
  onToggleDarkMode,
  onLogout,
}: {
  activeNav: string;
  onNavChange: (label: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout?: () => void;
}) {
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);
  const { balance, monthlyAllowance, plan } = useTokens();

  const usagePercent = Math.round(((monthlyAllowance - balance) / monthlyAllowance) * 100);

  const NavButton = ({ icon: Icon, label }: { icon: typeof LayoutDashboard; label: string }) => {
    const isActive = activeNav === label;
    return (
      <button
        onClick={() => onNavChange(label)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive ? "bg-[#2563EB]/10 text-[#2563EB]" : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
      >
        <Icon size={18} />
        <span style={{ fontSize: 14 }}>{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-[240px] min-w-[240px] h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
            <span className="text-white" style={{ fontSize: 12, fontWeight: 700 }}>dZ</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }} className="text-foreground">SocialdZ</span>
          <span className="px-1.5 py-0.5 rounded text-[#2563EB] bg-[#2563EB]/10" style={{ fontSize: 9, fontWeight: 700 }}>BETA</span>
        </div>
      </div>

      {/* Token Balance */}
      <div className="px-4 py-3 border-b border-border">
        <button
          onClick={() => onNavChange("Tokens")}
          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-[#2563EB]/5 to-purple-500/5 border border-[#2563EB]/20 hover:border-[#2563EB]/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Coins size={14} className="text-[#2563EB]" />
              <span style={{ fontSize: 11, fontWeight: 600 }} className="text-[#2563EB]">Tokens IA</span>
            </div>
            <span style={{ fontSize: 11 }} className="text-muted-foreground">{plan}</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: 16, fontWeight: 700 }}>{balance.toLocaleString()}</span>
            <span className="text-muted-foreground" style={{ fontSize: 10 }}>/ {monthlyAllowance.toLocaleString()}</span>
          </div>
          <div className="w-full h-1.5 bg-accent rounded-full">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.max(5, 100 - usagePercent)}%`,
                backgroundColor: balance < 500 ? "#DC2626" : balance < 1500 ? "#F59E0B" : "#2563EB",
              }}
            />
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_SECTIONS.main.map((item) => (
          <NavButton key={item.label} icon={NAV_ICONS[item.label] || LayoutDashboard} label={item.label} />
        ))}

        {/* Marketing Section */}
        <div className="pt-4">
          <button
            onClick={() => setMarketingOpen(!marketingOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground"
          >
            <span style={{ fontSize: 12, fontWeight: 600 }} className="uppercase tracking-wider">
              Marketing
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${marketingOpen ? "" : "-rotate-90"}`}
            />
          </button>
          {marketingOpen && (
            <div className="space-y-1 mt-1">
              {NAV_SECTIONS.marketing.map((item) => (
                <NavButton key={item.label} icon={NAV_ICONS[item.label] || LayoutDashboard} label={item.label} />
              ))}
            </div>
          )}
        </div>

        {/* Collaboration Section */}
        <div className="pt-2">
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground"
          >
            <span style={{ fontSize: 12, fontWeight: 600 }} className="uppercase tracking-wider">
              Collaboration
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${toolsOpen ? "" : "-rotate-90"}`}
            />
          </button>
          {toolsOpen && (
            <div className="space-y-1 mt-1">
              {NAV_SECTIONS.collaboration.map((item) => (
                <NavButton key={item.label} icon={NAV_ICONS[item.label] || LayoutDashboard} label={item.label} />
              ))}
            </div>
          )}
        </div>

        {/* Connected Accounts */}
        <div className="pt-2">
          <button
            onClick={() => setAccountsOpen(!accountsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground"
          >
            <span style={{ fontSize: 12, fontWeight: 600 }} className="uppercase tracking-wider">
              Comptes Connectes
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${accountsOpen ? "" : "-rotate-90"}`}
            />
          </button>
          {accountsOpen && (
            <div className="space-y-1 mt-1">
              {accounts.map((acc, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-accent cursor-pointer">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: acc.color }}>
                    <span className="text-white" style={{ fontSize: 10, fontWeight: 700 }}>{acc.platform[0]}</span>
                  </div>
                  <p style={{ fontSize: 13 }} className="text-foreground">{acc.platform}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-border space-y-1">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-3">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span style={{ fontSize: 14 }}>{darkMode ? "Mode Clair" : "Mode Sombre"}</span>
          </div>
          <div className={`w-9 h-5 rounded-full relative transition-colors ${darkMode ? "bg-[#2563EB]" : "bg-switch-background"}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${darkMode ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
        </button>

        <NavButton icon={NAV_ICONS["Parametres"]} label="Parametres" />
        <NavButton icon={NAV_ICONS["Aide"]} label="Aide" />

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut size={18} />
            <span style={{ fontSize: 14 }}>Deconnexion</span>
          </button>
        )}
      </div>
    </aside>
  );
}
