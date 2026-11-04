import {
  useGetPfDetailsQuery,
  useGetSalaryRoundOffQuery,
  useUpdatePfDetailsMutation,
} from "../api/companyApi";

export const usePfDetails = () => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPfDetailsQuery();

  const {
    data: roundOffOptions = [],
    isLoading: isRoundOffLoading,
    isError: isRoundOffError,
  } = useGetSalaryRoundOffQuery();

  const [updatePf, { isLoading: isSaving }] =
    useUpdatePfDetailsMutation();

  return {
    pf: data?.configuration?.[0],
    pfGroups: data?.group,
    roundOffOptions,
    isRoundOffLoading,
    isRoundOffError,
    isLoading,
    isFetching,
    isError,
    refetch,
    updatePf,
    isSaving,
  };
};
