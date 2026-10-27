



import type { StatCardConfig, ActivityItem } from '../types/dashboard.types';

// Styling-only update: icon background colors and icons now match Figma.
// Keys, labels, filterType and order are unchanged.
export const STAT_CARDS: StatCardConfig[] = [
  { key: 'totalEmployees', label: 'Total Current Employees', icon: 'Users', iconBg: '#2F80ED', filterType: 'all' },
  { key: 'confirmationPending', label: 'Confirmation Pending', icon: 'UserSearch', iconBg: '#F2711C', filterType: 'confirmation-pending' },
  { key: 'joinedEmployee', label: 'Joined Employee', icon: 'UserPlus', iconBg: '#219653', filterType: 'joined' },
  { key: 'leftEmployee', label: 'Left Employee', icon: 'UserMinus', iconBg: '#EB3B3B', filterType: 'left' },
  { key: 'openPositions', label: 'Open Positions', icon: 'FileUser', iconBg: '#E84C9A', filterType: 'open' },
];

export const SIDEBAR_LINKS = [
  { label: 'Admin Center', icon: 'LayoutGrid', path: 'admin-center' },
  { label: 'Enrollment', icon: 'ClipboardList', path: 'enrollment' },
  { label: 'Talent Hub', icon: 'Users2', path: 'talent-hub' },
  { label: 'Time & Office', icon: 'Users2', path: 'time-office' },
  { label: 'Payroll', icon: 'Wallet', path: 'payroll' },
  { label: 'Insights', icon: 'BarChart3', path: 'insights' },
  { label: 'Organizations', icon: 'Building2', path: 'organizations' },
] as const;

export const CLASSIFICATION_OPTIONS = [
  { id: '1',       label: 'Company' },
  { id: '2',       label: 'Branch' },
  { id: '3',       label: 'Department' },
  { id: '4',       label: 'Salary' },
  { id: '5',       label: 'Designation' },
  { id: '6',       label: 'Gender' },
  { id: '7',       label: 'LeavePolicy'},
  { id: '8',       label: 'Team' },
  { id: '10',      label: 'Attendance'},
  { id: '11',      label: 'Bank' },
] as const;

export type ClassificationId = (typeof CLASSIFICATION_OPTIONS)[number]['id'];

// Placeholder activity feed until a notifications endpoint exists
export const MOCK_NOTIFICATIONS: ActivityItem[] = [
  {
    id: '1',
    title: 'Project 1 Status',
    priority: 'High',
    scheduledFor: 'Scheduled for 04:00 PM on 24 Jun 2026',
    done: true,
  },
  {
    id: '2',
    title: 'Project 2 Status',
    priority: 'Medium',
    scheduledFor: 'Scheduled for 03:00 PM on 28 Jun 2026',
  },
  {
    id: '3',
    title: 'New Employee Onboarding',
    priority: 'Low',
    scheduledFor: 'Scheduled for 11:00 AM on 30 Jun 2026',
  },
  {
    id: '4',
    title: 'Meeting with MD',
    priority: 'High',
    scheduledFor: 'Scheduled for 04:00 PM on 3 Jul 2026',
  },
];