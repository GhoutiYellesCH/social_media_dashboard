import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

const tabs = [
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Security" },
  { icon: Palette, label: "Appearance" },
  { icon: Link2, label: "Integrations" },
  { icon: CreditCard, label: "Billing" },
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    email: "alex@acmeinc.com",
    company: "Acme Inc.",
    role: "Marketing Manager",
    timezone: "UTC-5 (Eastern)",
    language: "English",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    postPublished: true,
    weeklyReport: true,
    teamActivity: false,
    newFollower: false,
  });

  const handleSave = () => {
    toast.success("Settings saved!", { description: "Your changes have been saved successfully." });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Profile Settings</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Manage your personal information</p>
            </div>
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#2563EB] flex items-center justify-center">
                <span className="text-white" style={{ fontSize: 28, fontWeight: 700 }}>AM</span>
              </div>
              <div>
                <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-2" style={{ fontSize: 13, fontWeight: 500 }}>
                  <Camera size={14} /> Change photo
                </button>
                <p className="text-muted-foreground mt-1" style={{ fontSize: 12 }}>JPG, PNG. Max 2MB</p>
              </div>
            </div>
            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Company", key: "company" },
                { label: "Role", key: "role" },
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
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Timezone</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 14 }}>
                  <option>UTC-5 (Eastern)</option>
                  <option>UTC-8 (Pacific)</option>
                  <option>UTC+0 (GMT)</option>
                  <option>UTC+1 (CET)</option>
                </select>
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Language</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 14 }}>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
              Save Changes
            </button>
          </div>
        );

      case "Notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Notification Preferences</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Choose what you want to be notified about</p>
            </div>
            <div className="space-y-4">
              {[
                { key: "email", label: "Email notifications", desc: "Receive notifications via email" },
                { key: "push", label: "Push notifications", desc: "Receive browser push notifications" },
                { key: "postPublished", label: "Post published", desc: "When a scheduled post goes live" },
                { key: "weeklyReport", label: "Weekly report", desc: "Weekly performance summary" },
                { key: "teamActivity", label: "Team activity", desc: "When team members make changes" },
                { key: "newFollower", label: "New followers", desc: "When you gain new followers" },
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
              Save Preferences
            </button>
          </div>
        );

      case "Security":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Security Settings</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Manage your account security</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Change password</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Last changed 30 days ago</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Update</button>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Two-factor authentication</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Enable</button>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Active sessions</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>2 devices currently signed in</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Manage</button>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }} className="text-destructive">Delete account</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        );

      case "Appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Appearance</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Customize the look of your dashboard</p>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }} className="mb-3">Theme</p>
              <div className="grid grid-cols-3 gap-3">
                {["Light", "Dark", "System"].map((theme) => (
                  <button key={theme} className="p-4 rounded-xl border border-border hover:border-[#2563EB] transition-colors text-center">
                    <div className={`w-full h-16 rounded-lg mb-2 ${theme === "Dark" ? "bg-gray-800" : theme === "System" ? "bg-gradient-to-r from-white to-gray-800" : "bg-gray-100"} border border-border`} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{theme}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }} className="mb-3">Accent color</p>
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
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Connect third-party tools and services</p>
            </div>
            {[
              { name: "Canva", desc: "Design images and graphics", connected: true },
              { name: "Google Analytics", desc: "Track website traffic from posts", connected: true },
              { name: "Slack", desc: "Get notifications in Slack", connected: false },
              { name: "Zapier", desc: "Automate workflows", connected: false },
              { name: "Dropbox", desc: "Access media files", connected: false },
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
                  {integration.connected ? "Connected" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        );

      case "Billing":
        return (
          <div className="space-y-6">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600 }} className="mb-1">Billing & Subscription</h3>
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Manage your plan and payment methods</p>
            </div>
            <div className="p-6 rounded-xl border border-[#2563EB] bg-[#2563EB]/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#2563EB]" style={{ fontSize: 13, fontWeight: 600 }}>CURRENT PLAN</p>
                  <p style={{ fontSize: 24, fontWeight: 700 }} className="mt-1">Professional</p>
                </div>
                <span style={{ fontSize: 32, fontWeight: 800 }}>$29<span className="text-muted-foreground" style={{ fontSize: 14, fontWeight: 400 }}>/mo</span></span>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Upgrade Plan</button>
                <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Cancel Subscription</button>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }} className="mb-3">Payment method</p>
              <div className="p-4 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-muted-foreground" />
                  <div>
                    <p style={{ fontSize: 14 }}>•••• •••• •••• 4242</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Expires 12/2027</p>
                  </div>
                </div>
                <button className="text-[#2563EB] hover:underline" style={{ fontSize: 13 }}>Edit</button>
              </div>
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
        <h1 style={{ fontSize: 28, fontWeight: 700 }} className="mb-1">Settings</h1>
        <p className="text-muted-foreground mb-8" style={{ fontSize: 14 }}>Manage your account and preferences</p>

        <div className="flex gap-8">
          {/* Settings nav */}
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

          {/* Content */}
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </main>
  );
}
