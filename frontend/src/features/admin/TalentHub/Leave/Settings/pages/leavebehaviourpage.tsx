import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, History } from "lucide-react";
import {useGetPolicyLeaveDetailQuery,useUpdatePolicyLeaveDetailMutation} from "../api/settingsApi";
import type { LeaveBehaviorSettings } from "../types/leavesettings.types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type SettingTab = "behavior" | "holiday-weekly-off";

export default function LeaveBehaviorPage() {
  const navigate = useNavigate();
  const { domain, policyId, leaveId } = useParams();
  const [activeTab, setActiveTab] = useState<SettingTab>("behavior");

  const { data, isLoading } = useGetPolicyLeaveDetailQuery({
    policyId: Number(policyId),
    leaveId: Number(leaveId),
  });
  const [updateDetail, { isLoading: isSaving }] = useUpdatePolicyLeaveDetailMutation();

  const [form, setForm] = useState<LeaveBehaviorSettings>({
    effectiveFrom: "Apr/2026",
    active: true,
    hideInEss: false,
    dayType: "half",
    priorityMode: "none",
    considerExcessLopAsLop: false,
    excludeHolidayFromEss: false,
    considerLopOnHoliday: false,
    excludeWeeklyOffFromEss: false,
    considerLopOnWeeklyOff: false,
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const setField = <K extends keyof LeaveBehaviorSettings>(
    field: K,
    value: LeaveBehaviorSettings[K]
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    await updateDetail({ policyId: Number(policyId), leaveId: Number(leaveId), body: form });
  };

  const goBack = () => navigate(`/${domain}/admin/talent-hub/leave/settings/policy`);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div /> {/* left side reserved for breadcrumb if needed */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            <Save size={14} />
            Save
          </button>
          <button
            type="button"
            title="History"
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <History size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
        {/* Left sub-nav */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-100 text-blue-600 text-xs font-semibold shrink-0">
              E
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">Employee Leave Policy</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[11px]">
                Loss of Pay
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("behavior")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTab === "behavior" ? "bg-sky-50 text-sky-700 font-medium" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Leave Behaviour
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("holiday-weekly-off")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTab === "holiday-weekly-off"
                ? "bg-sky-50 text-sky-700 font-medium"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Setting For Holiday/Weekly Off
          </button>
        </div>

        {/* Right content */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading...</div>
          ) : activeTab === "behavior" ? (
            <>
              <div className="flex items-center gap-6 pb-4 mb-4 border-b border-slate-100">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Effective From</label>
                  <select
                    value={form.effectiveFrom}
                    onChange={(e) => setField("effectiveFrom", e.target.value)}
                    className="h-9 rounded-lg border border-slate-200 px-3 text-sm bg-white outline-none focus:border-slate-300"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={`${m}/2026`}>
                        {m}/2026
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-600 mt-5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.active}
                    onClick={() => setField("active", !form.active)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      form.active ? "bg-sky-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        form.active ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                  Active
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-600 mt-5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.hideInEss}
                    onClick={() => setField("hideInEss", !form.hideInEss)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      form.hideInEss ? "bg-sky-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        form.hideInEss ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                  Hide in ESS
                </label>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">Day Type</p>
                <div className="flex items-center gap-6">
                  {(["full", "half", "quarter"] as const).map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="radio"
                        checked={form.dayType === type}
                        onChange={() => setField("dayType", type)}
                        className="text-sky-600"
                      />
                      Allow {type.charAt(0).toUpperCase() + type.slice(1)} Day
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                  <input
                    type="radio"
                    checked={form.priorityMode === "none"}
                    onChange={() => setField("priorityMode", "none")}
                    className="text-sky-600"
                  />
                  None
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                  <input
                    type="radio"
                    checked={form.priorityMode === "priority"}
                    onChange={() => setField("priorityMode", "priority")}
                    className="text-sky-600"
                  />
                  Use Priority setting
                </label>

                {form.priorityMode === "priority" && (
                  <label className="flex items-start gap-2 text-sm text-slate-500 pl-6">
                    <input
                      type="checkbox"
                      checked={form.considerExcessLopAsLop}
                      onChange={(e) => setField("considerExcessLopAsLop", e.target.checked)}
                      className="mt-0.5 rounded border-slate-300"
                    />
                    Consider excess <strong>Loss of Pay</strong> taken as LOP, i,e when there is 0 leave
                    balance for priority leave(s)
                  </label>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.excludeHolidayFromEss}
                  onChange={(e) => setField("excludeHolidayFromEss", e.target.checked)}
                  className="rounded border-slate-300"
                />
                Exclude Holiday from ESS
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.considerLopOnHoliday}
                  onChange={(e) => setField("considerLopOnHoliday", e.target.checked)}
                  className="rounded border-slate-300"
                />
                Consider LOP on Holiday
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.excludeWeeklyOffFromEss}
                  onChange={(e) => setField("excludeWeeklyOffFromEss", e.target.checked)}
                  className="rounded border-slate-300"
                />
                Exclude Weekly Off from ESS
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.considerLopOnWeeklyOff}
                  onChange={(e) => setField("considerLopOnWeeklyOff", e.target.checked)}
                  className="rounded border-slate-300"
                />
                Consider LOP on Weekly Off
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}