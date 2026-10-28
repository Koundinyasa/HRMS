import { useGetPtDetailsQuery, useUpdatePtDetailsMutation } from "../api/companyApi";


export const usePtDetails =()=>{
    const { data, isLoading, isFetching, isError ,refetch} =useGetPtDetailsQuery();
    const [updatePt,{isLoading:isSaving}]=useUpdatePtDetailsMutation();

    return {
        ptSlabs: data?.slabs,
        ptGroups: data?.group,
        isLoading,
        isFetching,
        isError,
        refetch,
        updatePt,
        isSaving
    }
}