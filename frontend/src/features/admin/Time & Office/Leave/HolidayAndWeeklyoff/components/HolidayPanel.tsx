import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, History } from "lucide-react";
import * as XLSX from "xlsx";
import HolidayFormModal from "./HolidayFormModal";
import {
  useGetHolidayMastersQuery,
  useListHolidaysQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  type Holiday,
} from "../api/holidaySettingsApi";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function Badge({ value }: { value: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-0.5 text-xs font-medium ${
        value ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
      }`}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

export default function HolidayPanel() {
  const [yearType, setYearType] = useState<"calendar" | "financial">("calendar");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1); // Feb = index 1
  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  const { data: masters } = useGetHolidayMastersQuery();
  const activeMasterId = selectedMasterId ?? masters?.[0]?.id ?? 0;
  const activeMasterLabel =
    masters?.find((m) => m.id === activeMasterId)?.label ?? "Master";

  const { data: holidays, isFetching } = useListHolidaysQuery(
    { masterId: activeMasterId, yearType, year, month: month + 1 },
    { skip: !activeMasterId }
  );

  const [createHoliday, { isLoading: isCreating }] = useCreateHolidayMutation();
  const [updateHoliday, { isLoading: isUpdating }] = useUpdateHolidayMutation();
  const [deleteHoliday] = useDeleteHolidayMutation();

  const openAddModal = () => {
    setEditingHoliday(null);
    setModalOpen(true);
  };
  const openEditModal = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setModalOpen(true);
  };

  const handleSubmit = async (values: {
    holidayName: string;
    holidayDate: string;
    isNationalHoliday: boolean;
    isRestrictedHoliday: boolean;
  }) => {
    if (editingHoliday) {
      await updateHoliday({ id: editingHoliday.id, masterId: activeMasterId, ...values });
    } else {
      await createHoliday({ masterId: activeMasterId, ...values });
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this holiday?")) return;
    await deleteHoliday({ id });
  };

  const handleExcelDownload = () => {
    const rows = (holidays ?? []).map((h) => ({
      "Holiday Name": h.holidayName,
      "Holiday Date": h.holidayDate,
      "National Holiday": h.isNationalHoliday ? "Yes" : "No",
      "Restricted Holiday": h.isRestrictedHoliday ? "Yes" : "No",
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Holidays");
    XLSX.writeFile(workbook, `holidays-${MONTHS[month]}-${year}.xlsx`);
  };

  const monthLabel = useMemo(() => `${MONTHS[month]}/${year}`, [month, year]);

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Top bar: year type + year + actions */}
      <div className="mb-4 flex items-center justify-end gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="radio"
            checked={yearType === "calendar"}
            onChange={() => setYearType("calendar")}
          />
          Calendar Year
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="radio"
            checked={yearType === "financial"}
            onChange={() => setYearType("financial")}
          />
          Financial Year
        </label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700"
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          <Plus size={14} /> Add Holiday List
        </button>
        <button
          onClick={handleExcelDownload}
          title="Download Excel"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          X
        </button>
        <button title="History" className="text-slate-400 hover:text-slate-600">
          <History size={18} />
        </button>
      </div>

      {/* Month selector */}
      <div className="mb-4 flex items-center gap-3">
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
        {/* Left: master list */}
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

        {/* Right: holiday table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-600">
                <th className="px-3 py-2">Holiday Name</th>
                <th className="px-3 py-2">Holiday Date</th>
                <th className="px-3 py-2">National Holiday</th>
                <th className="px-3 py-2">Restricted Holiday</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!isFetching && (holidays ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                    No holidays found
                  </td>
                </tr>
              )}
              {(holidays ?? []).map((h) => (
                <tr key={h.id} className="border-b border-slate-50">
                  <td className="px-3 py-3 text-slate-700">{h.holidayName}</td>
                  <td className="px-3 py-3 text-slate-500">{h.holidayDate}</td>
                  <td className="px-3 py-3"><Badge value={h.isNationalHoliday} /></td>
                  <td className="px-3 py-3"><Badge value={h.isRestrictedHoliday} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEditModal(h)} className="text-slate-400 hover:text-blue-500">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(h.id)} className="text-red-400 hover:text-red-600">
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

      <HolidayFormModal
        isOpen={modalOpen}
        masterLabel={activeMasterLabel}
        initialData={editingHoliday}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}