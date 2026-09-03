import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Scaffold — no real feature state defined yet for employeeDetails. Add real fields
// here as the module is built out.
interface EmployeeDetailsState {
  activeTab: string;
}

const initialState: EmployeeDetailsState = {
  activeTab: '',
};

const employeeDetailsSlice = createSlice({
  name: 'employeeDetails',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = employeeDetailsSlice.actions;
export default employeeDetailsSlice.reducer;