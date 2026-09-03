import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AssetState {
  assetId: number | null;
  reason: string;
}

const initialState: AssetState = {
  assetId: null,
  reason: "",
};

const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    setAssetId: (state, action: PayloadAction<number | null>) => {
      state.assetId = action.payload;
    },
    setAssetReason: (state, action: PayloadAction<string>) => {
      state.reason = action.payload;
    },
    clearRequestForm: (state) => {
      state.assetId = null;
      state.reason = "";
    },
  },
});

export const { setAssetId, setAssetReason, clearRequestForm } = assetSlice.actions;

export default assetSlice.reducer;
