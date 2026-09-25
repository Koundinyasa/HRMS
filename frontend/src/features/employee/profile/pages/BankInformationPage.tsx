import ProfileTable from "../components/ProfileTable";

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

  if (!bankSection || !bankSection.fields?.length) {
    return (
      <div className="flex min-h-[240px] -translate-y-16 items-center justify-center p-4 text-center text-slate-500 sm:p-6">
        No records found.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <ProfileTable section={bankSection} />
    </div>
  );
}