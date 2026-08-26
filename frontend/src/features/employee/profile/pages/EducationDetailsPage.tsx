import ProfileTable from "../components/ProfileTable";
import { useProfile } from "../hooks/useProfile";

export default function EducationDetailsPage() {
  const {
    profileInfo,
    isLoading,
    isError,
  } = useProfile();

  if (isLoading) {
    return <div className="p-4 sm:p-6 text-slate-500">
        {/* Responsive padding: smaller on mobile, larger on desktop */}
        Loading education details...
      </div>
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 text-red-500">
        Failed to load education details.
      </div>
    );
  }

  const educationSection = profileInfo?.sections.find(
    (section) => section.title === "Education"
  );

  if (!educationSection) {
    return (
     <div className="p-4 sm:p-6 text-slate-500">
        No Education Details Found.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
    
      <ProfileTable section={educationSection} />
    </div>
  );
}