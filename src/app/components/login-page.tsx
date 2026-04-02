import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export function LoginPage({
  onLogin,
  onBack,
  onSignUp,
}: {
  onLogin: () => void;
  onBack: () => void;
  onSignUp: () => void;
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

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
              <span style={{ fontSize: 14, fontWeight: 700 }}>S</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700 }}>SocialQ</span>
          </div>
        </div>
        <div className="relative z-10">
          <h2 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }} className="mb-4">
            Manage your social media like a pro
          </h2>
          <p className="opacity-80" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Schedule, analyze, and grow your audience across all platforms from one powerful dashboard.
          </p>
        </div>
        <div className="relative z-10">
          <p className="opacity-60" style={{ fontSize: 13 }}>© 2026 SocialQ</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-8 transition-colors" style={{ fontSize: 14 }}>
            <ArrowLeft size={16} /> Back to home
          </button>

          <h1 style={{ fontSize: 28, fontWeight: 700 }} className="mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mb-8" style={{ fontSize: 14 }}>
            {isSignUp ? "Start your free 14-day trial" : "Sign in to your SocialQ account"}
          </p>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={onLogin} className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button onClick={onLogin} className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06-.01-.18-.04-.56-.04-.95 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.18.06.52.06.95l.224.05zm4.565 17.11c-.33.67-.51 1.01-.95 1.6-.62.83-1.49 1.86-2.57 1.87-.96.01-1.21-.63-2.51-.62-1.3.01-1.58.63-2.54.62-1.08-.01-1.91-.94-2.53-1.77-1.73-2.31-1.92-5.02-.85-6.46.76-1.02 1.96-1.63 3.09-1.63 1.15 0 1.88.63 2.83.63.92 0 1.48-.63 2.81-.63 1.0 0 2.05.47 2.72 1.28-2.39 1.31-2.0 4.72.44 5.63l.06.01-.01.47z"/></svg>
              Apple
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground" style={{ fontSize: 12 }}>or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                  style={{ fontSize: 14 }}
                />
              </div>
            )}
            <div>
              <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                style={{ fontSize: 14 }}
              />
            </div>
            <div>
              <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] pr-10"
                  style={{ fontSize: 14 }}
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

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Remember me</span>
                </label>
                <button type="button" className="text-[#2563EB] hover:underline" style={{ fontSize: 13 }}>Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-6 text-muted-foreground" style={{ fontSize: 14 }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#2563EB] hover:underline"
              style={{ fontWeight: 500 }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
