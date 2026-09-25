// ===============================
// GENERIC API RESPONSE (matches asset feature convention)
// ===============================

export interface ApiMessageResponse {
  StatusCode: number;
  Message: string;
}

export interface ClassificationSummaryItem {
  ClassificationId?: number;
  classificationId?: number;
  ClassificationName?: string;
  classificationName?: string;
  Count?: number;
  count?: number;
  [key: string]: unknown;
}

export interface ClassificationSummaryResponse {
  statusCode?: number;
  statusMessage?: string;
  data: ClassificationSummaryItem[];
}

export interface ClassificationDetailsResponse {
  statusCode?: number;
  statusMessage?: string;
  data: Record<string, unknown>[];
}

// ===============================
// ADDITIONAL CLASSIFICATION
// ===============================

export interface AdditionalClassification {
  Id: number;
  Name: string;
  Tag: string;
}

export interface AdditionalClassificationListResponse {
  AdditionalClassifications: AdditionalClassification[];
}

export interface CreateAdditionalClassificationResponse extends ApiMessageResponse {
  Id: number;
}

// ===============================
// BRANCH
// ===============================

export interface Branch {
  Id: number;
  BranchName: string;
  Address: string;
  State: string;
  IsActive: 0 | 1;
}

export interface BranchListResponse {
  Branches: Branch[];
}

export interface CreateBranchResponse extends ApiMessageResponse {
  Id: number;
}

// ===============================
// DESIGNATION
// ===============================

export interface Designation {
  Id: number;
  DesignationName: string;
}

export interface DesignationListResponse {
  Designations: Designation[];
  TotalCount: number;
}

export interface CreateDesignationResponse extends ApiMessageResponse {
  Id: number;
}

// ===============================
// BANK
// ===============================

export interface Bank {
  Id: number;
  BankName: string;
  AcType: string;
  IfscCode: string;
}

export interface BankListResponse {
  Banks: Bank[];
}

export interface CreateBankResponse extends ApiMessageResponse {
  Id: number;
}

// ---- Bank field-mapping drill-down (gear icon on a Bank row) ----
export interface AvailableField {
  FieldId: string;
  Label: string;
  IsEnabled: boolean;
  /** Key used to look up a display icon on the frontend (e.g. "hash", "mail", "calendar"). */
  IconKey?: string;
  /** "Classification" / "Additional Classification" style entries that add a new
   *  dynamic mapping row via a "+" action instead of a plain checkbox. */
  IsAppendType?: boolean;
}

export interface FieldMappingRow {
  RowId: string;
  HeaderFieldName: string;
  CharacterLength: string;
  Prefix: string;
  Suffix: string;
  Pattern: string;
  Concat: boolean;
  /** Free-form expression bound via the "Add Expression" column. Undefined/empty shows the "Add" action. */
  Expression?: string;
  /** Rows where an expression genuinely doesn't apply (e.g. NEFT) render "-" instead of the "Add" action. */
  ExpressionNotApplicable?: boolean;
}

export interface BankFieldConfigResponse {
  BankId: number;
  QuickTokens: { Label: string; Token: string }[];
  AvailableFields: AvailableField[];
  MappingRows: FieldMappingRow[];
}

// ===============================
// SALARY STRUCTURE — COMPONENTS
// ===============================

export type SalaryComponentType = "Earnings" | "Deduction";

export interface SalaryComponent {
  Id: number;
  ComponentName: string;
  PrintName: string;
  IsCalculative: 0 | 1;
  IsOpenComponent: 0 | 1;
  Type: SalaryComponentType;
  SortOrder: number;
  /** System-defined components (e.g. Basic, OT1, OT2) can be edited but not deleted. */
  IsSystemDefined?: boolean;
}

export interface SalaryComponentListResponse {
  Components: SalaryComponent[];
}

export interface CreateSalaryComponentResponse extends ApiMessageResponse {
  Id: number;
}

// ===============================
// SALARY STRUCTURE — STRUCTURE (component configuration)
// ===============================

export type StructureCalculationType = "Lumpsum" | "Percentage" | "Formula" | "Flat Rate" | "Every Month";
export type StructureBasedOn = "Pay Days" | "Calendar Days" | "Fixed" | "Independent";

export interface StructureEntry {
  ComponentId: number;
  CalculationType: StructureCalculationType;
  /** Small secondary label shown under Calculation Type, e.g. the formula name ("Basic", "HRA"). */
  CalculationDetail?: string;
  EffectiveFrom: string;
  EffectiveTill: string;
  BasedOn: StructureBasedOn;
  TdsRef: string;
  Order: number;
}

// ===============================
// SALARY STRUCTURE — DEFINITIONS (left sidebar list)
// ===============================

export interface SalaryStructureDefinition {
  Id: number;
  Name: string;
  /** Short tag shown under the name, e.g. "Gross", "CTC", "Component Wise" */
  Tag: string;
  /** System-defined structures (e.g. the default Gross structure) can be edited but not deleted. */
  IsSystemDefined?: boolean;
}

// ===============================
// IMPORT
// ===============================

export type ImportTemplateType = "Branch Details" | "Designation Details" | "Bank Detailswww";

export interface ImportUploadResponse extends ApiMessageResponse {
  SuccessCount: number;
  FailedCount: number;
}

// ===============================
// VALIDATION
// ===============================

export interface ValidationResult {
  valid: boolean;
  error?: string;
}
