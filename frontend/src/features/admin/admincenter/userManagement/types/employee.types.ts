// employee.types.ts

export type CreatedEmployee = {
  id: number;
  name: string;
  mobile: string;
  email: string;
  essRole: string;
  payrollRole: string;
  loginDone: boolean;
  active: boolean;
};

export type PendingEmployee = {
  id: number;
  name: string;
  mobile: string;
  email: string; // can be empty
  emailVerified: "valid" | "not_verified";
};

export type EmployeeSubTab =
  | "Employee Created"
  | "Pending Employee"
  | "Updated Email ID"
  | "InActive Employee's";
