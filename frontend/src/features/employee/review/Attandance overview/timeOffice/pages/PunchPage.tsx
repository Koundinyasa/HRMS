export default function PunchPage() {
  return (
    <div className="space-y-4 font-[Urbanist]">
 
      {/* Policy / Shift Details */}
      <div className="rounded-xl border border-black bg-white p-4 shadow-sm font-[Urbanist]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 font-[Urbanist]">
 
          <div>
            <h3 className="border-b border-black pb-2 text-sm font-semibold text-sky-600 font-[Urbanist]">
              Policy Details
            </h3>
 
            <div className="mt-2 space-y-1 text-sm text-slate-400 font-[Urbanist]">
              <p>N/A</p>
              <p>N/A</p>
            </div>
          </div>
 
          <div>
            <h3 className="border-b border-black pb-2 text-sm font-semibold text-sky-600 font-[Urbanist]">
              Shift Details
            </h3>
 
            <div className="mt-2 space-y-1 text-sm text-slate-400 font-[Urbanist]">
              <p>N/A ()</p>
              <p>--:-- TO --:--</p>
            </div>
          </div>
 
        </div>
      </div>
 
      {/* Punch Information */}
      <div className="rounded-xl border border-black bg-white p-4 shadow-sm font-[Urbanist]">
 
        <h3 className="mb-4 text-sm font-semibold text-slate-700 font-[Urbanist]">
          Punch Details
        </h3>
 
        <div className="flex flex-wrap gap-2 font-[Urbanist]">
          <button
            type="button"
            className="rounded-full bg-sky-200 px-4 py-1.5 text-xs font-semibold text-sky-700 font-[Urbanist]"
          >
            Raw Punches
          </button>
 
          <button
            type="button"
            className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-100 font-[Urbanist]"
          >
            Processed Punches
          </button>
        </div>
 
        <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-500 font-[Urbanist]">
          No Punches
        </div>
 
      </div>
 
    </div>
  );
}