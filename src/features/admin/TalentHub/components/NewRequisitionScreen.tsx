import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  getApiErrorMessage,
  useCreateRequisitionMutation,
  useGetRequisitionMasterQuery,
} from "../hooks/useRecruitment";

const fieldClass =
  "h-10 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm text-[#354239] outline-none placeholder:text-[#929c95] focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 disabled:cursor-not-allowed disabled:bg-[#f5f7f5] disabled:opacity-70";

function RequisitionField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-semibold text-[#46534a]">
      <span>{label}</span>
      {children}
    </label>
  );
}

// POST /recruitment/requisition responds with:
// [{ StatusCode: 1, Message: "...", RequisitionNo: "REQ-HYD-IT-2026-005", StatusID: 14 }]
function readCreateRequisitionResult(response: unknown) {
  const record = Array.isArray(response) ? response[0] : response;
  const row =
    record && typeof record === "object"
      ? (record as Record<string, unknown>)
      : {};

  const statusCode = Number(row.StatusCode ?? row.statusCode ?? 1);
  const message = String(
    row.Message ?? row.message ?? "Job requisition created successfully.",
  );
  const requisitionNo = String(row.RequisitionNo ?? row.requisitionNo ?? "");

  return {
    statusCode: Number.isFinite(statusCode) ? statusCode : 1,
    message,
    requisitionNo,
  };
}

interface BranchOption {
  id: number;
  name: string;
  state: string;
  isActive: boolean;
}

interface DesignationOption {
  id: number;
  name: string;
}

const NO_BRANCHES: BranchOption[] = [];
const NO_DESIGNATIONS: DesignationOption[] = [];

function masterValue(row: Record<string, unknown>, aliases: string[]) {
  const aliasSet = new Set(aliases.map((alias) => alias.toLowerCase()));
  return Object.entries(row).find(([key]) =>
    aliasSet.has(key.toLowerCase()),
  )?.[1];
}

function requiredMasterText(
  row: Record<string, unknown>,
  aliases: string[],
  entity: string,
) {
  const value = masterValue(row, aliases);
  if (value === undefined || value === null || value === "") {
    throw new Error(`Requisition master returned a ${entity} without ${aliases[0]}.`);
  }
  return String(value);
}

function requiredMasterId(
  row: Record<string, unknown>,
  aliases: string[],
  entity: string,
) {
  const id = Number(masterValue(row, aliases));
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Requisition master returned a ${entity} without a valid ID.`);
  }
  return id;
}

function isActiveMasterRecord(row: Record<string, unknown>) {
  const value = masterValue(row, ["IsActive", "Active", "Status"]);
  if (value === undefined || value === null || value === "") return true;
  if (value === true || value === 1 || value === "1") return true;
  return typeof value === "string" && value.toLowerCase() === "active";
}

export function NewRequisitionScreen({
  onCreated,
  onClose,
}: {
  onCreated: () => Promise<void>;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { domain } = useParams<{ domain: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createRequisition] = useCreateRequisitionMutation();

  const {
    data: masterResponse,
    error: masterQueryError,
    isFetching: isLoadingMasters,
    refetch: refetchRequisitionMaster,
  } = useGetRequisitionMasterQuery();

  const masters = useMemo(() => {
    if (!masterResponse) return undefined;
    try {
      if (!masterResponse.success || !masterResponse.data) {
        throw new Error("Requisition master returned an unsuccessful response.");
      }
      if (
        !Array.isArray(masterResponse.data.branches) ||
        !Array.isArray(masterResponse.data.designations)
      ) {
        throw new Error("Requisition master did not return branches and designations.");
      }

      const branches: BranchOption[] = masterResponse.data.branches.map(
        (branch) => ({
          id: requiredMasterId(
            branch,
            ["BranchID", "BranchId", "ID", "Id"],
            "branch",
          ),
          name: requiredMasterText(
            branch,
            ["BranchName", "Name"],
            "branch",
          ),
          state: String(
            masterValue(branch, ["StateName", "State", "StateCode"]) ?? "",
          ),
          isActive: isActiveMasterRecord(branch),
        }),
      );
      const designations: DesignationOption[] =
        masterResponse.data.designations.map((designation) => ({
          id: requiredMasterId(
            designation,
            ["DesignationID", "DesignationId", "ID", "Id"],
            "designation",
          ),
          name: requiredMasterText(
            designation,
            ["DesignationName", "Name"],
            "designation",
          ),
        }));

      return { branches, designations, error: "" };
    } catch (loadError) {
      return {
        branches: NO_BRANCHES,
        designations: NO_DESIGNATIONS,
        error:
          loadError instanceof Error
            ? loadError.message
            : "Unable to load requisition master data.",
      };
    }
  }, [masterResponse]);

  const branches = masters?.branches ?? NO_BRANCHES;
  const designations = masters?.designations ?? NO_DESIGNATIONS;
  // Hide a stale error while a retry is in flight
  const masterError = isLoadingMasters
    ? ""
    : masterQueryError
      ? getApiErrorMessage(
          masterQueryError,
          "Unable to load requisition master data.",
        )
      : (masters?.error ?? "");

  const activeBranches = branches.filter((branch) => branch.isActive);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const jobTitle = String(formData.get("jobTitle") ?? "").trim();
    const branchId = Number(formData.get("branchId"));
    const designationId = Number(formData.get("designationId"));
    const vacancies = Number(formData.get("vacancies"));
    const salaryRangeMinText = String(formData.get("salaryRangeMin") ?? "");
    const salaryRangeMaxText = String(formData.get("salaryRangeMax") ?? "");
    const experienceRequired = String(
      formData.get("experienceRequired") ?? "",
    ).trim();
    const priority = Number(formData.get("priority"));

    if (
      !jobTitle ||
      !Number.isInteger(branchId) ||
      !Number.isInteger(designationId) ||
      !Number.isInteger(vacancies) ||
      vacancies < 1 ||
      !Number.isInteger(priority) ||
      priority < 0
    ) {
      setError("Complete all required fields with valid values.");
      return;
    }

    const salaryRangeMin =
      salaryRangeMinText === "" ? undefined : Number(salaryRangeMinText);
    const salaryRangeMax =
      salaryRangeMaxText === "" ? undefined : Number(salaryRangeMaxText);
    if (
      (salaryRangeMin !== undefined &&
        (!Number.isFinite(salaryRangeMin) || salaryRangeMin < 0)) ||
      (salaryRangeMax !== undefined &&
        (!Number.isFinite(salaryRangeMax) || salaryRangeMax < 0)) ||
      (salaryRangeMin !== undefined &&
        salaryRangeMax !== undefined &&
        salaryRangeMax < salaryRangeMin)
    ) {
      setError("Enter a valid salary range; the maximum must be at least the minimum.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createRequisition({
        branchId,
        designationId,
        jobTitle,
        vacancies,
        ...(salaryRangeMin !== undefined ? { salaryRangeMin } : {}),
        ...(salaryRangeMax !== undefined ? { salaryRangeMax } : {}),
        ...(experienceRequired ? { experienceRequired } : {}),
        priority,
      }).unwrap();

      const result = readCreateRequisitionResult(response);
      // StatusCode 1 = created; 0 or negative = business-rule failure from the API
      if (result.statusCode <= 0) {
        throw new Error(result.message || "Unable to create requisition.");
      }

      toast.success(
        result.requisitionNo
          ? `${result.message} (${result.requisitionNo})`
          : result.message,
      );

      await onCreated();
      navigate(`/${domain}/admin/talent-hub/recruitment/requisition-approval`);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to create requisition."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-requisition-title"
        className="my-auto max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#efeee9] pb-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#a56a0a]">
              Recruitment
            </p>
            <h1 id="new-requisition-title" className="text-xl font-bold text-[#26332c]">
              New job requisition
            </h1>
            <p className="mt-1 text-xs text-[#7b8981]">
              Company is taken from your signed-in account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close requisition form"
            className="rounded-lg p-2 text-[#78867e] transition hover:bg-[#f1f4f1] hover:text-[#354239] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
        <RequisitionField label="Job title">
          <input
            name="jobTitle"
            required
            maxLength={100}
            autoFocus
            placeholder="e.g. Backend Developer"
            className={fieldClass}
          />
        </RequisitionField>

        <div className="grid gap-4 sm:grid-cols-2">
          <RequisitionField label="Branch">
            <select
              name="branchId"
              required
              defaultValue=""
              disabled={isLoadingMasters || Boolean(masterError)}
              className={fieldClass}
            >
              <option value="" disabled>
                {isLoadingMasters ? "Loading branches..." : "Select branch"}
              </option>
              {branches.map((branch) => {
                return (
                  <option
                    key={branch.id}
                    value={branch.id}
                    disabled={!branch.isActive}
                  >
                    {branch.name}
                    {branch.state ? ` — ${branch.state}` : ""}
                    {branch.isActive ? " (Active)" : " (Inactive)"}
                  </option>
                );
              })}
            </select>
          </RequisitionField>
          <RequisitionField label="Designation">
            <select
              name="designationId"
              required
              defaultValue=""
              disabled={isLoadingMasters || Boolean(masterError)}
              className={fieldClass}
            >
              <option value="" disabled>
                {isLoadingMasters
                  ? "Loading designations..."
                  : "Select designation"}
              </option>
              {designations.map((designation) => (
                <option key={designation.id} value={designation.id}>
                  {designation.name}
                </option>
              ))}
            </select>
          </RequisitionField>
        </div>

        {masterError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            <span>
              Branch and designation master data could not be loaded: {masterError}
            </span>
            <button
              type="button"
              onClick={() => void refetchRequisitionMaster()}
              className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            >
              Retry lookups
            </button>
          </div>
        )}
        {!isLoadingMasters &&
          !masterError &&
          activeBranches.length === 0 && (
            <p role="alert" className="text-sm font-medium text-amber-700">
              No active branches are available. Add a branch before creating a requisition.
            </p>
          )}
        {!isLoadingMasters &&
          !masterError &&
          designations.length === 0 && (
            <p role="alert" className="text-sm font-medium text-amber-700">
              No designations are available. Add a designation before creating a requisition.
            </p>
          )}

        <div className="grid gap-4 sm:grid-cols-2">
          <RequisitionField label="Vacancies">
            <input
              name="vacancies"
              type="number"
              min="1"
              step="1"
              required
              defaultValue="1"
              className={fieldClass}
            />
          </RequisitionField>
          <RequisitionField label="Priority">
            <input
              name="priority"
              type="number"
              min="0"
              step="1"
              required
              defaultValue="1"
              className={fieldClass}
            />
          </RequisitionField>
        </div>

        <RequisitionField label="Experience required">
          <input
            name="experienceRequired"
            maxLength={50}
            placeholder="e.g. 2-4 Years"
            className={fieldClass}
          />
        </RequisitionField>

        <div className="grid gap-4 sm:grid-cols-2">
          <RequisitionField label="Minimum salary (₹)">
            <input
              name="salaryRangeMin"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 50000"
              className={fieldClass}
            />
          </RequisitionField>
          <RequisitionField label="Maximum salary (₹)">
            <input
              name="salaryRangeMax"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 80000"
              className={fieldClass}
            />
          </RequisitionField>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-2 border-t border-[#edf0ed] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 rounded-lg border border-[#dce4de] px-4 text-sm font-semibold text-[#344139] hover:bg-[#f7f9f7] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              isLoadingMasters ||
              Boolean(masterError) ||
              activeBranches.length === 0 ||
              designations.length === 0
            }
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#e5a538] px-4 text-sm font-semibold text-[#342712] hover:bg-[#d99a2b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit requisition"}
          </button>
        </div>
        </form>
      </section>
    </div>
  );
}
