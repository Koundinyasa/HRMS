import type { LeaveBalance } from "../types/leave.types";

interface Props {
  balances?: LeaveBalance[];
  isLoading: boolean;
}

export default function LeaveBalanceCard({ balances, isLoading }: Props) {
  return (
    <div className="bg-white rounded-md overflow-hidden shadow-sm">
      <div className="flex justify-between bg-[#EDEBFB] px-5 py-3.5 font-bold text-sm text-slate-800">
        <span>Leave</span>
        <span>Balance</span>
      </div>

      {/* The backend scopes balance to the logged-in user, so this never reflects
          whoever is picked in the dropdown. Say so rather than mislead. */}
      <p className="px-5 py-2 text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
        Showing your own balance
      </p>

      {balances?.map((row) => (
        <div
          key={row.leaveTypeId}
          className="flex justify-between px-5 py-3.5 text-sm text-slate-800 border-b border-slate-100"
        >
          <span>{row.code}</span>
          <span>{row.balance}</span>
        </div>
      ))}
      {!isLoading && !balances?.length && (
        <div className="py-6 text-center text-sm text-slate-500">No balance data</div>
      )}
    </div>
  );
}
