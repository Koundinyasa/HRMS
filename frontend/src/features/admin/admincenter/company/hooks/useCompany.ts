import {
  useGetCompanyDetailsQuery,
  useUpdateCompanyDetailsMutation,
  useUploadCompanyDocumentMutation,
} from "../api/companyApi";

export const useCompany = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetCompanyDetailsQuery();
  const [updateCompany, { isLoading: isSaving }] =
    useUpdateCompanyDetailsMutation();
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadCompanyDocumentMutation();

  return {
    company: data,
    isLoading,
    isFetching,
    isError,
    refetch,
    updateCompany,
    uploadDocument,
    isSaving: isSaving || isUploading,
  };
};