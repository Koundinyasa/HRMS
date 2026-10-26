
import ReportCardGroup from "../components/ReportCardGroup";
import type { CardGroup } from "../types/reportUI.types";

const EXIT_MODULE_GROUPS: CardGroup[] = [
  {
    title: "Exit Report",
    items: [
      {
        label: "Exit Report",
        path: "exit-report",
      },
    ],
  },
  {
    title: "Exit Report (Quarterly)",
    items: [
      {
        label: "Exit Report (Quarterly)",
        path: "exit-report-quarterly",
      },
    ],
  },
];

export default function ExitModulePage() {
  return <ReportCardGroup groups={EXIT_MODULE_GROUPS} />;
}