import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/rootReducer';
import type {
    PunchFilters,
    PunchProcessTab,
    RegularizationTab,
    TimeOfficeSection,
} from './types/timeoffice.types';
 
interface TimeOfficeState {
    activeSection: TimeOfficeSection;
    punchProcessTab: PunchProcessTab;
    regularizationTab: RegularizationTab;
    selectedEmployeeIds: string[];
    punchProcessFilters: PunchFilters;
    regularizationFilters: PunchFilters;
}
 
const initialState: TimeOfficeState = {
    activeSection: 'punch-process',
    punchProcessTab: 'dashboard',
    regularizationTab: 'punch',
    selectedEmployeeIds: [],
    punchProcessFilters: {},
    regularizationFilters: {},
};
 
const timeofficeSlice = createSlice({
    name: 'timeOffice',
    initialState,
    reducers: {
        setActiveSection: (state, action: PayloadAction<TimeOfficeSection>) => {
            state.activeSection = action.payload;
        },
        setPunchProcessTab: (state, action: PayloadAction<PunchProcessTab>) => {
            state.punchProcessTab = action.payload;
        },
        setRegularizationTab: (state, action: PayloadAction<RegularizationTab>) => {
            state.regularizationTab = action.payload;
        },
        setSelectedEmployeeIds: (state, action: PayloadAction<string[]>) => {
            state.selectedEmployeeIds = action.payload;
        },
        toggleSelectedEmployeeId: (state, action: PayloadAction<string>) => {
            const idx = state.selectedEmployeeIds.indexOf(action.payload);
            if (idx === -1) {
                state.selectedEmployeeIds.push(action.payload);
            } else {
                state.selectedEmployeeIds.splice(idx, 1);
            }
        },
        clearSelectedEmployeeIds: (state) => {
            state.selectedEmployeeIds = [];
        },
        setPunchProcessFilters: (state, action: PayloadAction<PunchFilters>) => {
            state.punchProcessFilters = { ...state.punchProcessFilters, ...action.payload };
        },
        resetPunchProcessFilters: (state) => {
            state.punchProcessFilters = {};
        },
        setRegularizationFilters: (state, action: PayloadAction<PunchFilters>) => {
            state.regularizationFilters = { ...state.regularizationFilters, ...action.payload };
        },
        resetRegularizationFilters: (state) => {
            state.regularizationFilters = {};
        },
    },
});
 
export const {
    setActiveSection,
    setPunchProcessTab,
    setRegularizationTab,
    setSelectedEmployeeIds,
    toggleSelectedEmployeeId,
    clearSelectedEmployeeIds,
    setPunchProcessFilters,
    resetPunchProcessFilters,
    setRegularizationFilters,
    resetRegularizationFilters,
} = timeofficeSlice.actions;
 
export const selectTimeOfficeActiveSection = (state: RootState) => state.timeOffice.activeSection;
export const selectTimeOfficePunchProcessTab = (state: RootState) => state.timeOffice.punchProcessTab;
export const selectTimeOfficeRegularizationTab = (state: RootState) => state.timeOffice.regularizationTab;
export const selectTimeOfficeSelectedEmployeeIds = (state: RootState) => state.timeOffice.selectedEmployeeIds;
export const selectTimeOfficePunchProcessFilters = (state: RootState) => state.timeOffice.punchProcessFilters;
export const selectTimeOfficeRegularizationFilters = (state: RootState) => state.timeOffice.regularizationFilters;
 
export default timeofficeSlice.reducer;