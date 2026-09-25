export default function TAInsightsPage() {
  return (
    <div className="space-y-4 font-[Urbanist]">
 
      <div className="rounded-xl border border-black bg-white p-5 shadow-sm font-[Urbanist]">
        <h2 className="text-base font-semibold text-slate-700 font-[Urbanist]">
          TA Insights
        </h2>
 
        <p className="mt-2 text-sm text-slate-400 font-[Urbanist]">
          Attendance insights will be displayed here.
        </p>
      </div>
 
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 font-[Urbanist]">
 
        <div className="rounded-xl border border-black bg-white p-5 shadow-sm font-[Urbanist]">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 font-[Urbanist]">
            Weekly Work Hours
          </h3>
 
          <div className="space-y-3 font-[Urbanist]">
            {[
              ["Week 1", "26.3"],
              ["Week 2", "22.2"],
              ["Week 3", "45.4"],
              ["Week 4", "27.7"],
              ["Week 5", "9.1"],
            ].map(([week, hours]) => (
              <div
                key={week}
                className="flex items-center justify-between text-sm font-[Urbanist]"
              >
                <span className="text-slate-500 font-[Urbanist]">
                  {week}
                </span>
 
                <span className="font-semibold text-slate-700 font-[Urbanist]">
                  {hours} hrs
                </span>
              </div>
            ))}
          </div>
        </div>
 
        <div className="rounded-xl border border-black bg-white p-5 shadow-sm font-[Urbanist]">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 font-[Urbanist]">
            Status Breakdown
          </h3>
 
          <div className="space-y-3 font-[Urbanist]">
            <div className="flex justify-between text-sm font-[Urbanist]">
              <span className="text-slate-500 font-[Urbanist]">
                On time
              </span>
              <span className="font-semibold text-emerald-600 font-[Urbanist]">
                21 days
              </span>
            </div>
 
            <div className="flex justify-between text-sm font-[Urbanist]">
              <span className="text-slate-500 font-[Urbanist]">
                Late In
              </span>
              <span className="font-semibold text-amber-600 font-[Urbanist]">
                1 day
              </span>
            </div>
 
            <div className="flex justify-between text-sm font-[Urbanist]">
              <span className="text-slate-500 font-[Urbanist]">
                Absent
              </span>
              <span className="font-semibold text-red-600 font-[Urbanist]">
                7 days
              </span>
            </div>
 
            <div className="flex justify-between text-sm font-[Urbanist]">
              <span className="text-slate-500 font-[Urbanist]">
                On Leave
              </span>
              <span className="font-semibold text-blue-600 font-[Urbanist]">
                2 days
              </span>
            </div>
          </div>
        </div>
 
      </div>
 
    </div>
  );
}
 