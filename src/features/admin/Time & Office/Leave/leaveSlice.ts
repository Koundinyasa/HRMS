import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Scaffold — no real feature state defined yet for leave. Add real fields
// here as the module is built out.
interface LeaveState {
  activeTab: string;
}

const initialState: LeaveState = {
  activeTab: '',
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = leaveSlice.actions;
export default leaveSlice.reducer;