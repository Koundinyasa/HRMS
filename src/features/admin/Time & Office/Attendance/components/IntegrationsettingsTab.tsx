import {
  useGetDescriptionsQuery,
  useGetIntegrationsQuery,
  useGetApplicableAttendanceQuery,
  useGetLeaveAbbreviationsQuery,
  useGetCalculateOTQuery,
} from "../api/attendanceApi";

export default function IntegrationSettingsTab() {
  const descriptions = useGetDescriptionsQuery();
  const integrationTypes = useGetIntegrationsQuery();
  const applicableAttendance = useGetApplicableAttendanceQuery();
  const leaveAbbreviations = useGetLeaveAbbreviationsQuery();
  const calculateOT = useGetCalculateOTQuery();

  const isLoading =
    descriptions.isLoading ||
    integrationTypes.isLoading ||
    applicableAttendance.isLoading ||
    leaveAbbreviations.isLoading ||
    calculateOT.isLoading;

  // ⚠️ Scaffold — options load correctly from the API, but this doesn't
  // yet render the actual attendanceIntegrationSchema form fields
  // (url/userName/password/present/absent/etc). Build the form here.
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 text-sm text-slate-500">
      Integration settings form goes here — options loaded:{" "}
      {integrationTypes.data?.length ?? 0} integration types,{" "}
      {applicableAttendance.data?.length ?? 0} applicable attendance options.
    </div>
  );
}