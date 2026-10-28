import { useGetPfDetailsQuery , useUpdatePfDetailsMutation} from "../api/companyApi";


export const usePfDetails=()=>{
    const {data,isLoading,isFetching,isError,refetch} = useGetPfDetailsQuery();
    const [updatePf,{isLoading:isSaving}] =useUpdatePfDetailsMutation();

    return {
        pf:        data?.configuration?.[0],
        pfGroups:data?.group,
        isLoading,
        isFetching,
        isError,
        refetch,
        updatePf,
        isSaving,
    };
};