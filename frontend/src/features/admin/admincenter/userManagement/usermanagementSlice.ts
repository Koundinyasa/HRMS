import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
 
// Scaffold — no real feature state defined yet for userManagement. Add real fields
// here as the module is built out.
interface UserManagementState {
  activeTab: string;
}
 
const initialState: UserManagementState = {
  activeTab: '',
};
 
const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});
 
export const { setActiveTab } = userManagementSlice.actions;
export default userManagementSlice.reducer;
 