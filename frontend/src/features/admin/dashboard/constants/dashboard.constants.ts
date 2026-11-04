



import type { StatCardConfig } from '../types/dashboard.types';

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
  { label: 'Time & Office', icon: 'Users2', path: 'time-office' },
] as const;
