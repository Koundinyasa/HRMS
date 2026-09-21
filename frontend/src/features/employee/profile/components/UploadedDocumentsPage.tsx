import ProfileTable from "../components/ProfileTable";
import { useProfile } from "../hooks/useProfile";
 
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
 
  const updatedDocumentsSection = {
    ...documentsSection,
 
    records: documentsSection.records.map((record, index) => {
      let filePath = "/documents/dummy_pan.pdf";
 
      if (index === 1) {
        filePath = "/documents/dummy_aadhaar.pdf";
      } else if (index === 2) {
        filePath = "/documents/dummy_certificate.pdf";
      }
 
      return {
        ...record,
 
        fields: record.fields.map((field) => {
          // Replace File Path
          if (field.label === "File Path") {
            return {
              ...field,
              value: filePath,
            };
          }
 
          // Replace Actions
          if (field.label === "Actions") {
            return {
              ...field,
              value: {
                view: true,
                download: true,
                filePath: filePath,
              },
            };
          }
 
          return field;
        }),
      };
    }),
  };
 
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <ProfileTable section={updatedDocumentsSection} />
    </div>
  );
}