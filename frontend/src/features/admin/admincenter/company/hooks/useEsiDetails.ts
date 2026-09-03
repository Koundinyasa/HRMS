import { useGetEsiDetailsQuery,useUpdateEsiDetailsMutation } from "../api/companyApi";


export const useEsiDetails=()=>{
    const {data,isLoading,isFetching,isError,refetch}=useGetEsiDetailsQuery();
    const [updateEsi,{isLoading:isSaving}]=useUpdateEsiDetailsMutation();

    return {
        esi:    data?.configuration?.[0],
        esiGroups:data?.group,
        isLoading,
        isFetching,
        isError,
        refetch,
        updateEsi,
        isSaving,
    };
};