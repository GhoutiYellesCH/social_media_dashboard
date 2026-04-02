import { useState } from "react";
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Video,
  Zap,
  Users,
  CalendarDays,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

const categories = [
  { icon: Zap, label: "Getting Started", count: 8 },
  { icon: CalendarDays, label: "Content Calendar", count: 12 },
  { icon: Users, label: "Account Management", count: 6 },
  { icon: BarChart3, label: "Analytics & Reports", count: 9 },
  { icon: FileText, label: "Billing & Plans", count: 5 },
];

const faqs = [
  { q: "How do I schedule a post?", a: "Navigate to the Content Calendar or Post Composer, create your content, select target platforms, choose a date and time, then click 'Schedule'. Your post will be automatically published at the scheduled time." },
  { q: "Can I connect multiple social media accounts?", a: "Yes! Go to Accounts in the sidebar to connect multiple accounts across Facebook, Instagram, LinkedIn, and X. Each platform supports multiple profiles." },
  { q: "How does the AI content assistant work?", a: "The AI assistant in the Post Composer analyzes your brand voice and suggests content. Type a topic or click 'AI Assist' to generate post ideas, captions, and hashtags optimized for each platform." },
  { q: "What analytics are available?", a: "SocialQ provides engagement metrics, reach, impressions, follower growth, best posting times, and content performance comparisons. Access detailed reports from the Analytics section." },
  { q: "How do I upgrade my plan?", a: "Go to Settings > Billing to view your current plan and upgrade options. You can switch plans at any time, and billing is prorated." },
  { q: "Can I reschedule posts by dragging?", a: "Yes! On the Content Calendar, simply drag any post card and drop it on a different day to reschedule. A confirmation toast will appear with the new date." },
];

export function HelpSupportView() {
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({ subject: "", message: "" });

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support ticket submitted!", { description: "We'll get back to you within 24 hours." });
    setContactForm({ subject: "", message: "" });
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 style={{ fontSize: 28, fontWeight: 700 }} className="mb-2">Help & Support</h1>
          <p className="text-muted-foreground" style={{ fontSize: 16 }}>How can we help you today?</p>
          {/* Search */}
          <div className="relative max-w-lg mx-auto mt-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for help articles, FAQs..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
              style={{ fontSize: 14 }}
            />
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer">
            <Book size={24} className="text-[#2563EB] mb-3" />
            <p style={{ fontSize: 15, fontWeight: 600 }} className="mb-1">Documentation</p>
            <p className="text-muted-foreground" style={{ fontSize: 13 }}>Browse guides and tutorials</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer">
            <Video size={24} className="text-[#2563EB] mb-3" />
            <p style={{ fontSize: 15, fontWeight: 600 }} className="mb-1">Video Tutorials</p>
            <p className="text-muted-foreground" style={{ fontSize: 13 }}>Watch step-by-step walkthroughs</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer">
            <MessageCircle size={24} className="text-[#2563EB] mb-3" />
            <p style={{ fontSize: 15, fontWeight: 600 }} className="mb-1">Live Chat</p>
            <p className="text-muted-foreground" style={{ fontSize: 13 }}>Chat with support (Mon-Fri 9-5)</p>
          </div>
        </div>

        {/* Browse by category */}
        <div className="mb-10">
          <h2 style={{ fontSize: 18, fontWeight: 600 }} className="mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <button key={cat.label} className="p-4 rounded-xl border border-border bg-card hover:border-[#2563EB]/30 transition-colors text-left">
                <cat.icon size={20} className="text-[#2563EB] mb-2" />
                <p style={{ fontSize: 13, fontWeight: 500 }}>{cat.label}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{cat.count} articles</p>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-10">
          <h2 style={{ fontSize: 18, fontWeight: 600 }} className="mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/50 transition-colors"
                >
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground transition-transform shrink-0 ml-4 ${expandedFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-4 text-muted-foreground" style={{ fontSize: 14, lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <p className="text-center text-muted-foreground py-8" style={{ fontSize: 14 }}>No results found for "{search}"</p>
            )}
          </div>
        </div>

        {/* Contact form */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={20} className="text-[#2563EB]" />
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Submit a Support Ticket</h2>
          </div>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Subject</label>
              <input
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                style={{ fontSize: 14 }}
              />
            </div>
            <div>
              <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] resize-none"
                style={{ fontSize: 14 }}
              />
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
              Submit Ticket
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
