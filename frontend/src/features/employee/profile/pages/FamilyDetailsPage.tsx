import ProfileTable from "../components/ProfileTable";
import { useProfile } from "../hooks/useProfile";

export default function FamilyDetailsPage() {
  const { profileInfo, isLoading, isError } = useProfile();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load family details.
      </div>
    );
  }

  const familySection = profileInfo?.sections.find(
    (section) => section.title === "Family Details"
  );

  if (!familySection) {
    return <div className="p-6">No Family Details Found.</div>;
  }

  return <ProfileTable section={familySection} />;
}