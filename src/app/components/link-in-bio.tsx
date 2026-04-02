import { useState } from "react";
import {
  Plus,
  GripVertical,
  ExternalLink,
  Eye,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Palette,
  Type,
  Share2,
  Copy,
  X,
  ChevronUp,
  ChevronDown,
  Globe,
  Instagram,
  Youtube,
  Twitter,
  Smartphone,
  Monitor,
  Link2,
  BarChart3,
  MousePointerClick,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LinkBlock {
  id: string;
  title: string;
  url: string;
  icon?: string;
  clicks: number;
  enabled: boolean;
  style?: "default" | "featured" | "outline";
}

const initialLinks: LinkBlock[] = [
  { id: "1", title: "Shop Our New Collection", url: "https://shop.example.com", clicks: 2340, enabled: true, style: "featured" },
  { id: "2", title: "Latest Blog Post", url: "https://blog.example.com/latest", clicks: 1890, enabled: true, style: "default" },
  { id: "3", title: "Book a Free Consultation", url: "https://calendly.com/example", clicks: 1245, enabled: true, style: "default" },
  { id: "4", title: "Watch Our YouTube Channel", url: "https://youtube.com/@example", clicks: 980, enabled: true, style: "default" },
  { id: "5", title: "Download Free Guide", url: "https://example.com/guide", clicks: 756, enabled: true, style: "outline" },
  { id: "6", title: "Join Our Community", url: "https://discord.gg/example", clicks: 543, enabled: false, style: "default" },
];

const themes = [
  { id: "minimal", name: "Minimal", bg: "bg-white", text: "text-gray-900", btn: "bg-gray-900 text-white", accent: "#111" },
  { id: "ocean", name: "Ocean", bg: "bg-gradient-to-b from-blue-500 to-cyan-400", text: "text-white", btn: "bg-white/20 text-white backdrop-blur", accent: "#3B82F6" },
  { id: "sunset", name: "Sunset", bg: "bg-gradient-to-b from-orange-400 to-pink-500", text: "text-white", btn: "bg-white/20 text-white backdrop-blur", accent: "#F97316" },
  { id: "dark", name: "Dark", bg: "bg-gray-950", text: "text-white", btn: "bg-gray-800 text-white", accent: "#6366F1" },
  { id: "forest", name: "Forest", bg: "bg-gradient-to-b from-green-700 to-emerald-500", text: "text-white", btn: "bg-white/20 text-white backdrop-blur", accent: "#22C55E" },
  { id: "lavender", name: "Lavender", bg: "bg-gradient-to-b from-purple-400 to-indigo-500", text: "text-white", btn: "bg-white/20 text-white backdrop-blur", accent: "#8B5CF6" },
];

export function LinkInBio() {
  const [links, setLinks] = useState<LinkBlock[]>(initialLinks);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [bioName, setBioName] = useState("Acme DZ");
  const [bioHandle, setBioHandle] = useState("@acmedz");
  const [bioDescription, setBioDescription] = useState("Solutions digitales pour les entreprises algeriennes");
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [showAddLink, setShowAddLink] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"links" | "appearance" | "analytics">("links");

  const totalClicks = links.reduce((a, l) => a + l.clicks, 0);

  const moveLink = (id: string, direction: "up" | "down") => {
    const idx = links.findIndex((l) => l.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === links.length - 1)) return;
    const newLinks = [...links];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newLinks[idx], newLinks[swapIdx]] = [newLinks[swapIdx], newLinks[idx]];
    setLinks(newLinks);
  };

  const toggleLink = (id: string) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  };

  const deleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success("Link removed");
  };

  const addLink = () => {
    if (!newTitle || !newUrl) return;
    setLinks((prev) => [...prev, { id: String(Date.now()), title: newTitle, url: newUrl, clicks: 0, enabled: true, style: "default" }]);
    setNewTitle("");
    setNewUrl("");
    setShowAddLink(false);
    toast.success("Link added!");
  };

  return (
    <main className="flex-1 h-screen overflow-hidden bg-background flex">
      {/* Left: Editor */}
      <div className="flex-1 overflow-y-auto border-r border-border">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700 }}>Link-in-Bio</h1>
              <p className="text-muted-foreground mt-1" style={{ fontSize: 13 }}>Customize your bio link page</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText("https://socialdz.bio/acmedz");
                  toast.success("Lien copie dans le presse-papiers !");
                }}
                className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-2"
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                <Copy size={14} /> Copy Link
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
                style={{ fontSize: 13, fontWeight: 600 }}
                onClick={() => toast.success("Page published!")}
              >
                <Globe size={14} /> Publish
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Clicks", value: totalClicks.toLocaleString() },
              { label: "Active Links", value: links.filter((l) => l.enabled).length },
              { label: "CTR", value: "4.8%" },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl border border-border bg-card text-center">
                <p className="text-muted-foreground" style={{ fontSize: 11, fontWeight: 500 }}>{s.label}</p>
                <p style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-border">
            {(["links", "appearance", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 border-b-2 transition-colors ${activeTab === tab ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "links" && (
            <>
              {/* Profile edit */}
              <div className="p-4 rounded-xl border border-border bg-card mb-4">
                <p style={{ fontSize: 13, fontWeight: 600 }} className="mb-3">Profile</p>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzc1MDcxMjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input value={bioName} onChange={(e) => setBioName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 13 }} />
                    <input value={bioHandle} onChange={(e) => setBioHandle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-muted-foreground" style={{ fontSize: 13 }} />
                  </div>
                </div>
                <textarea
                  value={bioDescription}
                  onChange={(e) => setBioDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground resize-none"
                  style={{ fontSize: 13 }}
                />
              </div>

              {/* Links */}
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontSize: 13, fontWeight: 600 }}>Links ({links.length})</p>
                <button onClick={() => setShowAddLink(true)} className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 600 }}>
                  <Plus size={14} /> Add Link
                </button>
              </div>

              {showAddLink && (
                <div className="p-4 rounded-xl border-2 border-[#2563EB]/30 bg-[#2563EB]/5 mb-3 space-y-2">
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Link title" className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground" style={{ fontSize: 13 }} />
                  <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground" style={{ fontSize: 13 }} />
                  <div className="flex gap-2">
                    <button onClick={addLink} className="px-4 py-2 rounded-lg bg-[#2563EB] text-white" style={{ fontSize: 12, fontWeight: 600 }}>Add</button>
                    <button onClick={() => setShowAddLink(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-accent" style={{ fontSize: 12 }}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {links.map((link) => (
                  <div key={link.id} className={`flex items-center gap-3 p-3 rounded-xl border bg-card transition-all ${link.enabled ? "border-border" : "border-border opacity-50"}`}>
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button onClick={() => moveLink(link.id, "up")} className="p-0.5 rounded hover:bg-accent"><ChevronUp size={12} className="text-muted-foreground" /></button>
                      <button onClick={() => moveLink(link.id, "down")} className="p-0.5 rounded hover:bg-accent"><ChevronDown size={12} className="text-muted-foreground" /></button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 13, fontWeight: 500 }} className="truncate">{link.title}</p>
                      <p className="text-muted-foreground truncate" style={{ fontSize: 11 }}>{link.url}</p>
                    </div>
                    <span className="text-muted-foreground shrink-0 flex items-center gap-1" style={{ fontSize: 11 }}>
                      <MousePointerClick size={10} /> {link.clicks}
                    </span>
                    <button onClick={() => toggleLink(link.id)} className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${link.enabled ? "bg-[#2563EB]" : "bg-switch-background"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${link.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                    <button onClick={() => deleteLink(link.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }} className="mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-3 rounded-xl border-2 transition-all ${selectedTheme.id === theme.id ? "border-[#2563EB]" : "border-border hover:border-[#2563EB]/30"}`}
                    >
                      <div className={`w-full h-16 rounded-lg ${theme.bg} mb-2`} />
                      <p style={{ fontSize: 12, fontWeight: 500 }}>{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }} className="mb-3">Button Style</p>
                <div className="grid grid-cols-3 gap-3">
                  {["Rounded", "Pill", "Square"].map((s) => (
                    <button key={s} className="p-3 rounded-xl border border-border hover:border-[#2563EB]/30 transition-all">
                      <div className={`w-full h-8 bg-accent ${s === "Pill" ? "rounded-full" : s === "Square" ? "rounded" : "rounded-xl"}`} />
                      <p style={{ fontSize: 12, fontWeight: 500 }} className="mt-2">{s}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }} className="mb-3">Social Icons</p>
                <div className="flex gap-2 flex-wrap">
                  {["Instagram", "YouTube", "X / Twitter", "TikTok", "LinkedIn", "Facebook"].map((s) => (
                    <label key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-accent">
                      <input type="checkbox" className="rounded" defaultChecked={["Instagram", "YouTube", "X / Twitter"].includes(s)} />
                      <span style={{ fontSize: 12 }}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Page Views (30d)", value: "8,420" },
                  { label: "Unique Visitors", value: "5,210" },
                  { label: "Total Clicks", value: totalClicks.toLocaleString() },
                  { label: "Avg. CTR", value: "4.8%" },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-xl border border-border bg-card">
                    <p className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</p>
                    <p style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p style={{ fontSize: 13, fontWeight: 600 }}>Click Performance by Link</p>
                </div>
                {links.filter((l) => l.clicks > 0).sort((a, b) => b.clicks - a.clicks).map((link) => (
                  <div key={link.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 13, fontWeight: 500 }} className="truncate">{link.title}</p>
                    </div>
                    <div className="w-32 h-2 bg-accent rounded-full shrink-0">
                      <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${(link.clicks / links[0].clicks) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }} className="shrink-0 w-14 text-right">{link.clicks}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Live Preview */}
      <div className="w-[380px] min-w-[380px] bg-accent/30 flex flex-col items-center justify-start p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setPreviewMode("mobile")} className={`p-2 rounded-lg ${previewMode === "mobile" ? "bg-card shadow-sm" : "text-muted-foreground hover:bg-card/50"}`}>
            <Smartphone size={16} />
          </button>
          <button onClick={() => setPreviewMode("desktop")} className={`p-2 rounded-lg ${previewMode === "desktop" ? "bg-card shadow-sm" : "text-muted-foreground hover:bg-card/50"}`}>
            <Monitor size={16} />
          </button>
        </div>
        <p className="text-muted-foreground mb-3" style={{ fontSize: 11 }}>socialdz.bio/acmedz</p>

        {/* Phone frame */}
        <div className={`${previewMode === "mobile" ? "w-[300px]" : "w-full"} rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800`}>
          <div className={`${selectedTheme.bg} min-h-[520px] p-6 flex flex-col items-center`}>
            {/* Profile */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white/30 mb-3">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzc1MDcxMjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <p className={selectedTheme.text} style={{ fontSize: 16, fontWeight: 700 }}>{bioName}</p>
            <p className={`${selectedTheme.text} opacity-70`} style={{ fontSize: 12 }}>{bioHandle}</p>
            <p className={`${selectedTheme.text} opacity-60 text-center mt-1`} style={{ fontSize: 11, lineHeight: 1.4 }}>{bioDescription}</p>

            {/* Social icons */}
            <div className="flex gap-3 my-4">
              {[Instagram, Youtube, Twitter].map((Icon, i) => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTheme.text} bg-white/10`}>
                  <Icon size={14} />
                </div>
              ))}
            </div>

            {/* Links */}
            <div className="w-full space-y-2.5">
              {links.filter((l) => l.enabled).map((link) => (
                <button
                  key={link.id}
                  className={`w-full px-4 py-3 rounded-xl ${selectedTheme.btn} text-center transition-all hover:scale-[1.02] ${link.style === "featured" ? "ring-2 ring-white/30" : ""} ${link.style === "outline" ? "!bg-transparent border-2 border-white/30" : ""}`}
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  {link.title}
                </button>
              ))}
            </div>

            <p className="mt-6 opacity-40" style={{ fontSize: 10 }}>Propulse par SocialdZ</p>
          </div>
        </div>
      </div>
    </main>
  );
}