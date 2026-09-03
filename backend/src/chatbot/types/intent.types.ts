export interface IntentCtx {
  message: string;
  msg: string;
  user: Record<string, any>;
  role: string;
  employeeId: string;
  name: string;
  employees: Record<string, any>[];
  companyData: { holidays: { date: string; name: string; stateCode: string | null }[]; announcements: { date: string; title: string }[] };
  selfEmployee: Record<string, any> | null;
  leaveTypes: { id: number; name: string; code: string; description: string; annualQuota: number | null }[];
  departments: string[];
  designations: string[];
  companyInfo: { name: string; code: string; contactPerson: string; contactEmail: string } | null;
  branches: { branchName: string; address: string; city: string; phone: string }[];
  ownOffice: { branchId: number; branchName: string; address: string; city: string; phone: string; stateCode: string } | null;
  directory: { id: string; name: string; code: string }[];
}

// Shared shape for every "if user says X, reply with Y" entry, used by every
// domain service's getIntents() and the orchestrator's own core intents.
export interface IntentDefinition {
  name: string;
  test: (ctx: IntentCtx) => boolean;
  handle: (ctx: IntentCtx) => Promise<string>;
}