import { useState } from "react";

export interface ESSReportSettings {
  attendanceReport: boolean;
  leaveReport: boolean;
  salaryReport: boolean;
  employeeReport: boolean;
  monthlyReport: boolean;
}

const DEFAULT_REPORT_SETTINGS: ESSReportSettings = {
  attendanceReport: true,
  leaveReport: true,
  salaryReport: true,
  employeeReport: true,
  monthlyReport: true,
};

export const useEssReportSettings = () => {
  const [settings, setSettings] =
    useState<ESSReportSettings>(
      DEFAULT_REPORT_SETTINGS
    );

  const updateSetting = <
    K extends keyof ESSReportSettings
  >(
    key: K,
    value: ESSReportSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateSettings = (
    values: Partial<ESSReportSettings>
  ) => {
    setSettings((previous) => ({
      ...previous,
      ...values,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_REPORT_SETTINGS);
  };

  return {
    settings,
    setSettings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
};

export default useEssReportSettings;