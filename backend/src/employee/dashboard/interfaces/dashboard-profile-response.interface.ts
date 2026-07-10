export interface DashboardProfileResponse {
  
  success: boolean;
  data: {
    profile: {
      FullName: string;
      ShortName: string;
      Code: string;
      ProfilePhoto: string | null;
      CompanyID: number;
      CompanyCode: string;
      CompanyName: string;
      BranchName: string;
      BranchCode: string;
      RoutingUrl: string;
      DeptID: number;
      Department: string;
      RoleID: number;
      DefaultRole: string;
      DesignationID: number;
      Designation: string;
      WelcomeMessage: string;
      LastLoginDateTime: string | null;
      LastLogoutDateTime: string | null;
      LoginFailedCount: number;
      Isaccountlocked: boolean;
      Accountlockedtime: string | null;
      EmployeeID: string;
      Email: string;
      Mobileno: string | null;
    };
 
    menus: Menu[];
 
    attendanceSummary: {
      EmployeeID: string;
      AverageHours: string;
      "AverageCheck-In": string;
      "On-TimeArrival": string;
      "AverageCheck-Out": string;
    };
 
    upcomingEvents: {
      FullName: string;
      Code: string;
      EventName: string;
      EventDate: string;
    }[];
  };
}
 
export interface Menu {
  menuId: number;
  menuName: string;
  routeUrl: string;
  iconClass: string | null;
  children: Menu[];
}