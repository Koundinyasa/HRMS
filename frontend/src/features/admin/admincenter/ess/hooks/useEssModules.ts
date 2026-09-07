import { useState } from "react";
import type { ESSModules } from "../types/essTypes";

const DEFAULT_ESS_MODULES: ESSModules = {
  request: true,
  profile: true,
  misc: true,
  report: true,
  review: true,
  dashboard: true,
};

export const useEssModules = () => {
  const [modules, setModules] =
    useState<ESSModules>(DEFAULT_ESS_MODULES);

  const updateModule = (
    module: keyof ESSModules,
    enabled: boolean
  ) => {
    setModules((previous) => ({
      ...previous,
      [module]: enabled,
    }));
  };

  const enableAllModules = () => {
    setModules({
      request: true,
      profile: true,
      misc: true,
      report: true,
      review: true,
      dashboard: true,
    });
  };

  const disableAllModules = () => {
    setModules({
      request: false,
      profile: false,
      misc: false,
      report: false,
      review: false,
      dashboard: false,
    });
  };

  const resetModules = () => {
    setModules(DEFAULT_ESS_MODULES);
  };

  return {
    modules,
    setModules,
    updateModule,
    enableAllModules,
    disableAllModules,
    resetModules,
  };
};

export default useEssModules;