// import { baseApi } from '@/app/baseApi';
// import type {
//     BgvDashboardStats,
//     BgvCandidate,
//     BgvInitiateFilters,
//     InitiateBgvPayload,
//     UpdateInitiateCandidatePayload,
//     OngoingBgvCandidate,
//     UpdateOngoingBgvPayload,
//     AssignVerifierPayload,
//     BgvListFilters,
//     BgvSettings,
//     BgvAuditLogEntry,
//     BgvAuditLogFilters,
// } from '../types/backgroundverification.types';
// import type { BgvOverallStatus } from '../types/backgroundverification.types';

// // ---- Raw backend shapes ----
// // src/admin/onboard/background-verification/* serve in-memory fixtures whose field
// // names differ from this feature's types. Normalise here so components stay clean.

// interface RawBgvCandidate {
//     candidateId: number;
//     employeeId?: string;
//     employeeName?: string;
//     email?: string;
//     verificationStatus?: string;
//     verificationType?: string;
//     completedDate?: string;
//     status?: string;
// }

// interface RawBgvSettings {
//     verificationTypes?: string[];
//     autoInitiate?: boolean;
//     requireConsent?: boolean;
//     emailNotification?: boolean;
//     smsNotification?: boolean;
// }

// const toCandidate = (r: RawBgvCandidate): BgvCandidate => ({
//     candidateId: String(r.candidateId),
//     candidateName: r.employeeName ?? '',
//     email: r.email,
// });

// // Backend sends free text ('In Progress', 'Awaiting Documents'); the UI wants an enum.
// const toOverallStatus = (s?: string): BgvOverallStatus => {
//     switch (s?.trim().toLowerCase()) {
//         case 'in progress':
//             return 'in_progress';
//         case 'completed':
//             return 'completed';
//         case 'discrepancy':
//             return 'discrepancy';
//         default:
//             return 'pending';
//     }
// };

// export const backgroundverificationApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({

//         getBgvDashboard: builder.query<BgvDashboardStats, void>({
//             query: () => 'admin/background-verification/dashboard',
//             providesTags: [{ type: 'BackgroundVerification', id: 'DASHBOARD' }],
//         }),

//         getInitiateCandidates: builder.query<BgvCandidate[], BgvInitiateFilters | void>({
//             query: (filters) => ({
//                 url: 'admin/background-verification/initiate',
//                 params: filters ?? undefined,
//             }),
//             transformResponse: (rows: RawBgvCandidate[]) => (rows ?? []).map(toCandidate),
//             providesTags: (result) =>
//                 result
//                     ? [
//                           ...result.map((c) => ({ type: 'BackgroundVerification' as const, id: c.candidateId })),
//                           { type: 'BackgroundVerification' as const, id: 'INITIATE_LIST' },
//                       ]
//                     : [{ type: 'BackgroundVerification' as const, id: 'INITIATE_LIST' }],
//         }),

//         initiateBgv: builder.mutation<void, InitiateBgvPayload>({
//             query: (body) => ({
//                 url: 'admin/background-verification/initiate',
//                 method: 'POST',
//                 body,
//             }),
//             invalidatesTags: [
//                 { type: 'BackgroundVerification', id: 'INITIATE_LIST' },
//                 { type: 'BackgroundVerification', id: 'ONGOING_LIST' },
//                 { type: 'BackgroundVerification', id: 'DASHBOARD' },
//             ],
//         }),

//         updateInitiateCandidate: builder.mutation<void, UpdateInitiateCandidatePayload>({
//             query: ({ candidateId, ...body }) => ({
//                 url: `admin/background-verification/initiate/${candidateId}`,
//                 method: 'PUT',
//                 body,
//             }),
//             invalidatesTags: (_result, _error, { candidateId }) => [
//                 { type: 'BackgroundVerification', id: 'INITIATE_LIST' },
//                 { type: 'BackgroundVerification', id: candidateId },
//             ],
//         }),

//         getOngoingBgv: builder.query<OngoingBgvCandidate[], BgvListFilters | void>({
//             query: (filters) => ({
//                 url: 'admin/background-verification/ongoing',
//                 params: filters ?? undefined,
//             }),
//             transformResponse: (rows: RawBgvCandidate[]): OngoingBgvCandidate[] =>
//                 (rows ?? []).map((r) => ({
//                     ...toCandidate(r),
//                     overallStatus: toOverallStatus(r.status),
//                     // Backend has one flat verificationType, not a list.
//                     verifications: r.verificationType
//                         ? [{ verificationType: r.verificationType, status: 'pending' as const }]
//                         : [],
//                 })),
//             providesTags: (result) =>
//                 result
//                     ? [
//                           ...result.map((c) => ({ type: 'BackgroundVerification' as const, id: c.candidateId })),
//                           { type: 'BackgroundVerification' as const, id: 'ONGOING_LIST' },
//                       ]
//                     : [{ type: 'BackgroundVerification' as const, id: 'ONGOING_LIST' }],
//         }),

//         updateOngoingBgv: builder.mutation<void, { candidateId: string; data: UpdateOngoingBgvPayload }>({
//             query: ({ candidateId, data }) => ({
//                 url: `admin/background-verification/ongoing/${candidateId}`,
//                 method: 'PUT',
//                 body: data,
//             }),
//             invalidatesTags: (_result, _error, { candidateId }) => [
//                 { type: 'BackgroundVerification', id: 'ONGOING_LIST' },
//                 { type: 'BackgroundVerification', id: 'COMPLETED_LIST' },
//                 { type: 'BackgroundVerification', id: 'DASHBOARD' },
//                 { type: 'BackgroundVerification', id: candidateId },
//             ],
//         }),

//         assignVerifierToCandidates: builder.mutation<void, AssignVerifierPayload>({
//             async queryFn({ candidateIds, externalVerifier, activities }, _api, _extraOptions, baseQuery) {
//                 const results = await Promise.all(
//                     candidateIds.map((candidateId) =>
//                         baseQuery({
//                             url: `admin/background-verification/ongoing/${candidateId}`,
//                             method: 'PUT',
//                             body: { externalVerifier, activities },
//                         }),
//                     ),
//                 );
//                 const failed = results.find((r) => r.error);
//                 if (failed?.error) return { error: failed.error };
//                 return { data: undefined };
//             },
//             invalidatesTags: [
//                 { type: 'BackgroundVerification', id: 'ONGOING_LIST' },
//                 { type: 'BackgroundVerification', id: 'DASHBOARD' },
//             ],
//         }),

//         getCompletedBgv: builder.query<BgvCandidate[], BgvListFilters | void>({
//             query: (filters) => ({
//                 url: 'admin/background-verification/completed',
//                 params: filters ?? undefined,
//             }),
//             transformResponse: (rows: RawBgvCandidate[]) => (rows ?? []).map(toCandidate),
//             providesTags: [{ type: 'BackgroundVerification', id: 'COMPLETED_LIST' }],
//         }),

//         getBgvSettings: builder.query<BgvSettings, void>({
//             query: () => 'admin/background-verification/settings',
//             transformResponse: (s: RawBgvSettings): BgvSettings => ({
//                 // Backend sends plain strings; the panel wants {name, enabled} rows.
//                 verificationTypes: (s?.verificationTypes ?? []).map((name) => ({
//                     name,
//                     enabled: true,
//                 })),
//                 // Not modelled by the backend fixture.
//                 requireExternalVerifier: false,
//                 mailTemplates: [],
//             }),
//             providesTags: [{ type: 'BackgroundVerification', id: 'SETTINGS' }],
//         }),

//         updateBgvSettings: builder.mutation<void, BgvSettings>({
//             query: (body) => ({
//                 url: 'admin/background-verification/settings',
//                 method: 'PUT',
//                 body,
//             }),
//             invalidatesTags: [{ type: 'BackgroundVerification', id: 'SETTINGS' }],
//         }),

//         getBgvAuditLog: builder.query<{ items: BgvAuditLogEntry[]; total: number }, BgvAuditLogFilters | void>({
//             query: (filters) => ({
//                 url: 'admin/background-verification/audit-log',
//                 params: filters ?? undefined,
//             }),
//             providesTags: [{ type: 'BackgroundVerification', id: 'AUDIT_LOG' }],
//         }),
//     }),
// });

// export const {
//     useGetBgvDashboardQuery,
//     useGetInitiateCandidatesQuery,
//     useInitiateBgvMutation,
//     useUpdateInitiateCandidateMutation,
//     useGetOngoingBgvQuery,
//     useUpdateOngoingBgvMutation,
//     useAssignVerifierToCandidatesMutation,
//     useGetCompletedBgvQuery,
//     useGetBgvSettingsQuery,
//     useUpdateBgvSettingsMutation,
//     useGetBgvAuditLogQuery,
// } = backgroundverificationApi;


import { baseApi } from '@/app/baseApi';

import type {
    BgvDashboardStats,
    BgvCandidate,
    BgvInitiateFilters,
    InitiateBgvPayload,
    UpdateInitiateCandidatePayload,
    OngoingBgvCandidate,
    UpdateOngoingBgvPayload,
    AssignVerifierPayload,
    BgvListFilters,
    BgvSettings,
    BgvAuditLogEntry,
    BgvAuditLogFilters,
} from '../types/backgroundverification.types';

import type { BgvOverallStatus } from '../types/backgroundverification.types';


// ============================================================
// Backend API prefix
// ============================================================
//
// baseApi already contains:
// VITE_API_URL = http://localhost:3001/api/
//
// Backend controller:
// @Controller('admin/background-verification')
//
// Therefore every endpoint here starts with:
// admin/background-verification/
//
// ============================================================

const BGV_BASE = 'admin/background-verification';


// ============================================================
// Raw backend shapes
// ============================================================

interface RawBgvCandidate {
    candidateId: number;
    employeeId?: string;
    employeeName?: string;
    email?: string;
    verificationStatus?: string;
    verificationType?: string;
    completedDate?: string;
    status?: string;
}

interface RawBgvSettings {
    verificationTypes?: string[];
    autoInitiate?: boolean;
    requireConsent?: boolean;
    emailNotification?: boolean;
    smsNotification?: boolean;
}


// ============================================================
// Normalisers
// ============================================================

const toCandidate = (r: RawBgvCandidate): BgvCandidate => ({
    candidateId: String(r.candidateId),
    candidateName: r.employeeName ?? '',
    email: r.email,
});


// Backend sends free text such as:
// "In Progress"
// "Awaiting Documents"
//
// UI expects:
// "in_progress"
// "pending"
// "completed"
// "discrepancy"

const toOverallStatus = (s?: string): BgvOverallStatus => {
    switch (s?.trim().toLowerCase()) {
        case 'in progress':
            return 'in_progress';

        case 'completed':
            return 'completed';

        case 'discrepancy':
            return 'discrepancy';

        default:
            return 'pending';
    }
};


// ============================================================
// API
// ============================================================

export const backgroundverificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ======================================================
        // Dashboard
        // GET /api/admin/background-verification/dashboard
        // ======================================================

        getBgvDashboard: builder.query<BgvDashboardStats, void>({
            query: () => `${BGV_BASE}/dashboard`,

            providesTags: [
                {
                    type: 'BackgroundVerification',
                    id: 'DASHBOARD',
                },
            ],
        }),


        // ======================================================
        // Initiate List
        //
        // Backend:
        // GET /api/admin/background-verification/initiate-list
        //
        // IMPORTANT:
        // Frontend previously used:
        // background-verification/initiate
        //
        // That was incorrect because POST /initiate is a
        // different backend endpoint.
        // ======================================================

        getInitiateCandidates: builder.query<
            BgvCandidate[],
            BgvInitiateFilters | void
        >({
            query: (filters) => ({
                url: `${BGV_BASE}/initiate-list`,
                params: filters ?? undefined,
            }),

            transformResponse: (rows: RawBgvCandidate[]) =>
                (rows ?? []).map(toCandidate),

            providesTags: (result) =>
                result
                    ? [
                          ...result.map((candidate) => ({
                              type: 'BackgroundVerification' as const,
                              id: candidate.candidateId,
                          })),

                          {
                              type: 'BackgroundVerification' as const,
                              id: 'INITIATE_LIST',
                          },
                      ]
                    : [
                          {
                              type: 'BackgroundVerification' as const,
                              id: 'INITIATE_LIST',
                          },
                      ],
        }),


        // ======================================================
        // Initiate BGV
        //
        // Backend:
        // POST /api/admin/background-verification/initiate
        //
        // Frontend type:
        // candidateIds
        //
        // Backend DTO:
        // applicationIds
        //
        // Therefore we convert candidateIds -> applicationIds
        // before sending the request.
        // ======================================================

        initiateBgv: builder.mutation<void, InitiateBgvPayload>({
            query: (body) => ({
                url: `${BGV_BASE}/initiate`,

                method: 'POST',

                body: {
                    applicationIds: body.candidateIds,
                },
            }),

            invalidatesTags: [
                {
                    type: 'BackgroundVerification',
                    id: 'INITIATE_LIST',
                },

                {
                    type: 'BackgroundVerification',
                    id: 'ONGOING_LIST',
                },

                {
                    type: 'BackgroundVerification',
                    id: 'DASHBOARD',
                },
            ],
        }),


        // ======================================================
        // Update Initiate Candidate
        //
        // CURRENT FRONTEND:
        // PUT /admin/background-verification/initiate/:candidateId
        //
        // IMPORTANT:
        // The backend controller you provided DOES NOT currently
        // contain:
        //
        // @Put('initiate/:candidateId')
        //
        // So this endpoint will remain unavailable until that
        // backend route is implemented.
        // ======================================================

        updateInitiateCandidate: builder.mutation<
            void,
            UpdateInitiateCandidatePayload
        >({
            query: ({ candidateId, ...body }) => ({
                url: `${BGV_BASE}/initiate/${candidateId}`,

                method: 'PUT',

                body,
            }),

            invalidatesTags: (_result, _error, { candidateId }) => [
                {
                    type: 'BackgroundVerification',
                    id: 'INITIATE_LIST',
                },

                {
                    type: 'BackgroundVerification',
                    id: candidateId,
                },
            ],
        }),


        // ======================================================
        // Ongoing BGV
        //
        // Backend:
        // GET /api/admin/background-verification/ongoing
        // ======================================================

        getOngoingBgv: builder.query<
            OngoingBgvCandidate[],
            BgvListFilters | void
        >({
            query: (filters) => ({
                url: `${BGV_BASE}/ongoing`,
                params: filters ?? undefined,
            }),

            transformResponse: (
                rows: RawBgvCandidate[],
            ): OngoingBgvCandidate[] =>
                (rows ?? []).map((r) => ({
                    ...toCandidate(r),

                    overallStatus: toOverallStatus(r.status),

                    // Backend has one flat verificationType,
                    // while frontend expects an array.
                    verifications: r.verificationType
                        ? [
                              {
                                  verificationType: r.verificationType,
                                  status: 'pending' as const,
                              },
                          ]
                        : [],
                })),

            providesTags: (result) =>
                result
                    ? [
                          ...result.map((candidate) => ({
                              type: 'BackgroundVerification' as const,
                              id: candidate.candidateId,
                          })),

                          {
                              type: 'BackgroundVerification' as const,
                              id: 'ONGOING_LIST',
                          },
                      ]
                    : [
                          {
                              type: 'BackgroundVerification' as const,
                              id: 'ONGOING_LIST',
                          },
                      ],
        }),


        // ======================================================
        // Update Ongoing BGV
        //
        // Backend:
        // PUT /api/admin/background-verification/ongoing/:bgvId
        //
        // ======================================================

        updateOngoingBgv: builder.mutation<
            void,
            {
                candidateId: string;
                data: UpdateOngoingBgvPayload;
            }
        >({
            query: ({ candidateId, data }) => ({
                url: `${BGV_BASE}/ongoing/${candidateId}`,

                method: 'PUT',

                body: data,
            }),

            invalidatesTags: (_result, _error, { candidateId }) => [
                {
                    type: 'BackgroundVerification',
                    id: 'ONGOING_LIST',
                },

                {
                    type: 'BackgroundVerification',
                    id: 'COMPLETED_LIST',
                },

                {
                    type: 'BackgroundVerification',
                    id: 'DASHBOARD',
                },

                {
                    type: 'BackgroundVerification',
                    id: candidateId,
                },
            ],
        }),


        // ======================================================
        // Assign Verifier
        //
        // There is no dedicated assign-verifier backend route
        // in the controller you provided.
        //
        // Therefore this uses:
        //
        // PUT /api/admin/background-verification/ongoing/:candidateId
        //
        // exactly as the existing implementation did.
        // ======================================================

        assignVerifierToCandidates: builder.mutation<
            void,
            AssignVerifierPayload
        >({
            async queryFn(
                {
                    candidateIds,
                    externalVerifier,
                    activities,
                },
                _api,
                _extraOptions,
                baseQuery,
            ) {
                const results = await Promise.all(
                    candidateIds.map((candidateId) =>
                        baseQuery({
                            url: `${BGV_BASE}/ongoing/${candidateId}`,

                            method: 'PUT',

                            body: {
                                externalVerifier,
                                activities,
                            },
                        }),
                    ),
                );

                const failed = results.find(
                    (result) => result.error,
                );

                if (failed?.error) {
                    return {
                        error: failed.error,
                    };
                }

                return {
                    data: undefined,
                };
            },

            invalidatesTags: [
                {
                    type: 'BackgroundVerification',
                    id: 'ONGOING_LIST',
                },

                {
                    type: 'BackgroundVerification',
                    id: 'DASHBOARD',
                },
            ],
        }),


        // ======================================================
        // Completed BGV
        //
        // Backend:
        // GET /api/admin/background-verification/completed
        // ======================================================

        getCompletedBgv: builder.query<
            BgvCandidate[],
            BgvListFilters | void
        >({
            query: (filters) => ({
                url: `${BGV_BASE}/completed`,
                params: filters ?? undefined,
            }),

            transformResponse: (rows: RawBgvCandidate[]) =>
                (rows ?? []).map(toCandidate),

            providesTags: [
                {
                    type: 'BackgroundVerification',
                    id: 'COMPLETED_LIST',
                },
            ],
        }),


        // ======================================================
        // Get Settings
        //
        // Backend:
        // GET /api/admin/background-verification/settings
        // ======================================================

        getBgvSettings: builder.query<BgvSettings, void>({
            query: () => `${BGV_BASE}/settings`,

            transformResponse: (
                s: RawBgvSettings,
            ): BgvSettings => ({
                verificationTypes: (
                    s?.verificationTypes ?? []
                ).map((name) => ({
                    name,
                    enabled: true,
                })),

                // Backend fixture currently does not model this.
                requireExternalVerifier: false,

                // Backend fixture currently does not model this.
                mailTemplates: [],
            }),

            providesTags: [
                {
                    type: 'BackgroundVerification',
                    id: 'SETTINGS',
                },
            ],
        }),


        // ======================================================
        // Update Settings
        //
        // Backend:
        // PUT /api/admin/background-verification/settings
        // ======================================================

        updateBgvSettings: builder.mutation<
            void,
            BgvSettings
        >({
            query: (body) => ({
                url: `${BGV_BASE}/settings`,

                method: 'PUT',

                body,
            }),

            invalidatesTags: [
                {
                    type: 'BackgroundVerification',
                    id: 'SETTINGS',
                },
            ],
        }),


        // ======================================================
        // Audit Logs
        //
        // Backend:
        // GET /api/admin/background-verification/audit-logs
        //
        // IMPORTANT:
        // Frontend previously used:
        // audit-log
        //
        // Backend uses:
        // audit-logs
        // ======================================================

        getBgvAuditLog: builder.query<
            {
                items: BgvAuditLogEntry[];
                total: number;
            },
            BgvAuditLogFilters | void
        >({
            query: (filters) => ({
                url: `${BGV_BASE}/audit-logs`,
                params: filters ?? undefined,
            }),

            providesTags: [
                {
                    type: 'BackgroundVerification',
                    id: 'AUDIT_LOG',
                },
            ],
        }),


        // ======================================================
        // Verification Checklist
        //
        // Backend:
        // GET /api/admin/background-verification/:bgvId/checklist
        //
        // This endpoint wasn't present in the original frontend
        // API file, but it exists in your controller.
        // ======================================================

        getVerificationChecklist: builder.query<
            unknown,
            string | number
        >({
            query: (bgvId) =>
                `${BGV_BASE}/${bgvId}/checklist`,
        }),
    }),
});


// ============================================================
// Generated Hooks
// ============================================================

export const {
    useGetBgvDashboardQuery,

    useGetInitiateCandidatesQuery,

    useInitiateBgvMutation,

    useUpdateInitiateCandidateMutation,

    useGetOngoingBgvQuery,

    useUpdateOngoingBgvMutation,

    useAssignVerifierToCandidatesMutation,

    useGetCompletedBgvQuery,

    useGetBgvSettingsQuery,

    useUpdateBgvSettingsMutation,

    useGetBgvAuditLogQuery,

    useGetVerificationChecklistQuery,
} = backgroundverificationApi;