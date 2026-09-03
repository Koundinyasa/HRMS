import { useState } from "react";

export interface ESSMiscSettings {
  holidayList: boolean;
  leaveSummary: boolean;
  leaveHistory: boolean;
  monthlyOverview: boolean;
  circular: boolean;
  policy: boolean;
  feeds: boolean;
  poll: boolean;
  wallOfFame: boolean;
}

const DEFAULT_MISC_SETTINGS: ESSMiscSettings = {
  holidayList: true,
  leaveSummary: true,
  leaveHistory: true,
  monthlyOverview: true,
  circular: true,
  policy: true,
  feeds: true,
  poll: true,
  wallOfFame: true,
};

export const useEssMiscSettings = () => {
  const [settings, setSettings] =
    useState<ESSMiscSettings>(
      DEFAULT_MISC_SETTINGS
    );

  const updateSetting = <
    K extends keyof ESSMiscSettings
  >(
    key: K,
    value: ESSMiscSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateSettings = (
    values: Partial<ESSMiscSettings>
  ) => {
    setSettings((previous) => ({
      ...previous,
      ...values,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_MISC_SETTINGS);
  };

  return {
    settings,
    setSettings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
};

export default useEssMiscSettings;