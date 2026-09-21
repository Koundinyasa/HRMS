import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Plus,Settings as SettingsIcon,Trash2,Pencil,History,DollarSign,Sun,CirclePlus,Star,Heart} from "lucide-react";
import {useGetLeavePoliciesQuery,useGetPolicyLeavesQuery,useDeleteLeavePolicyMutation,useRemoveLeaveFromPolicyMutation} from "../api/settingsApi";
import type { LeaveIconKey } from "../types/leavesettings.types";
import AddLeavePolicyModal from "../components/addleavepolicymodal";
import AddLeaveTypeModal from "../components/addleavetypemodal";

const ICONS: Record<LeaveIconKey, React.ComponentType<{ size?: number }>> = {
  lop: DollarSign,
  cl: Sun,
  sl: CirclePlus,
  rh: Star,
  ml: Heart,
};

export default function PolicyPage() {
  const navigate = useNavigate();
  const { domain } = useParams();

  const { data: policies = [], isLoading: policiesLoading } = useGetLeavePoliciesQuery();
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
  const activePolicyId = selectedPolicyId ?? policies[0]?.policyId ?? null;

  const { data: leaves = [], isLoading: leavesLoading } = useGetPolicyLeavesQuery(
    activePolicyId as number,
    { skip: activePolicyId === null }
  );

  const [deletePolicy] = useDeleteLeavePolicyMutation();
  const [removeLeave] = useRemoveLeaveFromPolicyMutation();

  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<number | null>(null);
  const [leaveTypeModalOpen, setLeaveTypeModalOpen] = useState(false);

  const handleDeletePolicy = async (policyId: number) => {
    if (!confirm("Delete this leave policy?")) return;
    await deletePolicy(policyId);
    if (activePolicyId === policyId) setSelectedPolicyId(null);
  };

  const handleDeleteLeave = async (leaveId: number) => {
    if (!activePolicyId) return;
    if (!confirm("Remove this leave type from the policy?")) return;
    await removeLeave({ policyId: activePolicyId, leaveId });
  };

  const openLeaveSettings = (leaveId: number) => {
    if (!activePolicyId) return;
    navigate(
      `/${domain}/admin/talent-hub/leave/settings/policy/${activePolicyId}/leave/${leaveId}/behavior`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      {/* Policy list */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">Leave Policy</h3>
          <button
            type="button"
            onClick={() => {
              setEditingPolicyId(null);
              setPolicyModalOpen(true);
            }}
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {policiesLoading ? (
            <p className="text-xs text-slate-400">Loading...</p>
          ) : (
            policies.map((policy) => (
              <div
                key={policy.policyId}
                onClick={() => setSelectedPolicyId(policy.policyId)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                  policy.policyId === activePolicyId
                    ? "border-slate-200 bg-slate-50"
                    : "border-transparent hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 text-blue-600 text-xs font-semibold shrink-0">
                    {policy.shortLabel}
                  </span>
                  <span className="text-sm font-medium text-sky-600 truncate">{policy.name}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPolicyId(policy.policyId);
                      setPolicyModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePolicy(policy.policyId);
                    }}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Leave types table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={() => setLeaveTypeModalOpen(true)}
            disabled={!activePolicyId}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-emerald-500 text-emerald-600 text-sm font-medium hover:bg-emerald-50 disabled:opacity-50 transition-colors"
          >
            <Plus size={14} />
            Add Leaves To Employee Leave Policy
          </button>
          <button
            type="button"
            title="History"
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <History size={15} />
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="font-medium pb-3">Leave Name</th>
              <th className="font-medium pb-3">Short Name</th>
              <th className="font-medium pb-3">Active</th>
              <th className="font-medium pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {leavesLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : leaves.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-400">
                  No leave types added to this policy yet.
                </td>
              </tr>
            ) : (
              leaves.map((leave) => {
                const Icon = ICONS[leave.icon] ?? DollarSign;
                return (
                  <tr key={leave.leaveId} className="border-b border-slate-50">
                    <td className="py-3">
                      <span className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                          <Icon size={13} />
                        </span>
                        <span className="text-slate-700">{leave.leaveName}</span>
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        {leave.shortName}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          leave.active ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {leave.active ? "True" : "False"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openLeaveSettings(leave.leaveId)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <SettingsIcon size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLeave(leave.leaveId)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {policyModalOpen && (
        <AddLeavePolicyModal
          policyId={editingPolicyId}
          onClose={() => setPolicyModalOpen(false)}
        />
      )}

      {leaveTypeModalOpen && activePolicyId && (
        <AddLeaveTypeModal
          policyId={activePolicyId}
          onClose={() => setLeaveTypeModalOpen(false)}
        />
      )}
    </div>
  );
}