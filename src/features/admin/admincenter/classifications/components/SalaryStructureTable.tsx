// import { Pencil, History, Plus } from "lucide-react";
// import type { SalaryComponent, StructureEntry, SalaryComponentType } from "../types/classificationTypes";
// import EmptyStateIllustration from "./EmptyStateIllustration";

// function TypePill({ type }: { type: SalaryComponentType }) {
//   return (
//     <span
//       className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
//         type === "Earnings" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
//       }`}
//     >
//       {type === "Earnings" ? "Earning" : "Deduction"}
//     </span>
//   );
// }

// export default function SalaryStructureTable({
//   rows,
//   emptyLabel,
//   onOrderChange,
//   onEdit,
//   onHistory,
//   onAdd,
// }: {
//   rows: { component: SalaryComponent; entry: StructureEntry }[];
//   emptyLabel: string;
//   onOrderChange: (component: SalaryComponent, order: number) => void;
//   onEdit: (component: SalaryComponent) => void;
//   onHistory: (component: SalaryComponent) => void;
//   onAdd: (component: SalaryComponent) => void;
// }) {
//   if (rows.length === 0) {
//     return <EmptyStateIllustration label={emptyLabel} />;
//   }

//   return (
//     <table className="w-full text-sm">
//       <thead>
//         <tr className="border-b text-left text-muted-foreground">
//           <th className="py-3 font-medium">Component</th>
//           <th className="py-3 font-medium">Calculation Type</th>
//           <th className="py-3 font-medium">Effective From</th>
//           <th className="py-3 font-medium">Effective Till</th>
//           <th className="py-3 font-medium">Based On</th>
//           <th className="py-3 font-medium">TDS Ref</th>
//           <th className="py-3 font-medium">Order By Calculation</th>
//           <th className="py-3 font-medium text-center">Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {rows.map(({ component, entry }) => (
//           <tr key={component.Id} className="border-b last:border-0 align-top">
//             <td className="py-3">
//               <div className="font-medium text-gray-800">{component.ComponentName}</div>
//               <div className="mt-1">
//                 <TypePill type={component.Type} />
//               </div>
//             </td>
//             <td className="py-3 text-gray-700">
//               <div>{entry.CalculationType}</div>
//               {entry.CalculationDetail && (
//                 <div className="text-xs text-gray-400">{entry.CalculationDetail}</div>
//               )}
//             </td>
//             <td className="py-3 text-gray-700">{entry.EffectiveFrom}</td>
//             <td className="py-3 text-gray-700">{entry.EffectiveTill}</td>
//             <td className="py-3 text-gray-700">{entry.BasedOn}</td>
//             <td className="py-3 text-gray-700">{entry.TdsRef || "—"}</td>
//             <td className="py-3">
//               <select
//                 value={entry.Order}
//                 onChange={(e) => onOrderChange(component, Number(e.target.value))}
//                 className="h-8 w-16 rounded-md border border-input bg-transparent px-2 text-sm outline-none"
//               >
//                 {rows.map((_, i) => (
//                   <option key={i + 1} value={i + 1}>
//                     {i + 1}
//                   </option>
//                 ))}
//               </select>
//             </td>
//             <td className="py-3">
//               <div className="flex justify-center gap-3 text-violet-500">
//                 <Pencil
//                   size={16}
//                   className="cursor-pointer hover:text-violet-700"
//                   onClick={() => onEdit(component)}
//                   aria-label={`Edit ${component.ComponentName}`}
//                 />
//                 <History
//                   size={16}
//                   className="cursor-pointer hover:text-violet-700"
//                   onClick={() => onHistory(component)}
//                   aria-label={`History for ${component.ComponentName}`}
//                 />
//                 <Plus
//                   size={16}
//                   className="cursor-pointer hover:text-violet-700"
//                   onClick={() => onAdd(component)}
//                   aria-label={`Add rule for ${component.ComponentName}`}
//                 />
//               </div>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
import { Pencil, History, Plus } from "lucide-react";
import type {
  SalaryComponent,
  StructureEntry,
  SalaryComponentType,
} from "../types/classificationTypes";
import EmptyStateIllustration from "./EmptyStateIllustration";

/* =========================================================
   TYPE PILL
   ========================================================= */

function TypePill({
  type,
}: {
  type: SalaryComponentType;
}) {
  return (
    <span
      className={`
        inline-flex
        items-center
        px-2
        py-0.5
        rounded-full
        text-[9px]
        sm:text-[10px]
        font-medium
        whitespace-nowrap
        ${
          type === "Earnings"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-rose-50 text-rose-500"
        }
      `}
    >
      {type === "Earnings" ? "Earning" : "Deduction"}
    </span>
  );
}

/* =========================================================
   SALARY STRUCTURE TABLE
   ========================================================= */

export default function SalaryStructureTable({
  rows,
  emptyLabel,
  onOrderChange,
  onEdit,
  onHistory,
  onAdd,
}: {
  rows: {
    component: SalaryComponent;
    entry: StructureEntry;
  }[];
  emptyLabel: string;
  onOrderChange: (
    component: SalaryComponent,
    order: number
  ) => void;
  onEdit: (component: SalaryComponent) => void;
  onHistory: (component: SalaryComponent) => void;
  onAdd: (component: SalaryComponent) => void;
}) {
  /* =========================================================
     EMPTY STATE
     ========================================================= */

  if (rows.length === 0) {
    return <EmptyStateIllustration label={emptyLabel} />;
  }

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <table
        className="
          w-full
          min-w-[900px]
          border-collapse
          text-left
        "
      >
        {/* =====================================================
            HEADER
            ===================================================== */}

        <thead>
          <tr
            className="
              border-b
              border-gray-100
              bg-violet-50/60
            "
          >
            <th
              className="
                px-3
                py-2.5
                text-[10px]
                sm:text-[11px]
                font-medium
                text-gray-600
                whitespace-nowrap
              "
            >
              Component
            </th>

            <th
              className="
                px-3
                py-2.5
                text-[10px]
                sm:text-[11px]
                font-medium
                text-gray-600
                whitespace-nowrap
              "
            >
              Calculation Type
            </th>

            <th
              className="
                px-3
                py-2.5
                text-[10px]
                sm:text-[11px]
                font-medium
                text-gray-600
                whitespace-nowrap
              "
            >
              Effective From
            </th>

            <th
              className="
                px-3
                py-2.5
                text-[10px]
                sm:text-[11px]
                font-medium
                text-gray-600
                whitespace-nowrap
              "
            >
              Effective Till
            </th>

            <th
              className="
                px-3
                py-2.5
                text-[10px]
                sm:text-[11px]
                font-medium
                text-gray-600
                whitespace-nowrap
              "
            >
              Based On
            </th>

            <th
              className="
                px-3
                py-2.5
                text-[10px]
                sm:text-[11px]
                font-medium
                text-gray-600
                whitespace-nowrap
              "
            >
              TDS Ref
            </th>

            <th
              className="
                px-3
                py-2.5
                text-[10px]
                sm:text-[11px]
                font-medium
                text-gray-600
                whitespace-nowrap
              "
            >
              Order By Calculation
            </th>

            <th
              className="
                px-3
                py-2.5
                text-[10px]
                sm:text-[11px]
                font-medium
                text-gray-600
                text-center
                whitespace-nowrap
              "
            >
              Action
            </th>
          </tr>
        </thead>

        {/* =====================================================
            BODY
            ===================================================== */}

        <tbody>
          {rows.map(({ component, entry }) => (
            <tr
              key={component.Id}
              className="
                border-b
                border-gray-100
                last:border-b-0
                hover:bg-gray-50/50
                transition-colors
              "
            >
              {/* =================================================
                  COMPONENT
                  ================================================= */}

              <td
                className="
                  px-3
                  py-2.5
                  align-middle
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-1
                    min-w-[90px]
                  "
                >
                  <span
                    className="
                      text-[10px]
                      sm:text-[11px]
                      font-medium
                      text-gray-700
                      whitespace-nowrap
                    "
                  >
                    {component.ComponentName}
                  </span>

                  <div>
                    <TypePill type={component.Type} />
                  </div>
                </div>
              </td>

              {/* =================================================
                  CALCULATION TYPE
                  ================================================= */}

              <td
                className="
                  px-3
                  py-2.5
                  align-middle
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-0.5
                    min-w-[100px]
                  "
                >
                  <span
                    className="
                      text-[10px]
                      sm:text-[11px]
                      text-gray-600
                      whitespace-nowrap
                    "
                  >
                    {entry.CalculationType}
                  </span>

                  {entry.CalculationDetail && (
                    <span
                      className="
                        text-[9px]
                        sm:text-[10px]
                        text-gray-400
                        whitespace-nowrap
                      "
                    >
                      {entry.CalculationDetail}
                    </span>
                  )}
                </div>
              </td>

              {/* =================================================
                  EFFECTIVE FROM
                  ================================================= */}

              <td
                className="
                  px-3
                  py-2.5
                  align-middle
                  text-[10px]
                  sm:text-[11px]
                  text-gray-600
                  whitespace-nowrap
                "
              >
                {entry.EffectiveFrom}
              </td>

              {/* =================================================
                  EFFECTIVE TILL
                  ================================================= */}

              <td
                className="
                  px-3
                  py-2.5
                  align-middle
                  text-[10px]
                  sm:text-[11px]
                  text-gray-600
                  whitespace-nowrap
                "
              >
                {entry.EffectiveTill}
              </td>

              {/* =================================================
                  BASED ON
                  ================================================= */}

              <td
                className="
                  px-3
                  py-2.5
                  align-middle
                  text-[10px]
                  sm:text-[11px]
                  text-gray-600
                  whitespace-nowrap
                "
              >
                {entry.BasedOn}
              </td>

              {/* =================================================
                  TDS REF
                  ================================================= */}

              <td
                className="
                  px-3
                  py-2.5
                  align-middle
                  text-[10px]
                  sm:text-[11px]
                  text-gray-600
                  whitespace-nowrap
                "
              >
                {entry.TdsRef || "—"}
              </td>

              {/* =================================================
                  ORDER
                  ================================================= */}

              <td
                className="
                  px-3
                  py-2.5
                  align-middle
                "
              >
                <select
                  value={entry.Order}
                  onChange={(e) =>
                    onOrderChange(
                      component,
                      Number(e.target.value)
                    )
                  }
                  className="
                    h-7
                    w-14
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-1.5
                    text-[10px]
                    sm:text-[11px]
                    text-gray-600
                    outline-none
                    cursor-pointer
                    focus:border-violet-400
                    focus:ring-1
                    focus:ring-violet-200
                  "
                >
                  {rows.map((_, i) => (
                    <option
                      key={i + 1}
                      value={i + 1}
                    >
                      {i + 1}
                    </option>
                  ))}
                </select>
              </td>

              {/* =================================================
                  ACTION
                  ================================================= */}

              <td
                className="
                  px-3
                  py-2.5
                  align-middle
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    text-gray-400
                  "
                >
                  {/* Edit */}

                  <button
                    type="button"
                    className="
                      p-0
                      border-0
                      bg-transparent
                      text-gray-400
                      hover:text-violet-600
                      transition-colors
                      cursor-pointer
                    "
                    onClick={() =>
                      onEdit(component)
                    }
                    aria-label={`Edit ${component.ComponentName}`}
                  >
                    <Pencil size={14} />
                  </button>

                  {/* History */}

                  <button
                    type="button"
                    className="
                      p-0
                      border-0
                      bg-transparent
                      text-gray-400
                      hover:text-violet-600
                      transition-colors
                      cursor-pointer
                    "
                    onClick={() =>
                      onHistory(component)
                    }
                    aria-label={`History for ${component.ComponentName}`}
                  >
                    <History size={14} />
                  </button>

                  {/* Add */}

                  <button
                    type="button"
                    className="
                      p-0
                      border-0
                      bg-transparent
                      text-gray-400
                      hover:text-violet-600
                      transition-colors
                      cursor-pointer
                    "
                    onClick={() =>
                      onAdd(component)
                    }
                    aria-label={`Add rule for ${component.ComponentName}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}