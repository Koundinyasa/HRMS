import { Pencil, Trash2 } from "lucide-react";
import ClassificationStatus from "./ClassificationStatus";
import { TABLE_COLUMNS } from "../constants/classification.constants";
import type { Classification } from "../types/classification.types";

export default function ClassificationTable({
  classifications,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  classifications: Classification[];
  isLoading: boolean;
  onEdit: (record: Classification) => void;
  onDelete: (record: Classification) => void;
  onToggleStatus: (record: Classification) => void;
}) {
  return (
    <div className="mt-7 rounded-xl shadow-md overflow-hidden bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-[#e8ddff] text-gray-800 text-sm">
            {TABLE_COLUMNS.map((col) => (
              <th key={col.key} className="p-4 text-center first:text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={TABLE_COLUMNS.length} className="p-8 text-center text-sm text-gray-400">
                Loading classifications...
              </td>
            </tr>
          )}

          {!isLoading && classifications.length === 0 && (
            <tr>
              <td colSpan={TABLE_COLUMNS.length} className="p-8 text-center text-sm text-gray-400">
                No classifications found.
              </td>
            </tr>
          )}

          {!isLoading &&
            classifications.map((item) => (
              <tr key={item.id} className="text-sm text-gray-700 border-t border-gray-100">
                <td className="p-5">{item.name}</td>
                <td className="p-5 text-center">{item.shortName}</td>
                <td className="p-5 text-center">{item.type}</td>
                <td className="p-5 text-center">
                  <ClassificationStatus
                    active={item.active}
                    onToggle={() => onToggleStatus(item)}
                  />
                </td>
                <td className="p-5">
                  <div className="flex justify-center gap-3">
                    <Pencil
                      size={18}
                      className="text-gray-500 cursor-pointer hover:text-gray-700"
                      onClick={() => onEdit(item)}
                    />
                    <Trash2
                      size={18}
                      className="text-red-500 cursor-pointer hover:text-red-600"
                      onClick={() => onDelete(item)}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
