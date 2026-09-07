import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
 

interface SettingsState {
  activeTab: string;
}
 
const initialState: SettingsState = {
  activeTab: '',
};
 
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});
 
export const { setActiveTab } = settingsSlice.actions;
export default settingsSlice.reducer;