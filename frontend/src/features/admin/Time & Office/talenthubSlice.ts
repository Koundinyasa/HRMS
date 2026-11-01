import { combineReducers } from "@reduxjs/toolkit";
import timeOfficeReducer from "./TimeOffice/timeofficeSlice";

export const talentHubReducer = combineReducers({
  timeOffice: timeOfficeReducer,
});
