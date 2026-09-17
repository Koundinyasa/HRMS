// import { X } from "lucide-react";

// type Props = {
//   companyName: string;
//   onClear?: () => void;
// };

// export default function CompanyChipFilter({ companyName, onClear }: Props) {
//   return (
//     <div
//       className="
//         inline-flex
//         items-center
//         gap-2
//         rounded-full
//         border
//         border-[#60A5FA]
//         bg-white
//         px-3
//         py-1.5
//         text-sm
//         font-medium
//         text-[#2563EB]
//       "
//     >
//       <span className="truncate">{companyName}</span>
//       {onClear && (
//         <button
//           type="button"
//           onClick={onClear}
//           className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#2563EB] hover:bg-blue-50"
//           aria-label="Clear company"
//         >
//           <X size={14} strokeWidth={2.5} />
//         </button>
//       )}
//     </div>
//   );
// }











import { X } from "lucide-react";

type Props = {
  companyName: string;
  onClear?: () => void;
};

export default function CompanyChipFilter({ companyName, onClear }: Props) {
  return (
    <div
      className="
        inline-flex w-fit max-w-full items-center gap-2 rounded-full
        border border-[#60A5FA] bg-white px-3 py-1.5
        text-sm font-medium text-[#2563EB]
      "
    >
      <span className="truncate">{companyName}</span>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#2563EB] hover:bg-blue-50"
          aria-label="Clear company"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}