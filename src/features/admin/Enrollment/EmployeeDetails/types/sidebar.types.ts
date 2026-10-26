/**
 * Local stand-in for the shared `components/sidebar.types` module that
 * lives outside this folder in the full application. Only the shape
 * actually used by `constants/enrollment.constants.ts` is included.
 *
 * If/when this module is dropped back into the main app, this file can
 * be deleted and the import in enrollment.constants.ts pointed back at
 * the real shared module.
 */
export interface SubNavItem {
  label: string;
  path: string;
  icon?: string;
  badge?: string | number;
}