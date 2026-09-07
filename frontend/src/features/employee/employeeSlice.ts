import {
  combineReducers,
  createSlice,
} from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import profileReducer from "./profile/profileSlice";
import assetReducer from "./asset/assetSlice";
import separationReducer from "./separation/separationSlice";
import helpDeskReducer from "./helpdesk/helpDeskSlice";

interface EmployeeState {
  companyName: string;
  fullName: string;
  shortName: string;
  email: string;
  employeeId: string;
  designation: string;
  department: string;
  lastLoginDateTime: string;
  isPageLoading: boolean;
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
  isPageLoading: false,
};

/*
 * Employee information slice
 *
 * This contains the existing employee information
 * functionality.
 */
const employeeInfoSlice = createSlice({
  name: "employeeInfo",

  initialState,

  reducers: {
    setEmployeeProfile: (
      state,
      action: PayloadAction<
        Omit<EmployeeState, "isPageLoading">
      >
    ) => {
      state.companyName =
        action.payload.companyName;

      state.fullName =
        action.payload.fullName;

      state.shortName =
        action.payload.shortName;

      state.email =
        action.payload.email;

      state.employeeId =
        action.payload.employeeId;

      state.designation =
        action.payload.designation;

      state.department =
        action.payload.department;

      state.lastLoginDateTime =
        action.payload.lastLoginDateTime;
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

    showPageLoader: (state) => {
      state.isPageLoading = true;
    },

    hidePageLoader: (state) => {
      state.isPageLoading = false;
    },
  },
});

/*
 * Existing employee actions
 *
 * These exports remain the same, so existing
 * dispatch calls will continue to work.
 */
export const {
  setEmployeeProfile,
  clearEmployeeProfile,
  showPageLoader,
  hidePageLoader,
} = employeeInfoSlice.actions;

/*
 * Employee parent reducer
 *
 * All Employee module reducers are registered here.
 */
const employeeReducer = combineReducers({
  employeeInfo: employeeInfoSlice.reducer,

  profile: profileReducer,

  asset: assetReducer,

  separation: separationReducer,

  helpDesk: helpDeskReducer,
});

export default employeeReducer;
