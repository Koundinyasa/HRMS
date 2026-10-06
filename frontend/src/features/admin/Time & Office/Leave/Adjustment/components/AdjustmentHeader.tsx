import React from "react";

const AdjustmentHeader: React.FC = () => {
  return (
    <div className="flex items-center font-[Urbanist]">
      <div>
        <h1 className="font-[Urbanist] text-[20px] font-bold leading-[24px] text-[#9a5547]">
          Adjustment
        </h1>

        <div className="mt-1 h-[3px] w-10 rounded-full bg-[#9a5547]" />
      </div>
    </div>
  );
};

export default AdjustmentHeader;
