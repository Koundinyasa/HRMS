import { Injectable } from '@nestjs/common';
import { ActionButton, IntentDefinition } from '../types';
import { MENUS } from '../constants/menu.constants';

@Injectable()
export class MenuService {
  // Tracks which submenu's buttons should be shown on the *next* reply,
  // keyed by employeeId.
  readonly pendingMenu = new Map<string, string>();

  getIntents(): IntentDefinition[] {
    return [
      {
        name: 'menu',
        test: (ctx) =>
          /(^|\s)menu:/i.test(ctx.message) || ctx.msg === 'menu' || ctx.msg === 'main menu',
        handle: async (ctx) => {
          const m = ctx.message.match(/menu:\s*([a-z]+)/i);
          const key = m ? m[1].toLowerCase() : 'main';
          const menu = MENUS[key] ?? MENUS.main;
          this.pendingMenu.set(ctx.employeeId, MENUS[key] ? key : 'main');
          return menu.title;
        },
      },
    ];
  }

  getMainMenu(role: string): { title: string; actions: ActionButton[] } {
    const isPrivileged = role === 'admin' || role === 'hr';
    const actions = MENUS.main.buttons
      .filter(b => !b.hrOnly || isPrivileged)
      .map(b => ({ label: b.label, send: b.send }));
    return { title: MENUS.main.title, actions };
  }
}
