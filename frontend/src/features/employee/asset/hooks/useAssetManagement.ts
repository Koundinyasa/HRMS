import { toast } from "react-toastify";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { clearRequestForm, setAssetId, setAssetReason } from "../assetSlice";
import {
  useCreateAssetRequestMutation,
  useGetAssetHistoryQuery,
  useGetAssetTypesQuery,
  useGetMyAssetRequestStatusQuery,
} from "../api/assetApi";
import { validateAssetRequest } from "../validation/assetValidation";

export const useAssetManagement = () => {
  const dispatch = useAppDispatch();
  const assetState = useAppSelector((state) => state.employee.asset);



  const { data: assetTypes = [] } = useGetAssetTypesQuery();
  const {
    data: historyResponse,
    isLoading: isHistoryLoading,
  } = useGetAssetHistoryQuery();
  const historySection =
    historyResponse?.sections.find(
      (section) => section.title === "Asset Allocation History"
    ) ?? null;
  // /asset/request-status is employee-scoped server-side (via auth token)
  // and now includes CurrentStageOrder, enough to drive the 5-stage tracker UI.
  const {
    data: requestStatusResponse,
    isLoading: isPendingLoading,
    isError,
  } = useGetMyAssetRequestStatusQuery();

  const myPendingRequests = [
    ...(requestStatusResponse?.AssetRequests ?? []),
  ].sort((a, b) => b.Id - a.Id);

  const [createAssetRequest, { isLoading: isCreating }] = useCreateAssetRequestMutation();

  const setAssetType = (assetId: number) => dispatch(setAssetId(assetId));

  const submitRequest = async () => {
    const validation = validateAssetRequest({ assetId: assetState.assetId, reason: assetState.reason });
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }


    try {
      await createAssetRequest({
        assetId: assetState.assetId as number,
        remarks: assetState.reason,
      }).unwrap();

      dispatch(clearRequestForm());

      toast.success(
        "Asset request submitted successfully."
      );

      return true;
    } catch (err) {
      console.error("Asset request submission failed:", err);
      const errorObject =
        err && typeof err === "object"
          ? (err as {
              data?: unknown;
              error?: string;
            })
          : undefined;
      const responseData = errorObject?.data;

      let backendMessage: string | undefined;

      if (typeof responseData === "string") {
        backendMessage = responseData;
      } else if (responseData && typeof responseData === "object") {
        const data = responseData as {
          Message?: unknown;
          message?: unknown;
          error?: unknown;
        };
        const message = data.Message ?? data.message ?? data.error;
        backendMessage = Array.isArray(message)
          ? message.filter((item): item is string => typeof item === "string").join(", ")
          : typeof message === "string"
            ? message
            : undefined;
      }

      backendMessage ||= errorObject?.error;

      toast.error(
        backendMessage ||
          "Unable to submit the asset request. Please try again.",
      );
    }
  };

  return {
    ...assetState,

    assetTypes,
    historySection,
    myPendingRequests,
    isLoading: isPendingLoading || isHistoryLoading,
    isError,
    isCreating,
    setAssetReason: (reason: string) => dispatch(setAssetReason(reason)),
    setAssetType,
    submitRequest,
  };
};