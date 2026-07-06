import { useState, useRef, useEffect } from "react";
import { Check, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const PRESETS = [
  { id: "blue",    label: "Blue",    from: "#1D4ED8", to: "#3B82F6" },
  { id: "cyan",    label: "Cyan",    from: "#0284C7", to: "#22D3EE" },
  { id: "purple",  label: "Purple",  from: "#6D28D9", to: "#A855F7" },
  { id: "teal",    label: "Teal",    from: "#0D9488", to: "#2DD4BF" },
  { id: "violet",  label: "Violet",  from: "#7C3AED", to: "#C084FC" },
  { id: "orange",  label: "Orange",  from: "#D97706", to: "#FB923C" },
  { id: "rose",    label: "Rose",    from: "#BE185D", to: "#FB7185" },
  { id: "slate",   label: "Slate",   from: "#334155", to: "#94A3B8" },
];

export default function ThemePreset() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { themeId, setTheme } = useTheme();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-50 transition-colors"
        style={{ color: "var(--theme-primary)" }}
        title="Theme Preset"
      >
        {/* palette icon */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5S18.33 11 17.5 11z"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[220px] bg-white rounded-2xl border border-slate-100 shadow-xl z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-800">Presets</span>
            <Sun size={16} className="text-slate-400" />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => { setTheme(preset.id); setOpen(false); }}
                title={preset.label}
                className="relative w-full aspect-square rounded-xl overflow-hidden transition-transform hover:scale-105 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                }}
              >
                {themeId === preset.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <Check size={18} className="text-white drop-shadow" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}