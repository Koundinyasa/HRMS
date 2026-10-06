import { Clock3, Funnel, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReportSection from "../components/ReportSection";

const groups = [
  {
    title: "Leave Report",
    items: [
      ["Leave Allotment Report", "leave-allotment-report"],
      ["Leave Availed Report", "leave-availed-report"],
      ["Leave Lapsed Report", "leave-lapsed-report"],
      ["Leave Encashed Report", "leave-encashed-report"],
      ["Leave Summary Report", "leave-summary-report"],
      ["Leave Summary Report Between Months", "leave-summary-report-between-months"],
      ["Leave Summary Report (Detailed)", "leave-summary-report-detailed"],
      ["Leave History Report (Month-Wise)", "leave-history-report-month-wise"],
      ["Leave History Report (Date-Wise)", "leave-history-report-date-wise"],
    ],
  },
  {
    title: "Attendance Report",
    items: [
      ["Attendance Independent Report", "attendance-independent-report"],
      ["Hourly Attendance Report", "hourly-attendance-report"],
      ["Attendance Integration Report", "attendance-integration-report"],
    ],
  },
  {
    title: "Additional Report",
    items: [
      ["Over Time Report", "over-time-report"],
      ["Late In Early Out Report", "late-in-early-out-report"],
      ["Late In Early Out Report (Monthly)", "late-in-early-out-report-monthly"],
      ["Exception Report-Reconcile", "exception-report-reconcile"],
    ],
  },
  {
    title: "Add. Attendance Report",
    items: [
      ["Top Attendance", "top-attendance"],
      ["Top Leave Taken", "top-leave-taken"],
    ],
  },
];

export default function LeaveReportLandingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full bg-[#f3f7fc] p-4 font-serif md:px-9 md:py-7">
      <div className="min-h-[calc(100vh-4rem)] bg-white p-4 md:px-6 md:py-6">
        <header className="mb-7 flex min-h-[60px] items-center justify-between rounded-[12px] border border-[#df8d7c] bg-[#fff7f5] px-4 shadow-sm">
          <div className="flex h-[40px] items-center gap-2 rounded-[9px] border border-[#df8d7c] bg-white px-4 text-[#9a5547] shadow-sm">
            <Percent size={17} strokeWidth={1.8} />
            <h1 className="text-[21px] font-bold leading-7">Leave Report</h1>
          </div>
          <div className="flex items-center gap-3 text-[#777]">
            <button type="button" title="Recent reports" className="p-1 hover:text-[#9a5547]">
              <Clock3 size={18} strokeWidth={1.8} />
            </button>
            <button type="button" title="Filter reports" className="p-1 hover:text-[#9a5547]">
              <Funnel size={18} strokeWidth={1.8} />
            </button>
          </div>
        </header>

      <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-8 md:grid-cols-2 2xl:grid-cols-3">
        {groups.map((group) => (
          <ReportSection
            key={group.title}
            title={group.title}
            reports={group.items.map(([label]) => label)}
            onReportClick={(label) => {
              const item = group.items.find(([name]) => name === label);
              if (item) navigate(item[1]);
            }}
          />
        ))}
      </div>
      </div>
    </main>
  );
}
