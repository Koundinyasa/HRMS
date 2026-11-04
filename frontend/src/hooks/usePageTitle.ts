import { useEffect } from "react";

export const APP_NAME = "KTS-People360";

/** A menu from the database; both the admin (flat) and employee (tree) lists fit. */
export interface TitleMenu {
  menuName?: string | null;
  routeUrl?: string | null;
  children?: readonly TitleMenu[] | null;
}

const trimRoute = (route: string) => route.trim().replace(/\/+$/, "").toLowerCase();

const humanize = (segment: string) =>
  segment
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

/**
 * Name of the page at `path` (the path after the company domain, for example
 * "/admin/review/appliedleave"). It is the name of the menu with the longest
 * route that equals the path or sits above it. When no menu matches, the last
 * part of the address is made readable. Returns null when there is nothing.
 */
export function titleFromMenus(
  path: string,
  menus: readonly TitleMenu[],
): string | null {
  const current = trimRoute(path);
  if (current.endsWith("/dashboard")) return "Dashboard";

  const found = { length: -1, name: "" };

  const visit = (list: readonly TitleMenu[]) => {
    for (const menu of list) {
      const route = trimRoute(menu.routeUrl ?? "");
      const name = (menu.menuName ?? "").trim();
      const matches =
        route !== "" && (current === route || current.startsWith(`${route}/`));
      if (matches && name !== "" && route.length > found.length) {
        found.length = route.length;
        found.name = name;
      }
      if (menu.children && menu.children.length > 0) visit(menu.children);
    }
  };
  visit(menus);

  if (found.length >= 0) return found.name;

  const last = current.split("/").filter(Boolean).pop();
  return last ? humanize(last) : null;
}

/** Sets the browser tab title to "<title> - KTS-People360" while the page is open. */
export function usePageTitle(title: string | null | undefined) {
  useEffect(() => {
    document.title = title ? `${title} - ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
}
