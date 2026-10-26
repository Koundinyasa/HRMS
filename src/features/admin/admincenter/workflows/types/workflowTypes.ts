export type WorkflowModule =
  | "leaveApply"
  | "attendance"
  | "expense";

/* ===========================
   Workflow Level
=========================== */

export interface WorkflowLevel {
  id: string;
  level: number;
  authorityType: string;
  authorityName: string;
}

/* ===========================
   Workflow
=========================== */

export interface WorkflowItem {
  id: string;
  name: string;
  module: WorkflowModule;
  levels: WorkflowLevel[];
}

/* ===========================
   Employee Group
=========================== */

export interface EmployeeGroup {
  id: string;
  name: string;
}

/* ===========================
   Module Settings
=========================== */

export interface ModuleSetting {
  moduleName: string;
  workflowId: string;
}

/* ===========================
   Validation Result
=========================== */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}