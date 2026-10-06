import type {
  AdjustmentFilters,
  AdjustmentFormData,
  AdjustmentImportData,
  AdjustmentResponse,
} from "../types/adjustment.types";

export const getAdjustmentRecords = async (
  _filters: AdjustmentFilters,
  _pageNumber = 1,
  _pageSize = 10,
): Promise<AdjustmentResponse> => {
  throw new Error(
    "Adjustment API endpoint is not configured yet.",
  );
};

export const saveAdjustment = async (
  _data: AdjustmentFormData,
): Promise<void> => {
  throw new Error(
    "Adjustment save API endpoint is not configured yet.",
  );
};

export const deleteAdjustment = async (
  _ids: number[],
): Promise<void> => {
  throw new Error(
    "Adjustment delete API endpoint is not configured yet.",
  );
};

export const importAdjustment = async (
  _data: AdjustmentImportData,
): Promise<void> => {
  throw new Error(
    "Adjustment import API endpoint is not configured yet.",
  );
};