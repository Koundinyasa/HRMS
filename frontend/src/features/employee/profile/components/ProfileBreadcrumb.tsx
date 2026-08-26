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

      <span>Employee</span>

      <ChevronRight size={16} />

      <span>My Profile</span>

      <ChevronRight size={16} />

      <span className="font-medium capitalize text-slate-700">
        {current}
      </span>

    </div>
  );
}