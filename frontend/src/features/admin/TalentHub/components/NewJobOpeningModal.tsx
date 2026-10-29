import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ChevronDown, X } from "lucide-react";

import {
  useCreateJobOpeningMutation,
  useGetJobOpeningRequisitionsQuery,
  useLazyGetJobOpeningsQuery,
  usePublishJobOpeningMutation,
} from "../api/recruitment.api";
import { formInputClass } from "../constants/recruitment.constants";
import type { JobOpeningsApiResponse } from "../types/recruitment.types";
import { getApiErrorMessage } from "../utils/recruitmentErrors";
import { FormField } from "./RecruitmentShared";

type RequisitionOption = {
  id: number;
  requisitionNo: string;
  title: string;
  department: string;
};

type RequisitionRow = Record<string, unknown>;

function readValue(row: RequisitionRow, aliases: string[]): unknown {
  const normalizedAliases = new Set(aliases.map((alias) => alias.toLowerCase()));
  return Object.entries(row).find(([key]) =>
    normalizedAliases.has(key.toLowerCase()),
  )?.[1];
}

function readText(row: RequisitionRow, aliases: string[], fallback: string) {
  const value = readValue(row, aliases);
  return value === null || value === undefined || value === ""
    ? fallback
    : String(value);
}

function rowsFromResponse(response: unknown): RequisitionRow[] {
  let rows: unknown;
  if (Array.isArray(response)) {
    rows = response;
  } else if (response && typeof response === "object" && "data" in response) {
    rows = response.data;
  }
  if (!Array.isArray(rows)) return [];
  return rows.filter(
    (row): row is RequisitionRow =>
      Boolean(row) && typeof row === "object" && !Array.isArray(row),
  );
}

function jobOpeningRequisitionOptions(response: unknown): RequisitionOption[] {
  return rowsFromResponse(response).flatMap((row) => {
    const id = Number(readValue(row, ["RequisitionID", "ID"]));
    if (!Number.isInteger(id) || id <= 0) {
      return [];
    }

    return [{
      id,
      requisitionNo: readText(
        row,
        ["RequisitionNo", "RequisitionNumber"],
        `REQ-${id}`,
      ),
      title: readText(
        row,
        ["JobTitle", "Title", "DesignationName", "Position"],
        "Job requisition",
      ),
      department: readText(row, ["DepartmentName", "Department"], ""),
    }];
  });
}

function readOpeningId(value: unknown): number | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const id = readOpeningId(item);
      if (id !== null) return id;
    }
    return null;
  }
  if (!value || typeof value !== "object") return null;

  const row = value as RequisitionRow;
  const directId = Number(readValue(row, ["JobOpeningID", "OpeningID"]));
  if (Number.isInteger(directId) && directId > 0) return directId;

  for (const key of ["data", "recordset", "recordsets"]) {
    if (key in row) {
      const nestedId = readOpeningId(row[key]);
      if (nestedId !== null) return nestedId;
    }
  }
  return null;
}

function storedProcedureFailure(value: unknown): string | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const failure = storedProcedureFailure(item);
      if (failure) return failure;
    }
    return null;
  }
  if (!value || typeof value !== "object") return null;

  const row = value as RequisitionRow;
  if (row.success === false) {
    return readText(row, ["message", "Message"], "The request was not completed.");
  }

  const statusCode = Number(readValue(row, ["StatusCode", "statusCode"]));
  if (
    Number.isFinite(statusCode) &&
    (statusCode <= 0 || statusCode >= 400)
  ) {
    return readText(row, ["Message", "message"], "The request was not completed.");
  }

  for (const key of ["data", "recordset", "recordsets"]) {
    if (key in row) {
      const failure = storedProcedureFailure(row[key]);
      if (failure) return failure;
    }
  }
  return null;
}

function findOpeningIdForRequisition(
  response: JobOpeningsApiResponse,
  requisitionId: number,
): number | null {
  const rows = rowsFromResponse(response);
  const opening = rows.find(
    (row) =>
      Number(readValue(row, ["RequisitionID", "RequisitionId"])) ===
      requisitionId,
  );
  return opening ? readOpeningId(opening) : null;
}

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface NewJobOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished: () => void;
}

export function NewJobOpeningModal({
  isOpen,
  onClose,
  onPublished,
}: NewJobOpeningModalProps) {
  const {
    data: requisitionsResponse,
    error: requisitionsError,
    isFetching: requisitionsLoading,
  } = useGetJobOpeningRequisitionsQuery(undefined, { skip: !isOpen });
  const [createJobOpening, { isLoading: isCreating }] =
    useCreateJobOpeningMutation();
  const [publishJobOpening, { isLoading: isPublishing }] =
    usePublishJobOpeningMutation();
  const [getJobOpenings] = useLazyGetJobOpeningsQuery();
  const [requisitionId, setRequisitionId] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [createdOpeningId, setCreatedOpeningId] = useState<number | null>(null);
  const [openingCreated, setOpeningCreated] = useState(false);
  const [formError, setFormError] = useState("");
  const [isRequisitionDropdownOpen, setIsRequisitionDropdownOpen] =
    useState(false);
  const requisitionDropdownRef = useRef<HTMLDivElement>(null);
  const requisitions = useMemo(
    () => jobOpeningRequisitionOptions(requisitionsResponse),
    [requisitionsResponse],
  );
  const isSubmitting = isCreating || isPublishing;
  const today = localDateString(new Date());
  const selectedRequisition = requisitions.find(
    (requisition) => String(requisition.id) === requisitionId,
  );

  useEffect(() => {
    if (!isRequisitionDropdownOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !requisitionDropdownRef.current?.contains(event.target)
      ) {
        setIsRequisitionDropdownOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsRequisitionDropdownOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isRequisitionDropdownOpen]);

  const close = () => {
    if (!isSubmitting) {
      setFormError("");
      onClose();
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const selectedRequisitionId = Number(requisitionId);

    if (!Number.isInteger(selectedRequisitionId) || selectedRequisitionId <= 0) {
      setFormError("Select an approved requisition.");
      return;
    }
    if (!closingDate || closingDate < today) {
      setFormError("Choose a closing date that is today or later.");
      return;
    }

    let openingId = createdOpeningId;
    if (!openingCreated) {
      let createResponse: unknown;
      try {
        createResponse = await createJobOpening(
          selectedRequisitionId,
        ).unwrap();
        const createFailure = storedProcedureFailure(createResponse);
        if (createFailure) throw new Error(createFailure);
      } catch (error: unknown) {
        setFormError(
          getApiErrorMessage(error, "Unable to create the job opening."),
        );
        return;
      }

      setOpeningCreated(true);
      openingId = readOpeningId(createResponse);
      if (openingId !== null) setCreatedOpeningId(openingId);
    }

    if (openingId === null) {
      try {
        const openingsResponse = await getJobOpenings().unwrap();
        openingId = findOpeningIdForRequisition(
          openingsResponse,
          selectedRequisitionId,
        );
      } catch (error: unknown) {
        setFormError(
          `The job opening was created, but its ID could not be retrieved. ${getApiErrorMessage(
            error,
            "Refresh Job Openings before continuing.",
          )}`,
        );
        return;
      }
      if (openingId === null) {
        setFormError(
          "The job opening was created, but its ID was not returned. Retry to look it up before publishing.",
        );
        return;
      }
      setCreatedOpeningId(openingId);
    }

    try {
      const publishResponse = await publishJobOpening({
        jobOpeningId: openingId,
        closingDate,
      }).unwrap();
      const publishFailure = storedProcedureFailure(publishResponse);
      if (publishFailure) throw new Error(publishFailure);
      onPublished();
      setCreatedOpeningId(null);
      setOpeningCreated(false);
      setRequisitionId("");
      setClosingDate("");
      onClose();
    } catch (error: unknown) {
      setFormError(
        `The job opening was created, but publishing failed. Retry to publish without creating another opening. ${getApiErrorMessage(error, "Please try again.")}`,
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-opening-title"
        className="my-auto h-[400px] max-h-[88vh] w-full max-w-xl shrink-0 overflow-visible rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="new-opening-title" className="text-xl font-bold">
              New job opening
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#78867e]">
              Select an approved requisition and set the application closing
              date. The publish date is recorded automatically when published.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            disabled={isSubmitting}
            aria-label="Close new job opening form"
            className="rounded-lg p-2 text-[#78867e] hover:bg-[#f1f4f1] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(event) => void submit(event)} className="space-y-4">
          <FormField label="Approved requisition">
            <div className="relative" ref={requisitionDropdownRef}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isRequisitionDropdownOpen}
                aria-controls="job-opening-requisition-options"
                disabled={
                  requisitionsLoading ||
                  openingCreated ||
                  requisitions.length === 0
                }
                onClick={() =>
                  setIsRequisitionDropdownOpen((open) => !open)
                }
                className={`${formInputClass} flex items-center justify-between text-left font-normal`}
              >
                <span className="truncate">
                  {selectedRequisition
                    ? `${selectedRequisition.id} · ${selectedRequisition.requisitionNo} · ${selectedRequisition.title}${selectedRequisition.department ? ` (${selectedRequisition.department})` : ""}`
                    : requisitionsLoading
                      ? "Loading requisitions..."
                      : "Select requisition ID"}
                </span>
                <ChevronDown
                  className={`ml-2 h-4 w-4 shrink-0 transition-transform ${
                    isRequisitionDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isRequisitionDropdownOpen && (
                <div
                  id="job-opening-requisition-options"
                  role="listbox"
                  aria-label="Approved requisitions"
                  className="absolute z-20 mt-1 max-h-[180px] w-full overflow-y-auto rounded-lg border border-[#dfe4df] bg-white py-1 shadow-lg"
                >
                  {requisitions.map((requisition) => {
                    const isSelected =
                      String(requisition.id) === requisitionId;
                    return (
                      <button
                        key={requisition.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setRequisitionId(String(requisition.id));
                          setIsRequisitionDropdownOpen(false);
                        }}
                        className={`block min-h-9 w-full px-3 py-2 text-left text-sm font-normal ${
                          isSelected
                            ? "bg-[#fff4dc] text-[#80540d]"
                            : "text-[#354239] hover:bg-[#f5f7f5]"
                        }`}
                      >
                        {requisition.id} · {requisition.requisitionNo} ·{" "}
                        {requisition.title}
                        {requisition.department
                          ? ` (${requisition.department})`
                          : ""}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </FormField>

          {requisitionsError && (
            <p role="alert" className="text-sm text-[#bd4b3d]">
              {getApiErrorMessage(
                requisitionsError,
                "Unable to load requisitions.",
              )}
            </p>
          )}
          {!requisitionsLoading &&
            !requisitionsError &&
            requisitions.length === 0 && (
              <p className="text-sm text-[#78867e]">
                No requisitions are available for job opening creation.
              </p>
            )}

          <FormField label="Closing date">
            <input
              type="date"
              value={closingDate}
              onChange={(event) => setClosingDate(event.target.value)}
              min={today}
              required
              className={formInputClass}
            />
          </FormField>

          {formError && (
            <p role="alert" className="text-sm font-medium text-[#bd4b3d]">
              {formError}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2 border-t border-[#edf0ed] pt-4">
            <button
              type="button"
              onClick={close}
              disabled={isSubmitting}
              className="h-10 rounded-lg border border-[#dce4de] px-4 text-sm font-semibold text-[#344139] hover:bg-[#f7f9f7] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                requisitionsLoading ||
                (!openingCreated && requisitions.length === 0)
              }
              className="h-10 rounded-lg bg-[#e5a538] px-4 text-sm font-semibold text-[#342712] hover:bg-[#d99a2b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating
                ? "Creating opening..."
                : isPublishing
                  ? "Publishing..."
                  : openingCreated
                    ? "Retry publish"
                    : "Create and publish"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
