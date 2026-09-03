import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  activeTab: string;
}

const initialState: ProfileState = {
  activeTab: "personal",
};

const profileSlice = createSlice({
  name: "profile",

  initialState,

  reducers: {
    setActiveTab: (
      state,
      action: PayloadAction<string>
    ) => {
      state.activeTab = action.payload;
    },

    clearActiveTab: (state) => {
      state.activeTab = "personal";
    },
  },
});

export const {
  setActiveTab,
  clearActiveTab,
} = profileSlice.actions;

export default profileSlice.reducer;