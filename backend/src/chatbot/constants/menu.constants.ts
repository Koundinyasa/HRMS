import { Menu } from '../types';

export const MENUS: Record<string, Menu> = {
  main: {
    title: 'Main Menu — what would you like to do?',
    buttons: [
      { label: 'My Details',         send: 'my details' },
      { label: 'Leave',              send: 'menu:leave', employeeOnly: true },
      { label: 'Company Info',       send: 'menu:company' },
      { label: 'Documents',          send: 'menu:documents' },
      { label: 'Employee Directory', send: 'menu:directory', hrOnly: true },
      { label: 'Teams',              send: 'teams',          hrOnly: true },
    ],
  },
  leave: {
    title: 'Leave — choose an option:',
    buttons: [
      { label: 'Apply Leave',    send: 'apply leave' },
      { label: 'Leave Balance',  send: 'leave balance' },
      { label: 'Leave History',  send: 'my leaves' },
      { label: 'Latest Leave',   send: 'latest leave' },
      { label: 'Cancel Leave',   send: 'cancel leave' },
      { label: 'Withdraw Leave', send: 'withdraw leave' },
      { label: '← Main Menu',    send: 'menu:main' },
    ],
  },
  company: {
    title: 'Company Info — choose an option:',
    buttons: [
      { label: 'Holidays',        send: 'holiday list' },
      { label: 'Departments',     send: 'department', hrOnly: true },
      { label: 'Designations',    send: 'designation' },
      { label: 'Office Location', send: 'office location' },
      { label: 'Company Details', send: 'company info' },
      { label: '← Main Menu',     send: 'menu:main' },
    ],
  },
  documents: {
    title: 'Documents — choose an option:',
    buttons: [
      { label: 'Form16',       send: 'my form16' },
      { label: 'Payslip',      send: 'my payslip' },
      { label: 'Certificates', send: 'my certificates' },
      { label: '← Main Menu',  send: 'menu:main' },
    ],
  },
  directory: {
    title: 'Employee Directory — choose an option:',
    buttons: [
      { label: 'All Employees',  send: 'all employees' },
      { label: 'Employee Names', send: 'list employee names' },
      { label: 'Employee IDs',   send: 'list employee ids' },
      { label: '← Main Menu',    send: 'menu:main' },
    ],
  },
  officeChoice: {
    title: 'Office Location — choose an option:',
    buttons: [
      { label: 'Current Office', send: 'current office' },
      { label: 'All Offices',    send: 'all offices' },
    ],
  },
};