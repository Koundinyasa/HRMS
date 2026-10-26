import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Scaffold — no real feature state defined yet for separation. Add real fields
// here as the module is built out.
interface SeparationState {
  activeTab: string;
}

const initialState: SeparationState = {
  activeTab: '',
};

const separationSlice = createSlice({
  name: 'separation',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = separationSlice.actions;
export default separationSlice.reducer;