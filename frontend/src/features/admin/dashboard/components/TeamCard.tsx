import { useEffect, useState } from "react";
import {
  useGetTeamLeadsQuery,
  useGetTeamMembersQuery,
} from "../api/dashboardApi";
import type { TeamLead } from "../types/dashboard.types";
 
// Figma badge style
function parseHex(hex: string): [number, number, number] | null {
  const clean = (hex ?? "").replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean.substring(0, 6);
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return [r, g, b];
}
 
function getBadgeStyle(hex?: string | null): {
  backgroundColor: string;
  color: string;
} {
  const rgb = parseHex(hex ?? "");
  if (!rgb) return { backgroundColor: "#F1F5F9", color: "#334155" };
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const k = luminance > 0.6 ? 0.45 : luminance > 0.45 ? 0.75 : 1;
  const text = `rgb(${Math.round(r * k)}, ${Math.round(g * k)}, ${Math.round(b * k)})`;
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
    color: text,
  };
}
 
function initialsOf(name?: string | null) {
  if (!name || typeof name !== "string") return "?";
  return name.trim()[0]?.toUpperCase() ?? "?";
}
 
// Soft, on-brand palette for fallback avatars (same pastel language as the
// badge pills) so a list of initials doesn't read as flat placeholder gray.
const AVATAR_PALETTE: { backgroundColor: string; color: string }[] = [
  { backgroundColor: "#DBEAFE", color: "#1D4ED8" }, // blue
  { backgroundColor: "#EDE9FE", color: "#6D28D9" }, // violet
  { backgroundColor: "#D1FAE5", color: "#047857" }, // emerald
  { backgroundColor: "#FEF3C7", color: "#B45309" }, // amber
  { backgroundColor: "#FCE7F3", color: "#BE185D" }, // pink
  { backgroundColor: "#CFFAFE", color: "#0E7490" }, // cyan
  { backgroundColor: "#FFE4E6", color: "#BE123C" }, // rose
];
 
function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}
 
function getAvatarStyle(seed?: string | null) {
  const key = seed && seed.trim().length > 0 ? seed.trim() : "?";
  return AVATAR_PALETTE[hashString(key) % AVATAR_PALETTE.length];
}
 
function Avatar({
  photo,
  name,
  size = "w-[30px] h-[30px]",
}: {
  photo?: string | null;
  name?: string | null;
  size?: string;
}) {
  const displayName = name ?? "Unknown";
 
  if (photo) {
    return (
      <img
        src={photo}
        alt={displayName}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }
 
  return (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full text-xs font-semibold`}
      style={getAvatarStyle(displayName)}
    >
      {initialsOf(displayName)}
    </span>
  );
}
 
export default function TeamCard() {
  const [selectedLead, setSelectedLead] = useState<TeamLead | null>(null);
  const [hoveredLeadId, setHoveredLeadId] = useState<string | null>(null);
 
  // Flag = 1 → Team Leads
  const {
    data: teamLeads = [],
    isLoading: isLeadsLoading,
    isError: isLeadsError,
  } = useGetTeamLeadsQuery();
 
  // Flag = 2 → Members of selected lead
  const {
    data: members = [],
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useGetTeamMembersQuery(selectedLead?.LeadEmployeeID ?? "", {
    skip: !selectedLead?.LeadEmployeeID,
  });
 
  // Lock the page behind the modal so it can't be scrolled/navigated while open
  useEffect(() => {
    if (!selectedLead) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedLead]);
 
  return (
    <>
      <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-100 bg-white px-3.5 pb-4 pt-5 shadow-[0_2px_6px_rgba(15,23,42,0.06),0_10px_28px_rgba(15,23,42,0.14)]">
        <div className="mb-3.5 flex items-center justify-between border-b border-[#F08A8A] pb-1.5">
          <h3 className="text-base font-semibold tracking-tight text-slate-900">Team</h3>
          <button className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] text-slate-800 hover:bg-slate-50">
            Manage Team
          </button>
        </div>
 
        {isLeadsLoading ? (
          <p className="py-4 text-sm text-slate-400">Loading team leads...</p>
        ) : isLeadsError ? (
          <p className="py-4 text-sm text-red-500">Failed to load team leads.</p>
        ) : teamLeads.length === 0 ? (
          <p className="py-4 text-sm text-slate-400">No team members found.</p>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto rounded-sm border border-slate-200">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[45%]" />
                <col className="w-[15%]" />
                <col className="w-[40%]" />
              </colgroup>
              <thead>
                <tr className="text-left text-[13px] font-medium text-slate-700">
                  <th className="px-4 pb-5 pt-4">Lead Name</th>
                  <th className="pb-5 pt-4">Team</th>
                  <th className="pb-5 pt-4">Email</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-slate-700">
                {teamLeads.map((m, index) => {
                  const key = m.LeadEmployeeID || m.Email || `lead-${index}`;
                  const name = m.LeadName ?? "Unknown";
                  const teamName = m.Team ?? "—";
                  const email = m.Email ?? "—";
                  const isSelected =
                    selectedLead?.LeadEmployeeID === m.LeadEmployeeID;
                  const isHovered = hoveredLeadId === m.LeadEmployeeID;
                  const isHighlighted = isSelected || isHovered;
 
                  return (
                    <tr key={key} className="border-b border-slate-100">
                      <td className="py-2.5 pl-4 pr-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(m)}
                          aria-pressed={selectedLead?.LeadEmployeeID === m.LeadEmployeeID}
                          className="group flex w-full min-w-0 items-center gap-2.5 rounded-md py-0.5 pr-1 text-left outline-none transition-all duration-150 hover:bg-blue-50/70 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.97]"
                        >
                          <Avatar photo={m.ProfilePhoto} name={name} />
                          <span
                            title={name}
                            className={`block min-w-0 whitespace-normal break-words font-semibold transition-colors duration-150 group-hover:text-blue-600 ${
                              selectedLead?.LeadEmployeeID === m.LeadEmployeeID
                                ? "text-blue-600"
                                : "text-slate-700"
                            }`}
                          >
                            {name}
                          </span>
                        </button>
                      </td>
                      <td className="py-2.5 pr-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(m)}
                          onMouseEnter={() => setHoveredLeadId(m.LeadEmployeeID)}
                          onMouseLeave={() => setHoveredLeadId(null)}
                          aria-pressed={isSelected}
                          className={`cursor-pointer rounded px-2.5 py-1 text-[11px] font-semibold tracking-wide outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-95 ${
                            isSelected
                              ? "scale-105 ring-2 ring-blue-600 ring-offset-2 shadow-md"
                              : isHovered
                                ? "shadow-md"
                                : "hover:shadow-sm"
                          }`}
                          style={
                            isHighlighted
                              ? { backgroundColor: "#2563EB", color: "#FFFFFF" }
                              : getBadgeStyle(m.BadgeColor)
                          }
                        >
                          {teamName}
                        </button>
                      </td>
                      <td className="py-2.5 pr-3 text-[12px] font-medium text-slate-600">
                        <span className="block truncate" title={email}>{email}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
 
      {/* Team members modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/50 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[600px] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12),0_24px_48px_rgba(15,23,42,0.18)]">
            {/* Header — same coral underline as the card title */}
            <div className="flex items-center justify-between border-b-2 border-[#F08A8A] px-6 pb-3.5 pt-5">
              <div className="min-w-0">
                <h2 className="truncate text-[17px] font-semibold text-slate-900">
                  {selectedLead.Team ?? "Team"}
                </h2>
                <p className="mt-0.5 text-[12px] font-medium text-slate-400">
                  {members.length} {members.length === 1 ? "member" : "members"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
 
            {/* Column header row, aligned with the rows below */}
            <div className="grid grid-cols-[100px_1.4fr_1.3fr] gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <span>Employee ID</span>
              <span>Name</span>
              <span>Email</span>
            </div>
 
            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1">
              {isMembersLoading ? (
                <div className="py-10 text-center text-[13px] text-slate-400">
                  Loading members...
                </div>
              ) : isMembersError ? (
                <div className="py-10 text-center text-[13px] text-red-500">
                  Failed to load team members.
                </div>
              ) : members.length > 0 ? (
                members.map((m, index) => {
                  const key = m.EmployeeID || m.Email || `member-${index}`;
                  const name = m.EmployeeName ?? "Unknown";
                  const employeeId = m.EmployeeID ?? "—";
                  const email = m.Email ?? "—";
 
                  return (
                    <div
                      key={key}
                      className="grid grid-cols-[100px_1.4fr_1.3fr] items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50"
                    >
                      <span className="truncate text-[12.5px] font-bold tabular-nums text-slate-600">
                        {employeeId}
                      </span>
 
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Avatar photo={m.ProfilePhoto} name={name} size="w-9 h-9" />
                        <span className="min-w-0 whitespace-normal break-words text-[14px] font-bold text-slate-900">
                          {name}
                        </span>
                      </div>
 
                      <span
                        className={`truncate text-[13px] font-bold ${
                          m.Email ? "text-blue-600" : "text-slate-400"
                        }`}
                      >
                        {email}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-[13px] text-slate-400">
                  No members found for this team.
                </div>
              )}
            </div>
 
            {/* Footer — same outlined button style as "Manage Team" */}
            <div className="flex justify-end border-t border-slate-100 px-6 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-md border border-slate-200 px-4 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
 