import { useDashboard } from "../hooks/useDashboard";
import StatsCard from "../components/StatsCard";
import RecentActivity from "../components/RecentActivity";
import WelcomeCard from "../components/welcomeCard";
import {
  EmployeeCompositionChart,
  AgeRangeChart,
  DepartmentDonutChart,
  TenureDistributionChart,
} from "../components/Charts";
import { STAT_CARDS } from "../constants/dashboard.constants";
import CelebrationsCard from "../components/CelebrationsCard";

import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";
import { useState } from "react";

const TENURE_DATA = [{ label: "0-3 mo", count: 58 }];

export default function DashboardPage() {

      const [chatbotOpen, setChatbotOpen] =useState(false);
  const {
    welcome,
    summary,
    departmentWiseCount,
    genderWiseCount,
    ageGroupWiseCount,
    upcomingEvents,
    team,
    avgTenure,
    isLoading,
    isError,
  } = useDashboard();

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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        <WelcomeCard welcomeMessage={welcome.welcomeMessage} />

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {STAT_CARDS.map((card) => (
            <StatsCard
              key={card.key}
              config={card}
              value={summary[card.key]}
              change={0}
            />
          ))}
        </div>
      </div>

      {/* ── Charts row ── */}
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
                <th className="font-medium pb-2" style={{ color: "var(--theme-primary)" }}>
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
                  <td className="py-2.5 font-medium" style={{ color: "var(--theme-primary)" }}>
                    {row.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <TenureDistributionChart data={TENURE_DATA} avgTenure={avgTenure} />
        </div>
      </div>

      {/* ── Notifications + Team + Celebrations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentActivity />

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between border-b border-red-200 pb-2 mb-2">
            <h3 className="text-sm font-semibold text-slate-800">Team</h3>
            <button
              className="text-xs font-medium border border-slate-200 rounded-md px-2 py-1 hover:opacity-80"
              style={{ color: "var(--theme-primary)" }}
            >
              Manage Team
            </button>
          </div>

          {team.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No team members found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs">
                  <th className="font-medium pb-2">Lead Name</th>
                  <th className="font-medium pb-2">Team</th>
                  <th className="font-medium pb-2">Email</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {team.map((m) => (
                  <tr key={m.email} className="border-t border-slate-50">
                    <td className="py-2.5 flex items-center gap-2">
                      {m.profilePhoto ? (
                        <img
                          src={m.profilePhoto}
                          alt={m.leadName}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-slate-200 shrink-0" />
                      )}
                      <span className="truncate">{m.leadName}</span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium text-white"
                        style={{ background: m.badgeColor }}
                      >
                        {m.team}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-500 truncate">{m.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <CelebrationsCard events={upcomingEvents} />


      </div>

      <ChatbotWidget
        isOpen={chatbotOpen}
        onToggle={() =>
          setChatbotOpen(!chatbotOpen)
        }
      />
    </div>
  );
}