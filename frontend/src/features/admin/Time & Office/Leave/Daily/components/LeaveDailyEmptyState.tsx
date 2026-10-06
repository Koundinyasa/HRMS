import noDataImage from "@/assets/images/no-data.png";

const LeaveDailyEmptyState = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-16 font-[Urbanist]">
      <img
        src={noDataImage}
        alt="No data available"
        className="h-auto w-[180px] object-contain"
      />

      <p className="mt-4 font-[Urbanist] text-[13px] font-normal leading-[18px] text-slate-400">
        No data available
      </p>
    </div>
  );
};

export default LeaveDailyEmptyState;