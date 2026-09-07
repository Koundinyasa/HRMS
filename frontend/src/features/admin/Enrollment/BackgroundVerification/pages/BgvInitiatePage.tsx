import { useParams, NavLink } from "react-router-dom";
import BgvInitiateTable from "../components/BgvInitiateTable";
import { BGV_TABS, BGV_SECTION_PATH } from "../constants/backgroundverification.constants";
import { useBackgroundVerification } from "../hooks/useBackgroundVerification";

export default function BgvInitiatePage() {
  const { domain } = useParams();
  const {
    initiateCandidates,
    initiateFilters,
    updateInitiateFilters,
    selectedCandidateIds,
    toggleCandidateId,
    clearSelection,
    initiateBgv,
    initiateBgvState,
  } = useBackgroundVerification();

  const basePath = `/${domain}/admin/${BGV_SECTION_PATH}`;

  const handleInitiate = async () => {
    await initiateBgv({ candidateIds: selectedCandidateIds }).unwrap();
    clearSelection();
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
      <BgvInitiateTable
        candidates={initiateCandidates.data ?? []}
        filters={initiateFilters}
        onFiltersChange={updateInitiateFilters}
        selectedIds={selectedCandidateIds}
        onToggleId={toggleCandidateId}
        onInitiate={handleInitiate}
        isInitiating={initiateBgvState.isLoading}
      />
    </div>
  );
}