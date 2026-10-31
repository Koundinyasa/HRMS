export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between border-b border-red-200 pb-2 mb-1">
        <h3 className="text-sm font-semibold text-slate-800">
          Notifications
        </h3>
      </div>

      {/* No notification feed exists yet, so say so instead of showing made-up items. */}
      <p className="py-8 text-center text-sm text-slate-400">
        No new notifications
      </p>
    </div>
  );
}
