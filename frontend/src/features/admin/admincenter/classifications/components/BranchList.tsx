import { Settings, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import type { Branch } from "../types/classificationTypes";

export type BranchSortKey = "BranchName" | "State" | "IsActive";

function SortableHeader({
  label,
  sortKey,
  activeKey,
  onSort,
}: {
  label: string;
  sortKey: BranchSortKey;
  activeKey: BranchSortKey | null;
  onSort: (key: BranchSortKey) => void;
}) {
  return (
    <th className="py-3 font-medium">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-1 hover:text-gray-700 ${
          activeKey === sortKey ? "text-violet-600" : ""
        }`}
      >
        {label}
        <ArrowUpDown size={12} />
      </button>
    </th>
  );
}

export default function BranchList({
  branches,
  onEdit,
  onDelete,
  onConfigure,
  sortKey,
  onSort,
}: {
  branches: Branch[];
  onEdit: (b: Branch) => void;
  onDelete: (b: Branch) => void;
  onConfigure?: (b: Branch) => void;
  sortKey?: BranchSortKey | null;
  onSort?: (key: BranchSortKey) => void;
}) {
  if (branches.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="font-medium">No branches found</h3>
        <p className="mt-1 text-sm text-muted-foreground">Add a branch to get started.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground bg-[#F5F3FF]">
          {onSort ? (
            <SortableHeader label="Branch Name" sortKey="BranchName" activeKey={sortKey ?? null} onSort={onSort} />
          ) : (
            <th className="py-3 font-medium">Branch Name</th>
          )}
          <th className="py-3 font-medium">Address</th>
          {onSort ? (
            <SortableHeader label="State" sortKey="State" activeKey={sortKey ?? null} onSort={onSort} />
          ) : (
            <th className="py-3 font-medium">State</th>
          )}
          {onSort ? (
            <SortableHeader label="Status" sortKey="IsActive" activeKey={sortKey ?? null} onSort={onSort} />
          ) : (
            <th className="py-3 font-medium">Status</th>
          )}
          <th className="py-3 font-medium">Action</th>
        </tr>
      </thead>
      <tbody>
        {branches.map((b) => (
          <tr key={b.Id} className="border-b last:border-0">
            <td className="py-3 px-3 font-medium text-gray-800">{b.BranchName}</td>
            <td className="py-3 px-3 text-gray-700">{b.Address}</td>
            <td className="py-3 px-3 text-gray-700">{b.State}</td>
            <td className="py-3 px-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  b.IsActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                }`}
              >
                {b.IsActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="py-3 px-3">
              <div className="flex gap-3 text-violet-500">
                <Settings
                  size={16}
                  className="cursor-pointer hover:text-violet-700"
                  onClick={() => onConfigure?.(b)}
                  aria-label={`Configure ${b.BranchName}`}
                />
                <Pencil
                  size={16}
                  className="cursor-pointer hover:text-violet-700"
                  onClick={() => onEdit(b)}
                  aria-label={`Edit ${b.BranchName}`}
                />
                <Trash2
                  size={16}
                  className="cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => onDelete(b)}
                  aria-label={`Delete ${b.BranchName}`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
