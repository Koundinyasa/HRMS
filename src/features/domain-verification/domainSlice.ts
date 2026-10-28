import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface DomainState {
  domain: string;
}

const initialState: DomainState = {
  // ✅ rehydrate from sessionStorage on page refresh/navigation
  domain: sessionStorage.getItem("hrms_domain") ?? "",
};

const domainSlice = createSlice({
  name: "domain",
  initialState,
  reducers: {
    setDomain: (state, action: PayloadAction<string>) => {
      state.domain = action.payload;
      // ✅ persist so it survives multi-step navigation
      sessionStorage.setItem("hrms_domain", action.payload);
    },
  },
});

export const { setDomain } = domainSlice.actions;
export default domainSlice.reducer;