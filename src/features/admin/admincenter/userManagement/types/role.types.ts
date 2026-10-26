// role.types.ts

export type RoleModule = "ESS" | "Payroll";

export type RoleRow = {
  id: number;
  roleName: string;
  module: RoleModule;
};

export type RoleMasterTab = "Roles" | "Role Access Settings" | "Employee" | "User";
