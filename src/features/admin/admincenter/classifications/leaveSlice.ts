import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/rootReducer';

interface LeaveState {
    // Drives balance / summary / history — every tab refetches when this changes.
    selectedEmployeeId: string | null;
}

const initialState: LeaveState = {
    selectedEmployeeId: null,
};

const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
        setSelectedEmployeeId: (state, action: PayloadAction<string | null>) => {
            state.selectedEmployeeId = action.payload;
        },
    },
});

export const { setSelectedEmployeeId } = leaveSlice.actions;

export const selectSelectedEmployeeId = (state: RootState) => state.leave.selectedEmployeeId;

export default leaveSlice.reducer;
