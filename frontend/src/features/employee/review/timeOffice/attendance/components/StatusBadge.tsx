// import { getStatusConfig } from "../constants/leaveCalendar.constants";
// import { useStatusConfigMap } from "./LeaveStatusConfigContext";
// import type {
//   StatusBadgeProps,
// } from "../types/leavecalendar.types";
// const StatusBadge = ({
//   status,
// }: StatusBadgeProps) => {
//   const configMap = useStatusConfigMap();
//   const { code, label, className } = getStatusConfig(status, configMap);
//   const isBlank = code === "-";
//   return (
//     <span
//       title={label}
//       className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-center font-semibold ${code.length > 2 ? "text-[8px]" : "text-[11px]"} ${className}`}
//     >
//       {isBlank ? "-" : code}
//     </span>
//   );
// };
// export default StatusBadge;



import { getStatusConfig } from "../constants/leaveCalendar.constants";
import { useStatusConfigMap } from "./LeaveStatusConfigContext";
import type { StatusBadgeProps } from "../types/leavecalendar.types";

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const configMap = useStatusConfigMap();

  const {
    code,
    label,
    className,
  } = getStatusConfig(status, configMap);

  const isBlank = code === "-";

  return (
    <span
      title={label}
      className={`
        pointer-events-none
        inline-flex
        h-7
        w-7
        shrink-0
        cursor-pointer
        items-center
        justify-center
        rounded-full
        text-center
        font-semibold
        ${
          code.length > 2
            ? "text-[8px]"
            : "text-[11px]"
        }
        ${className}
      `}
    >
      {isBlank ? "-" : code}
    </span>
  );
};

export default StatusBadge;