import { useMemo, useState } from "react";
import {
  Eye,
  RotateCcw,
  Search,
  Users,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import PreOnboardPageShell from "../components/PreEnrollmentPageShell";

interface OffboardedCandidate {
  id: number;
  name: string;
  email: string;
  mobile: string;
  joiningDate: string;
  offboardDate: string;
  reason: string;
  initials: string;
}

const candidates: OffboardedCandidate[] = [
  {
    id: 1,
    name: "Sai Chandu",
    email: "saichandu@gmail.com",
    mobile: "9876543210",
    joiningDate: "27/May/2026",
    offboardDate: "10/Jun/2026",
    reason: "Candidate Withdrawn",
    initials: "SC",
  },
  {
    id: 2,
    name: "Ravi Kumar",
    email: "ravikumar@gmail.com",
    mobile: "9876543211",
    joiningDate: "15/May/2026",
    offboardDate: "05/Jun/2026",
    reason: "Background Verification",
    initials: "RK",
  },
  {
    id: 3,
    name: "Anusha M.",
    email: "anusha@gmail.com",
    mobile: "9876543212",
    joiningDate: "02/May/2026",
    offboardDate: "01/Jun/2026",
    reason: "Candidate Declined",
    initials: "AM",
  },
  {
    id: 4,
    name: "Vijay R.",
    email: "vijayr@gmail.com",
    mobile: "9876543213",
    joiningDate: "28/Apr/2026",
    offboardDate: "30/May/2026",
    reason: "Skills Not Matched",
    initials: "VJ",
  },
  {
    id: 5,
    name: "Priya Sharma",
    email: "priyasharma@gmail.com",
    mobile: "9876543214",
    joiningDate: "10/May/2026",
    offboardDate: "25/May/2026",
    reason: "Not Responding",
    initials: "PS",
  },
  {
    id: 6,
    name: "Suresh K.",
    email: "sureshk@gmail.com",
    mobile: "9876543215",
    joiningDate: "20/Apr/2026",
    offboardDate: "18/May/2026",
    reason: "Other Reasons",
    initials: "SK",
  },
];

export default function OffboardedCandidate() {
  const [search, setSearch] = useState("");

  const filteredCandidates = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return candidates;
    }

    return candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(value) ||
        candidate.email.toLowerCase().includes(value) ||
        candidate.mobile.includes(value) ||
        candidate.reason.toLowerCase().includes(value),
    );
  }, [search]);

  const handleView = (candidate: OffboardedCandidate) => {
    console.log("View candidate:", candidate);
  };

  const handleReOnboard = (candidate: OffboardedCandidate) => {
    console.log("Re-onboard candidate:", candidate);
  };

  return (
    <PreOnboardPageShell>
      {/* <div className="w-full min-w-0 px-5 pb-8 pt-0 md:px-8">
        <PreOnboardPageShell> */}
  <div className="relative -mt-2 w-full min-w-0 px-3 pb-6 sm:px-4 md:px-8 md:pb-8">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">

          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
              Offboarded Candidates
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              View all candidates who have been offboarded from the
              onboarding process.
            </p>
          </div>

          {/* Search */}
          <div className="flex h-[48px] w-full items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm sm:w-[330px] sm:shrink-0">

            <Search
              size={19}
              strokeWidth={2}
              className="text-slate-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search candidate..."
              className="ml-3 min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

          </div>
        </div>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,23,42,0.08)]">

          {/* ===================================================
              CARD HEADER
          =================================================== */}
          <div className="flex min-h-[82px] flex-col items-stretch gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">

              <Users
                size={22}
                strokeWidth={2}
                className="shrink-0 text-orange-500"
              />

              <h2 className="whitespace-nowrap text-[17px] font-semibold text-slate-900">
                All Offboarded Candidates
              </h2>

              <span className="whitespace-nowrap rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600">
                {filteredCandidates.length} Candidates
              </span>

            </div>

            {/* Filter */}
            <button
              type="button"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-orange-200 bg-white px-4 text-sm font-medium text-orange-500 transition hover:bg-orange-50"
            >
              <SlidersHorizontal
                size={16}
                strokeWidth={2}
              />

              <span>Filter</span>

              <ChevronDown
                size={14}
                strokeWidth={2}
              />
            </button>

          </div>

          {/* ===================================================
              TABLE
          =================================================== */}
          <div className="mx-3 overflow-x-auto rounded-xl border border-slate-200 sm:mx-6">

            <table className="min-w-[900px] w-full table-fixed">

              <thead>
                <tr className="h-[50px] bg-slate-50 text-left">

                  <th className="w-[19%] px-4 text-xs font-semibold text-slate-700">
                    Candidate Name
                  </th>

                  <th className="w-[19%] px-4 text-xs font-semibold text-slate-700">
                    Email ID
                  </th>

                  <th className="w-[13%] px-4 text-xs font-semibold text-slate-700">
                    Mobile No
                  </th>

                  <th className="w-[13%] px-4 text-xs font-semibold text-slate-700">
                    Joining Date
                  </th>

                  <th className="w-[13%] px-4 text-xs font-semibold text-slate-700">
                    Offboard Date
                  </th>

                  <th className="w-[15%] px-4 text-xs font-semibold text-slate-700">
                    Reason
                  </th>

                  <th className="w-[8%] px-4 text-center text-xs font-semibold text-slate-700">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="h-[76px] border-t border-slate-200 bg-white"
                  >

                    {/* Candidate Name */}
                    <td className="px-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-500">
                          {candidate.initials}
                        </div>

                        <span className="truncate text-sm font-semibold text-slate-800">
                          {candidate.name}
                        </span>

                      </div>

                    </td>

                    {/* Email */}
                    <td className="px-4">

                      <span className="block truncate text-sm text-slate-700">
                        {candidate.email}
                      </span>

                    </td>

                    {/* Mobile */}
                    <td className="px-4">

                      <span className="block truncate text-sm text-slate-700">
                        {candidate.mobile}
                      </span>

                    </td>

                    {/* Joining Date */}
                    <td className="px-4 text-sm text-slate-700">
                      {candidate.joiningDate}
                    </td>

                    {/* Offboard Date */}
                    <td className="px-4 text-sm text-slate-700">
                      {candidate.offboardDate}
                    </td>

                    {/* Reason */}
                    <td className="px-4">

                      <span className="inline-flex max-w-full truncate rounded-xl bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500">
                        {candidate.reason}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-3">

                      <div className="flex items-center justify-center gap-2">

                        {/* View */}
                        <button
                          type="button"
                          title="View Candidate"
                          aria-label={`View ${candidate.name}`}
                          onClick={() => handleView(candidate)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
                        >
                          <Eye
                            size={18}
                            strokeWidth={2}
                          />
                        </button>

                        {/* Re-Onboard */}
                        <button
                          type="button"
                          title="Re-Onboard Candidate"
                          aria-label={`Re-onboard ${candidate.name}`}
                          onClick={() => handleReOnboard(candidate)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-orange-500 transition hover:border-orange-300 hover:bg-orange-50"
                        >
                          <RotateCcw
                            size={18}
                            strokeWidth={2}
                          />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {/* Empty State */}
            {filteredCandidates.length === 0 && (
              <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                No offboarded candidates found.
              </div>
            )}

          </div>

          {/* ===================================================
              FOOTER
          =================================================== */}
          <div className="flex min-h-[82px] flex-col items-start gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <span className="text-sm text-slate-700">
              Showing 1 to {filteredCandidates.length} of{" "}
              {candidates.length} candidates
            </span>

            <div className="flex flex-wrap items-center gap-2">

              <span className="mr-1 text-sm text-slate-600">
                Rows per page:
              </span>

              <button
                type="button"
                className="flex h-10 min-w-[70px] items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
              >
                <span>10</span>

                <ChevronDown
                  size={15}
                  className="text-slate-500"
                />
              </button>

              {/* Previous */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-orange-300 hover:text-orange-500"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Current Page */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-300 bg-white text-sm font-medium text-orange-500"
              >
                1
              </button>

              {/* Next */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-orange-300 hover:text-orange-500"
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>

        </div>
      </div>
    </PreOnboardPageShell>
  );
}
