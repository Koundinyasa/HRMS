// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Plus, Search, History, Settings2, Network, ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react";
// import ClassificationNavbar from "../components/ClassificationNavbar";
// import SalaryComponentList from "../components/SalaryComponentList";
// import SalaryStructureTable from "../components/SalaryStructureTable";
// import SalaryStructureEntryModal from "../components/SalaryStructureEntryModal";
// import SalaryStructureSidebar from "../components/SalaryStructureSidebar";
// import { SalaryStructureDefModal, SalaryStructureDeleteModal } from "../components/SalaryStructureDefModal";
// import { useSalaryComponent } from "../hooks/useSalaryComponent";
// import { useSalaryStructure } from "../hooks/useSalaryStructure";
// import { useSalaryStructureDefinitions } from "../hooks/useSalaryStructureDefinitions";

// const ROWS_PER_PAGE_OPTIONS = [25, 50, 100];

// export default function SalaryStructurePage() {
//   const {
//     components, allComponents, isLoading, usingFallback,
//     activeTab, setActiveTab,
//     search, setSearch,
//     isFormOpen, openAdd, openEdit, closeForm,
//     form, setField, setCalculative, setOpenComponent, submit, isSaving,
//     deleteTarget, setDeleteTarget, confirmDelete, isDeleting,
//     createFromDefaults, isCreatingDefaults,
//   } = useSalaryComponent();

//   const {
//     structures,
//     selectedId: selectedStructureId,
//     setSelectedId: setSelectedStructureId,
//     selectedStructure,
//     editingStructure, setEditingStructure, isAdding,
//     openAdd: openAddStructure, openEdit: openEditStructure, closeEdit: closeEditStructure, saveEdit: saveEditStructure,
//     deleteTarget: deleteStructureTarget, setDeleteTarget: setDeleteStructureTarget, confirmDelete: confirmDeleteStructure,
//     cloneStructure,
//   } = useSalaryStructureDefinitions();

//   const {
//     structureTab, setStructureTab,
//     showTillDate, setShowTillDate,
//     earningsCount, deductionsCount,
//     rows: structureRows, setOrder,
//     editingEntry, setEditingEntry, openEditEntry, closeEditEntry, saveEditEntry,
//   } = useSalaryStructure(allComponents, selectedStructureId);

//   const [innerTab, setInnerTab] = useState<"components" | "structure">("components");
//   const [rowsPerPage, setRowsPerPage] = useState(100);
//   const [page, setPage] = useState(1);

//   const total = components.length;
//   const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
//   const safePage = Math.min(page, totalPages);
//   const pageRows = components.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

//   const handleSearchChange = (value: string) => {
//     setSearch(value);
//     setPage(1);
//   };

//   const handleTabChange = (tab: "Earnings" | "Deduction") => {
//     setActiveTab(tab);
//     setPage(1);
//   };

//   return (
//     <div className="w-full">
//       <ClassificationNavbar />

//       <p className="px-4 sm:px-8 mt-4 text-xs text-gray-400">
//         Master / {selectedStructure?.Name ?? "Structure"} / {innerTab === "structure" ? "Structure" : "Components"}
//       </p>

//       <div className="mt-4 px-4 sm:px-8 flex flex-col lg:flex-row gap-6 items-stretch lg:items-start">
//         <SalaryStructureSidebar
//           structures={structures}
//           selectedId={selectedStructureId}
//           onSelect={setSelectedStructureId}
//           onAdd={openAddStructure}
//           onEdit={openEditStructure}
//           onDelete={setDeleteStructureTarget}
//           onClone={cloneStructure}
//         />

//         <div className="flex-1 min-w-0 w-full">
//         <Card className="rounded-2xl border shadow-sm">
//           <CardContent className="p-3 sm:p-6">
//             {/* Components / Structure tabs */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
//               <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border w-fit">
//                 <button
//                   type="button"
//                   onClick={() => setInnerTab("components")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     innerTab === "components" ? "bg-white shadow-sm text-violet-600" : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   <Settings2 size={15} /> Components
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setInnerTab("structure")}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     innerTab === "structure" ? "bg-white shadow-sm text-violet-600" : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   <Network size={15} /> Structure
//                 </button>
//               </div>

//               <div className="flex flex-wrap items-center gap-3">
//                 {innerTab === "structure" && (
//                   <Button variant="outline" className="border-violet-200 text-violet-600 hover:bg-violet-50">
//                     <ChevronsLeft size={16} className="mr-2" /> More Tabs
//                   </Button>
//                 )}
//                 <Button
//                   onClick={innerTab === "components" ? openAdd : undefined}
//                   className="bg-violet-600 hover:bg-violet-700 text-white"
//                 >
//                   <Plus size={16} className="mr-2" /> Component
//                 </Button>
//                 <button
//                   type="button"
//                   aria-label="History"
//                   className="w-9 h-9 rounded-full border flex items-center justify-center text-gray-400 hover:text-gray-600"
//                 >
//                   <History size={16} />
//                 </button>
//               </div>
//             </div>

//             {innerTab === "structure" ? (
//               <div className="rounded-xl border p-3 sm:p-5">
//                 <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
//                   <div className="flex flex-wrap items-center gap-6 text-sm">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="structure-type"
//                         checked={structureTab === "Earnings"}
//                         onChange={() => setStructureTab("Earnings")}
//                         className="accent-violet-600"
//                       />
//                       Earnings
//                       <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
//                         {earningsCount}
//                       </span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="structure-type"
//                         checked={structureTab === "Deduction"}
//                         onChange={() => setStructureTab("Deduction")}
//                         className="accent-violet-600"
//                       />
//                       Deductions
//                       <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
//                         {deductionsCount}
//                       </span>
//                     </label>
//                   </div>

//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <span className="w-2 h-2 rounded-full bg-violet-600 inline-block" />
//                     Calculation
//                   </div>

//                   <select
//                     value={showTillDate}
//                     onChange={(e) => setShowTillDate(e.target.value as "Show Till Date" | "Show All")}
//                     className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
//                   >
//                     <option value="Show Till Date">Show Till Date</option>
//                     <option value="Show All">Show All</option>
//                   </select>
//                 </div>

//                 {isLoading ? (
//                   <p className="text-sm text-muted-foreground py-8 text-center">Loading structure...</p>
//                 ) : (
//                   <SalaryStructureTable
//                     rows={structureRows}
//                     emptyLabel={structureTab === "Earnings" ? "Earnings" : "Deductions"}
//                     onOrderChange={setOrder}
//                     onEdit={(component) => {
//                       const found = structureRows.find((r) => r.component.Id === component.Id);
//                       openEditEntry(component, found ? found.entry.Order : structureRows.length + 1);
//                     }}
//                     onHistory={() => { /* history view not yet wired to a backend endpoint */ }}
//                     onAdd={(component) => {
//                       const found = structureRows.find((r) => r.component.Id === component.Id);
//                       openEditEntry(component, found ? found.entry.Order : structureRows.length + 1);
//                     }}
//                   />
//                 )}
//               </div>
//             ) : (
//               <>
//                 {usingFallback && (
//                   <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
//                     Showing preview data — the salary components API isn't live on the backend yet, so this list
//                     isn't connected to real data and edits won't be saved.
//                   </div>
//                 )}

//                 {/* Inline add/edit form */}
//                 {isFormOpen && (
//                   <div className="mb-6 rounded-xl border p-6 space-y-4 bg-muted/30">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="component-name">Component Name</Label>
//                         <Input
//                           id="component-name"
//                           value={form.componentName}
//                           onChange={(e) => setField("componentName", e.target.value)}
//                           placeholder="e.g. Special Allowance"
//                           maxLength={50}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="component-print-name">Print Name</Label>
//                         <Input
//                           id="component-print-name"
//                           value={form.printName}
//                           onChange={(e) => setField("printName", e.target.value)}
//                           placeholder="e.g. Special Allow"
//                           maxLength={20}
//                         />
//                         <p className="text-xs text-muted-foreground">Shown on payslips. Max 20 characters.</p>
//                       </div>
//                     </div>
//                     <div className="flex flex-wrap gap-8">
//                       <label className="flex items-center gap-2 text-sm">
//                         <input
//                           type="checkbox"
//                           checked={form.isCalculative === 1}
//                           onChange={(e) => setCalculative(e.target.checked ? 1 : 0)}
//                         />
//                         Calculative Field
//                       </label>
//                       <label className="flex items-center gap-2 text-sm">
//                         <input
//                           type="checkbox"
//                           checked={form.isOpenComponent === 1}
//                           onChange={(e) => setOpenComponent(e.target.checked ? 1 : 0)}
//                         />
//                         Open Component
//                       </label>
//                     </div>
//                     <div className="flex justify-end gap-3">
//                       <Button variant="outline" onClick={closeForm}>Cancel</Button>
//                       <Button onClick={submit} disabled={isSaving} className="bg-violet-600 hover:bg-violet-700 text-white">
//                         {isSaving ? "Saving..." : "Save"}
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 {deleteTarget && (
//                   <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                     <p className="text-sm text-red-700">
//                       Delete <strong>{deleteTarget.ComponentName}</strong>? This cannot be undone.
//                     </p>
//                     <div className="flex gap-2">
//                       <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
//                       <Button size="sm" onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
//                         {isDeleting ? "Deleting..." : "Delete"}
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Search + Earnings/Deduction toggle */}
//                 <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
//                   <div className="relative w-full sm:w-64">
//                     <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       value={search}
//                       onChange={(e) => handleSearchChange(e.target.value)}
//                       placeholder="Start Typing..."
//                       className="w-full h-9 rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
//                     />
//                   </div>

//                   <div className="flex flex-wrap items-center gap-6">
//                     <button
//                       type="button"
//                       onClick={createFromDefaults}
//                       disabled={isCreatingDefaults}
//                       className="text-sm font-medium text-violet-600 hover:text-violet-700 disabled:opacity-50"
//                     >
//                       {isCreatingDefaults ? "Adding..." : "Create from default components"}
//                     </button>

//                     <div className="flex items-center gap-4 text-sm">
//                       <label className="flex items-center gap-2 cursor-pointer">
//                         <input
//                           type="radio"
//                           name="component-type"
//                           checked={activeTab === "Earnings"}
//                           onChange={() => handleTabChange("Earnings")}
//                           className="accent-emerald-500"
//                         />
//                         Earnings
//                       </label>
//                       <label className="flex items-center gap-2 cursor-pointer">
//                         <input
//                           type="radio"
//                           name="component-type"
//                           checked={activeTab === "Deduction"}
//                           onChange={() => handleTabChange("Deduction")}
//                           className="accent-gray-400"
//                         />
//                         Deduction
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 {isLoading ? (
//                   <p className="text-sm text-muted-foreground py-8 text-center">Loading components...</p>
//                 ) : (
//                   <SalaryComponentList components={pageRows} onEdit={openEdit} onDelete={setDeleteTarget} />
//                 )}

//                 {/* Pagination footer */}
//                 <div className="flex flex-wrap items-center justify-end gap-4 sm:gap-6 mt-4 text-sm text-muted-foreground">
//                   <div className="flex items-center gap-2">
//                     <span>Rows per page</span>
//                     <select
//                       value={rowsPerPage}
//                       onChange={(e) => {
//                         setRowsPerPage(Number(e.target.value));
//                         setPage(1);
//                       }}
//                       className="h-8 rounded-md border border-input bg-transparent px-2 text-sm outline-none"
//                     >
//                       {ROWS_PER_PAGE_OPTIONS.map((n) => (
//                         <option key={n} value={n}>{n}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <span>
//                     {total === 0 ? "0 of 0" : `${(safePage - 1) * rowsPerPage + 1} to ${(safePage - 1) * rowsPerPage + pageRows.length} of ${total}`}
//                   </span>
//                   <div className="flex items-center gap-1">
//                     <button
//                       type="button"
//                       disabled={safePage <= 1}
//                       onClick={() => setPage(safePage - 1)}
//                       className="w-7 h-7 flex items-center justify-center rounded-md disabled:opacity-30 hover:bg-gray-100"
//                       aria-label="Previous page"
//                     >
//                       <ChevronLeft size={16} />
//                     </button>
//                     <span className="w-7 h-7 flex items-center justify-center rounded-md bg-violet-600 text-white font-medium text-xs">
//                       {safePage}
//                     </span>
//                     <button
//                       type="button"
//                       disabled={safePage >= totalPages}
//                       onClick={() => setPage(safePage + 1)}
//                       className="w-7 h-7 flex items-center justify-center rounded-md disabled:opacity-30 hover:bg-gray-100"
//                       aria-label="Next page"
//                     >
//                       <ChevronRight size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>
//         </div>
//       </div>

//       {editingEntry && (
//         <SalaryStructureEntryModal
//           entry={editingEntry}
//           componentName={
//             allComponents.find((c) => c.Id === editingEntry.ComponentId)?.ComponentName ?? "Component"
//           }
//           onChange={setEditingEntry}
//           onClose={closeEditEntry}
//           onSave={saveEditEntry}
//         />
//       )}

//       {editingStructure && (
//         <SalaryStructureDefModal
//           structure={editingStructure}
//           isAdding={isAdding}
//           onChange={setEditingStructure}
//           onClose={closeEditStructure}
//           onSave={saveEditStructure}
//         />
//       )}

//       {deleteStructureTarget && (
//         <SalaryStructureDeleteModal
//           structure={deleteStructureTarget}
//           onCancel={() => setDeleteStructureTarget(null)}
//           onConfirm={confirmDeleteStructure}
//         />
//       )}
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Plus,
  Search,
  History,
  Settings2,
  Network,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";

import ClassificationNavbar from "../components/ClassificationNavbar";
import SalaryComponentList from "../components/SalaryComponentList";
import SalaryStructureTable from "../components/SalaryStructureTable";
import SalaryStructureEntryModal from "../components/SalaryStructureEntryModal";
import SalaryStructureSidebar from "../components/SalaryStructureSidebar";
import {
  SalaryStructureDefModal,
  SalaryStructureDeleteModal,
} from "../components/SalaryStructureDefModal";

import { useSalaryComponent } from "../hooks/useSalaryComponent";
import { useSalaryStructure } from "../hooks/useSalaryStructure";
import { useSalaryStructureDefinitions } from "../hooks/useSalaryStructureDefinitions";

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100];

/* =========================================================
   COMPACT ROWS PER PAGE DROPDOWN
   ========================================================= */

function RowsPerPageDropdown({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleSelect = (option: number) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative z-[9999] shrink-0"
    >
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          h-7
          w-[58px]
          rounded-md
          border
          border-gray-200
          bg-white
          px-2
          text-[12px]
          text-gray-700
          flex
          items-center
          justify-between
          outline-none
          cursor-pointer
          hover:border-gray-300
          focus:border-violet-400
          focus:ring-1
          focus:ring-violet-200
        "
      >
        <span>{value}</span>

        <ChevronDown
          size={11}
          className={`
            shrink-0
            text-gray-500
            transition-transform
            duration-150
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="
            absolute
            left-0
            top-full
            mt-1
            z-[99999]
            w-[58px]
            overflow-hidden
            rounded-md
            border
            border-gray-200
            bg-white
            shadow-md
          "
        >
          {ROWS_PER_PAGE_OPTIONS.map((option) => {
            const selected = option === value;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => handleSelect(option)}
                className={`
                  h-7
                  w-full
                  px-2
                  flex
                  items-center
                  justify-between
                  text-[12px]
                  whitespace-nowrap
                  cursor-pointer
                  transition-colors
                  ${
                    selected
                      ? "bg-violet-100 text-violet-700 font-medium"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <span>{option}</span>

                {selected && (
                  <Check
                    size={10}
                    className="text-violet-600"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SALARY STRUCTURE PAGE
   ========================================================= */

export default function SalaryStructurePage() {
  const {
    components,
    allComponents,
    isLoading,
    usingFallback,

    activeTab,
    setActiveTab,

    search,
    setSearch,

    isFormOpen,
    openAdd,
    openEdit,
    closeForm,

    form,
    setField,
    setCalculative,
    setOpenComponent,
    submit,
    isSaving,

    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting,

    createFromDefaults,
    isCreatingDefaults,
  } = useSalaryComponent();

  const {
    structures,
    selectedId: selectedStructureId,
    setSelectedId: setSelectedStructureId,
    selectedStructure,

    editingStructure,
    setEditingStructure,
    isAdding,

    openAdd: openAddStructure,
    openEdit: openEditStructure,
    closeEdit: closeEditStructure,
    saveEdit: saveEditStructure,

    deleteTarget: deleteStructureTarget,
    setDeleteTarget: setDeleteStructureTarget,
    confirmDelete: confirmDeleteStructure,

    cloneStructure,
  } = useSalaryStructureDefinitions();

  const {
    structureTab,
    setStructureTab,

    showTillDate,
    setShowTillDate,

    earningsCount,
    deductionsCount,

    rows: structureRows,
    setOrder,

    editingEntry,
    setEditingEntry,
    openEditEntry,
    closeEditEntry,
    saveEditEntry,
  } = useSalaryStructure(
    allComponents,
    selectedStructureId
  );

  /* =========================================================
     LOCAL UI STATE
     ========================================================= */

  const [innerTab, setInnerTab] = useState<
    "components" | "structure"
  >("components");

  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [page, setPage] = useState(1);

  /* =========================================================
     PAGINATION
     ========================================================= */

  const total = components.length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / rowsPerPage)
  );

  const safePage = Math.min(
    page,
    totalPages
  );

  const pageRows = components.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  /* =========================================================
     SEARCH
     ========================================================= */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  /* =========================================================
     COMPONENT TAB
     ========================================================= */

  const handleTabChange = (
    tab: "Earnings" | "Deduction"
  ) => {
    setActiveTab(tab);
    setPage(1);
  };

  /* =========================================================
     ROWS PER PAGE
     ========================================================= */

  const handleRowsPerPageChange = (
    value: number
  ) => {
    setRowsPerPage(value);
    setPage(1);
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="w-full min-w-0 overflow-x-hidden box-border">
      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <ClassificationNavbar />

      {/* =====================================================
          BREADCRUMB
          ===================================================== */}

      <p
        className="
          px-4
          sm:px-6
          lg:px-8
          mt-3
          sm:mt-4
          text-xs
          text-gray-400
          truncate
        "
      >
        Master /{" "}
        {selectedStructure?.Name ?? "Structure"} /{" "}
        {innerTab === "structure"
          ? "Structure"
          : "Components"}
      </p>

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <div
        className="
          mt-3
          sm:mt-4
          px-3
          sm:px-6
          lg:px-8
          pb-6
          sm:pb-8
          w-full
          min-w-0
        "
      >
        {/* ===================================================
            COMPONENTS VIEW

            IMPORTANT:
            NO SIDEBAR HERE.
            THIS IS THE FULL-WIDTH COMPONENTS VIEW.
            =================================================== */}

        {innerTab === "components" ? (
          <div className="w-full min-w-0">
            <Card
              className="
                w-full
                min-w-0
                rounded-xl
                sm:rounded-2xl
                border
                border-gray-100
                shadow-sm
                overflow-visible
              "
            >
              <CardContent
                className="
                  p-3
                  sm:p-5
                  lg:p-6
                  min-w-0
                "
              >
                {/* =========================================
                    COMPONENTS / STRUCTURE TABS + ACTIONS
                    ========================================= */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    justify-between
                    gap-3
                    mb-5
                  "
                >
                  {/* Tabs */}

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                      bg-gray-50
                      rounded-xl
                      p-1
                      border
                      border-gray-100
                      w-fit
                      max-w-full
                    "
                  >
                    {/* Components */}

                    <button
                      type="button"
                      onClick={() =>
                        setInnerTab("components")
                      }
                      className="
                        flex
                        items-center
                        gap-1.5
                        px-3
                        sm:px-4
                        py-2
                        rounded-lg
                        text-xs
                        sm:text-sm
                        font-medium
                        transition-colors
                        whitespace-nowrap
                        bg-white
                        shadow-sm
                        text-violet-600
                      "
                    >
                      <Settings2 size={14} />
                      Components
                    </button>

                    {/* Structure */}

                    <button
                      type="button"
                      onClick={() =>
                        setInnerTab("structure")
                      }
                      className="
                        flex
                        items-center
                        gap-1.5
                        px-3
                        sm:px-4
                        py-2
                        rounded-lg
                        text-xs
                        sm:text-sm
                        font-medium
                        transition-colors
                        whitespace-nowrap
                        text-gray-500
                        hover:text-gray-700
                      "
                    >
                      <Network size={14} />
                      Structure
                    </button>
                  </div>

                  {/* Actions */}

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                      sm:gap-3
                    "
                  >
                    <Button
                      onClick={openAdd}
                      className="
                        h-9
                        bg-violet-600
                        hover:bg-violet-700
                        text-white
                        text-xs
                        sm:text-sm
                      "
                    >
                      <Plus
                        size={15}
                        className="mr-1.5"
                      />
                      Component
                    </Button>

                    <button
                      type="button"
                      aria-label="History"
                      className="
                        w-9
                        h-9
                        rounded-full
                        border
                        border-gray-200
                        flex
                        items-center
                        justify-center
                        text-gray-400
                        hover:text-gray-600
                        hover:bg-gray-50
                        shrink-0
                      "
                    >
                      <History size={15} />
                    </button>
                  </div>
                </div>

                {/* =========================================
                    FALLBACK MESSAGE
                    ========================================= */}

                {usingFallback && (
                  <div
                    className="
                      mb-4
                      rounded-lg
                      border
                      border-amber-200
                      bg-amber-50
                      px-3
                      sm:px-4
                      py-2
                      text-xs
                      text-amber-700
                      leading-relaxed
                    "
                  >
                    Showing preview data — the salary
                    components API isn't live on the
                    backend yet, so this list isn't
                    connected to real data and edits
                    won't be saved.
                  </div>
                )}

                {/* =========================================
                    INLINE ADD / EDIT FORM
                    ========================================= */}

                {isFormOpen && (
                  <div
                    className="
                      mb-5
                      rounded-xl
                      border
                      border-gray-100
                      p-4
                      sm:p-6
                      space-y-4
                      bg-muted/30
                    "
                  >
                    <div
                      className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-4
                      "
                    >
                      <div className="space-y-2">
                        <Label htmlFor="component-name">
                          Component Name
                        </Label>

                        <Input
                          id="component-name"
                          value={
                            form.componentName
                          }
                          onChange={(e) =>
                            setField(
                              "componentName",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Special Allowance"
                          maxLength={50}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="component-print-name">
                          Print Name
                        </Label>

                        <Input
                          id="component-print-name"
                          value={form.printName}
                          onChange={(e) =>
                            setField(
                              "printName",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Special Allow"
                          maxLength={20}
                        />

                        <p className="text-xs text-muted-foreground">
                          Shown on payslips. Max 20
                          characters.
                        </p>
                      </div>
                    </div>

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-6
                        sm:gap-8
                      "
                    >
                      <label
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                        "
                      >
                        <input
                          type="checkbox"
                          checked={
                            form.isCalculative === 1
                          }
                          onChange={(e) =>
                            setCalculative(
                              e.target.checked
                                ? 1
                                : 0
                            )
                          }
                        />

                        Calculative Field
                      </label>

                      <label
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                        "
                      >
                        <input
                          type="checkbox"
                          checked={
                            form.isOpenComponent === 1
                          }
                          onChange={(e) =>
                            setOpenComponent(
                              e.target.checked
                                ? 1
                                : 0
                            )
                          }
                        />

                        Open Component
                      </label>
                    </div>

                    <div
                      className="
                        flex
                        justify-end
                        gap-2
                        sm:gap-3
                      "
                    >
                      <Button
                        variant="outline"
                        onClick={closeForm}
                      >
                        Cancel
                      </Button>

                      <Button
                        onClick={submit}
                        disabled={isSaving}
                        className="
                          bg-violet-600
                          hover:bg-violet-700
                          text-white
                        "
                      >
                        {isSaving
                          ? "Saving..."
                          : "Save"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* =========================================
                    DELETE MESSAGE
                    ========================================= */}

                {deleteTarget && (
                  <div
                    className="
                      mb-5
                      rounded-xl
                      border
                      border-red-200
                      bg-red-50
                      p-4
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      justify-between
                      gap-3
                    "
                  >
                    <p className="text-sm text-red-700">
                      Delete{" "}
                      <strong>
                        {
                          deleteTarget.ComponentName
                        }
                      </strong>
                      ? This cannot be undone.
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setDeleteTarget(null)
                        }
                      >
                        Cancel
                      </Button>

                      <Button
                        size="sm"
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        className="
                          bg-red-600
                          hover:bg-red-700
                          text-white
                        "
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* =========================================
                    SEARCH + TYPE
                    ========================================= */}

                <div
                  className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    mb-4
                    gap-3
                  "
                >
                  {/* Search */}

                  <div
                    className="
                      relative
                      w-full
                      sm:w-64
                    "
                  >
                    <Search
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      value={search}
                      onChange={(e) =>
                        handleSearchChange(
                          e.target.value
                        )
                      }
                      placeholder="Start Typing..."
                      className="
                        w-full
                        h-9
                        rounded-lg
                        border
                        border-input
                        bg-transparent
                        pl-9
                        pr-3
                        text-sm
                        outline-none
                        focus-visible:ring-2
                        focus-visible:ring-violet-500
                      "
                    />
                  </div>

                  {/* Right Controls */}

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-4
                      sm:gap-6
                    "
                  >
                    <button
                      type="button"
                      onClick={
                        createFromDefaults
                      }
                      disabled={
                        isCreatingDefaults
                      }
                      className="
                        text-xs
                        sm:text-sm
                        font-medium
                        text-violet-600
                        hover:text-violet-700
                        disabled:opacity-50
                        whitespace-nowrap
                      "
                    >
                      {isCreatingDefaults
                        ? "Adding..."
                        : "Create from default components"}
                    </button>

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                        text-xs
                        sm:text-sm
                      "
                    >
                      <label
                        className="
                          flex
                          items-center
                          gap-2
                          cursor-pointer
                          whitespace-nowrap
                        "
                      >
                        <input
                          type="radio"
                          name="component-type"
                          checked={
                            activeTab ===
                            "Earnings"
                          }
                          onChange={() =>
                            handleTabChange(
                              "Earnings"
                            )
                          }
                          className="accent-emerald-500"
                        />

                        Earnings
                      </label>

                      <label
                        className="
                          flex
                          items-center
                          gap-2
                          cursor-pointer
                          whitespace-nowrap
                        "
                      >
                        <input
                          type="radio"
                          name="component-type"
                          checked={
                            activeTab ===
                            "Deduction"
                          }
                          onChange={() =>
                            handleTabChange(
                              "Deduction"
                            )
                          }
                          className="accent-gray-400"
                        />

                        Deduction
                      </label>
                    </div>
                  </div>
                </div>

                {/* =========================================
                    COMPONENT TABLE
                    ========================================= */}

                {isLoading ? (
                  <p
                    className="
                      text-sm
                      text-muted-foreground
                      py-8
                      text-center
                    "
                  >
                    Loading components...
                  </p>
                ) : (
                  <div
                    className="
                      w-full
                      min-w-0
                      overflow-x-auto
                    "
                  >
                    <SalaryComponentList
                      components={pageRows}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                    />
                  </div>
                )}

                {/* =========================================
                    PAGINATION FOOTER
                    ========================================= */}

                <div
                  className="
                    relative
                    z-50
                    w-full
                    h-[52px]
                    min-h-[52px]
                    mt-4
                    border-t
                    border-gray-100
                    bg-white
                    overflow-visible
                  "
                >
                  <div
                    className="
                      w-full
                      h-full
                      flex
                      items-center
                      justify-between
                      px-0
                      sm:px-1
                      gap-3
                      overflow-visible
                    "
                  >
                    {/* Rows per page */}

                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        shrink-0
                      "
                    >
                      <span
                        className="
                          text-[11px]
                          text-gray-600
                          whitespace-nowrap
                        "
                      >
                        Rows per page
                      </span>

                      <RowsPerPageDropdown
                        value={rowsPerPage}
                        onChange={
                          handleRowsPerPageChange
                        }
                      />
                    </div>

                    {/* Range */}

                    <span
                      className="
                        text-[11px]
                        text-gray-600
                        whitespace-nowrap
                        ml-auto
                      "
                    >
                      {total === 0
                        ? "0 to 0 of 0"
                        : `${(safePage - 1) * rowsPerPage + 1} to ${
                            (safePage - 1) *
                              rowsPerPage +
                            pageRows.length
                          } of ${total}`}
                    </span>

                    {/* Pagination */}

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        shrink-0
                      "
                    >
                      {/* Previous */}

                      <button
                        type="button"
                        disabled={safePage <= 1}
                        onClick={() =>
                          setPage(
                            safePage - 1
                          )
                        }
                        aria-label="Previous page"
                        className="
                          w-9
                          h-9
                          rounded-full
                          border
                          border-gray-200
                          bg-white
                          flex
                          items-center
                          justify-center
                          text-gray-400
                          disabled:opacity-40
                          disabled:cursor-not-allowed
                          hover:bg-gray-50
                          transition-colors
                          shrink-0
                        "
                      >
                        <ChevronLeft size={14} />
                      </button>

                      {/* Current */}

                      <span
                        className="
                          w-9
                          h-9
                          rounded-full
                          bg-violet-100
                          text-violet-700
                          flex
                          items-center
                          justify-center
                          text-[12px]
                          font-medium
                          shrink-0
                        "
                      >
                        {safePage}
                      </span>

                      {/* Next */}

                      <button
                        type="button"
                        disabled={
                          safePage >=
                          totalPages
                        }
                        onClick={() =>
                          setPage(
                            safePage + 1
                          )
                        }
                        aria-label="Next page"
                        className="
                          w-9
                          h-9
                          rounded-full
                          border
                          border-gray-200
                          bg-white
                          flex
                          items-center
                          justify-center
                          text-gray-400
                          disabled:opacity-40
                          disabled:cursor-not-allowed
                          hover:bg-gray-50
                          transition-colors
                          shrink-0
                        "
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* ===================================================
             STRUCTURE VIEW

             SIDEBAR IS ONLY SHOWN HERE.
             =================================================== */

          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-4
              lg:gap-5
              items-stretch
              lg:items-start
              w-full
              min-w-0
            "
          >
            {/* ===============================================
                STRUCTURE SIDEBAR
                =============================================== */}

            <div
              className="
                w-full
                lg:w-[250px]
                xl:w-[270px]
                shrink-0
              "
            >
              <SalaryStructureSidebar
                structures={structures}
                selectedId={selectedStructureId}
                onSelect={setSelectedStructureId}
                onAdd={openAddStructure}
                onEdit={openEditStructure}
                onDelete={
                  setDeleteStructureTarget
                }
                onClone={cloneStructure}
              />
            </div>

            {/* ===============================================
                STRUCTURE RIGHT CONTENT
                =============================================== */}

            <div className="flex-1 min-w-0 w-full">
              <Card
                className="
                  w-full
                  min-w-0
                  rounded-xl
                  sm:rounded-2xl
                  border
                  border-gray-100
                  shadow-sm
                  overflow-visible
                "
              >
                <CardContent
                  className="
                    p-3
                    sm:p-5
                    lg:p-6
                    min-w-0
                  "
                >
                  {/* =========================================
                      COMPONENTS / STRUCTURE TABS
                      ========================================= */}

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      justify-between
                      gap-3
                      mb-5
                    "
                  >
                    {/* Tabs */}

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        bg-gray-50
                        rounded-xl
                        p-1
                        border
                        border-gray-100
                        w-fit
                        max-w-full
                      "
                    >
                      {/* Components */}

                      <button
                        type="button"
                        onClick={() =>
                          setInnerTab(
                            "components"
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-1.5
                          px-3
                          sm:px-4
                          py-2
                          rounded-lg
                          text-xs
                          sm:text-sm
                          font-medium
                          transition-colors
                          whitespace-nowrap
                          text-gray-500
                          hover:text-gray-700
                        "
                      >
                        <Settings2 size={14} />
                        Components
                      </button>

                      {/* Structure */}

                      <button
                        type="button"
                        onClick={() =>
                          setInnerTab(
                            "structure"
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-1.5
                          px-3
                          sm:px-4
                          py-2
                          rounded-lg
                          text-xs
                          sm:text-sm
                          font-medium
                          transition-colors
                          whitespace-nowrap
                          bg-white
                          shadow-sm
                          text-violet-600
                        "
                      >
                        <Network size={14} />
                        Structure
                      </button>
                    </div>

                    {/* Actions */}

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        sm:gap-3
                      "
                    >
                      <Button
                        variant="outline"
                        className="
                          h-9
                          border-violet-200
                          text-violet-600
                          hover:bg-violet-50
                          text-xs
                          sm:text-sm
                        "
                      >
                        More Tabs
                      </Button>

                      <Button
                        onClick={undefined}
                        className="
                          h-9
                          bg-violet-600
                          hover:bg-violet-700
                          text-white
                          text-xs
                          sm:text-sm
                        "
                      >
                        <Plus
                          size={15}
                          className="mr-1.5"
                        />
                        Component
                      </Button>

                      <button
                        type="button"
                        aria-label="History"
                        className="
                          w-9
                          h-9
                          rounded-full
                          border
                          border-gray-200
                          flex
                          items-center
                          justify-center
                          text-gray-400
                          hover:text-gray-600
                          hover:bg-gray-50
                          shrink-0
                        "
                      >
                        <History size={15} />
                      </button>
                    </div>
                  </div>

                  {/* =========================================
                      STRUCTURE CONTENT
                      ========================================= */}

                  <div
                    className="
                      rounded-xl
                      border
                      border-gray-100
                      p-3
                      sm:p-4
                      lg:p-5
                      min-w-0
                      overflow-hidden
                    "
                  >
                    {/* =======================================
                        STRUCTURE CONTROLS
                        ======================================= */}

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                        mb-4
                      "
                    >
                      {/* Earnings / Deductions */}

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-4
                          sm:gap-6
                          text-xs
                          sm:text-sm
                        "
                      >
                        <label
                          className="
                            flex
                            items-center
                            gap-2
                            cursor-pointer
                            whitespace-nowrap
                          "
                        >
                          <input
                            type="radio"
                            name="structure-type"
                            checked={
                              structureTab ===
                              "Earnings"
                            }
                            onChange={() =>
                              setStructureTab(
                                "Earnings"
                              )
                            }
                            className="accent-violet-600"
                          />

                          Earnings

                          <span
                            className="
                              px-2
                              py-0.5
                              rounded-full
                              text-[10px]
                              font-medium
                              bg-emerald-50
                              text-emerald-600
                            "
                          >
                            {earningsCount}
                          </span>
                        </label>

                        <label
                          className="
                            flex
                            items-center
                            gap-2
                            cursor-pointer
                            whitespace-nowrap
                          "
                        >
                          <input
                            type="radio"
                            name="structure-type"
                            checked={
                              structureTab ===
                              "Deduction"
                            }
                            onChange={() =>
                              setStructureTab(
                                "Deduction"
                              )
                            }
                            className="accent-violet-600"
                          />

                          Deductions

                          <span
                            className="
                              px-2
                              py-0.5
                              rounded-full
                              text-[10px]
                              font-medium
                              bg-gray-100
                              text-gray-500
                            "
                          >
                            {deductionsCount}
                          </span>
                        </label>
                      </div>

                      {/* Calculation */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          sm:text-sm
                          text-gray-600
                          whitespace-nowrap
                        "
                      >
                        <span
                          className="
                            w-2
                            h-2
                            rounded-full
                            bg-violet-600
                            inline-block
                          "
                        />

                        Calculation
                      </div>

                      {/* Show Till Date */}

                      <select
                        value={showTillDate}
                        onChange={(e) =>
                          setShowTillDate(
                            e.target.value as
                              | "Show Till Date"
                              | "Show All"
                          )
                        }
                        className="
                          h-8
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          px-2.5
                          text-xs
                          sm:text-sm
                          outline-none
                          focus:border-violet-400
                          focus:ring-1
                          focus:ring-violet-200
                        "
                      >
                        <option value="Show Till Date">
                          Show Till Date
                        </option>

                        <option value="Show All">
                          Show All
                        </option>
                      </select>
                    </div>

                    {/* =======================================
                        STRUCTURE TABLE
                        ======================================= */}

                    {isLoading ? (
                      <p
                        className="
                          text-sm
                          text-muted-foreground
                          py-8
                          text-center
                        "
                      >
                        Loading structure...
                      </p>
                    ) : (
                      <div
                        className="
                          w-full
                          min-w-0
                          overflow-x-auto
                        "
                      >
                        <SalaryStructureTable
                          rows={structureRows}
                          emptyLabel={
                            structureTab ===
                            "Earnings"
                              ? "Earnings"
                              : "Deductions"
                          }
                          onOrderChange={setOrder}
                          onEdit={(component) => {
                            const found =
                              structureRows.find(
                                (r) =>
                                  r.component.Id ===
                                  component.Id
                              );

                            openEditEntry(
                              component,
                              found
                                ? found.entry.Order
                                : structureRows.length +
                                    1
                            );
                          }}
                          onHistory={() => {
                            /* history view not yet wired */
                          }}
                          onAdd={(component) => {
                            const found =
                              structureRows.find(
                                (r) =>
                                  r.component.Id ===
                                  component.Id
                              );

                            openEditEntry(
                              component,
                              found
                                ? found.entry.Order
                                : structureRows.length +
                                    1
                            );
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          SALARY STRUCTURE ENTRY MODAL
          ========================================================= */}

      {editingEntry && (
        <SalaryStructureEntryModal
          entry={editingEntry}
          componentName={
            allComponents.find(
              (c) =>
                c.Id === editingEntry.ComponentId
            )?.ComponentName ?? "Component"
          }
          onChange={setEditingEntry}
          onClose={closeEditEntry}
          onSave={saveEditEntry}
        />
      )}

      {/* =========================================================
          SALARY STRUCTURE DEFINITION MODAL
          ========================================================= */}

      {editingStructure && (
        <SalaryStructureDefModal
          structure={editingStructure}
          isAdding={isAdding}
          onChange={setEditingStructure}
          onClose={closeEditStructure}
          onSave={saveEditStructure}
        />
      )}

      {/* =========================================================
          SALARY STRUCTURE DELETE MODAL
          ========================================================= */}

      {deleteStructureTarget && (
        <SalaryStructureDeleteModal
          structure={deleteStructureTarget}
          onCancel={() =>
            setDeleteStructureTarget(null)
          }
          onConfirm={confirmDeleteStructure}
        />
      )}
    </div>
  );
}