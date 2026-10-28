import noDataImage from "@/assets/images/no-data.png";

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <img
        src={noDataImage}
        alt="No data found"
        className="h-[200px] w-[200px] object-contain sm:h-[240px] sm:w-[240px] lg:h-[300px] lg:w-[300px]"
      />
      <p className="text-sm font-medium text-rose-400">{message}</p>
    </div>
  );
}