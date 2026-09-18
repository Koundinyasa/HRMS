export const CRAFT_REPORT_TABS = [
  { label: "Factory Act Forms (D)", value: "factory-act-forms" },
  { label: "Forms Manager (D)", value: "forms-manager" },
  { label: "Report Writer (D)", value: "report-writer" },
  { label: "General (D)", value: "general" },
];

export const CRAFT_REPORT_CATEGORY_OPTIONS = [
  "Factory Act Forms",
  "Forms Manager",
  "General",
  "Report Writer",
];

// Keys are lowercase — lookups normalize the typed/selected category to lowercase.
export const CRAFT_REPORT_SUBCATEGORY_OPTIONS: Record<string, string[]> = {
  "general": ["general forms", "salary sheets(customized)"],

  "factory act forms": [
    "andhra pradesh",
    "delhi pdf",
    "delhi",
    "demo",
    "goa pdf",
    "goa",
    "gujarat",
    "gujrat pdf",
    "haryana",
    "karnataka",
    "kerala",
    "maharashtra",
    "tamil nadu",
    "telangana",
    "uttar pradesh",
    "west bengal",
  ],

  "forms manager": ["general", "month"],

  "report writer": [],
};