// import { useGetAllCompanyApprovalsQuery } from '../api/approvalsApi';

// export function useAllCompanyApprovals() {
//   const { data, isLoading, isFetching, isError, refetch } =
//     useGetAllCompanyApprovalsQuery();

//   const items = data?.data ?? data?.items ?? [];

//   return {
//     items,
//     isLoading,
//     isFetching,
//     isError,
//     refetch,
//   };
// }








import { useGetAllCompanyApprovalsQuery } from '../api/approvalsApi';

export function useAllCompanyApprovals() {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetAllCompanyApprovalsQuery();

  const items = data?.data ?? data?.items ?? [];

  // NOTE: no mock fallback here on purpose — an empty list correctly renders
  // your <ApprovalsEmptyState /> ("No Other Company Pending Requests"), which
  // is itself a valid, already-matching-Figma UI state. Nothing to fake here.

  return {
    items,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}