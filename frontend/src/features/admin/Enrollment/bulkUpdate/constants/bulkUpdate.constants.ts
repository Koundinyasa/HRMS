// import type { BulkUpdateTab, StatutoryOption } from '../types/bulkUpdate.types';

// export const BULK_UPDATE_TABS: { label: string; path: BulkUpdateTab }[] = [
//     { label: 'Statutory', path: 'statutory' },
//     { label: 'Classification', path: 'classification' },
//     { label: 'Authority', path: 'authority' },
//     { label: 'Role', path: 'role' },
//     { label: 'PAN Verification', path: 'pan-verification' },
// ];

// export const BULK_UPDATE_FILTER_FIELDS = [
//     { label: 'Query', value: 'query' },
//     { label: 'Branch', value: 'branch' },
//     { label: 'Salary Structure', value: 'salaryStructure' },
//     { label: 'Leave', value: 'leave' },
//     { label: 'Attendance', value: 'attendance' },
//     { label: 'Designation', value: 'designation' },
//     { label: 'Emp Status', value: 'empStatus' },
// ] as const;

// export const STATUTORY_OPTIONS: StatutoryOption[] = [
//     { value: 'esi', label: 'ESI' },
//     { value: 'pf', label: 'PF' },
//     { value: 'restrict_employee_pf', label: 'Restrict Employee PF' },
//     { value: 'zero_pt', label: 'Zero PT' },
//     { value: 'zero_pension', label: 'Zero Pension' },
//     { value: 'vol_pf', label: 'Vol PF' },
//     { value: 'international_worker', label: 'International Worker' },
//     { value: 'labour_welfare_fund', label: 'Labour Welfare Fund' },
// ];

// export const APPLICABLE_OPTIONS: { label: string; value: 'true' | 'false' }[] = [
//     { label: 'Yes', value: 'true' },
//     { label: 'No', value: 'false' },
// ];

// export const BULK_UPDATE_SECTION_PATH = 'enrollment/bulkupdate';

import type { BulkUpdateTab, StatutoryOption, ClassificationFieldOption } from '../types/bulkUpdate.types';

export const BULK_UPDATE_TABS: { label: string; path: BulkUpdateTab }[] = [
    { label: 'Statutory', path: 'statutory' },
    { label: 'Classification', path: 'classification' },
    { label: 'Authority', path: 'authority' },
    { label: 'Role', path: 'role' },
    { label: 'PAN Verification', path: 'pan-verification' },
];

export const BULK_UPDATE_FILTER_FIELDS = [
    { label: 'Query', value: 'query' },
    { label: 'Branch', value: 'branch' },
    { label: 'Salary Structure', value: 'salaryStructure' },
    { label: 'Leave', value: 'leave' },
    { label: 'Attendance', value: 'attendance' },
    { label: 'Designation', value: 'designation' },
    { label: 'Emp Status', value: 'empStatus' },
] as const;

export const STATUTORY_OPTIONS: StatutoryOption[] = [
    { value: 'esi', label: 'ESI' },
    { value: 'pf', label: 'PF' },
    { value: 'restrict_employee_pf', label: 'Restrict Employee PF' },
    { value: 'zero_pt', label: 'Zero PT' },
    { value: 'zero_pension', label: 'Zero Pension' },
    { value: 'vol_pf', label: 'Vol PF' },
    { value: 'international_worker', label: 'International Worker' },
    { value: 'labour_welfare_fund', label: 'Labour Welfare Fund' },
];

export const APPLICABLE_OPTIONS: { label: string; value: 'true' | 'false' }[] = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
];

export const BULK_UPDATE_SECTION_PATH = 'enrollment/bulk-update';

// "To Change" dropdown on the Classification tab — which field this screen edits.
// Placeholder — confirm the real field set with backend/product
export const CLASSIFICATION_FIELD_OPTIONS: ClassificationFieldOption[] = [
    { value: 'classification', label: 'Classification' },
];

// Default month shown on the Classification tab's month picker (matches design: Jun/2026)
export const DEFAULT_BULK_UPDATE_MONTH = '2026-06';