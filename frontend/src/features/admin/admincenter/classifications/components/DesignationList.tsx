import { ChevronRight, FileText, Pencil, Trash2 } from "lucide-react";
import type { Designation } from "../types/classificationTypes";

export default function DesignationList({
  designations, onEdit, onDelete,
}: { designations: Designation[]; onEdit: (d: Designation) => void; onDelete: (d: Designation) => void }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-[#e8ddff] text-gray-800 text-sm">
          <th className="p-4 text-left font-semibold">Designation</th>
          <th className="p-4 text-right font-semibold pr-6">Action</th>
        </tr>
      </thead>

      <tbody>
        {designations.length === 0 && (
          <tr>
            <td colSpan={2} className="p-8 text-center text-sm text-gray-400">
              No designations found.
            </td>
          </tr>
        )}

        {designations.map((d) => (
          <tr key={d.Id} className="text-sm text-gray-700 border-t border-gray-100">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                  <FileText size={14} />
                </span>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="font-medium tracking-wide text-gray-800">{d.DesignationName}</span>
              </div>
            </td>
            <td className="p-4">
              <div className="flex justify-end items-center gap-3 pr-3">
                <Pencil
                  size={17}
                  className="text-violet-500 cursor-pointer hover:text-violet-700"
                  onClick={() => onEdit(d)}
                  aria-label={`Edit ${d.DesignationName}`}
                />
                <Trash2
                  size={17}
                  className="text-red-500 cursor-pointer hover:text-red-600"
                  onClick={() => onDelete(d)}
                  aria-label={`Delete ${d.DesignationName}`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
