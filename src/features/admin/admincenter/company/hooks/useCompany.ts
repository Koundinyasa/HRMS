import { useGetCompanyDetailsQuery ,useUpdateCompanyDetailsMutation} from "../api/companyApi";


export const useCompany = () =>{
    const { data, isLoading, isFetching, isError ,refetch}=useGetCompanyDetailsQuery();
    const [updateCompany,{isLoading:isSaving}] =useUpdateCompanyDetailsMutation();

    return {
        company:     data,
        isLoading,
        isFetching,
        isError,
        refetch,
        updateCompany,
        isSaving,
    };
}