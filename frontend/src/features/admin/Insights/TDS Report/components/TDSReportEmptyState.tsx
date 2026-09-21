import noDataImage from "@/assets/images/no-data.png?url";

interface TDSReportEmptyStateProps {
  message?: string;
}

export default function TDSReportEmptyState({
  message = "No Data Found",
}: TDSReportEmptyStateProps) {
  return (
    <div className="flex min-h-[420px] w-full flex-col items-center justify-center bg-[#f5f6fa] px-4 py-8">
      <img
        src={noDataImage}
        alt="No data found"
        className="mb-4 h-[190px] w-[300px] object-contain"
      />

      {/* Body — Urbanist Regular — 20px */}
      <p className="font-[Urbanist] text-center text-[20px] font-normal text-[#b86b5e]">
        {message}
      </p>
    </div>
  );
}