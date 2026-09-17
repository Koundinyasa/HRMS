// import { Outlet, useParams } from "react-router-dom";
// import TabBar from "@/features/admin/components/TabBar";
// import { COMPANY_DETAILS_TABS } from "../constants/company.constants";

// export default function CompanyDetailsPage() {
//   const { domain } = useParams();

//   const basePath = `/${domain}/admin/admin-center/company/details`;

//   return (
//     <div>
//       <TabBar
//         basePath={basePath}
//         tabs={COMPANY_DETAILS_TABS}
//       />

//       <Outlet />
//     </div>
//   );
// }



// import { Outlet, useParams } from "react-router-dom";
// import TabBar from "@/features/admin/components/TabBar";
// import { COMPANY_DETAILS_TABS } from "../constants/company.constants";

// export default function CompanyDetailsPage() {
//   const { domain } = useParams();

//   const basePath = `/${domain}/admin/admin-center/company/details`;

//   return (
//     <div className="w-full min-w-0 min-h-full -m-2 sm:-m-4 lg:-m-6 p-2 sm:p-4 lg:p-6" style={{ backgroundColor: "#EDE9FE" }}>
//       <div className="mb-4">
//         <TabBar basePath={basePath} tabs={COMPANY_DETAILS_TABS} />
//       </div>

//       <div className="w-full min-w-0">
//         <Outlet />
//       </div>
//     </div>
//   );
// }



// import { Outlet, useParams } from "react-router-dom";
// import TabBar from "@/features/admin/components/TabBar";
// import { COMPANY_DETAILS_TABS } from "../constants/company.constants";

// export default function CompanyDetailsPage() {
//   const { domain } = useParams();

//   const basePath = `/${domain}/admin/admin-center/company/details`;

//   return (
//     <div className="w-full min-w-0">
//       <div className="mb-4">
//         <TabBar basePath={basePath} tabs={COMPANY_DETAILS_TABS} />
//       </div>

//       <div className="w-full min-w-0">
//         <Outlet />
//       </div>
//     </div>
//   );
// }










// import { Outlet, useParams } from "react-router-dom";
// import TabBar from "@/features/admin/components/TabBar";
// import { COMPANY_DETAILS_TABS } from "../constants/company.constants";

// export default function CompanyDetailsPage() {
//   const { domain } = useParams();

//   const basePath =
//     `/${domain}/admin/admin-center/company/details`;

//   return (
//     <div className="w-full min-w-0">
//       <div className="mb-4">
//         <TabBar
//           basePath={basePath}
//           tabs={COMPANY_DETAILS_TABS}
//         />
//       </div>

//       <div className="w-full min-w-0">
//         <Outlet />
//       </div>
//     </div>
//   );
// }












// import { Outlet, useParams } from "react-router-dom";
// import TabBar from "@/features/admin/components/TabBar";
// import { COMPANY_DETAILS_TABS } from "../constants/company.constants";

// export default function CompanyDetailsPage() {
//   const { domain } = useParams();

//   const basePath = `/${domain}/admin/admin-center/company/details`;

//   return (
//     <div className="w-full min-w-0">
//       {/* =========================
//           COMPANY DETAILS TABS
//       ========================= */}
//       <div className="mb-4">
//         <TabBar
//           basePath={basePath}
//           tabs={COMPANY_DETAILS_TABS}
//         />
//       </div>

//       {/* =========================
//           SELECTED TAB CONTENT
//       ========================= */}
//       <div className="w-full min-w-0">
//         <Outlet />
//       </div>
//     </div>
//   );
// }







import { Outlet, useParams } from "react-router-dom";
import TabBar from "@/features/admin/components/TabBar";
import { COMPANY_DETAILS_TABS } from "../constants/company.constants";

export default function CompanyDetailsPage() {
  const { domain } = useParams();

  const basePath = `/${domain}/admin/admin-center/company/details`;

  return (
    <div className="w-full min-w-0">
      {/* ================================
          COMPANY DETAILS TAB BAR
      ================================= */}
      <div className="mb-4">
        <TabBar
          basePath={basePath}
          tabs={COMPANY_DETAILS_TABS}
        />
      </div>

      {/* ================================
          SELECTED TAB CONTENT
      ================================= */}
      <div className="w-full min-w-0">
        <Outlet />
      </div>
    </div>
  );
}