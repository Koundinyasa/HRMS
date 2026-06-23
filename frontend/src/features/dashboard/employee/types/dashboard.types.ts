export interface Menu {
  menuId: number;
  menuName: string;
  routeUrl: string;
  children: Menu[];
}

export interface EmployeeProfileData {
  FullName: string;
  ShortName: string;
  EmployeeID: string;
  Email: string;
  CompanyName: string;
  Department: string;
  Designation: string;
  WelcomeMessage: string;
  ProfilePhoto: string | null;
  menus: Menu[];
}

export interface EmployeeProfileResponse {
  success: boolean;
  data: EmployeeProfileData;
}