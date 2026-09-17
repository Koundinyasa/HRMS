// import { useState } from "react";

// import {
//   ArrowDown,
//   ArrowUp,
//   Trash2,
// } from "lucide-react";

// export default function SelectedColumns() {
//   const [columns, setColumns] =
//     useState([
//       "Ref No",
//       "Empname",
//       "Month Name",
//     ]);

//   const moveColumn = (
//     index: number,
//     direction: "up" | "down"
//   ) => {
//     const newColumns = [...columns];

//     const targetIndex =
//       direction === "up"
//         ? index - 1
//         : index + 1;

//     if (
//       targetIndex < 0 ||
//       targetIndex >= newColumns.length
//     ) {
//       return;
//     }

//     [
//       newColumns[index],
//       newColumns[targetIndex],
//     ] = [
//       newColumns[targetIndex],
//       newColumns[index],
//     ];

//     setColumns(newColumns);
//   };

//   const removeColumn = (
//     index: number
//   ) => {
//     setColumns(
//       columns.filter(
//         (_, columnIndex) =>
//           columnIndex !== index
//       )
//     );
//   };

//   return (
//     <div
//       className="
//         w-full
//         rounded-[14px]
//         border
//         border-[#d9d9d9]
//         bg-white
//         p-5
//         shadow-[0_2px_7px_rgba(0,0,0,0.18)]
//       "
//     >

//       {/* HEADER */}
//       <div
//   className="
//     mb-3
//     flex
//     flex-col
//     items-start
//     gap-2
//     sm:flex-row
//     sm:items-center
//     sm:justify-between
//   "
// >

//         <h3
//           className="
//             text-[15px]
//             font-semibold
//             text-[#263445]
//           "
//         >
//           Selected Columns
//         </h3>

//         <span
//           className="
//             whitespace-nowrap
//             rounded-[5px]
//             bg-[#fff0eb]
//             px-2
//             py-1
//             text-[10px]
//             font-semibold
//             text-[#b66a58]
//           "
//         >
//           {columns.length} Fields Selected
//         </span>

//       </div>

//       {/* COLUMN LIST */}
//       <div className="space-y-2">

//         {columns.map(
//           (column, index) => (

//             <div
//               key={`${column}-${index}`}
//               className="
//                 flex
//                 h-[34px]
//                 items-center
//                 gap-2
//                 rounded-[5px]
//                 border
//                 border-[#e4e8ec]
//                 px-2
//               "
//             >

//               <span
//                 className="
//                   w-[15px]
//                   shrink-0
//                   text-[11px]
//                   text-[#737b84]
//                 "
//               >
//                 {index + 1}.
//               </span>

//               <span
//                 className="
//                   min-w-0
//                   flex-1
//                   truncate
//                   text-[12px]
//                   text-[#43505d]
//                 "
//               >
//                 {column}
//               </span>

//               {/* UP */}
//               <button
//                 type="button"
//                 onClick={() =>
//                   moveColumn(
//                     index,
//                     "up"
//                   )
//                 }
//                 className="
//                   text-[#68717a]
//                   hover:text-[#333]
//                 "
//               >
//                 <ArrowUp size={13} />
//               </button>

//               {/* DOWN */}
//               <button
//                 type="button"
//                 onClick={() =>
//                   moveColumn(
//                     index,
//                     "down"
//                   )
//                 }
//                 className="
//                   text-[#68717a]
//                   hover:text-[#333]
//                 "
//               >
//                 <ArrowDown size={13} />
//               </button>

//               {/* DELETE */}
//               <button
//                 type="button"
//                 onClick={() =>
//                   removeColumn(index)
//                 }
//                 className="
//                   text-[#ed7777]
//                   hover:text-[#d95353]
//                 "
//               >
//                 <Trash2 size={14} />
//               </button>

//             </div>

//           )
//         )}

//       </div>

//       {/* HELPER */}
//       <div
//         className="
//           mt-4
//           rounded-[7px]
//           bg-[#f7f9fb]
//           px-3
//           py-3
//           text-[11px]
//           leading-[1.5]
//           text-[#a1a9b2]
//         "
//       >
//         Drag and drop fields to prioritize report hierarchy.
//         Group and sort rules will follow this column layout.
//       </div>

//     </div>
//   );
// }

import { useState } from "react";

import {
  ArrowDown,
  ArrowUp,
  Trash2,
} from "lucide-react";

export default function SelectedColumns() {
  const [columns, setColumns] =
    useState([
      "Ref No",
      "Empname",
      "Month Name",
    ]);

  const moveColumn = (
    index: number,
    direction: "up" | "down"
  ) => {
    const newColumns = [...columns];

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= newColumns.length
    ) {
      return;
    }

    [
      newColumns[index],
      newColumns[targetIndex],
    ] = [
      newColumns[targetIndex],
      newColumns[index],
    ];

    setColumns(newColumns);
  };

  const removeColumn = (
    index: number
  ) => {
    setColumns(
      columns.filter(
        (_, columnIndex) =>
          columnIndex !== index
      )
    );
  };

  return (
    <section
      className="
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-lg
        border
        border-[#e0e5ea]
        bg-white
        p-3
        shadow-sm
        sm:p-4
      "
    >
      <div
        className="
          mb-3
          flex
          flex-col
          items-start
          gap-2
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <h3
          className="
            min-w-0
            text-[15px]
            font-semibold
            text-[#263445]
          "
        >
          Selected Columns
        </h3>

        <span
          className="
            whitespace-nowrap
            rounded-[5px]
            bg-[#fff0eb]
            px-2
            py-1
            text-[10px]
            font-semibold
            text-[#b66a58]
          "
        >
          {columns.length} Fields Selected
        </span>
      </div>

      <div
        className="
          max-h-[360px]
          w-full
          min-w-0
          space-y-2
          overflow-y-auto
          overflow-x-hidden
          pr-1
          sm:max-h-[300px]
        "
      >
        {columns.map(
          (column, index) => (
            <div
              key={`${column}-${index}`}
              className="
                flex
                h-[34px]
                min-w-0
                w-full
                items-center
                gap-1
                rounded-[5px]
                border
                border-[#e4e8ec]
                px-2
                sm:gap-2
              "
            >
              <span
                className="
                  w-[15px]
                  shrink-0
                  text-[11px]
                  text-[#737b84]
                "
              >
                {index + 1}.
              </span>

              <span
                className="
                  min-w-0
                  flex-1
                  truncate
                  text-[11px]
                  text-[#43505d]
                  sm:text-[12px]
                "
                title={column}
              >
                {column}
              </span>

              <button
                type="button"
                onClick={() =>
                  moveColumn(index, "up")
                }
                aria-label={`Move ${column} up`}
                className="
                  flex
                  h-[26px]
                  w-[26px]
                  shrink-0
                  items-center
                  justify-center
                  rounded
                  text-[#68717a]
                  transition-colors
                  hover:bg-[#f5f5f5]
                  hover:text-[#333]
                "
              >
                <ArrowUp size={13} />
              </button>

              <button
                type="button"
                onClick={() =>
                  moveColumn(index, "down")
                }
                aria-label={`Move ${column} down`}
                className="
                  flex
                  h-[26px]
                  w-[26px]
                  shrink-0
                  items-center
                  justify-center
                  rounded
                  text-[#68717a]
                  transition-colors
                  hover:bg-[#f5f5f5]
                  hover:text-[#333]
                "
              >
                <ArrowDown size={13} />
              </button>

              <button
                type="button"
                onClick={() =>
                  removeColumn(index)
                }
                aria-label={`Remove ${column}`}
                className="
                  flex
                  h-[26px]
                  w-[26px]
                  shrink-0
                  items-center
                  justify-center
                  rounded
                  text-[#ed7777]
                  transition-colors
                  hover:bg-[#fff1f1]
                  hover:text-[#d95353]
                "
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        )}
      </div>

      <div
        className="
          mt-4
          w-full
          min-w-0
          rounded-[7px]
          bg-[#f7f9fb]
          px-3
          py-3
          text-[11px]
          leading-[1.5]
          text-[#a1a9b2]
        "
      >
        Drag and drop fields to prioritize report hierarchy.
        Group and sort rules will follow this column layout.
      </div>
    </section>
  );
}
