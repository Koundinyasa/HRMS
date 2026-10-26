import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SeparationState {
  requestedLastWorkingDate: string | null;
  reason: string;
  withdrawalReason: string;
}

const initialState: SeparationState = {
  requestedLastWorkingDate: null,
  reason: "",
  withdrawalReason: "",
};

const separationSlice = createSlice({
  name: "separation",
  initialState,
  reducers: {
    setRequestedLastWorkingDate: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.requestedLastWorkingDate = action.payload;
    },

    setReason: (
      state,
      action: PayloadAction<string>
    ) => {
      state.reason = action.payload;
    },

    setWithdrawalReason: (
      state,
      action: PayloadAction<string>
    ) => {
      state.withdrawalReason = action.payload;
    },

    clearRequestForm: (state) => {
      state.requestedLastWorkingDate = null;
      state.reason = "";
    },

    clearWithdrawForm: (state) => {
      state.withdrawalReason = "";
    },
  },
});

export const {
  setRequestedLastWorkingDate,
  setReason,
  setWithdrawalReason,
  clearRequestForm,
  clearWithdrawForm,
} = separationSlice.actions;

export default separationSlice.reducer;