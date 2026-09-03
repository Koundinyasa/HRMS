 import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function ProfileBreadcrumb() {
  const location = useLocation();

  const current =
    location.pathname
      .split("/")
      .pop()
      ?.replace("-", " ") ?? "";

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-3 sm:gap-2 sm:text-sm sm:mb-4">

      <span className="shrink-0">Employee</span>

      <ChevronRight size={14} className="shrink-0 sm:size-4" />

      <span className="shrink-0">My Profile</span>

      <ChevronRight size={14} className="shrink-0 sm:size-4" />

      <span className="min-w-0 font-medium capitalize text-slate-700 truncate">
        {current}
      </span>

    </div>
  );
}


