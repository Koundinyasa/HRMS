// import React from "react";

// interface TimeOfficeSectionProps {
//   title: string;
//   reports: string[];
// }

// export default function TimeOfficeSection({
//   title,
//   reports,
// }: TimeOfficeSectionProps) {
//   return (
//     <div className="overflow-hidden rounded-md border border-[#e1e4ea] bg-white shadow-sm">
//       {/* Section Header */}
//       <div className="min-h-[58px] bg-[#e5e8f0] px-4 py-2.5">
//         <h2 className="text-[18px] font-semibold leading-6 text-[#18243a]">
//           {title}
//         </h2>
//       </div>

//       {/* Report List */}
//       <div className="px-4 py-1.5">
//         {reports.map((report) => (
//           <button
//             key={report}
//             type="button"
//             className="block w-full py-[7px] text-left text-[15.5px] font-medium text-[#68717d] transition-colors hover:text-[#3ba5d6]"
//           >
//             {report}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// }
import { ChevronRight, FileText } from "lucide-react";

interface TimeOfficeSectionProps {
  title: string;
  reports: string[];
}

export default function TimeOfficeSection({
  title,
  reports,
}: TimeOfficeSectionProps) {
  return (
    <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-[12px] border border-[#aeb4bb] bg-white">
      {/* Section Header */}
      <div className="flex min-h-[49px] shrink-0 items-center gap-2 border-b border-[#dfe3e8] bg-[#f3f5f7] px-4">
        <FileText
          size={17}
          strokeWidth={1.8}
          className="shrink-0 text-[#a45a4a]"
        />

        {/* Heading */}
        <h2 className="font-[Urbanist] text-[18px] font-bold leading-6 text-[#9a5547]">
          {title}
        </h2>
      </div>

      {/* Report List */}
      <div className="flex-1 px-2 py-2">
        {reports.map((report) => (
          <button
            key={report}
            type="button"
            className="flex min-h-[32px] w-full items-center justify-between rounded-none px-2 font-[Urbanist] text-[13px] font-normal leading-5 text-[#202124] transition-colors hover:bg-[#fff5f2] hover:text-[#9a5547]"
          >
            {/* Body */}
            <span className="whitespace-nowrap">
              {report}
            </span>

            {/* Utility / UI */}
            <ChevronRight
              size={17}
              strokeWidth={1.8}
              className="ml-2 shrink-0 text-[#3f3f3f]"
            />
          </button>
        ))}
      </div>
    </div>
  );
}