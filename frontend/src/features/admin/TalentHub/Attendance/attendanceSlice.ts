import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface AttendanceState {
  activeTab: string;
}

const initialState: AttendanceState = {
  activeTab: '',
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = attendanceSlice.actions;
export default attendanceSlice.reducer;