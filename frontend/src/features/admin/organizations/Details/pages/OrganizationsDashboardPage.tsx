// import { MOCK_COMPANY } from "../constants/details.constants";
// import CompanyChipFilter from "../components/CompanyChipFilter";
// import StatCards from "../components/StatCards";

// export default function OrganizationsDashboardPage() {
//   return (
//     <div className="flex w-full min-w-0 flex-col gap-4">
//       {/* Same style as top tab bar */}
//       <div
//         className="
//           flex
//           w-full
//           items-center
//           rounded-2xl
//           border
//           border-slate-100
//           bg-white
//           px-4
//           py-2
//           shadow-[0_2px_8px_rgba(15,23,42,0.06)]
//         "
//       >
//         <CompanyChipFilter
//           companyName={MOCK_COMPANY.name}
//           onClear={() => {}}
//         />
//       </div>

//       <StatCards stats={MOCK_COMPANY.stats} />
//     </div>
//   );
// }









// // import CompanyChipFilter from "../components/CompanyChipFilter";
// // import StatCards from "../components/StatCards";
// // import { useGroupDashboard } from "../hooks/useGroupDashboard";

// // export default function OrganizationsDashboardPage() {
// //   const { company, stats, isLoading, isError } = useGroupDashboard();

// //   if (isLoading) {
// //     return (
// //       <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
// //         Loading dashboard…
// //       </div>
// //     );
// //   }

// //   if (isError) {
// //     return (
// //       <div className="rounded-2xl bg-white p-6 text-sm text-red-500 shadow-sm">
// //         Failed to load dashboard.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex w-full min-w-0 flex-col gap-4">
// //       <div
// //         className="
// //           flex
// //           w-full
// //           items-center
// //           rounded-2xl
// //           border
// //           border-slate-100
// //           bg-white
// //           px-4
// //           py-2
// //           shadow-[0_2px_8px_rgba(15,23,42,0.06)]
// //         "
// //       >
// //         <CompanyChipFilter
// //           companyName={company?.name ?? "—"}
// //           onClear={() => {}}
// //         />
// //       </div>

// //       <StatCards stats={stats} />
// //     </div>
// //   );
// // }











// import CompanyChipFilter from "../components/CompanyChipFilter";
// import StatCards from "../components/StatCards";
// import { useGroupDashboard } from "../hooks/useGroupDashboard";

// export default function OrganizationsDashboardPage() {
//   const { company, stats, isLoading, isError } = useGroupDashboard();

//   if (isLoading) {
//     return (
//       <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
//         Loading dashboard…
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="rounded-2xl bg-white p-6 text-sm text-red-500 shadow-sm">
//         Failed to load dashboard.
//       </div>
//     );
//   }

//   return (
//     <div className="flex w-full min-w-0 flex-col gap-4">
//       <CompanyChipFilter companyName={company?.name ?? "—"} onClear={() => {}} />
//       <StatCards stats={stats} />
//     </div>
//   );
// }












import { useState } from "react";
import CompanyChipFilter from "../components/CompanyChipFilter";
import CompanyDropdown from "../components/CompanyDropdown";
import StatCards from "../components/StatCards";
import { useGroupDashboard } from "../hooks/useGroupDashboard";

export default function OrganizationsDashboardPage() {
  const { company, stats, isLoading, isError } = useGroupDashboard();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading dashboard…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-red-500 shadow-sm">
        Failed to load dashboard.
      </div>
    );
  }

  const companyName = company?.name ?? "—";
  const activeCompany = selectedCompany ?? companyName;

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CompanyChipFilter companyName={activeCompany} onClear={() => {}} />

        <div className="w-40 shrink-0">
          <CompanyDropdown
            companies={[companyName]}
            value={activeCompany}
            onChange={setSelectedCompany}
            variant="plain"
            label="Company List"
          />
        </div>
      </div>

      <StatCards stats={stats} />
    </div>
  );
}