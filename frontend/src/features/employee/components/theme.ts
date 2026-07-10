export const themes = {
  blue: {
    primary: "#2563EB",
    light: "#DBEAFE",
    border: "#93C5FD",
    cardBg: "#FFFFFF",
    gradient:
      "linear-gradient(90deg,#2563EB,#00C2FF)",
  },

  sky: {
    primary: "#0EA5E9",
    light: "#E0F2FE",
    border: "#7DD3FC",
    cardBg: "#F2FBFF",
    gradient:
      "linear-gradient(90deg,#0EA5E9,#38BDF8)",
  },

  purple: {
    primary: "#6D28D9",
    light: "#EDE9FE",
    border: "#C4B5FD",
    cardBg: "#F8F5FF",
    gradient:
      "linear-gradient(90deg,#6D28D9,#8B5CF6)",
  },

  teal: {
    primary: "#14B8A6",
    light: "#CCFBF1",
    border: "#5EEAD4",
    cardBg: "#F0FDFA",
    gradient:
      "linear-gradient(90deg,#14B8A6,#2DD4BF)",
  },

  pink: {
    primary: "#C026D3",
    light: "#F5D0FE",
    border: "#E879F9",
    cardBg: "#FFF5FD",
    gradient:
      "linear-gradient(90deg,#C026D3,#E879F9)",
  },

  orange: {
    primary: "#F59E0B",
    light: "#FEF3C7",
    border: "#FCD34D",
    cardBg: "#FFF9EC",
    gradient:
      "linear-gradient(90deg,#F59E0B,#FBBF24)",
  },

 emerald: {
  primary: "#10B981",
  light: "#D1FAE5",
  border: "#6EE7B7",
  cardBg: "#F0FDF4",
  gradient:
    "linear-gradient(90deg,#10B981,#34D399)",
},

  slate: {
    primary: "#607D8B",
    light: "#ECEFF1",
    border: "#B0BEC5",
    cardBg: "#F8FAFC",
    gradient:
      "linear-gradient(90deg,#607D8B,#90A4AE)",
  },
};

export type ThemeName = keyof typeof themes;

export const applyTheme = (
  theme: ThemeName
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

  localStorage.setItem(
    "selectedTheme",
    theme
  );
};

export const loadTheme = () => {
  const savedTheme =
    localStorage.getItem(
      "selectedTheme"
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