import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, History } from "lucide-react";
import WeeklyOffFormModal from "./weeklyoffformmodal";
import { useGetHolidayMastersQuery } from "../api/holidaySettingsApi";
import {
  useListWeeklyOffsQuery,
  useCreateWeeklyOffMutation,
  useUpdateWeeklyOffMutation,
  useDeleteWeeklyOffMutation,
  type WeeklyOff,
} from "../api/weeklyoffApi";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Last 8 months as "Effective From" options, matching the screenshot's dropdown
function buildEffectiveFromOptions(): string[] {
  const now = new Date();
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return `${MONTHS[d.getMonth()]}/${d.getFullYear()}`;
  });
}

function HalfCell({ checked }: { checked: boolean }) {
  return (
    <td className="border-l border-slate-50 px-2 py-3 text-center">
      {checked ? (
        <span className="text-emerald-500">✓</span>
      ) : (
        <span className="text-slate-300">—</span>
      )}
    </td>
  );
}

export default function WeeklyOffPanel() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1); // Feb
  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWeeklyOff, setEditingWeeklyOff] = useState<WeeklyOff | null>(null);

  const { data: masters } = useGetHolidayMastersQuery();
  const activeMasterId = selectedMasterId ?? masters?.[0]?.id ?? 0;
  const activeMasterLabel =
    masters?.find((m) => m.id === activeMasterId)?.label ?? "Master";

  const { data: weeklyOffs, isFetching } = useListWeeklyOffsQuery(
    { masterId: activeMasterId, month: month + 1, year },
    { skip: !activeMasterId }
  );

  const [createWeeklyOff, { isLoading: isCreating }] = useCreateWeeklyOffMutation();
  const [updateWeeklyOff, { isLoading: isUpdating }] = useUpdateWeeklyOffMutation();
  const [deleteWeeklyOff] = useDeleteWeeklyOffMutation();

  const effectiveFromOptions = useMemo(buildEffectiveFromOptions, []);

  const openAddModal = () => {
    setEditingWeeklyOff(null);
    setModalOpen(true);
  };
  const openEditModal = (row: WeeklyOff) => {
    setEditingWeeklyOff(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values: {
    effectiveFrom: string;
    dayOfWeek: string;
    weeks: { firstHalf: boolean; secondHalf: boolean }[];
  }) => {
    const payload = {
      masterId: activeMasterId,
      effectiveFrom: values.effectiveFrom,
      dayOfWeek: values.dayOfWeek as WeeklyOff["dayOfWeek"],
      week1: values.weeks[0],
      week2: values.weeks[1],
      week3: values.weeks[2],
      week4: values.weeks[3],
      week5: values.weeks[4],
    };
    if (editingWeeklyOff) {
      await updateWeeklyOff({ id: editingWeeklyOff.id, ...payload });
    } else {
      await createWeeklyOff(payload);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this weekly off record?")) return;
    await deleteWeeklyOff({ id });
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-end gap-3">
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          <Plus size={14} /> Add Weekly Holiday
        </button>
        <button title="History" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-600">
          <History size={16} />
        </button>
      </div>

      <div className="mb-4">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{`${m}/${year}`}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="w-48 shrink-0 border-r border-slate-100 pr-4">
          {(masters ?? []).map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMasterId(m.id)}
              className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                m.id === activeMasterId
                  ? "bg-indigo-50 font-medium text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-600">
                <th rowSpan={2} className="px-3 py-2 align-bottom">Effective From</th>
                <th rowSpan={2} className="px-3 py-2 align-bottom">Week Day</th>
                <th colSpan={2} className="border-l border-slate-100 px-3 py-1 text-center">1st Week</th>
                <th colSpan={2} className="border-l border-slate-100 px-3 py-1 text-center">2nd Week</th>
                <th colSpan={2} className="border-l border-slate-100 px-3 py-1 text-center">3rd Week</th>
                <th colSpan={2} className="border-l border-slate-100 px-3 py-1 text-center">4th Week</th>
                <th colSpan={2} className="border-l border-slate-100 px-3 py-1 text-center">5th Week</th>
                <th rowSpan={2} className="px-3 py-2 align-bottom">Action</th>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50 text-center text-slate-500">
                {Array.from({ length: 5 }).flatMap((_, i) => [
                  <th key={`${i}-1`} className="border-l border-slate-50 px-2 py-1 font-normal">1st</th>,
                  <th key={`${i}-2`} className="px-2 py-1 font-normal">2nd</th>,
                ])}
              </tr>
            </thead>
            <tbody>
              {isFetching && (
                <tr>
                  <td colSpan={13} className="px-3 py-6 text-center text-slate-400">Loading…</td>
                </tr>
              )}
              {!isFetching && (weeklyOffs ?? []).length === 0 && (
                <tr>
                  <td colSpan={13} className="bg-amber-50 px-3 py-4 text-center text-amber-700">
                    No Record Found
                  </td>
                </tr>
              )}
              {(weeklyOffs ?? []).map((row) => (
                <tr key={row.id} className="border-b border-slate-50">
                  <td className="px-3 py-3 text-slate-700">{row.effectiveFrom}</td>
                  <td className="px-3 py-3 text-slate-500">{row.dayOfWeek}</td>
                  <HalfCell checked={row.week1.firstHalf} />
                  <HalfCell checked={row.week1.secondHalf} />
                  <HalfCell checked={row.week2.firstHalf} />
                  <HalfCell checked={row.week2.secondHalf} />
                  <HalfCell checked={row.week3.firstHalf} />
                  <HalfCell checked={row.week3.secondHalf} />
                  <HalfCell checked={row.week4.firstHalf} />
                  <HalfCell checked={row.week4.secondHalf} />
                  <HalfCell checked={row.week5.firstHalf} />
                  <HalfCell checked={row.week5.secondHalf} />
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEditModal(row)} className="text-slate-400 hover:text-blue-500">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <WeeklyOffFormModal
        isOpen={modalOpen}
        masterLabel={activeMasterLabel}
        effectiveFromOptions={effectiveFromOptions}
        initialData={editingWeeklyOff}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}