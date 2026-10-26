import { useGetEstablishmentDetailsQuery, useUpdateEstablishmentDetailsMutation } from "../api/companyApi";


export const useEstablishmentDetails =()=>{
    const { data, isLoading, isFetching, isError ,refetch}=useGetEstablishmentDetailsQuery();
    const [updateEstablishment,{isLoading:isSaving}]=useUpdateEstablishmentDetailsMutation();

    return {
        establishment:    data,
        isLoading,
        isFetching,
        isError,
        refetch,
        updateEstablishment,
        isSaving
    }
}