import { Outlet, useParams } from "react-router-dom";
import TabBar from "@/features/admin/components/TabBar";
import { COMPANY_DETAILS_TABS } from "../constants/company.constants";

export default function CompanyDetailsPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/admin-center/company/details`;

  return (
    <div>
      <TabBar basePath={basePath} tabs={COMPANY_DETAILS_TABS} />
      <Outlet />
    </div>
  );
}