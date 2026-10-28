// user.types.ts

export type UserRow = {
  id: number;
  userName: string;
  email: string;
  mobile: string;
  active: boolean;
  payroll: string;
};

export type AddUserPayload = {
  userName: string;
  email: string;
  mobile: string;
  payrollRole: string;
  active: boolean;
};
