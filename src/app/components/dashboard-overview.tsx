import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  ArrowUpRight,
  CalendarDays,
  Clock,
  Zap,
  Coins,
} from "lucide-react";
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

const engagementData = [
  { day: "Mon", impressions: 4200, engagement: 380, clicks: 120 },
  { day: "Tue", impressions: 5800, engagement: 490, clicks: 210 },
  { day: "Wed", impressions: 4900, engagement: 420, clicks: 175 },
  { day: "Thu", impressions: 7200, engagement: 610, clicks: 290 },
  { day: "Fri", impressions: 6100, engagement: 530, clicks: 240 },
  { day: "Sat", impressions: 3800, engagement: 310, clicks: 95 },
  { day: "Sun", impressions: 3200, engagement: 250, clicks: 80 },
];

const platformData = [
  { name: "Facebook", value: 35, color: "#1877F2" },
  { name: "Instagram", value: 30, color: "#E4405F" },
  { name: "LinkedIn", value: 20, color: "#0A66C2" },
  { name: "X", value: 15, color: "#14171A" },
];

const bestTimesData = [
  { time: "6AM", engagement: 12 },
  { time: "8AM", engagement: 35 },
  { time: "10AM", engagement: 65 },
  { time: "12PM", engagement: 82 },
  { time: "2PM", engagement: 58 },
  { time: "4PM", engagement: 45 },
  { time: "6PM", engagement: 72 },
  { time: "8PM", engagement: 90 },
  { time: "10PM", engagement: 40 },
];

const recentActivity = [
  { text: "Nouveau article blog : Comment grandir...", platform: "Facebook", engagement: "+12.4%", time: "Il y a 2h", trend: "up" },
  { text: "Cafe + creativite = le combo...", platform: "Instagram", engagement: "+8.7%", time: "Il y a 5h", trend: "up" },
  { text: "5 astuces pour ameliorer votre...", platform: "Facebook", engagement: "-2.1%", time: "Hier", trend: "down" },
  { text: "Dans les coulisses : Notre equipe...", platform: "LinkedIn", engagement: "+15.3%", time: "Hier", trend: "up" },
];

const stats = [
  { label: "Impressions Totales", value: "35.2K", change: "+12.5%", up: true, icon: Eye, color: "#2563EB" },
  { label: "Engagements", value: "2,990", change: "+8.3%", up: true, icon: Heart, color: "#E4405F" },
  { label: "Clics sur Liens", value: "1,210", change: "+5.7%", up: true, icon: ArrowUpRight, color: "#10B981" },
  { label: "Nouveaux Abonnes", value: "+847", change: "-2.1%", up: false, icon: Users, color: "#8B5CF6" },
];

export function DashboardOverview({ onNewPost }: { onNewPost: () => void }) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* SVG Gradient Definitions (hidden, referenced by charts) */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="dashColorImp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="dashColorEng" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="text-foreground">Tableau de Bord</h1>
          <p style={{ fontSize: 14 }} className="text-muted-foreground mt-0.5">
            Bienvenue ! Voici un apercu de vos performances sur les reseaux sociaux.
          </p>
        </div>
        <button
          onClick={onNewPost}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
          style={{ fontSize: 14 }}
        >
          + Nouvelle Publication
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-accent/20 p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.color + "12" }}
                >
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    stat.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                  }`}
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </span>
              </div>
              <p style={{ fontSize: 28, fontWeight: 700 }} className="text-foreground">
                {stat.value}
              </p>
              <p style={{ fontSize: 13 }} className="text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Engagement Trend */}
          <div className="col-span-2 bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-foreground">Performance Hebdomadaire</h3>
                <p style={{ fontSize: 13 }} className="text-muted-foreground">
                  Impressions, engagement & clicks
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
                  <span style={{ fontSize: 12 }} className="text-muted-foreground">Impressions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span style={{ fontSize: 12 }} className="text-muted-foreground">Engagement</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span style={{ fontSize: 12 }} className="text-muted-foreground">Clicks</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Area id="dash-area-imp" type="monotone" dataKey="impressions" stroke="#2563EB" fill="url(#dashColorImp)" strokeWidth={2} />
                <Area id="dash-area-eng" type="monotone" dataKey="engagement" stroke="#10B981" fill="url(#dashColorEng)" strokeWidth={2} />
                <Area id="dash-area-clicks" type="monotone" dataKey="clicks" stroke="#F59E0B" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Split */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-1">Repartition par Plateforme</h3>
            <p style={{ fontSize: 13 }} className="text-muted-foreground mb-4">
              Engagement par plateforme
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  id="dash-pie-platform"
                  data={platformData}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {platformData.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span style={{ fontSize: 13 }} className="text-foreground">{p.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }} className="text-foreground">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Best Times */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-[#F59E0B]" />
              <h3 className="text-foreground">Meilleurs Horaires</h3>
            </div>
            <p style={{ fontSize: 13 }} className="text-muted-foreground mb-4">
              Basee sur les scores d'engagement
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bestTimesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                />
                <Bar id="dash-bar-best" dataKey="engagement" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="col-span-2 bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-foreground">Activite Recente</h3>
                <p style={{ fontSize: 13 }} className="text-muted-foreground">
                  Derniere performance des publications
                </p>
              </div>
            </div>
            <div className="space-y-0">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={14} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p style={{ fontSize: 13 }} className="text-foreground truncate">
                        {item.text}
                      </p>
                      <p style={{ fontSize: 12 }} className="text-muted-foreground">
                        {item.platform} · {item.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0 ml-3 ${
                      item.trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                    }`}
                    style={{ fontSize: 12, fontWeight: 600 }}
                  >
                    {item.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {item.engagement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}