// ---- Dashboard ----
export interface BgvDashboardStats {
    completedVerifications: number;
    pendingVerifications: number;
    discrepancies: number;
}

// ---- Initiate tab ----
export interface BgvCandidate {
    candidateId: string;
    candidateName: string;
    designation?: string;
    email?: string;
}

export interface BgvInitiateFilters {
    search?: string;
    candidateType?: string;
    query?: string;
    branch?: string;
    salaryStructure?: string;
    leave?: string;
    attendance?: string;
    designation?: string;
    empStatus?: string;
}

export interface InitiateBgvPayload {
    candidateIds: string[];
}

export type UpdateInitiateCandidatePayload = { candidateId: string } & Partial<BgvCandidate>;

// ---- Ongoing BGV tab ----
export type BgvVerificationStatus = 'new' | 'pending' | 'verified' | 'rejected';
export type BgvOverallStatus = 'pending' | 'in_progress' | 'completed' | 'discrepancy';

export interface BgvVerificationItem {
    verificationType: string;
    verificationDate?: string;
    status: BgvVerificationStatus;
}

export interface OngoingBgvCandidate {
    candidateId: string;
    candidateName: string;
    designation?: string;
    email?: string;
    overallStatus?: BgvOverallStatus;
    externalVerifier?: string;
    activities?: string;
    verifications: BgvVerificationItem[];
}

export interface UpdateOngoingBgvPayload {
    overallStatus?: BgvOverallStatus;
    externalVerifier?: string;
    activities?: string;
    verifications?: BgvVerificationItem[];
}

export interface AssignVerifierPayload {
    candidateIds: string[];
    externalVerifier: string;
    activities: string;
}

// ---- Completed BGV tab ----
export interface BgvListFilters {
    search?: string;
    page?: number;
    pageSize?: number;
}

// ---- Settings tab ----
export interface BgvVerificationTypeSetting {
    id?: string;
    name: string;
    enabled: boolean;
}

export type BgvMailTemplateType = 'consent' | 'external_verification' | 'employment_verification';

export interface BgvMailTemplate {
    type: BgvMailTemplateType;
    subject: string;
    body: string;
}

export interface BgvSettings {
    verificationTypes: BgvVerificationTypeSetting[];
    requireExternalVerifier: boolean;
    mailTemplates: BgvMailTemplate[];
}

// ---- Audit Log modal ----
export interface BgvAuditLogEntry {
    recordDetails: string;
    recordChanges: string;
    actionTime: string;
    user: string;
    employeeName: string;
}

export interface BgvAuditLogFilters {
    search?: string;
    user?: string;
    employee?: string;
    action?: string;
    page?: number;
    pageSize?: number;
}

export type BgvTab = 'dashboard' | 'initiate' | 'ongoing' | 'completed' | 'settings';

// ---- Sidebar ----

export interface SubNavItem {
    label: string;
    path: string;
    children?: SubNavItem[];
}