// import { useState, useEffect } from "react";
// import {
//   Plus,
//   FileText,
//   Trash2,
//   ChevronDown,
//   Clock3,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import EmployeeGroup from "./EmployeeGroup";
// import ModuleSettings from "./ModuleSettings";

// import { useWorkflows } from "./hooks/useWorkflows";
// import type { WorkflowModule } from "./types/workflowTypes";
// import {
//   validateWorkflowName,
//   validateAddLevel,
// } from "./validations/workflowValidations";

// const TABS = ["Workflow", "Employee Group", "Module Settings"];

// const MODULE_OPTIONS: { label: string; value: WorkflowModule }[] = [
//   { label: "Leave Apply (ESS)", value: "leaveApply" },
//   { label: "Attendance", value: "attendance" },
//   { label: "Expense", value: "expense" },
// ];

// // Fallback initial data matching the exact UI mockup
// const DEFAULT_WORKFLOWS = [
//   {
//     id: "wf-1",
//     name: "Leave Apply RA Level 1",
//     module: "leaveApply",
//     levels: [
//       {
//         id: "lvl-1",
//         level: 1,
//         authorityType: "Reporting Authority",
//         authorityName: "Reporting 1",
//       },
//     ],
//   },
// ];

// export default function WorkflowsPage() {
//   const [activeTab, setActiveTab] = useState("Workflow");
//   const [selectedModule, setSelectedModule] = useState<WorkflowModule>("leaveApply");

//   const hookWorkflows = useWorkflows(selectedModule);

//   // Combine hook data with fallback default data so UI matches screenshot immediately
//   const rawWorkflows = hookWorkflows.workflows?.length ? hookWorkflows.workflows : DEFAULT_WORKFLOWS;
//   const workflows = rawWorkflows;

//   const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(
//     workflows[0]?.id || "wf-1"
//   );

//   const selectedWorkflow =
//     workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newName, setNewName] = useState("");
//   const [error, setError] = useState("");

//   // Keep selection updated when module changes
//   useEffect(() => {
//     if (workflows.length > 0) {
//       setSelectedWorkflowId(workflows[0].id);
//     }
//   }, [selectedModule]);

//   // ---------- Handlers ----------
//   async function handleCreateWorkflow() {
//     const result = validateWorkflowName(newName, workflows);
//     if (!result.isValid) {
//       setError(result.error || "");
//       return;
//     }

//     try {
//       if (hookWorkflows.handleCreateWorkflow) {
//         await hookWorkflows.handleCreateWorkflow(newName.trim());
//       }
//       setNewName("");
//       setError("");
//       setShowAddModal(false);
//     } catch (err) {
//       console.error("Failed to create workflow", err);
//       setError("Failed to create workflow. Please try again.");
//     }
//   }

//   async function handleAddLevel() {
//     if (!selectedWorkflow) return;

//     const result = validateAddLevel(selectedWorkflow.levels.length);
//     if (!result.isValid) {
//       setError(result.error || "");
//       return;
//     }

//     try {
//       if (hookWorkflows.handleAddLevel) {
//         await hookWorkflows.handleAddLevel(selectedWorkflow.id);
//       }
//     } catch (err) {
//       console.error("Failed to add level", err);
//     }
//   }

//   async function handleDeleteLevel(levelId: string) {
//     if (!selectedWorkflow) return;
//     try {
//       if (hookWorkflows.handleDeleteLevel) {
//         await hookWorkflows.handleDeleteLevel(selectedWorkflow.id, levelId);
//       }
//     } catch (err) {
//       console.error("Failed to delete level", err);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F7FC] p-6 text-slate-800">
//       {/* ==================== TOP BAR ==================== */}
//       <div className="mb-6 flex items-center justify-between gap-4">
//         {/* Navigation Tabs Pill Container */}
//         <div className="inline-flex rounded-2xl bg-[#EDE9FE]/70 p-1.5">
//           <div className="flex items-center gap-1">
//             {TABS.map((tab) => (
//               <button
//                 key={tab}
//                 type="button"
//                 onClick={() => setActiveTab(tab)}
//                 className={`rounded-xl px-7 py-2.5 text-xs font-semibold transition-all ${
//                   activeTab === tab
//                     ? "bg-[#7C5CFC] text-white shadow-sm"
//                     : "text-slate-700 hover:bg-white/50"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Top Right Dropdown & Clock */}
//         {activeTab === "Workflow" && (
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <select
//                 value={selectedModule}
//                 onChange={(e) => setSelectedModule(e.target.value as WorkflowModule)}
//                 className="h-10 appearance-none rounded-xl bg-[#7C5CFC] pl-5 pr-10 text-xs font-semibold text-white outline-none cursor-pointer"
//               >
//                 {MODULE_OPTIONS.map((m) => (
//                   <option key={m.value} value={m.value} className="text-gray-800">
//                     {m.label}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
//             </div>
//             <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl bg-white border-slate-200">
//               <Clock3 className="h-4 w-4 text-slate-600" />
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* ==================== WORKFLOW TAB ==================== */}
//       {activeTab === "Workflow" && (
//         <div className="grid grid-cols-12 gap-6">
//           {/* Left Panel: Workflow Items */}
//           <div className="col-span-12 md:col-span-4 lg:col-span-3">
//             <div className="min-h-[540px] overflow-hidden rounded-2xl bg-[#F2EFFE]">
//               {/* Card Header */}
//               <div className="flex items-center justify-between p-4 pb-3">
//                 <h2 className="text-xs font-bold text-slate-800">
//                   Workflow ({MODULE_OPTIONS.find((m) => m.value === selectedModule)?.label})
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(true)}
//                   className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#7C5CFC] bg-white text-[#7C5CFC] transition-colors hover:bg-violet-50"
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               </div>

//               {/* Workflow Items List */}
//               <div className="space-y-0">
//                 {workflows.map((item) => {
//                   const isSelected = selectedWorkflow.id === item.id;
//                   return (
//                     <button
//                       key={item.id}
//                       type="button"
//                       onClick={() => setSelectedWorkflowId(item.id)}
//                       className={`flex w-full items-center gap-3 px-4 py-3 text-left text-xs font-medium transition-all ${
//                         isSelected
//                           ? "bg-[#7C5CFC] text-white"
//                           : "text-slate-700 hover:bg-violet-100/60"
//                       }`}
//                     >
//                       <div
//                         className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
//                           isSelected
//                             ? "bg-white text-[#7C5CFC]"
//                             : "bg-white text-[#7C5CFC]"
//                         }`}
//                       >
//                         <FileText className="h-4 w-4" />
//                       </div>
//                       <span className="truncate">{item.name}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Right Main Panel: Approval Levels */}
//           <div className="col-span-12 md:col-span-8 lg:col-span-9">
//             <div className="min-h-[540px] rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
//               {!selectedWorkflow || selectedWorkflow.levels.length === 0 ? (
//                 <div className="flex min-h-[460px] flex-col items-center justify-center text-slate-400">
//                   <p className="mb-4 text-xs font-medium">No levels added yet</p>
//                   <Button
//                     onClick={handleAddLevel}
//                     className="rounded-xl bg-[#7C5CFC] hover:bg-violet-700 text-xs font-semibold"
//                   >
//                     + Add Level
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {selectedWorkflow.levels.map((level) => (
//                     <div
//                       key={level.id}
//                       className="flex items-center justify-between rounded-2xl bg-[#F6F3FF] px-8 py-3.5"
//                     >
//                       {/* Left and Middle Columns */}
//                       <div className="grid flex-1 grid-cols-3 items-center pr-6 text-xs text-slate-800">
//                         <span className="font-semibold text-slate-900">
//                           Level {level.level}
//                         </span>
//                         <span className="text-center font-medium text-slate-800">
//                           {level.authorityType}
//                         </span>
//                         <span className="text-right font-semibold text-[#10B981]">
//                           {level.authorityName}
//                         </span>
//                       </div>

//                       {/* Right Action Icons */}
//                       <div className="flex items-center gap-3">
//                         <button
//                           type="button"
//                           onClick={handleAddLevel}
//                           className="text-slate-800 hover:text-[#7C5CFC]"
//                         >
//                           <Plus className="h-4 w-4" />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => handleDeleteLevel(level.id)}
//                           className="text-[#EF4444] hover:opacity-80"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                         <button type="button" className="text-slate-800">
//                           <ChevronDown className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==================== OTHER TABS ==================== */}
//       {activeTab === "Employee Group" && <EmployeeGroup />}
//       {activeTab === "Module Settings" && <ModuleSettings />}

//       {/* ========== Create Workflow Modal ========== */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
//             <h2 className="mb-4 text-base font-bold text-slate-800">Create Workflow</h2>
//             <div className="mb-4">
//               <label className="text-xs font-semibold text-slate-700">
//                 Workflow Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 value={newName}
//                 onChange={(e) => {
//                   setNewName(e.target.value);
//                   setError("");
//                 }}
//                 placeholder="e.g. Leave Apply RA Level 1"
//                 className="mt-1.5 text-xs"
//               />
//               {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   setShowAddModal(false);
//                   setNewName("");
//                   setError("");
//                 }}
//                 className="text-xs font-semibold"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 size="sm"
//                 onClick={handleCreateWorkflow}
//                 className="bg-[#7C5CFC] hover:bg-violet-700 text-xs font-semibold text-white"
//               >
//                 Create
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }















// import { useState, useEffect } from "react";
// import {
//   Plus,
//   FileText,
//   Trash2,
//   ChevronDown,
//   Clock3,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { StyledSelect } from "@/components/ui/select";

// import EmployeeGroup from "./EmployeeGroup";
// import ModuleSettings from "./ModuleSettings";

// import { useWorkflows } from "./hooks/useWorkflows";
// import type { WorkflowModule } from "./types/workflowTypes";
// import {
//   validateWorkflowName,
//   validateAddLevel,
// } from "./validations/workflowValidations";

// const TABS = ["Workflow", "Employee Group", "Module Settings"];

// const MODULE_OPTIONS: { label: string; value: WorkflowModule }[] = [
//   { label: "Leave Apply (ESS)", value: "leaveApply" },
//   { label: "Attendance", value: "attendance" },
//   { label: "Expense", value: "expense" },
// ];

// const DEFAULT_WORKFLOWS = [
//   {
//     id: "wf-1",
//     name: "Leave Apply RA Level 1",
//     module: "leaveApply",
//     levels: [
//       {
//         id: "lvl-1",
//         level: 1,
//         authorityType: "Reporting Authority",
//         authorityName: "Reporting 1",
//       },
//     ],
//   },
// ];

// export default function WorkflowsPage() {
//   const [activeTab, setActiveTab] = useState("Workflow");
//   const [selectedModule, setSelectedModule] =
//     useState<WorkflowModule>("leaveApply");

//   const hookWorkflows = useWorkflows(selectedModule);

//   const rawWorkflows = hookWorkflows.workflows?.length
//     ? hookWorkflows.workflows
//     : DEFAULT_WORKFLOWS;
//   const workflows = rawWorkflows;

//   const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(
//     workflows[0]?.id || "wf-1"
//   );

//   const selectedWorkflow =
//     workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newName, setNewName] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (workflows.length > 0) {
//       setSelectedWorkflowId(workflows[0].id);
//     }
//   }, [selectedModule]);

//   async function handleCreateWorkflow() {
//     const result = validateWorkflowName(newName, workflows);
//     if (!result.isValid) {
//       setError(result.error || "");
//       return;
//     }

//     try {
//       if (hookWorkflows.handleCreateWorkflow) {
//         await hookWorkflows.handleCreateWorkflow(newName.trim());
//       }
//       setNewName("");
//       setError("");
//       setShowAddModal(false);
//     } catch (err) {
//       console.error("Failed to create workflow", err);
//       setError("Failed to create workflow. Please try again.");
//     }
//   }

//   async function handleAddLevel() {
//     if (!selectedWorkflow) return;

//     const result = validateAddLevel(selectedWorkflow.levels.length);
//     if (!result.isValid) {
//       setError(result.error || "");
//       return;
//     }

//     try {
//       if (hookWorkflows.handleAddLevel) {
//         await hookWorkflows.handleAddLevel(selectedWorkflow.id);
//       }
//     } catch (err) {
//       console.error("Failed to add level", err);
//     }
//   }

//   async function handleDeleteLevel(levelId: string) {
//     if (!selectedWorkflow) return;
//     try {
//       if (hookWorkflows.handleDeleteLevel) {
//         await hookWorkflows.handleDeleteLevel(selectedWorkflow.id, levelId);
//       }
//     } catch (err) {
//       console.error("Failed to delete level", err);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F7FC] p-3 text-slate-800 sm:p-6">
//       {/* ==================== TOP BAR ==================== */}
//       <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
//         {/* Tabs — scrollable on mobile */}
//         <div className="overflow-x-auto">
//           <div className="inline-flex rounded-2xl bg-[#EDE9FE]/70 p-1.5">
//             <div className="flex items-center gap-1">
//               {TABS.map((tab) => (
//                 <button
//                   key={tab}
//                   type="button"
//                   onClick={() => setActiveTab(tab)}
//                   className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all sm:px-7 sm:py-2.5 ${
//                     activeTab === tab
//                       ? "bg-[#7C5CFC] text-white shadow-sm"
//                       : "text-slate-700 hover:bg-white/50"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Module dropdown + clock */}
//         {activeTab === "Workflow" && (
//           <div className="flex items-center gap-3">
//             <div className="min-w-[160px] flex-1 sm:flex-none sm:min-w-[180px]">
//               <StyledSelect
//                 value={selectedModule}
//                 onValueChange={(v) =>
//                   setSelectedModule(v as WorkflowModule)
//                 }
//                 options={MODULE_OPTIONS.map((m) => ({
//                   label: m.label,
//                   value: m.value,
//                 }))}
//                 className="!h-10 !rounded-xl !bg-[#7C5CFC] !text-white !border-transparent"
//               />
//             </div>
//             <Button
//               size="icon"
//               variant="outline"
//               className="h-10 w-10 shrink-0 rounded-xl border-slate-200 bg-white"
//             >
//               <Clock3 className="h-4 w-4 text-slate-600" />
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* ==================== WORKFLOW TAB ==================== */}
//       {activeTab === "Workflow" && (
//         <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
//           {/* Left Panel */}
//           <div className="lg:col-span-3">
//             <div className="min-h-[280px] overflow-hidden rounded-2xl bg-[#F2EFFE] sm:min-h-[540px]">
//               <div className="flex items-center justify-between p-3 pb-2 sm:p-4 sm:pb-3">
//                 <h2 className="text-xs font-bold text-slate-800">
//                   Workflow (
//                   {
//                     MODULE_OPTIONS.find((m) => m.value === selectedModule)
//                       ?.label
//                   }
//                   )
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(true)}
//                   className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#7C5CFC] bg-white text-[#7C5CFC] transition-colors hover:bg-violet-50"
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               </div>

//               <div className="space-y-0">
//                 {workflows.map((item) => {
//                   const isSelected = selectedWorkflow?.id === item.id;
//                   return (
//                     <button
//                       key={item.id}
//                       type="button"
//                       onClick={() => setSelectedWorkflowId(item.id)}
//                       className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs font-medium transition-all sm:px-4 sm:py-3 ${
//                         isSelected
//                           ? "bg-[#7C5CFC] text-white"
//                           : "text-slate-700 hover:bg-violet-100/60"
//                       }`}
//                     >
//                       <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#7C5CFC]">
//                         <FileText className="h-4 w-4" />
//                       </div>
//                       <span className="truncate">{item.name}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Right Panel */}
//           <div className="lg:col-span-9">
//             <div className="min-h-[280px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:min-h-[540px] sm:rounded-3xl sm:p-6">
//               {!selectedWorkflow || selectedWorkflow.levels.length === 0 ? (
//                 <div className="flex min-h-[220px] flex-col items-center justify-center text-slate-400 sm:min-h-[460px]">
//                   <p className="mb-4 text-xs font-medium">
//                     No levels added yet
//                   </p>
//                   <Button
//                     onClick={handleAddLevel}
//                     className="rounded-xl bg-[#7C5CFC] text-xs font-semibold hover:bg-violet-700"
//                   >
//                     + Add Level
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {selectedWorkflow.levels.map((level) => (
//                     <div
//                       key={level.id}
//                       className="flex flex-col gap-3 rounded-2xl bg-[#F6F3FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-3.5"
//                     >
//                       <div className="grid flex-1 grid-cols-1 gap-1 text-xs text-slate-800 sm:grid-cols-3 sm:items-center sm:pr-6">
//                         <span className="font-semibold text-slate-900">
//                           Level {level.level}
//                         </span>
//                         <span className="font-medium text-slate-800 sm:text-center">
//                           {level.authorityType}
//                         </span>
//                         <span className="font-semibold text-[#10B981] sm:text-right">
//                           {level.authorityName}
//                         </span>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <button
//                           type="button"
//                           onClick={handleAddLevel}
//                           className="text-slate-800 hover:text-[#7C5CFC]"
//                         >
//                           <Plus className="h-4 w-4" />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => handleDeleteLevel(level.id)}
//                           className="text-[#EF4444] hover:opacity-80"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                         <button type="button" className="text-slate-800">
//                           <ChevronDown className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==================== OTHER TABS ==================== */}
//       {activeTab === "Employee Group" && <EmployeeGroup />}
//       {activeTab === "Module Settings" && <ModuleSettings />}

//       {/* ========== Create Workflow Modal ========== */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
//             <h2 className="mb-4 text-base font-bold text-slate-800">
//               Create Workflow
//             </h2>
//             <div className="mb-4">
//               <label className="text-xs font-semibold text-slate-700">
//                 Workflow Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 value={newName}
//                 onChange={(e) => {
//                   setNewName(e.target.value);
//                   setError("");
//                 }}
//                 placeholder="e.g. Leave Apply RA Level 1"
//                 className="mt-1.5 text-xs"
//               />
//               {error && (
//                 <p className="mt-1.5 text-xs text-red-500">{error}</p>
//               )}
//             </div>
//             <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   setShowAddModal(false);
//                   setNewName("");
//                   setError("");
//                 }}
//                 className="w-full text-xs font-semibold sm:w-auto"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 size="sm"
//                 onClick={handleCreateWorkflow}
//                 className="w-full bg-[#7C5CFC] text-xs font-semibold text-white hover:bg-violet-700 sm:w-auto"
//               >
//                 Create
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








// import { useState, useEffect } from "react";
// import {
//   Plus,
//   FileText,
//   Trash2,
//   ChevronDown,
//   Clock3,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { StyledSelect } from "@/components/ui/select";

// import EmployeeGroup from "./EmployeeGroup";
// import ModuleSettings from "./ModuleSettings";

// import { useWorkflows } from "./hooks/useWorkflows";
// import type { WorkflowModule } from "./types/workflowTypes";
// import {
//   validateWorkflowName,
//   validateAddLevel,
// } from "./validations/workflowValidations";

// const TABS = ["Workflow", "Employee Group", "Module Settings"];

// const MODULE_OPTIONS: { label: string; value: WorkflowModule }[] = [
//   { label: "Leave Apply (ESS)", value: "leaveApply" },
//   { label: "Attendance", value: "attendance" },
//   { label: "Expense", value: "expense" },
// ];

// const DEFAULT_WORKFLOWS = [
//   {
//     id: "wf-1",
//     name: "Leave Apply RA Level 1",
//     module: "leaveApply",
//     levels: [
//       {
//         id: "lvl-1",
//         level: 1,
//         authorityType: "Reporting Authority",
//         authorityName: "Reporting 1",
//       },
//     ],
//   },
// ];

// export default function WorkflowsPage() {
//   const [activeTab, setActiveTab] = useState("Workflow");
//   const [selectedModule, setSelectedModule] =
//     useState<WorkflowModule>("leaveApply");

//   const hookWorkflows = useWorkflows(selectedModule);

//   const rawWorkflows = hookWorkflows.workflows?.length
//     ? hookWorkflows.workflows
//     : DEFAULT_WORKFLOWS;
//   const workflows = rawWorkflows;

//   const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(
//     workflows[0]?.id || "wf-1"
//   );

//   const selectedWorkflow =
//     workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newName, setNewName] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (workflows.length > 0) {
//       setSelectedWorkflowId(workflows[0].id);
//     }
//   }, [selectedModule]);

//   async function handleCreateWorkflow() {
//     const result = validateWorkflowName(newName, workflows);
//     if (!result.isValid) {
//       setError(result.error || "");
//       return;
//     }

//     try {
//       if (hookWorkflows.handleCreateWorkflow) {
//         await hookWorkflows.handleCreateWorkflow(newName.trim());
//       }
//       setNewName("");
//       setError("");
//       setShowAddModal(false);
//     } catch (err) {
//       console.error("Failed to create workflow", err);
//       setError("Failed to create workflow. Please try again.");
//     }
//   }

//   async function handleAddLevel() {
//     if (!selectedWorkflow) return;

//     const result = validateAddLevel(selectedWorkflow.levels.length);
//     if (!result.isValid) {
//       setError(result.error || "");
//       return;
//     }

//     try {
//       if (hookWorkflows.handleAddLevel) {
//         await hookWorkflows.handleAddLevel(selectedWorkflow.id);
//       }
//     } catch (err) {
//       console.error("Failed to add level", err);
//     }
//   }

//   async function handleDeleteLevel(levelId: string) {
//     if (!selectedWorkflow) return;
//     try {
//       if (hookWorkflows.handleDeleteLevel) {
//         await hookWorkflows.handleDeleteLevel(selectedWorkflow.id, levelId);
//       }
//     } catch (err) {
//       console.error("Failed to delete level", err);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F7FC] p-3 text-slate-800 sm:p-6">
//       {/* ==================== TOP BAR ==================== */}
//       <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
//         {/* Tabs – Figma style */}
//         <div
//           className="w-full overflow-x-auto rounded-2xl px-2 py-1.5 sm:w-auto"
//           style={{
//             backgroundColor: "#F3F0FF",
//             border: "1px solid #E9E5FF",
//           }}
//         >
//           <div className="flex items-center gap-1">
//             {TABS.map((tab) => (
//               <button
//                 key={tab}
//                 type="button"
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 text-[13px] font-semibold whitespace-nowrap transition-all ${
//                   activeTab === tab
//                     ? "bg-[#7C3AED] text-white shadow-sm"
//                     : "bg-transparent text-slate-600 hover:bg-white/60"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Module dropdown + clock */}
//         {activeTab === "Workflow" && (
//           <div className="flex items-center gap-3">
//             <div className="min-w-[160px] flex-1 sm:flex-none sm:min-w-[180px]">
//               <StyledSelect
//                 value={selectedModule}
//                 onValueChange={(v) =>
//                   setSelectedModule(v as WorkflowModule)
//                 }
//                 options={MODULE_OPTIONS.map((m) => ({
//                   label: m.label,
//                   value: m.value,
//                 }))}
//                 className="!h-10 !rounded-xl !border-transparent !bg-[#7C3AED] !text-white"
//               />
//             </div>
//             <Button
//               size="icon"
//               variant="outline"
//               className="h-10 w-10 shrink-0 rounded-xl border-slate-200 bg-white"
//             >
//               <Clock3 className="h-4 w-4 text-slate-600" />
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* ==================== WORKFLOW TAB ==================== */}
//       {activeTab === "Workflow" && (
//         <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
//           {/* Left Panel */}
//           <div className="lg:col-span-3">
//             <div className="min-h-[280px] overflow-hidden rounded-2xl bg-[#F2EFFE] sm:min-h-[540px]">
//               <div className="flex items-center justify-between p-3 pb-2 sm:p-4 sm:pb-3">
//                 <h2 className="text-xs font-bold text-slate-800">
//                   Workflow (
//                   {
//                     MODULE_OPTIONS.find((m) => m.value === selectedModule)
//                       ?.label
//                   }
//                   )
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(true)}
//                   className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#7C3AED] bg-white text-[#7C3AED] transition-colors hover:bg-violet-50"
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               </div>

//               <div className="space-y-0">
//                 {workflows.map((item) => {
//                   const isSelected = selectedWorkflow?.id === item.id;
//                   return (
//                     <button
//                       key={item.id}
//                       type="button"
//                       onClick={() => setSelectedWorkflowId(item.id)}
//                       className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs font-medium transition-all sm:px-4 sm:py-3 ${
//                         isSelected
//                           ? "bg-[#7C3AED] text-white"
//                           : "text-slate-700 hover:bg-violet-100/60"
//                       }`}
//                     >
//                       <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#7C3AED]">
//                         <FileText className="h-4 w-4" />
//                       </div>
//                       <span className="truncate">{item.name}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Right Panel */}
//           <div className="lg:col-span-9">
//             <div className="min-h-[280px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:min-h-[540px] sm:rounded-3xl sm:p-6">
//               {!selectedWorkflow || selectedWorkflow.levels.length === 0 ? (
//                 <div className="flex min-h-[220px] flex-col items-center justify-center text-slate-400 sm:min-h-[460px]">
//                   <p className="mb-4 text-xs font-medium">
//                     No levels added yet
//                   </p>
//                   <Button
//                     onClick={handleAddLevel}
//                     className="rounded-xl bg-[#7C3AED] text-xs font-semibold hover:bg-violet-700"
//                   >
//                     + Add Level
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {selectedWorkflow.levels.map((level) => (
//                     <div
//                       key={level.id}
//                       className="flex flex-col gap-3 rounded-2xl bg-[#F6F3FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-3.5"
//                     >
//                       <div className="grid flex-1 grid-cols-1 gap-1 text-xs text-slate-800 sm:grid-cols-3 sm:items-center sm:pr-6">
//                         <span className="font-semibold text-slate-900">
//                           Level {level.level}
//                         </span>
//                         <span className="font-medium text-slate-800 sm:text-center">
//                           {level.authorityType}
//                         </span>
//                         <span className="font-semibold text-[#10B981] sm:text-right">
//                           {level.authorityName}
//                         </span>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <button
//                           type="button"
//                           onClick={handleAddLevel}
//                           className="text-slate-800 hover:text-[#7C3AED]"
//                         >
//                           <Plus className="h-4 w-4" />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => handleDeleteLevel(level.id)}
//                           className="text-[#EF4444] hover:opacity-80"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                         <button type="button" className="text-slate-800">
//                           <ChevronDown className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==================== OTHER TABS ==================== */}
//       {activeTab === "Employee Group" && <EmployeeGroup />}
//       {activeTab === "Module Settings" && <ModuleSettings />}

//       {/* ========== Create Workflow Modal ========== */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
//             <h2 className="mb-4 text-base font-bold text-slate-800">
//               Create Workflow
//             </h2>
//             <div className="mb-4">
//               <label className="text-xs font-semibold text-slate-700">
//                 Workflow Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 value={newName}
//                 onChange={(e) => {
//                   setNewName(e.target.value);
//                   setError("");
//                 }}
//                 placeholder="e.g. Leave Apply RA Level 1"
//                 className="mt-1.5 text-xs"
//               />
//               {error && (
//                 <p className="mt-1.5 text-xs text-red-500">{error}</p>
//               )}
//             </div>
//             <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   setShowAddModal(false);
//                   setNewName("");
//                   setError("");
//                 }}
//                 className="w-full text-xs font-semibold sm:w-auto"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 size="sm"
//                 onClick={handleCreateWorkflow}
//                 className="w-full bg-[#7C3AED] text-xs font-semibold text-white hover:bg-violet-700 sm:w-auto"
//               >
//                 Create
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }













// import { useState, useEffect } from "react";
// import {
//   Plus,
//   FileText,
//   Trash2,
//   ChevronDown,
//   Clock3,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { StyledSelect } from "@/components/ui/select";

// import EmployeeGroup from "./EmployeeGroup";
// import ModuleSettings from "./ModuleSettings";

// import { useWorkflows } from "./hooks/useWorkflows";
// import type { WorkflowModule } from "./types/workflowTypes";
// import {
//   validateWorkflowName,
//   validateAddLevel,
// } from "./validations/workflowValidations";

// const TABS = ["Workflow", "Employee Group", "Module Settings"];

// const MODULE_OPTIONS: { label: string; value: WorkflowModule }[] = [
//   { label: "Leave Apply (ESS)", value: "leaveApply" },
//   { label: "Attendance", value: "attendance" },
//   { label: "Expense", value: "expense" },
// ];

// const DEFAULT_WORKFLOWS = [
//   {
//     id: "wf-1",
//     name: "Leave Apply RA Level 1",
//     module: "leaveApply",
//     levels: [
//       {
//         id: "lvl-1",
//         level: 1,
//         authorityType: "Reporting Authority",
//         authorityName: "Reporting 1",
//       },
//     ],
//   },
// ];

// export default function WorkflowsPage() {
//   const [activeTab, setActiveTab] = useState("Workflow");
//   const [selectedModule, setSelectedModule] =
//     useState<WorkflowModule>("leaveApply");

//   const hookWorkflows = useWorkflows(selectedModule);

//   const rawWorkflows = hookWorkflows.workflows?.length
//     ? hookWorkflows.workflows
//     : DEFAULT_WORKFLOWS;
//   const workflows = rawWorkflows;

//   const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(
//     workflows[0]?.id || "wf-1"
//   );

//   const selectedWorkflow =
//     workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newName, setNewName] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (workflows.length > 0) {
//       setSelectedWorkflowId(workflows[0].id);
//     }
//   }, [selectedModule]);

//   async function handleCreateWorkflow() {
//     const result = validateWorkflowName(newName, workflows);
//     if (!result.isValid) {
//       setError(result.error || "");
//       return;
//     }

//     try {
//       if (hookWorkflows.handleCreateWorkflow) {
//         await hookWorkflows.handleCreateWorkflow(newName.trim());
//       }
//       setNewName("");
//       setError("");
//       setShowAddModal(false);
//     } catch (err) {
//       console.error("Failed to create workflow", err);
//       setError("Failed to create workflow. Please try again.");
//     }
//   }

//   async function handleAddLevel() {
//     if (!selectedWorkflow) return;

//     const result = validateAddLevel(selectedWorkflow.levels.length);
//     if (!result.isValid) {
//       setError(result.error || "");
//       return;
//     }

//     try {
//       if (hookWorkflows.handleAddLevel) {
//         await hookWorkflows.handleAddLevel(selectedWorkflow.id);
//       }
//     } catch (err) {
//       console.error("Failed to add level", err);
//     }
//   }

//   async function handleDeleteLevel(levelId: string) {
//     if (!selectedWorkflow) return;
//     try {
//       if (hookWorkflows.handleDeleteLevel) {
//         await hookWorkflows.handleDeleteLevel(selectedWorkflow.id, levelId);
//       }
//     } catch (err) {
//       console.error("Failed to delete level", err);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F7FC] p-3 text-slate-800 sm:p-6">
//       {/* ==================== TOP BAR ==================== */}
//       <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
//         {/* Tabs – Figma style */}
//         <div
//           className="w-full overflow-x-auto rounded-2xl px-2 py-1.5 sm:w-auto"
//           style={{
//             backgroundColor: "#F3F0FF",
//             border: "2px solid #DDD6FE",
//           }}
//         >
//           <div className="flex items-center gap-1">
//             {TABS.map((tab) => (
//               <button
//                 key={tab}
//                 type="button"
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex h-9 shrink-0 items-center justify-center rounded-full border px-5 text-[13px] font-semibold whitespace-nowrap transition-all ${
//                   activeTab === tab
//                     ? "bg-white text-[#7C3AED] border-[#7C3AED] shadow-sm"
//                     : "border-transparent bg-transparent text-slate-600 hover:bg-white/60"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Module dropdown + clock */}
//         {activeTab === "Workflow" && (
//           <div className="flex items-center gap-3">
//             <div className="min-w-[160px] flex-1 sm:flex-none sm:min-w-[180px]">
//               <StyledSelect
//                 value={selectedModule}
//                 onValueChange={(v) =>
//                   setSelectedModule(v as WorkflowModule)
//                 }
//                 options={MODULE_OPTIONS.map((m) => ({
//                   label: m.label,
//                   value: m.value,
//                 }))}
//                 className="!h-10 !rounded-xl !border-transparent !bg-[#7C3AED] !text-white"
//               />
//             </div>
//             <Button
//               size="icon"
//               variant="outline"
//               className="h-10 w-10 shrink-0 rounded-xl border-slate-200 bg-white"
//             >
//               <Clock3 className="h-4 w-4 text-slate-600" />
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* ==================== WORKFLOW TAB ==================== */}
//       {activeTab === "Workflow" && (
//         <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
//           {/* Left Panel */}
//           <div className="lg:col-span-3">
//             <div className="min-h-[280px] overflow-hidden rounded-2xl bg-[#F2EFFE] sm:min-h-[540px]">
//               <div className="flex items-center justify-between p-3 pb-2 sm:p-4 sm:pb-3">
//                 <h2 className="text-xs font-bold text-slate-800">
//                   Workflow (
//                   {
//                     MODULE_OPTIONS.find((m) => m.value === selectedModule)
//                       ?.label
//                   }
//                   )
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(true)}
//                   className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#7C3AED] bg-white text-[#7C3AED] transition-colors hover:bg-violet-50"
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               </div>

//               <div className="space-y-0">
//                 {workflows.map((item) => {
//                   const isSelected = selectedWorkflow?.id === item.id;
//                   return (
//                     <button
//                       key={item.id}
//                       type="button"
//                       onClick={() => setSelectedWorkflowId(item.id)}
//                       className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs font-medium transition-all sm:px-4 sm:py-3 ${
//                         isSelected
//                           ? "bg-[#7C3AED] text-white"
//                           : "text-slate-700 hover:bg-violet-100/60"
//                       }`}
//                     >
//                       <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#7C3AED]">
//                         <FileText className="h-4 w-4" />
//                       </div>
//                       <span className="truncate">{item.name}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Right Panel */}
//           <div className="lg:col-span-9">
//             <div className="min-h-[280px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:min-h-[540px] sm:rounded-3xl sm:p-6">
//               {!selectedWorkflow || selectedWorkflow.levels.length === 0 ? (
//                 <div className="flex min-h-[220px] flex-col items-center justify-center text-slate-400 sm:min-h-[460px]">
//                   <p className="mb-4 text-xs font-medium">
//                     No levels added yet
//                   </p>
//                   <Button
//                     onClick={handleAddLevel}
//                     className="rounded-xl bg-[#7C3AED] text-xs font-semibold hover:bg-violet-700"
//                   >
//                     + Add Level
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {selectedWorkflow.levels.map((level) => (
//                     <div
//                       key={level.id}
//                       className="flex flex-col gap-3 rounded-2xl bg-[#F6F3FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-3.5"
//                     >
//                       <div className="grid flex-1 grid-cols-1 gap-1 text-xs text-slate-800 sm:grid-cols-3 sm:items-center sm:pr-6">
//                         <span className="font-semibold text-slate-900">
//                           Level {level.level}
//                         </span>
//                         <span className="font-medium text-slate-800 sm:text-center">
//                           {level.authorityType}
//                         </span>
//                         <span className="font-semibold text-[#10B981] sm:text-right">
//                           {level.authorityName}
//                         </span>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <button
//                           type="button"
//                           onClick={handleAddLevel}
//                           className="text-slate-800 hover:text-[#7C3AED]"
//                         >
//                           <Plus className="h-4 w-4" />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => handleDeleteLevel(level.id)}
//                           className="text-[#EF4444] hover:opacity-80"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                         <button type="button" className="text-slate-800">
//                           <ChevronDown className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==================== OTHER TABS ==================== */}
//       {activeTab === "Employee Group" && <EmployeeGroup />}
//       {activeTab === "Module Settings" && <ModuleSettings />}

//       {/* ========== Create Workflow Modal ========== */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
//             <h2 className="mb-4 text-base font-bold text-slate-800">
//               Create Workflow
//             </h2>
//             <div className="mb-4">
//               <label className="text-xs font-semibold text-slate-700">
//                 Workflow Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 value={newName}
//                 onChange={(e) => {
//                   setNewName(e.target.value);
//                   setError("");
//                 }}
//                 placeholder="e.g. Leave Apply RA Level 1"
//                 className="mt-1.5 text-xs"
//               />
//               {error && (
//                 <p className="mt-1.5 text-xs text-red-500">{error}</p>
//               )}
//             </div>
//             <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   setShowAddModal(false);
//                   setNewName("");
//                   setError("");
//                 }}
//                 className="w-full text-xs font-semibold sm:w-auto"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 size="sm"
//                 onClick={handleCreateWorkflow}
//                 className="w-full bg-[#7C3AED] text-xs font-semibold text-white hover:bg-violet-700 sm:w-auto"
//               >
//                 Create
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }










import { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Trash2,
  ChevronDown,
  Clock3,
  GitBranch,
  Users,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StyledSelect } from "@/components/ui/select";

import EmployeeGroup from "./EmployeeGroup";
import ModuleSettings from "./ModuleSettings";

import { useWorkflows } from "./hooks/useWorkflows";
import type { WorkflowModule } from "./types/workflowTypes";
import {
  validateWorkflowName,
  validateAddLevel,
} from "./validations/workflowValidations";

const TABS = [
  { label: "Workflow", icon: GitBranch },
  { label: "Employee Group", icon: Users },
  { label: "Module Settings", icon: Settings2 },
] as const;

const MODULE_OPTIONS: { label: string; value: WorkflowModule }[] = [
  { label: "Leave Apply (ESS)", value: "leaveApply" },
  { label: "Attendance", value: "attendance" },
  { label: "Expense", value: "expense" },
];

const DEFAULT_WORKFLOWS = [
  {
    id: "wf-1",
    name: "Leave Apply RA Level 1",
    module: "leaveApply",
    levels: [
      {
        id: "lvl-1",
        level: 1,
        authorityType: "Reporting Authority",
        authorityName: "Reporting 1",
      },
    ],
  },
];

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState("Workflow");
  const [selectedModule, setSelectedModule] =
    useState<WorkflowModule>("leaveApply");

  const hookWorkflows = useWorkflows(selectedModule);

  const rawWorkflows = hookWorkflows.workflows?.length
    ? hookWorkflows.workflows
    : DEFAULT_WORKFLOWS;
  const workflows = rawWorkflows;

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(
    workflows[0]?.id || "wf-1"
  );

  const selectedWorkflow =
    workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (workflows.length > 0) {
      setSelectedWorkflowId(workflows[0].id);
    }
  }, [selectedModule]);

  async function handleCreateWorkflow() {
    const result = validateWorkflowName(newName, workflows);
    if (!result.isValid) {
      setError(result.error || "");
      return;
    }

    try {
      if (hookWorkflows.handleCreateWorkflow) {
        await hookWorkflows.handleCreateWorkflow(newName.trim());
      }
      setNewName("");
      setError("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to create workflow", err);
      setError("Failed to create workflow. Please try again.");
    }
  }

  async function handleAddLevel() {
    if (!selectedWorkflow) return;

    const result = validateAddLevel(selectedWorkflow.levels.length);
    if (!result.isValid) {
      setError(result.error || "");
      return;
    }

    try {
      if (hookWorkflows.handleAddLevel) {
        await hookWorkflows.handleAddLevel(selectedWorkflow.id);
      }
    } catch (err) {
      console.error("Failed to add level", err);
    }
  }

  async function handleDeleteLevel(levelId: string) {
    if (!selectedWorkflow) return;
    try {
      if (hookWorkflows.handleDeleteLevel) {
        await hookWorkflows.handleDeleteLevel(selectedWorkflow.id, levelId);
      }
    } catch (err) {
      console.error("Failed to delete level", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] p-3 text-slate-800 sm:p-6">
      {/* ==================== TOP BAR ==================== */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Tabs – same style as SettingsTabs */}
        <div
          className="mb-0 w-full rounded-2xl px-3 py-2.5 sm:w-auto"
          style={{
            backgroundColor: "#F3F0FF",
            border: "1px solid #E9E5FF",
          }}
        >
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.label;

              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(tab.label)}
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-medium whitespace-nowrap transition-all"
                  style={
                    isActive
                      ? {
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #7C3AED",
                          color: "#7C3AED",
                          fontWeight: 600,
                        }
                      : {
                          backgroundColor: "transparent",
                          border: "1px solid transparent",
                          color: "#64748B",
                        }
                  }
                >
                  <Icon
                    size={15}
                    strokeWidth={isActive ? 2 : 1.7}
                    color={isActive ? "#7C3AED" : "#94A3B8"}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module dropdown + clock – only on Workflow tab */}
        {activeTab === "Workflow" && (
          <div className="flex items-center gap-3">
            <div className="min-w-[160px] flex-1 sm:flex-none sm:min-w-[180px]">
              <StyledSelect
                value={selectedModule}
                onValueChange={(v) =>
                  setSelectedModule(v as WorkflowModule)
                }
                options={MODULE_OPTIONS.map((m) => ({
                  label: m.label,
                  value: m.value,
                }))}
                className="!h-10 !rounded-xl !border-transparent !bg-[#7C3AED] !text-white"
              />
            </div>
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 shrink-0 rounded-xl border-slate-200 bg-white"
            >
              <Clock3 className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        )}
      </div>

      {/* ==================== WORKFLOW TAB ==================== */}
      {activeTab === "Workflow" && (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Left Panel */}
          <div className="lg:col-span-3">
            <div className="min-h-[280px] overflow-hidden rounded-2xl bg-[#F2EFFE] sm:min-h-[540px]">
              <div className="flex items-center justify-between p-3 pb-2 sm:p-4 sm:pb-3">
                <h2 className="text-xs font-bold text-slate-800">
                  Workflow (
                  {
                    MODULE_OPTIONS.find((m) => m.value === selectedModule)
                      ?.label
                  }
                  )
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#7C3AED] bg-white text-[#7C3AED] transition-colors hover:bg-violet-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-0">
                {workflows.map((item) => {
                  const isSelected = selectedWorkflow?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedWorkflowId(item.id)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs font-medium transition-all sm:px-4 sm:py-3 ${
                        isSelected
                          ? "bg-[#7C3AED] text-white"
                          : "text-slate-700 hover:bg-violet-100/60"
                      }`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#7C3AED]">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-9">
            <div className="min-h-[280px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:min-h-[540px] sm:rounded-3xl sm:p-6">
              {!selectedWorkflow || selectedWorkflow.levels.length === 0 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center text-slate-400 sm:min-h-[460px]">
                  <p className="mb-4 text-xs font-medium">
                    No levels added yet
                  </p>
                  <Button
                    onClick={handleAddLevel}
                    className="rounded-xl bg-[#7C3AED] text-xs font-semibold hover:bg-violet-700"
                  >
                    + Add Level
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedWorkflow.levels.map((level) => (
                    <div
                      key={level.id}
                      className="flex flex-col gap-3 rounded-2xl bg-[#F6F3FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-3.5"
                    >
                      <div className="grid flex-1 grid-cols-1 gap-1 text-xs text-slate-800 sm:grid-cols-3 sm:items-center sm:pr-6">
                        <span className="font-semibold text-slate-900">
                          Level {level.level}
                        </span>
                        <span className="font-medium text-slate-800 sm:text-center">
                          {level.authorityType}
                        </span>
                        <span className="font-semibold text-[#10B981] sm:text-right">
                          {level.authorityName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleAddLevel}
                          className="text-slate-800 hover:text-[#7C3AED]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLevel(level.id)}
                          className="text-[#EF4444] hover:opacity-80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button type="button" className="text-slate-800">
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== OTHER TABS ==================== */}
      {activeTab === "Employee Group" && <EmployeeGroup />}
      {activeTab === "Module Settings" && <ModuleSettings />}

      {/* ========== Create Workflow Modal ========== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
            <h2 className="mb-4 text-base font-bold text-slate-800">
              Create Workflow
            </h2>
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700">
                Workflow Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Leave Apply RA Level 1"
                className="mt-1.5 text-xs"
              />
              {error && (
                <p className="mt-1.5 text-xs text-red-500">{error}</p>
              )}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddModal(false);
                  setNewName("");
                  setError("");
                }}
                className="w-full text-xs font-semibold sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateWorkflow}
                className="w-full bg-[#7C3AED] text-xs font-semibold text-white hover:bg-violet-700 sm:w-auto"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}