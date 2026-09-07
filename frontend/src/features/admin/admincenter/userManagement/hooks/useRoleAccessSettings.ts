// useRoleAccessSettings.ts

import { useState } from "react";
import { ROLE_LIST } from "../constants/userManagementConstants";

export const useRoleAccessSettings = () => {
  const [selectedRole, setSelectedRole] = useState(ROLE_LIST[0]);

  return {
    roleList: ROLE_LIST,
    selectedRole,
    setSelectedRole,
  };
};
