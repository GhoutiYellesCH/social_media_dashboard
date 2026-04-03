import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Coins, Loader2 } from "lucide-react";

export function LoginPage({
  onLogin,
  onBack,
  onSignUp,
  onResetPassword,
  error,
}: {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onBack: () => void;
  onSignUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  onResetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  error?: string;
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setResetSuccess(false);

    if (isForgotPassword) {
      if (!email) {
        setLocalError("Veuillez entrer votre email.");
        return;
      }
      setLoading(true);
      try {
        const result = await onResetPassword(email);
        if (!result.success) {
          setLocalError(result.error || "Erreur de réinitialisation");
        } else {
          setResetSuccess(true);
        }
      } catch (err: any) {
        setLocalError(err.message || "Erreur inattendue");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setLocalError("Veuillez remplir tous les champs.");
      return;
    }
    if (isSignUp && !name) {
      setLocalError("Veuillez entrer votre nom.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Le mot de passe doit contenir au moins 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const result = await onSignUp(email, password, name);
        if (!result.success) {
          setLocalError(result.error || "Erreur d'inscription");
        }
      } else {
        const result = await onLogin(email, password);
        if (!result.success) {
          setLocalError(result.error || "Erreur de connexion");
        }
      }
    } catch (err: any) {
      setLocalError(err.message || "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-[#2563EB] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: 200 + i * 100,
                height: 200 + i * 100,
                top: `${10 + i * 15}%`,
                left: `${-10 + i * 10}%`,
                opacity: 0.1,
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span style={{ fontSize: 14, fontWeight: 700 }}>dZ</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700 }}>SocialdZ</span>
          </div>
        </div>
        <div className="relative z-10">
          <h2 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }} className="mb-4">
            La plateforme #1 de gestion social media en Algerie
          </h2>
          <p className="opacity-80 mb-6" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Programmez, analysez et developpez votre audience sur toutes les plateformes depuis un seul tableau de bord.
          </p>
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur">
            <Coins size={20} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Systeme de tokens IA</p>
              <p className="opacity-70" style={{ fontSize: 13 }}>500 tokens offerts a l'inscription. Payez uniquement ce que vous utilisez.</p>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <p className="opacity-60" style={{ fontSize: 13 }}>&copy; 2026 SocialdZ - Alger, Algerie</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-8 transition-colors" style={{ fontSize: 14 }}>
            <ArrowLeft size={16} /> Retour a l'accueil
          </button>

          <h1 style={{ fontSize: 28, fontWeight: 700 }} className="mb-2">
            {isForgotPassword ? "Mot de passe oublie ?" : isSignUp ? "Creez votre compte" : "Bon retour !"}
          </h1>
          <p className="text-muted-foreground mb-8" style={{ fontSize: 14 }}>
            {isForgotPassword ? "Entrez votre adresse e-mail poour recevoir un lien de reinitialisation." : isSignUp ? "Essai gratuit de 14 jours - 500 tokens IA offerts" : "Connectez-vous a votre compte SocialdZ"}
          </p>

          {displayError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700" style={{ fontSize: 13 }}>
              {displayError}
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground" style={{ fontSize: 12 }}>Connectez-vous avec email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && !isForgotPassword && (
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmed Benali"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                  style={{ fontSize: 14 }}
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@entreprise.dz"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                style={{ fontSize: 14 }}
                disabled={loading}
              />
            </div>
            {!isForgotPassword && (
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 caracteres"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] pr-10"
                    style={{ fontSize: 14 }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {!isSignUp && !isForgotPassword && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Se souvenir de moi</span>
                </label>
                <button type="button" onClick={() => setIsForgotPassword(true)} className="text-[#2563EB] hover:underline" style={{ fontSize: 13 }}>Mot de passe oublie ?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading
                ? (isForgotPassword ? "Envoi en cours..." : isSignUp ? "Creation en cours..." : "Connexion en cours...")
                : (isForgotPassword ? "Reinitialiser le mot de passe" : isSignUp ? "Creer Mon Compte" : "Se Connecter")}
            </button>
          </form>

          {resetSuccess && (
            <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-center" style={{ fontSize: 13 }}>
              Si cet e-mail est associe a un compte, vous recevrez un lien de reinitialisation.
            </div>
          )}

          <p className="text-center mt-6 text-muted-foreground" style={{ fontSize: 14 }}>
            {isForgotPassword ? (
                <button
                  type="button"
                  onClick={() => {
                      setIsForgotPassword(false);
                      setLocalError("");
                      setResetSuccess(false);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  style={{ fontSize: 14 }}
                >
                  Retour a la connexion
                </button>
            ) : isSignUp ? "Vous avez deja un compte ?" : "Pas encore de compte ?"}{" "}
            {!isForgotPassword && (
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setLocalError("");
                }}
                className="text-[#2563EB] hover:underline"
                style={{ fontWeight: 500 }}
              >
                {isSignUp ? "Se connecter" : "S'inscrire"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
