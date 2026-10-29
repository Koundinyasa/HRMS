import { useState } from "react";

export interface ESSReviewSettings {
  pendingRequests: boolean;
  pendingLeave: boolean;
  pendingAttendance: boolean;
  pendingPermission: boolean;
  pendingWeeklyOff: boolean;
  pendingOnDuty: boolean;
  completedRequests: boolean;
}

const DEFAULT_REVIEW_SETTINGS: ESSReviewSettings = {
  pendingRequests: true,
  pendingLeave: true,
  pendingAttendance: true,
  pendingPermission: true,
  pendingWeeklyOff: true,
  pendingOnDuty: true,
  completedRequests: true,
};

export const useEssReviewSettings = () => {
  const [settings, setSettings] =
    useState<ESSReviewSettings>(
      DEFAULT_REVIEW_SETTINGS
    );

  const updateSetting = <
    K extends keyof ESSReviewSettings
  >(
    key: K,
    value: ESSReviewSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateSettings = (
    values: Partial<ESSReviewSettings>
  ) => {
    setSettings((previous) => ({
      ...previous,
      ...values,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_REVIEW_SETTINGS);
  };

  return {
    settings,
    setSettings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
};

export default useEssReviewSettings;