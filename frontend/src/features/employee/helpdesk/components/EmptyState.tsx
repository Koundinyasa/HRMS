import type {
  EmptyStateProps,
} from "../types/helpDesk.types";

export default function EmptyState({
  title = "No tickets found",
  description = "You have not raised any support tickets yet.",
}: EmptyStateProps) {

  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed bg-white p-5 text-center sm:min-h-[250px]">

      <h3 className="text-lg font-semibold text-slate-700 sm:text-lg">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500 sm:text-sm">
        {description}
      </p>

    </div>
  );
}