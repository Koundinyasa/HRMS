import { useNavigate, useParams } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import StatsCard from "../components/StatsCard";
import WelcomeCard from "../components/welcomeCard";
import {EmployeeCompositionChart,AgeRangeChart,DepartmentDonutChart,TenureDistributionChart} from "../components/Charts";
import { STAT_CARDS } from "../constants/dashboard.constants";
import CelebrationsCard from "../components/CelebrationsCard";
import ClassificationWiseChart from "../components/ClassificationWiseChart";
import TeamCard from "../components/TeamCard";
import type { KpiSummary } from "../types/dashboard.types";
 
/** Maps dashboard KPI cards → Employee Details list (with optional filter query). */
const STAT_CARD_NAV: Partial<Record<keyof KpiSummary, string>> = {
  totalEmployees: "EmployeeDetails",
  confirmationPending: "EmployeeDetails?type=confirmation-pending",
  joinedEmployee: "EmployeeDetails?type=joined",
  leftEmployee: "EmployeeDetails?type=left",
  // openPositions has no employee-list equivalent yet
};
 
export default function DashboardPage() {
  const navigate = useNavigate();
  const { domain } = useParams();
 
  const {welcome,summary,departmentWiseCount,genderWiseCount,ageGroupWiseCount,upcomingEvents,team,avgTenure,TenureDatum,isLoading,isError} = useDashboard();
 
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-400 text-sm">
        Loading dashboard...
      </div>
    );
  }
 
  if (isError || !summary || !welcome) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500 text-sm">
        Could not load dashboard summary. Please try again.
      </div>
    );
  }
 
  const menPct = genderWiseCount.find((g) => g.gender === "Male")?.percentage ?? 0;
  const womenPct = genderWiseCount.find((g) => g.gender === "Female")?.percentage ?? 0;
 
  const ageRangeData = ageGroupWiseCount.map((a) => ({
    range: a.ageBetween,
    men: a.male,
    women: a.female,
  }));
 
  const DEPT_COLORS = ["#3B82F6", "#F97316", "#7C3AED", "#EC4899", "#10B981", "#F59E0B"];
  const deptData = departmentWiseCount.map((d, i) => ({
    name: d.department,
    value: d.count,
    color: DEPT_COLORS[i % DEPT_COLORS.length],
  }));
 
  return (
    <div className="flex flex-col gap-5">
 
      {/* ── Top row: Welcome card + stat cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
 
        <WelcomeCard
          welcomeMessage={welcome.welcomeMessage}
          profilePhoto={welcome.profilePhoto}
          fullName={welcome.fullName}
        />
 
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4 items-start">
          {STAT_CARDS.map((card) => {
            const target = STAT_CARD_NAV[card.key];
            return (
              <StatsCard
                key={card.key}
                config={card}
                value={summary[card.key]}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Employee Composition
          </h3>
          <EmployeeCompositionChart men={menPct} women={womenPct} />
        </div>
 
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-800">Age range</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">All</span>
              <span className="text-emerald-500 font-medium">Men</span>
              <span className="text-indigo-500 font-medium">Women</span>
            </div>
          </div>
          <AgeRangeChart data={ageRangeData} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Department Distribution
          </h3>
          <DepartmentDonutChart data={deptData} total={summary.totalEmployees} />
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {deptData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-[11px] text-slate-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* ── Salary table + Tenure chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Salary Details</h3>
            <button className="text-xs font-medium text-slate-500 border border-slate-200 rounded-md px-3 py-1.5 hover:bg-slate-50">
              Filter
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs">
                <th className="font-medium pb-2">Paymonth</th>
                <th className="font-medium pb-2 text-emerald-500">Earnings</th>
                <th className="font-medium pb-2 text-red-500">Deductions</th>
                <th className="font-medium pb-2 text-blue-600">
                  Netpay
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {[
                { month: "Jun/2026", earn: 291358, ded: 20941, net: 270417 },
                { month: "May/2026", earn: 382011, ded: 28290, net: 353721 },
                { month: "Apr/2026", earn: 291358, ded: 20941, net: 270417 },
                { month: "Mar/2026", earn: 382011, ded: 28290, net: 353721 },
              ].map((row) => (
                <tr key={row.month} className="border-t border-slate-50">
                  <td className="py-2.5">{row.month}</td>
                  <td className="py-2.5 text-emerald-600">{row.earn}</td>
                  <td className="py-2.5 text-red-500">{row.ded}</td>
                  <td className="py-2.5 font-medium text-blue-600">
                    {row.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <TenureDistributionChart data={TenureDatum} avgTenure={avgTenure} />
        </div>
      </div>
      {/* ── Notifications + Team + Celebrations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
 
        <ClassificationWiseChart />
 
        <TeamCard team={team} />
 
        <CelebrationsCard events={upcomingEvents} />
      </div>
    </div>
  );
}