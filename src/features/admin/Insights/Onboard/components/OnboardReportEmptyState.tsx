import noDataImage from "../../../../../assets/images/no-data.png";

export default function OnboardReportEmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center bg-[#F8FAFC] px-4">
      <img
        src={noDataImage}
        alt="No onboard report data"
        className="mb-5 h-[220px] w-auto object-contain"
      />

      <p className="text-[13px] font-medium text-[#94A3B8]">
        Did Not Find Any Onboard Report
      </p>
    </div>
  );
}