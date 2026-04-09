import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import * as api from "./api-client";
import { toast } from "sonner";

export interface TokenUsageLog {
  id: string;
  action: string;
  tokens: number;
  timestamp: string;
  module: string;
  type: "consume" | "earn";
}

interface TokenContextType {
  balance: number;
  totalUsed: number;
  plan: string;
  monthlyAllowance: number;
  history: TokenUsageLog[];
  loading: boolean;
  consumeTokens: (amount: number, action: string, module: string) => Promise<boolean>;
  addTokens: (amount: number) => Promise<void>;
  upgradePlan: (plan: string) => Promise<void>;
  refreshTokens: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType | null>(null);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);
  const [plan, setPlan] = useState("Decouverte");
  const [monthlyAllowance, setMonthlyAllowance] = useState(500);
  const [history, setHistory] = useState<TokenUsageLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTokens = useCallback(async () => {
    try {
      const token = api.getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const [tokenData, historyData] = await Promise.all([
        api.getTokens(),
        api.getTokenHistory(),
      ]);
      setBalance(tokenData.balance ?? 0);
      setTotalUsed(tokenData.totalUsed ?? 0);
      setPlan(tokenData.plan ?? "Decouverte");
      setMonthlyAllowance(tokenData.monthlyAllowance ?? 500);

      // Format history timestamps for display
      const formattedHistory = (historyData || []).map((h: any) => normalizeHistoryItem(h));
      setHistory(formattedHistory);
    } catch (e) {
      console.error("Failed to load tokens:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTokens();
  }, [refreshTokens]);

  const consumeTokens = async (amount: number, action: string, module: string): Promise<boolean> => {
    if (balance < amount) {
      toast.error("Tokens insuffisants", {
        description: `Il vous faut ${amount} tokens. Solde actuel: ${balance}.`,
      });
      return false;
    }

    try {
      const result = await api.consumeTokens(amount, action, module);
      setBalance(result.balance);
      setTotalUsed((t) => t + amount);
      setHistory((prev) => [
        {
          id: result.logEntry.id,
          action,
          tokens: amount,
          module,
          timestamp: "A l'instant",
          type: "consume",
        },
        ...prev,
      ]);
      return true;
    } catch (e: any) {
      if (e.status === 402) {
        toast.error("Tokens insuffisants");
      } else {
        toast.error("Erreur", { description: e.message });
      }
      return false;
    }
  };

  const addTokens = async (amount: number) => {
    try {
      const result = await api.purchaseTokens(amount);
      setBalance(result.balance);
      toast.success(`${amount.toLocaleString()} tokens ajoutes !`);
    } catch (e: any) {
      toast.error("Erreur d'achat", { description: e.message });
    }
  };

  const upgradePlanFn = async (newPlan: string) => {
    try {
      const result = await api.upgradePlan(newPlan);
      setPlan(result.plan);
      setBalance(result.balance);
      setMonthlyAllowance(result.monthlyAllowance);
      toast.success(result.message);
    } catch (e: any) {
      toast.error("Erreur de mise a jour", { description: e.message });
    }
  };

  return (
    <TokenContext.Provider
      value={{
        balance,
        totalUsed,
        plan,
        monthlyAllowance,
        history,
        loading,
        consumeTokens,
        addTokens,
        upgradePlan: upgradePlanFn,
        refreshTokens,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export function useTokens() {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error("useTokens must be used within TokenProvider");
  return ctx;
}

// Helper to format ISO timestamps to relative French time
function formatRelativeTime(isoString: string): string {
  try {
    const now = new Date();
    const date = new Date(isoString);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "A l'instant";
    if (diffMin < 60) return `Il y a ${diffMin}m`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR");
  } catch {
    return isoString;
  }
}

function normalizeHistoryItem(raw: any): TokenUsageLog {
  const inferredType = raw?.type === "earn" || raw?.type === "purchase" ? "earn" : "consume";
  const timestampSource = typeof raw?.timestamp === "string"
    ? raw.timestamp
    : typeof raw?.date === "string"
    ? raw.date
    : new Date().toISOString();

  const rawTokens = Number(raw?.tokens ?? raw?.amount ?? 0);

  return {
    id: typeof raw?.id === "string" && raw.id ? raw.id : crypto.randomUUID(),
    action: typeof raw?.action === "string" && raw.action ? raw.action : "Action IA",
    module: typeof raw?.module === "string" && raw.module ? raw.module : "General",
    tokens: Number.isFinite(rawTokens) ? Math.abs(Math.trunc(rawTokens)) : 0,
    type: inferredType,
    timestamp: formatRelativeTime(timestampSource),
  };
}
