// import { useGetGroupDashboardQuery } from '../api/detailsApi';
// import type { OrganizationCompany, OrganizationStat } from '../types/details.types';

// const EMPTY_STATS: OrganizationStat = {
//   totalEmployees: 0,
//   confirmationPending: 0,
//   joinedEmployees: 0,
//   leftEmployees: 0,
//   maleCount: 0,
//   femaleCount: 0,
//   averageService: '—',
// };

// export function useGroupDashboard() {
//   const { data, isLoading, isFetching, isError, refetch } =
//     useGetGroupDashboardQuery();

//   const company: OrganizationCompany | null =
//     data?.company ??
//     data?.companies?.[0] ??
//     (data?.stats || data?.companyName
//       ? {
//           id: '1',
//           name: data.companyName ?? '—',
//           stats: data.stats ?? EMPTY_STATS,
//         }
//       : null);

//   return {
//     company,
//     stats: company?.stats ?? EMPTY_STATS,
//     isLoading,
//     isFetching,
//     isError,
//     refetch,
//   };
// }










import { useGetGroupDashboardQuery } from '../api/detailsApi';
import { MOCK_COMPANY } from '../constants/details.constants';
import type { OrganizationCompany, OrganizationStat } from '../types/details.types';

const EMPTY_STATS: OrganizationStat = {
  totalEmployees: 0,
  confirmationPending: 0,
  joinedEmployees: 0,
  leftEmployees: 0,
  maleCount: 0,
  femaleCount: 0,
  averageService: '—',
};

export function useGroupDashboard() {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetGroupDashboardQuery();

  let company: OrganizationCompany | null =
    data?.company ??
    data?.companies?.[0] ??
    (data?.stats || data?.companyName
      ? {
          id: '1',
          name: data.companyName ?? '—',
          stats: data.stats ?? EMPTY_STATS,
        }
      : null);

  // TEMP: backend not ready yet — fall back to mock so UI is visible while testing.
  // Remove this block once `admin/organizations/details/dashboard` returns real data.
  if (!isLoading && (isError || !company)) {
    company = MOCK_COMPANY;
  }

  return {
    company,
    stats: company?.stats ?? EMPTY_STATS,
    isLoading,
    isFetching,
    isError: false, // TEMP: suppressed while falling back to mock — restore `isError` when removing fallback
    refetch,
  };
}