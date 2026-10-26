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

  const fromPicker = useDatePicker(
    fromDate,
    setFromDate,
  );

  const toPicker = useDatePicker(
    toDate,
    setToDate,
  );

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
        font-urbanist
        sm:justify-end
      "
    >
      {/* From Month */}
      <div
        className="
          flex
          min-w-0
          flex-wrap
          items-center
          gap-x-2
          gap-y-1
          font-urbanist
        "
      >
        {/* Label */}
        <span
          className="
            whitespace-nowrap
            font-urbanist
            text-sm
            font-semibold
            leading-5
            text-slate-800
          "
        >
          From Month
        </span>

        {/* Date Picker */}
        <div
          className="
            w-[124px]
            max-w-full
            shrink-0
            font-urbanist
          "
        >
          <DatePickerField
            id="from-month"
            label=""
            datePicker={fromPicker}
          />
        </div>
      </div>

      {/* To Month */}
      <div
        className="
          flex
          min-w-0
          flex-wrap
          items-center
          gap-x-2
          gap-y-1
          font-urbanist
        "
      >
        {/* Label */}
        <span
          className="
            whitespace-nowrap
            font-urbanist
            text-sm
            font-semibold
            leading-5
            text-slate-800
          "
        >
          To Month
        </span>

        {/* Date Picker */}
        <div
          className="
            w-[124px]
            max-w-full
            shrink-0
            font-urbanist
          "
        >
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