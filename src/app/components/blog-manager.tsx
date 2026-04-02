import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Copy,
  Globe,
  Clock,
  FileText,
  TrendingUp,
  BarChart3,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  AlignLeft,
  AlignCenter,
  Heading1,
  Heading2,
  Quote,
  Code,
  X,
  ArrowLeft,
  Tag,
  Calendar,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTokens } from "./token-context";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  status: "published" | "draft" | "scheduled";
  author: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
  tags: string[];
  coverImage: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Social Media Trends That Will Dominate 2026",
    excerpt: "Stay ahead of the curve with these emerging trends that are reshaping how brands connect with their audiences online...",
    status: "published",
    author: "Alex Morgan",
    date: "Mar 28, 2026",
    readTime: "8 min read",
    views: 4520,
    likes: 234,
    comments: 45,
    category: "Social Media",
    tags: ["trends", "strategy", "2026"],
    coverImage: "https://images.unsplash.com/photo-1581110993053-76f2c092a192?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwd3JpdGluZyUyMGxhcHRvcCUyMGNvbnRlbnR8ZW58MXx8fHwxNzc1MTQxMDQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    slug: "social-media-trends-2026",
  },
  {
    id: "2",
    title: "How We Grew Our Instagram Following by 300% in 6 Months",
    excerpt: "A step-by-step breakdown of the exact strategies, posting schedules, and content types that tripled our audience...",
    status: "published",
    author: "Sarah Chen",
    date: "Mar 22, 2026",
    readTime: "12 min read",
    views: 8910,
    likes: 567,
    comments: 89,
    category: "Growth",
    tags: ["instagram", "growth", "case-study"],
    coverImage: "",
    slug: "instagram-growth-300-percent",
  },
  {
    id: "3",
    title: "The Complete Guide to LinkedIn Marketing for B2B Companies",
    excerpt: "Everything you need to know about leveraging LinkedIn's algorithm, content formats, and advertising tools for B2B success...",
    status: "draft",
    author: "Alex Morgan",
    date: "Apr 1, 2026",
    readTime: "15 min read",
    views: 0,
    likes: 0,
    comments: 0,
    category: "LinkedIn",
    tags: ["linkedin", "b2b", "guide"],
    coverImage: "",
    slug: "linkedin-marketing-b2b-guide",
  },
  {
    id: "4",
    title: "AI Content Creation: Best Practices and Ethics",
    excerpt: "How to responsibly use AI tools to enhance your content while maintaining authenticity and brand voice...",
    status: "scheduled",
    author: "Marcus Johnson",
    date: "Apr 5, 2026",
    readTime: "10 min read",
    views: 0,
    likes: 0,
    comments: 0,
    category: "AI & Automation",
    tags: ["ai", "content", "ethics"],
    coverImage: "",
    slug: "ai-content-creation-best-practices",
  },
  {
    id: "5",
    title: "Mastering Short-Form Video: TikTok, Reels, and Shorts",
    excerpt: "Expert tips for creating scroll-stopping short-form videos that drive engagement and grow your following across all platforms...",
    status: "published",
    author: "Emily Rodriguez",
    date: "Mar 15, 2026",
    readTime: "7 min read",
    views: 6340,
    likes: 421,
    comments: 67,
    category: "Video",
    tags: ["video", "tiktok", "reels"],
    coverImage: "",
    slug: "mastering-short-form-video",
  },
  {
    id: "6",
    title: "Building a Content Calendar That Actually Works",
    excerpt: "Stop winging your social media strategy. Here's how to build a content calendar that keeps your team organized and consistent...",
    status: "published",
    author: "Alex Morgan",
    date: "Mar 10, 2026",
    readTime: "6 min read",
    views: 3210,
    likes: 189,
    comments: 34,
    category: "Strategy",
    tags: ["planning", "calendar", "organization"],
    coverImage: "",
    slug: "content-calendar-that-works",
  },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  published: { bg: "bg-green-500/10", text: "text-green-600", label: "Published" },
  draft: { bg: "bg-gray-500/10", text: "text-gray-500", label: "Draft" },
  scheduled: { bg: "bg-blue-500/10", text: "text-blue-600", label: "Scheduled" },
};

export function BlogManager() {
  const [activeTab, setActiveTab] = useState<"posts" | "editor">("posts");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [editorTitle, setEditorTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const { consumeTokens, balance } = useTokens();

  const filteredPosts = blogPosts.filter((p) => {
    if (selectedFilter !== "all" && p.status !== selectedFilter) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalViews = blogPosts.reduce((a, p) => a + p.views, 0);
  const totalPosts = blogPosts.filter((p) => p.status === "published").length;

  const openEditor = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setEditorTitle(post.title);
      setEditorContent(post.excerpt);
    } else {
      setEditingPost(null);
      setEditorTitle("");
      setEditorContent("");
    }
    setActiveTab("editor");
  };

  if (activeTab === "editor") {
    return (
      <main className="flex-1 h-screen overflow-hidden bg-background flex flex-col">
        {/* Editor header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab("posts")} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <ArrowLeft size={18} />
            </button>
            <span className="text-muted-foreground" style={{ fontSize: 13 }}>{editingPost ? "Editing" : "New Post"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { toast.success("Draft saved!"); setActiveTab("posts"); }}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              Save Draft
            </button>
            <button
              onClick={() => { toast.success("Post scheduled!"); setActiveTab("posts"); }}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              Schedule
            </button>
            <button
              onClick={() => { toast.success("Post published!"); setActiveTab("posts"); }}
              className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              Publish
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main editor */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto py-10 px-6">
              {/* Cover image */}
              <div className="mb-6 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-[#2563EB]/50 transition-colors cursor-pointer">
                <ImageIcon size={24} className="mx-auto text-muted-foreground mb-2" />
                <p style={{ fontSize: 13, fontWeight: 500 }}>Add cover image</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>Recommended: 1200×630px</p>
              </div>

              <input
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none mb-6"
                style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}
              />

              {/* Toolbar */}
              <div className="flex items-center gap-1 pb-4 mb-4 border-b border-border flex-wrap">
                {[
                  { icon: Bold, label: "Bold" },
                  { icon: Italic, label: "Italic" },
                  { icon: Underline, label: "Underline" },
                  null,
                  { icon: Heading1, label: "H1" },
                  { icon: Heading2, label: "H2" },
                  { icon: Quote, label: "Quote" },
                  { icon: Code, label: "Code" },
                  null,
                  { icon: List, label: "Bullet" },
                  { icon: ListOrdered, label: "Number" },
                  null,
                  { icon: Link2, label: "Link" },
                  { icon: ImageIcon, label: "Image" },
                  null,
                  { icon: AlignLeft, label: "Align" },
                  { icon: AlignCenter, label: "Center" },
                ].map((item, i) =>
                  item === null ? (
                    <div key={`sep-${i}`} className="w-px h-5 bg-border mx-1" />
                  ) : (
                    <button
                      key={item.label}
                      className="p-2 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                      title={item.label}
                    >
                      <item.icon size={16} />
                    </button>
                  )
                )}
                <div className="ml-auto">
                  <button onClick={async () => {
                    const success = await consumeTokens(25, "Redaction article blog", "Blog");
                    if (success) {
                      toast.success("Contenu généré ! 25 tokens utilisés.");
                    } else {
                      toast.error("Tokens insuffisants", { description: "Il vous faut 25 tokens." });
                    }
                  }} className="px-3 py-1.5 rounded-lg bg-[#2563EB]/10 text-[#2563EB] hover:bg-[#2563EB]/20 transition-colors flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 600 }}>
                    <Sparkles size={14} /> IA Assist (25 tokens)
                  </button>
                </div>
              </div>

              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                placeholder="Commencez à rédiger votre article... Utilisez la barre d'outils ci-dessus ou essayez l'IA Assist pour générer du contenu."
                className="w-full min-h-[400px] bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                style={{ fontSize: 16, lineHeight: 1.8 }}
              />
            </div>
          </div>

          {/* Sidebar settings */}
          <div className="w-72 border-l border-border bg-card p-5 overflow-y-auto shrink-0">
            <h3 style={{ fontSize: 14, fontWeight: 600 }} className="mb-4">Post Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-muted-foreground mb-1.5 block" style={{ fontSize: 12, fontWeight: 500 }}>URL Slug</label>
                <input defaultValue={editingPost?.slug || ""} placeholder="my-post-title" className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 13 }} />
              </div>
              <div>
                <label className="text-muted-foreground mb-1.5 block" style={{ fontSize: 12, fontWeight: 500 }}>Category</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 13 }}>
                  <option>Social Media</option>
                  <option>Growth</option>
                  <option>Strategy</option>
                  <option>Video</option>
                  <option>AI & Automation</option>
                  <option>LinkedIn</option>
                </select>
              </div>
              <div>
                <label className="text-muted-foreground mb-1.5 block" style={{ fontSize: 12, fontWeight: 500 }}>Tags</label>
                <input placeholder="Add tags, comma separated" className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 13 }} />
              </div>
              <div>
                <label className="text-muted-foreground mb-1.5 block" style={{ fontSize: 12, fontWeight: 500 }}>Excerpt</label>
                <textarea placeholder="Brief summary for SEO..." rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground resize-none" style={{ fontSize: 13 }} />
              </div>
              <div>
                <label className="text-muted-foreground mb-1.5 block" style={{ fontSize: 12, fontWeight: 500 }}>SEO Title</label>
                <input placeholder="Custom SEO title" className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 13 }} />
              </div>
              <div>
                <label className="text-muted-foreground mb-1.5 block" style={{ fontSize: 12, fontWeight: 500 }}>Meta Description</label>
                <textarea placeholder="SEO meta description..." rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground resize-none" style={{ fontSize: 13 }} />
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 500 }}>Share to Social</p>
                <div className="space-y-2">
                  {["Facebook", "LinkedIn", "X"].map((platform) => (
                    <label key={platform} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span style={{ fontSize: 13 }}>{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Blog Manager</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>Create, manage, and publish blog content for your audience</p>
          </div>
          <button
            onClick={() => openEditor()}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            <Plus size={16} /> New Blog Post
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Published Posts", value: totalPosts, icon: FileText },
            { label: "Total Views", value: `${(totalViews / 1000).toFixed(1)}K`, icon: Eye },
            { label: "Avg Read Time", value: "9 min", icon: Clock },
            { label: "Engagement Rate", value: "6.2%", icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{stat.label}</span>
                <stat.icon size={16} className="text-muted-foreground" />
              </div>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {["all", "published", "draft", "scheduled"].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-4 py-2 rounded-lg transition-colors ${selectedFilter === f ? "bg-[#2563EB] text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                {f === "all" ? "All Posts" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
              style={{ fontSize: 13 }}
            />
          </div>
        </div>

        {/* Posts grid */}
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openEditor(post)}
            >
              {post.coverImage ? (
                <ImageWithFallback src={post.coverImage} alt={post.title} className="w-32 h-20 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-32 h-20 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <FileText size={24} className="text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full ${statusColors[post.status].bg} ${statusColors[post.status].text}`} style={{ fontSize: 11, fontWeight: 500 }}>
                    {statusColors[post.status].label}
                  </span>
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>{post.category}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600 }} className="mb-1 truncate">{post.title}</h3>
                <p className="text-muted-foreground truncate" style={{ fontSize: 13 }}>{post.excerpt}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>{post.author}</span>
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>{post.date}</span>
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>{post.readTime}</span>
                  {post.views > 0 && (
                    <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: 12 }}>
                      <Eye size={12} /> {post.views.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
                  className="p-2 rounded-lg hover:bg-accent"
                >
                  <MoreHorizontal size={16} className="text-muted-foreground" />
                </button>
                {menuOpen === post.id && (
                  <div className="absolute right-0 top-10 w-40 bg-card border border-border rounded-lg shadow-lg z-10 py-1">
                    {[
                      { icon: Edit3, label: "Edit", action: () => { openEditor(post); setMenuOpen(null); } },
                      { icon: Eye, label: "Preview", action: () => toast.info("Preview opened") },
                      { icon: Copy, label: "Duplicate", action: () => toast.success("Post duplicated!") },
                      { icon: Trash2, label: "Delete", action: () => toast.success("Post deleted!") },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { item.action(); setMenuOpen(null); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors ${item.label === "Delete" ? "text-destructive" : "text-foreground"}`}
                        style={{ fontSize: 13 }}
                      >
                        <item.icon size={14} /> {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}