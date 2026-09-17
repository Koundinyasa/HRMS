// export interface CompanyDetails {
//     dateOfEstablishment: string;
//     cin_LPIN: string;
//     tan: string;
//     website: string;
//     address1: string;
//     address2: string;
//     address3: string;
//     contactMobile: string;
//     companyCode: string;
//     isPFApplicable: boolean;
//     isESIApplicable: boolean;
//     isPTApplicable: boolean;
//     isTDSApplicable: boolean;
//     tdsFilingMarToFeb: boolean;
//     isLWFAvailable: boolean;
//     companyLogoPath: string;
// }

// export interface EsiGroup {
//   id: number;
//   name: string;
// }

// export interface EsiConfiguration {
//   effectiveFrom: string;
//   cutOffAmount: number;
//   employeeRate: number;
//   employerRate: number;
//   minimumDailyWage: number;
//   roundOff: string;
// }

// export interface EsiDetails {
//     group: EsiGroup[];
//     configuration: EsiConfiguration[];
// }

// export interface EstablishmentDetails {
//     nameAndAddressOfEstablishment: string;
//     nameAndAddressOfEmployer: string;
//     nameAndAddressOfPrincipalEmployer: string;
//     nameAndAddressOfContractor: string;
//     nameAndAddressOfManager: string;
//     natureOfBusiness: string | null;
// }



// export interface LwfGroup {
//     id: number;
//     defaultLWF: string;
//     state: string;
// }

// export interface LwfConfiguration {
//     effectiveFrom: string;
//     cutoffAmount: number;
//     employeeContribution: number;
//     employerContribution: number;
//     january: boolean; february: boolean; march: boolean; april: boolean;
//     may: boolean; june: boolean; july: boolean; august: boolean;
//     september: boolean; october: boolean; november: boolean; december: boolean;
// }


// export interface LwfDetails {
//     group: LwfGroup[];
//     configuration: LwfConfiguration[];
// }


// export interface PfGroup {
//   id: number;
//   name: string;
// }
// export interface PfConfiguration {
//   effectiveFrom: string;
//   epfPercentage: number;
//   cutoff: number;
//   pfOnPayDays: boolean;
//   pensionFundPercentage: number;
//   employerEPFPercentage: number;
//   roundOff: string;
//   accountNo02Rate: number;
//   accountNo21Rate: number;
//   minimumChargesAccNo02: number;
//   restrictEmployerShare: boolean;               // ✅ fixed
//   restrictEmployerEmployeeWise: boolean;        // ✅ fixed
// }
// export interface PfDetails {
//     group: PfGroup[];
//     configuration: PfConfiguration[];
// }


// export interface PtGroup {
//   id: number;
//   name: string;
//   state: string;
// }

// export interface PtSlab {
//   effectiveFrom: string;
//   period: string;
//   fromSalary: number;
//   toSalary: number;
//   ptAmount: number;
// }


// export interface PtDetails {
//     group:PtGroup[];
//     slabs:PtSlab[];
// }


// export interface Establishment {
//   nameAndAddressofEstablishment:string;
//   nameAndAddressofEmployeer:string;
//   nameAndAddressofPrincipalEmployeer:string;
//   nameAndAddressofContractor:string;
//   nameAndAddressofManager:string;
//   nameOfNatureofBusiness:string;
// }











export interface CompanyDetails {
  companyName: string;

  dateOfEstablishment: string;
  cin_LPIN: string;
  tan: string;
  website: string;

  address1: string;
  address2: string;
  address3: string;

  contactMobile: string;
  contactMobile2: string;

  companyCode: string;

  isPFApplicable: boolean;
  isESIApplicable: boolean;
  isPTApplicable: boolean;
  isTDSApplicable: boolean;

  tdsFilingMarToFeb: boolean;

  isLWFAvailable: boolean;

  companyLogoPath: string;
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

export interface EstablishmentDetails {
  nameAndAddressOfEstablishment: string;
  nameAndAddressOfEmployer: string;
  nameAndAddressOfPrincipalEmployer: string;
  nameAndAddressOfContractor: string;
  nameAndAddressOfManager: string;
  natureOfBusiness: string | null;
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

export interface Establishment {
  nameAndAddressofEstablishment: string;
  nameAndAddressofEmployeer: string;
  nameAndAddressofPrincipalEmployeer: string;
  nameAndAddressofContractor: string;
  nameAndAddressofManager: string;
  nameOfNatureofBusiness: string;
}