import { createContext, useContext, useEffect, useState } from "react";

const THEMES: Record<string, { primary: string; light: string; sidebar: string; gradient: string }> = {
  blue:   { primary: "#2563EB", light: "#EAF1FE", sidebar: "#EAF1FE", gradient: "linear-gradient(135deg,#1D4ED8,#3B82F6)" },
  cyan:   { primary: "#0284C7", light: "#E0F7FA", sidebar: "#E0F7FA", gradient: "linear-gradient(135deg,#0284C7,#22D3EE)" },
  purple: { primary: "#7C3AED", light: "#F3E8FF", sidebar: "#F3E8FF", gradient: "linear-gradient(135deg,#6D28D9,#A855F7)" },
  teal:   { primary: "#0D9488", light: "#E0F2F1", sidebar: "#E0F2F1", gradient: "linear-gradient(135deg,#0D9488,#2DD4BF)" },
  violet: { primary: "#7C3AED", light: "#EDE9FE", sidebar: "#EDE9FE", gradient: "linear-gradient(135deg,#7C3AED,#C084FC)" },
  orange: { primary: "#D97706", light: "#FFF7ED", sidebar: "#FFF7ED", gradient: "linear-gradient(135deg,#D97706,#FB923C)" },
  rose:   { primary: "#BE185D", light: "#FFF1F2", sidebar: "#FFF1F2", gradient: "linear-gradient(135deg,#BE185D,#FB7185)" },
  slate:  { primary: "#334155", light: "#F1F5F9", sidebar: "#F1F5F9", gradient: "linear-gradient(135deg,#334155,#94A3B8)" },
};

interface ThemeContextType {
  themeId: string;
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeId: "blue",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<string>(
    () => localStorage.getItem("hrms_theme") ?? "blue"
  );

  const applyTheme = (id: string) => {
    const theme = THEMES[id] ?? THEMES.blue;
    const root = document.documentElement;
    root.style.setProperty("--theme-primary",  theme.primary);
    root.style.setProperty("--theme-light",    theme.light);
    root.style.setProperty("--theme-sidebar",  theme.sidebar);
    root.style.setProperty("--theme-gradient", theme.gradient);
  };

  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);

  const setTheme = (id: string) => {
    setThemeId(id);
    localStorage.setItem("hrms_theme", id);
    applyTheme(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}