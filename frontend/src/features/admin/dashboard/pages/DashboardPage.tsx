




import { useNavigate, useParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import StatsCard from "../components/StatsCard";
import WelcomeCard from "../components/welcomeCard";
import {
  EmployeeCompositionChart,
  AgeRangeChart,
  DepartmentDonutChart,
  TenureDistributionChart,
} from "../components/Charts";
import { STAT_CARDS } from "../constants/dashboard.constants";
import BirthdayCard from "@/features/employee/dashboard/components/BirthdayCard";
import ClassificationWiseChart from "../components/ClassificationWiseChart";
import TeamCard from "../components/TeamCard";
import type { KpiSummary } from "../types/dashboard.types";

// Only the Total Current Employees card navigates; the other cards are not clickable.
const STAT_CARD_NAV: Partial<Record<keyof KpiSummary, string>> = {
  totalEmployees: "EmployeeDetails",
};

// Shared Figma card surface
const CARD =
  "min-w-0 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_6px_rgba(15,23,42,0.06),0_10px_28px_rgba(15,23,42,0.14)]";

// BirthdayCard lives in another feature folder, so its surface is matched to
// Figma from here. Styling only — no behaviour is touched.
const BIRTHDAY_OVERRIDES = [
  "h-full min-w-0",
  "[&>div:first-child]:!flex [&>div:first-child]:!h-full [&>div:first-child]:!flex-col",
  "[&>div:first-child]:!rounded-2xl [&>div:first-child]:!border-slate-100",
  "[&>div:first-child]:!px-4 [&>div:first-child]:!pb-3 [&>div:first-child]:!pt-4",
  "[&>div:first-child]:!shadow-[0_2px_6px_rgba(15,23,42,0.06),0_10px_28px_rgba(15,23,42,0.14)]",
  // Compact text sizes
  "[&_h2]:!text-[15px] [&_h3]:!text-[15px] [&_h3]:!font-medium [&_h3]:!text-slate-900",
  "[&_h4]:!text-[14px] [&_p]:!text-[11px] [&_p]:!leading-snug [&_span]:!text-[11px]",
  // Compact spacing
  "[&>div:first-child_*]:!mt-1.5 [&>div:first-child_*]:!mb-0",
  // Smaller illustration
  "[&_img]:!mx-auto [&_img]:!h-[105px] [&_img]:!w-auto [&_img]:!max-w-full [&_img]:!object-contain",
  // Smaller buttons
  "[&_button]:!rounded-md [&_button]:!py-1.5 [&_button]:!text-[11px]",
  "[&_svg]:!h-3.5 [&_svg]:!w-3.5",
].join(" ");

export default function DashboardPage() {
  const navigate = useNavigate();
  const { domain } = useParams();

  const {
    welcome,
    summary,
    departmentWiseCount,
    genderWiseCount,
    ageGroupWiseCount,
    team,
    avgTenure,
    TenureDatum,
    isLoading,
    isError,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  if (isError || !summary || !welcome) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-red-500">
        Could not load dashboard summary. Please try again.
      </div>
    );
  }

  const menPct =
    genderWiseCount.find((g) => g.gender === "Male")?.percentage ?? 0;
  const womenPct =
    genderWiseCount.find((g) => g.gender === "Female")?.percentage ?? 0;

  const ageRangeData = ageGroupWiseCount.map((a) => ({
    range: a.ageBetween,
    men: a.male,
    women: a.female,
  }));

  // Figma: Engineering blue, HR orange, Development purple, Design pink
  const DEPT_COLORS = [
    "#0A7CF0",
    "#F97316",
    "#8B5CF6",
    "#EC4899",
    "#1DB884",
    "#F59E0B",
  ];
  const deptData = departmentWiseCount.map((d, i) => ({
    name: d.department,
    value: d.count,
    color: DEPT_COLORS[i % DEPT_COLORS.length],
  }));

  return (
    <div className="flex w-full min-w-0 flex-col gap-5 pb-2 text-slate-800">
      {/* ── Row 1: Welcome + stat cards ── */}
      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <WelcomeCard
            welcomeMessage={welcome.welcomeMessage}
            profilePhoto={welcome.profilePhoto}
            fullName={welcome.fullName}
          />
        </div>

        <div className="grid min-w-0 grid-cols-2 content-start gap-5 sm:grid-cols-3 lg:col-span-8">
          {STAT_CARDS.map((card) => {
            const key = card.key as keyof KpiSummary;
            const target = STAT_CARD_NAV[key];
            return (
              <StatsCard
                key={card.key}
                config={card}
                value={summary[key]}
                change={0}
                onClick={
                  target && domain
                    ? () => navigate(`/${domain}/admin/enrollment/${target}`)
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>

      {/* ── Row 2: Composition / Age range / Department ── */}
      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.58fr)_minmax(0,1fr)]">
        <div className={`${CARD} px-8 pb-4 pt-4 lg:min-h-[272px]`}>
          <h3 className="mb-3 text-center text-[18px] font-normal text-slate-900">
            Employee Composition
          </h3>
          <EmployeeCompositionChart men={menPct} women={womenPct} />
        </div>

        <div className={`${CARD} px-7 pb-4 pt-6 lg:min-h-[272px]`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[18px] font-normal text-slate-900">Age range</h3>
            <div className="flex items-center gap-8 text-[14px]">
              <span className="text-slate-700">All</span>
              <span className="text-[#1DB884]">Men</span>
              <span className="text-[#5B35E8]">Women</span>
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-slate-400 text-[11px] font-bold text-white">
                ?
              </span>
            </div>
          </div>
          <AgeRangeChart data={ageRangeData} />
        </div>

        <div className={`${CARD} px-3 pb-4 pt-5 lg:min-h-[272px]`}>
          <h3 className="mb-1 text-center text-[18px] font-normal text-slate-900">
            Department Distribution
          </h3>
          <DepartmentDonutChart
            data={deptData}
            total={summary.totalEmployees}
          />
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
            {deptData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ background: d.color }}
                />
                <span className="text-[11px] leading-tight text-slate-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Salary details / Tenure ── */}
      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={`${CARD} px-4 pb-5 pt-4 lg:min-h-[338px]`}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[20px] font-semibold text-slate-900">
              Salary Details
            </h3>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-[#EEF3FA] px-2 py-1 text-[12px] text-slate-700 hover:bg-[#E2EAF6]"
            >
              Filter
              <SlidersHorizontal size={16} className="text-[#1E3A8A]" />
            </button>
          </div>
          <table className="w-full table-fixed text-[14px]">
            <thead>
              <tr className="text-left">
                <th className="w-1/4 pb-4 font-normal text-slate-900">Paymonth</th>
                <th className="w-1/4 pb-4 font-normal text-[#1DB884]">Earnings</th>
                <th className="w-1/4 pb-4 text-center font-normal text-[#E5262B]">Deductions</th>
                <th className="w-1/4 pb-4 text-center font-normal text-[#2F80ED]">Netpay</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="h-[190px] text-center align-middle text-[13px] text-slate-400">
                  No salary data available.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={`${CARD} px-6 pb-4 pt-6 lg:min-h-[338px]`}>
          <TenureDistributionChart data={TenureDatum} avgTenure={avgTenure} />
        </div>
      </div>

      {/* ── Row 4: Classification / Team / Birthdays ── */}
      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12 [&>*]:min-w-0 [&>*]:lg:min-h-[415px]">
        <div className="lg:col-span-4">
          <ClassificationWiseChart />
        </div>
        <div className="lg:col-span-5">
          <TeamCard team={team} />
        </div>
        <div className={`lg:col-span-3 ${BIRTHDAY_OVERRIDES}`}>
          <BirthdayCard />
        </div>
      </div>
    </div>
  );
}