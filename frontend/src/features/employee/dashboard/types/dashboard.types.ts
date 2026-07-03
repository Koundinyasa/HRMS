export interface EmployeeProfile {
  CompanyName: string;
  ShortName: string;
  FullName: string;
  Email: string;
  Code: string;
  Designation: string;
  Department: string;
  WelcomeMessage: string;
  LastLoginDateTime: string;
  menus: MenuItem[];
}

export interface MenuItem {
  menuId: number;
  menuName: string;
  routingUrl?: string;
  children?: MenuItem[];
}

export interface ProfileResponse {
  success: boolean;
  data: EmployeeProfile;
}

export interface Holiday {
  HolidayID: number;
  HolidayName: string;
  HolidayDate: string;
}

export interface HolidayResponse {
  success: boolean;
  data: Holiday[];
}