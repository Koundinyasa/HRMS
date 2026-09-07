import { useState } from "react";
import {
  Plus,
  FileText,
  Trash2,
  ChevronDown,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import EmployeeGroup from "../components/EmployeeGroup";
import ModuleSettings from "../components/ModuleSettings";

import { useWorkflows } from "../hooks/useWorkflows";
import type { WorkflowModule } from "../types/workflowTypes";
import {validateWorkflowName,validateAddLevel} from "../validations/workflowValidations";

const TABS = ["Workflow", "Employee Group", "Module Settings"];

// Maps the human-readable dropdown labels to the actual WorkflowModule values
const MODULE_OPTIONS: { label: string; value: WorkflowModule }[] = [
  { label: "Leave Apply (ESS)", value: "leaveApply" },
  { label: "Attendance", value: "attendance" },
  { label: "Expense", value: "expense" },
];

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState("Workflow");
  const [selectedModule, setSelectedModule] = useState<WorkflowModule>("leaveApply");

  const {
    workflows,
    selectedWorkflow,
    selectedWorkflowId,
    setSelectedWorkflowId,
    isLoading,
    isCreating,
    handleCreateWorkflow: createWorkflow,
    handleAddLevel: addLevel,
    handleDeleteLevel: deleteLevel,
  } = useWorkflows(selectedModule);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  // ---------- Handlers ----------
  async function handleCreateWorkflow() {
    const result = validateWorkflowName(newName, workflows);
    if (!result.isValid) {
      setError(result.error || "");
      return;
    }

    try {
      await createWorkflow(newName.trim());
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
      await addLevel(selectedWorkflow.id);
    } catch (err) {
      console.error("Failed to add level", err);
    }
  }

  async function handleDeleteLevel(levelId: string) {
    if (!selectedWorkflow) return;
    try {
      await deleteLevel(selectedWorkflow.id, levelId);
    } catch (err) {
      console.error("Failed to delete level", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] p-6">
      {/* ==================== TOP BAR ==================== */}
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* Tabs */}
        <div className="rounded-2xl bg-[#EDE9FE] p-1.5">
          <div className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-white/60"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right side (only for Workflow tab) */}
        {activeTab === "Workflow" && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value as WorkflowModule)}
                className="h-10 appearance-none rounded-xl bg-violet-600 px-4 pr-10 text-sm font-medium text-white outline-none"
              >
                {MODULE_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value} className="text-gray-800">
                    {m.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
            </div>
            <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl">
              <Clock3 className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        )}
      </div>

      {/* ==================== WORKFLOW TAB ==================== */}
      {activeTab === "Workflow" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="min-h-[420px] rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800">
                  Workflow ({MODULE_OPTIONS.find((m) => m.value === selectedModule)?.label})
                </h2>
                <Button
                  size="icon"
                  onClick={() => setShowAddModal(true)}
                  className="h-7 w-7 rounded-lg border border-violet-200 bg-white text-violet-600 shadow-none hover:bg-violet-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {isLoading ? (
                <div className="px-3 py-6 text-xs text-gray-400">Loading workflows…</div>
              ) : (
                <div className="space-y-1">
                  {workflows.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedWorkflowId(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all ${
                        selectedWorkflowId === item.id
                          ? "bg-violet-600 text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <FileText
                        className={`h-4 w-4 shrink-0 ${
                          selectedWorkflowId === item.id ? "text-white" : "text-violet-500"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="min-h-[420px] rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              {!selectedWorkflow ? (
                <div className="flex min-h-[360px] items-center justify-center text-sm text-gray-400">
                  Select or create a workflow
                </div>
              ) : selectedWorkflow.levels.length === 0 ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-gray-400">
                  <p className="mb-4 text-sm">No levels added yet</p>
                  <Button
                    onClick={handleAddLevel}
                    className="rounded-xl bg-violet-600 hover:bg-violet-700"
                  >
                    + Add Level
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedWorkflow.levels.map((level) => (
                    <div
                      key={level.id}
                      className="flex items-center justify-between rounded-xl bg-[#F8F7FC] px-5 py-4"
                    >
                      <div className="flex items-center gap-12 text-sm">
                        <span className="w-16 font-medium text-gray-700">
                          Level {level.level}
                        </span>
                        <span className="w-40 text-gray-600">
                          {level.authorityType}
                        </span>
                        <span className="font-medium text-green-600">
                          {level.authorityName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleAddLevel}
                          className="h-8 w-8 text-violet-600 hover:bg-violet-50"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteLevel(level.id)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== EMPLOYEE GROUP TAB ==================== */}
      {activeTab === "Employee Group" && <EmployeeGroup />}

      {/* ==================== MODULE SETTINGS TAB ==================== */}
      {activeTab === "Module Settings" && <ModuleSettings />}

      {/* ========== Create Workflow Modal ========== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Create Workflow</h2>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Workflow Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Leave Apply RA Level 1"
                className="mt-1.5"
              />
              {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setNewName("");
                  setError("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateWorkflow}
                disabled={isCreating}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}