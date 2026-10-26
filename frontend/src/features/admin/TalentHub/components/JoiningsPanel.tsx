import { useMemo, useState, type FormEvent } from "react";
import {
  useConfirmJoiningMutation,
  useGetJoiningQuery,
  useGetJoiningsQuery,
  usePrepareJoiningMutation,
  useSendJoiningEmailForRecordMutation,
  useUpdateJoiningMutation,
} from "../api/recruitment.api";
import type {
  ConfirmJoiningRequest,
  JoiningEligibleCandidate,
  JoiningRecord,
} from "../types/recruitment.types";

type EmployeeForm = Record<string, string>;

const EMPTY_FORM: EmployeeForm = {
  employeeId: "",
  initialPassword: "",
  firstName: "",
  lastName: "",
  companyId: "",
  branchId: "",
  deptId: "",
  roleId: "",
  designationId: "",
  reportingManagerId: "",
  dob: "",
  genderId: "",
  employmentTypeId: "",
  employmentStatusId: "",
  maritalStatusId: "",
  grade: "",
  mobileNo: "",
  alternateMobileNo: "",
  emergencyNo: "",
  alternateEmail: "",
  aadhaarNumber: "",
  panNumber: "",
  uanNumber: "",
  pfNumber: "",
};

const REQUIRED_EMPLOYEE_FIELDS = [
  ["employeeId", "Employee ID"],
  ["initialPassword", "Initial password"],
  ["firstName", "First name"],
  ["companyId", "Company ID"],
  ["branchId", "Branch ID"],
  ["deptId", "Department ID"],
  ["roleId", "Role ID"],
  ["dob", "Date of birth"],
  ["genderId", "Gender ID"],
  ["employmentTypeId", "Employment type ID"],
  ["employmentStatusId", "Employment status ID"],
] as const;

const OPTIONAL_EMPLOYEE_FIELDS = [
  ["lastName", "Last name"],
  ["designationId", "Designation ID"],
  ["reportingManagerId", "Reporting manager Employee ID"],
  ["maritalStatusId", "Marital status ID"],
  ["grade", "Grade"],
  ["mobileNo", "Mobile number"],
  ["alternateMobileNo", "Alternate mobile"],
  ["emergencyNo", "Emergency number"],
  ["alternateEmail", "Alternate email"],
  ["aadhaarNumber", "Aadhaar number"],
  ["panNumber", "PAN number"],
  ["uanNumber", "UAN number"],
  ["pfNumber", "PF number"],
] as const;

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.map(String).join(", ");
    }
  }
  return error instanceof Error ? error.message : fallback;
}

function dateInputValue(value: string | Date | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function buildConfirmRequest(form: EmployeeForm): ConfirmJoiningRequest {
  const request: ConfirmJoiningRequest = {
    employeeId: form.employeeId.trim(),
    initialPassword: form.initialPassword,
    firstName: form.firstName.trim(),
    companyId: Number(form.companyId),
    branchId: Number(form.branchId),
    deptId: Number(form.deptId),
    roleId: Number(form.roleId),
    dob: form.dob,
    genderId: Number(form.genderId),
    employmentTypeId: Number(form.employmentTypeId),
    employmentStatusId: Number(form.employmentStatusId),
  };
  if (form.lastName.trim()) request.lastName = form.lastName.trim();
  if (form.designationId) request.designationId = Number(form.designationId);
  if (form.reportingManagerId.trim()) {
    request.reportingManagerId = form.reportingManagerId.trim();
  }
  if (form.maritalStatusId)
    request.maritalStatusId = Number(form.maritalStatusId);
  if (form.grade.trim()) request.grade = form.grade.trim();
  if (form.mobileNo.trim()) request.mobileNo = form.mobileNo.trim();
  if (form.alternateMobileNo.trim()) {
    request.alternateMobileNo = form.alternateMobileNo.trim();
  }
  if (form.emergencyNo.trim()) request.emergencyNo = form.emergencyNo.trim();
  if (form.alternateEmail.trim())
    request.alternateEmail = form.alternateEmail.trim();
  if (form.aadhaarNumber.trim())
    request.aadhaarNumber = form.aadhaarNumber.trim();
  if (form.panNumber.trim()) request.panNumber = form.panNumber.trim();
  if (form.uanNumber.trim()) request.uanNumber = form.uanNumber.trim();
  if (form.pfNumber.trim()) request.pfNumber = form.pfNumber.trim();
  return request;
}

export function JoiningsPanel() {
  const { data, error, isFetching } = useGetJoiningsQuery();
  const [prepareJoining, { isLoading: isPreparing }] =
    usePrepareJoiningMutation();
  const [updateJoining, { isLoading: isUpdating }] = useUpdateJoiningMutation();
  const [sendJoiningEmail, { isLoading: isSendingEmail }] =
    useSendJoiningEmailForRecordMutation();
  const [confirmJoining, { isLoading: isConfirming }] =
    useConfirmJoiningMutation();
  const [selectedJoiningId, setSelectedJoiningId] = useState<number | null>(
    null
  );
  const { data: selectedJoining } = useGetJoiningQuery(selectedJoiningId ?? 0, {
    skip: selectedJoiningId === null,
  });
  const [joiningDates, setJoiningDates] = useState<Record<number, string>>({});
  const [employeeForm, setEmployeeForm] = useState<EmployeeForm>(EMPTY_FORM);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const eligibleCandidates = useMemo(
    () => data?.eligible ?? [],
    [data?.eligible]
  );
  const prepared = useMemo(() => data?.prepared ?? [], [data?.prepared]);

  const handlePrepare = async (candidate: JoiningEligibleCandidate) => {
    const applicationId = Number(candidate.ApplicationID);
    const joiningDate = joiningDates[applicationId];
    setActionError("");
    setActionMessage("");
    if (!joiningDate) {
      setActionError("Choose a joining date before preparing the joining.");
      return;
    }
    setBusyId(applicationId);
    try {
      const record = await prepareJoining({
        applicationId,
        joiningDate,
      }).unwrap();
      setActionMessage(
        `Joining prepared for ${record.candidateName}. Employee code: ${
          record.employeeCode ?? "pending database setup"
        }.`
      );
    } catch (requestError) {
      setActionError(
        getErrorMessage(requestError, "Unable to prepare this joining.")
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDateUpdate = async (record: JoiningRecord) => {
    const joiningDate =
      joiningDates[record.id] ?? dateInputValue(record.joiningDate);
    setActionError("");
    setActionMessage("");
    setBusyId(record.id);
    try {
      await updateJoining({ id: record.id, body: { joiningDate } }).unwrap();
      setActionMessage(`Joining date updated for ${record.candidateName}.`);
    } catch (requestError) {
      setActionError(
        getErrorMessage(requestError, "Unable to update the joining date.")
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleSendEmail = async (record: JoiningRecord) => {
    setActionError("");
    setActionMessage("");
    setBusyId(record.id);
    try {
      const response = await sendJoiningEmail(record.id).unwrap();
      setActionMessage(response.message);
    } catch (requestError) {
      setActionError(
        getErrorMessage(requestError, "Unable to send the joining email.")
      );
    } finally {
      setBusyId(null);
    }
  };

  const openConfirmForm = (record: JoiningRecord) => {
    setSelectedJoiningId(record.id);
    setActionError("");
    const nameParts = record.candidateName.trim().split(/\s+/);
    setEmployeeForm({
      ...EMPTY_FORM,
      firstName: nameParts[0] ?? "",
      lastName: nameParts.slice(1).join(" "),
      mobileNo: record.candidatePhone ?? "",
    });
  };

  const submitConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedJoining) return;
    setActionError("");
    setActionMessage("");
    try {
      const response = await confirmJoining({
        id: selectedJoining.id,
        body: buildConfirmRequest(employeeForm),
      }).unwrap();
      setActionMessage(
        `Employee ${response.employeeId} created and joining confirmed (code ${response.employeeCode}).`
      );
      setSelectedJoiningId(null);
      setEmployeeForm(EMPTY_FORM);
    } catch (requestError) {
      setActionError(
        getErrorMessage(requestError, "Unable to confirm this joining.")
      );
    }
  };

  return (
    <section className="space-y-5">
      <header>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
          Recruitment workflow
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
          Joining
        </h2>
        <p className="mt-1.5 text-sm text-[#7b8981]">
          Prepare joining for candidates with accepted offers and cleared BGV,
          then create the employee profile when they join.
        </p>
      </header>

      {actionMessage && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {actionMessage}
        </p>
      )}
      {(actionError || error) && (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {actionError ||
            getErrorMessage(error, "Unable to load joining records.")}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#e6e8e3] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
        <div className="border-b border-[#eceee9] px-5 py-4">
          <h3 className="font-semibold text-[#354239]">Eligible candidates</h3>
          <p className="mt-1 text-xs text-[#7b8981]">
            Accepted offer and cleared background verification are required.
          </p>
        </div>
        {isFetching && (
          <p className="px-5 py-4 text-sm text-[#7b8981]">
            Loading candidates…
          </p>
        )}
        {!isFetching && eligibleCandidates.length === 0 && (
          <p className="px-5 py-5 text-sm text-[#7b8981]">
            No candidates are currently eligible for joining preparation.
          </p>
        )}
        <div className="relative">
          <div
            id="eligible-joining-candidates"
            className="max-h-[240px] min-w-0 touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain divide-y divide-[#eef0eb] [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {eligibleCandidates.map((candidate) => {
              const applicationId = Number(candidate.ApplicationID);
              return (
                <div
                  key={applicationId}
                  className="flex min-w-0 flex-col items-stretch gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#354239]">
                      {candidate.FullName}
                    </p>
                    <p className="mt-1 break-words text-xs text-[#7b8981]">
                      App-{applicationId} · {candidate.JobTitle} ·{" "}
                      {candidate.Email}
                    </p>
                  </div>
                  <div className="flex min-w-0 w-full items-center gap-2 sm:w-auto">
                    <input
                      type="date"
                      aria-label={`Joining date for ${candidate.FullName}`}
                      value={joiningDates[applicationId] ?? ""}
                      onChange={(event) =>
                        setJoiningDates((previous) => ({
                          ...previous,
                          [applicationId]: event.target.value,
                        }))
                      }
                      className="h-10 min-w-0 flex-1 rounded-lg border border-[#dfe4df] px-3 text-sm sm:flex-none"
                    />
                    <button
                      type="button"
                      onClick={() => void handlePrepare(candidate)}
                      disabled={isPreparing || busyId === applicationId}
                      className="h-10 shrink-0 rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {busyId === applicationId ? "Preparing…" : "Prepare"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e6e8e3] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
        <div className="border-b border-[#eceee9] px-5 py-4">
          <h3 className="font-semibold text-[#354239]">Prepared joinings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse whitespace-nowrap text-left">
            <thead>
              <tr className="bg-[#f8f9f7] text-[11px] uppercase tracking-wide text-[#758078]">
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Employee code</th>
                <th className="px-4 py-3">Joining date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prepared.map((record) => (
                <tr
                  key={record.id}
                  className="border-t border-[#eef0eb] odd:bg-white even:bg-[#fffaf0] transition-colors hover:bg-[#f3e4c5]"
                >
                  <td className="px-4 py-3 text-xs text-[#344138]">
                    <strong>{record.candidateName}</strong>
                    <span className="ml-2 text-[#7b8981]">
                      App-{record.applicationId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#344138]">
                    {record.position}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#344138]">
                    {record.employeeCode ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      aria-label={`Joining date for ${record.candidateName}`}
                      value={
                        joiningDates[record.id] ??
                        dateInputValue(record.joiningDate)
                      }
                      disabled={record.status === "confirmed"}
                      onChange={(event) =>
                        setJoiningDates((previous) => ({
                          ...previous,
                          [record.id]: event.target.value,
                        }))
                      }
                      className="h-9 rounded-lg border border-[#dfe4df] px-2 text-xs disabled:bg-[#f5f6f4]"
                    />
                  </td>
                  <td className="px-4 py-3 text-xs capitalize text-[#344138]">
                    {record.status}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {record.status !== "confirmed" && (
                        <>
                          <button
                            type="button"
                            onClick={() => void handleDateUpdate(record)}
                            disabled={isUpdating || busyId === record.id}
                            className="rounded-lg border border-[#dfe4df] px-2.5 py-2 text-xs font-semibold text-[#58655c] disabled:opacity-60"
                          >
                            Save date
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleSendEmail(record)}
                            disabled={isSendingEmail || busyId === record.id}
                            className="rounded-lg border border-[#dfe4df] px-2.5 py-2 text-xs font-semibold text-[#58655c] disabled:opacity-60"
                          >
                            Send email
                          </button>
                          <button
                            type="button"
                            onClick={() => openConfirmForm(record)}
                            className="rounded-lg bg-[#38634a] px-2.5 py-2 text-xs font-semibold text-white"
                          >
                            Confirm joining
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!isFetching && prepared.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-sm text-[#7b8981]"
                  >
                    No prepared joining records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedJoining && (
        <form
          onSubmit={(event) => void submitConfirm(event)}
          className="space-y-4 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)]"
        >
          <div>
            <h3 className="font-semibold text-[#354239]">
              Create employee for {selectedJoining.candidateName}
            </h3>
            <p className="mt-1 text-xs text-[#7b8981]">
              Candidate email: {selectedJoining.candidateEmail}. Employee code
              generated at preparation:{" "}
              {selectedJoining.employeeCode ?? "will be generated"}. Employee
              ID, password, and organization/profile IDs are required.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REQUIRED_EMPLOYEE_FIELDS.map(([key, label]) => (
              <label
                key={key}
                className="space-y-1 text-xs font-medium text-[#46534a]"
              >
                {label}
                <input
                  required
                  type={
                    key === "dob"
                      ? "date"
                      : key === "initialPassword"
                      ? "password"
                      : [
                          "companyId",
                          "branchId",
                          "deptId",
                          "roleId",
                          "genderId",
                          "employmentTypeId",
                          "employmentStatusId",
                        ].includes(key)
                      ? "number"
                      : "text"
                  }
                  min={
                    key.endsWith("Id") ||
                    key === "companyId" ||
                    key === "branchId"
                      ? 1
                      : undefined
                  }
                  value={employeeForm[key] ?? ""}
                  onChange={(event) =>
                    setEmployeeForm((previous) => ({
                      ...previous,
                      [key]: event.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-lg border border-[#dfe4df] px-3 text-sm"
                />
              </label>
            ))}
            {OPTIONAL_EMPLOYEE_FIELDS.map(([key, label]) => (
              <label
                key={key}
                className="space-y-1 text-xs font-medium text-[#46534a]"
              >
                {label}
                <input
                  type={
                    key === "alternateEmail"
                      ? "email"
                      : key === "designationId" || key === "maritalStatusId"
                      ? "number"
                      : "text"
                  }
                  min={key.endsWith("Id") ? 1 : undefined}
                  value={employeeForm[key] ?? ""}
                  onChange={(event) =>
                    setEmployeeForm((previous) => ({
                      ...previous,
                      [key]: event.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-lg border border-[#dfe4df] px-3 text-sm"
                />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isConfirming}
              className="h-10 rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isConfirming
                ? "Creating employee…"
                : "Create employee and confirm"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedJoiningId(null)}
              className="h-10 rounded-lg border border-[#dfe4df] px-4 text-sm font-semibold text-[#58655c]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
