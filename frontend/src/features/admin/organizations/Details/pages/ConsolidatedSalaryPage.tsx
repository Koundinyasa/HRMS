import { useNavigate, useParams } from "react-router-dom";

export default function ConsolidatedSalaryPage() {
  const navigate = useNavigate();
  const { domain } = useParams();

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <button
        type="button"
        onClick={() =>
          navigate(
            `/${domain}/admin/organizations/details/consolidated-salary/sheet`
          )
        }
        className="
          w-full max-w-xs rounded-lg border border-slate-200 bg-white
          px-4 py-3 text-left text-sm font-medium text-slate-700
          shadow-sm transition hover:border-blue-300 hover:bg-blue-50
        "
      >
        Consolidated Salary sheet
      </button>
    </div>
  );
}