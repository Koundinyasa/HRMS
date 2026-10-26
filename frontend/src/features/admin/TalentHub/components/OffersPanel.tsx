import { useState, type FormEvent } from "react";
import { FileText, Plus, RotateCcw, Search, X } from "lucide-react";
import {
  useCreateOfferMutation,
  useExtendOfferMutation,
  useGetOfferQuery,
  useGetOffersQuery,
  useLazyGetOfferLetterUrlQuery,
  useRespondToOfferMutation,
  useUpdateOfferMutation,
} from "../api/recruitment.api";
import type { OfferRecord, OfferStatus } from "../types/recruitment.types";

const PAGE_SIZE = 10;
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

function errorMessage(error: unknown, fallback: string) {
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

function formatSalary(value: number | null | undefined) {
  return value == null
    ? "—"
    : `INR ${Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`;
}

function statusStyle(status: OfferRecord["status"]) {
  if (status === "accepted") return "bg-[#e8f4ec] text-[#39724f]";
  if (status === "rejected") return "bg-rose-50 text-rose-700";
  if (status === "extended") return "bg-sky-50 text-sky-700";
  return "bg-[#fff3d6] text-[#9b6811]";
}

function statusLabel(status: OfferRecord["status"]) {
  if (status === "extended") return "Offer Extended";
  if (status === "draft") return "Draft";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function OffersPanel() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OfferStatus>("all");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [offeredSalary, setOfferedSalary] = useState("");
  const [negotiatedSalary, setNegotiatedSalary] = useState("");
  const [createError, setCreateError] = useState("");
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draftOfferedSalary, setDraftOfferedSalary] = useState("");
  const [draftNegotiatedSalary, setDraftNegotiatedSalary] = useState("");
  const [draftError, setDraftError] = useState("");

  const {
    data: list,
    error: listError,
    isFetching,
  } = useGetOffersQuery({
    search: search.trim() || undefined,
    status,
    page,
    limit: PAGE_SIZE,
  });
  const {
    data: detail,
    error: detailError,
    isFetching: isLoadingDetail,
  } = useGetOfferQuery(selectedId ?? 0, { skip: selectedId === null });

  const [createOffer, { isLoading: isCreating }] = useCreateOfferMutation();
  const [updateOffer, { isLoading: isUpdating }] = useUpdateOfferMutation();
  const [extendOffer, { isLoading: isExtending }] = useExtendOfferMutation();
  const [respondToOffer, { isLoading: isResponding }] =
    useRespondToOfferMutation();
  const [getOfferLetterUrl, { isFetching: isLoadingLetter }] =
    useLazyGetOfferLetterUrlQuery();

  const rows = list?.data ?? [];
  const totalPages = Math.max(1, list?.meta.totalPages ?? 1);

  const submitCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError("");
    setMessage("");
    try {
      await createOffer({
        applicationId: Number(applicationId),
        offeredSalary: Number(offeredSalary),
        negotiatedSalary: negotiatedSalary
          ? Number(negotiatedSalary)
          : undefined,
      }).unwrap();
      setShowCreate(false);
      setApplicationId("");
      setOfferedSalary("");
      setNegotiatedSalary("");
      setMessage("Draft offer created.");
    } catch (error) {
      setCreateError(errorMessage(error, "Unable to create the offer."));
    }
  };

  const submitDraftUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detail) return;
    setDraftError("");
    setActionError("");
    try {
      await updateOffer({
        id: detail.id,
        body: {
          offeredSalary: Number(draftOfferedSalary),
          negotiatedSalary: draftNegotiatedSalary
            ? Number(draftNegotiatedSalary)
            : null,
        },
      }).unwrap();
      setMessage("Draft offer updated.");
    } catch (error) {
      setDraftError(errorMessage(error, "Unable to update the draft offer."));
    }
  };

  const handleExtend = async (offer: OfferRecord) => {
    setActionError("");
    setMessage("");
    try {
      await extendOffer(offer.id).unwrap();
      setMessage(`Offer ${offer.offerReferenceNo} extended and emailed.`);
    } catch (error) {
      setActionError(errorMessage(error, "Unable to extend the offer."));
    }
  };

  const handleResponse = async (
    offer: OfferRecord,
    response: "accepted" | "rejected",
  ) => {
    setActionError("");
    setMessage("");
    try {
      await respondToOffer({ id: offer.id, body: { response } }).unwrap();
      setMessage(`Offer response recorded as ${response}.`);
    } catch (error) {
      setActionError(errorMessage(error, "Unable to record the offer response."));
    }
  };

  const openOfferLetter = async (offer: OfferRecord) => {
    setActionError("");
    try {
      const result = await getOfferLetterUrl(offer.id).unwrap();
      window.open(
        new URL(result.url, API_URL).toString(),
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      setActionError(errorMessage(error, "Unable to get the offer letter."));
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
            Recruitment workflow
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
            Offer Management
          </h2>
          <p className="mt-1.5 text-sm text-[#7b8981]">
            Create draft offers, send offer letters, and track candidate responses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowCreate((previous) => !previous);
            setCreateError("");
            setMessage("");
          }}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#e5a538] px-4 text-sm font-semibold text-[#342712] shadow-sm transition hover:bg-[#d99a2b]"
        >
          {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreate ? "Cancel" : "Create Offer"}
        </button>
      </div>

      {message && (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      )}
      {actionError && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {actionError}
        </p>
      )}
      {listError && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage(listError, "Unable to load offers.")}
        </p>
      )}

      {showCreate && (
        <form
          onSubmit={(event) => void submitCreate(event)}
          className="space-y-4 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)]"
        >
          <h3 className="text-base font-semibold text-[#354239]">Create draft offer</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
              Application ID
              <input
                type="number"
                min="1"
                step="1"
                required
                value={applicationId}
                onChange={(event) => setApplicationId(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#dfe4df] px-3 text-sm outline-none focus:border-[#d8a43b]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
              Offered annual salary (INR)
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={offeredSalary}
                onChange={(event) => setOfferedSalary(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#dfe4df] px-3 text-sm outline-none focus:border-[#d8a43b]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
              Negotiated annual salary (INR)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={negotiatedSalary}
                onChange={(event) => setNegotiatedSalary(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#dfe4df] px-3 text-sm outline-none focus:border-[#d8a43b]"
              />
            </label>
          </div>
          {createError && <p role="alert" className="text-sm text-rose-700">{createError}</p>}
          <button
            type="submit"
            disabled={isCreating}
            className="h-10 rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isCreating ? "Creating..." : "Create draft"}
          </button>
        </form>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#e6e8e3] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
        <div className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto border-b border-[#eceee9]">
          <div className="flex w-max min-w-full flex-nowrap items-center gap-2.5 px-4 py-3.5 sm:px-5">
            <label className="relative w-[220px] shrink-0 sm:w-[360px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#88938c]" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search offers..."
                aria-label="Search offers"
                className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#d8a43b]"
              />
            </label>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as OfferStatus);
                setPage(1);
              }}
              aria-label="Filter offers by status"
              className="h-10 w-[170px] shrink-0 rounded-lg border border-[#dfe4df] bg-white px-3 text-sm text-[#354239]"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="extended">Offer Extended</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("all");
                setPage(1);
              }}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#e2e5df] px-3.5 text-sm font-semibold text-[#58655c]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
        <div className="punch-horizontal-scroll w-full min-w-0 touch-pan-x overflow-x-scroll overscroll-x-contain">
          <table className="w-full min-w-[900px] border-collapse whitespace-nowrap text-left">
            <thead>
              <tr>
                {["Offer", "Application", "Candidate", "Position", "Salary", "Status", "Actions"].map((label) => (
                  <th key={label} className={label === "Actions" ? "min-w-[11rem] whitespace-nowrap bg-[#f8f9f7] px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078]" : "whitespace-nowrap bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078] first:pl-5 last:pr-5"}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((offer) => (
                <tr
                  key={offer.id}
                  className="odd:bg-white even:bg-[#fffaf0] transition-colors hover:bg-[#f3e4c5]"
                >
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 pl-5 text-xs font-semibold text-[#344138]">
                    {offer.offerReferenceNo}
                  </td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                    APP-{offer.applicationId}
                  </td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                    <span className="font-medium">{offer.candidateName}</span>
                    <span className="ml-2 text-[#7b8981]">{offer.candidateEmail}</span>
                  </td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">{offer.position}</td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138]">
                    {formatSalary(offer.negotiatedSalary ?? offer.offeredSalary)}
                  </td>
                  <td className="border-t border-[#eef0eb] px-4 py-3.5 text-xs">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle(offer.status)}`}>
                      {statusLabel(offer.status)}
                    </span>
                  </td>
                  <td className="min-w-[13rem] border-t border-[#eef0eb] bg-transparent px-3 py-3.5 text-xs">
                    <div className="flex w-max items-center gap-2 whitespace-nowrap">
                      <button type="button" onClick={() => {
                        setActionError("");
                        setDraftOfferedSalary(String(offer.offeredSalary));
                        setDraftNegotiatedSalary(
                          offer.negotiatedSalary == null
                            ? ""
                            : String(offer.negotiatedSalary),
                        );
                        setSelectedId(offer.id);
                      }} className="whitespace-nowrap rounded-lg border border-[#e4d5b5] px-3 py-2 font-semibold text-[#8a641d] hover:bg-[#fffaf0]">
                        Details
                      </button>
                      {offer.status === "draft" ? (
                        <button
                          type="button"
                          onClick={() => void handleExtend(offer)}
                          disabled={isExtending}
                          className="whitespace-nowrap rounded-lg bg-[#38634a] px-3 py-2 font-semibold text-white disabled:opacity-60"
                        >
                          {isExtending ? "Extending..." : "Extend"}
                        </button>
                      ) : offer.status === "extended" ? (
                        <>
                          <select
                            defaultValue=""
                            aria-label={`Record response for ${offer.candidateName}`}
                            onChange={(event) => {
                              if (
                                event.target.value === "accepted" ||
                                event.target.value === "rejected"
                              ) {
                                void handleResponse(offer, event.target.value);
                                event.target.value = "";
                              }
                            }}
                            disabled={isResponding}
                            className="h-9 w-36 shrink-0 rounded-lg border border-[#dfe4df] bg-white px-2 text-xs font-semibold text-[#354239] outline-none focus:border-[#d8a43b] disabled:opacity-60"
                          >
                            <option value="" disabled>Record response</option>
                            <option value="accepted">Accept</option>
                            <option value="rejected">Reject</option>
                          </select>
                        </>
                      ) : (
                        <button type="button" onClick={() => void openOfferLetter(offer)} disabled={isLoadingLetter} className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-[#dfe4df] px-3 py-2 font-semibold text-[#58655c] disabled:opacity-60">
                          <FileText className="h-3.5 w-3.5" /> Letter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={7} className="border-t border-[#eef0eb] px-5 py-12 text-center text-sm text-[#7b8981]">
                    {isFetching ? "Loading offers..." : "No offers match your search and status filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#eceee9] px-4 py-3 text-xs text-[#758078] sm:flex-row sm:px-5">
          <span>{list?.meta.total ?? 0} offers</span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-[#dfe4df] px-3 py-1.5 disabled:opacity-40">Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-[#dfe4df] px-3 py-1.5 disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>

      {selectedId !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202a26]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="offer-details-title" className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#eee9dc] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#efeee9] px-5 py-4">
              <h3 id="offer-details-title" className="font-bold text-[#26332c]">
                {detail?.offerReferenceNo ?? "Offer details"}
              </h3>
              <button type="button" onClick={() => setSelectedId(null)} aria-label="Close offer details" className="rounded-lg p-1.5 text-[#7e8981] hover:bg-[#f5f4ef]">
                <X className="h-4 w-4" />
              </button>
            </div>
            {isLoadingDetail ? (
              <p className="px-5 py-8 text-sm text-[#7b8981]">Loading offer details...</p>
            ) : detailError ? (
              <p role="alert" className="px-5 py-8 text-sm text-rose-700">{errorMessage(detailError, "Unable to load offer details.")}</p>
            ) : detail ? (
              <div className="space-y-4 px-5 py-4">
                <dl className="grid gap-x-6 sm:grid-cols-2">
                  {[
                    ["Candidate", detail.candidateName],
                    ["Email", detail.candidateEmail],
                    ["Position", detail.position],
                    ["Application ID", detail.applicationId],
                    ["Offered salary", formatSalary(detail.offeredSalary)],
                    ["Negotiated salary", formatSalary(detail.negotiatedSalary)],
                    ["Status", statusLabel(detail.status)],
                    ["Response", detail.response ?? "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-[#f0f0eb] py-3">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">{label}</dt>
                      <dd className="mt-1 text-sm font-medium text-[#354239]">{value}</dd>
                    </div>
                  ))}
                </dl>
                {detail.status === "draft" && (
                  <form onSubmit={(event) => void submitDraftUpdate(event)} className="space-y-3 border-t border-[#efeee9] pt-4">
                    <h4 className="text-sm font-semibold text-[#354239]">Update draft</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1 text-xs font-semibold text-[#59665d]">
                        Offered salary (INR)
                        <input type="number" min="0.01" step="0.01" required value={draftOfferedSalary} onChange={(event) => setDraftOfferedSalary(event.target.value)} className="h-10 w-full rounded-lg border border-[#dfe4df] px-3 text-sm font-normal" />
                      </label>
                      <label className="space-y-1 text-xs font-semibold text-[#59665d]">
                        Negotiated salary (INR)
                        <input type="number" min="0.01" step="0.01" value={draftNegotiatedSalary} onChange={(event) => setDraftNegotiatedSalary(event.target.value)} className="h-10 w-full rounded-lg border border-[#dfe4df] px-3 text-sm font-normal" />
                      </label>
                    </div>
                    {draftError && <p role="alert" className="text-xs text-rose-700">{draftError}</p>}
                    <div className="flex justify-end gap-2">
                      <button type="submit" disabled={isUpdating} className="h-9 rounded-lg bg-[#38634a] px-4 text-xs font-semibold text-white disabled:opacity-60">{isUpdating ? "Saving..." : "Save draft"}</button>
                      <button type="button" onClick={() => void handleExtend(detail)} disabled={isExtending} className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] disabled:opacity-60">{isExtending ? "Extending..." : "Extend and email"}</button>
                    </div>
                  </form>
                )}
                {detail.status === "extended" && (
                  <div className="flex flex-col gap-2 border-t border-[#efeee9] pt-4 sm:flex-row sm:justify-end">
                    <select
                      defaultValue=""
                      aria-label={`Record response for ${detail.candidateName}`}
                      onChange={(event) => {
                        if (
                          event.target.value === "accepted" ||
                          event.target.value === "rejected"
                        ) {
                          void handleResponse(detail, event.target.value);
                          event.target.value = "";
                        }
                      }}
                      disabled={isResponding}
                      className="h-9 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-xs font-semibold text-[#354239] outline-none focus:border-[#d8a43b] disabled:opacity-60 sm:w-40"
                    >
                      <option value="" disabled>Record response</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                    <button type="button" onClick={() => void openOfferLetter(detail)} disabled={isLoadingLetter} className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#dfe4df] px-4 text-xs font-semibold text-[#58655c] disabled:opacity-60"><FileText className="h-3.5 w-3.5" /> Letter</button>
                  </div>
                )}
                {(detail.status === "accepted" || detail.status === "rejected") && (
                  <div className="flex justify-end border-t border-[#efeee9] pt-4">
                    <button type="button" onClick={() => void openOfferLetter(detail)} disabled={isLoadingLetter} className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#dfe4df] px-4 text-xs font-semibold text-[#58655c] disabled:opacity-60"><FileText className="h-3.5 w-3.5" /> Offer letter PDF</button>
                  </div>
                )}
              </div>
            ) : null}
          </section>
        </div>
      )}
    </section>
  );
}
