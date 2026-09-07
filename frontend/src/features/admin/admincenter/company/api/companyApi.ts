import { baseApi } from '@/app/baseApi';
import type {CompanyDetails,EsiDetails,EstablishmentDetails,LwfDetails,PfDetails,PtDetails,PtSlab}  from '../types/company.types';

export const companyApi = baseApi.injectEndpoints({
    endpoints:  (builder) => ({
        getCompanyDetails:builder.query<CompanyDetails, void>({
            query: ()=> 'admin/configuration/company',
        }),


        getPfDetails:builder.query<PfDetails, void>({
            query:()=> 'admin/configuration/pf',
        }),

        getEsiDetails:builder.query<EsiDetails, void>({
            query:()=> 'admin/configuration/esi',
        }),

        getPtDetails:builder.query<PtDetails, void>({
            query:()=> 'admin/configuration/pt',
        }),

        getLwfDetails:builder.query<LwfDetails,void>({
            query:()=> 'admin/configuration/lwf',
        }),

        getEstablishmentDetails:builder.query<EstablishmentDetails, void>({
            query:()=> 'admin/configuration/establishment',
        }),

        updateCompanyDetails:builder.mutation<void,CompanyDetails>({
            query:(body)=>({
                url:'admin/configuration/company',
                method:'PUT',
                body,
            })
        }),

        updatePfDetails:builder.mutation<void,PfDetails>({
            query:(body)=>({
                url:'admin/configuration/pf',
                method:'PUT',
                body,
            })
        }),

        updateEsiDetails:builder.mutation<void,EsiDetails>({
            query:(body)=>({
                url:'admin/configuration/esi',
                method:'PUT',
                body,
            })
        }),

        updatePtDetails:builder.mutation<void,{ slabs: PtSlab[] }>({
            query:(body)=>({
                url:'admin/configuration/pt',
                method:'PUT',
                body,
            })
        }),

        updateLwfDetails:builder.mutation<void,LwfDetails>({
            query:(body)=>({
                url:'admin/configuration/lwf',
                method:'PUT',
                body,
            })
        }),

        updateEstablishmentDetails:builder.mutation<void,EstablishmentDetails>({
            query:(body)=>({
                url:'admin/configuration/establishment',
                method:'PUT',
                body,
            })
        }),
    })
})


export const {
    useGetCompanyDetailsQuery,
    useGetPfDetailsQuery,
    useGetEsiDetailsQuery,
    useGetPtDetailsQuery,
    useGetLwfDetailsQuery,
    useGetEstablishmentDetailsQuery,
    useUpdateCompanyDetailsMutation,
    useUpdatePfDetailsMutation,
    useUpdateEsiDetailsMutation,
    useUpdatePtDetailsMutation,
    useUpdateLwfDetailsMutation,
    useUpdateEstablishmentDetailsMutation,
}=companyApi;