import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/rootReducer';
import type { BulkUpdateFilters, BulkUpdateTab } from './types/bulkUpdate.types';
import { CLASSIFICATION_FIELD_OPTIONS, DEFAULT_BULK_UPDATE_MONTH } from './constants/bulkUpdate.constants';

interface BulkUpdateState {
    activeTab: BulkUpdateTab;
    selectedEmployeeIds: string[];
    filters: BulkUpdateFilters;
    selectedStatutories: string[];
    applicable: boolean | null;
    classificationField: string;
    classificationMonth: string;
}

const initialState: BulkUpdateState = {
    activeTab: 'statutory',
    selectedEmployeeIds: [],
    filters: {},
    selectedStatutories: [],
    applicable: null,
    classificationField: CLASSIFICATION_FIELD_OPTIONS[0]?.value ?? 'classification',
    classificationMonth: DEFAULT_BULK_UPDATE_MONTH,
};

const bulkUpdateSlice = createSlice({
    name: 'bulkUpdate',
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<BulkUpdateTab>) => {
            state.activeTab = action.payload;
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
        setFilters: (state, action: PayloadAction<BulkUpdateFilters>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = {};
        },
        setSelectedStatutories: (state, action: PayloadAction<string[]>) => {
            state.selectedStatutories = action.payload;
        },
        setApplicable: (state, action: PayloadAction<boolean | null>) => {
            state.applicable = action.payload;
        },
        setClassificationField: (state, action: PayloadAction<string>) => {
            state.classificationField = action.payload;
        },
        setClassificationMonth: (state, action: PayloadAction<string>) => {
            state.classificationMonth = action.payload;
        },
    },
});

export const {
    setActiveTab,
    setSelectedEmployeeIds,
    toggleSelectedEmployeeId,
    clearSelectedEmployeeIds,
    setFilters,
    resetFilters,
    setSelectedStatutories,
    setApplicable,
    setClassificationField,
    setClassificationMonth,
} = bulkUpdateSlice.actions;

export const selectBulkUpdateActiveTab = (state: RootState) => state.admin.enrollment.bulkUpdate.activeTab;
export const selectBulkUpdateSelectedEmployeeIds = (state: RootState) => state.admin.enrollment.bulkUpdate.selectedEmployeeIds;
export const selectBulkUpdateFilters = (state: RootState) => state.admin.enrollment.bulkUpdate.filters;
export const selectBulkUpdateSelectedStatutories = (state: RootState) => state.admin.enrollment.bulkUpdate.selectedStatutories;
export const selectBulkUpdateApplicable = (state: RootState) => state.admin.enrollment.bulkUpdate.applicable;
export const selectBulkUpdateClassificationField = (state: RootState) => state.admin.enrollment.bulkUpdate.classificationField;
export const selectBulkUpdateClassificationMonth = (state: RootState) => state.admin.enrollment.bulkUpdate.classificationMonth;

export default bulkUpdateSlice.reducer;