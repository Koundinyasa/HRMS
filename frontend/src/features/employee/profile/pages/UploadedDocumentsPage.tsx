import ProfileTable from "../components/ProfileTable";
import { useProfile } from "../hooks/useProfile";

export default function UploadedDocumentsPage() {
  const {
    profileInfo,
    isLoading,
    isError,
  } = useProfile();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load documents.
      </div>
    );
  }

  const documentsSection = profileInfo?.sections.find(
    (section) => section.title === "Documents"
  );

  if (!documentsSection) {
    return (
      <div className="p-6">
        No Documents Found.
      </div>
    );
  }

  return <ProfileTable section={documentsSection} />;
}