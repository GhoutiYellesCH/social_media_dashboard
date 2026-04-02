import { useState, useCallback } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Calendar,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Smile,
  Link2,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";

const networks = [
  { id: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "#E4405F" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  {
    id: "x",
    label: "X",
    icon: () => (
      <span style={{ fontSize: 14, fontWeight: 800 }}>𝕏</span>
    ),
    color: "#000000",
  },
];

export function NewPostModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [content, setContent] = useState("");
  const [selectedNetworks, setSelectedNetworks] = useState<Record<string, boolean>>({
    facebook: true,
    instagram: true,
    linkedin: false,
    x: false,
  });
  const [scheduledDate, setScheduledDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<"now" | "schedule" | "queue">("schedule");

  const toggleNetwork = (id: string) => {
    setSelectedNetworks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate file upload
    setUploadedFiles((prev) => [...prev, `media-${prev.length + 1}.jpg`]);
  }, []);

  const handleFileInput = () => {
    setUploadedFiles((prev) => [...prev, `media-${prev.length + 1}.jpg`]);
  };

  const handleSubmit = () => {
    onSubmit({
      content,
      networks: selectedNetworks,
      date: scheduledDate,
      time: scheduledTime,
      files: uploadedFiles,
      scheduleType,
    });
    onClose();
  };

  const charCount = content.length;
  const maxChars = 280;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-[620px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-foreground">Nouvelle Publication</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Platform Toggles */}
          <div>
            <label style={{ fontSize: 13 }} className="text-muted-foreground mb-2 block">
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      active
                        ? "border-[#2563EB] bg-[#2563EB]/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: active ? net.color : "#e5e7eb",
                      }}
                    >
                      <span className="text-white flex items-center justify-center">
                        <Icon size={13} color="white" />
                      </span>
                    </div>
                    <span
                      style={{ fontSize: 13 }}
                      className={active ? "text-foreground" : "text-muted-foreground"}
                    >
                      {net.label}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        active ? "border-[#2563EB] bg-[#2563EB]" : "border-gray-300"
                      }`}
                    >
                      {active && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Input */}
          <div>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Qu'aimeriez-vous partager ?"
                className="w-full h-32 p-4 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-accent/50 text-foreground placeholder:text-muted-foreground/60"
                style={{ fontSize: 14 }}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Smile size={18} />
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Link2 size={18} />
                </button>
                <span
                  style={{ fontSize: 12 }}
                  className={`${charCount > maxChars ? "text-red-500" : "text-muted-foreground"}`}
                >
                  {charCount}/{maxChars}
                </span>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label style={{ fontSize: 13 }} className="text-muted-foreground mb-2 block">
              Media
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileInput}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#2563EB] bg-[#2563EB]/5"
                  : "border-border hover:border-muted-foreground/40 bg-accent/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                  <Upload size={18} className="text-[#2563EB]" />
                </div>
                <p style={{ fontSize: 13 }} className="text-foreground">
                  <span className="text-[#2563EB]" style={{ fontWeight: 600 }}>Click to upload</span>{" "}
                  or drag and drop
                </p>
                <p style={{ fontSize: 12 }} className="text-muted-foreground">
                  PNG, JPG, GIF, MP4 up to 50MB
                </p>
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {uploadedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg"
                  >
                    <ImageIcon size={14} className="text-muted-foreground" />
                    <span style={{ fontSize: 12 }} className="text-foreground">{file}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i));
                      }}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule */}
          <div>
            <label style={{ fontSize: 13 }} className="text-muted-foreground mb-2 block">
              Schedule
            </label>
            <div className="flex gap-2 mb-3">
              {(["now", "schedule", "queue"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setScheduleType(type)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    scheduleType === type
                      ? "border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB]"
                      : "border-border text-muted-foreground hover:border-muted-foreground/30"
                  }`}
                  style={{ fontSize: 13 }}
                >
                  {type === "now" ? "Publier" : type === "schedule" ? "Programmer" : "File d'attente"}
                </button>
              ))}
            </div>
            {scheduleType === "schedule" && (
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
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-card">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors"
            style={{ fontSize: 14 }}
          >
            Annuler
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
              style={{ fontSize: 14 }}
            >
              {scheduleType === "now"
                ? "Publier Maintenant"
                : scheduleType === "schedule"
                ? "Programmer"
                : "Ajouter a la File"}
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}