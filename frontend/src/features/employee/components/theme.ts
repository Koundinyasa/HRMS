export const themes = {
  blue: {
    primary: "#3B82F6",
    light: "#EFF6FF",
    border: "#BFDBFE",
    cardBg: "#FFFFFF",
    gradient:
      "linear-gradient(90deg,#3B82F6,#60A5FA)",
  },

  sky: {
    primary: "#38BDF8",
    light: "#F0F9FF",
    border: "#BAE6FD",
    cardBg: "#FFFFFF",
    gradient:
      "linear-gradient(90deg,#38BDF8,#7DD3FC)",
  },

  purple: {
    primary: "#8B5CF6",
    light: "#F5F3FF",
    border: "#DDD6FE",
    cardBg: "#FFFFFF",
    gradient:
      "linear-gradient(90deg,#8B5CF6,#A78BFA)",
  },

  teal: {
    primary: "#4F46E5",
    light: "#EEF2FF",
    border: "#C7D2FE",
    cardBg: "#FFFFFF",
    gradient:
      "linear-gradient(90deg,#4F46E5,#818CF8)",
  },

  pink: {
    primary: "#EC4899",
    light: "#FDF2F8",
    border: "#FBCFE8",
    cardBg: "#FFFFFF",
    gradient:
      "linear-gradient(90deg,#EC4899,#F472B6)",
  },

  cyan: {
    primary: "#06B6D4",
    light: "#ECFEFF",
    border: "#A5F3FC",
    cardBg: "#FFFFFF",
    gradient:
      "linear-gradient(90deg,#06B6D4,#67E8F9)",
  },

  indigo: {
    primary: "#6366F1",
    light: "#EEF2FF",
    border: "#C7D2FE",
    cardBg: "#FFFFFF",
    gradient:
      "linear-gradient(90deg,#6366F1,#A5B4FC)",
  },

  slate: {
    primary: "#64748B",
    light: "#F8FAFC",
    border: "#CBD5E1",
    cardBg: "#FFFFFF",
    gradient:
      "linear-gradient(90deg,#64748B,#94A3B8)",
  },
};

export type ThemeName = keyof typeof themes;

export const applyTheme = (
  theme: ThemeName,
  employeeId?: string
) => {



  const selected = themes[theme];



  document.documentElement.style.setProperty(
    "--primary-color",
    selected.primary
  );

  document.documentElement.style.setProperty(
    "--primary-light",
    selected.light
  );

  document.documentElement.style.setProperty(
    "--primary-border",
    selected.border
  );

  document.documentElement.style.setProperty(
    "--primary-gradient",
    selected.gradient
  );

  document.documentElement.style.setProperty(
    "--card-bg",
    selected.cardBg
  );

  if (employeeId) {
    localStorage.setItem(
      `selectedTheme_${employeeId}`,
      theme
    );
  }
};

export const loadTheme = (
  employeeId?: string
) => {
  if (!employeeId) {
    applyTheme("blue");
    return;
  }

  const savedTheme =
    localStorage.getItem(
      `selectedTheme_${employeeId}`
    ) as ThemeName | null;

  if (
    savedTheme &&
    themes[savedTheme]
  ) {
    applyTheme(savedTheme);
  } else {
    applyTheme("blue");
  }
};