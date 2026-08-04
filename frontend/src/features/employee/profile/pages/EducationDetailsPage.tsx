import ProfileTable from "../components/ProfileTable";
import { useProfile } from "../hooks/useProfile";

export default function EducationDetailsPage() {
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
        Failed to load education details.
      </div>
    );
  }

  const educationSection = profileInfo?.sections.find(
    (section) => section.title === "Education"
  );

  if (!educationSection) {
    return (
      <div className="p-6">
        No Education Details Found.
      </div>
    );
  }

  return <ProfileTable section={educationSection} />;
}