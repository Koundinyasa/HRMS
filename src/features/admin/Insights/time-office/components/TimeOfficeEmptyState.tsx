// import noDataImage from "@/assets/images/no-data.png";

// interface TimeOfficeEmptyStateProps {
//   message?: string;
// }

// export default function TimeOfficeEmptyState({
//   message = "No attendance records found.",
// }: TimeOfficeEmptyStateProps) {
//   return (
//     <div className="flex min-h-[420px] flex-col items-center justify-center bg-[#f5f6fa] px-4 py-10">
//       <img
//         src={noDataImage}
//         alt="No data"
//         className="w-[420px] max-w-full object-contain"
//       />

//       {message && (
//         <p className="mt-2 text-center text-[28px] font-medium text-[#b06d71] leading-normal">
//           {message}
//         </p>
//       )}
//     </div>
//   );
// }

import noDataImage from "@/assets/images/no-data.png";

interface TimeOfficeEmptyStateProps {
  message?: string;
}

export default function TimeOfficeEmptyState({
  message = "No attendance records found.",
}: TimeOfficeEmptyStateProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center bg-white px-4 py-10">
      <img
        src={noDataImage}
        alt="No data"
        className="w-[420px] max-w-full object-contain"
      />

      {message && (
        <p className="mt-2 text-center font-[Urbanist] text-[20px] font-normal leading-normal text-[#555a7a]">
          {message}
        </p>
      )}
    </div>
  );
}