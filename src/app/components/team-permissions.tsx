import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Crown,
  UserPlus,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  X,
  Users,
  Settings,
  ChevronDown,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  avatar: string;
  status: "active" | "pending" | "suspended";
  lastActive: string;
  postsApproved: number;
  postsCreated: number;
}

interface ApprovalItem {
  id: string;
  author: string;
  content: string;
  platform: string;
  scheduledDate: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

const teamMembers: TeamMember[] = [
  { id: "1", name: "Karim Benali", email: "karim@acmedz.com", role: "owner", avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzc1MDcxMjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", status: "active", lastActive: "A l'instant", postsApproved: 145, postsCreated: 89 },
  { id: "2", name: "Amira Hadj", email: "amira@acmedz.com", role: "admin", avatar: "", status: "active", lastActive: "Il y a 5m", postsApproved: 78, postsCreated: 156 },
  { id: "3", name: "Yacine Boumediene", email: "yacine@acmedz.com", role: "editor", avatar: "", status: "active", lastActive: "Il y a 2h", postsApproved: 0, postsCreated: 234 },
  { id: "4", name: "Nadia Cherif", email: "nadia@acmedz.com", role: "editor", avatar: "", status: "active", lastActive: "Hier", postsApproved: 0, postsCreated: 67 },
  { id: "5", name: "Omar Mesbah", email: "omar@acmedz.com", role: "viewer", avatar: "", status: "active", lastActive: "Il y a 3h", postsApproved: 0, postsCreated: 0 },
  { id: "6", name: "Lina Bouzid", email: "lina@freelance.dz", role: "editor", avatar: "", status: "pending", lastActive: "-", postsApproved: 0, postsCreated: 0 },
];

const approvals: ApprovalItem[] = [
  { id: "1", author: "Yacine Boumediene", content: "Video showcase nouveau produit - lancement de notre collection printemps avec des images en coulisses !", platform: "Instagram, Facebook", scheduledDate: "3 Avr 2026 a 10:00", status: "pending", submittedAt: "Il y a 1h" },
  { id: "2", author: "Nadia Cherif", content: "Article : 5 facons de booster votre engagement LinkedIn en 2026. Guide detaille avec conseils actionnables.", platform: "LinkedIn, Facebook", scheduledDate: "4 Avr 2026 a 14:00", status: "pending", submittedAt: "Il y a 3h" },
  { id: "3", author: "Yacine Boumediene", content: "Temoignage client spotlight avec @clientheureux. Super avis sur nos resultats Q1.", platform: "Facebook, LinkedIn", scheduledDate: "5 Avr 2026 a 9:00", status: "pending", submittedAt: "Il y a 5h" },
  { id: "4", author: "Nadia Cherif", content: "Annonce vente flash - 40% de reduction sur tous les forfaits annuels ce weekend !", platform: "Toutes les plateformes", scheduledDate: "2 Avr 2026 a 12:00", status: "approved", submittedAt: "Hier" },
  { id: "5", author: "Yacine Boumediene", content: "Meme du Lundi : Quand le client dit 'faites-le ressortir' pour la 100eme fois...", platform: "Instagram, Facebook", scheduledDate: "7 Avr 2026 a 8:00", status: "rejected", submittedAt: "Il y a 2j" },
];

const roleConfig = {
  owner: { icon: Crown, color: "text-yellow-600", bg: "bg-yellow-500/10", label: "Owner" },
  admin: { icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-500/10", label: "Admin" },
  editor: { icon: Edit3, color: "text-green-600", bg: "bg-green-500/10", label: "Editor" },
  viewer: { icon: Eye, color: "text-gray-500", bg: "bg-gray-500/10", label: "Viewer" },
};

const statusConfig = {
  active: { color: "text-green-600", bg: "bg-green-500/10" },
  pending: { color: "text-yellow-600", bg: "bg-yellow-500/10" },
  suspended: { color: "text-red-600", bg: "bg-red-500/10" },
};

export function TeamPermissions() {
  const [activeTab, setActiveTab] = useState<"members" | "approvals" | "roles">("members");
  const [showInvite, setShowInvite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalsList, setApprovalsList] = useState(approvals);

  const filtered = teamMembers.filter((m) =>
    !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingApprovals = approvalsList.filter((a) => a.status === "pending").length;

  const handleApproval = (id: string, action: "approved" | "rejected") => {
    setApprovalsList((prev) => prev.map((a) => a.id === id ? { ...a, status: action } : a));
    toast.success(action === "approved" ? "Post approved!" : "Post rejected");
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Team & Permissions</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>Manage team members, roles, and content approval workflows</p>
          </div>
          <button onClick={() => setShowInvite(true)} className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors flex items-center gap-2" style={{ fontSize: 14, fontWeight: 600 }}>
            <UserPlus size={16} /> Invite Member
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Team Members", value: teamMembers.filter((m) => m.status === "active").length, icon: Users },
            { label: "Pending Invites", value: teamMembers.filter((m) => m.status === "pending").length, icon: Mail },
            { label: "Pending Approvals", value: pendingApprovals, icon: FileCheck },
            { label: "Posts This Month", value: teamMembers.reduce((a, m) => a + m.postsCreated, 0), icon: Edit3 },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</span>
                <s.icon size={16} className="text-muted-foreground" />
              </div>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {([
            { key: "members", label: "Team Members", icon: Users },
            { key: "approvals", label: `Approvals${pendingApprovals > 0 ? ` (${pendingApprovals})` : ""}`, icon: FileCheck },
            { key: "roles", label: "Role Settings", icon: Shield },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.key ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === "members" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search members..." className="pl-8 pr-4 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground" style={{ fontSize: 13 }} />
              </div>
            </div>
            <div className="space-y-2">
              {filtered.map((member) => {
                const R = roleConfig[member.role];
                const S = statusConfig[member.status];
                return (
                  <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-accent flex items-center justify-center shrink-0">
                      {member.avatar ? (
                        <ImageWithFallback src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-muted-foreground" style={{ fontSize: 14, fontWeight: 600 }}>{member.name.split(" ").map((n) => n[0]).join("")}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{member.name}</span>
                        <span className={`px-2 py-0.5 rounded-full ${R.bg} ${R.color} flex items-center gap-1`} style={{ fontSize: 11, fontWeight: 500 }}>
                          <R.icon size={10} /> {R.label}
                        </span>
                        {member.status !== "active" && (
                          <span className={`px-2 py-0.5 rounded-full ${S.bg} ${S.color}`} style={{ fontSize: 11, fontWeight: 500 }}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{member.email} · Last active: {member.lastActive}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {member.postsCreated > 0 && (
                        <div className="text-center">
                          <p style={{ fontSize: 14, fontWeight: 600 }}>{member.postsCreated}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 10 }}>posts</p>
                        </div>
                      )}
                      {member.role !== "owner" && (
                        <select
                          defaultValue={member.role}
                          onChange={() => toast.success("Role updated!")}
                          className="px-3 py-1.5 rounded-lg border border-border bg-input-background text-foreground"
                          style={{ fontSize: 12 }}
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      )}
                      {member.role !== "owner" && (
                        <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive" onClick={() => toast.success("Member removed")}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Approvals Tab */}
        {activeTab === "approvals" && (
          <div className="space-y-3">
            {approvalsList.map((item) => (
              <div key={item.id} className={`p-4 rounded-xl border bg-card ${item.status === "pending" ? "border-yellow-500/30" : "border-border"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.author}</span>
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>· {item.submittedAt}</span>
                      {item.status === "approved" && <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600" style={{ fontSize: 11, fontWeight: 500 }}>Approved</span>}
                      {item.status === "rejected" && <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600" style={{ fontSize: 11, fontWeight: 500 }}>Rejected</span>}
                      {item.status === "pending" && <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600" style={{ fontSize: 11, fontWeight: 500 }}>Pending Review</span>}
                    </div>
                    <p style={{ fontSize: 14 }} className="mb-2">{item.content}</p>
                    <div className="flex items-center gap-3 text-muted-foreground" style={{ fontSize: 12 }}>
                      <span>Platforms: {item.platform}</span>
                      <span>Scheduled: {item.scheduledDate}</span>
                    </div>
                  </div>
                  {item.status === "pending" && (
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <button onClick={() => handleApproval(item.id, "approved")} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button onClick={() => handleApproval(item.id, "rejected")} className="px-4 py-2 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 500 }}>
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <div className="space-y-4">
            {([
              { role: "Admin", desc: "Full access. Can manage team, approve content, and access all settings.", perms: ["Manage team", "Approve/reject content", "Create & schedule posts", "Access analytics", "Manage billing & settings"] },
              { role: "Editor", desc: "Can create and edit content. Posts require approval before publishing.", perms: ["Create & edit posts", "Submit for approval", "View analytics", "Access content library"] },
              { role: "Viewer", desc: "Read-only access. Can view analytics and published content.", perms: ["View dashboard", "View analytics", "View published content", "Download reports"] },
            ]).map((r) => (
              <div key={r.role} className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={18} className="text-[#2563EB]" />
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>{r.role}</h3>
                </div>
                <p className="text-muted-foreground mb-3" style={{ fontSize: 13 }}>{r.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {r.perms.map((p) => (
                    <span key={p} className="px-3 py-1 rounded-full bg-accent text-foreground" style={{ fontSize: 12 }}>
                      <CheckCircle2 size={10} className="inline mr-1 text-green-500" />{p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-4 rounded-xl border-2 border-dashed border-border bg-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-yellow-500" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Approval Workflow</span>
              </div>
              <p className="text-muted-foreground mb-3" style={{ fontSize: 13 }}>When enabled, all posts created by Editors must be approved by an Admin or Owner before being published or scheduled.</p>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 13 }}>Require approval for editors</span>
                <button className="w-10 h-5.5 rounded-full relative bg-[#2563EB]">
                  <div className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm translate-x-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInvite(false)}>
          <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Invite Team Member</h2>
              <button onClick={() => setShowInvite(false)} className="p-1 rounded-lg hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Email address</label>
                <input placeholder="colleague@company.com" className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30" style={{ fontSize: 14 }} />
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Role</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground" style={{ fontSize: 14 }}>
                  <option>Admin — Full access</option>
                  <option>Editor — Create & edit content</option>
                  <option>Viewer — Read-only access</option>
                </select>
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: 13, fontWeight: 500 }}>Personal message (optional)</label>
                <textarea placeholder="Hey, join our SocialQ team!" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 resize-none" style={{ fontSize: 14 }} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button onClick={() => setShowInvite(false)} className="px-5 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>Cancel</button>
              <button onClick={() => { setShowInvite(false); toast.success("Invitation sent!"); }} className="px-5 py-2.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}