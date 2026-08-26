import ProfileSection from "../components/ProfileSection";
import { useProfile } from "../hooks/useProfile";

export default function PersonalInformationPage() {
  const { profileInfo, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div
        className="
          flex
          w-full
          min-w-0
          items-center
          justify-center
          px-3
          py-6
          sm:px-4
          sm:py-10
        "
      >
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
          flex
          w-full
          min-w-0
          items-center
          justify-center
          px-3
          py-6
          text-center
          text-red-500
          sm:px-4
          sm:py-10
        "
      >
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
    <div
      className="
        w-full
        min-w-0
        max-w-full
        overflow-x-hidden
        space-y-5
        sm:space-y-6
        lg:space-y-8
      "
    >
      {personalSection && (
        <ProfileSection section={personalSection} />
      )}

      {addressSection && (
        <ProfileSection section={addressSection} />
      )}
    </div>
  );
}