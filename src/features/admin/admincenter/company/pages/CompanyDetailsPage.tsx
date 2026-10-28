






// import { Outlet, useParams } from "react-router-dom";
// import TabBar from "@/features/admin/components/TabBar";
// import { COMPANY_DETAILS_TABS } from "../constants/company.constants";

// export default function CompanyDetailsPage() {
//   const { domain } = useParams();
//   const basePath = `/${domain}/admin/admin-center/company/details`;

//   return (
//     <div className="company-details-theme w-full max-w-full overflow-x-hidden bg-[#F4F6FA] px-2 pb-6 sm:px-4 md:px-6">
//       <TabBar basePath={basePath} tabs={COMPANY_DETAILS_TABS} />
//       <div className="w-full min-w-0 max-w-full">
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
    <div className="company-details-theme w-full max-w-full overflow-x-hidden bg-[#F6F3FF] px-2 pb-6 font-['Urbanist'] sm:px-4 md:px-6">
      <TabBar basePath={basePath} tabs={COMPANY_DETAILS_TABS} />
      <div className="w-full min-w-0 max-w-full">
        <Outlet />
      </div>
    </div>
  );
}