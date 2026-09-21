export default function PunchPage() {
  return (
    <div className="space-y-4">
 
      {/* Policy / Shift Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
 
          <div>
            <h3 className="border-b border-slate-200 pb-2 text-sm font-semibold text-sky-600">
              Policy Details
            </h3>
 
            <div className="mt-2 space-y-1 text-sm text-slate-400">
              <p>N/A</p>
              <p>N/A</p>
            </div>
          </div>
 
          <div>
            <h3 className="border-b border-slate-200 pb-2 text-sm font-semibold text-sky-600">
              Shift Details
            </h3>
 
            <div className="mt-2 space-y-1 text-sm text-slate-400">
              <p>N/A ()</p>
              <p>--:-- TO --:--</p>
            </div>
          </div>
 
        </div>
      </div>
 
      {/* Punch Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
 
        <h3 className="mb-4 text-sm font-semibold text-slate-700">
          Punch Details
        </h3>
 
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full bg-sky-200 px-4 py-1.5 text-xs font-semibold text-sky-700"
          >
            Raw Punches
          </button>
 
          <button
            type="button"
            className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-100"
          >
            Processed Punches
          </button>
        </div>
 
        <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          No Punches
        </div>
 
      </div>
 
    </div>
  );
}