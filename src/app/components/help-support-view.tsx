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
  { icon: Zap, label: "Demarrage", count: 8 },
  { icon: CalendarDays, label: "Calendrier", count: 12 },
  { icon: Users, label: "Gestion Comptes", count: 6 },
  { icon: BarChart3, label: "Analytiques", count: 9 },
  { icon: FileText, label: "Facturation", count: 5 },
];

const faqs = [
  { q: "Comment programmer une publication ?", a: "Allez dans le Calendrier ou le Compositeur, creez votre contenu, selectionnez les plateformes cibles, choisissez une date et heure, puis cliquez 'Programmer'. Votre publication sera automatiquement publiee a l'heure prevue." },
  { q: "Puis-je connecter plusieurs comptes sociaux ?", a: "Oui ! Allez dans Comptes dans la barre laterale pour connecter plusieurs comptes sur Facebook, Instagram, TikTok et LinkedIn. Chaque plateforme supporte plusieurs profils." },
  { q: "Comment fonctionne le systeme de tokens IA ?", a: "Chaque action IA consomme un nombre precis de tokens : generation de post (15), hashtags (8), reponse inbox (10), article blog (25). Suivez votre consommation dans le tableau de bord Tokens. Achetez des tokens supplementaires si besoin." },
  { q: "Quelles analytiques sont disponibles ?", a: "SocialdZ fournit les metriques d'engagement, la portee, les impressions, la croissance des abonnes, les meilleurs horaires de publication et les comparaisons de performance. Accedez aux rapports detailles depuis la section Analytiques." },
  { q: "Comment upgrader mon forfait ?", a: "Allez dans Parametres > Facturation pour voir votre forfait actuel et les options de mise a niveau. Vous pouvez changer de forfait a tout moment. Nous acceptons CIB, Dahabia et les cartes internationales." },
  { q: "Puis-je reprogrammer en glissant-deposant ?", a: "Oui ! Sur le Calendrier de contenu, glissez simplement une carte de publication et deposez-la sur un autre jour pour la reprogrammer. Un toast de confirmation apparaitra avec la nouvelle date." },
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
          <p className="text-muted-foreground" style={{ fontSize: 16 }}>Comment pouvons-nous vous aider aujourd'hui ?</p>
          {/* Search */}
          <div className="relative max-w-lg mx-auto mt-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher des articles, FAQ..."
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
            <p className="text-muted-foreground" style={{ fontSize: 13 }}>Parcourez les guides et tutoriels</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer">
            <Video size={24} className="text-[#2563EB] mb-3" />
            <p style={{ fontSize: 15, fontWeight: 600 }} className="mb-1">Tutoriels Video</p>
            <p className="text-muted-foreground" style={{ fontSize: 13 }}>Regardez des guides etape par etape</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer">
            <MessageCircle size={24} className="text-[#2563EB] mb-3" />
            <p style={{ fontSize: 15, fontWeight: 600 }} className="mb-1">Chat en Direct</p>
            <p className="text-muted-foreground" style={{ fontSize: 13 }}>Discutez avec le support (Dim-Jeu 9h-17h)</p>
          </div>
        </div>

        {/* Browse by category */}
        <div className="mb-10">
          <h2 style={{ fontSize: 18, fontWeight: 600 }} className="mb-4">Parcourir par Categorie</h2>
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
          <h2 style={{ fontSize: 18, fontWeight: 600 }} className="mb-4">Questions Frequentes</h2>
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
              <p className="text-center text-muted-foreground py-8" style={{ fontSize: 14 }}>Aucun resultat pour "{search}"</p>
            )}
          </div>
        </div>

        {/* Contact form */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={20} className="text-[#2563EB]" />
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Soumettre un Ticket</h2>
          </div>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Sujet</label>
              <input
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Description breve de votre probleme"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                style={{ fontSize: 14 }}
              />
            </div>
            <div>
              <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Decrivez votre probleme en detail..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] resize-none"
                style={{ fontSize: 14 }}
              />
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
              Envoyer le Ticket
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}