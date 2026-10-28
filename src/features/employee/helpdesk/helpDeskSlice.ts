import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  HelpDeskState,
} from "./types/helpDesk.types";

const initialState: HelpDeskState = {
  departmentId: null,
  categoryId: null,
  subCategoryId: null,
  assetNumber: "",
  location: "",
  contactNo: "",
  subject: "",
  description: "",
};

const helpDeskSlice = createSlice({
  name: "helpDesk",

  initialState,

  reducers: {
    setDepartmentId: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.departmentId = action.payload;

      // Reset dependent dropdowns
      state.categoryId = null;
      state.subCategoryId = null;
    },

    setCategoryId: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.categoryId = action.payload;

      // Reset dependent dropdown
      state.subCategoryId = null;
    },

    setSubCategoryId: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.subCategoryId = action.payload;
    },

    setAssetNumber: (
      state,
      action: PayloadAction<string>
    ) => {
      state.assetNumber = action.payload;
    },

    setLocation: (
      state,
      action: PayloadAction<string>
    ) => {
      state.location = action.payload;
    },

    setContactNo: (
      state,
      action: PayloadAction<string>
    ) => {
      state.contactNo = action.payload;
    },

    setSubject: (
      state,
      action: PayloadAction<string>
    ) => {
      state.subject = action.payload;
    },

    setDescription: (
      state,
      action: PayloadAction<string>
    ) => {
      state.description = action.payload;
    },

    clearTicketForm: (state) => {
      state.departmentId = null;
      state.categoryId = null;
      state.subCategoryId = null;
      state.assetNumber = "";
      state.location = "";
      state.contactNo = "";
      state.subject = "";
      state.description = "";
    },
  },
});

export const {
  setDepartmentId,
  setCategoryId,
  setSubCategoryId,
  setAssetNumber,
  setLocation,
  setContactNo,
  setSubject,
  setDescription,
  clearTicketForm,
} = helpDeskSlice.actions;

export default helpDeskSlice.reducer;