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
} from "lucide-react";

const mainNav = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: CalendarDays, label: "Content Calendar" },
  { icon: PenSquare, label: "Post Composer" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Accounts" },
];

const marketingNav = [
  { icon: Megaphone, label: "Ads Manager" },
  { icon: BookOpen, label: "Blog Manager" },
  { icon: Mail, label: "Email Marketing" },
  { icon: GitBranch, label: "Sales Funnels" },
  { icon: Link2, label: "Link-in-Bio" },
  { icon: ExternalLink, label: "UTM Builder" },
  { icon: Hash, label: "Hashtag Research" },
];

const accounts = [
  { platform: "Facebook", color: "#1877F2" },
  { platform: "Instagram", color: "#E4405F" },
  { platform: "LinkedIn", color: "#0A66C2" },
  { platform: "X", color: "#000000" },
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
            <span className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>S</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }} className="text-foreground">SocialQ</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainNav.map((item) => (
          <NavButton key={item.label} icon={item.icon} label={item.label} />
        ))}

        {/* Marketing Tools Section */}
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
              {marketingNav.map((item) => (
                <NavButton key={item.label} icon={item.icon} label={item.label} />
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
              <NavButton icon={Inbox} label="Inbox" />
              <NavButton icon={Ear} label="Social Listening" />
              <NavButton icon={UserCog} label="Team" />
              <NavButton icon={FolderOpen} label="Content Library" />
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
              Connected Accounts
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
            <span style={{ fontSize: 14 }}>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>
          <div className={`w-9 h-5 rounded-full relative transition-colors ${darkMode ? "bg-[#2563EB]" : "bg-switch-background"}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${darkMode ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
        </button>

        <NavButton icon={Settings} label="Settings" />
        <NavButton icon={HelpCircle} label="Help & Support" />

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut size={18} />
            <span style={{ fontSize: 14 }}>Log Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}