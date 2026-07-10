import { Injectable } from '@nestjs/common';
import { IntentDefinition } from '../types';
import { fuzzyContains } from '../utils/fuzzy.util';
import { buildMenuGuide } from '../utils/string.util';

@Injectable()
export class EmployeeService {
  getEmployeeCard(employee: Record<string, any>): string {
    return [
      `Name: ${employee.name}`,
      `ID: ${employee.id}`,
      `Role: ${employee.designation}`,
      `Department: ${employee.department}`,
    ].join('\n');
  }

  getOwnProfileGuide(employee: Record<string, any>): string {
    return buildMenuGuide(
      'Your profile in the portal',
      ['Open the Employees menu.', 'Click your profile card.', 'Use the profile panel to review your basic details.', 'Open the payroll/document section for salary, Form16, or payslip actions.'],
      `Current snapshot: ${employee.name} | ${employee.department} | ${employee.designation}`,
    );
  }

  getPrivateDocGuide(role: string): string {
    const baseSteps = [
      'Open the Employees menu.',
      'Select the employee card.',
      'Open the payroll or documents panel inside the profile.',
      'Download Form16, payslip, or appraisal files from there.',
    ];
    if (role === 'admin' || role === 'hr') {
      return buildMenuGuide('Employee private details access', baseSteps, 'You can review all employee public details from the directory, then open the secure document area for private files.');
    }
    return buildMenuGuide('Your private documents', baseSteps, 'Regular employees can only open their own secure documents.');
  }

  getIntents(): IntentDefinition[] {
    return [
      {
        name: 'employeeListShort',
        test: (ctx) =>
          (ctx.msg.includes('only') || ctx.msg.includes('just') ||
           ctx.msg.includes('names only') || ctx.msg.includes('ids only')) &&
          fuzzyContains(ctx.msg, 'employee') &&
          (ctx.msg.includes('name') || ctx.msg.includes('names') ||
           ctx.msg.includes('id')   || ctx.msg.includes('ids')),
        handle: async (ctx) => {
          if (ctx.msg.includes('name') || ctx.msg.includes('names')) {
            if (ctx.role === 'admin' || ctx.role === 'hr')
              return `Employee names:\n${ctx.directory.map(e => `• ${e.name}`).join('\n')}`;
            return `Access Denied: You don't have permission to list all employee names.`;
          }
          if (ctx.role === 'admin' || ctx.role === 'hr')
            return `Employee IDs:\n${ctx.directory.map(e => `• ${e.id}`).join('\n')}`;
          return `Access Denied: You don't have permission to list all employee IDs.`;
        },
      },

      {
        name: 'myDetails',
        test: (ctx) =>
          ctx.msg.includes('my details') || ctx.msg.includes('my profile') ||
          ctx.msg.includes('my basic info') || ctx.msg.includes('basic info') ||
          ctx.msg.includes('show my info') || ctx.msg.includes('show my details') ||
          ctx.msg.includes('show my profile') || ctx.msg.includes('about me') ||
          ctx.msg.includes('what is my id') || ctx.msg.includes('whats my id') ||
          ctx.msg.includes('my id') || ctx.msg.includes('employee id') ||
          ctx.msg.includes('my role') || ctx.msg.includes('what is my role') ||
          ctx.msg.includes('whats my role') || ctx.msg.includes('my designation') ||
          ctx.msg.includes('my department') || ctx.msg.includes('which department') ||
          ctx.msg === 'details' || ctx.msg === 'profile' ||
          ctx.msg === 'role' || ctx.msg === 'id' || ctx.msg === 'designation',
        handle: async (ctx) => {
          if (!ctx.selfEmployee) return 'Employee data not found.';
          const e = ctx.selfEmployee;
          if ((ctx.msg.includes('role') || ctx.msg.includes('designation')) && !ctx.msg.includes('detail') && !ctx.msg.includes('profile')) {
            return `Your designation is ${e.designation}.`;
          }
          if (ctx.msg.includes('employee id') || ctx.msg === 'id' || (ctx.msg.includes('my id') && !ctx.msg.includes('detail'))) {
            return `Your employee ID is ${e.id}.`;
          }
          if (ctx.msg.includes('department') && !ctx.msg.includes('detail') && !ctx.msg.includes('profile')) {
            return `You are in the ${e.department} department.`;
          }
          return `Profile summary:\n${this.getEmployeeCard(e)}`;
        },
      },

      {
        name: 'salaryHistory',
        test: (ctx) =>
          ctx.msg.includes('my salary history') || ctx.msg.includes('salary history') ||
          ctx.msg.includes('past salary') || ctx.msg.includes('previous salary') || ctx.msg.includes('pay history'),
        handle: async (ctx) =>
          ctx.selfEmployee
            ? buildMenuGuide('How to view your salary history', [
                'Open the Employees section from the top menu.',
                'Click your profile card.',
                'Open the Payroll / Salary History tab.',
                'Review your year-on-year salary records and download payslip documents from there.',
              ], 'Detailed payroll history is private and accessible only to you and HR/Admin.')
            : 'Employee data not found.',
      },

      {
        name: 'mySalary',
        test: (ctx) =>
          ctx.msg.includes('my salary') || ctx.msg.includes('my pay') ||
          fuzzyContains(ctx.msg, 'earn') || fuzzyContains(ctx.msg, 'compensation'),
        handle: async (ctx) =>
          ctx.selfEmployee
            ? buildMenuGuide('How to view your salary details', [
                'Open the Employees section from the top menu.',
                'Click your profile card.',
                'Open the Payroll tab inside your profile to view your current salary, deductions, and net pay.',
              ], 'Your payroll records are private and visible only to you and HR/Admin.')
            : 'Employee data not found. Please contact HR.',
      },

      {
        name: 'myForm16',
        test: (ctx) =>
          ctx.msg.includes('my form16') || ctx.msg.includes('my tax') || ctx.msg.includes('my document') ||
          ctx.msg.includes('form16') || fuzzyContains(ctx.msg, 'payslip') || ctx.msg.includes('salary slip'),
        handle: async (ctx) =>
          ctx.selfEmployee
            ? buildMenuGuide('How to open your Form16', [
                'Open Employees.',
                'Select your profile card.',
                'Open the Documents / Payroll section.',
                'Click Form16 to download it.',
              ])
            : 'Form16 not available. Contact Finance team.',
      },

      {
        name: 'listEmployeeNames',
        test: (ctx) =>
          ctx.msg.includes('list') && fuzzyContains(ctx.msg, 'employee') &&
          (ctx.msg.includes('name') || ctx.msg.includes('names')),
        handle: async (ctx) =>
          (ctx.role === 'admin' || ctx.role === 'hr')
            ? `Employee names:\n${ctx.directory.map(e => `• ${e.name}`).join('\n')}`
            : `Access Denied: You don't have permission to list all employee names.`,
      },

      {
        name: 'listEmployeeIds',
        test: (ctx) =>
          ctx.msg.includes('list') && fuzzyContains(ctx.msg, 'employee') &&
          (ctx.msg.includes('id') || ctx.msg.includes('ids')),
        handle: async (ctx) =>
          (ctx.role === 'admin' || ctx.role === 'hr')
            ? `Employee IDs:\n${ctx.directory.map(e => `• ${e.id}`).join('\n')}`
            : `Access Denied: You don't have permission to list all employee IDs.`,
      },

      {
        name: 'myCertificates',
        test: (ctx) =>
          ctx.msg.includes('my certificate') || ctx.msg.includes('my certificates') ||
          ctx.msg.includes('my qualification') || ctx.msg.includes('my credential') || ctx.msg.includes('my skill'),
        handle: async (_ctx) =>
          `${buildMenuGuide('How to view your certificates', [
            'Open the Employees menu.',
            'Click your profile card.',
            'Open the Documents / Certificates section.',
            'View or download the certificate files from there.',
          ])}\n\nIf you need to add a new certificate, upload it from the Documents area in your portal.`,
      },

      {
        name: 'privateDocs',
        test: (ctx) =>
          !ctx.msg.includes('my') &&
          (ctx.msg.includes('form16') || fuzzyContains(ctx.msg, 'payslip') ||
           ctx.msg.includes('salary slip') || ctx.msg.includes('appraisal') ||
           ctx.msg.includes('private detail') || ctx.msg.includes('private details')),
        handle: async (ctx) =>
          (ctx.role === 'admin' || ctx.role === 'hr')
            ? this.getPrivateDocGuide(ctx.role)
            : `Access Denied: Private employee documents are only visible for your own profile.\n\n${this.getPrivateDocGuide(ctx.role)}`,
      },

      {
        name: 'allEmployees',
        test: (ctx) =>
          ctx.msg.includes('all employee') || ctx.msg.includes('all employees') ||
          ctx.msg.includes('show me all') || ctx.msg.includes('all the employee'),
        handle: async (ctx) => {
          if (ctx.msg.includes('id') || ctx.msg.includes('ids')) {
            if (ctx.role === 'admin' || ctx.role === 'hr')
              return `Employee IDs:\n${ctx.directory.map(e => `• ${e.id}`).join('\n')}`;
            return `Access Denied: You don't have permission to list all employee IDs.`;
          }
          if (ctx.role === 'admin' || ctx.role === 'hr') {
            const lines = ctx.directory.map(e => `• ${e.name}${e.code ? ` (${e.code})` : ''} - ${e.id}`).join('\n');
            return `Employee directory (${ctx.directory.length} active):\n${lines}`;
          }
          return `Access Denied: You don't have permission to view all employee details.\n\n${this.getOwnProfileGuide(ctx.selfEmployee ?? { name: ctx.name, department: 'N/A', designation: 'Employee' })}`;
        },
      },

      {
        name: 'salaryNotMine',
        test: (ctx) => (fuzzyContains(ctx.msg, 'salary') || ctx.msg.includes('pay')) && !ctx.msg.includes('my'),
        handle: async (ctx) =>
          (ctx.role === 'admin' || ctx.role === 'hr')
            ? `${buildMenuGuide('How to view employee salary details', [
                'Open the Employees menu.',
                'Select the employee card.',
                'Open the payroll panel to review salary, deductions, and tax.',
                'Use the documents area for Form16 or payslip downloads.',
              ])}\n\nIf you want a public snapshot, browse the directory; if you need the private payroll file, open the secure payroll panel in the portal.`
            : `Access Denied: Salary information for other employees is confidential. Use "my salary" to view yours.\n\n${this.getOwnProfileGuide(ctx.selfEmployee ?? { name: ctx.name, department: 'N/A', designation: 'Employee' })}`,
      },

      {
        name: 'employeeDetail',
        test: (ctx) =>
          fuzzyContains(ctx.msg, 'employee') && fuzzyContains(ctx.msg, 'detail') && !ctx.msg.includes('my'),
        handle: async (ctx) =>
          (ctx.role === 'admin' || ctx.role === 'hr')
            ? `${buildMenuGuide('Employee details navigation', [
                'Open the Employees menu.',
                'Search or click the employee card.',
                'Review the public profile details on the card.',
                'Open the secure documents panel for private details.',
              ])}\n\nYou can access all employee directory cards from the portal, while private files stay in the secure document section.`
            : `You can only access your own details. Use "my details" to view yours.\n\n${this.getOwnProfileGuide(ctx.selfEmployee ?? { name: ctx.name, department: 'N/A', designation: 'Employee' })}`,
      },
    ];
  }
}
