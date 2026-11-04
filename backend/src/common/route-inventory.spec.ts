import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { ROLES_KEY } from './decorators/roles.decorator';
import {
  GATE_OPEN_KEY,
  REQUIRES_MENU_KEY,
} from './decorators/module-gate.decorator';

// uuid ships as an ES module that jest cannot load; the inventory never calls it.
jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

/**
 * Route inventory: loads every controller in src/ and checks the access rules
 * that must never be broken by accident.
 *
 *  1. The three global guards are registered, in the right order.
 *  2. A route that needs no login (@Public) must be listed in PUBLIC_ROUTES.
 *  3. A route under admin/ or recruitment/ must carry @Roles(...), unless it is
 *     listed in EMPLOYEE_ROUTES (routes that ordinary employees use).
 *
 * When a check fails, the message names the route. Add it to the list only if
 * the route is meant to be open, and say why in a comment next to it.
 */

/** Routes that may be called without a login. "METHOD /path" (no api prefix). */
const PUBLIC_ROUTES = new Set<string>([
  'GET /health',
  // Login flow
  'GET /auth/captcha',
  'POST /auth/login',
  'POST /auth/refresh',
  'POST /auth/verify-company',
  'POST /auth/forgot-password',
  'POST /auth/verify-otp',
  'POST /auth/forgot-password/reset',
  // Must work when the session has already expired
  'POST /auth/logout',
]);

/** Routes under admin/ or recruitment/ that ordinary employees may call. */
const EMPLOYEE_ROUTES = new Set<string>([
  // None today: every admin/ and recruitment/ route carries @Roles(...).
]);

const SRC_ROOT = path.resolve(__dirname, '..');
const ROLE_CHECKED_PREFIXES = ['admin', 'recruitment'];

interface RouteInfo {
  key: string; // "GET /admin/foo/bar"
  controller: string;
  isPublic: boolean;
  hasRoles: boolean;
  gateOpen: boolean;
  gateTag: 'open' | 'menu' | 'closed' | 'none';
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.controller\.ts$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Same lookup order as Reflector.getAllAndOverride: route first, then controller. */
function meta<T>(key: string, handler: Function, controller: Function): T | undefined {
  const own = Reflect.getMetadata(key, handler);
  return own !== undefined ? own : Reflect.getMetadata(key, controller);
}

function norm(...parts: unknown[]): string {
  const flat: string[] = [];
  for (const p of parts) {
    if (Array.isArray(p)) flat.push(String(p[0] ?? ''));
    else flat.push(String(p ?? ''));
  }
  return '/' + flat.map((s) => s.replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/');
}

function loadRoutes(): RouteInfo[] {
  const routes: RouteInfo[] = [];
  const seen = new Set<Function>();

  for (const file of walk(SRC_ROOT)) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(file);
    for (const exported of Object.values(mod)) {
      if (typeof exported !== 'function' || seen.has(exported)) continue;
      const base = Reflect.getMetadata(PATH_METADATA, exported);
      if (base === undefined) continue; // not a controller
      seen.add(exported);

      const proto = (exported as any).prototype;
      for (const name of Object.getOwnPropertyNames(proto)) {
        if (name === 'constructor') continue;
        // Read the definition only: touching a getter would run it.
        const handler = Object.getOwnPropertyDescriptor(proto, name)?.value;
        if (typeof handler !== 'function') continue;
        const method = Reflect.getMetadata(METHOD_METADATA, handler);
        if (method === undefined) continue; // not a route

        const route = Reflect.getMetadata(PATH_METADATA, handler);
        const menus = meta<string[]>(REQUIRES_MENU_KEY, handler, exported);
        const gateOpen = meta<boolean>(GATE_OPEN_KEY, handler, exported) === true;
        const roles = meta<unknown[]>(ROLES_KEY, handler, exported);

        routes.push({
          key: `${RequestMethod[method]} ${norm(base, route)}`,
          controller: `${exported.name}.${name}`,
          isPublic: meta<boolean>(IS_PUBLIC_KEY, handler, exported) === true,
          hasRoles: Array.isArray(roles) && roles.length > 0,
          gateOpen,
          gateTag: gateOpen
            ? 'open'
            : menus === undefined
              ? 'none'
              : menus.length === 0
                ? 'closed'
                : 'menu',
        });
      }
    }
  }
  return routes;
}

describe('route inventory', () => {
  const routes = loadRoutes();

  it('finds the controllers', () => {
    expect(routes.length).toBeGreaterThan(50);
  });

  it('registers JwtAuthGuard, RolesGuard and ModuleGateGuard globally, in that order', () => {
    const source = fs.readFileSync(path.join(SRC_ROOT, 'app.module.ts'), 'utf8');
    const at = (name: string) => source.search(new RegExp(`APP_GUARD[^}]*useClass:\\s*${name}\\b`));
    const jwt = at('JwtAuthGuard');
    const roles = at('RolesGuard');
    const gate = at('ModuleGateGuard');
    expect(jwt).toBeGreaterThanOrEqual(0);
    expect(roles).toBeGreaterThan(jwt);
    expect(gate).toBeGreaterThan(roles);
  });

  it('has no public route that is not on the PUBLIC_ROUTES list', () => {
    const unlisted = routes.filter((r) => r.isPublic && !PUBLIC_ROUTES.has(r.key)).map((r) => r.key);
    expect(unlisted).toEqual([]);
  });

  it('has no stale entries on the PUBLIC_ROUTES list', () => {
    const publicNow = new Set(routes.filter((r) => r.isPublic).map((r) => r.key));
    const stale = [...PUBLIC_ROUTES].filter((k) => !publicNow.has(k));
    expect(stale).toEqual([]);
  });

  it('has no admin or recruitment route without @Roles that is not on the EMPLOYEE_ROUTES list', () => {
    const open = routes
      .filter((r) => !r.isPublic && !r.hasRoles)
      .filter((r) => {
        const first = r.key.split(' ')[1].split('/')[1]?.toLowerCase();
        return ROLE_CHECKED_PREFIXES.includes(first);
      })
      .filter((r) => !EMPLOYEE_ROUTES.has(r.key))
      .map((r) => `${r.key}   (${r.controller})`);
    expect(open).toEqual([]);
  });

  it('has no stale entries on the EMPLOYEE_ROUTES list', () => {
    const now = new Set(routes.filter((r) => !r.isPublic && !r.hasRoles).map((r) => r.key));
    const stale = [...EMPLOYEE_ROUTES].filter((k) => !now.has(k));
    expect(stale).toEqual([]);
  });

  // Run with LIST_ROUTES=1 to print every route that needs a login but no role.
  (process.env.LIST_ROUTES ? it : it.skip)('lists login-only routes', () => {
    const lines = routes
      .filter((r) => !r.isPublic && !r.hasRoles)
      .map((r) => `${r.key}   (${r.controller})`)
      .sort();
    // eslint-disable-next-line no-console
    console.log(lines.join('\n'));
  });

  it('prints a summary', () => {
    const count = (f: (r: RouteInfo) => boolean) => routes.filter(f).length;
    // eslint-disable-next-line no-console
    console.log(
      [
        `Routes: ${routes.length}`,
        `public: ${count((r) => r.isPublic)}`,
        `with @Roles: ${count((r) => !r.isPublic && r.hasRoles)}`,
        `login only (no @Roles): ${count((r) => !r.isPublic && !r.hasRoles)}`,
        `gate open: ${count((r) => r.gateTag === 'open')}`,
        `gate menu: ${count((r) => r.gateTag === 'menu')}`,
        `gate closed: ${count((r) => r.gateTag === 'closed')}`,
      ].join(' | '),
    );
  });
});
