import { Menu, UsersRound, } from "lucide-react";
import { useNavigate, useParams, } from "react-router-dom";
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
    <div className="flex items-center gap-4">
      {/* HRMS Icon */}

      <div
        onClick={() =>
          navigate(`/${domain}/employee/dashboard`)
        }
        className="
    w-12
    h-12
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
          size={26}
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
        className="hover:bg-white/10"
      >
        <Menu
          size={22}
          color="white"
        />
      </Button>

      {/* Company Name */}

      <h1
        className="
          text-base
          lg:text-lg
          font-semibold
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