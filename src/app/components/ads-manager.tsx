import { useState } from "react";
import {
  Plus,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MousePointerClick,
  Target,
  Filter,
  Search,
  MoreHorizontal,
  Copy,
  Trash2,
  Edit3,
  ChevronDown,
  ArrowUpRight,
  Zap,
  Users,
  Globe,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface AdCampaign {
  id: string;
  name: string;
  platform: string;
  platformColor: string;
  status: "active" | "paused" | "draft" | "completed";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
  startDate: string;
  endDate: string;
  objective: string;
  audience: string;
  thumbnail: string;
}

const campaigns: AdCampaign[] = [
  {
    id: "1",
    name: "Lancement Produit Printemps",
    platform: "Facebook",
    platformColor: "#1877F2",
    status: "active",
    budget: 150000,
    spent: 97350,
    impressions: 245000,
    clicks: 8920,
    conversions: 342,
    ctr: 3.64,
    cpc: 0.36,
    roas: 4.2,
    startDate: "15 Mar 2026",
    endDate: "15 Avr 2026",
    objective: "Conversions",
    audience: "25-44, Alger, Oran, Constantine",
    thumbnail: "https://images.unsplash.com/photo-1759215524472-1b0686fdbd87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYWR2ZXJ0aXNpbmclMjBjYW1wYWlnbiUyMG1hbmFnZW1lbnR8ZW58MXx8fHwxNzc1MTQxMDQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "2",
    name: "Notoriete Marque Q2",
    platform: "Instagram",
    platformColor: "#E4405F",
    status: "active",
    budget: 90000,
    spent: 56700,
    impressions: 189000,
    clicks: 5670,
    conversions: 156,
    ctr: 3.0,
    cpc: 0.33,
    roas: 3.1,
    startDate: "20 Mar 2026",
    endDate: "30 Avr 2026",
    objective: "Brand Awareness",
    audience: "18-35, Interest: Lifestyle",
    thumbnail: "",
  },
  {
    id: "3",
    name: "B2B Lead Generation",
    platform: "LinkedIn",
    platformColor: "#0A66C2",
    status: "paused",
    budget: 8000,
    spent: 4200,
    impressions: 78000,
    clicks: 3120,
    conversions: 89,
    ctr: 4.0,
    cpc: 1.35,
    roas: 5.8,
    startDate: "1 Feb 2026",
    endDate: "30 Avr 2026",
    objective: "Lead Generation",
    audience: "Decision Makers, SaaS",
    thumbnail: "",
  },
  {
    id: "4",
    name: "Retargeting Cart Abandoners",
    platform: "Facebook",
    platformColor: "#1877F2",
    status: "active",
    budget: 2000,
    spent: 1560,
    impressions: 56000,
    clicks: 2800,
    conversions: 224,
    ctr: 5.0,
    cpc: 0.56,
    roas: 7.2,
    startDate: "1 Mar 2026",
    endDate: "15 Avr 2026",
    objective: "Conversions",
    audience: "Website Visitors, Cart Abandoners",
    thumbnail: "",
  },
  {
    id: "5",
    name: "App Install Campaign",
    platform: "X",
    platformColor: "#000000",
    status: "draft",
    budget: 4000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0,
    roas: 0,
    startDate: "10 Avr 2026",
    endDate: "10 Mai 2026",
    objective: "App Installs",
    audience: "18-28, Tech Enthusiasts",
    thumbnail: "",
  },
  {
    id: "6",
    name: "Holiday Flash Sale",
    platform: "Instagram",
    platformColor: "#E4405F",
    status: "completed",
    budget: 6000,
    spent: 5890,
    impressions: 412000,
    clicks: 18540,
    conversions: 867,
    ctr: 4.5,
    cpc: 0.32,
    roas: 6.1,
    startDate: "20 Dec 2025",
    endDate: "5 Jan 2026",
    objective: "Sales",
    audience: "25-55, All Genders",
    thumbnail: "",
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-green-500/10", text: "text-green-600" },
  paused: { bg: "bg-yellow-500/10", text: "text-yellow-600" },
  draft: { bg: "bg-gray-500/10", text: "text-gray-500" },
  completed: { bg: "bg-blue-500/10", text: "text-blue-600" },
};

export function AdsManager() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filteredCampaigns = campaigns.filter((c) => {
    if (selectedFilter !== "all" && c.status !== selectedFilter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalSpent = campaigns.filter((c) => c.status === "active").reduce((a, c) => a + c.spent, 0);
  const totalImpressions = campaigns.filter((c) => c.status === "active").reduce((a, c) => a + c.impressions, 0);
  const totalClicks = campaigns.filter((c) => c.status === "active").reduce((a, c) => a + c.clicks, 0);
  const totalConversions = campaigns.filter((c) => c.status === "active").reduce((a, c) => a + c.conversions, 0);
  const avgRoas = campaigns.filter((c) => c.status === "active" && c.roas > 0).reduce((a, c) => a + c.roas, 0) / campaigns.filter((c) => c.status === "active" && c.roas > 0).length;

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Ads Manager</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>
              Create, manage, and optimize your ad campaigns across platforms
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            <Plus size={16} /> Create Campaign
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Active Spend", value: `${totalSpent.toLocaleString()} DZD`, icon: DollarSign, change: "+12.3%", up: true },
            { label: "Impressions", value: `${(totalImpressions / 1000).toFixed(0)}K`, icon: Eye, change: "+8.7%", up: true },
            { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, change: "+15.2%", up: true },
            { label: "Conversions", value: totalConversions.toLocaleString(), icon: Target, change: "+22.1%", up: true },
            { label: "Avg ROAS", value: `${avgRoas.toFixed(1)}x`, icon: TrendingUp, change: "+0.3x", up: true },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{stat.label}</span>
                <stat.icon size={16} className="text-muted-foreground" />
              </div>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? <TrendingUp size={12} className="text-green-500" /> : <TrendingDown size={12} className="text-red-500" />}
                <span className={stat.up ? "text-green-500" : "text-red-500"} style={{ fontSize: 12, fontWeight: 500 }}>{stat.change}</span>
                <span className="text-muted-foreground" style={{ fontSize: 12 }}>vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "All Campaigns" },
              { key: "active", label: "Active" },
              { key: "paused", label: "Paused" },
              { key: "draft", label: "Drafts" },
              { key: "completed", label: "Completed" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFilter === f.key ? "bg-[#2563EB] text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
              style={{ fontSize: 13 }}
            />
          </div>
        </div>

        {/* Campaign Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                {["Campaign", "Platform", "Status", "Budget / Spent", "Impressions", "CTR", "ROAS", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{campaign.name}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{campaign.objective} · {campaign.audience}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: campaign.platformColor }}>
                        <span className="text-white" style={{ fontSize: 9, fontWeight: 700 }}>{campaign.platform[0]}</span>
                      </div>
                      <span style={{ fontSize: 13 }}>{campaign.platform}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full ${statusColors[campaign.status].bg} ${statusColors[campaign.status].text}`} style={{ fontSize: 12, fontWeight: 500 }}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p style={{ fontSize: 13 }}>${campaign.spent.toLocaleString()} <span className="text-muted-foreground">/ ${campaign.budget.toLocaleString()}</span></p>
                      <div className="w-24 h-1.5 bg-accent rounded-full mt-1">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: 13 }}>{campaign.impressions > 0 ? `${(campaign.impressions / 1000).toFixed(0)}K` : "—"}</td>
                  <td className="px-4 py-3" style={{ fontSize: 13 }}>{campaign.ctr > 0 ? `${campaign.ctr}%` : "—"}</td>
                  <td className="px-4 py-3">
                    {campaign.roas > 0 ? (
                      <span className="text-green-600" style={{ fontSize: 13, fontWeight: 600 }}>{campaign.roas}x</span>
                    ) : (
                      <span style={{ fontSize: 13 }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === campaign.id ? null : campaign.id);
                        }}
                        className="p-1 rounded hover:bg-accent"
                      >
                        <MoreHorizontal size={16} className="text-muted-foreground" />
                      </button>
                      {menuOpen === campaign.id && (
                        <div className="absolute right-0 top-8 w-40 bg-card border border-border rounded-lg shadow-lg z-10 py-1">
                          {[
                            { icon: Edit3, label: "Edit", action: () => toast.info("Edit campaign") },
                            { icon: Copy, label: "Duplicate", action: () => toast.success("Campaign duplicated!") },
                            { icon: campaign.status === "active" ? Pause : Play, label: campaign.status === "active" ? "Pause" : "Resume", action: () => toast.success(`Campaign ${campaign.status === "active" ? "paused" : "resumed"}!`) },
                            { icon: Trash2, label: "Delete", action: () => toast.success("Campaign deleted!") },
                          ].map((item) => (
                            <button
                              key={item.label}
                              onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                                setMenuOpen(null);
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors ${item.label === "Delete" ? "text-destructive" : "text-foreground"}`}
                              style={{ fontSize: 13 }}
                            >
                              <item.icon size={14} /> {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCampaigns.length === 0 && (
            <div className="p-12 text-center text-muted-foreground" style={{ fontSize: 14 }}>No campaigns found</div>
          )}
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Create New Campaign</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Campaign name</label>
                <input placeholder="e.g., Spring Sale 2026" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Platform</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 14 }}>
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>X</option>
                  </select>
                </div>
                <div>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Objective</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 14 }}>
                    <option>Conversions</option>
                    <option>Brand Awareness</option>
                    <option>Lead Generation</option>
                    <option>Traffic</option>
                    <option>App Installs</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Daily budget ($)</label>
                  <input type="number" placeholder="50" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Total budget ($)</label>
                  <input type="number" placeholder="5000" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                </div>
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Target audience</label>
                <input placeholder="e.g., 25-44, Tech Enthusiasts" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Start date</label>
                  <input type="date" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>End date</label>
                  <input type="date" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                </div>
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Ad creative</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-[#2563EB]/50 transition-colors cursor-pointer">
                  <Zap size={24} className="mx-auto text-muted-foreground mb-2" />
                  <p style={{ fontSize: 13, fontWeight: 500 }}>Upload ad creative or drag & drop</p>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>PNG, JPG, MP4 up to 50MB</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  toast.success("Campaign created!", { description: "Your new campaign has been saved as draft." });
                }}
                className="px-5 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Detail Drawer */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50" onClick={() => setSelectedCampaign(null)}>
          <div className="bg-card w-full max-w-md h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>{selectedCampaign.name}</h2>
              <button onClick={() => setSelectedCampaign(null)} className="p-1 rounded-lg hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedCampaign.platformColor }}>
                  <span className="text-white" style={{ fontSize: 11, fontWeight: 700 }}>{selectedCampaign.platform[0]}</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{selectedCampaign.platform}</p>
                  <span className={`px-2 py-0.5 rounded-full ${statusColors[selectedCampaign.status].bg} ${statusColors[selectedCampaign.status].text}`} style={{ fontSize: 11, fontWeight: 500 }}>
                    {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Budget", value: `$${selectedCampaign.budget.toLocaleString()}` },
                  { label: "Spent", value: `$${selectedCampaign.spent.toLocaleString()}` },
                  { label: "Impressions", value: selectedCampaign.impressions.toLocaleString() },
                  { label: "Clicks", value: selectedCampaign.clicks.toLocaleString() },
                  { label: "Conversions", value: selectedCampaign.conversions.toLocaleString() },
                  { label: "CTR", value: `${selectedCampaign.ctr}%` },
                  { label: "CPC", value: `$${selectedCampaign.cpc}` },
                  { label: "ROAS", value: `${selectedCampaign.roas}x` },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-accent/30">
                    <p className="text-muted-foreground" style={{ fontSize: 11, fontWeight: 500 }}>{item.label}</p>
                    <p style={{ fontSize: 16, fontWeight: 600 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Objective</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{selectedCampaign.objective}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Audience</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{selectedCampaign.audience}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Duration</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{selectedCampaign.startDate} — {selectedCampaign.endDate}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { toast.success("Campaign updated!"); setSelectedCampaign(null); }}
                  className="flex-1 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  Edit Campaign
                </button>
                <button
                  onClick={() => { toast.success(`Campaign ${selectedCampaign.status === "active" ? "paused" : "resumed"}!`); setSelectedCampaign(null); }}
                  className="flex-1 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors"
                  style={{ fontSize: 14, fontWeight: 500 }}
                >
                  {selectedCampaign.status === "active" ? "Pause" : "Resume"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}