import { useState } from "react";

import {
  ASSET_REQUEST_PRIORITIES,
  ASSET_TYPES,
} from "../constants/assetRequestConstants";

import type {
  AssetRequestFormData,
} from "../types/assetRequest.types";

import {
  validateAssetRequest,
  type AssetRequestValidationErrors,
} from "../validations/assetRequestValidations";

interface Props {
  onSubmit: (
    data: AssetRequestFormData
  ) => Promise<void>;

  onCancel: () => void;

  isSubmitting?: boolean;
}

const initialValues: AssetRequestFormData = {
  assetType: "",
  assetName: "",
  quantity: 1,
  reason: "",
  priority: "Medium",
};

const AssetRequestForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) => {
  const [values, setValues] =
    useState<AssetRequestFormData>(
      initialValues
    );

  const [errors, setErrors] =
    useState<AssetRequestValidationErrors>(
      {}
    );

  const handleChange = (
    field: keyof AssetRequestFormData,
    value: string | number
  ) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const validationErrors =
      validateAssetRequest(values);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Asset Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Asset Type
            <span className="text-red-500"> *</span>
          </label>

          <select
            value={values.assetType}
            onChange={(e) =>
              handleChange(
                "assetType",
                e.target.value
              )
            }
            className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500 ${
              errors.assetType
                ? "border-red-400"
                : "border-gray-200"
            }`}
          >
            <option value="">
              Select asset type
            </option>

            {ASSET_TYPES.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>

          {errors.assetType && (
            <p className="mt-1 text-xs text-red-500">
              {errors.assetType}
            </p>
          )}
        </div>

        {/* Asset Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Asset Name
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="text"
            value={values.assetName}
            onChange={(e) =>
              handleChange(
                "assetName",
                e.target.value
              )
            }
            placeholder="Enter asset name"
            className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500 ${
              errors.assetName
                ? "border-red-400"
                : "border-gray-200"
            }`}
          />

          {errors.assetName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.assetName}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Quantity
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            min={1}
            max={20}
            value={values.quantity}
            onChange={(e) =>
              handleChange(
                "quantity",
                Number(e.target.value)
              )
            }
            className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500 ${
              errors.quantity
                ? "border-red-400"
                : "border-gray-200"
            }`}
          />

          {errors.quantity && (
            <p className="mt-1 text-xs text-red-500">
              {errors.quantity}
            </p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Priority
            <span className="text-red-500"> *</span>
          </label>

          <select
            value={values.priority}
            onChange={(e) =>
              handleChange(
                "priority",
                e.target.value
              )
            }
            className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-blue-500 ${
              errors.priority
                ? "border-red-400"
                : "border-gray-200"
            }`}
          >
            {ASSET_REQUEST_PRIORITIES.map(
              (priority) => (
                <option
                  key={priority}
                  value={priority}
                >
                  {priority}
                </option>
              )
            )}
          </select>

          {errors.priority && (
            <p className="mt-1 text-xs text-red-500">
              {errors.priority}
            </p>
          )}
        </div>

        {/* Reason */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Reason
            <span className="text-red-500"> *</span>
          </label>

          <textarea
            rows={4}
            value={values.reason}
            onChange={(e) =>
              handleChange(
                "reason",
                e.target.value
              )
            }
            placeholder="Enter reason for requesting the asset"
            className={`w-full resize-none rounded-lg border px-3 py-3 text-sm outline-none focus:border-blue-500 ${
              errors.reason
                ? "border-red-400"
                : "border-gray-200"
            }`}
          />

          {errors.reason && (
            <p className="mt-1 text-xs text-red-500">
              {errors.reason}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Submitting..."
            : "Submit Request"}
        </button>
      </div>
    </form>
  );
};

export default AssetRequestForm;