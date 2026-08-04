import ProfileTable from "../components/ProfileTable";
import { useProfile } from "../hooks/useProfile";

export default function ExperienceDetailsPage() {
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
        Failed to load experience details.
      </div>
    );
  }

  const experienceSection = profileInfo?.sections.find(
    (section) => section.title === "Experience"
  );

  if (!experienceSection) {
    return (
      <div className="p-6">
        No Experience Details Found.
      </div>
    );
  }

  return <ProfileTable section={experienceSection} />;
}