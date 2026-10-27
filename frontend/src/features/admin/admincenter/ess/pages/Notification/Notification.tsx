import EssConfirmDialog from "../../components/EssConfirmDialog";
import { useNotification } from "../../hooks/useNotification";
import NotificationList from "./NotificationList";
import NotificationForm from "./NotificationForm";

export default function Notification() {
  const n = useNotification();

  return (
    <div className="relative">
      <NotificationList
        activeTab={n.activeTab}
        setActiveTab={n.setActiveTab}
        rows={n.rows}
        currentCount={n.currentCount}
        previousCount={n.previousCount}
        dropdowns={n.dropdowns}
        isLoading={n.isListLoading}
        isError={n.isListError}
        onRetry={() => n.refetch()}
        onAdd={() => n.handleOpenModal()}
        onEdit={n.handleOpenModal}
        onDelete={n.handleDelete}
      />

      {n.isModalOpen && <NotificationForm {...n} />}


      <EssConfirmDialog
        open={Boolean(n.pendingDelete)}
        title="Confirm delete"
        message={
          n.pendingDelete
            ? `Are you sure you want to delete "${n.pendingDelete.label}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={n.isDeleting}
        onConfirm={n.confirmDelete}
        onCancel={n.cancelDelete}
      />
    </div>
  );
}