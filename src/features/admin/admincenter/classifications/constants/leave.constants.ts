import type { LeaveTab, LeaveSummaryRow } from '../types/leave.types';

export const LEAVE_TABS: { label: string; path: LeaveTab }[] = [
    { label: 'Apply', path: 'apply' },
    { label: 'Summary', path: 'summary' },
    { label: 'History', path: 'history' },
];

// USP_GetLeaveHistory returns Status as free text ("Rejected", "Pending", …),
// so match loosely and fall back to neutral rather than assuming an enum.
const STATUS_CLASSES: Record<string, string> = {
    pending: 'text-amber-600 border-amber-600',
    approved: 'text-emerald-600 border-emerald-600',
    rejected: 'text-red-600 border-red-600',
    cancelled: 'text-slate-500 border-slate-400',
    withdrawn: 'text-slate-500 border-slate-400',
};

export const statusClass = (status: string) =>
    STATUS_CLASSES[status.trim().toLowerCase()] ?? 'text-slate-600 border-slate-300';

// Per-column tints are the whole point of the Summary screen — header row stays app-standard #EDEBFB.
export const LEAVE_SUMMARY_COLUMNS: {
    label: string;
    key: keyof LeaveSummaryRow;
    cell: string;
    header: string;
}[] = [
    { label: 'Leave',       key: 'code',     cell: 'bg-pink-50',    header: 'text-slate-800' },
    { label: 'Opening Bal', key: 'opening',  cell: 'bg-yellow-50',  header: 'text-yellow-600' },
    { label: 'Allotted',    key: 'allotted', cell: 'bg-sky-50',     header: 'text-sky-600' },
    { label: 'Availed',     key: 'availed',  cell: 'bg-violet-50',  header: 'text-violet-600' },
    { label: 'Lapsed',      key: 'lapsed',   cell: 'bg-orange-50',  header: 'text-red-500' },
    { label: 'Encashed',    key: 'encashed', cell: 'bg-orange-50',  header: 'text-red-500' },
    { label: 'Adjusted',    key: 'adjusted', cell: 'bg-orange-50',  header: 'text-red-500' },
    { label: 'Balance',     key: 'balance',  cell: 'bg-emerald-50', header: 'text-emerald-600' },
];

export const LEAVE_SECTION_PATH = 'admin-center/classifications/leave';
