import { useState } from "react";
import type { ESSSettings } from "../types/essTypes";

const DEFAULT_ESS_SETTINGS: ESSSettings = {
  enabled: true,
  employeeSelfService: true,
  effectiveFrom: "",
  modules: {
    request: true,
    profile: true,
    misc: true,
    report: true,
    review: true,
    dashboard: true,
  },
};

export const useEssSettings = () => {
  const [settings, setSettings] =
    useState<ESSSettings>(DEFAULT_ESS_SETTINGS);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSetting = <K extends keyof ESSSettings>(
    key: K,
    value: ESSSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateModule = (
    module: keyof ESSSettings["modules"],
    value: boolean
  ) => {
    setSettings((previous) => ({
      ...previous,
      modules: {
        ...previous.modules,
        [module]: value,
      },
    }));
  };

  const updateModules = (
    modules: Partial<ESSSettings["modules"]>
  ) => {
    setSettings((previous) => ({
      ...previous,
      modules: {
        ...previous.modules,
        ...modules,
      },
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_ESS_SETTINGS);
    setError(null);
  };

  return {
    settings,
    setSettings,
    loading,
    setLoading,
    error,
    setError,
    updateSetting,
    updateModule,
    updateModules,
    resetSettings,
  };
};

export default useEssSettings;