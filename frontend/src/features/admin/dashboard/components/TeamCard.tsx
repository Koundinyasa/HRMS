import { useState } from "react";
import type { TeamMember } from "../types/dashboard.types";

interface TeamCardProps {
  team: TeamMember[];
}

// Picks black or white text based on the background color's luminance,
// so a badge stays readable regardless of how light/dark the DB color is.
function getReadableTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return "#1E293B";
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1E293B" : "#FFFFFF";
}

function initialsOf(name: string) {
  return name.trim()[0]?.toUpperCase() ?? "?";
}

function Avatar({
  photo,
  name,
  size = "w-7 h-7",
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
        className={`${size} rounded-full object-cover shrink-0`}
      />
    );
  }
  return (
    <span
      className={`${size} rounded-full bg-slate-300 text-white flex items-center justify-center font-semibold shrink-0 text-xs`}
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
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between border-b-2 border-red-300 pb-3 mb-3">
          <h3 className="text-base font-semibold text-slate-800">Team</h3>
          <button className="text-xs font-medium text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50">
            Manage Team
          </button>
        </div>

        {team.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">No team members found.</p>
        ) : (
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[25%]" />
              <col className="w-[35%]" />
            </colgroup>
            <thead>
              <tr className="text-left text-slate-500 text-xs">
                <th className="font-medium pb-2">Lead Name</th>
                <th className="font-medium pb-2">Team</th>
                <th className="font-medium pb-2">Email</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {team.map((m) => (
                <tr key={m.email} className="border-t border-slate-100">
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar photo={m.profilePhoto} name={m.leadName} />
                      <span className="truncate block">{m.leadName}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTeam(m.team)}
                      className="text-[11px] px-2.5 py-1 rounded-md font-semibold hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: m.badgeColor,
                        color: getReadableTextColor(m.badgeColor),
                      }}
                    >
                      {m.team}
                    </button>
                  </td>
                  <td className="py-3 text-slate-500">
                    <span className="truncate block">{m.email}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Team members modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[420px] max-h-[480px] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">
                {selectedTeam} Team
              </h2>
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto">
              {members.length > 0 ? (
                members.map((m) => (
                  <div
                    key={m.email}
                    className="flex items-center gap-3 px-5 py-3 border-b border-slate-50"
                  >
                    <Avatar photo={m.profilePhoto} name={m.leadName} size="w-8 h-8" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {m.leadName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{m.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 text-sm">
                  No members found for this team.
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
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