import CraftReportHeader from "../components/CraftReportHeader";
import CraftReportTabs from "../components/CraftReportTabs";
import CraftReportContent from "../components/CraftReportContent";
import StoreTemplateModal from "../components/StoreTemplateModal";
import CreateNewFileModal from "../components/CreateNewFileModal";
import PdfProtectionModal from "../components/PdfProtectionModal";
import AuditLogModal from "../components/AuditLogModal";

import { useCraftReport } from "../hooks/useCraftReport";
import type { CreateNewFilePayload } from "../types/craftReport.types";

export default function CraftReportPage() {
  const {
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
  } = useCraftReport();

  const handleSaveTemplateCategories = (categories: string[]) => {
    console.log("Selected categories:", categories);
    closeStoreModal();
  };

  const handleCreateNewFile = (payload: CreateNewFilePayload) => {
    console.log("New file payload:", payload);
    closeCreateFileModal();
  };

  const handleSavePermissions = (isPasswordProtected: boolean) => {
    console.log("PDF password protection enabled:", isPasswordProtected);
    closePermissionsModal();
  };

  return (
    <div className="w-full bg-[#F5F6F8] p-4">
      <CraftReportHeader
        onDownloadTemplate={openStoreModal}
        onAddFile={openCreateFileModal}
        onOpenPermissions={openPermissionsModal}
        onOpenHistory={openAuditLogModal}
      />

      <div className="overflow-hidden rounded-md border border-slate-200 bg-[#f8f9fc] shadow-sm">
        <CraftReportTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <CraftReportContent activeTab={activeTab} />
      </div>

      {isStoreModalOpen && (
        <StoreTemplateModal
          onClose={closeStoreModal}
          onSave={handleSaveTemplateCategories}
        />
      )}

      {isCreateFileModalOpen && (
        <CreateNewFileModal
          onClose={closeCreateFileModal}
          onSave={handleCreateNewFile}
        />
      )}

      {isPermissionsModalOpen && (
        <PdfProtectionModal
          onClose={closePermissionsModal}
          onSave={handleSavePermissions}
        />
      )}

      {isAuditLogModalOpen && (
        <AuditLogModal onClose={closeAuditLogModal} entries={[]} />
      )}
    </div>
  );
}