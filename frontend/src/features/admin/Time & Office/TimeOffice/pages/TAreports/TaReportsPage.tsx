import { TA_REPORT_CATEGORIES } from "../../constants/timeoffice.constants";

/** Report links are inert for now — each opens a dedicated generator once the backend exists. */
export default function TaReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-500 rounded-xl px-3 py-2 w-max">
        <span className="px-4 py-2 rounded-lg border border-emerald-500 bg-white text-sm font-medium text-emerald-600">TA Reports</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {TA_REPORT_CATEGORIES.map((category) => (
          <div key={category.title} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-slate-800 pb-2 mb-1 border-b border-slate-100">{category.title}</h3>
            {category.reports.map((report) => (
              <button
                key={report}
                type="button"
                className="text-left text-sm text-slate-600 hover:text-emerald-600 py-1.5"
              >
                {report}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
