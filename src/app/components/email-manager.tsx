import { useState } from "react";
import {
  Plus,
  Search,
  Mail,
  Users,
  TrendingUp,
  MousePointerClick,
  Send,
  Eye,
  Clock,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Tag,
  Filter,
  Download,
  Upload,
  X,
  UserPlus,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useTokens } from "./token-context";

interface EmailList {
  id: string;
  name: string;
  subscribers: number;
  growth: number;
  openRate: number;
  unsubRate: number;
  tags: string[];
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: "sent" | "draft" | "scheduled" | "sending";
  list: string;
  sent: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
  date: string;
}

const emailLists: EmailList[] = [
  { id: "1", name: "All Subscribers", subscribers: 12450, growth: 3.2, openRate: 28.5, unsubRate: 0.4, tags: ["main"] },
  { id: "2", name: "Product Updates", subscribers: 8920, growth: 5.1, openRate: 34.2, unsubRate: 0.2, tags: ["product"] },
  { id: "3", name: "Weekly Newsletter", subscribers: 6780, growth: 2.8, openRate: 42.1, unsubRate: 0.5, tags: ["newsletter"] },
  { id: "4", name: "Leads - Top of Funnel", subscribers: 3450, growth: 8.4, openRate: 22.3, unsubRate: 0.8, tags: ["leads", "tofu"] },
  { id: "5", name: "VIP Customers", subscribers: 1230, growth: 1.5, openRate: 56.7, unsubRate: 0.1, tags: ["vip", "customers"] },
  { id: "6", name: "Webinar Registrants", subscribers: 2100, growth: 12.3, openRate: 38.9, unsubRate: 0.3, tags: ["webinar", "event"] },
];

const emailCampaigns: EmailCampaign[] = [
  { id: "1", name: "March Newsletter", subject: "Nouveautes SocialdZ - Edition Mars", status: "sent", list: "Weekly Newsletter", sent: 6780, opened: 2854, clicked: 892, openRate: 42.1, clickRate: 13.2, date: "28 Mar 2026" },
  { id: "2", name: "Lancement Tokens IA", subject: "Decouvrez notre systeme de tokens IA !", status: "sent", list: "Product Updates", sent: 8920, opened: 3051, clicked: 1245, openRate: 34.2, clickRate: 14.0, date: "22 Mar 2026" },
  { id: "3", name: "Sequence Bienvenue - Jour 1", subject: "Bienvenue sur SocialdZ ! Voici comment demarrer", status: "sent", list: "All Subscribers", sent: 1200, opened: 780, clicked: 456, openRate: 65.0, clickRate: 38.0, date: "Automatise" },
  { id: "4", name: "Newsletter Avril", subject: "Insights Avril + Nouvelles Fonctionnalites", status: "scheduled", list: "Weekly Newsletter", sent: 0, opened: 0, clicked: 0, openRate: 0, clickRate: 0, date: "5 Avr 2026" },
  { id: "5", name: "Campagne Re-engagement", subject: "Vous nous manquez ! -20% pour revenir", status: "draft", list: "All Subscribers", sent: 0, opened: 0, clicked: 0, openRate: 0, clickRate: 0, date: "-" },
  { id: "6", name: "Preview Exclusive VIP", subject: "Invitation : Acces anticipe a notre nouvelle fonctionnalite", status: "sent", list: "VIP Customers", sent: 1230, opened: 697, clicked: 312, openRate: 56.7, clickRate: 25.4, date: "18 Mar 2026" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  sent: { bg: "bg-green-500/10", text: "text-green-600" },
  draft: { bg: "bg-gray-500/10", text: "text-gray-500" },
  scheduled: { bg: "bg-blue-500/10", text: "text-blue-600" },
  sending: { bg: "bg-yellow-500/10", text: "text-yellow-600" },
};

export function EmailManager() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "lists" | "automations">("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const { consumeTokens } = useTokens();
  const [showCompose, setShowCompose] = useState(false);
  const [showAddSubscribers, setShowAddSubscribers] = useState(false);

  const totalSubscribers = emailLists.reduce((a, l) => a + l.subscribers, 0);
  const avgOpenRate = emailCampaigns.filter((c) => c.status === "sent").reduce((a, c) => a + c.openRate, 0) / emailCampaigns.filter((c) => c.status === "sent").length;

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Email Marketing</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>Manage lists, create campaigns, and automate your email marketing</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddSubscribers(true)}
              className="px-4 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors flex items-center gap-2"
              style={{ fontSize: 14, fontWeight: 500 }}
            >
              <UserPlus size={16} /> Add Subscribers
            </button>
            <button
              onClick={() => setShowCompose(true)}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              <Mail size={16} /> New Campaign
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Subscribers", value: totalSubscribers.toLocaleString(), icon: Users, change: "+4.2%" },
            { label: "Avg Open Rate", value: `${avgOpenRate.toFixed(1)}%`, icon: Eye, change: "+2.1%" },
            { label: "Campaigns Sent", value: emailCampaigns.filter((c) => c.status === "sent").length.toString(), icon: Send, change: "This month" },
            { label: "Click-through Rate", value: "18.4%", icon: MousePointerClick, change: "+3.8%" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{stat.label}</span>
                <stat.icon size={16} className="text-muted-foreground" />
              </div>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</p>
              <p className="text-green-500 mt-1" style={{ fontSize: 12, fontWeight: 500 }}>{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {[
            { key: "campaigns", label: "Campaigns", icon: Send },
            { key: "lists", label: "Email Lists", icon: Users },
            { key: "automations", label: "Automations", icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.key ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              style={{ fontSize: 14, fontWeight: 500 }}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div className="space-y-3">
            {emailCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 style={{ fontSize: 15, fontWeight: 600 }}>{campaign.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full ${statusColors[campaign.status].bg} ${statusColors[campaign.status].text}`} style={{ fontSize: 11, fontWeight: 500 }}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate" style={{ fontSize: 13 }}>{campaign.subject}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>To: {campaign.list}</span>
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>{campaign.date}</span>
                    </div>
                  </div>
                  {campaign.status === "sent" && (
                    <div className="flex items-center gap-6 shrink-0 ml-6">
                      <div className="text-center">
                        <p style={{ fontSize: 16, fontWeight: 600 }}>{campaign.openRate}%</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11 }}>Opens</p>
                      </div>
                      <div className="text-center">
                        <p style={{ fontSize: 16, fontWeight: 600 }}>{campaign.clickRate}%</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11 }}>Clicks</p>
                      </div>
                      <div className="text-center">
                        <p style={{ fontSize: 16, fontWeight: 600 }}>{campaign.sent.toLocaleString()}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11 }}>Sent</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lists Tab */}
        {activeTab === "lists" && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-accent/30">
                  {["List Name", "Subscribers", "Growth", "Open Rate", "Unsub Rate", "Tags", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {emailLists.map((list) => (
                  <tr key={list.id} className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3">
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{list.name}</p>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 14 }}>{list.subscribers.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="text-green-500 flex items-center gap-1" style={{ fontSize: 13 }}>
                        <TrendingUp size={12} /> +{list.growth}%
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 13 }}>{list.openRate}%</td>
                    <td className="px-4 py-3" style={{ fontSize: 13 }}>{list.unsubRate}%</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {list.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-accent text-muted-foreground" style={{ fontSize: 11 }}>{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 rounded hover:bg-accent"><MoreHorizontal size={16} className="text-muted-foreground" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Automations Tab */}
        {activeTab === "automations" && (
          <div className="space-y-3">
            {[
              { name: "Welcome Sequence", trigger: "New subscriber joins", emails: 5, active: true, sent: 1200, openRate: 65.0 },
              { name: "Abandoned Cart Recovery", trigger: "Cart abandoned for 1 hour", emails: 3, active: true, sent: 890, openRate: 45.2 },
              { name: "Post-Purchase Follow-up", trigger: "After purchase", emails: 4, active: true, sent: 560, openRate: 52.8 },
              { name: "Re-engagement Series", trigger: "Inactive for 30 days", emails: 3, active: false, sent: 340, openRate: 18.5 },
              { name: "Birthday Campaign", trigger: "Subscriber birthday", emails: 1, active: true, sent: 120, openRate: 72.3 },
            ].map((auto) => (
              <div key={auto.name} className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 style={{ fontSize: 15, fontWeight: 600 }}>{auto.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full ${auto.active ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-500"}`} style={{ fontSize: 11, fontWeight: 500 }}>
                        {auto.active ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Trigger: {auto.trigger} · {auto.emails} emails in sequence</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p style={{ fontSize: 16, fontWeight: 600 }}>{auto.sent}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 11 }}>Sent</p>
                    </div>
                    <div className="text-center">
                      <p style={{ fontSize: 16, fontWeight: 600 }}>{auto.openRate}%</p>
                      <p className="text-muted-foreground" style={{ fontSize: 11 }}>Open Rate</p>
                    </div>
                    <button
                      onClick={() => toast.success(`Automation ${auto.active ? "paused" : "activated"}!`)}
                      className={`w-10 h-5.5 rounded-full relative transition-colors ${auto.active ? "bg-[#2563EB]" : "bg-switch-background"}`}
                    >
                      <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${auto.active ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCompose(false)}>
          <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>New Email Campaign</h2>
              <button onClick={() => setShowCompose(false)} className="p-1 rounded-lg hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Campaign name</label>
                <input placeholder="e.g., April Newsletter" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Subject line</label>
                <input placeholder="Your email subject..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Send to list</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 14 }}>
                  {emailLists.map((l) => (
                    <option key={l.id}>{l.name} ({l.subscribers.toLocaleString()} subscribers)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Preview text</label>
                <input placeholder="Text shown after subject in inbox..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button onClick={() => setShowCompose(false)} className="px-5 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>Cancel</button>
              <button
                onClick={() => { setShowCompose(false); toast.success("Campaign created!", { description: "Continue in the email editor to design your content." }); }}
                className="px-5 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Create & Design
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscribers Modal */}
      {showAddSubscribers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddSubscribers(false)}>
          <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Add Subscribers</h2>
              <button onClick={() => setShowAddSubscribers(false)} className="p-1 rounded-lg hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Add to list</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 14 }}>
                  {emailLists.map((l) => <option key={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Email addresses</label>
                <textarea placeholder="Enter emails, one per line..." rows={5} className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 resize-none" style={{ fontSize: 14 }} />
              </div>
              <div className="text-center py-4 border-2 border-dashed border-border rounded-xl hover:border-[#2563EB]/50 transition-colors cursor-pointer">
                <Upload size={20} className="mx-auto text-muted-foreground mb-1" />
                <p style={{ fontSize: 13, fontWeight: 500 }}>Upload CSV file</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>Columns: email, name (optional)</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button onClick={() => setShowAddSubscribers(false)} className="px-5 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>Cancel</button>
              <button
                onClick={() => { setShowAddSubscribers(false); toast.success("Subscribers added!"); }}
                className="px-5 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Add Subscribers
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}