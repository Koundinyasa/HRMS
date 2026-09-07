import { Pencil, Trash2, Settings, ArrowUpDown } from "lucide-react";
import type { Bank } from "../types/classificationTypes";

export type BankSortKey = "BankName" | "AcType" | "IfscCode";

function SortableHeader({
  label,
  sortKey,
  activeKey,
  onSort,
}: {
  label: string;
  sortKey: BankSortKey;
  activeKey: BankSortKey | null;
  onSort: (key: BankSortKey) => void;
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

export default function BankList({
  banks,
  onEdit,
  onDelete,
  onConfigure,
  sortKey,
  onSort,
}: {
  banks: Bank[];
  onEdit: (b: Bank) => void;
  onDelete: (b: Bank) => void;
  onConfigure: (b: Bank) => void;
  sortKey?: BankSortKey | null;
  onSort?: (key: BankSortKey) => void;
}) {
  if (banks.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="font-medium">No banks found</h3>
        <p className="mt-1 text-sm text-muted-foreground">Add a bank to get started.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground bg-[#F5F3FF]">
          {onSort ? (
            <SortableHeader label="Name" sortKey="BankName" activeKey={sortKey ?? null} onSort={onSort} />
          ) : (
            <th className="py-3 font-medium">Name</th>
          )}
          {onSort ? (
            <SortableHeader label="A/C Type" sortKey="AcType" activeKey={sortKey ?? null} onSort={onSort} />
          ) : (
            <th className="py-3 font-medium">A/C Type</th>
          )}
          {onSort ? (
            <SortableHeader label="IFSC Code" sortKey="IfscCode" activeKey={sortKey ?? null} onSort={onSort} />
          ) : (
            <th className="py-3 font-medium">IFSC Code</th>
          )}
          <th className="py-3 font-medium text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {banks.map((b) => (
          <tr key={b.Id} className="border-b last:border-0">
            <td className="py-3 px-3 font-medium text-gray-800">
              <button
                type="button"
                onClick={() => onConfigure(b)}
                className="hover:text-violet-600 hover:underline text-left"
              >
                {b.BankName}
              </button>
            </td>
            <td className="py-3 px-3 text-gray-700">{b.AcType}</td>
            <td className="py-3 px-3 text-gray-700">{b.IfscCode}</td>
            <td className="py-3 px-3">
              <div className="flex justify-center gap-3">
                <Settings
                  size={16}
                  className="cursor-pointer text-muted-foreground hover:text-violet-600"
                  onClick={() => onConfigure(b)}
                  aria-label={`Configure ${b.BankName}`}
                />
                <Pencil
                  size={16}
                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(b)}
                  aria-label={`Edit ${b.BankName}`}
                />
                <Trash2
                  size={16}
                  className="cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => onDelete(b)}
                  aria-label={`Delete ${b.BankName}`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
