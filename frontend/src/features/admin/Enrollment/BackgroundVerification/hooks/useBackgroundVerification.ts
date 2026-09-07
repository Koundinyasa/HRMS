import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {setActiveTab,setSelectedCandidateIds,toggleSelectedCandidateId,clearSelectedCandidateIds,setInitiateFilters,resetInitiateFilters,setOngoingFilters,
    setCompletedFilters,
    selectBgvActiveTab,
    selectBgvSelectedCandidateIds,
    selectBgvInitiateFilters,
    selectBgvOngoingFilters,
    selectBgvCompletedFilters,
} from '../backgroundverificationSlice';
import {
    useGetBgvDashboardQuery,
    useGetInitiateCandidatesQuery,
    useInitiateBgvMutation,
    useUpdateInitiateCandidateMutation,
    useGetOngoingBgvQuery,
    useUpdateOngoingBgvMutation,
    useAssignVerifierToCandidatesMutation,
    useGetCompletedBgvQuery,
    useGetBgvSettingsQuery,
    useUpdateBgvSettingsMutation,
} from '../api/backgroundverificationApi';
import type { BgvTab } from '../types/backgroundverification.types';

export const useBackgroundVerification = () => {
    const dispatch = useAppDispatch();

    const activeTab = useAppSelector(selectBgvActiveTab);
    const selectedCandidateIds = useAppSelector(selectBgvSelectedCandidateIds);
    const initiateFilters = useAppSelector(selectBgvInitiateFilters);
    const ongoingFilters = useAppSelector(selectBgvOngoingFilters);
    const completedFilters = useAppSelector(selectBgvCompletedFilters);

    const changeTab = (tab: BgvTab) => dispatch(setActiveTab(tab));
    const selectCandidateIds = (ids: string[]) => dispatch(setSelectedCandidateIds(ids));
    const toggleCandidateId = (id: string) => dispatch(toggleSelectedCandidateId(id));
    const clearSelection = () => dispatch(clearSelectedCandidateIds());
    const updateInitiateFilters = (next: typeof initiateFilters) => dispatch(setInitiateFilters(next));
    const clearInitiateFilters = () => dispatch(resetInitiateFilters());
    const updateOngoingFilters = (next: typeof ongoingFilters) => dispatch(setOngoingFilters(next));
    const updateCompletedFilters = (next: typeof completedFilters) => dispatch(setCompletedFilters(next));

    const dashboard = useGetBgvDashboardQuery();
    const initiateCandidates = useGetInitiateCandidatesQuery(initiateFilters);
    const ongoingCandidates = useGetOngoingBgvQuery(ongoingFilters);
    const completedCandidates = useGetCompletedBgvQuery(completedFilters);
    const settings = useGetBgvSettingsQuery();

    const [initiateBgv, initiateBgvState] = useInitiateBgvMutation();
    const [updateInitiateCandidate, updateInitiateCandidateState] = useUpdateInitiateCandidateMutation();
    const [updateOngoingBgv, updateOngoingBgvState] = useUpdateOngoingBgvMutation();
    const [assignVerifierToCandidates, assignVerifierState] = useAssignVerifierToCandidatesMutation();
    const [updateBgvSettings, updateBgvSettingsState] = useUpdateBgvSettingsMutation();

    return {
        activeTab,
        selectedCandidateIds,
        initiateFilters,
        ongoingFilters,
        completedFilters,
        changeTab,
        selectCandidateIds,
        toggleCandidateId,
        clearSelection,
        updateInitiateFilters,
        clearInitiateFilters,
        updateOngoingFilters,
        updateCompletedFilters,

        dashboard,
        initiateCandidates,
        ongoingCandidates,
        completedCandidates,
        settings,

        initiateBgv,
        initiateBgvState,
        updateInitiateCandidate,
        updateInitiateCandidateState,
        updateOngoingBgv,
        updateOngoingBgvState,
        assignVerifierToCandidates,
        assignVerifierState,
        updateBgvSettings,
        updateBgvSettingsState,
    };
};