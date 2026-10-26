import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  recruitmentFileUrl,
  useGetCandidateApplicationsQuery,
} from "@/features/admin/TalentHub/api/recruitment.api";
import { RecruitmentPagination } from "@/features/admin/TalentHub/components/RecruitmentPagination";

type CandidateRecord = Record<string, unknown>;

function asRecord(value: unknown): CandidateRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as CandidateRecord;
}

function fieldValue(record: CandidateRecord, ...aliases: string[]) {
  const normalizedAliases = new Set(
    aliases.map((alias) => alias.toLowerCase().replace(/[^a-z0-9]/g, ""))
  );
  const entry = Object.entries(record).find(([key]) =>
    normalizedAliases.has(key.toLowerCase().replace(/[^a-z0-9]/g, ""))
  );
  return entry?.[1];
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function candidateName(record: CandidateRecord) {
  return displayValue(
    fieldValue(
      record,
      "FullName",
      "CandidateName",
      "CandidateFullName",
      "ApplicantName",
      "Name"
    )
  );
}

function candidateKey(record: CandidateRecord, index: number) {
  return displayValue(
    fieldValue(
      record,
      "ApplicationID",
      "CandidateApplicationID",
      "ApplicationId",
      "CandidateID",
      "CandidateId",
      "Email"
    )
  ) === "—"
    ? `candidate-${index}`
    : displayValue(
        fieldValue(
          record,
          "ApplicationID",
          "CandidateApplicationID",
          "ApplicationId",
          "CandidateID",
          "CandidateId",
          "Email"
        )
      );
}

function fieldLabel(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\bID\b/g, "ID")
    .replace(/\bURL\b/g, "URL")
    .replace(/\s+/g, " ")
    .trim();
}

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.map(String).join(", ");
    }
  }
  return error instanceof Error
    ? error.message
    : "Unable to load recruitment records.";
}

export default function EmployeeRecruitmentPage() {
  const { data, error, isLoading, isFetching, refetch } =
    useGetCandidateApplicationsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const records = useMemo(
    () =>
      (Array.isArray(data) ? data : [])
        .map((value, index) => {
          const record = asRecord(value);
          return record ? { key: candidateKey(record, index), record } : null;
        })
        .filter(
          (entry): entry is { key: string; record: CandidateRecord } =>
            entry !== null
        ),
    [data]
  );
  const filteredRecords = records.filter(({ record }) => {
    const normalizedSearch = search.trim().toLowerCase();
    return (
      !normalizedSearch ||
      Object.values(record).some((value) =>
        displayValue(value).toLowerCase().includes(normalizedSearch)
      )
    );
  });
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const selected =
    filteredRecords.find(({ key }) => key === selectedKey)?.record ?? null;

  return (
    <main className="recruitment-font-scale space-y-6 p-3">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
            Review
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#26332c]">
            Recruitment
          </h1>
          <p className="mt-1.5 text-sm text-[#7b8981]">
            Candidate applications and the latest recruitment information.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-sm font-semibold text-[#566258] hover:bg-[#f8faf8] disabled:opacity-60"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[#e6e8e3] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
        <div className="border-b border-[#eceee9] p-4">
          <label className="relative block w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#88938c]" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
                setSelectedKey(null);
              }}
              placeholder="Search candidates, jobs, or status"
              aria-label="Search candidate applications"
              className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#d8a43b]"
            />
          </label>
        </div>
        {isLoading ? (
          <p role="status" className="p-6 text-sm text-[#78867e]">
            Loading recruitment records...
          </p>
        ) : error ? (
          <p role="alert" className="p-6 text-sm text-rose-700">
            {errorMessage(error)}
          </p>
        ) : filteredRecords.length === 0 ? (
          <p className="p-6 text-sm text-[#78867e]">
            {records.length === 0
              ? "No candidate applications are available."
              : "No applications match your search."}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    {[
                      "Application",
                      "Candidate",
                      "Position",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="bg-[#f8f9f7] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#758078] first:pl-5"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRecords.map(({ key, record }) => (
                    <tr
                      key={key}
                      className="odd:bg-white even:bg-[#fffaf0] hover:bg-[#f3e4c5]"
                    >
                      <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138] first:pl-5">
                        {displayValue(
                          fieldValue(
                            record,
                            "ApplicationID",
                            "CandidateApplicationID",
                            "ApplicationId",
                            "ApplicationNumber",
                            "ApplicationNo"
                          )
                        )}
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs font-semibold text-[#344138]">
                        {candidateName(record)}
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                        {displayValue(
                          fieldValue(
                            record,
                            "JobTitle",
                            "Position",
                            "OpeningTitle",
                            "JobOpeningTitle",
                            "Designation"
                          )
                        )}
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                        {displayValue(
                          fieldValue(
                            record,
                            "ApplicationStatus",
                            "CandidateStatus",
                            "CurrentStage",
                            "Status",
                            "StatusName",
                            "Stage"
                          )
                        )}
                      </td>
                      <td className="border-t border-[#eef0eb] px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => setSelectedKey(key)}
                          className="rounded-lg border border-[#e5d7b8] bg-[#fffaf0] px-3 py-1.5 text-xs font-semibold text-[#80540d] hover:bg-[#fff3d6]"
                        >
                          View / Action
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <RecruitmentPagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={filteredRecords.length}
              totalPages={totalPages}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                setSelectedKey(null);
              }}
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize);
                setPage(1);
                setSelectedKey(null);
              }}
            />
          </>
        )}
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#202a26]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedKey(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-recruitment-details-title"
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[#efeee9] bg-white px-5 py-4">
              <div>
                <h2
                  id="employee-recruitment-details-title"
                  className="font-bold text-[#26332c]"
                >
                  {candidateName(selected)}
                </h2>
                <p className="mt-1 text-xs text-[#78867e]">
                  Candidate application details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedKey(null)}
                aria-label="Close candidate details"
                className="rounded-lg p-2 text-[#7e8981] hover:bg-[#f5f4ef]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
              {Object.entries(selected).map(([key, value]) => {
                const renderedValue = displayValue(value);
                const isResumeField = /resume|cv|curriculumvitae/i.test(key);
                const extension = displayValue(
                  fieldValue(
                    selected,
                    "FileExtension",
                    "ResumeFileExtension",
                    "ResumeExtension",
                    "ActualFileName"
                  )
                );
                return (
                  <div key={key} className="border-b border-[#f0f0eb] py-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                      {fieldLabel(key)}
                    </dt>
                    <dd className="mt-1 break-words text-sm font-medium text-[#354239] [overflow-wrap:anywhere]">
                      {isResumeField && renderedValue !== "—" ? (
                        <a
                          href={recruitmentFileUrl(
                            renderedValue,
                            extension === "—" ? undefined : extension
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#a87519] hover:text-[#80540d]"
                        >
                          View resume
                        </a>
                      ) : (
                        renderedValue
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        </div>
      )}
    </main>
  );
}
