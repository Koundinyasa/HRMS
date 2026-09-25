import { NavLink, useParams } from "react-router-dom";
import type { CardGroup } from "../types/reportUI.types";

interface ReportCardGroupProps {
  groups: CardGroup[];
}

export default function ReportCardGroup({
  groups,
}: ReportCardGroupProps) {
  const { domain } = useParams();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <div
          key={group.title}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <h2 className="mb-3 text-base font-semibold text-slate-800">
            {group.title}
          </h2>

          <div className="flex flex-col gap-2">
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={`/${domain}/admin/insights/${item.path}`}
                className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-blue-50"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}