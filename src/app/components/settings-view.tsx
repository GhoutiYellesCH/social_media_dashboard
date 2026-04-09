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

const TAB_TO_ROUTE: Record<string, string> = {
  Profil: "profile",
  Notifications: "notifications",
  Securite: "security",
  Apparence: "appearance",
  Integrations: "integrations",
  Facturation: "billing",
};

const ROUTE_TO_TAB: Record<string, string> = Object.fromEntries(
  Object.entries(TAB_TO_ROUTE).map(([tab, route]) => [route, tab])
);

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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorPending, setTwoFactorPending] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [loadingSecurity, setLoadingSecurity] = useState(true);
  const [savingTwoFactor, setSavingTwoFactor] = useState(false);
  const [activeSessions, setActiveSessions] = useState<Array<{ id: string; device: string; location: string; lastActive: string; current: boolean }>>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [managingSessions, setManagingSessions] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [appearance, setAppearance] = useState({
    theme: "Systeme",
    accentColor: "#2563EB",
  });
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    "Canva": true,
    "Google Analytics": true,
    "WhatsApp Business": false,
    "Shopify": false,
    "CIB / Dahabia": true,
  });
  const [billing, setBilling] = useState({
    cardLast4: "8742",
    cardBrand: "CIB / Dahabia",
    cardExpiry: "06/2028",
  });
  const [savingBilling, setSavingBilling] = useState(false);

  const { balance, monthlyAllowance, plan, upgradePlan, addTokens } = useTokens();
  const { updatePassword, logout } = useAuth();
  const profileInitials = (profile.name || "Utilisateur")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

  const loadTabData = async (tab: string) => {
    if (tab === "Profil") {
      setLoadingSettings(true);
      try {
        const data = await api.getProfileSettings();
        if (data?.profile && typeof data.profile === "object") {
          setProfile((prev) => ({ ...prev, ...data.profile }));
        }
        if (data?.security && typeof data.security === "object") {
          setTwoFactorEnabled(Boolean(data.security.twoFactorEnabled));
          setTwoFactorPending(Boolean(data.security.pendingSetup));
        }
      } catch (e) {
        console.error("Failed to load profile settings:", e);
      } finally {
        setLoadingSettings(false);
      }
      return;
    }

    if (tab === "Notifications") {
      try {
        const data = await api.getNotificationSettings();
        if (data && typeof data === "object") {
          setNotifications((prev) => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error("Failed to load notification settings:", e);
      }
      return;
    }

    if (tab === "Apparence") {
      try {
        const data = await api.getAppearanceSettings();
        if (data && typeof data === "object") {
          setAppearance((prev) => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error("Failed to load appearance settings:", e);
      }
      return;
    }

    if (tab === "Integrations") {
      try {
        const data = await api.getIntegrationSettings();
        if (data && typeof data === "object") {
          setIntegrations((prev) => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error("Failed to load integration settings:", e);
      }
      return;
    }

    if (tab === "Facturation") {
      try {
        const data = await api.getBillingSettings();
        if (data && typeof data === "object") {
          setBilling((prev) => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error("Failed to load billing settings:", e);
      }
      return;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabRoute = (params.get("tab") || "").toLowerCase();
    const resolvedTab = ROUTE_TO_TAB[tabRoute] || "Profil";
    setActiveTab(resolvedTab);
  }, []);

  useEffect(() => {
    const tabRoute = TAB_TO_ROUTE[activeTab] || TAB_TO_ROUTE.Profil;
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tabRoute);
    window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
    void loadTabData(activeTab);
  }, [activeTab]);

  useEffect(() => {
    api.getSecuritySettings()
      .then((data) => {
        setTwoFactorEnabled(Boolean(data?.twoFactorEnabled));
        setTwoFactorPending(Boolean(data?.pendingSetup));
      })
      .catch((e) => {
        console.error("Failed to load security settings:", e);
      })
      .finally(() => setLoadingSecurity(false));

    api.getActiveSessions()
      .then((data) => {
        const sessions = Array.isArray(data?.sessions) ? data.sessions : [];
        setActiveSessions(sessions);
      })
      .catch((e) => {
        console.error("Failed to load active sessions:", e);
      })
      .finally(() => setLoadingSessions(false));
  }, []);

  const handleSave = async () => {
    try {
      if (activeTab === "Profil") {
        const response = await api.updateProfileSettings(profile);
        if (response?.profile && typeof response.profile === "object") {
          setProfile((prev) => ({ ...prev, ...response.profile }));
        }
        if (response?.security && typeof response.security === "object") {
          setTwoFactorEnabled(Boolean(response.security.twoFactorEnabled));
          setTwoFactorPending(Boolean(response.security.pendingSetup));
        }
      } else if (activeTab === "Notifications") {
        await api.updateNotificationSettings(notifications);
      } else if (activeTab === "Apparence") {
        await api.updateAppearanceSettings(appearance);
      } else if (activeTab === "Facturation") {
        setSavingBilling(true);
        const response = await api.updateBillingSettings(billing);
        if (response?.billing && typeof response.billing === "object") {
          setBilling((prev) => ({ ...prev, ...response.billing }));
        }
      }

      toast.success("Parametres sauvegardes !", { description: "Vos modifications ont ete enregistrees." });
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setSavingBilling(false);
    }
  };

  const handleUpgradePlan = async () => {
    const nextPlan = plan === "Decouverte" ? "Pro" : plan === "Pro" ? "Entreprise" : "Entreprise";
    await upgradePlan(nextPlan);
  };

  const handleAddTokenPack = async () => {
    await addTokens(1000);
  };

  const toggleIntegration = async (name: string) => {
    const nextValue = !Boolean(integrations[name]);
    const nextState = { ...integrations, [name]: nextValue };
    setIntegrations(nextState);
    try {
      await api.updateIntegrationSettings(nextState);
      toast.success(nextValue ? "Integration connectee" : "Integration deconnectee");
    } catch (e: any) {
      setIntegrations(integrations);
      toast.error("Erreur", { description: e.message || "Echec de mise a jour de l'integration" });
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      toast.error("Mot de passe requis.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("La confirmation du mot de passe ne correspond pas.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const result = await updatePassword(newPassword);
      if (!result.success) {
        toast.error("Echec de mise a jour", { description: result.error || "Erreur inconnue" });
        return;
      }
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Mot de passe mis a jour.");
    } catch (e: any) {
      toast.error("Echec de mise a jour", { description: e.message || "Erreur inconnue" });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleStartTwoFactorSetup = async () => {
    setSavingTwoFactor(true);
    try {
      const data = await api.setupTwoFactor();
      setTwoFactorSecret(data?.secret || "");
      setTwoFactorPending(true);
      toast.success("Configuration 2FA initialisee.", {
        description: "Ajoutez la cle secrete dans votre application d'authentification, puis confirmez avec un code.",
      });
    } catch (e: any) {
      toast.error("Echec de configuration 2FA", { description: e.message || "Erreur inconnue" });
    } finally {
      setSavingTwoFactor(false);
    }
  };

  const handleEnableTwoFactor = async () => {
    const code = twoFactorCode.replace(/\D/g, "");
    if (code.length !== 6) {
      toast.error("Code 2FA invalide (6 chiffres requis).");
      return;
    }

    setSavingTwoFactor(true);
    try {
      await api.enableTwoFactor(code);
      setTwoFactorEnabled(true);
      setTwoFactorPending(false);
      setTwoFactorCode("");
      setTwoFactorSecret("");
      toast.success("2FA activee avec succes.");
    } catch (e: any) {
      toast.error("Activation 2FA echouee", { description: e.message || "Code invalide" });
    } finally {
      setSavingTwoFactor(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    const code = twoFactorCode.replace(/\D/g, "");
    if (code.length !== 6) {
      toast.error("Code 2FA invalide (6 chiffres requis).");
      return;
    }

    setSavingTwoFactor(true);
    try {
      await api.disableTwoFactor(code);
      setTwoFactorEnabled(false);
      setTwoFactorPending(false);
      setTwoFactorCode("");
      setTwoFactorSecret("");
      toast.success("2FA desactivee.");
    } catch (e: any) {
      toast.error("Desactivation 2FA echouee", { description: e.message || "Code invalide" });
    } finally {
      setSavingTwoFactor(false);
    }
  };

  const handleManageSessions = async () => {
    setManagingSessions(true);
    try {
      const response = await api.revokeOtherSessions();
      if (Array.isArray(response?.sessions)) {
        setActiveSessions(response.sessions);
      }
      toast.success("Sessions mises a jour", { description: response?.message || "Toutes les autres sessions ont ete deconnectees." });
    } catch (e: any) {
      toast.error("Echec de gestion des sessions", { description: e.message || "Erreur inconnue" });
    } finally {
      setManagingSessions(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt("Tapez SUPPRIMER pour confirmer la suppression definitive du compte.", "");
    if (!confirmation) return;

    setDeletingAccount(true);
    try {
      await api.deleteAccount(confirmation);
      toast.success("Compte supprime", { description: "Votre compte a ete supprime definitivement." });
      logout();
      window.location.href = "/login";
    } catch (e: any) {
      toast.error("Suppression echouee", { description: e.message || "Erreur inconnue" });
    } finally {
      setDeletingAccount(false);
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
              <p className="text-muted-foreground mt-1" style={{ fontSize: 12 }}>
                Securite du compte: 2FA {twoFactorEnabled ? "activee" : twoFactorPending ? "en attente" : "desactivee"}
              </p>
            </div>
            {loadingSettings && (
              <p className="text-muted-foreground" style={{ fontSize: 13 }}>Chargement du profil...</p>
            )}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#2563EB] flex items-center justify-center">
                <span className="text-white" style={{ fontSize: 28, fontWeight: 700 }}>{profileInitials}</span>
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
                <select
                  value={profile.timezone}
                  onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground"
                  style={{ fontSize: 14 }}
                >
                  <option>UTC+1 (Alger)</option>
                  <option>UTC+0 (GMT)</option>
                  <option>UTC+1 (CET / Paris)</option>
                  <option>UTC+2 (Le Caire)</option>
                </select>
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Langue</label>
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground"
                  style={{ fontSize: 14 }}
                >
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
            {loadingSecurity && (
              <p className="text-muted-foreground" style={{ fontSize: 13 }}>Chargement des parametres de securite...</p>
            )}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>Changer le mot de passe</p>
                      <p className="text-muted-foreground" style={{ fontSize: 13 }}>Utilisez un mot de passe fort d'au moins 8 caracteres.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground"
                      style={{ fontSize: 14 }}
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmer le mot de passe"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground"
                      style={{ fontSize: 14 }}
                    />
                  </div>
                  <button
                    onClick={handleUpdatePassword}
                    disabled={updatingPassword}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-60"
                    style={{ fontSize: 13, fontWeight: 500 }}
                  >
                    {updatingPassword ? "Mise a jour..." : "Mettre a jour le mot de passe"}
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>Authentification a deux facteurs</p>
                      <p className="text-muted-foreground" style={{ fontSize: 13 }}>
                        Statut: {twoFactorEnabled ? "Activee" : twoFactorPending ? "En attente de confirmation" : "Desactivee"}
                      </p>
                    </div>
                  </div>

                  {!twoFactorEnabled && !twoFactorPending && (
                    <button
                      onClick={handleStartTwoFactorSetup}
                      disabled={savingTwoFactor}
                      className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors disabled:opacity-60"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      {savingTwoFactor ? "Initialisation..." : "Configurer 2FA"}
                    </button>
                  )}

                  {(twoFactorPending || twoFactorEnabled) && (
                    <div className="space-y-3">
                      {twoFactorPending && twoFactorSecret && (
                        <div className="rounded-lg bg-accent/40 border border-border p-3">
                          <p style={{ fontSize: 12, fontWeight: 600 }} className="mb-1">Cle secrete TOTP</p>
                          <p style={{ fontSize: 12 }} className="break-all font-mono">{twoFactorSecret}</p>
                        </div>
                      )}
                      <input
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Code 2FA (6 chiffres)"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground"
                        style={{ fontSize: 14 }}
                      />
                      {!twoFactorEnabled ? (
                        <button
                          onClick={handleEnableTwoFactor}
                          disabled={savingTwoFactor}
                          className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors disabled:opacity-60"
                          style={{ fontSize: 13, fontWeight: 500 }}
                        >
                          {savingTwoFactor ? "Activation..." : "Confirmer l'activation 2FA"}
                        </button>
                      ) : (
                        <button
                          onClick={handleDisableTwoFactor}
                          disabled={savingTwoFactor}
                          className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-60"
                          style={{ fontSize: 13, fontWeight: 500 }}
                        >
                          {savingTwoFactor ? "Desactivation..." : "Desactiver 2FA"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Sessions actives</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>
                      {loadingSessions
                        ? "Chargement des sessions..."
                        : `${activeSessions.length || 1} appareil${(activeSessions.length || 1) > 1 ? "s" : ""} actuellement connecte${(activeSessions.length || 1) > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <button
                    onClick={handleManageSessions}
                    disabled={managingSessions}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-60"
                    style={{ fontSize: 13, fontWeight: 500 }}
                  >
                    {managingSessions ? "Mise a jour..." : "Deconnecter les autres"}
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }} className="text-destructive">Supprimer le compte</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Supprimer definitivement votre compte et toutes les donnees</p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-60"
                    style={{ fontSize: 13, fontWeight: 500 }}
                  >
                    {deletingAccount ? "Suppression..." : "Supprimer"}
                  </button>
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
                  <button
                    key={theme}
                    onClick={() => setAppearance((prev) => ({ ...prev, theme }))}
                    className={`p-4 rounded-xl border transition-colors text-center ${appearance.theme === theme ? "border-[#2563EB]" : "border-border hover:border-[#2563EB]"}`}
                  >
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
                    onClick={() => setAppearance((prev) => ({ ...prev, accentColor: color }))}
                    className="w-10 h-10 rounded-full border-2 border-transparent hover:border-foreground/20 transition-colors flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    {appearance.accentColor.toUpperCase() === color.toUpperCase() && <Check size={16} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
              Sauvegarder l'apparence
            </button>
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
            ].map((integration) => {
              const connected = Boolean(integrations[integration.name]);
              return (
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
                <button
                  onClick={() => toggleIntegration(integration.name)}
                  className={`px-4 py-2 rounded-lg transition-colors ${connected ? "border border-green-500 text-green-600" : "border border-border hover:bg-accent"}`}
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  {connected ? "Connecte" : "Connecter"}
                </button>
              </div>
              );
            })}
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
                <button
                  onClick={handleUpgradePlan}
                  className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  Upgrader le Forfait
                </button>
                <button
                  onClick={() => upgradePlan("Decouverte")}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  Revenir a Decouverte
                </button>
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
              <button
                onClick={handleAddTokenPack}
                className="mt-3 px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                <Coins size={14} /> Acheter des Tokens
              </button>
            </div>

            {/* Payment */}
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }} className="mb-3">Moyen de paiement</p>
              <div className="p-4 rounded-xl border border-border space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-muted-foreground" />
                  <div>
                    <p style={{ fontSize: 14 }}>{billing.cardBrand} •••• {billing.cardLast4}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Expire {billing.cardExpiry}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={billing.cardBrand}
                    onChange={(e) => setBilling((prev) => ({ ...prev, cardBrand: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground"
                    style={{ fontSize: 14 }}
                    placeholder="Type de carte"
                  />
                  <input
                    value={billing.cardLast4}
                    onChange={(e) => setBilling((prev) => ({ ...prev, cardLast4: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground"
                    style={{ fontSize: 14 }}
                    placeholder="4 derniers chiffres"
                  />
                  <input
                    value={billing.cardExpiry}
                    onChange={(e) => setBilling((prev) => ({ ...prev, cardExpiry: e.target.value.slice(0, 7) }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground"
                    style={{ fontSize: 14 }}
                    placeholder="MM/YYYY"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={savingBilling}
                  className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors disabled:opacity-60"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {savingBilling ? "Sauvegarde..." : "Sauvegarder le paiement"}
                </button>
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