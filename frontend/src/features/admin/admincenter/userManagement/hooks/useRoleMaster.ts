// useRoleMaster.ts

import { useState } from "react";
import { saveUser } from "../api/userManagementApi";
import { ROLE_MASTER_TABS } from "../constants/userManagementConstants";
import type { RoleMasterTab } from "../types/role.types";
import type { AddUserPayload } from "../types/user.types";

const EMPTY_USER_FORM: AddUserPayload = {
  userName: "",
  email: "",
  mobile: "",
  payrollRole: "",
  active: true,
};

export const useRoleMaster = () => {
  const [activeTab, setActiveTab] = useState<RoleMasterTab>("Roles");
  const [search, setSearch] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [userForm, setUserForm] = useState<AddUserPayload>(EMPTY_USER_FORM);

  const openAddUser = () => setShowAddUser(true);
  const closeAddUser = () => {
    setShowAddUser(false);
    setUserForm(EMPTY_USER_FORM);
  };

  const updateUserForm = (field: keyof AddUserPayload, value: string | boolean) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddButtonClick = () => {
    if (activeTab === "User") {
      openAddUser();
    }
  };

  const handleSaveUser = async () => {
    await saveUser(userForm);
    closeAddUser();
  };

  return {
    tabs: ROLE_MASTER_TABS,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    showAddUser,
    userForm,
    updateUserForm,
    handleAddButtonClick,
    handleSaveUser,
    closeAddUser,
  };
};
