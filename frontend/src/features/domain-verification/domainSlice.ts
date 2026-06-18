import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface DomainState {
  domain: string;
}

const initialState: DomainState = {
  domain: "",
};

const domainSlice = createSlice({
  name: "domain",

  initialState,

  reducers: {
    setDomain: (
      state,
      action: PayloadAction<string>
    ) => {
      state.domain = action.payload;
    },
  },
});

export const { setDomain } =
  domainSlice.actions;

export default domainSlice.reducer;