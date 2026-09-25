import { Injectable } from '@nestjs/common';
import { HrmsDbService } from '../../db/hrms-db.service';
import { DraftService } from './draft.service';
import { IntentDefinition, TeamListItem } from '../types';

const isPrivileged = (role: string) => role === 'admin' || role === 'hr';

@Injectable()
export class TeamService {
  constructor(
    private readonly hrmsDbService: HrmsDbService,
    private readonly draftService: DraftService,
  ) {}

  private formatTeamList(teams: TeamListItem[]): string {
    return teams.map((t, i) => `${i + 1}. ${t.name}`).join('\n');
  }

  getIntents(): IntentDefinition[] {
    return [
      {
        name: 'teamCancelAny',
        test: (ctx) => {
          if (ctx.msg !== 'cancel team' && ctx.msg !== 'cancel') return false;
          return this.draftService.hasDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
          );
        },
        handle: async (ctx) => {
          this.draftService.deleteDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
          );
          return `No problem \u2014 nothing was downloaded.`;
        },
      },
      {
        name: 'teams',
        test: (ctx) =>
          ctx.msg === 'teams' ||
          ctx.msg === 'team list' ||
          ctx.msg === 'show teams',
        handle: async (ctx) => {
          if (!isPrivileged(ctx.role)) {
            return `Access Denied: The Teams feature is only available to HR/Admin.`;
          }
          const teams = await this.hrmsDbService.getActiveTeams();
          if (!teams.length) {
            return `No active teams found.`;
          }
          this.draftService.setDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
            {
              step: 'awaiting_team',
              teams,
              teamId: null,
              teamName: '',
              action: '',
              format: '',
              members: [],
            },
          );
          return `Which team would you like to look at?\n${this.formatTeamList(teams)}`;
        },
      },

      {
        name: 'teamPick',
        test: (ctx) => {
          if (!/^team:\d+$/.test(ctx.message.trim())) return false;
          const draft = this.draftService.getDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
          );
          return !!draft && draft.step === 'awaiting_team';
        },
        handle: async (ctx) => {
          const draft = this.draftService.getDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
          )!;
          const id = Number(ctx.message.match(/\d+/)?.[0]);
          const team = draft.teams.find((t) => t.id === id);
          if (!team) {
            return `I couldn't find that team. Say "teams" to see the list again.`;
          }
          draft.teamId = team.id;
          draft.teamName = team.name;
          draft.step = 'awaiting_action';
          this.draftService.setDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
            draft,
          );
          return `${team.name} — would you like to View the team, or Download the data?`;
        },
      },

      {
        name: 'teamAction',
        test: (ctx) => {
          if (ctx.msg !== 'view' && ctx.msg !== 'download') return false;
          const draft = this.draftService.getDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
          );
          return !!draft && draft.step === 'awaiting_action';
        },
        handle: async (ctx) => {
          const draft = this.draftService.getDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
          )!;

          if (ctx.msg === 'view') {
            const members = await this.hrmsDbService.getTeamMembers(
              draft.teamId!,
            );
            draft.members = members;
            draft.action = 'view';
            draft.step = 'viewed';
            this.draftService.setDraft(
              this.draftService.teamDrafts,
              ctx.employeeId,
              draft,
            );

            if (!members.length) {
              return `${draft.teamName} has no members on record right now.\n\nWould you like to Download this anyway, or Cancel?`;
            }
            return `${draft.teamName} (${members.length} member${members.length === 1 ? '' : 's'}) \u2014 view the roster below.\n\nWould you like to Download this data, or Cancel?`;
          }

          // download, chosen directly without viewing first
          draft.action = 'download';
          draft.step = 'awaiting_format';
          this.draftService.setDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
            draft,
          );
          return `Download ${draft.teamName}'s data as PDF or Excel?`;
        },
      },

      {
        name: 'teamViewFollowup',
        test: (ctx) => {
          if (ctx.msg !== 'download' && ctx.msg !== 'cancel team') return false;
          const draft = this.draftService.getDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
          );
          return !!draft && draft.step === 'viewed';
        },
        handle: async (ctx) => {
          const draft = this.draftService.getDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
          )!;
          if (ctx.msg === 'cancel team') {
            this.draftService.deleteDraft(
              this.draftService.teamDrafts,
              ctx.employeeId,
            );
            return `No problem \u2014 nothing was downloaded.`;
          }
          draft.action = 'download';
          draft.step = 'awaiting_format';
          this.draftService.setDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
            draft,
          );
          return `Download ${draft.teamName}'s data as PDF or Excel?`;
        },
      },

      {
        name: 'teamFormat',
        test: (ctx) => {
          if (ctx.msg !== 'pdf' && ctx.msg !== 'excel') return false;
          const draft = this.draftService.getDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
          );
          return !!draft && draft.step === 'awaiting_format';
        },
        handle: async (ctx) => {
          const draft = this.draftService.getDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
          )!;
          draft.format = ctx.msg === 'pdf' ? 'pdf' : 'excel';
          draft.step = 'ready_download';
          this.draftService.setDraft(
            this.draftService.teamDrafts,
            ctx.employeeId,
            draft,
          );
          return `Your ${draft.teamName} ${draft.format.toUpperCase()} file is ready \u2014 tap below to download it.`;
        },
      },
    ];
  }
}
