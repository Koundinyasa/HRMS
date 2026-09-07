import type {
  WorkflowItem,
  EmployeeGroup,
} from "../types/workflowTypes";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/* ===========================================
   WORKFLOW VALIDATIONS
=========================================== */

export function validateWorkflowName(
  name: string,
  existingWorkflows: WorkflowItem[] = [],
  currentId?: string
): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "Workflow name is required",
    };
  }

  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: "Workflow name must be at least 3 characters",
    };
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: "Workflow name cannot exceed 100 characters",
    };
  }

  if (/^\d/.test(trimmed)) {
    return {
      isValid: false,
      error: "Workflow name cannot start with a number",
    };
  }

  if (!/^[A-Za-z0-9 _-]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: "Only letters, numbers, spaces, hyphen (-) and underscore (_) are allowed",
    };
  }

  if (/\s{2,}/.test(trimmed)) {
    return {
      isValid: false,
      error: "Multiple consecutive spaces are not allowed",
    };
  }

  const duplicate = existingWorkflows.some(
    (workflow) =>
      workflow.name.trim().toLowerCase() === trimmed.toLowerCase() &&
      workflow.id !== currentId
  );

  if (duplicate) {
    return {
      isValid: false,
      error: "Workflow already exists",
    };
  }

  return {
    isValid: true,
  };
}

/* ===========================================
   EMPLOYEE GROUP VALIDATIONS
=========================================== */

export function validateEmployeeGroup(
  groupName: string,
  existingGroups: EmployeeGroup[] = [],
  currentId?: string
): ValidationResult {
  const trimmed = groupName.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "Employee group name is required",
    };
  }

  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: "Employee group name must be at least 3 characters",
    };
  }

  if (trimmed.length > 50) {
    return {
      isValid: false,
      error: "Employee group name cannot exceed 50 characters",
    };
  }

  const duplicate = existingGroups.some(
    (group) =>
      group.name.trim().toLowerCase() === trimmed.toLowerCase() &&
      group.id !== currentId
  );

  if (duplicate) {
    return {
      isValid: false,
      error: "Employee group already exists",
    };
  }

  return {
    isValid: true,
  };
}

/* ===========================================
   MODULE SETTINGS VALIDATIONS
=========================================== */
export function validateModuleSettings(
  platform: string,
  enabledModules: Record<string, boolean>
): ValidationResult {
  if (!platform) {
    return {
      isValid: false,
      error: "Please select a platform",
    };
  }

  const hasEnabledModule = Object.values(enabledModules).some(Boolean);

  if (!hasEnabledModule) {
    return {
      isValid: false,
      error: "Please enable at least one module.",
    };
  }

  return {
    isValid: true,
  };
}

/* ===========================================
   ADD LEVEL VALIDATION
=========================================== */

export function validateAddLevel(
  currentLevelsCount: number,
  maxLevels = 5
): ValidationResult {

  if (currentLevelsCount >= maxLevels) {
    return {
      isValid: false,
      error: `Maximum ${maxLevels} levels allowed`,
    };
  }

  return {
    isValid: true,
  };
}