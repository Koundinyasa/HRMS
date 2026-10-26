export default function TAInsightsPage() {
  return (
    <div className="space-y-4">
 
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-700">
          TA Insights
        </h2>
 
        <p className="mt-2 text-sm text-slate-400">
          Attendance insights will be displayed here.
        </p>
      </div>
 
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
 
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Weekly Work Hours
          </h3>
 
          <div className="space-y-3">
            {[
              ["Week 1", "26.3"],
              ["Week 2", "22.2"],
              ["Week 3", "45.4"],
              ["Week 4", "27.7"],
              ["Week 5", "9.1"],
            ].map(([week, hours]) => (
              <div
                key={week}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-500">
                  {week}
                </span>
 
                <span className="font-semibold text-slate-700">
                  {hours} hrs
                </span>
              </div>
            ))}
          </div>
        </div>
 
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Status Breakdown
          </h3>
 
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                On time
              </span>
              <span className="font-semibold text-emerald-600">
                21 days
              </span>
            </div>
 
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Late In
              </span>
              <span className="font-semibold text-amber-600">
                1 day
              </span>
            </div>
 
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Absent
              </span>
              <span className="font-semibold text-red-600">
                7 days
              </span>
            </div>
 
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                On Leave
              </span>
              <span className="font-semibold text-blue-600">
                2 days
              </span>
            </div>
          </div>
        </div>
 
      </div>
 
    </div>
  );
}
 