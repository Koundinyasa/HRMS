import { useState } from "react";

export interface ESSProfileSettings {
  personalDetails: boolean;
  contactDetails: boolean;
  bankDetails: boolean;
  nomineeDetails: boolean;
  documentDetails: boolean;
  educationDetails: boolean;
  experienceDetails: boolean;
}

const DEFAULT_PROFILE_SETTINGS: ESSProfileSettings = {
  personalDetails: true,
  contactDetails: true,
  bankDetails: true,
  nomineeDetails: true,
  documentDetails: true,
  educationDetails: true,
  experienceDetails: true,
};

export const useEssProfileSettings = () => {
  const [settings, setSettings] =
    useState<ESSProfileSettings>(
      DEFAULT_PROFILE_SETTINGS
    );

  const updateSetting = <
    K extends keyof ESSProfileSettings
  >(
    key: K,
    value: ESSProfileSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateSettings = (
    values: Partial<ESSProfileSettings>
  ) => {
    setSettings((previous) => ({
      ...previous,
      ...values,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_PROFILE_SETTINGS);
  };

  return {
    settings,
    setSettings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
};

export default useEssProfileSettings;