import type { StatCardConfig, ActivityItem } from '../types/dashboard.types';

export const STAT_CARDS: StatCardConfig[] = [
  {
    key:    'totalEmployees',
    label:  'Total Current Employees',
    icon:   'Users',
    iconBg: '#6366F1',
  },
  {
    key:    'confirmationPending',
    label:  'Confirmation Pending',
    icon:   'UserCheck',
    iconBg: '#F97316',
  },
  {
    key:    'joinedEmployee',
    label:  'Joined Employee',
    icon:   'UserPlus',
    iconBg: '#10B981',
  },
  {
    key:    'openPositions',
    label:  'Open Positions',
    icon:   'Briefcase',
    iconBg: '#EC4899',
  },
  {
    key:    'leftEmployee',
    label:  'Left Employee',
    icon:   'UserMinus',
    iconBg: '#EF4444',
  },
];

export const SIDEBAR_LINKS = [
  { label: 'Admin Center', icon: 'LayoutGrid', path: 'admin-center' },
  { label: 'Enrollment', icon: 'ClipboardList', path: 'enrollment' },
  { label: 'Talent Hub', icon: 'Users2', path: 'talent-hub' },
  { label: 'Payroll', icon: 'Wallet', path: 'payroll' },
  { label: 'Insights', icon: 'BarChart3', path: 'insights' },
  { label: 'Organizations', icon: 'Building2', path: 'organizations' },
] as const;

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