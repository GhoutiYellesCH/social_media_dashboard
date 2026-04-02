import { useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Plus,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp,
  Eye,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Account {
  id: string;
  platform: string;
  name: string;
  handle: string;
  avatar: string;
  connected: boolean;
  followers: string;
  postsThisMonth: number;
  color: string;
  status: "active" | "expiring" | "disconnected";
}

const accounts: Account[] = [
  {
    id: "1",
    platform: "Facebook",
    name: "Acme Inc.",
    handle: "@acmeinc",
    avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzc1MDcxMjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    connected: true,
    followers: "24.5K",
    postsThisMonth: 18,
    color: "#1877F2",
    status: "active",
  },
  {
    id: "2",
    platform: "Instagram",
    name: "Acme Inc.",
    handle: "@acme.inc",
    avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzc1MDcxMjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    connected: true,
    followers: "31.2K",
    postsThisMonth: 24,
    color: "#E4405F",
    status: "active",
  },
  {
    id: "3",
    platform: "LinkedIn",
    name: "Acme Inc.",
    handle: "acme-inc",
    avatar: "https://images.unsplash.com/photo-1623594675959-02360202d4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzc1MDY0OTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    connected: true,
    followers: "8.7K",
    postsThisMonth: 12,
    color: "#0A66C2",
    status: "expiring",
  },
  {
    id: "4",
    platform: "X",
    name: "Acme Inc.",
    handle: "@acmeinc",
    avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzc1MDcxMjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    connected: true,
    followers: "15.9K",
    postsThisMonth: 32,
    color: "#14171A",
    status: "active",
  },
];

const availablePlatforms = [
  { name: "Pinterest", color: "#E60023", icon: "P" },
  { name: "TikTok", color: "#000", icon: "T" },
  { name: "YouTube", color: "#FF0000", icon: "Y" },
  { name: "Threads", color: "#000", icon: "@" },
];

const platformIcons: Record<string, any> = {
  Facebook: Facebook,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  X: () => <span style={{ fontSize: 14, fontWeight: 800 }}>𝕏</span>,
};

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  active: { label: "Connected", bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 },
  expiring: { label: "Token Expiring", bg: "bg-yellow-50", text: "text-yellow-700", icon: AlertCircle },
  disconnected: { label: "Disconnected", bg: "bg-red-50", text: "text-red-600", icon: AlertCircle },
};

export function AccountsView() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="text-foreground">Accounts</h1>
          <p style={{ fontSize: 14 }} className="text-muted-foreground mt-0.5">
            Manage your connected social media accounts
          </p>
        </div>
        <button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2" style={{ fontSize: 14 }}>
          <Plus size={16} />
          Connect Account
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-accent/20 p-6 space-y-6">
        {/* Connected Accounts */}
        <div>
          <h3 className="text-foreground mb-4">Connected Accounts</h3>
          <div className="grid grid-cols-2 gap-4">
            {accounts.map((account) => {
              const PlatformIcon = platformIcons[account.platform];
              const status = statusConfig[account.status];
              const StatusIcon = status.icon;
              return (
                <div key={account.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <ImageWithFallback
                          src={account.avatar}
                          alt={account.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
                          style={{ backgroundColor: account.color }}
                        >
                          <PlatformIcon size={11} color="white" />
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600 }} className="text-foreground">{account.name}</p>
                        <p style={{ fontSize: 13 }} className="text-muted-foreground">{account.handle}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === account.id ? null : account.id)}
                        className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenu === account.id && (
                        <div className="absolute right-0 top-8 w-44 bg-card rounded-xl border border-border shadow-lg z-10 py-1">
                          <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent text-foreground" style={{ fontSize: 13 }}>
                            <ExternalLink size={14} /> View Profile
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent text-foreground" style={{ fontSize: 13 }}>
                            <RefreshCw size={14} /> Reconnect
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent text-red-500" style={{ fontSize: 13 }}>
                            <Trash2 size={14} /> Disconnect
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg} ${status.text} mb-4`} style={{ fontSize: 12, fontWeight: 600 }}>
                    <StatusIcon size={13} />
                    {status.label}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                        <Users size={12} />
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 700 }} className="text-foreground">{account.followers}</p>
                      <p style={{ fontSize: 11 }} className="text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                        <Eye size={12} />
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 700 }} className="text-foreground">{account.postsThisMonth}</p>
                      <p style={{ fontSize: 11 }} className="text-muted-foreground">Posts/mo</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                        <TrendingUp size={12} />
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 700 }} className="text-green-600">+4.2%</p>
                      <p style={{ fontSize: 11 }} className="text-muted-foreground">Growth</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add More Platforms */}
        <div>
          <h3 className="text-foreground mb-4">Available Platforms</h3>
          <div className="grid grid-cols-4 gap-4">
            {availablePlatforms.map((p) => (
              <button
                key={p.name}
                className="bg-card rounded-xl border border-border p-5 text-center hover:shadow-md hover:border-[#2563EB]/30 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: p.color }}
                >
                  <span className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>{p.icon}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600 }} className="text-foreground mb-1">{p.name}</p>
                <p style={{ fontSize: 12 }} className="text-muted-foreground">Click to connect</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}