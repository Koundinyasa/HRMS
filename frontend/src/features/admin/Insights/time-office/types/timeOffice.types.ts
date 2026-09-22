export interface TimeOfficeReport {
  label: string;
  path: string;
}

export interface TimeOfficeSection {
  title: string;
  reports: TimeOfficeReport[];
}