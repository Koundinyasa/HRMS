// import { useGetComplianceOverviewQuery } from '../api/detailsApi';

// export function useComplianceOverview(monthYear?: string) {
//   const { data, isLoading, isFetching, isError, refetch } =
//     useGetComplianceOverviewQuery(monthYear ? { monthYear } : undefined);

//   const rows = data?.rows ?? data?.data ?? [];

//   return {
//     rows,
//     isLoading,
//     isFetching,
//     isError,
//     refetch,
//   };
// }








import { useGetComplianceOverviewQuery } from '../api/detailsApi';
import { MOCK_COMPLIANCE_ROW } from '../constants/details.constants';

export function useComplianceOverview(monthYear?: string) {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetComplianceOverviewQuery(monthYear ? { monthYear } : undefined);

  let rows = data?.rows ?? data?.data ?? [];

  // TEMP: backend not ready yet — fall back to mock so UI is visible while testing.
  // Remove this block once `admin/organizations/details/compliance-overview` returns real data.
  if (!isLoading && (isError || rows.length === 0)) {
    rows = [MOCK_COMPLIANCE_ROW];
  }

  return {
    rows,
    isLoading,
    isFetching,
    isError: false, // TEMP: suppressed while falling back to mock — restore `isError` when removing fallback
    refetch,
  };
}