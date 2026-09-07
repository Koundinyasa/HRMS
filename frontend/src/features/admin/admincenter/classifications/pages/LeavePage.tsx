import { Outlet, useParams } from "react-router-dom";
import TabBar from "@/features/admin/components/TabBar";
import LeaveEmployeeCard from "../components/LeaveEmployeeCard";
import LeaveBalanceCard from "../components/LeaveBalanceCard";
import { LEAVE_TABS, LEAVE_SECTION_PATH } from "../constants/leave.constants";
import { useLeave } from "../hooks/useLeave";

export default function LeavePage() {
  const { domain } = useParams();
  const { employees, selectedEmployee, selectedEmployeeId, selectEmployee, balance, balances } =
    useLeave();
  const basePath = `/${domain}/admin/${LEAVE_SECTION_PATH}`;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
        <LeaveEmployeeCard
          employees={employees.data}
          selected={selectedEmployee}
          selectedId={selectedEmployeeId}
          onSelect={selectEmployee}
        />
        <LeaveBalanceCard balances={balances} isLoading={balance.isLoading} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <TabBar basePath={basePath} tabs={LEAVE_TABS} />
        <Outlet />
      </div>
    </div>
  );
}
