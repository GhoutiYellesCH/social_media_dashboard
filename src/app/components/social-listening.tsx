import { useState } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Heart,
  Share2,
  AlertCircle,
  Smile,
  Meh,
  Frown,
  Globe,
  Filter,
  Bell,
  BarChart3,
  Eye,
  Users,
  Hash,
  ArrowUpRight,
  RefreshCw,
  Star,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Mention {
  id: string;
  platform: string;
  platformColor: string;
  author: string;
  avatar: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  engagement: number;
  date: string;
  reach: number;
  type: "mention" | "comment" | "review" | "news";
}

const mentions: Mention[] = [
  { id: "1", platform: "Facebook", platformColor: "#1877F2", author: "Amira Digital", avatar: "", content: "Je viens de passer a @SocialdZ pour notre gestion des reseaux sociaux et c'est un game-changer ! Les fonctionnalites de programmation sont incroyables.", sentiment: "positive", engagement: 234, date: "Il y a 2h", reach: 12400, type: "mention" },
  { id: "2", platform: "Instagram", platformColor: "#E4405F", author: "MarketingDZ", avatar: "", content: "On utilise les analytiques de SocialdZ pour suivre nos campagnes. Les insights sont vraiment detailles et actionnables.", sentiment: "positive", engagement: 567, date: "Il y a 4h", reach: 34200, type: "mention" },
  { id: "3", platform: "LinkedIn", platformColor: "#0A66C2", author: "Tech Review Algerie", avatar: "", content: "Nous avons teste 10 outils de gestion social media pour notre classement 2026. SocialdZ est dans notre top 3 pour les PME algeriennes.", sentiment: "neutral", engagement: 1230, date: "Il y a 6h", reach: 89000, type: "news" },
  { id: "4", platform: "Facebook", platformColor: "#1877F2", author: "Yacine Mesbah", avatar: "", content: "J'ai des difficultes a connecter mon compte Instagram Business a SocialdZ. Le support n'a pas repondu en 2 jours.", sentiment: "negative", engagement: 45, date: "Il y a 8h", reach: 890, type: "comment" },
  { id: "5", platform: "Facebook", platformColor: "#1877F2", author: "StartupDZ Weekly", avatar: "", content: "Nouveau comparatif : SocialdZ vs Buffer vs Hootsuite pour 2026. Lequel est fait pour votre equipe ? Discussion", sentiment: "neutral", engagement: 890, date: "Il y a 12h", reach: 56700, type: "news" },
  { id: "6", platform: "Instagram", platformColor: "#E4405F", author: "Agence Creative Oran", avatar: "", content: "Notre equipe adore les suggestions de contenu IA de SocialdZ ! Le systeme de tokens est super flexible", sentiment: "positive", engagement: 345, date: "Hier", reach: 18900, type: "mention" },
  { id: "7", platform: "Facebook", platformColor: "#1877F2", author: "Digital Hub Constantine", avatar: "", content: "SocialdZ est devenu un outil essentiel pour notre equipe marketing. Les fonctionnalites de collaboration sont top !", sentiment: "positive", engagement: 678, date: "Hier", reach: 23400, type: "review" },
  { id: "8", platform: "Facebook", platformColor: "#1877F2", author: "SaaS Critique DZ", avatar: "", content: "Le prix des tokens de SocialdZ reste tres competitif par rapport aux concurrents internationaux. Bon rapport qualite-prix.", sentiment: "positive", engagement: 123, date: "Hier", reach: 7800, type: "mention" },
];

const sentimentConfig = {
  positive: { icon: Smile, color: "text-green-500", bg: "bg-green-500/10", label: "Positive" },
  neutral: { icon: Meh, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Neutral" },
  negative: { icon: Frown, color: "text-red-500", bg: "bg-red-500/10", label: "Negative" },
};

const competitors = [
  { name: "SocialdZ", mentions: 1245, sentiment: 78, share: 34 },
  { name: "Buffer", mentions: 890, sentiment: 72, share: 24 },
  { name: "Hootsuite", mentions: 1120, sentiment: 65, share: 30 },
  { name: "Sprout Social", mentions: 445, sentiment: 81, share: 12 },
];

export function SocialListening() {
  const [activeTab, setActiveTab] = useState<"mentions" | "sentiment" | "competitors" | "alerts">("mentions");
  const [filterSentiment, setFilterSentiment] = useState<"all" | "positive" | "neutral" | "negative">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mentions.filter((m) => {
    if (filterSentiment !== "all" && m.sentiment !== filterSentiment) return false;
    if (searchQuery && !m.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const positive = mentions.filter((m) => m.sentiment === "positive").length;
  const neutral = mentions.filter((m) => m.sentiment === "neutral").length;
  const negative = mentions.filter((m) => m.sentiment === "negative").length;
  const totalReach = mentions.reduce((a, m) => a + m.reach, 0);

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Social Listening</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>Monitor brand mentions, sentiment, and competitor activity</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toast.success("Refreshed!")} className="px-4 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors flex items-center gap-2" style={{ fontSize: 13, fontWeight: 500 }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={() => toast.info("Alert settings opened")} className="px-4 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2" style={{ fontSize: 13, fontWeight: 600 }}>
              <Bell size={14} /> Set Alerts
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Mentions", value: mentions.length.toString(), icon: MessageCircle, sub: "Last 7 days" },
            { label: "Total Reach", value: `${(totalReach / 1000).toFixed(0)}K`, icon: Eye, sub: "+22% vs last week" },
            { label: "Positive", value: positive.toString(), icon: Smile, sub: `${Math.round((positive / mentions.length) * 100)}%`, color: "text-green-500" },
            { label: "Neutral", value: neutral.toString(), icon: Meh, sub: `${Math.round((neutral / mentions.length) * 100)}%`, color: "text-yellow-500" },
            { label: "Negative", value: negative.toString(), icon: Frown, sub: `${Math.round((negative / mentions.length) * 100)}%`, color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</span>
                <s.icon size={16} className={("color" in s && s.color) || "text-muted-foreground"} />
              </div>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Sentiment bar */}
        <div className="p-4 rounded-xl border border-border bg-card mb-6">
          <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 600 }}>Overall Sentiment Distribution</p>
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
            <div className="bg-green-500 rounded-l-full transition-all" style={{ width: `${(positive / mentions.length) * 100}%` }} />
            <div className="bg-yellow-400 transition-all" style={{ width: `${(neutral / mentions.length) * 100}%` }} />
            <div className="bg-red-500 rounded-r-full transition-all" style={{ width: `${(negative / mentions.length) * 100}%` }} />
          </div>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-green-500" style={{ fontSize: 12 }}><Smile size={12} /> {Math.round((positive / mentions.length) * 100)}% Positive</span>
            <span className="flex items-center gap-1 text-yellow-500" style={{ fontSize: 12 }}><Meh size={12} /> {Math.round((neutral / mentions.length) * 100)}% Neutral</span>
            <span className="flex items-center gap-1 text-red-500" style={{ fontSize: 12 }}><Frown size={12} /> {Math.round((negative / mentions.length) * 100)}% Negative</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {([
            { key: "mentions", label: "Mentions Feed", icon: MessageCircle },
            { key: "competitors", label: "Competitor Tracking", icon: Users },
            { key: "alerts", label: "Keyword Alerts", icon: Bell },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.key ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "mentions" && (
          <>
            <div className="flex items-center gap-2 mb-4">
              {(["all", "positive", "neutral", "negative"] as const).map((f) => (
                <button key={f} onClick={() => setFilterSentiment(f)} className={`px-3 py-1.5 rounded-lg transition-colors ${filterSentiment === f ? "bg-[#2563EB] text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`} style={{ fontSize: 12, fontWeight: 500 }}>
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <div className="relative ml-auto">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search mentions..." className="pl-8 pr-4 py-1.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground" style={{ fontSize: 12 }} />
              </div>
            </div>
            <div className="space-y-3">
              {filtered.map((m) => {
                const S = sentimentConfig[m.sentiment];
                return (
                  <div key={m.id} className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: m.platformColor + "15" }}>
                        <span style={{ color: m.platformColor, fontSize: 14, fontWeight: 700 }}>{m.platform[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{m.author}</span>
                          <span className="text-muted-foreground" style={{ fontSize: 12 }}>on {m.platform}</span>
                          <span className={`px-2 py-0.5 rounded-full ${S.bg} ${S.color}`} style={{ fontSize: 10, fontWeight: 500 }}>{S.label}</span>
                          <span className="text-muted-foreground ml-auto" style={{ fontSize: 12 }}>{m.date}</span>
                        </div>
                        <p style={{ fontSize: 13, lineHeight: 1.6 }} className="mb-2">{m.content}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: 11 }}><Heart size={12} /> {m.engagement}</span>
                          <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: 11 }}><Eye size={12} /> {m.reach.toLocaleString()} reach</span>
                          <span className={`px-2 py-0.5 rounded-full bg-accent text-muted-foreground`} style={{ fontSize: 10 }}>{m.type}</span>
                          <button className="ml-auto text-[#2563EB] hover:underline" style={{ fontSize: 12 }} onClick={() => toast.info("Opening reply...")}>Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "competitors" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-accent/30">
                    {["Brand", "Mentions (7d)", "Sentiment Score", "Share of Voice", "Trend"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((c, i) => (
                    <tr key={c.name} className="border-b border-border last:border-0 hover:bg-accent/20">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {i === 0 && <Star size={14} className="text-yellow-500" />}
                          <span style={{ fontSize: 14, fontWeight: i === 0 ? 600 : 400 }}>{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ fontSize: 14 }}>{c.mentions.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-accent rounded-full">
                            <div className={`h-full rounded-full ${c.sentiment > 75 ? "bg-green-500" : c.sentiment > 60 ? "bg-yellow-400" : "bg-red-500"}`} style={{ width: `${c.sentiment}%` }} />
                          </div>
                          <span style={{ fontSize: 13 }}>{c.sentiment}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ fontSize: 14, fontWeight: 600 }}>{c.share}%</td>
                      <td className="px-4 py-3"><TrendingUp size={16} className="text-green-500" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-4">
            {[
              { keyword: "SocialQ", active: true, mentions: 45, lastTriggered: "2h ago" },
              { keyword: "socialq review", active: true, mentions: 12, lastTriggered: "6h ago" },
              { keyword: "social media management tool", active: true, mentions: 89, lastTriggered: "1h ago" },
              { keyword: "@socialq complaint", active: true, mentions: 3, lastTriggered: "1d ago" },
              { keyword: "socialq vs buffer", active: false, mentions: 8, lastTriggered: "3d ago" },
            ].map((alert) => (
              <div key={alert.keyword} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                    <Hash size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>"{alert.keyword}"</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>{alert.mentions} mentions · Last triggered {alert.lastTriggered}</p>
                  </div>
                </div>
                <button onClick={() => toast.success("Alert toggled!")} className={`w-10 h-5.5 rounded-full relative transition-colors ${alert.active ? "bg-[#2563EB]" : "bg-switch-background"}`}>
                  <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${alert.active ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
            <button onClick={() => toast.info("Add keyword alert")} className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-[#2563EB]/50 text-muted-foreground hover:text-[#2563EB] transition-colors text-center" style={{ fontSize: 13, fontWeight: 500 }}>
              + Add Keyword Alert
            </button>
          </div>
        )}
      </div>
    </main>
  );
}