import ProfileTable from "../components/ProfileTable";
import { useProfile } from "../hooks/useProfile";
import type { ProfileSection } from "../types/profile.types";

// Columns that are not shown for now:
// - "File Path" is the folder on the server where the file is stored.
//   The View / Download buttons use the "Actions" link, which the server only
//   serves for the logged-in employee's own documents.
const HIDDEN_DOCUMENT_FIELDS = ["File Path"];

export default function UploadedDocumentsPage() {
  const {
    profileInfo,
    isLoading,
    isError,
  } = useProfile();

  if (isLoading) {
    return (
      <div className="w-full min-w-0 px-3 py-6 sm:px-4 sm:py-10">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-w-0 px-3 py-6 text-center text-red-500 sm:px-4 sm:py-10">
        Failed to load documents.
      </div>
    );
  }

  const documentsSection = profileInfo?.sections.find(
    (section) => section.title === "Documents"
  );

  if (!documentsSection) {
    return (
      <div className="w-full min-w-0 px-3 py-6 sm:px-4 sm:py-10">
        No Documents Found.
      </div>
    );
  }

  const visibleDocumentsSection: ProfileSection = {
    ...documentsSection,
    records: (documentsSection.records ?? []).map((record) => ({
      ...record,
      fields: record.fields.filter(
        (field) => !HIDDEN_DOCUMENT_FIELDS.includes(field.label)
      ),
    })),
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <ProfileTable section={visibleDocumentsSection} />
    </div>
  );
}
