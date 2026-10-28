export interface CompanyDetails {
  companyName?: string;
  dateOfEstablishment: string;
  cin_LPIN: string;
  tan: string;
  website: string;
  address1: string;
  address2: string;
  address3: string;
  contactMobile: string;
  contactMobile2?: string;
  companyCode: string;
  isPFApplicable: boolean;
  isESIApplicable: boolean;
  isPTApplicable: boolean;
  isTDSApplicable: boolean;
  tdsFilingMarToFeb: boolean;
  isLWFAvailable: boolean;
  companyLogoPath: string;
}
 
export interface CompanyDetailsApi {
  CompanyName?: string;
  DateOfEstablishment: string;
  CIN_LPIN: string;
  TAN: string;
  Website: string;
  Address1: string;
  Address2: string;
  Address3: string;
  ContactMobile: string;
  CompanyCode: string;
  IsPFApplicable: boolean;
  IsESIApplicable: boolean;
  IsPTApplicable: boolean;
  IsTDSApplicable: boolean;
  TDSFilingMarToFeb: boolean;
  IsLWFAvailable: boolean;
  CompanyLogoPath: string;
}
 
export interface EsiGroup {
  id: number;
  name: string;
}
 
export interface EsiConfiguration {
  effectiveFrom: string;
  cutOffAmount: number;
  employeeRate: number;
  employerRate: number;
  minimumDailyWage: number;
  roundOff: string;
}
 
export interface EsiDetails {
  group: EsiGroup[];
  configuration: EsiConfiguration[];
}
 
export interface EsiGroupApi {
  ID: number;
  Name: string;
}
 
export interface EsiConfigurationApi {
  "Effective From": string;
  "Cut Off(Amount)": number;
  "Employee Rate(%)": number;
  "Employer Rate(%)": number;
  "Minimum Daily Wage(Amount)": number;
  "Round Off": string;
}
 
export interface EsiDetailsApi {
  group: EsiGroupApi[];
  configuration: EsiConfigurationApi[];
}
 
export interface EstablishmentDetails {
  nameAndAddressOfEstablishment: string;
  nameAndAddressOfEmployer: string;
  nameAndAddressOfPrincipalEmployer: string;
  nameAndAddressOfContractor: string;
  nameAndAddressOfManager: string;
  natureOfBusiness: string | null;
}
 
export interface EstablishmentDetailsApi {
  "Name and Address of Establishment": string;
  "Name and Address of Employer": string;
  "Name and Address of Prinicipal Employer": string;
  "Name and Address of Contractor": string;
  "Name and address of Manager": string;
  NatureOfBusiness: string | null;
}
 
export interface LwfGroup {
  id: number;
  defaultLWF: string;
  state: string;
}
 
export interface LwfConfiguration {
  effectiveFrom: string;
  cutoffAmount: number;
  employeeContribution: number;
  employerContribution: number;
  january: boolean;
  february: boolean;
  march: boolean;
  april: boolean;
  may: boolean;
  june: boolean;
  july: boolean;
  august: boolean;
  september: boolean;
  october: boolean;
  november: boolean;
  december: boolean;
}
 
export interface LwfDetails {
  group: LwfGroup[];
  configuration: LwfConfiguration[];
}
 
export interface LwfGroupApi {
  id: number;
  "Default LWF": string;
  State: string;
  Stateid?: number;
}
 
export interface LwfConfigurationApi {
  "Effective From": string;
  "Cutoff Amount": number;
  "Employee Contribution(Amount)": number;
  "Employer Contribution(Amount)": number;
  January: boolean;
  February: boolean;
  March: boolean;
  April: boolean;
  May: boolean;
  June: boolean;
  July: boolean;
  August: boolean;
  September: boolean;
  October: boolean;
  November: boolean;
  December: boolean;
}
 
export interface LwfDetailsApi {
  group: LwfGroupApi[];
  configuration: LwfConfigurationApi[];
}
 
export interface PfGroup {
  id: number;
  name: string;
}
 
export interface PfConfiguration {
  effectiveFrom: string;
  epfPercentage: number;
  cutoff: number;
  pfOnPayDays: boolean;
  pensionFundPercentage: number;
  employerEPFPercentage: number;
  roundOff: string;
  accountNo02Rate: number;
  accountNo21Rate: number;
  minimumChargesAccNo02: number;
  restrictEmployerShare: boolean;
  restrictEmployerEmployeeWise: boolean;
}
 
export interface PfDetails {
  group: PfGroup[];
  configuration: PfConfiguration[];
}
 
export interface PfGroupApi {
  ID: number;
  Name: string;
}
 
export interface PfConfigurationApi {
  "Effective From": string;
  "EPF(A)-(%)": number;
  Cutoff: number;
  "PF On Pay Days": boolean;
  "Pension Fund(B)-(%)": number;
  "EPF(A-B)-(%)": number;
  "Round Off": string;
  "Account No. 02(%)": number;
  "Account No.21(%)": number;
  "Minimum Charges For Acc.No.2": number;
  "Restrict Employer Share": boolean;
  "Restrict Employer Share EmployeeWise": boolean;
}
 
export interface PfDetailsApi {
  group: PfGroupApi[];
  configuration: PfConfigurationApi[];
}
 
export interface PtGroup {
  id: number;
  name: string;
  state: string;
}
 
export interface PtSlab {
  effectiveFrom: string;
  period: string;
  fromSalary: number;
  toSalary: number;
  ptAmount: number;
}
 
export interface PtDetails {
  group: PtGroup[];
  slabs: PtSlab[];
}
 
export interface PtGroupApi {
  id: number;
  Name: string;
  State: string;
  Stateid?: number;
}
 
export interface PtSlabApi {
  "Effective From": string;
  Period: string;
  FromSalary: number;
  ToSalary: number;
  PTAmount: number;
}
 
export interface PtDetailsApi {
  group: PtGroupApi[];
  slabs: PtSlabApi[];
}
 
export interface Establishment {
  nameAndAddressofEstablishment: string;
  nameAndAddressofEmployeer: string;
  nameAndAddressofPrincipalEmployeer: string;
  nameAndAddressofContractor: string;
  nameAndAddressofManager: string;
  nameOfNatureofBusiness: string;
}