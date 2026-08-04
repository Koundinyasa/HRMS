import ProfileSection from "../components/ProfileSection";
import { useProfile } from "../hooks/useProfile";

export default function PersonalInformationPage() {
  const { profileInfo, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Failed to load profile information.
      </div>
    );
  }

  const personalSection = profileInfo?.sections.find(
    (section) => section.title === "Personal Information"
  );

  const addressSection = profileInfo?.sections.find(
    (section) => section.title === "Address"
  );

  return (
    <div className="space-y-8">
      {personalSection && (
        <ProfileSection section={personalSection} />
      )}

      {addressSection && (
        <ProfileSection section={addressSection} />
      )}
    </div>
  );
}