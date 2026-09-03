import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/rootReducer';
import type { BgvInitiateFilters, BgvListFilters, BgvTab } from './types/backgroundverification.types';

interface BackgroundVerificationState {
    activeTab: BgvTab;
    selectedCandidateIds: string[];
    initiateFilters: BgvInitiateFilters;
    ongoingFilters: BgvListFilters;
    completedFilters: BgvListFilters;
}

const initialState: BackgroundVerificationState = {
    activeTab: 'dashboard',
    selectedCandidateIds: [],
    initiateFilters: {},
    ongoingFilters: {},
    completedFilters: {},
};

const backgroundverificationSlice = createSlice({
    name: 'backgroundVerification',
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<BgvTab>) => {
            state.activeTab = action.payload;
        },
        setSelectedCandidateIds: (state, action: PayloadAction<string[]>) => {
            state.selectedCandidateIds = action.payload;
        },
        toggleSelectedCandidateId: (state, action: PayloadAction<string>) => {
            const idx = state.selectedCandidateIds.indexOf(action.payload);
            if (idx === -1) {
                state.selectedCandidateIds.push(action.payload);
            } else {
                state.selectedCandidateIds.splice(idx, 1);
            }
        },
        clearSelectedCandidateIds: (state) => {
            state.selectedCandidateIds = [];
        },
        setInitiateFilters: (state, action: PayloadAction<BgvInitiateFilters>) => {
            state.initiateFilters = { ...state.initiateFilters, ...action.payload };
        },
        resetInitiateFilters: (state) => {
            state.initiateFilters = {};
        },
        setOngoingFilters: (state, action: PayloadAction<BgvListFilters>) => {
            state.ongoingFilters = { ...state.ongoingFilters, ...action.payload };
        },
        setCompletedFilters: (state, action: PayloadAction<BgvListFilters>) => {
            state.completedFilters = { ...state.completedFilters, ...action.payload };
        },
    },
});

export const {
    setActiveTab,
    setSelectedCandidateIds,
    toggleSelectedCandidateId,
    clearSelectedCandidateIds,
    setInitiateFilters,
    resetInitiateFilters,
    setOngoingFilters,
    setCompletedFilters,
} = backgroundverificationSlice.actions;

export const selectBgvActiveTab = (state: RootState) => state.admin.enrollment.backgroundVerification.activeTab;
export const selectBgvSelectedCandidateIds = (state: RootState) => state.admin.enrollment.backgroundVerification.selectedCandidateIds;
export const selectBgvInitiateFilters = (state: RootState) => state.admin.enrollment.backgroundVerification.initiateFilters;
export const selectBgvOngoingFilters = (state: RootState) => state.admin.enrollment.backgroundVerification.ongoingFilters;
export const selectBgvCompletedFilters = (state: RootState) => state.admin.enrollment.backgroundVerification.completedFilters;

export default backgroundverificationSlice.reducer;