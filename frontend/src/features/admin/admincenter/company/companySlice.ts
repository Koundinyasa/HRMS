import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
 

interface CompanyState {
  activeTab: string;
} 
const initialState: CompanyState = {
  activeTab: '',
}; 
const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = companySlice.actions;
export default companySlice.reducer;