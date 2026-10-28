import type {
  AssetRequestFormData,
} from "../types/assetRequest.types";

export interface AssetRequestValidationErrors {
  assetType?: string;
  assetName?: string;
  quantity?: string;
  reason?: string;
  priority?: string;
}

export const validateAssetRequest = (
  values: AssetRequestFormData
): AssetRequestValidationErrors => {
  const errors: AssetRequestValidationErrors = {};

  if (!values.assetType?.trim()) {
    errors.assetType = "Asset type is required";
  }

  if (!values.assetName?.trim()) {
    errors.assetName = "Asset name is required";
  }

  if (!values.quantity || values.quantity < 1) {
    errors.quantity = "Quantity must be at least 1";
  }

  if (values.quantity > 20) {
    errors.quantity = "Quantity cannot be greater than 20";
  }

  if (!values.reason?.trim()) {
    errors.reason = "Reason is required";
  } else if (values.reason.trim().length < 5) {
    errors.reason = "Reason must contain at least 5 characters";
  }

  if (!values.priority) {
    errors.priority = "Priority is required";
  }

  return errors;
};