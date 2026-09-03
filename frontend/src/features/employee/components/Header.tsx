
// import { Menu, UsersRound } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";

// import { useDashboard } from "../dashboard/hooks/useDashboard";
// import type { HeaderProps } from "../dashboard/types/dashboard.types";

// export default function Header({
//   isSidebarOpen,
//   setIsSidebarOpen,
// }: HeaderProps) {
//   const { profileData, isLoading } = useDashboard();
//   const navigate = useNavigate();
//   const { domain } = useParams();

//   return (
//     <div className="flex items-center min-w-0 gap-1 sm:gap-2 lg:gap-4">

//       {/* HRMS Icon */}
//       <div
//         onClick={() => {
//           navigate(`/${domain}/employee/dashboard`);
//           setIsSidebarOpen(false);
//         }}
//         className="
//           flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center
//           rounded-md sm:h-11 sm:w-11 lg:h-12 lg:w-12
//         "
//         style={{
//           background: "var(--primary-gradient)",
//         }}
//       >
//         <UsersRound
//           size={22}
//           className="sm:hidden"
//           color="white"
//         />

//         <UsersRound
//           size={26}
//           className="hidden sm:block"
//           color="white"
//         />
//       </div>

      

//       {/* Menu */}
//       <Button
//         type="button"
//         variant="ghost"
//         size="icon"
//         onClick={() =>
//           setIsSidebarOpen(!isSidebarOpen)
//         }
//         className="h-9 w-9 shrink-0 hover:bg-[#B8E0F5]/60 sm:h-10 sm:w-10"
//       >
//         <Menu
//           size={22}
//           color="#1E3A5F"
//         />
//       </Button>

//       {/* Company Name */}
//       <h1
//        className="
//           min-w-0 max-w-[110px] break-words text-xs font-semibold leading-tight
//           whitespace-normal text-[#1E3A5F]
//           sm:max-w-[180px] sm:text-sm
//           lg:max-w-none lg:text-lg
//         "
        
//       >
//         {isLoading
//           ? "Loading..."
//           : profileData?.data?.profile?.CompanyName}
//       </h1>
//     </div>
//   );
// }











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
    <div className="flex min-w-0 items-center gap-1 sm:gap-2 lg:gap-3">
 
      {/* =====================================================
          HRMS ICON + TEXT
      ===================================================== */}
      <div className="flex shrink-0 flex-col items-center justify-center pt-3">
 
        {/* HRMS Icon */}
        <div
          onClick={() => {
            navigate(`/${domain}/employee/dashboard`);
            setIsSidebarOpen(false);
          }}
          className="
            flex
            h-8
            w-8
            cursor-pointer
            items-center
            justify-center
            rounded-md
            sm:h-9
            sm:w-9
            lg:h-10
            lg:w-10
          "
          // style={{
          //   background: "var(--primary-gradient)",
          // }}

          style={{
    backgroundColor: "#2563EB",
  }}
        >
          <UsersRound
            size={16}
            strokeWidth={2}
            className="sm:hidden"
            color="white"
          />
 
          <UsersRound
            size={18}
            strokeWidth={2}
            className="hidden sm:block"
            color="white"
          />
        </div>
 
        {/* HRMS Text */}
        <span
          className="
            mt-0.5
            mb-3
            whitespace-nowrap
            text-[8px]
            font-semibold
            leading-none
            text-[#1E3A5F]
            sm:text-[9px]
            lg:text-[10px]
          "
        >
          HRMS
        </span>
      </div>
 
      {/* =====================================================
          MENU
      ===================================================== */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() =>
          setIsSidebarOpen(!isSidebarOpen)
        }
        className="
         h-9
          w-9
          shrink-0
          rounded-md
          hover:bg-[#B8E0F5]/60
          sm:h-10
          sm:w-10
        "
      >
        <Menu
          size={22}
          strokeWidth={2.2}
          color="#2563EB"
        />
      </Button>
 
      {/* =====================================================
          COMPANY NAME
      ===================================================== */}
      <h1
        className="
          min-w-0
          max-w-[150px]
          truncate
          text-xs
          font-semibold
          leading-tight
          text-[#1E3A5F]
          sm:max-w-[260px]
          sm:text-sm
          md:max-w-[420px]
          lg:max-w-none
          lg:text-lg
        "
      >
        {isLoading
          ? "Loading..."
          : profileData?.data?.profile?.CompanyName}
      </h1>
    </div>
  );
}