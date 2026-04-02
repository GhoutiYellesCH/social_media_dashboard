import { useState } from "react";
import {
  Link2,
  Copy,
  Plus,
  Trash2,
  ExternalLink,
  BarChart3,
  MousePointerClick,
  Eye,
  TrendingUp,
  Search,
  QrCode,
  Download,
  Clock,
  Globe,
  ChevronDown,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface TrackedLink {
  id: string;
  shortUrl: string;
  originalUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  clicks: number;
  uniqueClicks: number;
  created: string;
  lastClicked: string;
}

const trackedLinks: TrackedLink[] = [
  { id: "1", shortUrl: "sqk.io/spring26", originalUrl: "https://shop.example.com/spring-collection?utm_source=instagram&utm_medium=social&utm_campaign=spring_launch_2026", utmSource: "instagram", utmMedium: "social", utmCampaign: "spring_launch_2026", clicks: 4520, uniqueClicks: 3890, created: "Mar 15, 2026", lastClicked: "2m ago" },
  { id: "2", shortUrl: "sqk.io/webinar4", originalUrl: "https://example.com/webinar-registration?utm_source=linkedin&utm_medium=social&utm_campaign=q2_webinar", utmSource: "linkedin", utmMedium: "social", utmCampaign: "q2_webinar", clicks: 2340, uniqueClicks: 2100, created: "Mar 20, 2026", lastClicked: "15m ago" },
  { id: "3", shortUrl: "sqk.io/blog-ai", originalUrl: "https://blog.example.com/ai-content-guide?utm_source=twitter&utm_medium=social&utm_campaign=blog_promotion", utmSource: "twitter", utmMedium: "social", utmCampaign: "blog_promotion", utmContent: "thread_cta", clicks: 1890, uniqueClicks: 1670, created: "Mar 22, 2026", lastClicked: "1h ago" },
  { id: "4", shortUrl: "sqk.io/deal40", originalUrl: "https://example.com/pricing?utm_source=email&utm_medium=newsletter&utm_campaign=flash_sale", utmSource: "email", utmMedium: "newsletter", utmCampaign: "flash_sale", clicks: 5670, uniqueClicks: 4320, created: "Mar 25, 2026", lastClicked: "5m ago" },
  { id: "5", shortUrl: "sqk.io/ebook", originalUrl: "https://example.com/resources/ebook?utm_source=facebook&utm_medium=ad&utm_campaign=lead_gen_q1", utmSource: "facebook", utmMedium: "ad", utmCampaign: "lead_gen_q1", utmContent: "carousel_ad", clicks: 3210, uniqueClicks: 2890, created: "Feb 10, 2026", lastClicked: "30m ago" },
  { id: "6", shortUrl: "sqk.io/trial", originalUrl: "https://example.com/signup?utm_source=google&utm_medium=cpc&utm_campaign=brand_search", utmSource: "google", utmMedium: "cpc", utmCampaign: "brand_search", clicks: 8900, uniqueClicks: 7200, created: "Jan 5, 2026", lastClicked: "Just now" },
];

export function UtmBuilder() {
  const [activeTab, setActiveTab] = useState<"builder" | "links">("builder");
  const [baseUrl, setBaseUrl] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const totalClicks = trackedLinks.reduce((a, l) => a + l.clicks, 0);
  const totalUnique = trackedLinks.reduce((a, l) => a + l.uniqueClicks, 0);

  const buildUrl = () => {
    if (!baseUrl) return "";
    const params = new URLSearchParams();
    if (utmSource) params.set("utm_source", utmSource);
    if (utmMedium) params.set("utm_medium", utmMedium);
    if (utmCampaign) params.set("utm_campaign", utmCampaign);
    if (utmTerm) params.set("utm_term", utmTerm);
    if (utmContent) params.set("utm_content", utmContent);
    const paramStr = params.toString();
    return paramStr ? `${baseUrl}?${paramStr}` : baseUrl;
  };

  const generatedUrl = buildUrl();

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!");
  };

  const filteredLinks = trackedLinks.filter((l) =>
    !searchQuery || l.shortUrl.includes(searchQuery) || l.utmCampaign.includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>UTM Builder & Link Shortener</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>Create trackable links with UTM parameters and shortened URLs</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick },
            { label: "Unique Clicks", value: totalUnique.toLocaleString(), icon: Eye },
            { label: "Active Links", value: trackedLinks.length.toString(), icon: Link2 },
            { label: "Avg CTR", value: "6.2%", icon: TrendingUp },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</span>
                <s.icon size={16} className="text-muted-foreground" />
              </div>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {([
            { key: "builder", label: "UTM Builder", icon: Link2 },
            { key: "links", label: "Tracked Links", icon: BarChart3 },
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

        {activeTab === "builder" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Builder form */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-border bg-card space-y-4">
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Build Your URL</h3>
                <div>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>
                    Website URL <span className="text-destructive">*</span>
                  </label>
                  <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://example.com/page" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>
                      Source <span className="text-destructive">*</span>
                    </label>
                    <input value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="e.g., instagram" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                    <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>Where traffic comes from</p>
                  </div>
                  <div>
                    <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>
                      Medium <span className="text-destructive">*</span>
                    </label>
                    <input value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} placeholder="e.g., social" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                    <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>Marketing medium</p>
                  </div>
                </div>

                <div>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>
                    Campaign <span className="text-destructive">*</span>
                  </label>
                  <input value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder="e.g., spring_sale_2026" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Term <span className="text-muted-foreground">(optional)</span></label>
                    <input value={utmTerm} onChange={(e) => setUtmTerm(e.target.value)} placeholder="e.g., social_media" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                  </div>
                  <div>
                    <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Content <span className="text-muted-foreground">(optional)</span></label>
                    <input value={utmContent} onChange={(e) => setUtmContent(e.target.value)} placeholder="e.g., cta_button" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Custom short alias</label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground shrink-0" style={{ fontSize: 14 }}>sqk.io/</span>
                    <input value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} placeholder="my-link" className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
                  </div>
                </div>
              </div>

              {/* Quick presets */}
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 600 }}>Quick Presets</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Instagram Bio", s: "instagram", m: "social", c: "bio_link" },
                    { label: "Email Newsletter", s: "email", m: "newsletter", c: "weekly_digest" },
                    { label: "Facebook Ad", s: "facebook", m: "cpc", c: "ad_campaign" },
                    { label: "LinkedIn Post", s: "linkedin", m: "social", c: "organic_post" },
                    { label: "Google Ads", s: "google", m: "cpc", c: "brand_search" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { setUtmSource(preset.s); setUtmMedium(preset.m); setUtmCampaign(preset.c); }}
                      className="px-3 py-1.5 rounded-lg bg-accent text-foreground hover:bg-accent/80 transition-colors"
                      style={{ fontSize: 12, fontWeight: 500 }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 style={{ fontSize: 15, fontWeight: 600 }} className="mb-3">Generated URL</h3>
                {generatedUrl ? (
                  <>
                    <div className="p-3 rounded-lg bg-accent/30 border border-border mb-3 break-all" style={{ fontSize: 13, lineHeight: 1.6 }}>
                      {generatedUrl}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => copyUrl(generatedUrl)} className="flex-1 px-4 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center justify-center gap-2" style={{ fontSize: 13, fontWeight: 600 }}>
                        <Copy size={14} /> Copy Full URL
                      </button>
                      <button onClick={() => { copyUrl(`sqk.io/${customAlias || "abc123"}`); toast.success("Short link created & copied!"); }} className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors flex items-center justify-center gap-2" style={{ fontSize: 13, fontWeight: 500 }}>
                        <Link2 size={14} /> Shorten & Copy
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Link2 size={32} className="mx-auto mb-2 opacity-30" />
                    <p style={{ fontSize: 13 }}>Fill in the fields to generate your tracked URL</p>
                  </div>
                )}
              </div>

              {generatedUrl && (
                <div className="p-5 rounded-xl border border-border bg-card">
                  <h3 style={{ fontSize: 15, fontWeight: 600 }} className="mb-3">UTM Breakdown</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Source", value: utmSource, color: "#2563EB" },
                      { label: "Medium", value: utmMedium, color: "#7C3AED" },
                      { label: "Campaign", value: utmCampaign, color: "#059669" },
                      ...(utmTerm ? [{ label: "Term", value: utmTerm, color: "#EA580C" }] : []),
                      ...(utmContent ? [{ label: "Content", value: utmContent, color: "#DC2626" }] : []),
                    ].map((param) => (
                      <div key={param.label} className="flex items-center gap-3 py-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: param.color }} />
                        <span className="text-muted-foreground w-20 shrink-0" style={{ fontSize: 12 }}>{param.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{param.value || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "links" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search links..." className="pl-8 pr-4 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground" style={{ fontSize: 13 }} />
              </div>
            </div>
            <div className="space-y-3">
              {filteredLinks.map((link) => (
                <div key={link.id} className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link2 size={14} className="text-[#2563EB]" />
                        <span style={{ fontSize: 15, fontWeight: 600 }} className="text-[#2563EB]">{link.shortUrl}</span>
                        <button onClick={() => copyUrl(link.shortUrl)} className="p-1 rounded hover:bg-accent"><Copy size={12} className="text-muted-foreground" /></button>
                      </div>
                      <p className="text-muted-foreground truncate mb-2" style={{ fontSize: 12 }}>{link.originalUrl}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600" style={{ fontSize: 11 }}>source: {link.utmSource}</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600" style={{ fontSize: 11 }}>medium: {link.utmMedium}</span>
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600" style={{ fontSize: 11 }}>campaign: {link.utmCampaign}</span>
                        {link.utmContent && <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600" style={{ fontSize: 11 }}>content: {link.utmContent}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 ml-6">
                      <div className="text-center">
                        <p style={{ fontSize: 18, fontWeight: 700 }}>{link.clicks.toLocaleString()}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11 }}>clicks</p>
                      </div>
                      <div className="text-center">
                        <p style={{ fontSize: 18, fontWeight: 700 }}>{link.uniqueClicks.toLocaleString()}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11 }}>unique</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground" style={{ fontSize: 11 }}>Created {link.created}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11 }}>Last click: {link.lastClicked}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
