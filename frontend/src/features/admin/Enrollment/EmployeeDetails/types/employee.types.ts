export interface EmployeeFormData {
  prefix: string;
  employeeId: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  gender: string;
  fatherName: string;
  maritalStatus: string;
  spouseName: string;
  dateOfJoining: string;
  dateOfSalary: string;
  probationPeriod: number;
  panNumber: string;
  aadhaarNumber: string;
  uanNumber: string;
  pfApplicable: boolean;
  pfNumber: string;
  esiApplicable: boolean;
  esiNumber: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  photoUrl?: string;
  confirmationDate: string;
  notes: string;
  documents: File[];
}

export interface EmployeeBasicInfo {
  prefix: string;
  employeeId: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  gender: string;
  fatherName: string;
  maritalStatus: string;
  spouseName: string;
  dateOfJoining: string;
  dateOfSalary: string;
  probationPeriod: number;
  photoUrl?: string;
  confirmationDate: string;
  notes: string;
}

export interface EmployeeStatutoryInfo {
  panNumber: string;
  aadhaarNumber: string;
  uanNumber: string;
  pfApplicable: boolean;
  pfNumber: string;
  esiApplicable: boolean;
  esiNumber: string;
}

export interface EmployeeBankInfo {
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
}

export interface EmployeeAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface EmployeeHRCategory {
  employeeCategory: string;
  employeeGroup: string;
  leavePolicy: string;
  attendance: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  file: File;
  uploadedAt?: string;
}

export interface EmployeeSalaryRate {
  basicSalary: number;
  salaryStructure: string;
  effectiveFrom: string;
  paymentFrequency: string;
}