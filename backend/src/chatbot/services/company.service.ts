import { Injectable } from '@nestjs/common';
import { IntentDefinition } from '../types';
import { fuzzyContains } from '../utils/fuzzy.util';

@Injectable()
export class CompanyService {
  getIntents(): IntentDefinition[] {
    return [
      {
        name: 'officeLocation',
        test: (ctx) =>
          (ctx.msg.includes('office') || ctx.msg.includes('branch')) &&
          (ctx.msg.includes('location') || ctx.msg.includes('address') || ctx.msg.includes('where') || ctx.msg.includes('branch')),
        handle: async (ctx) => {
          if (!ctx.branches.length) return 'Office location details are available in the portal. Contact HR.';
          const lines = ctx.branches.map(b => {
            const parts = [b.branchName, b.address, b.city].filter(Boolean).join(', ');
            return `• ${parts}${b.phone ? ` (${b.phone})` : ''}`;
          });
          return `Office location${ctx.branches.length > 1 ? 's' : ''}:\n${lines.join('\n')}`;
        },
      },

      {
        name: 'holidays',
        test: (ctx) =>
          fuzzyContains(ctx.msg, 'holiday') || ctx.msg.includes('vacation') ||
          /\boff\b/.test(ctx.msg) || ctx.msg.includes('festive'),
        handle: async (ctx) =>
          ctx.companyData.holidays.length > 0
            ? `Company holidays (${ctx.companyData.holidays.length}):\n${ctx.companyData.holidays.map(h => `• ${h.date}: ${h.name}`).join('\n')}`
            : 'Company holidays are listed in the portal calendar. Contact HR for the full list.',
      },

      {
        name: 'announcements',
        test: (ctx) =>
          ctx.msg.includes('announcement') || ctx.msg.includes('news') ||
          ctx.msg.includes('latest news') || ctx.msg.includes('update'),
        handle: async (ctx) =>
          ctx.companyData.announcements.length > 0
            ? `Latest announcements:\n${ctx.companyData.announcements.slice(0, 2).map(a => `• ${a.date}: ${a.title}`).join('\n')}`
            : 'No announcements found. Check the portal for the latest updates.',
      },

      {
        name: 'policy',
        test: (ctx) =>
          fuzzyContains(ctx.msg, 'policy') || ctx.msg.includes('pto') ||
          ctx.msg.includes('procedure') || ctx.msg.includes('leave type') || ctx.msg.includes('types of leave'),
        handle: async (ctx) => {
          if (!ctx.leaveTypes.length) {
            return 'Leave policy details are available in the portal. Contact HR for the full list.';
          }
          const lines = ctx.leaveTypes.map(t => {
            const quota = t.annualQuota === null ? 'as per policy' : `${t.annualQuota} days/year`;
            return `• ${t.name} (${t.code}): ${quota}`;
          });
          return `Leave types and policy:\n${lines.join('\n')}`;
        },
      },

      {
        name: 'designation',
        test: (ctx) =>
          ctx.msg.includes('designation') || ctx.msg.includes('job title') ||
          ctx.msg.includes('job titles') || ctx.msg.includes('roles in company') || ctx.msg.includes('positions'),
        handle: async (ctx) => {
          if (!ctx.designations.length) {
            return 'Designation information is available in the portal. Contact HR for details.';
          }
          return `Company designations:\n${ctx.designations.map(d => `• ${d}`).join('\n')}`;
        },
      },

      {
        name: 'companyInfo',
        test: (ctx) =>
          ctx.msg.includes('company name') || ctx.msg.includes('about company') ||
          ctx.msg.includes('company info') || ctx.msg.includes('company details') ||
          ctx.msg.includes('which company') || ctx.msg.includes('company contact'),
        handle: async (ctx) => {
          if (!ctx.companyInfo) return 'Company information is available in the portal.';
          const c = ctx.companyInfo;
          const contact = c.contactPerson || c.contactEmail
            ? `\nContact: ${[c.contactPerson, c.contactEmail].filter(Boolean).join(' - ')}`
            : '';
          return `Company: ${c.name}${c.code ? ` (${c.code})` : ''}${contact}`;
        },
      },

      {
        name: 'department',
        test: (ctx) => ctx.msg.includes('department'),
        handle: async (ctx) => {
          if (!ctx.departments.length) {
            return 'Department information is available in the portal. Contact HR for details.';
          }
          return `Company departments:\n${ctx.departments.map(d => `• ${d}`).join('\n')}`;
        },
      },
    ];
  }
}
