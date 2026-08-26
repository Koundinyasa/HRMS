import ProfileTable from "../components/ProfileTable";
import { useProfile } from "../hooks/useProfile";

export default function UploadedDocumentsPage() {
  const {
    profileInfo,
    isLoading,
    isError,
  } = useProfile();

  if (isLoading) {
    return <div className="w-full min-w-0 px-3 py-6 sm:px-4 sm:py-10">
        Loading...
      </div>
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

   return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <ProfileTable section={documentsSection} />
    </div>
  );
}