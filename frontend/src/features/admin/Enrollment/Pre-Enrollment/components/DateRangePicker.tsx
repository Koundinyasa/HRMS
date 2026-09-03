// import { useState } from "react";
// import DatePickerField from "./DatePickerField";
// import { useDatePicker } from "../hooks/useDatePicker";

// export default function DateRangePicker() {
//   const [fromDate, setFromDate] = useState("01-04-2026");
//   const [toDate, setToDate] = useState("30-06-2026");

//   const fromPicker = useDatePicker(fromDate, setFromDate);
//   const toPicker = useDatePicker(toDate, setToDate);

//   return (
//     <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-3">
//       {/* From Month */}
//       <div className="flex min-w-0 items-center gap-2">
//         <span className="whitespace-nowrap text-xs font-medium text-slate-700">
//           From Month
//         </span>

//         <div className="min-w-0 flex-1 sm:w-[112px] sm:flex-none">
//           <DatePickerField
//             id="from-month"
//             label=""
//             datePicker={fromPicker}
//           />
//         </div>
//       </div>

//       {/* To Month */}
//       <div className="flex min-w-0 items-center gap-2">
//         <span className="whitespace-nowrap text-xs font-medium text-slate-700">
//           To Month
//         </span>

//         <div className="min-w-0 flex-1 sm:w-[112px] sm:flex-none">
//           <DatePickerField
//             id="to-month"
//             label=""
//             datePicker={toPicker}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import DatePickerField from "./DatePickerField";
import { useDatePicker } from "../hooks/useDatePicker";

export default function DateRangePicker() {
  const [fromDate, setFromDate] = useState("01/04/2026");
  const [toDate, setToDate] = useState("30/06/2026");

  const fromPicker = useDatePicker(fromDate, setFromDate);
  const toPicker = useDatePicker(toDate, setToDate);

  return (
    <div
      className="
        flex
        min-w-0
        w-full
        items-center
        justify-start
        gap-x-3
        gap-y-2
        flex-wrap
        sm:justify-end
      "
    >
      {/* From Month */}
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className="
            text-[12px]
            font-medium
            text-slate-800
          "
        >
          From Month
        </span>

        <div className="w-[109px] max-w-full shrink-0">
          <DatePickerField
            id="from-month"
            label=""
            datePicker={fromPicker}
          />
        </div>
      </div>

      {/* To Month */}
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className="
            text-[12px]
            font-medium
            text-slate-800
          "
        >
          To Month
        </span>

        <div className="w-[109px] max-w-full shrink-0">
          <DatePickerField
            id="to-month"
            label=""
            datePicker={toPicker}
          />
        </div>
      </div>
    </div>
  );
}
