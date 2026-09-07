import { Plus, Copy, Pencil, Trash2, FileText } from "lucide-react";
import type { SalaryStructureDefinition } from "../types/classificationTypes";

export default function SalaryStructureSidebar({
  structures,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onClone,
}: {
  structures: SalaryStructureDefinition[];
  selectedId: number;
  onSelect: (id: number) => void;
  onAdd: () => void;
  onEdit: (structure: SalaryStructureDefinition) => void;
  onDelete: (structure: SalaryStructureDefinition) => void;
  onClone: () => void;
}) {
  return (
    <div className="w-64 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Salary Structure</h2>
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add structure"
          className="w-7 h-7 rounded-lg border border-violet-200 text-violet-600 flex items-center justify-center hover:bg-violet-50"
        >
          <Plus size={15} />
        </button>
      </div>

      <button
        type="button"
        onClick={onClone}
        className="w-full flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700 mb-3 px-1"
      >
        <Copy size={14} /> Clone Structure
      </button>

      <div className="space-y-2">
        {structures.map((s) => {
          const isSelected = s.Id === selectedId;
          return (
            <div
              key={s.Id}
              onClick={() => onSelect(s.Id)}
              className={`group flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${
                isSelected ? "bg-violet-600 text-white" : "bg-white hover:bg-violet-50 text-gray-700 border"
              }`}
            >
              <FileText size={16} className={isSelected ? "text-white mt-0.5" : "text-gray-400 mt-0.5"} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.Name}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600">
                  {s.Tag}
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <Pencil
                  size={14}
                  className={`cursor-pointer ${isSelected ? "text-white/90 hover:text-white" : "text-violet-500 hover:text-violet-700"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(s);
                  }}
                  aria-label={`Edit ${s.Name}`}
                />
                {!s.IsSystemDefined && (
                  <Trash2
                    size={14}
                    className={`cursor-pointer ${isSelected ? "text-white/90 hover:text-white" : "text-red-500 hover:text-red-600"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(s);
                    }}
                    aria-label={`Delete ${s.Name}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
