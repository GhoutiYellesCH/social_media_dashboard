import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  ArrowUpRight,
  Users,
  Filter,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const timeRanges = ["7 Days", "30 Days", "90 Days", "12 Months"];

const monthlyData = [
  { month: "Jan", followers: 12400, impressions: 45200, engagement: 3200 },
  { month: "Feb", followers: 13800, impressions: 52100, engagement: 3800 },
  { month: "Mar", followers: 15200, impressions: 48900, engagement: 4100 },
  { month: "Apr", followers: 16900, impressions: 61200, engagement: 4600 },
  { month: "May", followers: 18400, impressions: 58700, engagement: 5200 },
  { month: "Jun", followers: 20100, impressions: 72300, engagement: 5800 },
  { month: "Jul", followers: 21800, impressions: 68900, engagement: 6100 },
  { month: "Aug", followers: 23500, impressions: 79100, engagement: 6700 },
  { month: "Sep", followers: 25200, impressions: 85400, engagement: 7200 },
  { month: "Oct", followers: 27100, impressions: 91200, engagement: 7800 },
  { month: "Nov", followers: 29300, impressions: 98500, engagement: 8400 },
  { month: "Dec", followers: 31500, impressions: 105800, engagement: 9100 },
];

const contentTypeData = [
  { type: "Image Posts", engagement: 8.2, reach: 12500 },
  { type: "Videos", engagement: 12.5, reach: 18400 },
  { type: "Carousels", engagement: 10.8, reach: 15200 },
  { type: "Stories", engagement: 6.4, reach: 8900 },
  { type: "Text Only", engagement: 3.2, reach: 5600 },
  { type: "Links", engagement: 4.1, reach: 7200 },
];

const topPosts = [
  { content: "Excited to announce our new product line!", impressions: 12400, engagement: "8.7%", platform: "Facebook" },
  { content: "Behind the scenes: Q3 campaigns", impressions: 9800, engagement: "12.3%", platform: "Instagram" },
  { content: "How we grew our audience by 300%", impressions: 8600, engagement: "6.2%", platform: "LinkedIn" },
  { content: "5 tips for social media engagement", impressions: 7200, engagement: "9.1%", platform: "X" },
  { content: "Weekend vibes photo series", impressions: 6900, engagement: "15.4%", platform: "Instagram" },
];

const platformColors: Record<string, string> = {
  Facebook: "#1877F2",
  Instagram: "#E4405F",
  LinkedIn: "#0A66C2",
  X: "#14171A",
};

export function AnalyticsView() {
  const [selectedRange, setSelectedRange] = useState("12 Months");
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* SVG Gradient Definitions */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="analyticsColorFollowers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="text-foreground">Analytics</h1>
          <p style={{ fontSize: 14 }} className="text-muted-foreground mt-0.5">
            Track your social media performance and growth
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-accent rounded-lg p-0.5">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedRange === range
                    ? "bg-white shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontSize: 13 }}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-muted-foreground" style={{ fontSize: 13 }}>
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-accent/20 p-6 space-y-6">
        {/* Platform Filter */}
        <div className="flex gap-2">
          {["All", "Facebook", "Instagram", "LinkedIn", "X"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedPlatform === p
                  ? "border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB]"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
              }`}
              style={{ fontSize: 13 }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Follower Growth */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-foreground">Audience Growth</h3>
              <p style={{ fontSize: 13 }} className="text-muted-foreground">
                Total followers across platforms
              </p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-600" style={{ fontSize: 13, fontWeight: 600 }}>
              <TrendingUp size={14} />
              +154% YoY
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                formatter={(value: number) => [value.toLocaleString(), "Followers"]}
              />
              <Area id="analytics-area-followers" type="monotone" dataKey="followers" stroke="#2563EB" fill="url(#analyticsColorFollowers)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Impressions vs Engagement */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-1">Impressions vs Engagement</h3>
            <p style={{ fontSize: 13 }} className="text-muted-foreground mb-4">Monthly comparison</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Line id="analytics-line-imp" type="monotone" dataKey="impressions" stroke="#2563EB" strokeWidth={2} dot={false} />
                <Line id="analytics-line-eng" type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={2} dot={false} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Content Type Performance */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-foreground mb-1">Content Type Performance</h3>
            <p style={{ fontSize: 13 }} className="text-muted-foreground mb-4">Engagement rate by content type</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={contentTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" unit="%" />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" width={80} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar id="analytics-bar-content" dataKey="engagement" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-foreground mb-1">Top Performing Posts</h3>
          <p style={{ fontSize: 13 }} className="text-muted-foreground mb-4">Your best content this period</p>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Post</th>
                <th className="text-left py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Platform</th>
                <th className="text-right py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Impressions</th>
                <th className="text-right py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Engagement</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post, i) => (
                <tr key={i} className="border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors">
                  <td className="py-3" style={{ fontSize: 13 }}>{post.content}</td>
                  <td className="py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-white"
                      style={{ fontSize: 11, fontWeight: 600, backgroundColor: platformColors[post.platform] }}
                    >
                      {post.platform}
                    </span>
                  </td>
                  <td className="py-3 text-right" style={{ fontSize: 13 }}>{post.impressions.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <span className="text-green-600" style={{ fontSize: 13, fontWeight: 600 }}>{post.engagement}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}