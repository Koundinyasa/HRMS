










import { useState } from "react";
import type { TeamMember } from "../types/dashboard.types";

interface TeamCardProps {
  team: TeamMember[];
}

// Figma badge style: pastel tint of the team color as background,
// with a stronger version of the same color as text.
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

function getBadgeStyle(hex: string): { backgroundColor: string; color: string } {
  const rgb = parseHex(hex);
  if (!rgb) return { backgroundColor: "#F1F5F9", color: "#334155" };
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // Very light DB colors get darkened so the text stays readable
  const k = luminance > 0.6 ? 0.45 : luminance > 0.45 ? 0.75 : 1;
  const text = `rgb(${Math.round(r * k)}, ${Math.round(g * k)}, ${Math.round(b * k)})`;
  return { backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`, color: text };
}

function initialsOf(name: string) {
  return name.trim()[0]?.toUpperCase() ?? "?";
}

function Avatar({
  photo,
  name,
  size = "w-[30px] h-[30px]",
}: {
  photo?: string | null;
  name: string;
  size?: string;
}) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-slate-300 text-xs font-semibold text-white`}
    >
      {initialsOf(name)}
    </span>
  );
}

export default function TeamCard({ team }: TeamCardProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const members = selectedTeam
    ? team.filter((m) => m.team === selectedTeam)
    : [];

  return (
    <>
      <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-100 bg-white px-3.5 pb-4 pt-5 shadow-[0_2px_6px_rgba(15,23,42,0.06),0_10px_28px_rgba(15,23,42,0.14)]">
        <div className="mb-3.5 flex items-center justify-between border-b border-[#F08A8A] pb-1.5">
          <h3 className="text-[15px] font-medium text-slate-900">Team</h3>
          <button className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] text-slate-800 hover:bg-slate-50">
            Manage Team
          </button>
        </div>

        {team.length === 0 ? (
          <p className="py-4 text-sm text-slate-400">No team members found.</p>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto rounded-sm border border-slate-200">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[20%]" />
                <col className="w-[40%]" />
              </colgroup>
              <thead>
                <tr className="text-left text-[13px] text-slate-800">
                  <th className="px-4 pb-5 pt-4 font-normal">Lead Name</th>
                  <th className="pb-5 pt-4 font-normal">Team</th>
                  <th className="pb-5 pt-4 font-normal">Email</th>
                </tr>
              </thead>
              <tbody className="text-[12px] text-slate-700">
                {team.map((m) => (
                  <tr key={m.email} className="border-b border-slate-100">
                    <td className="py-2.5 pl-4 pr-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Avatar photo={m.profilePhoto} name={m.leadName} />
                        <span className="block truncate">{m.leadName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTeam(m.team)}
                        className="rounded px-2 py-[3px] text-[9px] font-semibold transition-opacity hover:opacity-80"
                        style={getBadgeStyle(m.badgeColor)}
                      >
                        {m.team}
                      </button>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-400">
                      <span className="block truncate">{m.email}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Team members modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-h-[480px] w-[420px] overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h2 className="text-base font-semibold text-slate-800">
                {selectedTeam} Team
              </h2>
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="text-xl leading-none text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto">
              {members.length > 0 ? (
                members.map((m) => (
                  <div
                    key={m.email}
                    className="flex items-center gap-3 border-b border-slate-50 px-5 py-3"
                  >
                    <Avatar photo={m.profilePhoto} name={m.leadName} size="w-8 h-8" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {m.leadName}
                      </p>
                      <p className="truncate text-xs text-slate-500">{m.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-sm text-slate-400">
                  No members found for this team.
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="rounded-lg border border-slate-200 px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
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