import { Coins, TrendingUp, Zap, ShoppingCart, BarChart3, Clock, ArrowUpRight, Package, Loader2 } from "lucide-react";
import { useTokens } from "./token-context";
import { toast } from "sonner";
import { useState } from "react";
import * as apiClient from "./api-client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const usageByDay = [
  { day: "Lun", tokens: 120 },
  { day: "Mar", tokens: 85 },
  { day: "Mer", tokens: 210 },
  { day: "Jeu", tokens: 95 },
  { day: "Ven", tokens: 155 },
  { day: "Sam", tokens: 45 },
  { day: "Dim", tokens: 40 },
];

const usageByModule = [
  { name: "Post Composer", value: 35, color: "#2563EB" },
  { name: "Blog", value: 20, color: "#7C3AED" },
  { name: "Hashtags", value: 15, color: "#059669" },
  { name: "Email", value: 12, color: "#DC2626" },
  { name: "Inbox", value: 10, color: "#F59E0B" },
  { name: "Listening", value: 8, color: "#0891B2" },
];

const tokenPacks = [
  { amount: 1000, labelPrice: "990 DZD", priceDzd: 990, popular: false },
  { amount: 3000, labelPrice: "2 490 DZD", priceDzd: 2490, popular: true },
  { amount: 5000, labelPrice: "3 990 DZD", priceDzd: 3990, popular: false },
  { amount: 10000, labelPrice: "6 990 DZD", priceDzd: 6990, popular: false },
];

export function TokenDashboard() {
  const { balance, totalUsed, monthlyAllowance, plan, history, addTokens, loading } = useTokens();
  const usagePercent = Math.round(((monthlyAllowance - balance) / monthlyAllowance) * 100);
  const [paymentLoading, setPaymentLoading] = useState<number | null>(null);

  const handlePurchase = async (amount: number, priceDzd: number) => {
    setPaymentLoading(amount);
    try {
      // Create Baridimob payment link
      const res = await apiClient.createBaridimobPayment(priceDzd);
      if (res.success && res.paymentUrl) {
        // Rediriger vers l'URL de paiement Baridimob
        window.location.href = res.paymentUrl;
      } else {
        toast.error("Erreur", { description: "Impossible de creer le paiement." });
      }
    } catch(e: any) {
      toast.error("Erreur", { description: e.message || "Erreur de connexion" });
    } finally {
      setPaymentLoading(null);
    }
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Tokens IA</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>Gerez votre consommation de tokens et achetez des recharges</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Solde Actuel", value: balance.toLocaleString(), icon: Coins, color: "#2563EB", sub: "tokens disponibles" },
            { label: "Utilises ce mois", value: totalUsed.toLocaleString(), icon: TrendingUp, color: "#7C3AED", sub: `sur ${monthlyAllowance.toLocaleString()}` },
            { label: "Forfait", value: plan, icon: Package, color: "#059669", sub: `${monthlyAllowance.toLocaleString()} tokens/mois` },
            { label: "Cout moyen/jour", value: "107", icon: BarChart3, color: "#F59E0B", sub: "tokens/jour" },
          ].map((s) => (
            <div key={s.label} className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + "15" }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <p style={{ fontSize: 26, fontWeight: 700 }}>{s.value}</p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Usage bar */}
        <div className="p-5 rounded-xl border border-border bg-card mb-6">
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 14, fontWeight: 600 }}>Consommation mensuelle</span>
            <span className="text-muted-foreground" style={{ fontSize: 13 }}>{usagePercent}% utilise</span>
          </div>
          <div className="w-full h-4 bg-accent rounded-full mb-2">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${usagePercent}%`,
                backgroundColor: usagePercent > 80 ? "#DC2626" : usagePercent > 60 ? "#F59E0B" : "#2563EB",
              }}
            />
          </div>
          <div className="flex justify-between text-muted-foreground" style={{ fontSize: 12 }}>
            <span>{totalUsed.toLocaleString()} utilises</span>
            <span>{balance.toLocaleString()} restants</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Usage chart */}
          <div className="lg:col-span-2 p-5 rounded-xl border border-border bg-card">
            <h3 style={{ fontSize: 15, fontWeight: 600 }} className="mb-4">Utilisation par jour</h3>
            <svg width={0} height={0} style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={usageByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Area type="monotone" dataKey="tokens" stroke="#2563EB" fill="url(#tokenGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* By module */}
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 style={{ fontSize: 15, fontWeight: 600 }} className="mb-4">Par module</h3>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={usageByModule} innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                  {usageByModule.map((e, i) => (<Cell key={i} fill={e.color} />))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Usage"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {usageByModule.map((m) => (
                <div key={m.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span style={{ fontSize: 12 }}>{m.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{m.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Token packs */}
        <div className="mb-8">
          <h3 style={{ fontSize: 16, fontWeight: 600 }} className="mb-4">Acheter des tokens supplementaires</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tokenPacks.map((pack) => (
              <div key={pack.amount} className={`p-5 rounded-xl border-2 text-center ${pack.popular ? "border-[#2563EB] bg-[#2563EB]/5" : "border-border bg-card"} relative`}>
                {pack.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#2563EB] text-white" style={{ fontSize: 10, fontWeight: 600 }}>Populaire</span>
                )}
                <Coins size={24} className={`mx-auto mb-2 ${pack.popular ? "text-[#2563EB]" : "text-muted-foreground"}`} />
                <p style={{ fontSize: 22, fontWeight: 700 }}>{pack.amount.toLocaleString()}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>tokens</p>
                <p style={{ fontSize: 16, fontWeight: 700 }} className="mt-2">{pack.labelPrice}</p>
                <button
                  onClick={() => handlePurchase(pack.amount, pack.priceDzd)}
                  disabled={paymentLoading === pack.amount}
                  className={`w-full mt-3 py-2 flex justify-center items-center gap-2 rounded-lg transition-colors ${pack.popular ? "bg-[#2563EB] text-white hover:bg-[#1d4ed8]" : "border border-border hover:bg-accent"} disabled:opacity-50`}
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {paymentLoading === pack.amount && <Loader2 size={14} className="animate-spin" />}
                  Payer via Baridimob
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Historique de consommation</h3>
            <span className="text-muted-foreground" style={{ fontSize: 12 }}>30 derniers jours</span>
          </div>
          {history.map((log) => (
            <div key={log.id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0 hover:bg-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                  <Zap size={14} className="text-[#2563EB]" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{log.action}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 11 }}>{log.module} - {log.timestamp}</p>
                </div>
              </div>
              <span className="text-red-500" style={{ fontSize: 13, fontWeight: 600 }}>-{log.tokens}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}