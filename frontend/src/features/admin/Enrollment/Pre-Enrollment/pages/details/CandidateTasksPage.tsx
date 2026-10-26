import noDataImage from "@/assets/images/no-data.png";

export default function CandidateTasksPage() {
  return (
      <div className="w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-2 border-b border-slate-200 bg-[#f4eae7] text-sm font-semibold text-[#7a3d32]">
          <div className="px-4 py-3 text-center">Emp ID</div>
          <div className="px-4 py-3 text-center">Emp Name</div>
        </div>

        <div className="flex min-h-[420px] flex-col items-center justify-center bg-[#f8f9fb] px-4 py-10 text-center">
          <img
            src={noDataImage}
            alt="No data available"
            className="h-[220px] w-auto object-contain"
          />

          <p className="mt-6 text-base font-medium text-slate-600 md:text-lg">
            Select at least one category to view records.
          </p>
        </div>
      </div>
    );
}