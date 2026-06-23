import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  primaryColor: string;
}

const savedTheme =
  localStorage.getItem("themeColor");

const initialState: ThemeState = {
  primaryColor:
    savedTheme || "#2563EB",
};

const themeSlice = createSlice({
  name: "theme",

  initialState,

  reducers: {
    setTheme: (
      state,
      action: PayloadAction<string>
    ) => {
      state.primaryColor =
        action.payload;

      localStorage.setItem(
        "themeColor",
        action.payload
      );
    },
  },
});

export const { setTheme } =
  themeSlice.actions;

export default themeSlice.reducer;