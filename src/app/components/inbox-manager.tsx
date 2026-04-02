import { useState } from "react";
import {
  Search,
  Send,
  Smile,
  Image as ImageIcon,
  Paperclip,
  MoreHorizontal,
  Star,
  Archive,
  Trash2,
  Tag,
  Filter,
  MessageCircle,
  Heart,
  AtSign,
  Bell,
  CheckCheck,
  Clock,
  Users,
  ChevronDown,
  X,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  platform: string;
  platformColor: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  type: "dm" | "comment" | "mention";
  starred: boolean;
  messages: Message[];
}

interface Message {
  id: string;
  sender: "them" | "us";
  text: string;
  time: string;
  read: boolean;
}

const conversations: Conversation[] = [
  {
    id: "1", name: "Sarah Digital", avatar: "", platform: "Instagram", platformColor: "#E4405F",
    lastMessage: "Love your latest post! Can you tell me more about the product?", time: "2m ago", unread: true, type: "dm", starred: true,
    messages: [
      { id: "1a", sender: "them", text: "Hey! I've been following your brand for a while now.", time: "10:30 AM", read: true },
      { id: "1b", sender: "us", text: "Thank you so much for the support! We really appreciate it.", time: "10:35 AM", read: true },
      { id: "1c", sender: "them", text: "Love your latest post! Can you tell me more about the product?", time: "10:42 AM", read: false },
    ],
  },
  {
    id: "2", name: "MarketingPro", avatar: "", platform: "X", platformColor: "#000",
    lastMessage: "Great thread on social media trends! Would love to collaborate.", time: "15m ago", unread: true, type: "dm", starred: false,
    messages: [
      { id: "2a", sender: "them", text: "Great thread on social media trends! Would love to collaborate.", time: "10:28 AM", read: false },
    ],
  },
  {
    id: "3", name: "Jane Cooper", avatar: "", platform: "Facebook", platformColor: "#1877F2",
    lastMessage: "When will the new feature be available? I've been waiting for weeks.", time: "1h ago", unread: true, type: "comment", starred: false,
    messages: [
      { id: "3a", sender: "them", text: "When will the new feature be available? I've been waiting for weeks.", time: "9:45 AM", read: false },
    ],
  },
  {
    id: "4", name: "TechReviewer", avatar: "", platform: "LinkedIn", platformColor: "#0A66C2",
    lastMessage: "Thanks for the quick response! I'll include this in our article.", time: "2h ago", unread: false, type: "dm", starred: true,
    messages: [
      { id: "4a", sender: "them", text: "Hi! We're writing a review of SocialQ. Could you share some stats?", time: "8:00 AM", read: true },
      { id: "4b", sender: "us", text: "Of course! Here are some key numbers: 50K+ active users, 4.8 star rating.", time: "8:15 AM", read: true },
      { id: "4c", sender: "them", text: "Thanks for the quick response! I'll include this in our article.", time: "8:30 AM", read: true },
    ],
  },
  {
    id: "5", name: "Creative Agency Co", avatar: "", platform: "Instagram", platformColor: "#E4405F",
    lastMessage: "We'd love to partner with you for our upcoming campaign! DM us.", time: "3h ago", unread: false, type: "dm", starred: false,
    messages: [
      { id: "5a", sender: "them", text: "Hey SocialQ team! We're a creative agency specializing in social media.", time: "7:30 AM", read: true },
      { id: "5b", sender: "them", text: "We'd love to partner with you for our upcoming campaign! DM us.", time: "7:31 AM", read: true },
    ],
  },
  {
    id: "6", name: "David Kim", avatar: "", platform: "X", platformColor: "#000",
    lastMessage: "@SocialQ just saved me 5 hours this week! Best tool ever 🙌", time: "4h ago", unread: false, type: "mention", starred: false,
    messages: [
      { id: "6a", sender: "them", text: "@SocialQ just saved me 5 hours this week! Best tool ever 🙌", time: "6:45 AM", read: true },
      { id: "6b", sender: "us", text: "So glad to hear that, David! Thanks for sharing 🚀", time: "7:00 AM", read: true },
    ],
  },
  {
    id: "7", name: "StartupWeekly", avatar: "", platform: "LinkedIn", platformColor: "#0A66C2",
    lastMessage: "Would you be interested in a guest post for our newsletter?", time: "5h ago", unread: false, type: "dm", starred: false,
    messages: [
      { id: "7a", sender: "them", text: "Would you be interested in a guest post for our newsletter?", time: "5:30 AM", read: true },
    ],
  },
  {
    id: "8", name: "Unhappy Customer", avatar: "", platform: "Facebook", platformColor: "#1877F2",
    lastMessage: "Your support hasn't responded in 3 days. This is unacceptable.", time: "6h ago", unread: true, type: "comment", starred: false,
    messages: [
      { id: "8a", sender: "them", text: "I've been having issues with connecting my Instagram account.", time: "Yesterday", read: true },
      { id: "8b", sender: "them", text: "Your support hasn't responded in 3 days. This is unacceptable.", time: "4:00 AM", read: false },
    ],
  },
];

const typeIcons = { dm: MessageCircle, comment: AtSign, mention: Bell };

export function InboxManager() {
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(conversations[0]);
  const [filterType, setFilterType] = useState<"all" | "dm" | "comment" | "mention">("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [convos, setConvos] = useState(conversations);

  const unreadCount = convos.filter((c) => c.unread).length;

  const filtered = convos.filter((c) => {
    if (filterType !== "all" && c.type !== filterType) return false;
    if (filterPlatform !== "all" && c.platform !== filterPlatform) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sendReply = () => {
    if (!replyText.trim() || !selectedConvo) return;
    const updated = convos.map((c) =>
      c.id === selectedConvo.id
        ? {
            ...c,
            messages: [...c.messages, { id: String(Date.now()), sender: "us" as const, text: replyText, time: "Just now", read: true }],
            lastMessage: replyText,
            time: "Just now",
          }
        : c
    );
    setConvos(updated);
    setSelectedConvo(updated.find((c) => c.id === selectedConvo.id) || null);
    setReplyText("");
    toast.success("Reply sent!");
  };

  const markRead = (id: string) => {
    setConvos((prev) => prev.map((c) => c.id === id ? { ...c, unread: false } : c));
  };

  return (
    <main className="flex-1 h-screen overflow-hidden bg-background flex">
      {/* Conversation List */}
      <div className="w-[360px] min-w-[360px] border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Inbox</h2>
              {unreadCount > 0 && (
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{unreadCount} unread conversations</p>
              )}
            </div>
            <button onClick={() => { setConvos((prev) => prev.map((c) => ({ ...c, unread: false }))); toast.success("All marked as read!"); }} className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 11, fontWeight: 500 }}>
              <CheckCheck size={12} className="inline mr-1" /> Mark all read
            </button>
          </div>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search conversations..." className="w-full pl-8 pr-4 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground" style={{ fontSize: 13 }} />
          </div>
          <div className="flex items-center gap-1">
            {(["all", "dm", "comment", "mention"] as const).map((t) => (
              <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1 rounded-full transition-colors ${filterType === t ? "bg-[#2563EB] text-white" : "bg-accent text-muted-foreground hover:text-foreground"}`} style={{ fontSize: 11, fontWeight: 500 }}>
                {t === "all" ? "All" : t === "dm" ? "DMs" : t === "comment" ? "Comments" : "Mentions"}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((convo) => {
            const TypeIcon = typeIcons[convo.type];
            return (
              <div
                key={convo.id}
                onClick={() => { setSelectedConvo(convo); markRead(convo.id); }}
                className={`flex items-start gap-3 p-4 border-b border-border cursor-pointer transition-colors ${selectedConvo?.id === convo.id ? "bg-[#2563EB]/5" : "hover:bg-accent/50"} ${convo.unread ? "bg-accent/30" : ""}`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <span style={{ fontSize: 14, fontWeight: 600 }} className="text-muted-foreground">{convo.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: convo.platformColor }}>
                    <span className="text-white" style={{ fontSize: 7, fontWeight: 700 }}>{convo.platform[0]}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: 13, fontWeight: convo.unread ? 700 : 500 }}>{convo.name}</span>
                      <TypeIcon size={10} className="text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground shrink-0" style={{ fontSize: 11 }}>{convo.time}</span>
                  </div>
                  <p className={`truncate ${convo.unread ? "text-foreground" : "text-muted-foreground"}`} style={{ fontSize: 12, fontWeight: convo.unread ? 500 : 400 }}>{convo.lastMessage}</p>
                </div>
                {convo.unread && <div className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat View */}
      {selectedConvo ? (
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                <span style={{ fontSize: 13, fontWeight: 600 }} className="text-muted-foreground">{selectedConvo.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{selectedConvo.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: selectedConvo.platformColor, fontSize: 10, fontWeight: 600 }}>{selectedConvo.platform}</span>
                  <span className="px-2 py-0.5 rounded-full bg-accent text-muted-foreground" style={{ fontSize: 10 }}>{selectedConvo.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => { setConvos((prev) => prev.map((c) => c.id === selectedConvo.id ? { ...c, starred: !c.starred } : c)); }} className={`p-2 rounded-lg hover:bg-accent ${selectedConvo.starred ? "text-yellow-500" : "text-muted-foreground"}`}>
                <Star size={16} fill={selectedConvo.starred ? "currentColor" : "none"} />
              </button>
              <button onClick={() => toast.success("Archived!")} className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><Archive size={16} /></button>
              <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><MoreHorizontal size={16} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedConvo.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "us" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${msg.sender === "us" ? "bg-[#2563EB] text-white rounded-br-md" : "bg-card border border-border rounded-bl-md"}`}>
                  <p style={{ fontSize: 14, lineHeight: 1.6 }}>{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${msg.sender === "us" ? "justify-end" : ""}`}>
                    <span className={msg.sender === "us" ? "text-white/60" : "text-muted-foreground"} style={{ fontSize: 10 }}>{msg.time}</span>
                    {msg.sender === "us" && <CheckCheck size={10} className="text-white/60" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${selectedConvo.name}...`}
                  rows={2}
                  className="w-full px-4 py-3 pr-24 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 resize-none"
                  style={{ fontSize: 14 }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"><Smile size={16} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"><ImageIcon size={16} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"><Paperclip size={16} /></button>
                </div>
              </div>
              <button
                onClick={sendReply}
                disabled={!replyText.trim()}
                className="px-5 py-3 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                <Send size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-muted-foreground" style={{ fontSize: 11 }}>Replying on {selectedConvo.platform}</span>
              <span className="text-muted-foreground" style={{ fontSize: 11 }}>·</span>
              <button className="text-[#2563EB] hover:underline" style={{ fontSize: 11 }} onClick={() => toast.info("Canned responses")}>Use template</button>
              <button className="text-[#2563EB] hover:underline" style={{ fontSize: 11 }} onClick={() => toast.info("AI assist")}>AI assist</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-20" />
            <p style={{ fontSize: 16, fontWeight: 500 }}>Select a conversation</p>
            <p style={{ fontSize: 13 }}>Choose from your inbox to start replying</p>
          </div>
        </div>
      )}
    </main>
  );
}
