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
    useGetGroupDashboardQuery({
      branchId: 2,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });

  const responseStats = data?.data;
  const genderRatio = responseStats?.GenderRatio?.match(
    /M\s*:\s*(\d+)\s*\|\s*F\s*:\s*(\d+)/i,
  );

  const stats: OrganizationStat = responseStats
    ? {
        totalEmployees: Number(responseStats.TotalEmployees ?? 0),
        confirmationPending: Number(responseStats.ConfirmationPending ?? 0),
        joinedEmployees: Number(responseStats.JoinedEmployees ?? 0),
        leftEmployees: Number(responseStats.LeftEmployees ?? 0),
        maleCount: Number(genderRatio?.[1] ?? 0),
        femaleCount: Number(genderRatio?.[2] ?? 0),
        averageService: responseStats.AverageService ?? '—',
      }
    : EMPTY_STATS;

  const company: OrganizationCompany | null =
    data?.company ??
    data?.companies?.[0] ??
    (responseStats || data?.stats || data?.companyName
      ? {
          id: '1',
          name: responseStats?.CompanyName ?? data.companyName ?? '—',
          stats,
        }
      : null);

  return {
    company,
    stats: company?.stats ?? stats,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
