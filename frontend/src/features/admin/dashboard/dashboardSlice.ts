import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  ageRangeFilter: 'all' | 'men' | 'women';
  salaryDetailsFilter: string;
}

const initialState: DashboardState = {
  ageRangeFilter: 'all',
  salaryDetailsFilter: '',
};

const admindashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setAgeRangeFilter: (
      state,
      action: PayloadAction<DashboardState['ageRangeFilter']>
    ) => {
      state.ageRangeFilter = action.payload;
    },
    setSalaryDetailsFilter: (state, action: PayloadAction<string>) => {
      state.salaryDetailsFilter = action.payload;
    },
  },
});

export const { setAgeRangeFilter, setSalaryDetailsFilter } = admindashboardSlice.actions;
export default admindashboardSlice.reducer;
