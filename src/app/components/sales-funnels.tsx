import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MousePointerClick,
  ArrowRight,
  ArrowDown,
  X,
  Zap,
  Globe,
  FileText,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

interface Funnel {
  id: string;
  name: string;
  status: "active" | "draft" | "paused";
  steps: FunnelStep[];
  totalVisitors: number;
  totalConversions: number;
  revenue: number;
  conversionRate: number;
  createdDate: string;
}

interface FunnelStep {
  id: string;
  name: string;
  type: "landing" | "optin" | "sales" | "checkout" | "upsell" | "thankyou";
  visitors: number;
  conversions: number;
  conversionRate: number;
}

const funnels: Funnel[] = [
  {
    id: "1",
    name: "Product Launch Funnel",
    status: "active",
    totalVisitors: 15420,
    totalConversions: 1235,
    revenue: 62450,
    conversionRate: 8.0,
    createdDate: "Feb 15, 2026",
    steps: [
      { id: "1a", name: "Landing Page", type: "landing", visitors: 15420, conversions: 6890, conversionRate: 44.7 },
      { id: "1b", name: "Email Opt-in", type: "optin", visitors: 6890, conversions: 4120, conversionRate: 59.8 },
      { id: "1c", name: "Sales Page", type: "sales", visitors: 4120, conversions: 1560, conversionRate: 37.9 },
      { id: "1d", name: "Checkout", type: "checkout", visitors: 1560, conversions: 1235, conversionRate: 79.2 },
      { id: "1e", name: "Upsell Offer", type: "upsell", visitors: 1235, conversions: 432, conversionRate: 35.0 },
      { id: "1f", name: "Thank You", type: "thankyou", visitors: 1235, conversions: 1235, conversionRate: 100 },
    ],
  },
  {
    id: "2",
    name: "Webinar Registration Funnel",
    status: "active",
    totalVisitors: 8900,
    totalConversions: 2450,
    revenue: 0,
    conversionRate: 27.5,
    createdDate: "Mar 1, 2026",
    steps: [
      { id: "2a", name: "Webinar Landing", type: "landing", visitors: 8900, conversions: 3560, conversionRate: 40.0 },
      { id: "2b", name: "Registration Form", type: "optin", visitors: 3560, conversions: 2450, conversionRate: 68.8 },
      { id: "2c", name: "Confirmation Page", type: "thankyou", visitors: 2450, conversions: 2450, conversionRate: 100 },
    ],
  },
  {
    id: "3",
    name: "Free Trial to Paid Funnel",
    status: "active",
    totalVisitors: 12300,
    totalConversions: 890,
    revenue: 25830,
    conversionRate: 7.2,
    createdDate: "Jan 20, 2026",
    steps: [
      { id: "3a", name: "Feature Page", type: "landing", visitors: 12300, conversions: 5400, conversionRate: 43.9 },
      { id: "3b", name: "Sign Up", type: "optin", visitors: 5400, conversions: 3200, conversionRate: 59.3 },
      { id: "3c", name: "Onboarding", type: "sales", visitors: 3200, conversions: 1800, conversionRate: 56.3 },
      { id: "3d", name: "Upgrade Page", type: "checkout", visitors: 1800, conversions: 890, conversionRate: 49.4 },
      { id: "3e", name: "Welcome Pro", type: "thankyou", visitors: 890, conversions: 890, conversionRate: 100 },
    ],
  },
  {
    id: "4",
    name: "Lead Magnet Funnel",
    status: "paused",
    totalVisitors: 6700,
    totalConversions: 3120,
    revenue: 0,
    conversionRate: 46.6,
    createdDate: "Dec 10, 2025",
    steps: [
      { id: "4a", name: "Squeeze Page", type: "landing", visitors: 6700, conversions: 3120, conversionRate: 46.6 },
      { id: "4b", name: "Download Page", type: "thankyou", visitors: 3120, conversions: 3120, conversionRate: 100 },
    ],
  },
  {
    id: "5",
    name: "Black Friday Sales Funnel",
    status: "draft",
    totalVisitors: 0,
    totalConversions: 0,
    revenue: 0,
    conversionRate: 0,
    createdDate: "Mar 30, 2026",
    steps: [
      { id: "5a", name: "Teaser Page", type: "landing", visitors: 0, conversions: 0, conversionRate: 0 },
      { id: "5b", name: "Early Access", type: "optin", visitors: 0, conversions: 0, conversionRate: 0 },
      { id: "5c", name: "Flash Sale", type: "sales", visitors: 0, conversions: 0, conversionRate: 0 },
      { id: "5d", name: "Checkout", type: "checkout", visitors: 0, conversions: 0, conversionRate: 0 },
    ],
  },
];

const stepIcons: Record<string, typeof Globe> = {
  landing: Globe,
  optin: FileText,
  sales: ShoppingCart,
  checkout: CreditCard,
  upsell: Zap,
  thankyou: CheckCircle2,
};

const stepColors: Record<string, string> = {
  landing: "#2563EB",
  optin: "#7C3AED",
  sales: "#EA580C",
  checkout: "#059669",
  upsell: "#DC2626",
  thankyou: "#0891B2",
};

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-green-500/10", text: "text-green-600" },
  draft: { bg: "bg-gray-500/10", text: "text-gray-500" },
  paused: { bg: "bg-yellow-500/10", text: "text-yellow-600" },
};

export function SalesFunnels() {
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const totalRevenue = funnels.reduce((a, f) => a + f.revenue, 0);
  const totalConversions = funnels.reduce((a, f) => a + f.totalConversions, 0);
  const totalVisitors = funnels.reduce((a, f) => a + f.totalVisitors, 0);

  const filteredFunnels = funnels.filter((f) => {
    if (selectedFilter !== "all" && f.status !== selectedFilter) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Sales Funnels</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>Build, manage, and optimize your conversion funnels</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            <Plus size={16} /> New Funnel
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Revenue", value: `$${(totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, change: "+18.3%" },
            { label: "Total Visitors", value: `${(totalVisitors / 1000).toFixed(1)}K`, icon: Eye, change: "+12.7%" },
            { label: "Conversions", value: totalConversions.toLocaleString(), icon: MousePointerClick, change: "+24.5%" },
            { label: "Active Funnels", value: funnels.filter((f) => f.status === "active").length.toString(), icon: Layers, change: "" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{stat.label}</span>
                <stat.icon size={16} className="text-muted-foreground" />
              </div>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</p>
              {stat.change && <p className="text-green-500 mt-1" style={{ fontSize: 12, fontWeight: 500 }}>{stat.change} vs last month</p>}
            </div>
          ))}
        </div>

        {/* Filter & Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {["all", "active", "paused", "draft"].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-4 py-2 rounded-lg transition-colors ${selectedFilter === f ? "bg-[#2563EB] text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                {f === "all" ? "All Funnels" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search funnels..."
              className="pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
              style={{ fontSize: 13 }}
            />
          </div>
        </div>

        {/* Funnels List */}
        <div className="space-y-4">
          {filteredFunnels.map((funnel) => (
            <div key={funnel.id} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Funnel header */}
              <div
                className="p-5 cursor-pointer hover:bg-accent/20 transition-colors"
                onClick={() => setSelectedFunnel(selectedFunnel?.id === funnel.id ? null : funnel)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                      <Layers size={20} className="text-[#2563EB]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 style={{ fontSize: 16, fontWeight: 600 }}>{funnel.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full ${statusColors[funnel.status].bg} ${statusColors[funnel.status].text}`} style={{ fontSize: 11, fontWeight: 500 }}>
                          {funnel.status.charAt(0).toUpperCase() + funnel.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-muted-foreground" style={{ fontSize: 13 }}>
                        {funnel.steps.length} steps · Created {funnel.createdDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    {funnel.totalVisitors > 0 && (
                      <>
                        <div className="text-right">
                          <p style={{ fontSize: 16, fontWeight: 600 }}>{funnel.totalVisitors.toLocaleString()}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 11 }}>Visitors</p>
                        </div>
                        <div className="text-right">
                          <p style={{ fontSize: 16, fontWeight: 600 }}>{funnel.conversionRate}%</p>
                          <p className="text-muted-foreground" style={{ fontSize: 11 }}>Conv Rate</p>
                        </div>
                        {funnel.revenue > 0 && (
                          <div className="text-right">
                            <p className="text-green-600" style={{ fontSize: 16, fontWeight: 600 }}>${funnel.revenue.toLocaleString()}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 11 }}>Revenue</p>
                          </div>
                        )}
                      </>
                    )}
                    <ChevronRight size={18} className={`text-muted-foreground transition-transform ${selectedFunnel?.id === funnel.id ? "rotate-90" : ""}`} />
                  </div>
                </div>
              </div>

              {/* Expanded funnel steps */}
              {selectedFunnel?.id === funnel.id && (
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={16} className="text-[#2563EB]" />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Funnel Steps & Performance</span>
                  </div>

                  {/* Visual funnel */}
                  <div className="space-y-0">
                    {funnel.steps.map((step, i) => {
                      const Icon = stepIcons[step.type] || Globe;
                      const color = stepColors[step.type] || "#2563EB";
                      const widthPercent = funnel.steps[0].visitors > 0 ? Math.max(30, (step.visitors / funnel.steps[0].visitors) * 100) : 100;

                      return (
                        <div key={step.id}>
                          <div
                            className="flex items-center gap-4 p-3 rounded-xl border border-border bg-accent/20 transition-all hover:bg-accent/40"
                            style={{ width: `${widthPercent}%`, marginLeft: `${(100 - widthPercent) / 2}%` }}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
                              <Icon size={16} style={{ color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p style={{ fontSize: 13, fontWeight: 600 }}>{step.name}</p>
                              <p className="text-muted-foreground" style={{ fontSize: 11 }}>{step.type.charAt(0).toUpperCase() + step.type.slice(1)} page</p>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <div className="text-right">
                                <p style={{ fontSize: 13, fontWeight: 600 }}>{step.visitors.toLocaleString()}</p>
                                <p className="text-muted-foreground" style={{ fontSize: 10 }}>visitors</p>
                              </div>
                              {i > 0 && (
                                <div className="text-right">
                                  <p style={{ fontSize: 13, fontWeight: 600, color }}>{step.conversionRate}%</p>
                                  <p className="text-muted-foreground" style={{ fontSize: 10 }}>conv</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {i < funnel.steps.length - 1 && (
                            <div className="flex justify-center py-1">
                              <ArrowDown size={16} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => toast.info("Opening funnel editor...")}
                      className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      <Edit3 size={14} /> Edit Funnel
                    </button>
                    <button
                      onClick={() => toast.success("Funnel duplicated!")}
                      className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-2"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      <Copy size={14} /> Duplicate
                    </button>
                    <button
                      onClick={() => toast.info("Opening funnel analytics...")}
                      className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-2"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      <BarChart3 size={14} /> Analytics
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Funnel Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Create New Funnel</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Funnel name</label>
                <input placeholder="e.g., Spring Sale Funnel" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
              </div>
              <div>
                <label className="text-foreground mb-3 block" style={{ fontSize: 13, fontWeight: 500 }}>Choose a template</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Product Launch", desc: "Landing → Opt-in → Sales → Checkout", icon: ShoppingCart },
                    { name: "Lead Magnet", desc: "Squeeze → Download", icon: FileText },
                    { name: "Webinar", desc: "Landing → Registration → Confirmation", icon: Globe },
                    { name: "Blank Funnel", desc: "Start from scratch", icon: Layers },
                  ].map((tpl) => (
                    <button
                      key={tpl.name}
                      className="p-4 rounded-xl border border-border hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-all text-left"
                    >
                      <tpl.icon size={20} className="text-[#2563EB] mb-2" />
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{tpl.name}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 11 }}>{tpl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>Cancel</button>
              <button
                onClick={() => { setShowCreate(false); toast.success("Funnel created!", { description: "Start building your funnel steps." }); }}
                className="px-5 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Create Funnel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
