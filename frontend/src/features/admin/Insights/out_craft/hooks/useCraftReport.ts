import { useState } from "react";
import { CRAFT_REPORT_TABS } from "../constants/craftReport.constants";
import type { CraftReportTemplate } from "../types/craftReport.types";

export function useCraftReport() {
  const [activeTab, setActiveTab] = useState(CRAFT_REPORT_TABS[0].value);

  const [isStoreModalOpen, setStoreModalOpen] = useState(false);
  const [isCreateFileModalOpen, setCreateFileModalOpen] = useState(false);
  const [isPermissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [isAuditLogModalOpen, setAuditLogModalOpen] = useState(false);

  const [templates] = useState<CraftReportTemplate[]>([]);

  const openStoreModal = () => setStoreModalOpen(true);
  const closeStoreModal = () => setStoreModalOpen(false);

  const openCreateFileModal = () => setCreateFileModalOpen(true);
  const closeCreateFileModal = () => setCreateFileModalOpen(false);

  const openPermissionsModal = () => setPermissionsModalOpen(true);
  const closePermissionsModal = () => setPermissionsModalOpen(false);

  const openAuditLogModal = () => setAuditLogModalOpen(true);
  const closeAuditLogModal = () => setAuditLogModalOpen(false);

  return {
    activeTab,
    setActiveTab,

    isStoreModalOpen,
    openStoreModal,
    closeStoreModal,

    isCreateFileModalOpen,
    openCreateFileModal,
    closeCreateFileModal,

    isPermissionsModalOpen,
    openPermissionsModal,
    closePermissionsModal,

    isAuditLogModalOpen,
    openAuditLogModal,
    closeAuditLogModal,

    templates,
  };
}