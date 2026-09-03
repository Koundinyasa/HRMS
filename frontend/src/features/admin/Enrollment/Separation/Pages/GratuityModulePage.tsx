​​import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  SlidersHorizontal,
  FileText,
  FileSpreadsheet,
  History,
  MoreVertical,
  Filter,
  Save,
  X,
} from "lucide-react";

/* =========================================================
   EMPTY-STATE ILLUSTRATION — confused desk worker
========================================================= */

function ConfusedDeskIllustration({ size = 190 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 220 200" fill="none">
      <ellipse cx="110" cy="182" rx="78" ry="8" fill="#eef2f6" />

      <rect x="24" y="140" width="26" height="28" rx="3" fill="#dbe6f2" />
      <rect x="24" y="140" width="26" height="7" rx="3" fill="#c3d5e8" />
      <path d="M37 140c-2-14-16-18-22-16 1 10 10 17 22 16z" fill="#38b28a" />
      <path d="M37 140c2-18 18-22 25-19-2 12-12 20-25 19z" fill="#149c7c" />
      <path d="M37 140V116" stroke="#0f7f66" strokeWidth="2.5" strokeLinecap="round" />

      <circle cx="118" cy="34" r="17" fill="#ffe9a8" />
      <text x="118" y="42" textAnchor="middle" fontSize="20" fontWeight="700" fill="#f0a53a">?</text>
      <circle cx="142" cy="16" r="3.5" fill="#ffe9a8" />
      <circle cx="150" cy="8" r="2" fill="#ffe9a8" />

      <rect x="56" y="128" width="118" height="8" rx="2" fill="#2bb6c4" />
      <rect x="64" y="136" width="9" height="34" fill="#1f9aa6" />
      <rect x="158" y="136" width="9" height="34" fill="#1f9aa6" />

      <rect x="86" y="112" width="46" height="30" rx="2" fill="#eef4fa" stroke="#c7d7e6" strokeWidth="1.5" />
      <rect x="90" y="116" width="38" height="20" rx="1" fill="#ffffff" />
      <rect x="80" y="140" width="58" height="5" rx="2" fill="#c7d7e6" />

      <rect x="96" y="150" width="34" height="8" rx="2" fill="#f0a53a" />
      <rect x="99" y="158" width="4" height="18" fill="#d98a24" />
      <rect x="123" y="158" width="4" height="18" fill="#d98a24" />

      <circle cx="113" cy="86" r="13" fill="#f0c39a" />
      <path d="M100 82c0-9 6-15 13-15s13 6 13 15c-2 2-6 3-13 3s-11-1-13-3z" fill="#2b2b2b" />

      <path d="M96 100c0-6 8-11 17-11s17 5 17 11v20c0 4-3 6-17 6s-17-2-17-6z" fill="#3f7dd8" />

      <path d="M96 104c-8-2-14-9-15-17" stroke="#f0c39a" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M130 104c8-2 14-9 15-17" stroke="#f0c39a" strokeWidth="7" strokeLinecap="round" fill="none" />

      <path d="M100 148c4 6 22 6 26 0" stroke="#293241" strokeWidth="9" strokeLinecap="round" fill="none" />
    </svg>
  );
}


type GratuityForm = {
  employee: string;
  dateOfJoining: string;
  dateOfLeaving: string;
  noOfYears: string;
  salary: string;
  maxTaxExempted: string;
  gratuityAmount: string;
  exemptedAmount: string;
  taxableAmount: string;
  modeOfPayment: string;
  chequeNo: string;
  dateOfPayment: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const filterMenus: Array<{ key: string; label: string; options: string[] }> = [
  { key: "branch", label: "Branch", options: ["Head Office", "Hyderabad", "Bangalore", "Chennai"] },
  { key: "salaryStructure", label: "Salary Structure", options: ["Monthly", "Weekly", "Bi-Weekly"] },
  { key: "leave", label: "Leave", options: ["On Leave", "Not On Leave"] },
  { key: "attendance", label: "Attendance", options: ["Present", "Absent", "Half Day"] },
  { key: "designation", label: "Designation", options: ["Manager", "Executive", "Associate"] },
  { key: "empStatus", label: "Emp Status", options: ["Active", "Inactive", "On Notice"] },
];

const reportFilterMenus: Array<{ key: string; label: string; options: string[] }> = [
  { key: "query", label: "Query", options: ["Saved Query 1", "Saved Query 2", "Custom Query"] },
  ...filterMenus,
];

const paymentModes = ["Bank Transfer", "Cheque", "DD", "Cash"];

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* =========================================================
   SMALL HOOK — close a panel on outside click
========================================================= */

function useClickOutside<T extends HTMLElement>(ref: React.RefObject<T | null>, onOutside: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside]);
}

/* =========================================================
   REUSABLE — horizontally scrollable toolbar row
   (keeps overflow contained with a visible scrollbar instead
   of letting the whole page stretch/scroll sideways)
========================================================= */

const scrollRowClass =
  "flex items-center flex-nowrap min-w-0 overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch] [scrollbar-width:auto] [scrollbar-color:#98a2b3_#f2f4f7] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-[#f2f4f7] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#98a2b3] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#667085]";

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GratuityModulePage() {
  const navigate = useNavigate();
  const onBack = () => navigate(-1);

  const [activeTab, setActiveTab] = useState("gratuity");
  const [searchValue, setSearchValue] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [saved, setSaved] = useState(false);

  const [showTopFilterBar, setShowTopFilterBar] = useState(true);

  const [form, setForm] = useState<GratuityForm>({
    employee: "",
    dateOfJoining: "",
    dateOfLeaving: "",
    noOfYears: "",
    salary: "",
    maxTaxExempted: "2000000",
    gratuityAmount: "",
    exemptedAmount: "",
    taxableAmount: "",
    modeOfPayment: "",
    chequeNo: "",
    dateOfPayment: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---- Report tab state ---- */
  const [reportSearchValue, setReportSearchValue] = useState("");
  const [reportOpenMenu, setReportOpenMenu] = useState<string | null>(null);
  const [reportSelectedFilters, setReportSelectedFilters] = useState<Record<string, string>>({});
  const [reportMenuPosition, setReportMenuPosition] = useState({ top: 0, left: 0 });

  const [reportMonth, setReportMonth] = useState("Jun");
  const [reportYear, setReportYear] = useState(2026);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  

  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showThreeDotMenu, setShowThreeDotMenu] = useState(false);
  const [toast, setToast] = useState<string>("");

  const monthPickerRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const threeDotRef = useRef<HTMLDivElement>(null);

  useClickOutside<HTMLDivElement>(monthPickerRef, () => setShowMonthPicker(false));
  useClickOutside<HTMLDivElement>(historyRef, () => setShowHistoryPanel(false));
  useClickOutside<HTMLDivElement>(threeDotRef, () => setShowThreeDotMenu(false));

  const [showAddFilterPanel, setShowAddFilterPanel] = useState(false);
  const [customFilterDraft, setCustomFilterDraft] = useState<{ field: string; value: string }>({ field: "", value: "" });
  const [customFilters, setCustomFilters] = useState<Array<{ id: number; field: string; value: string }>>([]);
  const addFilterRef = useRef<HTMLDivElement>(null);
  useClickOutside<HTMLDivElement>(addFilterRef, () => setShowAddFilterPanel(false));

  const [showReportAddFilterPanel, setShowReportAddFilterPanel] = useState(false);
  const [reportCustomFilterDraft, setReportCustomFilterDraft] = useState<{ field: string; value: string }>({ field: "", value: "" });
  const [reportCustomFilters, setReportCustomFilters] = useState<Array<{ id: number; field: string; value: string }>>([]);
  const reportAddFilterRef = useRef<HTMLDivElement>(null);
  useClickOutside<HTMLDivElement>(reportAddFilterRef, () => setShowReportAddFilterPanel(false));

  const showToast = (message: string) => {
    setToast(message);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 2200);
  };

  /* ---- Employee form helpers ---- */

  const updateForm = (field: keyof GratuityForm, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const resetForm = () => {
    setForm({
      employee: "",
      dateOfJoining: "",
      dateOfLeaving: "",
      noOfYears: "",
      salary: "",
      maxTaxExempted: "2000000",
      gratuityAmount: "",
      exemptedAmount: "",
      taxableAmount: "",
      modeOfPayment: "",
      chequeNo: "",
      dateOfPayment: "",
    });
    setErrors({});
    setShowModeDropdown(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setShowModeDropdown(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.employee.trim()) newErrors.employee = "Field Required";
    if (!form.gratuityAmount.trim()) newErrors.gratuityAmount = "Field Required";
    if (!form.modeOfPayment.trim()) newErrors.modeOfPayment = "Field Required";
    if (!form.dateOfPayment.trim()) newErrors.dateOfPayment = "Field Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveGratuity = () => {
    if (!validateForm()) return;
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowAddModal(false);
      resetForm();
    }, 1200);
  };

  const toggleMenu = (key: string, button?: HTMLButtonElement) => {
    if (button) {
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 2,
        left: Math.min(rect.left, Math.max(8, window.innerWidth - 170)),
      });
    }
    setOpenMenu((previous) => (previous === key ? null : key));
  };

  const selectFilterOption = (key: string, value: string) => {
    setSelectedFilters((previous) => ({ ...previous, [key]: value }));
    setOpenMenu(null);
  };

  const addCustomFilter = () => {
    if (!customFilterDraft.field.trim() || !customFilterDraft.value.trim()) return;
    setCustomFilters((previous) => [
      ...previous,
      { id: Date.now(), field: customFilterDraft.field.trim(), value: customFilterDraft.value.trim() },
    ]);
    setCustomFilterDraft({ field: "", value: "" });
    setShowAddFilterPanel(false);
  };

  const removeCustomFilter = (id: number) => {
    setCustomFilters((previous) => previous.filter((f) => f.id !== id));
  };

  /* ---- Report tab handlers ---- */

  const goBackFromReport = () => {
    if (activeTab === "report") {
      setActiveTab("gratuity");
    } else if (onBack) {
      onBack();
    }
  };

  const toggleReportMenu = (key: string, button?: HTMLButtonElement) => {
    if (button) {
      const rect = button.getBoundingClientRect();
      setReportMenuPosition({
        top: rect.bottom + 2,
        left: Math.min(rect.left, Math.max(8, window.innerWidth - 170)),
      });
    }
    setReportOpenMenu((previous) => (previous === key ? null : key));
  };

  const selectReportFilterOption = (key: string, value: string) => {
    setReportSelectedFilters((previous) => ({ ...previous, [key]: value }));
    setReportOpenMenu(null);
  };

  const addReportCustomFilter = () => {
    if (!reportCustomFilterDraft.field.trim() || !reportCustomFilterDraft.value.trim()) return;
    setReportCustomFilters((previous) => [
      ...previous,
      { id: Date.now(), field: reportCustomFilterDraft.field.trim(), value: reportCustomFilterDraft.value.trim() },
    ]);
    setReportCustomFilterDraft({ field: "", value: "" });
    setShowReportAddFilterPanel(false);
  };

  const removeReportCustomFilter = (id: number) => {
    setReportCustomFilters((previous) => previous.filter((f) => f.id !== id));
  };

  const selectMonth = (month: string) => {
    setReportMonth(month);
    setShowMonthPicker(false);
  };

  const changeYear = (delta: number) => {
    setReportYear((previous) => previous + delta);
  };

  const handleExportPDF = () => {
    setShowThreeDotMenu(false);
    showToast("No data available to export as PDF");
  };

  const handleExportExcel = () => {
    setShowThreeDotMenu(false);
    showToast("No data available to export as Excel");
  };

  const handlePrint = () => {
    setShowThreeDotMenu(false);
    window.print();
  };

  const handleRefresh = () => {
    setShowThreeDotMenu(false);
    showToast("Report refreshed");
  };

  const clearReportFilters = () => {
    setReportSearchValue("");
    setReportSelectedFilters({});
    setReportOpenMenu(null);
    setShowAdvanceFilter(false);
    showToast("Filters cleared");
  };

  const hasActiveGratuityFilters =
    searchValue.trim() !== "" ||
    Object.values(selectedFilters).some((v) => v) ||
    customFilters.length > 0;

  const clearGratuityFilters = () => {
    setSearchValue("");
    setSelectedFilters({});
    setOpenMenu(null);
    setCustomFilters([]);
    showToast("Filters cleared");
  };

  const hasActiveReportFilters =
    reportSearchValue.trim() !== "" ||
    Object.values(reportSelectedFilters).some((v) => v) ||
    reportCustomFilters.length > 0;

  const clearReportFiltersFull = () => {
    clearReportFilters();
    setReportCustomFilters([]);
  };

  const filterPillClass = (selected?: boolean) =>
    selected
      ? "h-7 px-2.5 border-0 bg-[#eaf5fd] text-[#1598df] font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer rounded whitespace-nowrap"
      : "h-7 px-2.5 border-0 bg-transparent text-[#475467] text-[11px] flex items-center gap-1.5 cursor-pointer rounded whitespace-nowrap hover:bg-[#f2f4f7] hover:text-[#1598df]";

  const dropdownOptionClass =
    "w-full h-7 border-0 bg-white text-left px-3 text-[11px] text-[#475467] cursor-pointer flex items-center hover:bg-[#edf7fd] hover:text-[#1598df]";

  const inputClass =
    "w-full h-8 border border-[#e4e7ec] bg-white rounded-sm px-2.5 outline-none text-[10.5px] text-[#344054] focus:border-[#1598df] placeholder:text-[#98a2b3] disabled:bg-[#f7f9fb] disabled:text-[#98a2b3] disabled:cursor-not-allowed";

  const errorInputClass =
    "w-full h-8 border border-[#f04438] bg-[#fff7f6] rounded-sm px-2.5 outline-none text-[10.5px] text-[#344054] focus:border-[#f04438] placeholder:text-[#98a2b3]";

  const iconBtnClass =
    "w-[30px] h-[30px] border border-[#e4e7ec] rounded bg-white flex items-center justify-center cursor-pointer text-[#667085] hover:bg-[#f2f4f7]";

  return (
    <div className="min-h-screen w-full max-w-full bg-[#f5f7fa] text-[#344054] font-sans text-[12px] relative overflow-x-hidden">
      {/* ===== TOP BAR ===== */}
      <div className="w-full max-w-full min-h-[46px] bg-white border-b border-[#e4e7ec] flex items-center justify-between px-4 py-2 gap-2 flex-nowrap overflow-hidden">
        <div className="flex items-center h-full gap-1 shrink-0">
          <button
            className={
              activeTab === "gratuity"
                ? "h-[46px] px-1 mr-[22px] border-0 bg-transparent text-[#1598df] text-xs font-semibold cursor-pointer relative whitespace-nowrap"
                : "h-[46px] px-1 mr-[22px] border-0 bg-transparent text-[#667085] text-xs cursor-pointer relative whitespace-nowrap hover:text-[#1598df]"
            }
            onClick={() => setActiveTab("gratuity")}
          >
            Gratuity
          </button>
          <button
            className={
              activeTab === "report"
                ? "h-[46px] px-1 mr-[22px] border-0 bg-transparent text-[#1598df] text-xs font-semibold cursor-pointer relative whitespace-nowrap"
                : "h-[46px] px-1 mr-[22px] border-0 bg-transparent text-[#667085] text-xs cursor-pointer relative whitespace-nowrap hover:text-[#1598df]"
            }
            onClick={() => setActiveTab("report")}
          >
            Report
          </button>
        </div>

        {activeTab === "gratuity" && (
          <div className={`${scrollRowClass} gap-2.5 shrink min-w-0 pb-0.5`}>
            <button className="h-[30px] px-3 border border-[#d0d5dd] rounded bg-white text-[#475467] text-[11px] flex items-center gap-1 cursor-pointer whitespace-nowrap hover:bg-[#f2f4f7] shrink-0" onClick={onBack} type="button">
              <ChevronLeft size={14} />
              Back
            </button>
            <button className="h-[30px] px-3.5 border-0 rounded bg-[#1598df] text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap hover:bg-[#087fbe] shrink-0" onClick={openAddModal} type="button">
              <Plus size={14} />
              Add Gratuity
            </button>
            <button
              className={
                showTopFilterBar
                  ? "w-[30px] h-[30px] border-0 bg-[#eaf5fd] text-[#1598df] flex items-center justify-center cursor-pointer rounded shrink-0"
                  : "w-[30px] h-[30px] border-0 bg-transparent text-[#98a2b3] flex items-center justify-center cursor-pointer rounded hover:text-[#1598df] hover:bg-[#eaf5fd] shrink-0"
              }
              onClick={() => setShowTopFilterBar((v) => !v)}
              type="button"
              aria-label="Toggle filters"
              title="Toggle filters"
            >
              <Filter size={14} />
            </button>
            <div className="relative shrink-0" ref={historyRef}>
              <button
                className={
                  showHistoryPanel
                    ? "w-[30px] h-[30px] border border-[#1598df] rounded bg-[#eaf5fd] flex items-center justify-center cursor-pointer text-[#1598df]"
                    : "w-[30px] h-[30px] border border-[#e4e7ec] rounded bg-white flex items-center justify-center cursor-pointer text-[#667085] hover:text-[#1598df] hover:border-[#1598df] hover:bg-[#eaf5fd]"
                }
                onClick={() => setShowHistoryPanel((v) => !v)}
                type="button"
                aria-label="History"
                title="History"
              >
                <History size={14} />
              </button>

              {showHistoryPanel && (
                <div className="absolute top-[34px] right-0 w-[220px] bg-white border border-[#d0d5dd] rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.15)] z-[30] p-3">
                  <div className="text-[11.5px] font-bold text-[#344054] mb-1.5">Recent Activity</div>
                  <div className="text-[10.5px] text-[#98a2b3]">No recent activity yet.</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {activeTab === "gratuity" ? (
        <>
          {/* ===== SEARCH + FILTER BAR (Gratuity list) ===== */}
          {showTopFilterBar && (
          <div className="relative z-10 w-full max-w-full bg-white border-b border-[#e4e7ec] flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-[18px] px-3 sm:px-4 py-1.5 overflow-visible">
            <div className="relative w-full sm:w-[220px] min-w-0 sm:min-w-[160px] shrink-0">
              <Search size={13} className="absolute left-[9px] top-1/2 -translate-y-1/2 text-[#98a2b3] pointer-events-none" />
              <input
                className="w-full h-[30px] border-0 bg-transparent pl-7 pr-2.5 outline-none text-[11px] text-[#344054] placeholder:text-[#98a2b3]"
                type="text"
                placeholder="Start typing..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div
              className={`${scrollRowClass} gap-2.5 w-full sm:flex-1 sm:min-w-0 pb-1.5 shrink-0`}
              onScroll={() => setOpenMenu(null)}
            >
              <div className="relative shrink-0" ref={addFilterRef}>
                <button
                  className="h-7 px-2.5 border-0 bg-transparent text-[#1598df] font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer rounded whitespace-nowrap hover:bg-[#f2f4f7]"
                  type="button"
                  onClick={() => setShowAddFilterPanel((v) => !v)}
                >
                  <Plus size={12} />
                  Add Filter
                </button>
                {showAddFilterPanel && (
                  <div className="absolute top-8 left-0 w-[220px] bg-white border border-[#d0d5dd] rounded shadow-[0_6px_15px_rgba(0,0,0,0.12)] z-20 p-3 flex flex-col gap-2">
                    <div className="relative">
                      <label className="block text-[#667085] text-[9.5px] mb-[3px]">Field</label>
                      <input
                        className="w-full h-7 border border-[#d0d5dd] rounded-[3px] px-2 outline-none text-[10.5px] text-[#344054] focus:border-[#1598df]"
                        type="text"
                        value={customFilterDraft.field}
                        onChange={(e) =>
                          setCustomFilterDraft((prev) => ({ ...prev, field: e.target.value }))
                        }
                        placeholder="e.g. Employee ID"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-[#667085] text-[9.5px] mb-[3px]">Value</label>
                      <input
                        className="w-full h-7 border border-[#d0d5dd] rounded-[3px] px-2 outline-none text-[10.5px] text-[#344054] focus:border-[#1598df]"
                        type="text"
                        value={customFilterDraft.value}
                        onChange={(e) =>
                          setCustomFilterDraft((prev) => ({ ...prev, value: e.target.value }))
                        }
                        placeholder="e.g. EMP1024"
                      />
                    </div>
                    <button type="button" className="h-7 border-0 rounded-[3px] bg-[#1598df] text-white text-[10.5px] cursor-pointer hover:bg-[#087fbe]" onClick={addCustomFilter}>
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <span className="w-px h-[18px] bg-[#e4e7ec] shrink-0" />

              {reportFilterMenus.map((menu) => (
                <div className="relative shrink-0" key={menu.key}>
                  <button
                    className={filterPillClass(!!selectedFilters[menu.key])}
                    type="button"
                    onClick={(e) => toggleMenu(menu.key, e.currentTarget)}
                  >
                    {selectedFilters[menu.key] || menu.label}
                    <ChevronDown size={12} />
                  </button>
                  {openMenu === menu.key && (
                  <div
                      className="fixed min-w-[150px] max-w-[calc(100vw-16px)] bg-white border border-[#d0d5dd] rounded shadow-[0_6px_15px_rgba(0,0,0,0.16)] z-[30] overflow-hidden"
                      style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                    >                      <button className={dropdownOptionClass} type="button" onClick={() => selectFilterOption(menu.key, "")}>
                        All
                      </button>
                      {menu.options.map((opt) => (
                        <button
                          className={dropdownOptionClass}
                          key={opt}
                          type="button"
                          onClick={() => selectFilterOption(menu.key, opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {customFilters.map((f) => (
                <span className="inline-flex items-center gap-1.5 h-[26px] px-2 rounded-full bg-[#e8f4fc] text-[#1598df] text-[10px] font-medium whitespace-nowrap shrink-0" key={f.id}>
                  {f.field}: {f.value}
                  <button type="button" className="border-0 bg-transparent text-[#1598df] cursor-pointer flex items-center p-0 hover:text-[#0b6ca8]" onClick={() => removeCustomFilter(f.id)} aria-label="Remove filter">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <div className="relative shrink-0" ref={threeDotRef}>
                <button
                  className="w-[30px] h-[30px] border-0 rounded bg-transparent flex items-center justify-center cursor-pointer text-[#667085] hover:bg-[#f2f4f7]"
                  type="button"
                  onClick={() => setShowThreeDotMenu((v) => !v)}
                  aria-label="More options"
                  title="More options"
                >
                  <MoreVertical size={15} />
                </button>

                {showThreeDotMenu && (
                  <div className="absolute top-[34px] right-0 min-w-[170px] bg-white border border-[#d0d5dd] rounded shadow-[0_6px_15px_rgba(0,0,0,0.12)] z-30 overflow-hidden">
                    <button className="w-full h-[30px] border-0 bg-white text-left px-3 text-[11px] text-[#475467] cursor-pointer flex items-center gap-[7px] hover:bg-[#edf7fd] hover:text-[#1598df]" type="button" onClick={handleExportPDF}>
                      <FileText size={13} /> Export as PDF
                    </button>
                    <button className="w-full h-[30px] border-0 bg-white text-left px-3 text-[11px] text-[#475467] cursor-pointer flex items-center gap-[7px] hover:bg-[#edf7fd] hover:text-[#1598df]" type="button" onClick={handleExportExcel}>
                      <FileSpreadsheet size={13} /> Export as Excel
                    </button>
                    <button className="w-full h-[30px] border-0 bg-white text-left px-3 text-[11px] text-[#475467] cursor-pointer flex items-center gap-[7px] hover:bg-[#edf7fd] hover:text-[#1598df]" type="button" onClick={handlePrint}>
                      Print
                    </button>
                    <button className="w-full h-[30px] border-0 bg-white text-left px-3 text-[11px] text-[#475467] cursor-pointer flex items-center gap-[7px] hover:bg-[#edf7fd] hover:text-[#1598df]" type="button" onClick={handleRefresh}>
                      Refresh
                    </button>
                  </div>
                )}
              </div>

              <button
                className={
                  hasActiveGratuityFilters
                    ? "w-[30px] h-[30px] border-0 rounded bg-transparent flex items-center justify-center cursor-pointer text-[#e0453f] hover:bg-[#fdeceb] shrink-0"
                    : "w-[30px] h-[30px] border-0 rounded bg-transparent flex items-center justify-center text-[#d0d5dd] cursor-not-allowed shrink-0"
                }
                type="button"
                onClick={clearGratuityFilters}
                aria-label="Clear filters"
                title="Clear filters"
                disabled={!hasActiveGratuityFilters}
              >
                <X size={15} />
              </button>
            </div>
          </div>
          )}

          {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#344054] text-white text-[11px] px-4 py-2 rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.25)] z-[10050]">{toast}</div>}

          {/* ===== CONTENT (Gratuity list) ===== */}
          <div className="w-full flex-1 min-h-[calc(100vh-90px)] bg-[#f5f7fa] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="mb-2">
                <ConfusedDeskIllustration size={170} />
              </div>
              <h3 className="m-0 text-[13px] font-semibold text-[#e0453f]">No Data Found in - Gratuity</h3>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ===== REPORT TOOLBAR ===== */}
          <div className="w-full max-w-full min-h-[48px] bg-white border-b border-[#e4e7ec] flex items-center justify-between px-4 py-2 flex-nowrap gap-2.5 overflow-hidden">
            <h3 className="m-0 text-[13px] font-semibold text-[#344054] shrink-0 whitespace-nowrap">Gratuity Report</h3>

            <div className={`${scrollRowClass} gap-2 shrink min-w-0 pb-0.5`}>
              <button className="h-[30px] px-3 border border-[#d0d5dd] rounded bg-white text-[#475467] text-[11px] flex items-center gap-1 cursor-pointer whitespace-nowrap hover:bg-[#f2f4f7] shrink-0" onClick={goBackFromReport} type="button">
                <ChevronLeft size={14} />
                Back
              </button>

              <div className="relative shrink-0" ref={monthPickerRef}>
                <button
                  className="h-[30px] px-2.5 border border-[#d0d5dd] rounded bg-white text-[#344054] text-[11px] flex items-center gap-1.5 cursor-pointer hover:border-[#1598df] whitespace-nowrap"
                  type="button"
                  onClick={() => setShowMonthPicker((v) => !v)}
                >
                  {reportMonth}/{reportYear}
                  <ChevronDown size={12} />
                </button>

                {showMonthPicker && (
                  <div className="absolute top-[34px] right-0 w-[210px] bg-white border border-[#d0d5dd] rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.15)] z-30 p-2.5">
                    <div className="flex items-center justify-between mb-2 text-xs font-semibold text-[#344054]">
                      <button className="w-[22px] h-[22px] border-0 bg-[#f2f4f7] rounded flex items-center justify-center cursor-pointer text-[#475467] hover:bg-[#e4e7ec]" type="button" onClick={() => changeYear(-1)} aria-label="Previous year">
                        <ChevronLeft size={13} />
                      </button>
                      <span>{reportYear}</span>
                      <button className="w-[22px] h-[22px] border-0 bg-[#f2f4f7] rounded flex items-center justify-center cursor-pointer text-[#475467] hover:bg-[#e4e7ec]" type="button" onClick={() => changeYear(1)} aria-label="Next year">
                        <ChevronRight size={13} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {months.map((m) => (
                        <button
                          key={m}
                          type="button"
                          className={
                            m === reportMonth
                              ? "h-7 rounded text-[10.5px] flex items-center justify-center cursor-pointer bg-[#eaf5fd] text-[#1598df] font-semibold"
                              : "h-7 rounded text-[10.5px] flex items-center justify-center cursor-pointer text-[#475467] hover:bg-[#f2f4f7]"
                          }
                          onClick={() => selectMonth(m)}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                className={
                  showAdvanceFilter
                    ? "h-[30px] px-3.5 rounded bg-[#087fbe] text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                    : "h-[30px] px-3.5 rounded bg-[#1598df] text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap hover:bg-[#087fbe] shrink-0"
                }
                onClick={() => setShowAdvanceFilter((v) => !v)}
                type="button"
              >
                <SlidersHorizontal size={13} />
                Advance Filter
              </button>

              <button
                className="w-[30px] h-[30px] border border-[#e4e7ec] rounded bg-white flex items-center justify-center cursor-pointer text-[#e0453f] hover:bg-[#fdeceb] hover:border-[#f4b6b2] shrink-0"
                onClick={handleExportPDF}
                type="button"
                aria-label="Export as PDF"
                title="Export as PDF"
              >
                <FileText size={14} />
              </button>

              <button
                className="w-[30px] h-[30px] border border-[#e4e7ec] rounded bg-white flex items-center justify-center cursor-pointer text-[#1c9e5a] hover:bg-[#e9f9ef] hover:border-[#a8e2c0] shrink-0"
                onClick={handleExportExcel}
                type="button"
                aria-label="Export as Excel"
                title="Export as Excel"
              >
                <FileSpreadsheet size={14} />
              </button>

              <div className="relative shrink-0" ref={historyRef}>
                <button
                  className={
                    showHistoryPanel
                      ? "w-[30px] h-[30px] border border-[#1598df] rounded bg-[#eaf5fd] flex items-center justify-center cursor-pointer text-[#1598df]"
                      : "w-[30px] h-[30px] border border-[#e4e7ec] rounded bg-white flex items-center justify-center cursor-pointer text-[#667085] hover:text-[#1598df] hover:border-[#1598df] hover:bg-[#eaf5fd]"
                  }
                  onClick={() => setShowHistoryPanel((v) => !v)}
                  type="button"
                  aria-label="History"
                  title="History"
                >
                  <History size={14} />
                </button>

                {showHistoryPanel && (
                  <div className="absolute top-[34px] right-0 w-[220px] bg-white border border-[#d0d5dd] rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.15)] z-[30] p-3">
                    <div className="text-[11.5px] font-bold text-[#344054] mb-1.5">Recent Activity</div>
                    <div className="text-[10.5px] text-[#98a2b3]">No recent activity yet.</div>
                  </div>
                )}
              </div>

              {/* Filter toggle icon now sits right after the History icon */}
              <button
                className={
                  showTopFilterBar
                    ? "w-[30px] h-[30px] border border-[#1598df] rounded bg-[#eaf5fd] text-[#1598df] flex items-center justify-center cursor-pointer shrink-0"
                    : "w-[30px] h-[30px] border border-[#e4e7ec] rounded bg-white text-[#667085] flex items-center justify-center cursor-pointer hover:text-[#1598df] hover:border-[#1598df] hover:bg-[#eaf5fd] shrink-0"
                }
                onClick={() => setShowTopFilterBar((v) => !v)}
                type="button"
                aria-label="Toggle filters"
                title="Toggle filters"
              >
                <Filter size={14} />
              </button>
            </div>
          </div>

          {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#344054] text-white text-[11px] px-4 py-2 rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.25)] z-[10050]">{toast}</div>}

          {/* ===== REPORT FILTER BAR ===== */}
          {showTopFilterBar && (
            <div className="relative z-10 w-full max-w-full bg-white border-b border-[#e4e7ec] flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-[18px] px-3 sm:px-4 py-1.5 overflow-visible">
              <div className="relative w-full sm:w-[220px] min-w-0 sm:min-w-[160px] shrink-0">
                <Search size={13} className="absolute left-[9px] top-1/2 -translate-y-1/2 text-[#98a2b3] pointer-events-none" />
                <input
                  className="w-full h-[30px] border-0 bg-transparent pl-7 pr-2.5 outline-none text-[11px] text-[#344054] placeholder:text-[#98a2b3]"
                  type="text"
                  placeholder="Start typing..."
                  value={reportSearchValue}
                  onChange={(e) => setReportSearchValue(e.target.value)}
                />
              </div>

              <div
                className={`${scrollRowClass} gap-2.5 w-full sm:flex-1 sm:min-w-0 pb-1.5 shrink-0`}
                onScroll={() => setReportOpenMenu(null)}
              >
                <div className="relative shrink-0" ref={reportAddFilterRef}>
                  <button
                    className="h-7 px-2.5 border-0 bg-transparent text-[#1598df] font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer rounded whitespace-nowrap hover:bg-[#f2f4f7]"
                    type="button"
                    onClick={() => setShowReportAddFilterPanel((v) => !v)}
                  >
                    <Plus size={12} />
                    Add Filter
                  </button>
                  {showReportAddFilterPanel && (
                    <div className="absolute top-8 left-0 w-[220px] bg-white border border-[#d0d5dd] rounded shadow-[0_6px_15px_rgba(0,0,0,0.12)] z-20 p-3 flex flex-col gap-2">
                      <div className="relative">
                        <label className="block text-[#667085] text-[9.5px] mb-[3px]">Field</label>
                        <input
                          className="w-full h-7 border border-[#d0d5dd] rounded-[3px] px-2 outline-none text-[10.5px] text-[#344054] focus:border-[#1598df]"
                          type="text"
                          value={reportCustomFilterDraft.field}
                          onChange={(e) =>
                            setReportCustomFilterDraft((prev) => ({ ...prev, field: e.target.value }))
                          }
                          placeholder="e.g. Employee ID"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-[#667085] text-[9.5px] mb-[3px]">Value</label>
                        <input
                          className="w-full h-7 border border-[#d0d5dd] rounded-[3px] px-2 outline-none text-[10.5px] text-[#344054] focus:border-[#1598df]"
                          type="text"
                          value={reportCustomFilterDraft.value}
                          onChange={(e) =>
                            setReportCustomFilterDraft((prev) => ({ ...prev, value: e.target.value }))
                          }
                          placeholder="e.g. EMP1024"
                        />
                      </div>
                      <button type="button" className="h-7 border-0 rounded-[3px] bg-[#1598df] text-white text-[10.5px] cursor-pointer hover:bg-[#087fbe]" onClick={addReportCustomFilter}>
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                <span className="w-px h-[18px] bg-[#e4e7ec] shrink-0" />

                {reportFilterMenus.map((menu) => (
                  <div className="relative shrink-0" key={menu.key}>
                    <button
                      className={filterPillClass(!!reportSelectedFilters[menu.key])}
                      type="button"
                      onClick={(e) => toggleReportMenu(menu.key, e.currentTarget)}
                    >
                      {reportSelectedFilters[menu.key] || menu.label}
                      <ChevronDown size={12} />
                    </button>
                    {reportOpenMenu === menu.key && (
                      <div
                        className="fixed min-w-[150px] max-w-[calc(100vw-16px)] bg-white border border-[#d0d5dd] rounded shadow-[0_6px_15px_rgba(0,0,0,0.16)] z-[30] overflow-hidden"
                        style={{ top: `${reportMenuPosition.top}px`, left: `${reportMenuPosition.left}px` }}
                      >
                        <button
                          className={dropdownOptionClass}
                          type="button"
                          onClick={() => selectReportFilterOption(menu.key, "")}
                        >
                          All
                        </button>
                        {menu.options.map((opt) => (
                          <button
                            className={dropdownOptionClass}
                            key={opt}
                            type="button"
                            onClick={() => selectReportFilterOption(menu.key, opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {reportCustomFilters.map((f) => (
                  <span className="inline-flex items-center gap-1.5 h-[26px] px-2 rounded-full bg-[#e8f4fc] text-[#1598df] text-[10px] font-medium whitespace-nowrap shrink-0" key={f.id}>
                    {f.field}: {f.value}
                    <button type="button" className="border-0 bg-transparent text-[#1598df] cursor-pointer flex items-center p-0 hover:text-[#0b6ca8]" onClick={() => removeReportCustomFilter(f.id)} aria-label="Remove filter">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <div className="relative shrink-0" ref={threeDotRef}>
                  <button
                    className="w-[30px] h-[30px] border-0 rounded bg-transparent flex items-center justify-center cursor-pointer text-[#667085] hover:bg-[#f2f4f7]"
                    type="button"
                    onClick={() => setShowThreeDotMenu((v) => !v)}
                    aria-label="More options"
                    title="More options"
                  >
                    <MoreVertical size={15} />
                  </button>

                  {showThreeDotMenu && (
                    <div className="absolute top-[34px] right-0 min-w-[170px] bg-white border border-[#d0d5dd] rounded shadow-[0_6px_15px_rgba(0,0,0,0.12)] z-30 overflow-hidden">
                      <button className="w-full h-[30px] border-0 bg-white text-left px-3 text-[11px] text-[#475467] cursor-pointer flex items-center gap-[7px] hover:bg-[#edf7fd] hover:text-[#1598df]" type="button" onClick={handleExportPDF}>
                        <FileText size={13} /> Export as PDF
                      </button>
                      <button className="w-full h-[30px] border-0 bg-white text-left px-3 text-[11px] text-[#475467] cursor-pointer flex items-center gap-[7px] hover:bg-[#edf7fd] hover:text-[#1598df]" type="button" onClick={handleExportExcel}>
                        <FileSpreadsheet size={13} /> Export as Excel
                      </button>
                      <button className="w-full h-[30px] border-0 bg-white text-left px-3 text-[11px] text-[#475467] cursor-pointer flex items-center gap-[7px] hover:bg-[#edf7fd] hover:text-[#1598df]" type="button" onClick={handlePrint}>
                        Print
                      </button>
                      <button className="w-full h-[30px] border-0 bg-white text-left px-3 text-[11px] text-[#475467] cursor-pointer flex items-center gap-[7px] hover:bg-[#edf7fd] hover:text-[#1598df]" type="button" onClick={handleRefresh}>
                        Refresh
                      </button>
                    </div>
                  )}
                </div>

                <button
                  className={
                    hasActiveReportFilters
                      ? "w-[30px] h-[30px] border-0 rounded bg-transparent flex items-center justify-center cursor-pointer text-[#e0453f] hover:bg-[#fdeceb] shrink-0"
                      : "w-[30px] h-[30px] border-0 rounded bg-transparent flex items-center justify-center text-[#d0d5dd] cursor-not-allowed shrink-0"
                  }
                  type="button"
                  onClick={clearReportFiltersFull}
                  aria-label="Clear filters"
                  title="Clear filters"
                  disabled={!hasActiveReportFilters}
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ===== ADVANCE FILTER PANEL ===== */}
          {showAdvanceFilter && (
            <div className="w-full bg-[#f7f9fb] border-b border-[#e4e7ec] px-4 py-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Date Range From</label>
                  <input className={inputClass} type="date" />
                </div>
                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Date Range To</label>
                  <input className={inputClass} type="date" />
                </div>
                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Min. Gratuity Amount</label>
                  <input className={inputClass} type="text" placeholder="0" />
                </div>
                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Max. Gratuity Amount</label>
                  <input className={inputClass} type="text" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end items-center gap-2 mt-3">
                <button
                  type="button"
                  className="h-[30px] px-3.5 rounded-sm text-[10px] cursor-pointer flex items-center gap-1.5 bg-white text-[#475467] border border-[#d0d5dd] hover:bg-[#f2f4f7]"
                  onClick={() => setShowAdvanceFilter(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="h-[30px] px-3.5 rounded-sm text-[10px] cursor-pointer flex items-center gap-1.5 bg-[#1598df] text-white border border-[#1598df] hover:bg-[#087fbe]"
                  onClick={() => {
                    setShowAdvanceFilter(false);
                    showToast("Filters applied");
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* ===== CONTENT (Report) ===== */}
          <div className="w-full flex-1 min-h-[calc(100vh-90px)] bg-[#f5f7fa] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="mb-2">
                <ConfusedDeskIllustration size={170} />
              </div>
              <h3 className="m-0 text-[13px] font-semibold text-[#e0453f]">No Data Found in - Report</h3>
            </div>
          </div>
        </>
      )}

      {/* ===== ADD GRATUITY MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[rgba(15,23,42,0.45)] flex items-center justify-center z-[10000] p-3">
          <div className="w-full max-w-[720px] max-h-[90vh] bg-white rounded-md shadow-[0_12px_35px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col">
            <div className="h-[48px] px-[18px] flex items-center sticky top-0 bg-white z-[2] border-b border-[#e4e7ec]">
              <h2 className="m-0 text-[#344054] text-sm">Add Gratuity</h2>
            </div>

            <div className="px-5 py-[18px] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3.5">
                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">
                    Employee Name or EMP ID<span className="text-[#f04438] ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className={errors.employee ? errorInputClass : inputClass}
                      type="text"
                      value={form.employee}
                      onChange={(e) => updateForm("employee", e.target.value)}
                      placeholder="Search employee..."
                    />
                    {form.employee && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 border-0 bg-transparent text-[#98a2b3] text-sm leading-none cursor-pointer p-0 hover:text-[#667085]"
                        onClick={() => updateForm("employee", "")}
                        aria-label="Clear"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {errors.employee && <span className="text-[#f04438] text-[9px] block mt-0.5">{errors.employee}</span>}
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Date Of Joining</label>
                  <div className="relative flex items-center">
                    <input
                      className={inputClass}
                      type="date"
                      value={form.dateOfJoining}
                      onChange={(e) => updateForm("dateOfJoining", e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Date Of Leaving</label>
                  <div className="relative flex items-center">
                    <input
                      className={inputClass}
                      type="date"
                      value={form.dateOfLeaving}
                      onChange={(e) => updateForm("dateOfLeaving", e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">No. Of Years</label>
                  <input
                    className={inputClass}
                    type="text"
                    value={form.noOfYears}
                    onChange={(e) => updateForm("noOfYears", e.target.value)}
                    placeholder="Enter no. of years"
                  />
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Salary</label>
                  <input
                    className={inputClass}
                    type="text"
                    value={form.salary}
                    onChange={(e) => updateForm("salary", e.target.value)}
                    placeholder="Enter salary"
                  />
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Max. Tax Exempted Amount</label>
                  <input className={inputClass} type="text" value={form.maxTaxExempted} disabled />
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">
                    Gratuity Amount<span className="text-[#f04438] ml-0.5">*</span>
                  </label>
                  <input
                    className={errors.gratuityAmount ? errorInputClass : inputClass}
                    type="text"
                    value={form.gratuityAmount}
                    onChange={(e) => updateForm("gratuityAmount", e.target.value)}
                    placeholder="Enter gratuity amount"
                  />
                  {errors.gratuityAmount && (
                    <span className="text-[#f04438] text-[9px] block mt-0.5">{errors.gratuityAmount}</span>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Exempted Amount</label>
                  <input
                    className={inputClass}
                    type="text"
                    value={form.exemptedAmount}
                    onChange={(e) => updateForm("exemptedAmount", e.target.value)}
                    placeholder="Enter exempted amount"
                  />
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Taxable Amount</label>
                  <input
                    className={inputClass}
                    type="text"
                    value={form.taxableAmount}
                    onChange={(e) => updateForm("taxableAmount", e.target.value)}
                    placeholder="Enter taxable amount"
                  />
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">
                    Mode of Payment<span className="text-[#f04438] ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className={
                        errors.modeOfPayment
                          ? "w-full h-8 border border-[#f04438] bg-[#fff7f6] rounded-sm px-2.5 outline-none text-[10.5px] text-[#344054] flex items-center justify-between cursor-pointer"
                          : "w-full h-8 border border-[#e4e7ec] bg-white rounded-sm px-2.5 outline-none text-[10.5px] text-[#344054] flex items-center justify-between cursor-pointer hover:border-[#1598df]"
                      }
                      onClick={() => setShowModeDropdown(!showModeDropdown)}
                    >
                      <span className={form.modeOfPayment ? "" : "text-[#98a2b3]"}>
                        {form.modeOfPayment || "Select Mode of Payment"}
                      </span>
                      <ChevronDown size={12} />
                    </button>

                    {showModeDropdown && (
                      <div className="absolute left-0 right-0 top-[35px] bg-white border border-[#d0d5dd] rounded shadow-[0_6px_15px_rgba(0,0,0,0.15)] z-[10001] max-h-[170px] overflow-y-auto">
                        {paymentModes.map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            className={dropdownOptionClass}
                            onClick={() => {
                              updateForm("modeOfPayment", mode);
                              setShowModeDropdown(false);
                            }}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.modeOfPayment && (
                    <span className="text-[#f04438] text-[9px] block mt-0.5">{errors.modeOfPayment}</span>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">Cheque/DD No.</label>
                  <input
                    className={inputClass}
                    type="text"
                    value={form.chequeNo}
                    onChange={(e) => updateForm("chequeNo", e.target.value)}
                    placeholder="Enter cheque/DD no."
                  />
                </div>

                <div className="relative">
                  <label className="block text-[#344054] text-[10px] mb-1.5">
                    Date of Payment<span className="text-[#f04438] ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className={errors.dateOfPayment ? errorInputClass : inputClass}
                      type="date"
                      value={form.dateOfPayment}
                      onChange={(e) => updateForm("dateOfPayment", e.target.value)}
                    />
                  </div>
                  {errors.dateOfPayment && (
                    <span className="text-[#f04438] text-[9px] block mt-0.5">{errors.dateOfPayment}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="h-14 bg-[#f8fafc] border-t border-[#e4e7ec] flex items-center justify-end gap-2 px-3.5 sticky bottom-0">
              <button type="button" className="h-[30px] px-3.5 rounded-sm text-[10px] cursor-pointer flex items-center gap-1.5 bg-white text-[#475467] border border-[#d0d5dd] hover:bg-[#f2f4f7]" onClick={closeAddModal}>
                <X size={13} />
                Close
              </button>
              <button type="button" className="h-[30px] px-3.5 rounded-sm text-[10px] cursor-pointer flex items-center gap-1.5 bg-[#1598df] text-white border border-[#1598df] hover:bg-[#087fbe]" onClick={saveGratuity}>
                <Save size={13} />
                {saved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}