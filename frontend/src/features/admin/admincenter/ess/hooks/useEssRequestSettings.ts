import { useState } from "react";

export interface ESSRequestSettings {
  requestLeave: boolean;
  requestAttendance: boolean;
  requestPermission: boolean;
  requestOnDuty: boolean;
  requestWeeklyOff: boolean;
  requestFaceTemplate: boolean;
  requestLoan: boolean;
  requestAdvance: boolean;
}

const DEFAULT_REQUEST_SETTINGS: ESSRequestSettings = {
  requestLeave: true,
  requestAttendance: true,
  requestPermission: true,
  requestOnDuty: true,
  requestWeeklyOff: true,
  requestFaceTemplate: true,
  requestLoan: true,
  requestAdvance: true,
};

export const useEssRequestSettings = () => {
  const [settings, setSettings] =
    useState<ESSRequestSettings>(
      DEFAULT_REQUEST_SETTINGS
    );

  const updateSetting = <
    K extends keyof ESSRequestSettings
  >(
    key: K,
    value: ESSRequestSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateSettings = (
    values: Partial<ESSRequestSettings>
  ) => {
    setSettings((previous) => ({
      ...previous,
      ...values,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_REQUEST_SETTINGS);
  };

  return {
    settings,
    setSettings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
};

export default useEssRequestSettings;