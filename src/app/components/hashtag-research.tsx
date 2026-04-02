import { useState } from "react";
import {
  Search,
  Hash,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Copy,
  Plus,
  Star,
  Bookmark,
  Globe,
  ArrowUpRight,
  Filter,
  Zap,
  Eye,
  Users,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface Hashtag {
  id: string;
  tag: string;
  posts: number;
  avgEngagement: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  difficulty: "easy" | "medium" | "hard";
  platforms: string[];
  saved: boolean;
  category: string;
}

const hashtags: Hashtag[] = [
  { id: "1", tag: "#SocialMediaMarketing", posts: 12400000, avgEngagement: 3.2, trend: "up", trendPercent: 12, difficulty: "hard", platforms: ["Instagram", "LinkedIn", "X"], saved: true, category: "Marketing" },
  { id: "2", tag: "#ContentCreator", posts: 8900000, avgEngagement: 4.1, trend: "up", trendPercent: 18, difficulty: "hard", platforms: ["Instagram", "TikTok"], saved: false, category: "Creator" },
  { id: "3", tag: "#DigitalMarketing", posts: 15200000, avgEngagement: 2.8, trend: "stable", trendPercent: 2, difficulty: "hard", platforms: ["Instagram", "LinkedIn", "X"], saved: true, category: "Marketing" },
  { id: "4", tag: "#SmallBusinessTips", posts: 2100000, avgEngagement: 5.4, trend: "up", trendPercent: 24, difficulty: "medium", platforms: ["Instagram", "X"], saved: false, category: "Business" },
  { id: "5", tag: "#MarketingStrategy", posts: 4500000, avgEngagement: 3.8, trend: "up", trendPercent: 15, difficulty: "medium", platforms: ["LinkedIn", "X"], saved: true, category: "Marketing" },
  { id: "6", tag: "#SocialMediaTips", posts: 6700000, avgEngagement: 4.5, trend: "up", trendPercent: 20, difficulty: "medium", platforms: ["Instagram", "X", "TikTok"], saved: false, category: "Marketing" },
  { id: "7", tag: "#BrandBuilding", posts: 1800000, avgEngagement: 5.1, trend: "up", trendPercent: 30, difficulty: "easy", platforms: ["LinkedIn", "Instagram"], saved: false, category: "Branding" },
  { id: "8", tag: "#InfluencerMarketing", posts: 3200000, avgEngagement: 3.5, trend: "down", trendPercent: -5, difficulty: "medium", platforms: ["Instagram", "TikTok"], saved: false, category: "Marketing" },
  { id: "9", tag: "#GrowthHacking", posts: 980000, avgEngagement: 6.2, trend: "up", trendPercent: 35, difficulty: "easy", platforms: ["X", "LinkedIn"], saved: true, category: "Growth" },
  { id: "10", tag: "#VideoMarketing", posts: 2800000, avgEngagement: 4.8, trend: "up", trendPercent: 22, difficulty: "medium", platforms: ["Instagram", "TikTok", "YouTube"], saved: false, category: "Video" },
  { id: "11", tag: "#B2BMarketing", posts: 1200000, avgEngagement: 3.9, trend: "stable", trendPercent: 3, difficulty: "easy", platforms: ["LinkedIn"], saved: false, category: "Marketing" },
  { id: "12", tag: "#ContentMarketing", posts: 7800000, avgEngagement: 3.1, trend: "down", trendPercent: -8, difficulty: "hard", platforms: ["LinkedIn", "X"], saved: false, category: "Marketing" },
];

const trendingNow = [
  { tag: "#AIMarketing", growth: "+145%", posts: "234K" },
  { tag: "#ThreadsApp", growth: "+89%", posts: "567K" },
  { tag: "#CreatorEconomy", growth: "+67%", posts: "890K" },
  { tag: "#PersonalBranding", growth: "+54%", posts: "1.2M" },
  { tag: "#SocialCommerce", growth: "+48%", posts: "345K" },
];

const difficultyColors = {
  easy: { bg: "bg-green-500/10", text: "text-green-600" },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-600" },
  hard: { bg: "bg-red-500/10", text: "text-red-600" },
};

export function HashtagResearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState<"posts" | "engagement" | "trend">("trend");
  const [hashtagList, setHashtagList] = useState(hashtags);
  const [activeTab, setActiveTab] = useState<"research" | "saved" | "generator">("research");

  const filtered = hashtagList
    .filter((h) => {
      if (searchQuery && !h.tag.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedPlatform !== "all" && !h.platforms.includes(selectedPlatform)) return false;
      if (activeTab === "saved" && !h.saved) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "posts") return b.posts - a.posts;
      if (sortBy === "engagement") return b.avgEngagement - a.avgEngagement;
      return b.trendPercent - a.trendPercent;
    });

  const toggleSave = (id: string) => {
    setHashtagList((prev) => prev.map((h) => h.id === id ? { ...h, saved: !h.saved } : h));
    const h = hashtagList.find((h) => h.id === id);
    toast.success(h?.saved ? "Removed from saved" : "Saved to collection!");
  };

  const copyHashtags = () => {
    const saved = hashtagList.filter((h) => h.saved).map((h) => h.tag).join(" ");
    navigator.clipboard.writeText(saved);
    toast.success("Hashtags copied to clipboard!");
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Hashtag Research</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>Discover trending hashtags, analyze performance, and build your strategy</p>
          </div>
          <button onClick={copyHashtags} className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2" style={{ fontSize: 14, fontWeight: 600 }}>
            <Copy size={16} /> Copy Saved ({hashtagList.filter((h) => h.saved).length})
          </button>
        </div>

        {/* Trending Now */}
        <div className="p-4 rounded-xl border border-border bg-card mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-[#2563EB]" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Trending Right Now</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {trendingNow.map((t) => (
              <div key={t.tag} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent shrink-0 hover:bg-accent/80 cursor-pointer transition-colors">
                <Hash size={14} className="text-[#2563EB]" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{t.tag}</span>
                <span className="text-green-500" style={{ fontSize: 11, fontWeight: 600 }}>{t.growth}</span>
                <span className="text-muted-foreground" style={{ fontSize: 11 }}>{t.posts} posts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {([
            { key: "research", label: "Research", icon: Search },
            { key: "saved", label: `Saved (${hashtagList.filter((h) => h.saved).length})`, icon: Bookmark },
            { key: "generator", label: "AI Generator", icon: Sparkles },
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

        {(activeTab === "research" || activeTab === "saved") && (
          <>
            {/* Filters */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search hashtags..." className="w-full pl-8 pr-4 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground" style={{ fontSize: 13 }} />
              </div>
              <div className="flex items-center gap-2">
                {["all", "Instagram", "LinkedIn", "X", "TikTok"].map((p) => (
                  <button key={p} onClick={() => setSelectedPlatform(p)} className={`px-3 py-1.5 rounded-lg transition-colors ${selectedPlatform === p ? "bg-[#2563EB] text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`} style={{ fontSize: 12, fontWeight: 500 }}>
                    {p === "all" ? "All" : p}
                  </button>
                ))}
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 12 }}>
                <option value="trend">Sort: Trending</option>
                <option value="engagement">Sort: Engagement</option>
                <option value="posts">Sort: Volume</option>
              </select>
            </div>

            {/* Hashtag list */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-accent/30">
                    {["Hashtag", "Volume", "Avg Engagement", "Trend", "Difficulty", "Platforms", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((h) => {
                    const D = difficultyColors[h.difficulty];
                    return (
                      <tr key={h.id} className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Hash size={14} className="text-[#2563EB]" />
                            <span style={{ fontSize: 14, fontWeight: 600 }}>{h.tag}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3" style={{ fontSize: 13 }}>
                          {h.posts >= 1000000 ? `${(h.posts / 1000000).toFixed(1)}M` : `${(h.posts / 1000).toFixed(0)}K`}
                        </td>
                        <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600 }}>{h.avgEngagement}%</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {h.trend === "up" ? <TrendingUp size={14} className="text-green-500" /> : h.trend === "down" ? <TrendingDown size={14} className="text-red-500" /> : <span className="text-yellow-500">—</span>}
                            <span className={h.trendPercent > 0 ? "text-green-500" : h.trendPercent < 0 ? "text-red-500" : "text-yellow-500"} style={{ fontSize: 12, fontWeight: 600 }}>
                              {h.trendPercent > 0 ? "+" : ""}{h.trendPercent}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full ${D.bg} ${D.text}`} style={{ fontSize: 11, fontWeight: 500 }}>
                            {h.difficulty.charAt(0).toUpperCase() + h.difficulty.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {h.platforms.map((p) => (
                              <span key={p} className="px-2 py-0.5 rounded-full bg-accent text-muted-foreground" style={{ fontSize: 10 }}>{p}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleSave(h.id)} className={`p-1.5 rounded-lg transition-colors ${h.saved ? "text-[#2563EB] bg-[#2563EB]/10" : "text-muted-foreground hover:text-[#2563EB] hover:bg-[#2563EB]/5"}`}>
                            <Bookmark size={14} fill={h.saved ? "currentColor" : "none"} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "generator" && (
          <div className="max-w-2xl">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-[#2563EB]" />
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>AI Hashtag Generator</h3>
              </div>
              <p className="text-muted-foreground mb-4" style={{ fontSize: 13 }}>Describe your post content and we'll suggest the best hashtags for maximum reach and engagement.</p>
              <textarea placeholder="Describe your post content... e.g., 'Behind the scenes of our product photoshoot for spring collection'" rows={4} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 resize-none mb-3" style={{ fontSize: 14 }} />
              <div className="flex items-center gap-3 mb-4">
                <select className="px-3 py-2 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 13 }}>
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>X</option>
                  <option>TikTok</option>
                </select>
                <select className="px-3 py-2 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 13 }}>
                  <option>Mix of reach & niche</option>
                  <option>High reach only</option>
                  <option>Niche only</option>
                </select>
                <button onClick={() => toast.success("Hashtags generated!")} className="px-5 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2" style={{ fontSize: 13, fontWeight: 600 }}>
                  <Sparkles size={14} /> Generate
                </button>
              </div>

              {/* Sample results */}
              <div className="p-4 rounded-xl bg-accent/30 border border-border">
                <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 600 }}>Suggested Hashtags (30)</p>
                <div className="flex flex-wrap gap-2">
                  {["#BehindTheScenes", "#ProductPhotography", "#SpringCollection", "#BrandPhotoshoot", "#ContentCreation", "#StudioLife", "#CreativeProcess", "#PhotoshootDay", "#NewCollection", "#FashionBrand", "#ProductLaunch", "#CreativeDirection", "#BTS", "#StyleInspiration", "#ShopNow"].map((tag) => (
                    <button key={tag} onClick={() => toast.success(`${tag} saved!`)} className="px-3 py-1.5 rounded-full bg-card border border-border hover:border-[#2563EB] hover:text-[#2563EB] transition-colors" style={{ fontSize: 12 }}>
                      {tag}
                    </button>
                  ))}
                </div>
                <button onClick={copyHashtags} className="mt-3 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-2" style={{ fontSize: 12, fontWeight: 500 }}>
                  <Copy size={12} /> Copy All Hashtags
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
