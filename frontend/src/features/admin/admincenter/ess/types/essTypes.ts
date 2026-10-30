export interface ESSModules {
  request: boolean;
  profile: boolean;
  misc: boolean;
  report: boolean;
  review: boolean;
  dashboard: boolean;
}

export interface ESSSettings {
  enabled: boolean;
  employeeSelfService: boolean;
  effectiveFrom: string;
  modules: ESSModules;
}