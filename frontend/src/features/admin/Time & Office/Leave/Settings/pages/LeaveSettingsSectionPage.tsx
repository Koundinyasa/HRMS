import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { Bookmark, ClockFading, FileSpreadsheet, Filter, Plus, Search } from "lucide-react";
import {
  useGetLeavePoliciesQuery,
  useGetPolicyLeavesQuery,
} from "../api/settingsApi";
import AllotAvailPanel from "../components/AllotAvailPanel";
import DefinitionsPanel, {
  type DefinitionLeave,
} from "../components/DefinitionsPanel";
import OpeningBalancePanel from "../components/OpeningBalancePanel";
import ImportPanel from "../components/ImportPanel";
import AddLeaveDefinitionModal, { type NewLeaveDefinition } from "../components/AddLeaveDefinitionModal";
import type { LeaveSettingsOutletContext } from "./leavesettingspage";

type Section = "definitions" | "allot-avail-date" | "opening-balance" | "import";

const years = Array.from(
  { length: 5 },
  (_, index) => String(new Date().getFullYear() - index),
);

function downloadOpeningBalanceTemplate(leaveNames: string[], year: string) {
  const headers = [
    "Employee ID",
    "Employee Name",
    "Leave Type",
    "Year",
    "Opening Balance",
    "Adjusted",
  ];
  const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = leaveNames.map((name) => ["", "", name, year, "", ""]);
  const csv = [headers, ...rows]
    .map((row) => row.map((value) => escapeCsv(String(value))).join(","))
    .join("\r\n");
  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `opening-balance-${year}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function LeaveSettingsSectionPage({
  section,
}: {
  section: Section;
}) {
  const { setHeaderActions } = useOutletContext<LeaveSettingsOutletContext>();
  const { pathname } = useLocation();
  const settingsSectionIndex = pathname.lastIndexOf("/leave/settings/");
  const pathSection =
    settingsSectionIndex >= 0
      ? pathname
          .slice(settingsSectionIndex + "/leave/settings/".length)
          .split("/")[0]
      : "";
  const activeSection: Section =
    pathSection === "definitions" ||
    pathSection === "allot-avail-date" ||
    pathSection === "opening-balance" ||
    pathSection === "import"
      ? pathSection
      : section;
  const [definitionSearch, setDefinitionSearch] = useState("");
  const [showAddLeave, setShowAddLeave] = useState(false);
  const [newDefinitions, setNewDefinitions] = useState<DefinitionLeave[]>([]);
  const [allotFiltersOpen, setAllotFiltersOpen] = useState(true);
  const [allotLeaveType, setAllotLeaveType] = useState<number | string | null>(null);
  const [openingFiltersOpen, setOpeningFiltersOpen] = useState(true);
  const [openingBalanceSearch, setOpeningBalanceSearch] = useState("");
  const [openingLeaveType, setOpeningLeaveType] = useState<number | string | null>(null);
  const [openingBalanceFilters, setOpeningBalanceFilters] = useState<{
    branch: string;
    salaryStructure: string;
    leave: string;
    attendance: string;
    designation: string;
    empStatus: string;
  }>({
    branch: "",
    salaryStructure: "",
    leave: "",
    attendance: "",
    designation: "",
    empStatus: "",
  });
  const [openingYear, setOpeningYear] = useState(years[0]);
  const {
    data: policies = [],
    isLoading: policiesLoading,
    refetch: refetchPolicies,
  } = useGetLeavePoliciesQuery();

  const activePolicyId = policies[0]?.policyId ?? null;
  const {
    data: leaves = [],
    isLoading: leavesLoading,
    refetch: refetchLeaves,
  } = useGetPolicyLeavesQuery(activePolicyId ?? 0, {
    skip: activePolicyId === null,
  });

  const refresh = () => {
    void refetchPolicies();
    if (activePolicyId !== null) void refetchLeaves();
  };

  useEffect(() => {
    if (activeSection === "opening-balance") {
      setHeaderActions(
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={refresh}
            className="flex h-[48px] items-center gap-2 rounded-[8px] bg-[#269BD7] px-5 font-urbanist text-[15px] font-semibold text-white transition hover:bg-[#208BC3]"
          >
            <Bookmark size={18} strokeWidth={1.8} />
            Update
          </button>
          <button
            type="button"
            onClick={() => downloadOpeningBalanceTemplate(leaves.map((leave) => leave.leaveName), openingYear)}
            title="Export Excel"
            aria-label="Export Excel"
            className="flex h-10 w-8 items-center justify-center text-[#398B3E] hover:opacity-80"
          >
            <FileSpreadsheet size={25} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => setOpeningFiltersOpen(true)}
            title="Show filters"
            aria-label="Show filters"
            className="flex h-[40px] w-[32px] items-center justify-center text-[#91A0B5] transition hover:text-[#269BD7]"
          >
            <Filter size={23} fill="currentColor" strokeWidth={1.7} />
          </button>
          <button type="button" title="History" aria-label="History" className="flex h-[40px] w-[32px] items-center justify-center text-[#91A0B5] transition hover:text-[#269BD7]">
            <ClockFading size={25} strokeWidth={1.7} />
          </button>
        </div>,
      );
      return () => setHeaderActions(null);
    }

    if (activeSection === "allot-avail-date") {
      setHeaderActions(
        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            onClick={() => setAllotFiltersOpen(true)}
            title="Show filters"
            aria-label="Show filters"
            className="flex h-[40px] w-[32px] items-center justify-center text-[#91A0B5] transition hover:text-[#269BD7]"
          >
            <Filter size={23} fill="currentColor" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            title="History"
            aria-label="History"
            className="flex h-[40px] w-[32px] items-center justify-center text-[#91A0B5] transition hover:text-[#269BD7]"
          >
            <ClockFading size={25} strokeWidth={1.7} />
          </button>
        </div>,
      );
      return () => setHeaderActions(null);
    }

    if (activeSection === "import") {
      setHeaderActions(
        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            onClick={() =>
              document.getElementById("leave-import-filters")?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              })
            }
            title="Show filters"
            aria-label="Show filters"
            className="flex h-[40px] w-[32px] items-center justify-center text-[#91A0B5] transition hover:text-[#269BD7]"
          >
            <Filter size={23} fill="currentColor" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            title="History"
            aria-label="History"
            className="flex h-[40px] w-[32px] items-center justify-center text-[#91A0B5] transition hover:text-[#269BD7]"
          >
            <ClockFading size={25} strokeWidth={1.7} />
          </button>
        </div>,
      );
      return () => setHeaderActions(null);
    }

    if (activeSection !== "definitions") {
      setHeaderActions(null);
      return;
    }

    setHeaderActions(
      <div className="flex shrink-0 items-center gap-4">
        <div className="relative w-[248px]">
          <Search size={20} strokeWidth={1.7} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#91A0B5]" />
          <input
            type="search"
            value={definitionSearch}
            onChange={(event) => setDefinitionSearch(event.target.value)}
            placeholder="Search..."
            aria-label="Search leave definitions"
            className="h-[46px] w-full rounded-[8px] border-0 bg-[#F3F4F7] pl-[48px] pr-4 font-[Urbanist] text-[14px] text-[#344054] outline-none placeholder:text-[#A3ACBA] focus:ring-1 focus:ring-[#269BD7]"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowAddLeave(true)}
          className="flex h-[46px] items-center gap-2 rounded-[7px] bg-[#269BD7] px-5 font-[Urbanist] text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#168BC7]"
        >
          <Plus size={21} strokeWidth={2} />
          <span className="whitespace-nowrap">Add Leave</span>
        </button>
        <button type="button" title="History" aria-label="History" className="flex h-[40px] w-[32px] items-center justify-center text-[#91A0B5] transition hover:text-[#269BD7]">
          <ClockFading size={25} strokeWidth={1.7} />
        </button>
      </div>,
    );

    return () => setHeaderActions(null);
  }, [activeSection, definitionSearch, leaves, openingYear, setHeaderActions]);

  if (activeSection === "definitions") {
    const policyDefinitions: DefinitionLeave[] = leaves.map((leave) => ({
      id: leave.leaveId,
      leaveName: leave.leaveName,
      shortName: leave.shortName,
      leave: leave.active,
    }));
    const definitionIds = new Set(policyDefinitions.map((leave) => leave.id));
    const displayedDefinitions = [
      ...policyDefinitions,
      ...newDefinitions.filter((leave) => !definitionIds.has(leave.id)),
    ];

    return (
      <div className="space-y-3">
        <DefinitionsPanel
          leaves={displayedDefinitions}
          loading={policiesLoading || leavesLoading}
          searchValue={definitionSearch}
        />
        {showAddLeave && (
          <AddLeaveDefinitionModal
            onClose={() => setShowAddLeave(false)}
            onSave={(definition: NewLeaveDefinition) => {
              setNewDefinitions((previous) => [
                ...previous,
                { id: Date.now(), ...definition },
              ]);
              setShowAddLeave(false);
            }}
          />
        )}
      </div>
    );
  }

  if (activeSection === "allot-avail-date") {
    return (
      <AllotAvailPanel
        leaveTypes={leaves.map((leave) => ({
          id: leave.leaveId,
          name: leave.leaveName,
          shortName: leave.shortName,
        }))}
        employees={[]}
        loading={policiesLoading || leavesLoading}
        showFilters={allotFiltersOpen}
        onShowFiltersChange={setAllotFiltersOpen}
        selectedLeaveId={allotLeaveType}
        onLeaveChange={setAllotLeaveType}
      />
    );
  }

  if (activeSection === "import") {
    return (
      <ImportPanel
        onDownloadTemplate={() =>
          downloadOpeningBalanceTemplate(
            leaves.map((leave) => leave.leaveName),
            openingYear,
          )
        }
      />
    );
  }

  return (
    <OpeningBalancePanel
      leaveTypes={leaves.map((leave) => ({
        id: leave.leaveId,
        name: leave.leaveName,
      }))}
      selectedLeaveId={openingLeaveType}
      onLeaveChange={setOpeningLeaveType}
      year={openingYear}
      yearOptions={years}
      onYearChange={setOpeningYear}
      employees={[]}
      search={openingBalanceSearch}
      onSearchChange={setOpeningBalanceSearch}
      filters={openingBalanceFilters}
      onFilterChange={(key, value) =>
        setOpeningBalanceFilters((previous) => ({
          ...previous,
          [key]: value,
        }))
      }
      onClearFilters={() =>
        setOpeningBalanceFilters({
          branch: "",
          salaryStructure: "",
          leave: "",
          attendance: "",
          designation: "",
          empStatus: "",
        })
      }
      showFilters={openingFiltersOpen}
      onHideFilters={() => setOpeningFiltersOpen(false)}
      loading={policiesLoading || leavesLoading}
    />
  );
}
