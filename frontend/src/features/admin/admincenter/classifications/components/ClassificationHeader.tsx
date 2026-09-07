import { Plus, Search, Clock } from "lucide-react";

export default function ClassificationHeader({
  search,
  onSearchChange,
  onAddNew,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
}) {
  return (
    <div className="bg-[#e8ddff] rounded-xl min-h-[60px] flex items-center justify-between px-5 py-3 gap-4 flex-wrap">
      <h2 className="text-[#7654e8] font-semibold text-lg">Classifications</h2>

      <div className="flex items-center gap-4">
        <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 border border-[#d8cbff]">
          <Search size={16} className="text-[#7654e8]" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search classifications..."
            className="bg-transparent outline-none text-sm text-gray-700 w-40"
          />
        </div>

        <button
          onClick={onAddNew}
          className="bg-[#7654e8] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Add Classification
        </button>

        <Clock className="text-gray-500 cursor-pointer" size={20} />
      </div>
    </div>
  );
}
