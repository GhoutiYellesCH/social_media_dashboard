import {
  CalendarDays,
  BarChart3,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2,
  Star,
  Globe,
  Coins,
  Shield,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const features = [
  {
    icon: CalendarDays,
    title: "Calendrier de Contenu",
    description: "Planifiez et programmez vos publications sur toutes les plateformes avec un calendrier intuitif en glisser-deposer.",
  },
  {
    icon: BarChart3,
    title: "Analytiques Avancees",
    description: "Suivez l'engagement, la portee et la croissance avec des analyses en temps reel et des insights actionnables.",
  },
  {
    icon: Coins,
    title: "IA par Tokens",
    description: "Generez du contenu, des hashtags et des reponses avec notre IA. Payez uniquement ce que vous utilisez avec notre systeme de tokens.",
  },
  {
    icon: Users,
    title: "Collaboration d'Equipe",
    description: "Travaillez ensemble avec des workflows d'approbation et un controle d'acces base sur les roles.",
  },
];

const pricing = [
  {
    name: "Decouverte",
    price: "0",
    currency: "DZD",
    period: "/mois",
    description: "Parfait pour les freelancers",
    features: ["3 comptes sociaux", "30 publications/mois", "500 tokens IA/mois", "Analytiques de base", "1 utilisateur"],
    cta: "Commencer Gratuitement",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "4 900",
    currency: "DZD",
    period: "/mois",
    description: "Pour les equipes en croissance",
    features: ["10 comptes sociaux", "Publications illimitees", "5 000 tokens IA/mois", "Analytiques avancees", "5 utilisateurs", "Support prioritaire"],
    cta: "Essai Gratuit 14 jours",
    highlighted: true,
  },
  {
    name: "Entreprise",
    price: "14 900",
    currency: "DZD",
    period: "/mois",
    description: "Pour les grandes entreprises",
    features: ["Comptes illimites", "Publications illimitees", "20 000 tokens IA/mois", "Analytiques personnalisees", "Utilisateurs illimites", "API access", "Manager dedie"],
    cta: "Contacter l'Equipe",
    highlighted: false,
  },
];

const testimonials = [
  {
    name: "Amira Benali",
    role: "Directrice Marketing, TechDZ",
    text: "SocialdZ a transforme la gestion de nos reseaux sociaux. Notre engagement a augmente de 200% depuis le passage a cette plateforme.",
    rating: 5,
  },
  {
    name: "Yacine Boumediene",
    role: "Fondateur, E-Shop Oran",
    text: "Le systeme de tokens IA est genial ! On ne paie que ce qu'on utilise. Le meilleur rapport qualite-prix sur le marche algerien.",
    rating: 5,
  },
  {
    name: "Nadia Cherif",
    role: "Community Manager, Djezzy Agency",
    text: "Le calendrier de contenu est incroyablement intuitif. Notre equipe l'a adopte instantanement sans aucune formation.",
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
              <span className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>dZ</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700 }} className="text-foreground">SocialdZ</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600" style={{ fontSize: 10, fontWeight: 600 }}>NOUVEAU</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14 }}>Fonctionnalites</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14 }}>Tarifs</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14 }}>Temoignages</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={onLogin} className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14 }}>
              Connexion
            </button>
            <button onClick={onGetStarted} className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
              Commencer
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] mb-6" style={{ fontSize: 13, fontWeight: 600 }}>
            <Rocket size={14} /> Le 1er outil SaaS de gestion social media en Algerie
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }} className="max-w-4xl mx-auto mb-6">
            Gerez vos reseaux sociaux avec l'<span className="text-[#2563EB]">IA par tokens</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10" style={{ fontSize: 18, lineHeight: 1.6 }}>
            Programmez vos publications, analysez vos performances et developpez votre audience. Utilisez l'IA uniquement quand vous en avez besoin avec notre systeme de tokens flexible.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={onGetStarted} className="px-8 py-3.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2" style={{ fontSize: 16, fontWeight: 600 }}>
              Essai Gratuit - 500 Tokens Offerts <ArrowRight size={18} />
            </button>
            <button className="px-8 py-3.5 rounded-xl border border-border text-foreground hover:bg-accent transition-colors" style={{ fontSize: 16, fontWeight: 600 }}>
              Voir la Demo
            </button>
          </div>

          {/* Token explainer */}
          <div className="flex items-center justify-center gap-8 mt-8">
            {[
              { label: "Generation de post", cost: "15 tokens" },
              { label: "Suggestions hashtags", cost: "8 tokens" },
              { label: "Reponse IA inbox", cost: "10 tokens" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: 13 }}>
                <Coins size={14} className="text-[#2563EB]" />
                <span>{t.label}:</span>
                <span className="text-foreground" style={{ fontWeight: 600 }}>{t.cost}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border overflow-hidden shadow-2xl shadow-black/10 max-w-5xl mx-auto">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1651009793956-6684bba370f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBbGdlcmlhJTIwQWxnaWVycyUyMGNpdHlzY2FwZSUyMG1vZGVybnxlbnwxfHx8fDE3NzUxNDQzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="SocialdZ Dashboard"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground mb-8" style={{ fontSize: 13, fontWeight: 600 }}>FAIT CONFIANCE PAR +2 000 ENTREPRISES ALGERIENNES</p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
            {["Yassir", "Jumia DZ", "Condor", "Djezzy", "Iris Sat"].map((name) => (
              <div key={name} className="flex items-center gap-2">
                <Globe size={20} />
                <span style={{ fontSize: 18, fontWeight: 700 }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How tokens work */}
      <section className="py-20 px-6 bg-accent/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 40, fontWeight: 700 }}>Comment fonctionnent les tokens ?</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto" style={{ fontSize: 16 }}>
              Pas d'abonnement IA cache. Utilisez vos tokens quand vous voulez, pour ce que vous voulez.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Choisissez votre forfait", desc: "Chaque forfait inclut un quota mensuel de tokens IA. Decouverte: 500, Pro: 5 000, Entreprise: 20 000.", icon: Shield },
              { step: "2", title: "Utilisez l'IA partout", desc: "Generation de posts, hashtags, emails, reponses inbox, articles blog... Chaque action consomme un nombre precise de tokens.", icon: Zap },
              { step: "3", title: "Suivez votre consommation", desc: "Tableau de bord en temps reel de votre solde. Achetez des tokens supplementaires si besoin, sans changer de forfait.", icon: TrendingUp },
            ].map((s) => (
              <div key={s.step} className="p-6 rounded-2xl border border-border bg-card text-center">
                <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center mx-auto mb-4" style={{ fontSize: 20, fontWeight: 700 }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-2">{s.title}</h3>
                <p className="text-muted-foreground" style={{ fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 40, fontWeight: 700 }}>Tout ce qu'il vous faut pour grandir</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto" style={{ fontSize: 16 }}>
              Des outils puissants concus pour le marche algerien et nord-africain.
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
            <h2 style={{ fontSize: 40, fontWeight: 700 }}>Tarifs simples et transparents</h2>
            <p className="text-muted-foreground mt-4" style={{ fontSize: 16 }}>En Dinars Algeriens. Sans frais caches. Annulez quand vous voulez.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border ${plan.highlighted ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 bg-background" : "border-border bg-background"} relative`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#2563EB] text-white" style={{ fontSize: 12, fontWeight: 600 }}>
                    Le Plus Populaire
                  </div>
                )}
                <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">{plan.name}</h3>
                <p className="text-muted-foreground mb-4" style={{ fontSize: 13 }}>{plan.description}</p>
                <div className="mb-6">
                  <span style={{ fontSize: 36, fontWeight: 800 }}>{plan.price}</span>
                  <span className="text-muted-foreground ml-1" style={{ fontSize: 14 }}>DZD{plan.period}</span>
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
          <p className="text-center text-muted-foreground mt-6" style={{ fontSize: 13 }}>
            Besoin de plus de tokens ? Achetez des packs supplementaires a partir de 990 DZD / 1 000 tokens.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: 40, fontWeight: 700 }}>Ils nous font confiance</h2>
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
          <h2 style={{ fontSize: 36, fontWeight: 700 }} className="mb-4">Pret a booster vos reseaux sociaux ?</h2>
          <p className="opacity-80 mb-8" style={{ fontSize: 16 }}>Rejoignez +2 000 entreprises algeriennes qui utilisent deja SocialdZ. 500 tokens IA offerts a l'inscription.</p>
          <button onClick={onGetStarted} className="px-8 py-3.5 rounded-xl bg-white text-[#2563EB] hover:bg-gray-100 transition-colors" style={{ fontSize: 16, fontWeight: 600 }}>
            Commencer Maintenant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center">
              <span className="text-white" style={{ fontSize: 10, fontWeight: 700 }}>dZ</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>SocialdZ</span>
          </div>
          <div className="flex items-center gap-6 text-muted-foreground" style={{ fontSize: 13 }}>
            <span>Alger, Algerie</span>
            <span>contact@socialdz.com</span>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: 13 }}>&copy; 2026 SocialdZ. Tous droits reserves.</p>
        </div>
      </footer>
    </div>
  );
}
