// Shapes for the HR/Admin "employee business profile" chatbot reply.
// Raw rows come from dbo.USP_GetEmployeeBasicDetailsChat (7 result sets, in
// this order: personal, address, bank, family, documents, experience,
// education). The service only copies allow-listed fields into the profile.

export type EmployeeInfoRecord = Record<string, unknown>;

export type EmployeeInfoResultSets = [
  personal: EmployeeInfoRecord[],
  address: EmployeeInfoRecord[],
  bank: EmployeeInfoRecord[],
  family: EmployeeInfoRecord[],
  documents: EmployeeInfoRecord[],
  experience: EmployeeInfoRecord[],
  education: EmployeeInfoRecord[],
];

export type EmployeeProfileValue = string | number | boolean | null;

export interface EmployeeProfileField {
  label: string;
  value: EmployeeProfileValue;
}

export interface EmployeeProfileRecord {
  heading?: string;
  fields: EmployeeProfileField[];
}

export interface EmployeeProfileSection {
  title: string;
  icon: string;
  records: EmployeeProfileRecord[];
}

export interface UnavailableProfileSection {
  status: 'unavailable';
  reason: string;
}

export interface EmployeeBusinessProfile {
  sections: EmployeeProfileSection[];
  identity: {
    employeeId: string | null;
    fullName: string | null;
    firstName: string | null;
    lastName: string | null;
    profilePhoto: string | null;
    dateOfBirth: string | null;
    gender: string | null;
  };
  employment: {
    dateOfJoining: string | null;
    dateOfLeaving: string | null;
    grade: string | number | null;
  };
  organization: {
    companyName: string | null;
    branchName: string | null;
    departmentName: string | null;
    designationName: string | null;
    reportingManagerName: string | null;
    employmentType: string | null;
    employmentTypeId: string | null;
    employmentStatus: string | null;
    employmentStatusId: string | null;
  };
  contact: {
    email: string | null;
    mobileNo: string | null;
    alternateMobileNo: string | null;
    emergencyNo: string | null;
    alternateEmail: string | null;
  };
  unavailableSections: {
    education: UnavailableProfileSection;
    experience: UnavailableProfileSection;
    address: UnavailableProfileSection;
  };
}
