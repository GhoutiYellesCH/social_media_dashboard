import {
  CalendarDays,
  BarChart3,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2,
  Star,
  Globe,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const features = [
  {
    icon: CalendarDays,
    title: "Content Calendar",
    description: "Plan and schedule your posts across all platforms with a beautiful drag-and-drop calendar.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track engagement, reach, and growth with real-time analytics and actionable insights.",
  },
  {
    icon: Zap,
    title: "AI-Powered Composer",
    description: "Generate compelling content with AI assistance and optimize for each platform.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team using approval workflows and role-based access.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for individuals",
    features: ["3 social accounts", "30 scheduled posts", "Basic analytics", "1 user"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For growing teams",
    features: ["10 social accounts", "Unlimited posts", "Advanced analytics", "5 users", "AI composer", "Priority support"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large organizations",
    features: ["Unlimited accounts", "Unlimited posts", "Custom analytics", "Unlimited users", "API access", "Dedicated manager"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director, TechCorp",
    text: "SocialQ transformed how we manage our social presence. We've seen a 200% increase in engagement since switching.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Founder, GrowthLab",
    text: "The AI composer alone saves us hours every week. Best social media tool we've ever used.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Social Media Manager",
    text: "The drag-and-drop calendar is incredibly intuitive. Our team adopted it instantly with zero training.",
    rating: 5,
  },
];

export function LandingPage({ onGetStarted, onLogin }: { onGetStarted: () => void; onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <span className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>S</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700 }} className="text-foreground">SocialQ</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14 }}>Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14 }}>Pricing</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14 }}>Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={onLogin} className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14 }}>
              Log in
            </button>
            <button onClick={onGetStarted} className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] mb-6" style={{ fontSize: 13, fontWeight: 600 }}>
            <Zap size={14} /> Now with AI-powered content generation
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }} className="max-w-3xl mx-auto mb-6">
            Manage all your social media in <span className="text-[#2563EB]">one place</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10" style={{ fontSize: 18, lineHeight: 1.6 }}>
            Schedule posts, analyze performance, and grow your audience across every platform — all from a single, beautiful dashboard.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={onGetStarted} className="px-8 py-3.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2" style={{ fontSize: 16, fontWeight: 600 }}>
              Start Free Trial <ArrowRight size={18} />
            </button>
            <button className="px-8 py-3.5 rounded-xl border border-border text-foreground hover:bg-accent transition-colors" style={{ fontSize: 16, fontWeight: 600 }}>
              Watch Demo
            </button>
          </div>
          <div className="mt-16 rounded-2xl border border-border overflow-hidden shadow-2xl shadow-black/10 max-w-5xl mx-auto">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1770368787779-8472da646193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NzUwMjgwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Dashboard preview"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground mb-8" style={{ fontSize: 13, fontWeight: 600 }}>TRUSTED BY 10,000+ TEAMS WORLDWIDE</p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
            {["Spotify", "Airbnb", "Shopify", "Slack", "Notion"].map((name) => (
              <div key={name} className="flex items-center gap-2">
                <Globe size={20} />
                <span style={{ fontSize: 18, fontWeight: 700 }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 40, fontWeight: 700 }}>Everything you need to grow</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto" style={{ fontSize: 16 }}>
              Powerful tools designed to save you time and amplify your social media presence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center mb-4">
                  <f.icon size={24} className="text-[#2563EB]" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-2">{f.title}</h3>
                <p className="text-muted-foreground" style={{ fontSize: 14, lineHeight: 1.6 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 40, fontWeight: 700 }}>Simple, transparent pricing</h2>
            <p className="text-muted-foreground mt-4" style={{ fontSize: 16 }}>No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border ${plan.highlighted ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 bg-background" : "border-border bg-background"} relative`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#2563EB] text-white" style={{ fontSize: 12, fontWeight: 600 }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">{plan.name}</h3>
                <p className="text-muted-foreground mb-4" style={{ fontSize: 13 }}>{plan.description}</p>
                <div className="mb-6">
                  <span style={{ fontSize: 40, fontWeight: 800 }}>{plan.price}</span>
                  <span className="text-muted-foreground" style={{ fontSize: 14 }}>{plan.period}</span>
                </div>
                <button
                  onClick={onGetStarted}
                  className={`w-full py-2.5 rounded-lg transition-colors mb-6 ${plan.highlighted ? "bg-[#2563EB] text-white hover:bg-[#1d4ed8]" : "border border-border hover:bg-accent"}`}
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  {plan.cta}
                </button>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: 14 }}>
                      <CheckCircle2 size={16} className="text-green-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 40, fontWeight: 700 }}>Loved by marketers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-4" style={{ fontSize: 14, lineHeight: 1.6 }}>"{t.text}"</p>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 13 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-[#2563EB] text-white">
          <h2 style={{ fontSize: 36, fontWeight: 700 }} className="mb-4">Ready to level up your social media?</h2>
          <p className="opacity-80 mb-8" style={{ fontSize: 16 }}>Join 10,000+ teams already using SocialQ to grow their audience.</p>
          <button onClick={onGetStarted} className="px-8 py-3.5 rounded-xl bg-white text-[#2563EB] hover:bg-gray-100 transition-colors" style={{ fontSize: 16, fontWeight: 600 }}>
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center">
              <span className="text-white" style={{ fontSize: 10, fontWeight: 700 }}>S</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>SocialQ</span>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: 13 }}>© 2026 SocialQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
