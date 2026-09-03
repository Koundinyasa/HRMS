import { useState, useEffect } from "react";
import {
  useGetWorkflowsByModuleQuery,
  useCreateWorkflowMutation,
  useDeleteWorkflowMutation,
  useAddWorkflowLevelMutation,
  useDeleteWorkflowLevelMutation,
} from "../api/workflowsApi";
import type { WorkflowModule } from "../types/workflowTypes";

export function useWorkflows(module: WorkflowModule = "leaveApply") {
  const { data: workflows = [], isLoading } =
    useGetWorkflowsByModuleQuery(module);

  const [createWorkflow, { isLoading: isCreating }] =
    useCreateWorkflowMutation();
  const [deleteWorkflow] = useDeleteWorkflowMutation();
  const [addLevel] = useAddWorkflowLevelMutation();
  const [deleteLevel] = useDeleteWorkflowLevelMutation();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  useEffect(() => {
    if (workflows.length > 0 && !selectedWorkflowId) {
      setSelectedWorkflowId(workflows[0].id);
    }
  }, [workflows, selectedWorkflowId]);

  const selectedWorkflow =
    workflows.find((w) => w.id === selectedWorkflowId) || null;

  const handleCreateWorkflow = async (name: string) => {
    await createWorkflow({ name, module, levels: [] }).unwrap();
  };

  const handleDeleteWorkflow = async (id: string) => {
    await deleteWorkflow(id).unwrap();
    if (selectedWorkflowId === id) setSelectedWorkflowId(null);
  };

  const handleAddLevel = async (workflowId: string) => {
    const nextLevel = (selectedWorkflow?.levels.length || 0) + 1;
    await addLevel({
      workflowId,
      body: {
        level: nextLevel,
        authorityType: "Reporting Authority",
        authorityName: `Reporting ${nextLevel}`,
      },
    }).unwrap();
  };

  const handleDeleteLevel = async (workflowId: string, levelId: string) => {
    await deleteLevel({ workflowId, levelId }).unwrap();
  };

  return {
    workflows,
    selectedWorkflow,
    selectedWorkflowId,
    setSelectedWorkflowId,
    isLoading,
    isCreating,
    handleCreateWorkflow,
    handleDeleteWorkflow,
    handleAddLevel,
    handleDeleteLevel,
  };
}