// role-access.types.ts

export type PermissionKey =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "audit"
  | "selectAll";

export type PermissionRow = {
  id: number;
  page: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  audit: boolean;
  selectAll: boolean;
};

export type RoleAccessConfig = {
  modules: string[];
  data: Record<string, PermissionRow[]>;
};
