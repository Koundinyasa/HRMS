// // ---- Shared ----
// export type BulkUpdateTab = 'statutory' | 'classification' | 'authority' | 'role' | 'pan-verification';

// export interface BulkUpdateFilters {
//     search?: string;
//     month?: string; // e.g. "2026-06"
//     query?: string;
//     branch?: string;
//     salaryStructure?: string;
//     leave?: string;
//     attendance?: string;
//     designation?: string;
//     empStatus?: string;
// }

// // ---- Statutory tab ----
// export interface StatutoryEmployeeRow {
//     employeeId: string;
//     employeeName: string;
//     dos: string; // Date of Statutory applicability
//     statutory?: string;
// }

// export interface UpdateStatutoryPayload {
//     employeeIds: string[];
//     month: string;
//     statutories: string[];
//     applicable: boolean | null;
// }

// // Placeholder — confirm the real statutory option set with backend/product
// export interface StatutoryOption {
//     value: string;
//     label: string;
// }

// ---- Shared ----
export type BulkUpdateTab = 'statutory' | 'classification' | 'authority' | 'role' | 'pan-verification';

export interface BulkUpdateFilters {
    search?: string;
    month?: string; // e.g. "2026-06"
    query?: string;
    branch?: string;
    salaryStructure?: string;
    leave?: string;
    attendance?: string;
    designation?: string;
    empStatus?: string;
}

// ---- Statutory tab ----
export interface StatutoryEmployeeRow {
    employeeId: string;
    employeeName: string;
    dos: string; // Date of Statutory applicability
    statutory?: string; // shown when no single statutory is selected
    // per-statutory applicability, keyed by StatutoryOption.value (e.g. "pf", "esi")
    // drives the "<Statutory> Applicability" column + YES/NO pill once one statutory is selected
    statutoryApplicability?: Record<string, boolean>;
}

export interface UpdateStatutoryPayload {
    employeeIds: string[];
    month: string;
    statutories: string[];
    applicable: boolean | null;
}

// Placeholder — confirm the real statutory option set with backend/product
export interface StatutoryOption {
    value: string;
    label: string;
}

// ---- Classification tab ----
export interface ClassificationEmployeeRow {
    employeeId: string;
    employeeName: string;
    dos: string; // Date of applicability
    classification?: string;
}

// The "To Change" dropdown — which field this bulk-update screen is editing.
// Placeholder — confirm the real field set with backend/product
export interface ClassificationFieldOption {
    value: string;
    label: string;
}

export interface UpdateClassificationPayload {
    employeeIds: string[];
    month: string;
    field: string; // ClassificationFieldOption.value
    value: string;
}