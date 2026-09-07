import { baseApi } from '@/app/baseApi';
import type { StatutoryEmployeeRow,UpdateStatutoryPayload,BulkUpdateFilters,ClassificationEmployeeRow,UpdateClassificationPayload} from '../types/bulkUpdate.types';


const USE_MOCK_STATUTORY_DATA = true;


const USE_MOCK_CLASSIFICATION_DATA = true;


const MOCK_CLASSIFICATION_EMPLOYEES: ClassificationEmployeeRow[] = [];

const MOCK_STATUTORY_EMPLOYEES: StatutoryEmployeeRow[] = [
    {
        employeeId: '1',
        employeeName: 'RAJESH UBBAPALLY',
        dos: '01/Feb/2026',
        statutory: '',
        statutoryApplicability: { pf: true, esi: false, restrict_employee_pf: false, zero_pt: false, zero_pension: false, vol_pf: false, international_worker: false, labour_welfare_fund: false },
    },
    {
        employeeId: '1',
        employeeName: 'RAJESH UBBAPALLY',
        dos: '01/Feb/2026',
        statutory: '',
        statutoryApplicability: { pf: true, esi: false, restrict_employee_pf: false, zero_pt: false, zero_pension: false, vol_pf: false, international_worker: false, labour_welfare_fund: false },
    },
    {
        employeeId: 'KTS164211',
        employeeName: 'Sathwika Achugatla',
        dos: '01/Mar/2026',
        statutory: '',
        statutoryApplicability: { pf: false, esi: true, restrict_employee_pf: false, zero_pt: false, zero_pension: false, vol_pf: false, international_worker: false, labour_welfare_fund: false },
    },
    {
        employeeId: 'KTS164212',
        employeeName: 'Sireesha Yarramaneni',
        dos: '01/Mar/2026',
        statutory: '',
        statutoryApplicability: { pf: false, esi: true, restrict_employee_pf: false, zero_pt: false, zero_pension: false, vol_pf: false, international_worker: false, labour_welfare_fund: false },
    },
    {
        employeeId: 'KTS164219',
        employeeName: 'Ram Bhupal Reddy Sanki',
        dos: '01/Mar/2026',
        statutory: '',
        statutoryApplicability: { pf: false, esi: false, restrict_employee_pf: false, zero_pt: false, zero_pension: false, vol_pf: false, international_worker: false, labour_welfare_fund: false },
    },
];

export const bulkUpdateApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getStatutoryEmployees: builder.query<StatutoryEmployeeRow[], BulkUpdateFilters | void>({
            queryFn: async (filters, _queryApi, _extraOptions, baseQuery) => {
                if (USE_MOCK_STATUTORY_DATA) {
                    await new Promise((resolve) => setTimeout(resolve, 300)); // simulate network delay
                    return { data: MOCK_STATUTORY_EMPLOYEES };
                }

                const result = await baseQuery({
                    url: 'bulk-update/statutory',
                    params: filters ?? undefined,
                });

                if (result.error) {
                    return { error: result.error };
                }
                return { data: result.data as StatutoryEmployeeRow[] };
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((r) => ({ type: 'BulkUpdate' as const, id: r.employeeId })),
                          { type: 'BulkUpdate' as const, id: 'STATUTORY_LIST' },
                      ]
                    : [{ type: 'BulkUpdate' as const, id: 'STATUTORY_LIST' }],
        }),

        updateStatutoryBulk: builder.mutation<void, UpdateStatutoryPayload>({
            query: (body) => ({
                url: 'bulk-update/statutory',
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'BulkUpdate', id: 'STATUTORY_LIST' }],
        }),

        getClassificationEmployees: builder.query<ClassificationEmployeeRow[], BulkUpdateFilters | void>({
            queryFn: async (filters, _queryApi, _extraOptions, baseQuery) => {
                if (USE_MOCK_CLASSIFICATION_DATA) {
                    await new Promise((resolve) => setTimeout(resolve, 300)); // simulate network delay
                    return { data: MOCK_CLASSIFICATION_EMPLOYEES };
                }

                const result = await baseQuery({
                    url: 'bulk-update/classification',
                    params: filters ?? undefined,
                });

                if (result.error) {
                    return { error: result.error };
                }
                return { data: result.data as ClassificationEmployeeRow[] };
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((r) => ({ type: 'BulkUpdate' as const, id: r.employeeId })),
                          { type: 'BulkUpdate' as const, id: 'CLASSIFICATION_LIST' },
                      ]
                    : [{ type: 'BulkUpdate' as const, id: 'CLASSIFICATION_LIST' }],
        }),

        updateClassificationBulk: builder.mutation<void, UpdateClassificationPayload>({
            query: (body) => ({
                url: 'bulk-update/classification',
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'BulkUpdate', id: 'CLASSIFICATION_LIST' }],
        }),

    }),
});

export const {
    useGetStatutoryEmployeesQuery,
    useUpdateStatutoryBulkMutation,
    useGetClassificationEmployeesQuery,
    useUpdateClassificationBulkMutation,
} = bulkUpdateApi;