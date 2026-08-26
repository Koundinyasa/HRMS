import { Menu, UsersRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
 
import { useDashboard } from "../dashboard/hooks/useDashboard";
import type { HeaderProps } from "../dashboard/types/dashboard.types";
 
export default function Header({
  isSidebarOpen,
  setIsSidebarOpen,
}: HeaderProps) {
  const { profileData, isLoading } = useDashboard();
  const navigate = useNavigate();
  const { domain } = useParams();
 
  return (
    <div className="flex items-center min-w-0 gap-1 sm:gap-2 lg:gap-4">
 
      {/* HRMS Icon */}
      <div
        onClick={() => {
          navigate(`/${domain}/employee/dashboard`);
          setIsSidebarOpen(false);
        }}
        className="
          w-10
          h-10
          sm:w-11
          sm:h-11
          lg:w-12
          lg:h-12
          shrink-0
          rounded-md
          flex
          items-center
          justify-center
          cursor-pointer
        "
        style={{
          background: "var(--primary-gradient)",
        }}
      >
        <UsersRound
          size={22}
          className="sm:hidden"
          color="white"
        />
 
        <UsersRound
          size={26}
          className="hidden sm:block"
          color="white"
        />
      </div>
 
      {/* Menu */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() =>
          setIsSidebarOpen(!isSidebarOpen)
        }
        className="
          shrink-0
          w-9
          h-9
          sm:w-10
          sm:h-10
          hover:bg-white/10
        "
      >
        <Menu
          size={22}
          color="white"
        />
      </Button>
 
      {/* Company Name */}
      <h1
        className="
          min-w-0
          max-w-[110px]
          sm:max-w-[180px]
          lg:max-w-none
          text-xs
          sm:text-sm
          lg:text-lg
          font-semibold
          leading-tight
          whitespace-normal
          break-words
        "
        style={{
          color: "white",
        }}
      >
        {isLoading
          ? "Loading..."
          : profileData?.data?.profile?.CompanyName}
      </h1>
    </div>
  );
}