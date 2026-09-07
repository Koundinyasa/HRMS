import type { SubNavItem } from "../../components/sidebar.types";

export const ADMIN_CENTER_SUB_NAV: SubNavItem[] = [
  {
    label: "Company",
    path: "company",
    children: [
      { label: "Company Details", path: "details" },
      { label: "Company Documents", path: "documents" },
    ],
  },
  { label: "Settings", path: "settings" },
  { label: "Classifications", path: "classifications" },
  { label: "User Management", path: "user-management" },
  { label: "Workflows", path: "workflows" },
  { label: "ESS", path: "ess",
    children:[
      { label:"Circular",path:"circular"},
      { label:"Policy",path:"policy"},
      { label:"Notification",path:"notification"},
      { label:"Flash News",path:"flash-news"},
      { label:"Help Desk",path:"help-desk"},
      { label:"Poll",path:"poll"},
      { label:"Feeds",path:"feeds"},
      { label:"Memories",path:"memories"},
      { label:"Wall of Fame",path:"wall-of-fame"}
    ]
   },
  { label: "Other Config", path: "other-config" },
  { label: "API Source", path: "api-source" },
];