import { Injectable } from '@nestjs/common';
import { IntentDefinition } from '../types';
import { fuzzyContains } from '../utils/fuzzy.util';
import { MenuService } from './menu.service';
import { DraftService } from './draft.service';
 
@Injectable()
export class CompanyService {
  constructor(
    private readonly menuService: MenuService,
    private readonly draftService: DraftService,
  ) {}
 
  // Tints the reply bubble (info/warning/danger) and optionally attaches a
  // quick-reply chip, for dead-end replies (no data, access denied, etc.)
  // that would otherwise just be a plain, easy-to-miss sentence.
  private notify(
    employeeId: string,
    tone: 'info' | 'warning' | 'danger',
    suggestions: { label: string; send: string }[] = [
      { label: 'Main Menu', send: 'menu:main' },
    ],
  ) {
    this.draftService.pendingNotice.set(employeeId, { tone });
    if (suggestions.length)
      this.draftService.pendingSuggestedActions.set(employeeId, suggestions);
  }
 
  getIntents(): IntentDefinition[] {
    return [
      {
        name: 'officeLocation',
        test: (ctx) =>
          (ctx.msg.includes('office') || ctx.msg.includes('branch')) &&
          (ctx.msg.includes('location') ||
            ctx.msg.includes('address') ||
            ctx.msg.includes('where') ||
            ctx.msg.includes('branch')),
        handle: async (ctx) => {
          const isPrivileged = ctx.role === 'admin' || ctx.role === 'hr';
 
          if (!isPrivileged) {
            if (!ctx.ownOffice) {
              this.notify(ctx.employeeId, 'info');
              return "Your office location isn't set up yet. Contact HR.";
            }
            const b = ctx.ownOffice;
            this.draftService.pendingDataCard.set(ctx.employeeId, {
              title: b.branchName,
              subtitle: b.city,
              fields: [
                { label: 'Address', value: b.address || '—' },
                { label: 'Phone', value: b.phone || '—' },
              ],
            });
            return `Your office location:`;
          }
 
          this.menuService.pendingMenu.set(ctx.employeeId, 'officeChoice');
          return `You can view your current office, or every office in the company.\nType "current office" or "all offices".`;
        },
      },
 
      {
        name: 'officeLocationCurrent',
        test: (ctx) =>
          (ctx.role === 'admin' || ctx.role === 'hr') &&
          (ctx.msg === 'current office' ||
            ctx.msg === 'office location current' ||
            ctx.msg === 'my office'),
        handle: async (ctx) => {
          if (!ctx.ownOffice) {
            this.notify(ctx.employeeId, 'info');
            return "Your office location isn't set up yet. Contact HR.";
          }
          const b = ctx.ownOffice;
          this.draftService.pendingDataCard.set(ctx.employeeId, {
            title: b.branchName,
            subtitle: b.city,
            fields: [
              { label: 'Address', value: b.address || '—' },
              { label: 'Phone', value: b.phone || '—' },
            ],
          });
          return `Your current office:`;
        },
      },
 
      {
        name: 'officeLocationAll',
        test: (ctx) =>
          (ctx.role === 'admin' || ctx.role === 'hr') &&
          (ctx.msg === 'all offices' ||
            ctx.msg === 'office location all' ||
            ctx.msg === 'all office locations'),
        handle: async (ctx) => {
          if (!ctx.branches.length) {
            this.notify(ctx.employeeId, 'info');
            return 'Office location details are available in the portal. Contact HR.';
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'All office locations',
            rows: ctx.branches.map((b) => ({
              primary: b.branchName,
              meta: [b.address, b.city].filter(Boolean).join(', '),
              secondary: b.phone || undefined,
            })),
          });
          return `Here are all ${ctx.branches.length} office locations:`;
        },
      },
 
      {
        name: 'holidays',
        test: (ctx) =>
          fuzzyContains(ctx.msg, 'holiday') ||
          ctx.msg.includes('vacation') ||
          /\boff\b/.test(ctx.msg) ||
          ctx.msg.includes('festive'),
        handle: async (ctx) => {
          const myState = ctx.ownOffice?.stateCode ?? null;
          const relevant = ctx.companyData.holidays.filter(
            (h) =>
              !h.stateCode || h.stateCode === 'ALL' || h.stateCode === myState,
          );
          if (!relevant.length) {
            this.notify(ctx.employeeId, 'info');
            return 'Company holidays are listed in the portal calendar. Contact HR for the full list.';
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Holidays',
            rows: relevant.map((h) => ({ primary: h.name, meta: h.date })),
          });
          return `Here are your upcoming holidays (${relevant.length}):`;
        },
      },
 
      {
        name: 'announcements',
        test: (ctx) =>
          ctx.msg.includes('announcement') ||
          ctx.msg.includes('news') ||
          ctx.msg.includes('latest news') ||
          ctx.msg.includes('update'),
        handle: async (ctx) => {
          if (!ctx.companyData.announcements.length) {
            this.notify(ctx.employeeId, 'info');
            return 'No announcements found. Check the portal for the latest updates.';
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Announcements',
            rows: ctx.companyData.announcements.map((a) => ({
              primary: a.title,
              meta: a.date,
            })),
          });
          return `Here are the latest announcements:`;
        },
      },
 
      {
        name: 'policy',
        test: (ctx) =>
          fuzzyContains(ctx.msg, 'policy') ||
          ctx.msg.includes('pto') ||
          ctx.msg.includes('procedure') ||
          ctx.msg.includes('leave type') ||
          ctx.msg.includes('types of leave'),
        handle: async (ctx) => {
          if (!ctx.leaveTypes.length) {
            this.notify(ctx.employeeId, 'info');
            return 'Leave policy details are available in the portal. Contact HR for the full list.';
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Leave types and policy',
            rows: ctx.leaveTypes.map((t) => ({
              primary: `${t.name} (${t.code})`,
              meta:
                t.annualQuota === null
                  ? 'As per policy'
                  : `${t.annualQuota} days/year`,
            })),
          });
          return `Here are the leave types and policy:`;
        },
      },
 
      {
        name: 'designation',
        test: (ctx) =>
          ctx.msg.includes('designation') ||
          ctx.msg.includes('job title') ||
          ctx.msg.includes('job titles') ||
          ctx.msg.includes('roles in company') ||
          ctx.msg.includes('positions'),
        handle: async (ctx) => {
          if (!ctx.designations.length) {
            this.notify(ctx.employeeId, 'info');
            return 'Designation information is available in the portal. Contact HR for details.';
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Company designations',
            rows: ctx.designations.map((d) => ({ primary: d })),
          });
          return `Here are all company designations:`;
        },
      },
 
      {
        name: 'companyInfo',
        test: (ctx) =>
          ctx.msg.includes('company name') ||
          ctx.msg.includes('about company') ||
          ctx.msg.includes('company info') ||
          ctx.msg.includes('company details') ||
          ctx.msg.includes('which company') ||
          ctx.msg.includes('company contact'),
        handle: async (ctx) => {
          if (!ctx.companyInfo) {
            this.notify(ctx.employeeId, 'info');
            return 'Company information is available in the portal.';
          }
          const c = ctx.companyInfo;
          this.draftService.pendingDataCard.set(ctx.employeeId, {
            title: c.name,
            subtitle: c.code || undefined,
            fields: [
              ...(c.contactPerson
                ? [{ label: 'Contact', value: c.contactPerson }]
                : []),
              ...(c.contactEmail
                ? [{ label: 'Email', value: c.contactEmail }]
                : []),
            ],
          });
          return `Company details:`;
        },
      },
 
      {
        name: 'department',
        test: (ctx) => ctx.msg.includes('department'),
        handle: async (ctx) => {
          if (ctx.role !== 'admin' && ctx.role !== 'hr') {
            this.notify(ctx.employeeId, 'danger', [
              { label: 'My Details', send: 'my details' },
            ]);
            return `Access denied: the full department list is only available to HR/Admin.`;
          }
          if (!ctx.departments.length) {
            this.notify(ctx.employeeId, 'info');
            return 'Department information is available in the portal. Contact HR for details.';
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Company departments',
            rows: ctx.departments.map((d) => ({ primary: d })),
          });
          return `Here are all company departments:`;
        },
      },
    ];
  }
}