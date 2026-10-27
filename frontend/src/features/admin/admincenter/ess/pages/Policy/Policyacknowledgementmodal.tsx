import { useState } from "react";
import { X, Search, SlidersHorizontal } from "lucide-react";
import type { PolicyReadStatusRow } from "../../api/essApi";

const AVATAR_COLORS = [
  "bg-[#FFF7ED] text-[#EA580C]",
  "bg-[#ECFDF5] text-[#059669]",
  "bg-[#F6F3FF] text-[#7A5BED]",
  "bg-[#FFFBEB] text-[#D97706]",
];

// Confirmed real shape from USP_GetEssPolicyReadStatus:
// { PolicyID, EmployeeID, FullName, ReadStatus, AcknowledgedDate }
function employeeName(row: PolicyReadStatusRow): string {
  return String(row.FullName ?? "—");
}
function refNo(row: PolicyReadStatusRow): string {
  return String(row.EmployeeID ?? "—").trim();
}
function acknowledgedDate(row: PolicyReadStatusRow): string {
  const raw = row.AcknowledgedDate;
  if (!raw) return "—";
  const d = new Date(String(raw));
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB");
}
function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

interface Props {
  activeTab: "seen" | "unseen";
  setActiveTab: (t: "seen" | "unseen") => void;
  seen: PolicyReadStatusRow[];
  unseen: PolicyReadStatusRow[];
  activeList: PolicyReadStatusRow[];
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
}

export default function PolicyAcknowledgementModal(p: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const visibleList = p.activeList.filter((row) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return employeeName(row).toLowerCase().includes(q) || refNo(row).toLowerCase().includes(q);
  });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-3 font-[Urbanist]"
      onClick={p.onClose}
    >
      <div
        className="w-[608px] max-w-full bg-white rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.18)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TABS */}
        <div className="flex items-end gap-1 px-6 border-b border-[#E2E8F0]">
          {(
            [
              { key: "unseen" as const, label: `Unseen (${p.unseen.length})` },
              { key: "seen" as const, label: `Seen (${p.seen.length})` },
            ]
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                p.setActiveTab(tab.key);
                setSearch("");
                setSearchOpen(false);
              }}
              className={`px-2.5 pt-4 pb-3 text-sm font-medium leading-[17px] tracking-[0.3px] whitespace-nowrap border-b-2 -mb-px ${
                p.activeTab === tab.key
                  ? "text-[#7A5BED] border-[#7A5BED] font-semibold"
                  : "text-[#2E2E2E] border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SUB HEADER */}
        <div className="flex items-center justify-between gap-3 px-7 py-4">
          {searchOpen ? (
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 h-[34px]">
              <Search size={14} strokeWidth={2.5} className="shrink-0 text-[#626262]" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or employee ID…"
                className="min-w-0 flex-1 text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          ) : (
            <span className="text-base font-semibold leading-6 text-[#131313]">
              {p.activeTab === "unseen" ? "Not yet read" : "Already read"}
            </span>
          )}
          <div className="flex shrink-0 gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (searchOpen) setSearch("");
                setSearchOpen((v) => !v);
              }}
              title={searchOpen ? "Close search" : "Search"}
              className={`w-[30px] h-[30px] border rounded-lg flex items-center justify-center hover:bg-gray-50 ${
                searchOpen ? "border-[#7A5BED] text-[#7A5BED] bg-[#F6F3FF]" : "border-[#E2E8F0] text-[#131313]"
              }`}
            >
              {searchOpen ? <X size={14} strokeWidth={2.5} /> : <Search size={14} strokeWidth={2.5} />}
            </button>
            <button type="button" className="w-[30px] h-[30px] border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#131313] hover:bg-gray-50">
              <SlidersHorizontal size={14} strokeWidth={2.5} className="rotate-90" />
            </button>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-[90px_1fr_110px] items-center bg-[#F3F4F6] px-5 h-9 text-xs font-medium leading-4 text-[#2E2E2E] tracking-wide">
          <div>EMPLOYEE ID</div>
          <div>EMPLOYEE NAME</div>
          <div className="text-right">{p.activeTab === "seen" ? "SEEN ON" : ""}</div>
        </div>

        {/* ROWS */}
        <div className="max-h-[400px] overflow-y-auto">
          {p.isLoading ? (
            <p className="py-10 text-center text-sm text-gray-500">Loading…</p>
          ) : p.isError ? (
            <p className="py-10 text-center text-sm text-red-500">Failed to load.</p>
          ) : visibleList.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              {search.trim() ? "No matching employees" : "No records"}
            </p>
          ) : (
            visibleList.map((row, index) => {
              const avatar = AVATAR_COLORS[index % AVATAR_COLORS.length];
              const name = employeeName(row);
              return (
                <div
                  key={index}
                  className={`grid grid-cols-[90px_1fr_110px] items-center px-5 h-[50px] border-b border-[#E2E8F0] text-sm font-normal ${
                    index % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"
                  }`}
                >
                  <div className="text-[#2E2E2E] truncate">{refNo(row)}</div>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold ${avatar}`}>
                      {initialsOf(name)}
                    </span>
                    <span className="text-[#131313] font-medium truncate">{name}</span>
                  </div>
                  <div className="text-right text-xs text-[#626262]">
                    {p.activeTab === "seen" ? acknowledgedDate(row) : ""}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-7 py-7 bg-[#F9FAFB]">
          <span className="text-xs font-normal leading-4 text-[#2E2E2E]">
            Showing <span className="font-semibold text-[#131313]">{visibleList.length}</span> of{" "}
            <span className="font-semibold text-[#131313]">{p.activeList.length}</span>
          </span>
          <button
            type="button"
            onClick={p.onClose}
            className="h-8 px-4 border border-gray-300 bg-white rounded-lg text-sm font-normal text-[#131313] flex items-center gap-1.5 hover:bg-gray-50"
          >
            <X size={13} strokeWidth={2.5} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}