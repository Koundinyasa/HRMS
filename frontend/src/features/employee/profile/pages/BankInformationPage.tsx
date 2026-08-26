import ProfileSection from "../components/ProfileSection";

import { useProfile } from "../hooks/useProfile";

export default function BankInformationPage() {
  const { profileInfo, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 text-slate-500">
        Loading bank information...
      </div>
    );
  }

  if (isError || !profileInfo) {
    return (
      <div className="p-4 sm:p-6 text-red-500">
        Failed to load bank information.
      </div>
    );
  }

  const bankSection = profileInfo.sections.find(
    (section) => section.title === "Bank Details"
  );

  if (!bankSection) {
    return (
      <div className="p-4 sm:p-6 text-slate-500">
        No bank information available.
      </div>
    );
  }

 return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-6">
      
      <ProfileSection section={bankSection} />
    </div>
  );
}