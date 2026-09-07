import { Pencil, Trash2, FileText } from "lucide-react";
import type { AdditionalClassification } from "../types/classificationTypes";

const TAG_COLORS: Record<string, string> = {
  Department: "bg-blue-100 text-blue-700",
  Team: "bg-emerald-100 text-emerald-700",
};

function tagColor(tag: string) {
  return TAG_COLORS[tag] ?? "bg-violet-100 text-violet-700";
}

export default function AdditionalClassificationList({
  items, selectedId, onSelect, onEdit, onDelete,
}: {
  items: AdditionalClassification[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit: (item: AdditionalClassification) => void;
  onDelete: (id: number) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="font-medium">No classifications found</h3>
        <p className="mt-1 text-sm text-muted-foreground">Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isSelected = item.Id === selectedId;
        return (
          <div
            key={item.Id}
            onClick={() => onSelect(item.Id)}
            className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
              isSelected
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                : "bg-white hover:bg-violet-50 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSelected ? "bg-white/15" : "bg-violet-50"
                }`}
              >
                <FileText size={15} className={isSelected ? "text-white" : "text-violet-500"} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{item.Name}</p>
                <span
                  className={`inline-block mt-0.5 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    isSelected ? "bg-white/20 text-white" : tagColor(item.Tag)
                  }`}
                >
                  {item.Tag}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Pencil
                size={14}
                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                className={isSelected ? "text-white/90 hover:text-white" : "text-violet-500 hover:text-violet-700"}
              />
              <Trash2
                size={14}
                onClick={(e) => { e.stopPropagation(); onDelete(item.Id); }}
                className="text-red-500 hover:text-red-600"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
