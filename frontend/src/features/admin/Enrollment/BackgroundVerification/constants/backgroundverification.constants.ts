import type { BgvTab, BgvVerificationStatus, BgvOverallStatus, BgvMailTemplateType } from '../types/backgroundverification.types';

export const BGV_TABS: { label: string; path: BgvTab }[] = [
    { label: 'Dashboard', path: 'dashboard' },
    { label: 'Initiate', path: 'initiate' },
    { label: 'Ongoing BGV', path: 'ongoing' },
    { label: 'Completed BGV', path: 'completed' },
    { label: 'Settings', path: 'settings' },
];

export const BGV_INITIATE_FILTER_FIELDS = [
    { label: 'Query', value: 'query' },
    { label: 'Branch', value: 'branch' },
    { label: 'Salary Structure', value: 'salaryStructure' },
    { label: 'Leave', value: 'leave' },
    { label: 'Attendance', value: 'attendance' },
    { label: 'Designation', value: 'designation' },
    { label: 'Emp Status', value: 'empStatus' },
] as const;

export const BGV_VERIFICATION_STATUS_LABELS: Record<BgvVerificationStatus, string> = {
    new: 'New',
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected',
};

// Placeholder — confirm the real option set for the "Overall Status" dropdown
export const BGV_OVERALL_STATUS_OPTIONS: { label: string; value: BgvOverallStatus }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Discrepancy', value: 'discrepancy' },
];

export const BGV_DEFAULT_VERIFICATION_TYPES = [
    { name: 'Consent', enabled: true },
    { name: 'Identity Verification', enabled: true },
    { name: 'Education Verification', enabled: true },
    { name: 'Employment Verification', enabled: true },
    { name: 'Criminal Record Check', enabled: false },
    { name: 'Address Verification', enabled: false },
];

export const BGV_MAIL_TEMPLATE_TYPES: { label: string; value: BgvMailTemplateType }[] = [
    { label: 'Consent', value: 'consent' },
    { label: 'External Verification', value: 'external_verification' },
    { label: 'Employment Verification', value: 'employment_verification' },
];


export const BGV_SECTION_PATH = 'enrollment/background-verification';