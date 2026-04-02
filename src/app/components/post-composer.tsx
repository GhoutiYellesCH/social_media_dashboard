import { useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Smile,
  Link2,
  Image as ImageIcon,
  Upload,
  X,
  Calendar,
  Clock,
  Sparkles,
  Eye,
  ChevronDown,
  Hash,
  AtSign,
  MapPin,
  Heart,
  MessageCircle,
  Share2,
  Coins,
} from "lucide-react";
import { useTokens } from "./token-context";
import { toast } from "sonner";

const networks = [
  { id: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "#E4405F" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  { id: "x", label: "X", icon: () => <span style={{ fontSize: 13, fontWeight: 800 }}>𝕏</span>, color: "#000" },
];

const aiSuggestions = [
  "Decouvrez notre derniere nouveaute ! Nous avons travaille dur pour vous apporter quelque chose de vraiment special.",
  "Nous sommes ravis de partager nos resultats du T3. L'engagement de notre equipe continue de porter ses fruits.",
  "Reservez la date ! Notre prochain webinaire couvrira les dernieres tendances du marketing digital en 2026.",
];

const hashtags = ["#ReseauxSociaux", "#Marketing", "#Algerie", "#ContentCreation", "#DigitalDZ", "#Engagement"];

export function PostComposer({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [content, setContent] = useState("");
  const [selectedNetworks, setSelectedNetworks] = useState<Record<string, boolean>>({
    facebook: true,
    instagram: true,
    linkedin: false,
    x: false,
  });
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [preview, setPreview] = useState<"facebook" | "instagram" | "linkedin" | "x">("facebook");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const { balance, consumeTokens } = useTokens();

  const toggleNetwork = (id: string) => {
    setSelectedNetworks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const charCount = content.length;
  const charLimits: Record<string, number> = { facebook: 63206, instagram: 2200, linkedin: 3000, x: 280 };
  const activeNetworks = Object.entries(selectedNetworks).filter(([, v]) => v).map(([k]) => k);
  const minLimit = Math.min(...activeNetworks.map((n) => charLimits[n] || 280));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="text-foreground">Composer une Publication</h1>
          <p style={{ fontSize: 14 }} className="text-muted-foreground mt-0.5">
            Creez et previsualiser votre publication sur toutes les plateformes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors" style={{ fontSize: 14 }}>
            Brouillon
          </button>
          <button
            onClick={() =>
              onSubmit({
                content,
                networks: selectedNetworks,
                date: scheduledDate,
                time: scheduledTime,
                files: uploadedFiles,
                scheduleType: "schedule",
              })
            }
            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
            style={{ fontSize: 14 }}
          >
            Programmer
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Composer */}
        <div className="flex-1 overflow-y-auto bg-accent/20 p-6 space-y-5">
          {/* Platform Selection */}
          <div className="bg-card rounded-xl border border-border p-5">
            <label style={{ fontSize: 13, fontWeight: 600 }} className="text-foreground mb-3 block">
              Publier sur
            </label>
            <div className="flex gap-2 flex-wrap">
              {networks.map((net) => {
                const active = selectedNetworks[net.id];
                const Icon = net.icon;
                return (
                  <button
                    key={net.id}
                    onClick={() => toggleNetwork(net.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                      active ? "border-[#2563EB] bg-[#2563EB]/5" : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: active ? net.color : "#e5e7eb" }}>
                      <Icon size={14} color="white" />
                    </div>
                    <span style={{ fontSize: 13 }} className={active ? "text-foreground" : "text-muted-foreground"}>
                      {net.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <label style={{ fontSize: 13, fontWeight: 600 }} className="text-foreground">
                Contenu
              </label>
              <button
                onClick={() => {
                  if (!showAiPanel) {
                    if (balance < 15) {
                      toast.error("Tokens insuffisants", { description: "Il vous faut 15 tokens pour l'assistance IA." });
                      return;
                    }
                  }
                  setShowAiPanel(!showAiPanel);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition-opacity"
                style={{ fontSize: 12 }}
              >
                <Sparkles size={13} />
                IA Assist
                <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20" style={{ fontSize: 10 }}>15 <Coins size={8} className="inline" /></span>
              </button>
            </div>

            {showAiPanel && (
              <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <p style={{ fontSize: 12, fontWeight: 600 }} className="text-purple-700">Suggestions IA</p>
                  <span className="text-purple-500 flex items-center gap-1" style={{ fontSize: 11 }}><Coins size={10} /> 15 tokens par suggestion</span>
                </div>
                <div className="space-y-2">
                  {aiSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={async () => {
                        const success = await consumeTokens(15, "Generation de contenu IA", "Post Composer");
                        if (success) {
                          setContent(s);
                          toast.success("Contenu genere !", { description: "15 tokens utilises." });
                        }
                      }}
                      className="w-full text-left p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 transition-colors"
                      style={{ fontSize: 13 }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Qu'aimeriez-vous partager ?"
              className="w-full h-40 p-4 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-accent/50 text-foreground placeholder:text-muted-foreground/60"
              style={{ fontSize: 14 }}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"><Smile size={18} /></button>
                <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"><Hash size={18} /></button>
                <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"><AtSign size={18} /></button>
                <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"><Link2 size={18} /></button>
                <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"><MapPin size={18} /></button>
              </div>
              <span
                style={{ fontSize: 12 }}
                className={charCount > minLimit ? "text-red-500" : "text-muted-foreground"}
              >
                {charCount}/{minLimit}
              </span>
            </div>

            {/* Hashtag suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {hashtags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setContent((prev) => prev + " " + tag)}
                  className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  style={{ fontSize: 12 }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Media */}
          <div className="bg-card rounded-xl border border-border p-5">
            <label style={{ fontSize: 13, fontWeight: 600 }} className="text-foreground mb-3 block">Medias</label>
            <div
              onClick={() => setUploadedFiles((prev) => [...prev, `media-${prev.length + 1}.jpg`])}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-[#2563EB]/40 transition-colors bg-accent/50"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                  <Upload size={20} className="text-[#2563EB]" />
                </div>
                <p style={{ fontSize: 13 }}>
                  <span className="text-[#2563EB]" style={{ fontWeight: 600 }}>Cliquez pour importer</span> ou glissez-deposez
                </p>
                <p style={{ fontSize: 12 }} className="text-muted-foreground">PNG, JPG, GIF, MP4 jusqu'a 50MB</p>
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg">
                    <ImageIcon size={14} className="text-muted-foreground" />
                    <span style={{ fontSize: 12 }}>{file}</span>
                    <button onClick={() => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-500">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="bg-card rounded-xl border border-border p-5">
            <label style={{ fontSize: 13, fontWeight: 600 }} className="text-foreground mb-3 block">Programmation</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-accent/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  style={{ fontSize: 13 }}
                />
              </div>
              <div className="flex-1 relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-accent/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  style={{ fontSize: 13 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-[360px] border-l border-border bg-card overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-muted-foreground" />
              <span style={{ fontSize: 13, fontWeight: 600 }} className="text-foreground">Apercu</span>
            </div>
            <select
              value={preview}
              onChange={(e) => setPreview(e.target.value as any)}
              className="px-2 py-1 border border-border rounded-lg bg-card text-foreground"
              style={{ fontSize: 12 }}
            >
              {networks.filter((n) => selectedNetworks[n.id]).map((n) => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>
          </div>

          {/* Mock Preview */}
          <div className="border border-border rounded-xl overflow-hidden">
            {/* Post Header */}
            <div className="p-3 flex items-center gap-2.5 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
                <span className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>A</span>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }} className="text-foreground">Acme DZ</p>
                <p style={{ fontSize: 11 }} className="text-muted-foreground">A l'instant · Public</p>
              </div>
            </div>
            {/* Post Content */}
            <div className="p-3">
              <p style={{ fontSize: 13, lineHeight: 1.5 }} className="text-foreground whitespace-pre-wrap">
                {content || "L'apercu de votre publication apparaitra ici..."}
              </p>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="bg-accent h-48 flex items-center justify-center">
                <ImageIcon size={32} className="text-muted-foreground" />
              </div>
            )}
            {/* Post Actions */}
            <div className="p-3 border-t border-border flex items-center justify-around">
              {["J'aime", "Commenter", "Partager"].map((action) => (
                <button key={action} className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: 12 }}>
                  {action === "J'aime" && <Heart size={14} />}
                  {action === "Commenter" && <MessageCircle size={14} />}
                  {action === "Partager" && <Share2 size={14} />}
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Platform tips */}
          <div className="mt-5 p-4 bg-blue-50 rounded-xl">
            <p style={{ fontSize: 12, fontWeight: 600 }} className="text-blue-700 mb-1">
              {preview === "instagram" ? "Conseils Instagram" : preview === "x" ? "Conseils X" : preview === "linkedin" ? "Conseils LinkedIn" : "Conseils Facebook"}
            </p>
            <ul className="space-y-1">
              <li style={{ fontSize: 12 }} className="text-blue-600">• Utilisez 3-5 hashtags pertinents</li>
              <li style={{ fontSize: 12 }} className="text-blue-600">• Les posts avec images ont 2.3x plus d'engagement</li>
              <li style={{ fontSize: 12 }} className="text-blue-600">• Meilleur horaire : 10h - 12h (heure d'Alger)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}