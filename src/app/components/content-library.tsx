import { useState } from "react";
import {
  Search,
  Grid3X3,
  List,
  Upload,
  FolderPlus,
  Folder,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  MoreHorizontal,
  Trash2,
  Download,
  Copy,
  Edit3,
  Tag,
  Star,
  Eye,
  X,
  ChevronRight,
  Filter,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "audio";
  thumbnail: string;
  size: string;
  dimensions?: string;
  uploaded: string;
  tags: string[];
  folder: string;
  usedIn: number;
  starred: boolean;
}

const mediaItems: MediaItem[] = [
  { id: "1", name: "spring-collection-hero.jpg", type: "image", thumbnail: "https://images.unsplash.com/photo-1726900303530-8b74f627aa4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZmxhdCUyMGxheSUyMG1pbmltYWwlMjBkZXNpZ258ZW58MXx8fHwxNzc1MTQyNDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "2.4 MB", dimensions: "1920x1080", uploaded: "Mar 28, 2026", tags: ["product", "hero", "spring"], folder: "Campaigns", usedIn: 5, starred: true },
  { id: "2", name: "team-collaboration.jpg", type: "image", thumbnail: "https://images.unsplash.com/photo-1758518729685-f88df7890776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZSUyMG1vZGVybnxlbnwxfHx8fDE3NzUxMTU4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "1.8 MB", dimensions: "1920x1280", uploaded: "Mar 25, 2026", tags: ["team", "office", "culture"], folder: "Brand", usedIn: 3, starred: false },
  { id: "3", name: "social-media-phone.jpg", type: "image", thumbnail: "https://images.unsplash.com/photo-1516282417715-f1193d45c97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1vYmlsZSUyMHBob25lJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc1MTQyNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "1.2 MB", dimensions: "1080x1350", uploaded: "Mar 22, 2026", tags: ["social", "lifestyle"], folder: "Stock", usedIn: 8, starred: true },
  { id: "4", name: "workspace-creative.jpg", type: "image", thumbnail: "https://images.unsplash.com/photo-1758876021859-bd2371d8f0a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBsYXB0b3AlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NzUxNDI0Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "3.1 MB", dimensions: "2560x1440", uploaded: "Mar 20, 2026", tags: ["workspace", "creative"], folder: "Blog", usedIn: 2, starred: false },
  { id: "5", name: "gradient-background.jpg", type: "image", thumbnail: "https://images.unsplash.com/photo-1639493115941-a70fcef4f715?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGdyYWRpZW50JTIwYWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3NTE0MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "890 KB", dimensions: "1920x1080", uploaded: "Mar 18, 2026", tags: ["background", "abstract", "colorful"], folder: "Templates", usedIn: 12, starred: true },
  { id: "6", name: "mountain-scenic.jpg", type: "image", thumbnail: "https://images.unsplash.com/photo-1598439473183-42c9301db5dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbiUyMHNjZW5pY3xlbnwxfHx8fDE3NzUxNDI0Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "2.7 MB", dimensions: "1920x1280", uploaded: "Mar 15, 2026", tags: ["nature", "landscape"], folder: "Stock", usedIn: 1, starred: false },
  { id: "7", name: "product-demo.mp4", type: "video", thumbnail: "", size: "45.2 MB", dimensions: "1920x1080", uploaded: "Mar 12, 2026", tags: ["product", "demo"], folder: "Videos", usedIn: 4, starred: false },
  { id: "8", name: "brand-guidelines.pdf", type: "document", thumbnail: "", size: "8.5 MB", uploaded: "Feb 28, 2026", tags: ["brand", "guidelines"], folder: "Brand", usedIn: 0, starred: true },
  { id: "9", name: "podcast-episode-24.mp3", type: "audio", thumbnail: "", size: "32.1 MB", uploaded: "Mar 10, 2026", tags: ["podcast", "audio"], folder: "Audio", usedIn: 1, starred: false },
];

const folders = [
  { name: "All Media", count: mediaItems.length },
  { name: "Campaigns", count: mediaItems.filter((m) => m.folder === "Campaigns").length },
  { name: "Brand", count: mediaItems.filter((m) => m.folder === "Brand").length },
  { name: "Stock", count: mediaItems.filter((m) => m.folder === "Stock").length },
  { name: "Blog", count: mediaItems.filter((m) => m.folder === "Blog").length },
  { name: "Templates", count: mediaItems.filter((m) => m.folder === "Templates").length },
  { name: "Videos", count: mediaItems.filter((m) => m.folder === "Videos").length },
  { name: "Audio", count: mediaItems.filter((m) => m.folder === "Audio").length },
];

const typeIcons = { image: ImageIcon, video: Video, document: FileText, audio: Music };
const typeColors = { image: "#2563EB", video: "#DC2626", document: "#EA580C", audio: "#7C3AED" };

export function ContentLibrary() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolder, setSelectedFolder] = useState("All Media");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [items, setItems] = useState(mediaItems);

  const filtered = items.filter((m) => {
    if (selectedFolder !== "All Media" && m.folder !== selectedFolder) return false;
    if (selectedType !== "all" && m.type !== selectedType) return false;
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase()) && !m.tags.some((t) => t.includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const totalSize = "98.4 MB";

  const toggleStar = (id: string) => {
    setItems((prev) => prev.map((m) => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  return (
    <main className="flex-1 h-screen overflow-hidden bg-background flex">
      {/* Sidebar folders */}
      <div className="w-56 min-w-56 border-r border-border bg-card overflow-y-auto p-4 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontSize: 13, fontWeight: 600 }}>Folders</span>
          <button onClick={() => toast.success("Folder created!")} className="p-1 rounded hover:bg-accent"><FolderPlus size={14} className="text-muted-foreground" /></button>
        </div>
        <div className="space-y-0.5">
          {folders.map((f) => (
            <button
              key={f.name}
              onClick={() => setSelectedFolder(f.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${selectedFolder === f.name ? "bg-[#2563EB]/10 text-[#2563EB]" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
            >
              <div className="flex items-center gap-2">
                <Folder size={14} />
                <span style={{ fontSize: 13 }}>{f.name}</span>
              </div>
              <span style={{ fontSize: 11 }}>{f.count}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-muted-foreground px-3" style={{ fontSize: 11, fontWeight: 500 }}>Storage Used</p>
          <p className="px-3 mt-1" style={{ fontSize: 15, fontWeight: 700 }}>{totalSize}</p>
          <div className="mx-3 mt-2 h-2 bg-accent rounded-full">
            <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "38%" }} />
          </div>
          <p className="text-muted-foreground px-3 mt-1" style={{ fontSize: 11 }}>38% of 256 MB</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{selectedFolder}</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => toast.info("Upload dialog")} className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2" style={{ fontSize: 13, fontWeight: 600 }}>
                <Upload size={14} /> Upload
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search files & tags..." className="pl-8 pr-4 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground" style={{ fontSize: 13 }} />
              </div>
              {["all", "image", "video", "document", "audio"].map((t) => (
                <button key={t} onClick={() => setSelectedType(t)} className={`px-3 py-1.5 rounded-lg transition-colors ${selectedType === t ? "bg-[#2563EB] text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`} style={{ fontSize: 12, fontWeight: 500 }}>
                  {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent"}`}><Grid3X3 size={16} /></button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent"}`}><List size={16} /></button>
            </div>
          </div>

          {/* Upload zone */}
          <div className="border-2 border-dashed border-border rounded-xl p-6 mb-6 text-center hover:border-[#2563EB]/50 transition-colors cursor-pointer">
            <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
            <p style={{ fontSize: 13, fontWeight: 500 }}>Drag & drop files here or click to upload</p>
            <p className="text-muted-foreground" style={{ fontSize: 12 }}>PNG, JPG, GIF, MP4, PDF up to 50MB</p>
          </div>

          {/* Grid view */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedItem(item)}>
                    <div className="aspect-video relative bg-accent flex items-center justify-center overflow-hidden">
                      {item.thumbnail ? (
                        <ImageWithFallback src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Icon size={32} style={{ color: typeColors[item.type] }} className="opacity-40" />
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStar(item.id); }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star size={12} fill={item.starred ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="p-3">
                      <p style={{ fontSize: 12, fontWeight: 500 }} className="truncate">{item.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-muted-foreground" style={{ fontSize: 11 }}>{item.size}</span>
                        <span className="text-muted-foreground" style={{ fontSize: 11 }}>Used in {item.usedIn} posts</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List view */}
          {viewMode === "list" && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-accent/30">
                    {["Name", "Type", "Size", "Tags", "Used In", "Uploaded", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const Icon = typeIcons[item.type];
                    return (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent/20 cursor-pointer" onClick={() => setSelectedItem(item)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.thumbnail ? (
                              <ImageWithFallback src={item.thumbnail} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                                <Icon size={16} style={{ color: typeColors[item.type] }} />
                              </div>
                            )}
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-accent" style={{ fontSize: 11 }}>{item.type}</span></td>
                        <td className="px-4 py-3" style={{ fontSize: 13 }}>{item.size}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">{item.tags.slice(0, 2).map((t) => <span key={t} className="px-2 py-0.5 rounded-full bg-accent text-muted-foreground" style={{ fontSize: 10 }}>{t}</span>)}</div>
                        </td>
                        <td className="px-4 py-3" style={{ fontSize: 13 }}>{item.usedIn} posts</td>
                        <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: 12 }}>{item.uploaded}</td>
                        <td className="px-4 py-3">
                          <button onClick={(e) => { e.stopPropagation(); toggleStar(item.id); }} className={item.starred ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}>
                            <Star size={14} fill={item.starred ? "currentColor" : "none"} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedItem && (
        <div className="w-80 min-w-80 border-l border-border bg-card overflow-y-auto shrink-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span style={{ fontSize: 14, fontWeight: 600 }}>File Details</span>
            <button onClick={() => setSelectedItem(null)} className="p-1 rounded hover:bg-accent"><X size={16} /></button>
          </div>
          <div className="p-4">
            {selectedItem.thumbnail ? (
              <ImageWithFallback src={selectedItem.thumbnail} alt={selectedItem.name} className="w-full rounded-xl object-cover mb-4" />
            ) : (
              <div className="w-full aspect-video rounded-xl bg-accent flex items-center justify-center mb-4">
                {(() => { const Icon = typeIcons[selectedItem.type]; return <Icon size={40} style={{ color: typeColors[selectedItem.type] }} className="opacity-40" />; })()}
              </div>
            )}
            <h3 style={{ fontSize: 14, fontWeight: 600 }} className="mb-3 break-all">{selectedItem.name}</h3>
            <div className="space-y-2 mb-4">
              {[
                { label: "Type", value: selectedItem.type },
                { label: "Size", value: selectedItem.size },
                ...(selectedItem.dimensions ? [{ label: "Dimensions", value: selectedItem.dimensions }] : []),
                { label: "Folder", value: selectedItem.folder },
                { label: "Uploaded", value: selectedItem.uploaded },
                { label: "Used in", value: `${selectedItem.usedIn} posts` },
              ].map((d) => (
                <div key={d.label} className="flex justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>{d.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{d.value}</span>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 500 }}>Tags</p>
              <div className="flex flex-wrap gap-1">
                {selectedItem.tags.map((t) => (
                  <span key={t} className="px-2 py-1 rounded-full bg-accent text-foreground" style={{ fontSize: 11 }}>{t}</span>
                ))}
                <button className="px-2 py-1 rounded-full border border-dashed border-border text-muted-foreground hover:text-foreground" style={{ fontSize: 11 }}>+ Add</button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toast.success("Downloaded!")} className="flex-1 px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors flex items-center justify-center gap-1.5" style={{ fontSize: 12, fontWeight: 500 }}>
                <Download size={12} /> Download
              </button>
              <button onClick={() => { navigator.clipboard.writeText(selectedItem.thumbnail || selectedItem.name); toast.success("URL copied!"); }} className="flex-1 px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors flex items-center justify-center gap-1.5" style={{ fontSize: 12, fontWeight: 500 }}>
                <Copy size={12} /> Copy URL
              </button>
            </div>
            <button onClick={() => { setItems((prev) => prev.filter((m) => m.id !== selectedItem.id)); setSelectedItem(null); toast.success("File deleted"); }} className="w-full mt-2 px-3 py-2 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center justify-center gap-1.5" style={{ fontSize: 12, fontWeight: 500 }}>
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
