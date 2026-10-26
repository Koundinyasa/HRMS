import { baseApi } from "@/app/baseApi";

// Response of GET /employee/attendance/location-check — the data behind
// the coordinates/distance panel in the punch modal. Kept in its own file
// (rather than inside attendanceApi.ts) so this development aid can be
// removed by deleting one file plus its two usages in FacePunchModal.tsx.
export interface LocationCheckResponse {
  enabled: boolean;
  // bearingDegrees: direction of the employee from the reference point
  // (0 = north, 90 = east) — it places the dot on the mini radar.
  office: {
    fenceId: number;
    distanceMeters: number;
    radiusMeters: number;
    bearingDegrees: number;
  } | null;
  wfh:
    | {
        status: "compared";
        distanceMeters: number;
        thresholdMeters: number;
        bearingDegrees: number;
      }
    | { status: "no-punch-in-today" }
    | { status: "first-punch-in-not-wfh" }
    | { status: "no-coordinates" }
    | null;
}

export const locationCheckApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocationCheck: builder.query<
      LocationCheckResponse,
      { latitude: number; longitude: number }
    >({
      query: ({ latitude, longitude }) => ({
        url: `/employee/attendance/location-check?latitude=${latitude}&longitude=${longitude}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGetLocationCheckQuery } = locationCheckApi;