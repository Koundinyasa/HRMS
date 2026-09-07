import { Injectable } from '@nestjs/common';
import { IntentDefinition } from '../types';
import { fuzzyContains } from '../utils/fuzzy.util';
import { DraftService } from './draft.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly draftService: DraftService) {}

  private notify(
    employeeId: string,
    tone: 'info' | 'warning' | 'danger',
    suggestions: { label: string; send: string }[] = [{ label: 'Main Menu', send: 'menu:main' }],
  ) {
    this.draftService.pendingNotice.set(employeeId, { tone });
    if (suggestions.length) this.draftService.pendingSuggestedActions.set(employeeId, suggestions);
  }

  getEmployeeCard(employee: Record<string, any>): string {
    return [
      `Name: ${employee.name}`,
      `ID: ${employee.id}`,
      `Role: ${employee.designation}`,
      `Department: ${employee.department}`,
    ].join('\n');
  }

  getOwnProfileGuide(employeeId: string, employee: Record<string, any>): string {
    this.draftService.pendingSteps.set(employeeId, {
      title: 'Your profile in the portal',
      items: [
        'Open the Employees menu.',
        'Click your profile card.',
        'Use the profile panel to review your basic details.',
        'Open the payroll/document section for salary, Form16, or payslip actions.',
      ],
      note: `Current snapshot: ${employee.name} | ${employee.department} | ${employee.designation}`,
    });
    return `Here's how to find your profile:`;
  }
  getPrivateDocGuide(employeeId: string, role: string): string {
    const baseSteps = [
      'Open the Employees menu.',
      'Select the employee card.',
      'Open the payroll or documents panel inside the profile.',
      'Download Form16, payslip, or appraisal files from there.',
    ];
    const isPrivileged = role === 'admin' || role === 'hr';
    this.draftService.pendingSteps.set(employeeId, {
      title: isPrivileged ? 'Employee private details access' : 'Your private documents',
      items: baseSteps,
      note: isPrivileged
        ? 'You can review all employee public details from the directory, then open the secure document area for private files.'
        : 'Regular employees can only open their own secure documents.',
    });
    return isPrivileged
      ? `Here's how to access employee private details:`
      : `Here's how to open your private documents:`;
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
            if (ctx.role === 'admin' || ctx.role === 'hr') {
              this.draftService.pendingListPreview.set(ctx.employeeId, {
                title: 'Employee Names',
                rows: ctx.directory.map(e => ({ primary: e.name })),
              });
              return `Here are all employee names (${ctx.directory.length}):`;
            }
            this.notify(ctx.employeeId, 'danger');
            return `Access denied: you don't have permission to list all employee names.`;
          }
          if (ctx.role === 'admin' || ctx.role === 'hr') {
            this.draftService.pendingListPreview.set(ctx.employeeId, {
              title: 'Employee IDs',
              rows: ctx.directory.map(e => ({ primary: e.id })),
            });
            return `Here are all employee IDs (${ctx.directory.length}):`;
          }
          this.notify(ctx.employeeId, 'danger');
          return `Access denied: you don't have permission to list all employee IDs.`;
        },
      },

      {
        name: 'myDetails',
        test: (ctx) =>
          (ctx.msg.includes('my details') || ctx.msg.includes('my profile') ||
          ctx.msg.includes('my basic info') || ctx.msg.includes('basic info') ||
          ctx.msg.includes('show my info') || ctx.msg.includes('show my details') ||
          ctx.msg.includes('show my profile') || ctx.msg.includes('about me') ||
          ctx.msg.includes('what is my id') || ctx.msg.includes('whats my id') ||
          ctx.msg.includes('my id') || ctx.msg.includes('employee id') ||
          ctx.msg.includes('my role') || ctx.msg.includes('what is my role') ||
          ctx.msg.includes('whats my role') || ctx.msg.includes('my designation') ||
          ctx.msg.includes('my department') || ctx.msg.includes('which department') ||
          ctx.msg === 'details' || ctx.msg === 'profile' ||
          ctx.msg === 'role' || ctx.msg === 'id' || ctx.msg === 'designation') &&
          // Don't swallow bulk/company-wide requests — "employee id" is a
          // substring of "employee ids", so without this guard a query meant
          // for the full directory gets misrouted to this personal-details reply.
          !ctx.msg.includes('employee ids') &&
          !ctx.msg.includes('all employee') &&
          !ctx.msg.includes('list employee'),
        handle: async (ctx) => {
          if (!ctx.selfEmployee) return 'Employee data not found.';
          const e = ctx.selfEmployee;
          if ((ctx.msg.includes('role') || ctx.msg.includes('designation')) && !ctx.msg.includes('detail') && !ctx.msg.includes('profile')) {
            this.draftService.pendingDataCard.set(ctx.employeeId, {
              title: e.name,
              subtitle: e.designation,
              fields: [{ label: 'Designation', value: e.designation }],
            });
            return `Here's your designation:`;
          }
          if (ctx.msg.includes('employee id') || ctx.msg === 'id' || (ctx.msg.includes('my id') && !ctx.msg.includes('detail'))) {
            this.draftService.pendingDataCard.set(ctx.employeeId, {
              title: e.name,
              subtitle: e.designation,
              fields: [{ label: 'Employee ID', value: e.id }],
            });
            return `Here's your employee ID:`;
          }
          if (ctx.msg.includes('department') && !ctx.msg.includes('detail') && !ctx.msg.includes('profile')) {
            this.draftService.pendingDataCard.set(ctx.employeeId, {
              title: e.name,
              subtitle: e.designation,
              fields: [{ label: 'Department', value: e.department }],
            });
            return `Here's your department:`;
          }
          this.draftService.pendingDataCard.set(ctx.employeeId, {
            title: e.name,
            subtitle: e.designation,
            fields: [
              { label: 'Employee ID', value: e.id },
              { label: 'Department', value: e.department },
              { label: 'Role', value: e.designation },
            ],
          });
          return `Here's your profile:`;
        },
      },

      {
        name: 'salaryHistory',
        test: (ctx) =>
          ctx.msg.includes('my salary history') || ctx.msg.includes('salary history') ||
          ctx.msg.includes('past salary') || ctx.msg.includes('previous salary') || ctx.msg.includes('pay history'),
        handle: async (ctx) => {
          if (!ctx.selfEmployee) return 'Employee data not found.';
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to view your salary history',
            items: [
              'Open the Employees section from the top menu.',
              'Click your profile card.',
              'Open the Payroll / Salary History tab.',
              'Review your year-on-year salary records and download payslip documents from there.',
            ],
            note: 'Detailed payroll history is private and accessible only to you and HR/Admin.',
          });
          return `Here's how to view your salary history:`;
        },
      },

      {
        name: 'mySalary',
        test: (ctx) =>
          (ctx.msg.includes('my salary') || ctx.msg.includes('my pay') ||
          fuzzyContains(ctx.msg, 'earn') || fuzzyContains(ctx.msg, 'compensation')) &&
          !ctx.msg.includes('payslip'),
        handle: async (ctx) => {
          if (!ctx.selfEmployee) return 'Salary details are available in the portal. Contact HR for access.';
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to view your salary details',
            items: [
              'Open the Employees section from the top menu.',
              'Click your profile card.',
              'Open the Payroll tab inside your profile to view your current salary, deductions, and net pay.',
            ],
            note: 'Your payroll records are private and visible only to you and HR/Admin.',
          });
          return `Here's how to view your salary details:`;
        },
      },

      {
        name: 'myPayslip',
        test: (ctx) =>
          ctx.msg.includes('my payslip') || ctx.msg.includes('my salary slip') ||
          ctx.msg === 'payslip',
        handle: async (ctx) => {
          if (!ctx.selfEmployee) return 'Payslip not available. Contact Finance team.';
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your payslip',
            items: [
              'Open Employees.',
              'Select your profile card.',
              'Open the Documents / Payroll section.',
              'Click Payslip to download it.',
            ],
          });
          return `Here's how to open your payslip:`;
        },
      },

      {
        name: 'myForm16',
        test: (ctx) =>
          ctx.msg.includes('my form16') || ctx.msg.includes('my tax') || ctx.msg.includes('my document') ||
          ctx.msg.includes('form16') || fuzzyContains(ctx.msg, 'payslip') || ctx.msg.includes('salary slip'),
        handle: async (ctx) => {
          if (!ctx.selfEmployee) return 'Form16 not available. Contact Finance team.';
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Form16',
            items: [
              'Open Employees.',
              'Select your profile card.',
              'Open the Documents / Payroll section.',
              'Click Form16 to download it.',
            ],
          });
          return `Here's how to open your Form16:`;
        },
      },
      {
        name: 'familyDetails',
 
        test: (ctx) =>
          ctx.msg.includes('family details') ||
          ctx.msg.includes('family information'),
 
        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Family Details not available. Contact HR team.';
 
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Family Details',
 
            items: [
              'Open My Profile.',
              'Select Family Details.',
              'View your family information.',
            ],
          });
 
          return `Here's how to open your Family Details:`;
        },
      },
 
      {
        name: 'educationDetails',
 
        test: (ctx) =>
          ctx.msg.includes('education details') ||
          ctx.msg.includes('educational details') ||
          ctx.msg.includes('education information'),
 
        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Education Details not available. Contact HR team.';
 
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Education Details',
 
            items: [
              'Open My Profile.',
              'Select Education Details.',
              'View your educational information.',
            ],
          });
 
          return `Here's how to open your Education Details:`;
        },
      },
 
      {
        name: 'experienceDetails',
 
        test: (ctx) =>
          ctx.msg.includes('experience details') ||
          ctx.msg.includes('experience information'),
 
        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Experience Details not available. Contact HR team.';
 
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Experience Details',
 
            items: [
              'Open My Profile.',
              'Select Experience Details.',
              'View your experience information.',
            ],
          });
 
          return `Here's how to open your Experience Details:`;
        },
      },
 
      {
        name: 'bankInformation',
 
        test: (ctx) =>
          ctx.msg.includes('bank information') ||
          ctx.msg.includes('bank details'),
 
        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Bank Information not available. Contact HR team.';
 
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Bank Information',
 
            items: [
              'Open My Profile.',
              'Select Bank Information.',
              'View your registered bank information.',
            ],
          });
 
          return `Here's how to open your Bank Information:`;
        },
      },
 
      {
        name: 'uploadedDocuments',
 
        test: (ctx) =>
          ctx.msg.includes('uploaded documents') ||
          ctx.msg.includes('uploaded files'),
 
        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Uploaded Documents not available. Contact HR team.';
 
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Uploaded Documents',
 
            items: [
              'Open My Profile.',
              'Select Uploaded Documents.',
              'View your uploaded documents.',
            ],
          });
 
          return `Here's how to open your Uploaded Documents:`;
        },
      },

      {
        name: 'listEmployeeNames',
        test: (ctx) =>
          ctx.msg.includes('list') && fuzzyContains(ctx.msg, 'employee') &&
          (ctx.msg.includes('name') || ctx.msg.includes('names')),
        handle: async (ctx) => {
          if (ctx.role !== 'admin' && ctx.role !== 'hr') {
            this.notify(ctx.employeeId, 'danger');
            return `Access denied: you don't have permission to list all employee names.`;
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Employee Names',
            rows: ctx.directory.map(e => ({ primary: e.name })),
          });
          return `Here are all employee names (${ctx.directory.length}):`;
        },
      },

      {
        name: 'listEmployeeIds',
        test: (ctx) =>
          ctx.msg.includes('list') && fuzzyContains(ctx.msg, 'employee') &&
          (ctx.msg.includes('id') || ctx.msg.includes('ids')),
        handle: async (ctx) => {
          if (ctx.role !== 'admin' && ctx.role !== 'hr') {
            this.notify(ctx.employeeId, 'danger');
            return `Access denied: you don't have permission to list all employee IDs.`;
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Employee IDs',
            rows: ctx.directory.map(e => ({ primary: e.id })),
          });
          return `Here are all employee IDs (${ctx.directory.length}):`;
        },
      },

      {
        name: 'myCertificates',
        test: (ctx) =>
          ctx.msg.includes('my certificate') || ctx.msg.includes('my certificates') ||
          ctx.msg.includes('my qualification') || ctx.msg.includes('my credential') || ctx.msg.includes('my skill'),
        handle: async (ctx) => {
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to view your certificates',
            items: [
              'Open the Employees menu.',
              'Click your profile card.',
              'Open the Documents / Certificates section.',
              'View or download the certificate files from there.',
            ],
            note: 'To add a new certificate, upload it from the Documents area in your portal.',
          });
          return `Here's how to view your certificates:`;
        },
      },
      {
        name: 'privateDocs',
        test: (ctx) =>
          !ctx.msg.includes('my') &&
          (ctx.msg.includes('form16') || fuzzyContains(ctx.msg, 'payslip') ||
           ctx.msg.includes('salary slip') || ctx.msg.includes('appraisal') ||
           ctx.msg.includes('private detail') || ctx.msg.includes('private details')),
        handle: async (ctx) => {
          const guideIntro = this.getPrivateDocGuide(ctx.employeeId, ctx.role);
          if (ctx.role === 'admin' || ctx.role === 'hr') return guideIntro;
          return `Access denied: private employee documents are only visible for your own profile. ${guideIntro}`;
        },
      },

      {
        name: 'allEmployees',
        test: (ctx) =>
          ctx.msg.includes('all employee') || ctx.msg.includes('all employees') ||
          ctx.msg.includes('show me all') || ctx.msg.includes('all the employee'),
        handle: async (ctx) => {
          if (ctx.msg.includes('id') || ctx.msg.includes('ids')) {
            if (ctx.role === 'admin' || ctx.role === 'hr') {
              this.draftService.pendingListPreview.set(ctx.employeeId, {
                title: 'Employee IDs',
                rows: ctx.directory.map(e => ({ primary: e.id })),
              });
              return `Here are all employee IDs (${ctx.directory.length}):`;
            }
            this.notify(ctx.employeeId, 'danger');
            return `Access denied: you don't have permission to list all employee IDs.`;
          }
          if (ctx.role === 'admin' || ctx.role === 'hr') {
            this.draftService.pendingListPreview.set(ctx.employeeId, {
              title: `All Employees (${ctx.directory.length} active)`,
              rows: ctx.directory.map(e => ({
                primary: e.code ? `${e.name} (${e.code})` : e.name,
                secondary: e.id,
              })),
            });
            return `Here's the employee directory (${ctx.directory.length} active):`;
          }
          this.notify(ctx.employeeId, 'danger', [{ label: 'My Details', send: 'my details' }]);
          return `Access denied: you don't have permission to view all employee details.`;
        },
      },

      {
        name: 'salaryNotMine',
        test: (ctx) => (fuzzyContains(ctx.msg, 'salary') || ctx.msg.includes('pay')) && !ctx.msg.includes('my'),
        handle: async (ctx) => {
          if (ctx.role === 'admin' || ctx.role === 'hr') {
            this.draftService.pendingSteps.set(ctx.employeeId, {
              title: 'How to view employee salary details',
              items: [
                'Open the Employees menu.',
                'Select the employee card.',
                'Open the payroll panel to review salary, deductions, and tax.',
                'Use the documents area for Form16 or payslip downloads.',
              ],
              note: 'For a public snapshot, browse the directory; for the private payroll file, open the secure payroll panel in the portal.',
            });
            return `Here's how to view employee salary details:`;
          }
          this.notify(ctx.employeeId, 'danger', [{ label: 'My Salary', send: 'my salary' }]);
          return `Access denied: salary information for other employees is confidential.`;
        },
      },

      {
        name: 'employeeDetail',
        test: (ctx) =>
          fuzzyContains(ctx.msg, 'employee') && fuzzyContains(ctx.msg, 'detail') && !ctx.msg.includes('my'),
        handle: async (ctx) => {
          if (ctx.role === 'admin' || ctx.role === 'hr') {
            this.draftService.pendingSteps.set(ctx.employeeId, {
              title: 'Employee details navigation',
              items: [
                'Open the Employees menu.',
                'Search or click the employee card.',
                'Review the public profile details on the card.',
                'Open the secure documents panel for private details.',
              ],
              note: 'All employee directory cards are accessible from the portal, while private files stay in the secure document section.',
            });
            return `Here's how to navigate employee details:`;
          }
          this.notify(ctx.employeeId, 'info', [{ label: 'My Details', send: 'my details' }]);
          return `You can only access your own details.`;
        },
      },
    ];
  }
}