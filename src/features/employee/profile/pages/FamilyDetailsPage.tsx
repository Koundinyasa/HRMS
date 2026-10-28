import ProfileTable from "../components/ProfileTable";
import { useProfile } from "../hooks/useProfile";

export default function FamilyDetailsPage() {
  const { profileInfo, isLoading, isError } = useProfile();

  if (isLoading) {
    return <div
        className="
          w-full
          min-w-0
          px-3
          py-6
          sm:px-4
          sm:py-10
        "
      >Loading...</div>;
  }

  if (isError) {
    return (
      <div
        className="
          w-full
          min-w-0
          px-3
          py-6
          text-center
          text-red-500
          sm:px-4
          sm:py-10
        "
      >
        Failed to load family details.
      </div>
    );
  }

  const familySection = profileInfo?.sections.find(
    (section) => section.title === "Family Details"
  );

  if (!familySection) {
    return <div className="w-full min-w-0 max-w-full overflow-x-hidden">No Family Details Found.</div>;
  }

  return <ProfileTable section={familySection} />;
}