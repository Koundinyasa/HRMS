import {
  useGetEsiDetailsQuery,
  useGetSalaryRoundOffQuery,
  useUpdateEsiDetailsMutation,
} from "../api/companyApi";


export const useEsiDetails=()=>{
    const {data,isLoading,isFetching,isError,refetch}=useGetEsiDetailsQuery();
    const {
        data: roundOffOptions = [],
        isLoading: isRoundOffLoading,
        isError: isRoundOffError,
    } = useGetSalaryRoundOffQuery();
    const [updateEsi,{isLoading:isSaving}]=useUpdateEsiDetailsMutation();

    return {
        esi:    data?.configuration?.[0],
        roundOffOptions,
        isRoundOffLoading,
        isRoundOffError,
        esiGroups:data?.group,
        isLoading,
        isFetching,
        isError,
        refetch,
        updateEsi,
        isSaving,
    };
};