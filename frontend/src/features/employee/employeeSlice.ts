import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface EmployeeState {
  companyName: string;
  fullName: string;
  shortName: string;
  email: string;
  employeeId: string;
  designation: string;
  department: string;
  lastLoginDateTime: string;
}

const initialState: EmployeeState = {
  companyName: "",
  fullName: "",
  shortName: "",
  email: "",
  employeeId: "",
  designation: "",
  department: "",
  lastLoginDateTime: "",
};

const employeeSlice = createSlice({
  name: "employee",

  initialState,

  reducers: {
    setEmployeeProfile: (
      state,
      action: PayloadAction<EmployeeState>
    ) => {
      state.companyName = action.payload.companyName;
      state.fullName = action.payload.fullName;
      state.shortName = action.payload.shortName;
      state.email = action.payload.email;
      state.employeeId = action.payload.employeeId;
      state.designation = action.payload.designation;
      state.department = action.payload.department;
      state.lastLoginDateTime = action.payload.lastLoginDateTime;
    },

    clearEmployeeProfile: (state) => {
      state.companyName = "";
      state.fullName = "";
      state.shortName = "";
      state.email = "";
      state.employeeId = "";
      state.designation = "";
      state.department = "";
      state.lastLoginDateTime = "";
    },
  },
});

export const {
  setEmployeeProfile,
  clearEmployeeProfile,
} = employeeSlice.actions;

export default employeeSlice.reducer;