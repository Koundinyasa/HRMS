import { Pencil, Trash2, Menu, ArrowUp } from "lucide-react";
import type { SalaryComponent } from "../types/classificationTypes";

function StatusPill({ value }: { value: 0 | 1 }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        value === 1 ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
      }`}
    >
      {value === 1 ? "Yes" : "No"}
    </span>
  );
}

export default function SalaryComponentList({
  components,
  onEdit,
  onDelete,
}: {
  components: SalaryComponent[];
  onEdit: (c: SalaryComponent) => void;
  onDelete: (c: SalaryComponent) => void;
}) {
  if (components.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="font-medium">No components found</h3>
        <p className="mt-1 text-sm text-muted-foreground">Add a component to get started.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-3 font-medium">Component Name</th>
          <th className="py-3 font-medium">Print Name</th>
          <th className="py-3 font-medium">
            <button type="button" className="flex items-center gap-1 text-violet-600 font-medium">
              Calculative Field <ArrowUp size={13} />
            </button>
          </th>
          <th className="py-3 font-medium">Open Component</th>
          <th className="py-3 font-medium text-center">Action</th>
          <th className="py-3 font-medium text-right pr-1">Sorting</th>
        </tr>
      </thead>
      <tbody>
        {components.map((c) => {
          const isLocked = c.IsSystemDefined === true;
          return (
            <tr key={c.Id} className="border-b last:border-0">
              <td className="py-3 font-medium">{c.ComponentName}</td>
              <td className="py-3 text-muted-foreground">{c.PrintName}</td>
              <td className="py-3">
                <StatusPill value={c.IsCalculative} />
              </td>
              <td className="py-3">
                <StatusPill value={c.IsOpenComponent} />
              </td>
              <td className="py-3">
                <div className="flex justify-center gap-3">
                  <Pencil
                    size={16}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(c)}
                  />
                  <Trash2
                    size={16}
                    className={
                      isLocked
                        ? "text-gray-300 cursor-not-allowed"
                        : "cursor-pointer text-red-500 hover:text-red-600"
                    }
                    onClick={() => {
                      if (!isLocked) onDelete(c);
                    }}
                    aria-disabled={isLocked}
                  />
                </div>
              </td>
              <td className="py-3 text-right pr-1">
                <Menu size={16} className="inline text-muted-foreground cursor-grab" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
