// import { NavLink, useParams } from "react-router-dom";

// import type { ProfileTabsProps } from "../types/profile.types";

// export default function ProfileTabs({
//   tabs,
// }: ProfileTabsProps) {
//   const { domain } = useParams();

//   return (
//     <div
//       className="w-full overflow-x-auto border-b scrollbar-thin"
//       style={{
//         borderColor: "var(--primary-border)",
//       }}
//     >
//       <div className="flex w-max">
//       {tabs.map((tab) => {
//         let route = "";

//         switch (tab.menuName) {
//           case "Personal Information":
//             route = `/${domain}/employee/profile/personal`;
//             break;

//           case "Family Details":
//             route = `/${domain}/employee/profile/family`;
//             break;

//           case "Education Details":
//             route = `/${domain}/employee/profile/education`;
//             break;

//           case "Experience Details":
//             route = `/${domain}/employee/profile/experience`;
//             break;

//           case "Bank Information":
//             route = `/${domain}/employee/profile/bank`;
//             break;

//           case "Uploaded Documents":
//             route = `/${domain}/employee/profile/documents`;
//             break;

//           default:
//             route =
//               tab.routeUrl?.replace(
//                 "/Employee",
//                 `/${domain}/employee`
//               ) ?? "";
//         }

//         return (
//           <NavLink
//             key={tab.menuId}
//             to={route}
//             className={({ isActive }) =>
//               `
//                 shrink-0
//                   px-4
//                   py-3
//                   text-sm
//                   font-medium
//                   whitespace-nowrap
//                   border-b-2
//                   transition-all
//                 ${
//                   isActive
//                     ? ""
//                     : "border-transparent text-slate-500 hover:text-slate-700"
//                 }
//               `
//             }
//             style={({ isActive }) =>
//               isActive
//                 ? {
//                     color: "var(--primary-color)",
//                     borderColor: "var(--primary-color)",
//                   }
//                 : {}
//             }
//           >
//             {tab.menuName}
//           </NavLink>
//         );
//       })}
//       </div>
//     </div>
//   );
// }


import { NavLink, useParams } from "react-router-dom";

import { useDashboard } from "../../dashboard/hooks/useDashboard";

import type { MenuItem } from "../../dashboard/types/dashboard.types";

import {
  User,
  Users,
  GraduationCap,
  Briefcase,
  Landmark,
  Upload,
} from "lucide-react";

const TAB_ICONS: Record<
  string,
  React.ReactNode
> = {
  "Personal Information": <User size={17} strokeWidth={2} />,
  "Family Details": <Users size={17} strokeWidth={2} />,
  "Education Details": <GraduationCap size={17} strokeWidth={2} />,
  "Experience Details": <Briefcase size={17} strokeWidth={2} />,
  "Bank Information": <Landmark size={17} strokeWidth={2} />,
  "Uploaded Documents": <Upload size={17} strokeWidth={2} />,
};

export default function ProfileTabs() {
  const { domain } = useParams();

  const { menuData } = useDashboard();

  // Get "My Profile" dynamically from backend
  const profileMenu =
    menuData?.data?.[0]?.children?.find(
      (item: MenuItem) =>
        item.menuName === "My Profile"
    );

  // Get profile submenus dynamically
  const tabs = profileMenu?.children ?? [];

  return (
    <div
      className="
        w-full
        overflow-x-auto
        rounded-2xl                                                     1
        border-2
        border-[#2563EB]
        bg-[#EAF5FE]
        p-2
        scrollbar-thin
      "
      // style={{
      //   borderColor: "var(--primary-border)",
      // }}

      
    >
      <div className="flex w-max items-center min-w-full gap-2">
        {tabs.map((tab: MenuItem) => {

          let route =
            tab.routeUrl?.replace(
              "/Employee",
              `/${domain}/employee`
            ) ?? "";

          // Fix profile document route
          if (tab.menuName === "Uploaded Documents") {
            route = `/${domain}/employee/profile/documents`;
          }

          return (
            <NavLink
              key={tab.menuId}
              to={route}
              className={({ isActive }) =>
                `
                  inline-flex
                  h-11
                  shrink-0
                  items-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-5
                  text-sm
                  font-medium
                  whitespace-nowrap
                  transition-colors
                  duration-200
                  ${isActive
                  ? `
                          border-2
                        border-[#2563EB]
                        bg-white
                        font-semibold
                        !text-[#2563EB]
                        shadow-sm
                        `
                  : `
                          border
                        border-[#CBD5E1]
                        !text-black
                        `
                }
                `
              }
            // style={({ isActive }) =>
            //   isActive
            //     ? {
            //         color: "var(--primary-color)",
            //         borderColor: "var(--primary-color)",
            //       }
            //     : {}
            // }


            >

              {({ isActive }) => (
                <>
                  <span
                    className={
                      isActive
                        ? "shrink-0 !text-[#2563EB]"
                        : "shrink-0 !text-black"
                    }
                  >
                    {TAB_ICONS[tab.menuName] ?? null}
                  </span>
                  {tab.menuName}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}