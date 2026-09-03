import { Plus } from "lucide-react";

interface SeparationHeaderProps {
  onAdd?: () => void;
}

export default function SeparationHeader({
  onAdd,
}: SeparationHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Employee Separation
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage employee exit and separation details
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        <Plus size={16} />
        Add Separation
      </button>
    </div>
  );
}