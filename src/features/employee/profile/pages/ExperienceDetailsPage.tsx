import ProfileTable from "../components/ProfileTable";
import { useProfile } from "../hooks/useProfile";

export default function ExperienceDetailsPage() {
  const {
    profileInfo,
    isLoading,
    isError,
  } = useProfile();

  if (isLoading) {
    return <div className="p-4 sm:p-6 text-slate-500">
        Loading experience details...
      </div>
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 text-red-500">
        Failed to load experience details.
      </div>
    );
  }

  const experienceSection = profileInfo?.sections.find(
    (section) => section.title === "Experience"
  );

  if (!experienceSection) {
    return (
      <div className="p-4 sm:p-6 text-slate-500">
        No Experience Details Found.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      {/* Prevents table from causing horizontal scroll on small screens */}
      <ProfileTable section={experienceSection} />
    </div>
  );
}