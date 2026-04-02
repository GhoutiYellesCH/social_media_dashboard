import { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Globe,
  Link2,
  ChevronRight,
  Camera,
  Check,
  Coins,
} from "lucide-react";
import { toast } from "sonner";
import { useTokens } from "./token-context";
import { useAuth } from "./auth-context";
import * as api from "./api-client";

const tabs = [
  { icon: User, label: "Profil" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Securite" },
  { icon: Palette, label: "Apparence" },
  { icon: Link2, label: "Integrations" },
  { icon: CreditCard, label: "Facturation" },
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("Profil");
  const [profile, setProfile] = useState({
    name: "Utilisateur",
    email: "",
    company: "",
    role: "",
    timezone: "UTC+1 (Alger)",
    language: "Francais",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    postPublished: true,
    weeklyReport: true,
    teamActivity: false,
    newFollower: false,
    tokenLow: true,
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  const { balance, monthlyAllowance, plan, upgradePlan, addTokens } = useTokens();
  const { user } = useAuth();

  // Load settings from backend
  useEffect(() => {
    api.getSettings().then((data) => {
      if (data && typeof data === "object") {
        setProfile((prev) => ({ ...prev, ...data }));
      }
    }).catch((e) => console.error("Failed to load settings:", e))
      .finally(() => setLoadingSettings(false));
  }, []);

  const handleSave = async () => {
    try {
      await api.updateSettings(profile);
      toast.success("Parametres sauvegardes !", { description: "Vos modifications ont ete enregistrees." });
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Profil":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Parametres du Profil</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Gerez vos informations personnelles</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#2563EB] flex items-center justify-center">
                <span className="text-white" style={{ fontSize: 28, fontWeight: 700 }}>KB</span>
              </div>
              <div>
                <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-2" style={{ fontSize: 13, fontWeight: 500 }}>
                  <Camera size={14} /> Changer la photo
                </button>
                <p className="text-muted-foreground mt-1" style={{ fontSize: 12 }}>JPG, PNG. Max 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Nom complet", key: "name" },
                { label: "Email", key: "email" },
                { label: "Entreprise", key: "company" },
                { label: "Poste", key: "role" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>{field.label}</label>
                  <input
                    value={profile[field.key as keyof typeof profile]}
                    onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                    style={{ fontSize: 14 }}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Fuseau horaire</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 14 }}>
                  <option>UTC+1 (Alger)</option>
                  <option>UTC+0 (GMT)</option>
                  <option>UTC+1 (CET / Paris)</option>
                  <option>UTC+2 (Le Caire)</option>
                </select>
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Langue</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 14 }}>
                  <option>Francais</option>
                  <option>Arabe</option>
                  <option>Anglais</option>
                  <option>Amazigh</option>
                </select>
              </div>
            </div>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
              Sauvegarder
            </button>
          </div>
        );

      case "Notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Preferences de Notifications</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Choisissez vos alertes</p>
            </div>
            <div className="space-y-4">
              {[
                { key: "email", label: "Notifications email", desc: "Recevoir les notifications par email" },
                { key: "push", label: "Notifications push", desc: "Recevoir les notifications navigateur" },
                { key: "postPublished", label: "Publication publiee", desc: "Quand une publication programmee est publiee" },
                { key: "weeklyReport", label: "Rapport hebdomadaire", desc: "Resume de performance chaque semaine" },
                { key: "teamActivity", label: "Activite de l'equipe", desc: "Quand un membre fait des modifications" },
                { key: "tokenLow", label: "Solde tokens bas", desc: "Alerte quand vos tokens sont en dessous de 500" },
                { key: "newFollower", label: "Nouveaux abonnes", desc: "Quand vous gagnez de nouveaux abonnes" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                    className={`w-10 h-5.5 rounded-full relative transition-colors ${notifications[item.key as keyof typeof notifications] ? "bg-[#2563EB]" : "bg-switch-background"}`}
                  >
                    <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
              Sauvegarder les Preferences
            </button>
          </div>
        );

      case "Securite":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Parametres de Securite</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Gerez la securite de votre compte</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Changer le mot de passe</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Derniere modification il y a 30 jours</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Modifier</button>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Authentification a deux facteurs</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Ajoutez une couche de securite supplementaire</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Activer</button>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Sessions actives</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>2 appareils actuellement connectes</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Gerer</button>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }} className="text-destructive">Supprimer le compte</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Supprimer definitivement votre compte et toutes les donnees</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        );

      case "Apparence":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Apparence</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Personnalisez l'apparence de votre tableau de bord</p>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }} className="mb-3">Theme</p>
              <div className="grid grid-cols-3 gap-3">
                {["Clair", "Sombre", "Systeme"].map((theme) => (
                  <button key={theme} className="p-4 rounded-xl border border-border hover:border-[#2563EB] transition-colors text-center">
                    <div className={`w-full h-16 rounded-lg mb-2 ${theme === "Sombre" ? "bg-gray-800" : theme === "Systeme" ? "bg-gradient-to-r from-white to-gray-800" : "bg-gray-100"} border border-border`} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{theme}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }} className="mb-3">Couleur d'accent</p>
              <div className="flex gap-3">
                {["#2563EB", "#7C3AED", "#059669", "#DC2626", "#EA580C", "#0891B2"].map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-full border-2 border-transparent hover:border-foreground/20 transition-colors flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    {color === "#2563EB" && <Check size={16} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "Integrations":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Integrations</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Connectez vos outils et services</p>
            </div>
            {[
              { name: "Canva", desc: "Creez des visuels et graphiques", connected: true },
              { name: "Google Analytics", desc: "Suivez le trafic depuis vos publications", connected: true },
              { name: "WhatsApp Business", desc: "Integrez vos conversations WhatsApp", connected: false },
              { name: "Shopify", desc: "Connectez votre boutique e-commerce", connected: false },
              { name: "CIB / Dahabia", desc: "Paiement electronique algerien", connected: true },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <Globe size={18} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{integration.name}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>{integration.desc}</p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-lg transition-colors ${integration.connected ? "border border-green-500 text-green-600" : "border border-border hover:bg-accent"}`} style={{ fontSize: 13, fontWeight: 500 }}>
                  {integration.connected ? "Connecte" : "Connecter"}
                </button>
              </div>
            ))}
          </div>
        );

      case "Facturation":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Facturation & Abonnement</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Gerez votre forfait, vos tokens et vos paiements</p>
            </div>
            {/* Current plan */}
            <div className="p-6 rounded-xl border border-[#2563EB] bg-[#2563EB]/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#2563EB]" style={{ fontSize: 13, fontWeight: 600 }}>FORFAIT ACTUEL</p>
                  <p style={{ fontSize: 24, fontWeight: 700 }} className="mt-1">{plan}</p>
                </div>
                <span style={{ fontSize: 32, fontWeight: 800 }}>4 900<span className="text-muted-foreground" style={{ fontSize: 14, fontWeight: 400 }}> DZD/mois</span></span>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Upgrader le Forfait</button>
                <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Annuler l'Abonnement</button>
              </div>
            </div>

            {/* Token balance */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Coins size={18} className="text-[#2563EB]" />
                <p style={{ fontSize: 16, fontWeight: 600 }}>Solde Tokens IA</p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 28, fontWeight: 700 }}>{balance.toLocaleString()}</span>
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>sur {monthlyAllowance.toLocaleString()} / mois</span>
              </div>
              <div className="w-full h-3 bg-accent rounded-full mb-3">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(5, (balance / monthlyAllowance) * 100)}%`,
                    backgroundColor: balance < 500 ? "#DC2626" : balance < 1500 ? "#F59E0B" : "#2563EB",
                  }}
                />
              </div>
              <p className="text-muted-foreground" style={{ fontSize: 13 }}>
                Renouvellement automatique chaque mois. Tokens supplementaires disponibles a l'achat.
              </p>
              <button className="mt-3 px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2" style={{ fontSize: 13, fontWeight: 600 }}>
                <Coins size={14} /> Acheter des Tokens
              </button>
            </div>

            {/* Payment */}
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }} className="mb-3">Moyen de paiement</p>
              <div className="p-4 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-muted-foreground" />
                  <div>
                    <p style={{ fontSize: 14 }}>CIB / Dahabia •••• 8742</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Expire 06/2028</p>
                  </div>
                </div>
                <button className="text-[#2563EB] hover:underline" style={{ fontSize: 13 }}>Modifier</button>
              </div>
              <p className="text-muted-foreground mt-2" style={{ fontSize: 12 }}>
                Nous acceptons CIB, Dahabia, et les cartes internationales (Visa, Mastercard).
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="max-w-5xl mx-auto p-8">
        <h1 style={{ fontSize: 28, fontWeight: 700 }} className="mb-1">Parametres</h1>
        <p className="text-muted-foreground mb-8" style={{ fontSize: 14 }}>Gerez votre compte et vos preferences</p>

        <div className="flex gap-8">
          <div className="w-48 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === tab.label ? "bg-[#2563EB]/10 text-[#2563EB]" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
              >
                <tab.icon size={16} />
                <span style={{ fontSize: 14 }}>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </main>
  );
}