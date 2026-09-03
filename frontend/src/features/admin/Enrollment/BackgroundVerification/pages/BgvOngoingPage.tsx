import { useParams, NavLink } from "react-router-dom";
import { useState } from "react";
import BgvOngoingTable from "../components/BgvOngoingTable";
import { BGV_TABS, BGV_SECTION_PATH } from "../constants/backgroundverification.constants";
import { useBackgroundVerification } from "../hooks/useBackgroundVerification";
import type { BgvOverallStatus } from "../types/backgroundverification.types";

export default function BgvOngoingPage() {
  const { domain } = useParams();
  const {
    ongoingCandidates,
    selectedCandidateIds,
    toggleCandidateId,
    clearSelection,
    assignVerifierToCandidates,
    updateOngoingBgv,
  } = useBackgroundVerification();

  const [externalVerifier, setExternalVerifier] = useState("");
  const [activities, setActivities] = useState("");

  const basePath = `/${domain}/admin/${BGV_SECTION_PATH}`;
  const candidates = ongoingCandidates.data ?? [];

  const handleSend = async () => {
    await assignVerifierToCandidates({
      candidateIds: selectedCandidateIds,
      externalVerifier,
      activities,
    }).unwrap();
    clearSelection();
    setExternalVerifier("");
    setActivities("");
  };

  const handleOverallStatusChange = (candidateId: string, status: BgvOverallStatus) => {
    updateOngoingBgv({ candidateId, data: { overallStatus: status } });
  };

  const handleSendMail = (candidateId: string, verificationType: string) => {
    const candidate = candidates.find((c) => c.candidateId === candidateId);
    if (!candidate) return;
    const verifications = candidate.verifications.map((v) =>
      v.verificationType === verificationType ? { ...v, status: "pending" as const } : v
    );
    updateOngoingBgv({ candidateId, data: { verifications } });
  };

  const handleEditVerification = (candidateId: string, verificationType: string) => {
    window.alert(`Edit ${verificationType} for ${candidateId}`);
  };

  const handleDeleteVerification = (candidateId: string, verificationType: string) => {
    const candidate = candidates.find((c) => c.candidateId === candidateId);
    if (!candidate) return;
    const verifications = candidate.verifications.filter((v) => v.verificationType !== verificationType);
    updateOngoingBgv({ candidateId, data: { verifications } });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-500 rounded-xl p-2 w-max min-w-full sm:w-fit">
          {BGV_TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={`${basePath}/${tab.path}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors ${
                  isActive
                    ? "bg-white border-orange-500 text-orange-600 shadow-sm"
                    : "bg-white/70 border-transparent text-slate-600 hover:bg-white"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
      <BgvOngoingTable
        candidates={candidates}
        externalVerifier={externalVerifier}
        onExternalVerifierChange={setExternalVerifier}
        activities={activities}
        onActivitiesChange={setActivities}
        selectedIds={selectedCandidateIds}
        onToggleId={toggleCandidateId}
        onSend={handleSend}
        onOverallStatusChange={handleOverallStatusChange}
        onSendMail={handleSendMail}
        onEditVerification={handleEditVerification}
        onDeleteVerification={handleDeleteVerification}
      />
    </div>
  );
}