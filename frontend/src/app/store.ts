import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { baseApi } from "./baseApi";

export const store = configureStore({
  reducer: {
    ...rootReducer,
    [baseApi.reducerPath]:
      baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware
    ),
});

export type AppDispatch =
  typeof store.dispatch;