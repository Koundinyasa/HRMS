import {
  useGetPtDetailsQuery,
  useUpdatePtDetailsMutation,
  useGetPeriodTypesQuery,
} from "../api/companyApi";

export const usePtDetails = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetPtDetailsQuery();
  const [updatePt, { isLoading: isSaving }] = useUpdatePtDetailsMutation();
  const {
    data: periodTypeOptions = [],
    isLoading: isPeriodTypesLoading,
  } = useGetPeriodTypesQuery();

  return {
    ptSlabs: data?.slabs,
    /** Periods present on current PT slabs (fallback) */
    periodOptions: [
      ...new Set(
        (data?.slabs ?? [])
          .map((slab) => slab.period.trim())
          .filter((period) => period !== ""),
      ),
    ],
    /** Full period list from GET /admin/configuration/salary-round-off → data.periodType */
    periodTypeOptions,
    isPeriodTypesLoading,
    ptGroups: data?.group,
    isLoading,
    isFetching,
    isError,
    refetch,
    updatePt,
    isSaving,
  };
};
