import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Camera,
  MapPin,
} from "lucide-react";

import type {
  PunchRecordCardProps,
} from "../types/punch.types";

export default function PunchRecordCard({
  record,
  correctedTime,
  remarks,
  isSaving,
  onCorrectedTimeChange,
  onRemarksChange,
  onSave,
}: PunchRecordCardProps) {
  const isIn =
    record.direction === "IN";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              isIn
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isIn ? (
              <ArrowDownToLine className="h-4 w-4" />
            ) : (
              <ArrowUpFromLine className="h-4 w-4" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              {record.direction}
            </p>

            <p className="text-xs text-gray-400">
              Punch ID:{" "}
              {record.punchId}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
          {record.device || "-"}
        </span>
      </div>

      {/* Time */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Original Time
          </label>

          <input
            type="time"
            value={
              record.originalTime ||
              ""
            }
            disabled
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Corrected Time
          </label>

          <input
            type="time"
            value={correctedTime}
            onChange={(event) =>
              onCorrectedTimeChange(
                event.target.value,
              )
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Remarks */}
      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-gray-500">
          Remarks
        </label>

        <input
          type="text"
          value={remarks}
          onChange={(event) =>
            onRemarksChange(
              event.target.value,
            )
          }
          placeholder="Enter remarks"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* Location / Selfie */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />

          {record.location ||
            record.latitude !==
              null
            ? "Location Available"
            : "Location Unavailable"}
        </span>

        <span className="flex items-center gap-1">
          <Camera className="h-4 w-4" />

          {record.selfieUrl
            ? "Selfie Available"
            : "Selfie Unavailable"}
        </span>
      </div>

      {/* Update */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : "Update"}
        </button>
      </div>
    </div>
  );
}