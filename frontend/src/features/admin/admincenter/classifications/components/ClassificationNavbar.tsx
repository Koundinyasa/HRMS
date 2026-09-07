// import { NavLink, useParams } from "react-router-dom";
// import type { ReactNode } from "react";
// import { Info, History } from "lucide-react";

// export default function ClassificationNavbar({ rightSlot }: { rightSlot?: ReactNode }) {
//   const { domain } = useParams();
//   const base = `/${domain}/admin/admin-center/classifications`;

//   const navItems = [
//     { name: "Classification Summary", path: base },
//     { name: "Branch", path: `${base}/branch` },
//     { name: "Leave Policy", path: `${base}/leave-policy/employee` },
//     { name: "Additional Classification", path: `${base}/additional` },
//     { name: "Designation", path: `${base}/designation` },
//     { name: "Banks", path: `${base}/banks` },
//     { name: "Attendance", path: `${base}/attendance` },
//     { name: "Import", path: `${base}/import` },
//   ];

//   return (
//     <div className="w-full flex flex-col gap-2 border-b border-gray-200 px-2 sm:px-3 py-2">
//       {/* Nav pills: horizontal scroll on any narrow screen instead of wrapping
//           each tab onto its own line. */}
//       <div
//         className="
//           flex items-center gap-1
//           overflow-x-auto overscroll-x-contain
//           [scrollbar-width:none] [-ms-overflow-style:none]
//           [&::-webkit-scrollbar]:hidden
//         "
//       >
//         {navItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             end={item.path === base}
//             className={({ isActive }) =>
//               `shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 isActive
//                   ? "bg-violet-600 text-white shadow-sm"
//                   : "text-gray-600 hover:text-violet-600 hover:bg-violet-50"
//               }`
//             }
//           >
//             {item.name}
//           </NavLink>
//         ))}
//       </div>

//       {/* Right slot (search / add / history, etc.) — its own row, wraps
//           internally without disturbing the nav pills above. */}
//       {rightSlot ? (
//         <div className="flex items-center flex-wrap gap-2 sm:gap-3 pb-1 sm:pb-0 sm:justify-end">
//           {rightSlot}
//         </div>
//       ) : (
//         <div className="flex items-center gap-4 pb-1 sm:pb-0 sm:justify-end text-gray-400">
//           <button type="button" aria-label="Info" className="hover:text-gray-600">
//             <Info size={18} />
//           </button>
//           <button type="button" aria-label="History" className="hover:text-gray-600">
//             <History size={18} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

import { NavLink, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import {
  Info,
  History,
  ClipboardList,
  BriefcaseBusiness,
  Tag,
  Building2,
  Landmark,
  Upload,
} from "lucide-react";

export default function ClassificationNavbar({
  rightSlot,
}: {
  rightSlot?: ReactNode;
}) {
  const { domain } = useParams();

  const base = `/${domain}/admin/admin-center/classifications`;

  const navItems = [
    {
      name: "Classification Summary",
      path: base,
      icon: ClipboardList,
    },
    {
      name: "Branch",
      path: `${base}/branch`,
      icon: BriefcaseBusiness,
    },
    {
      name: "Additional Classification",
      path: `${base}/additional`,
      icon: Tag,
    },
    {
      name: "Designation",
      path: `${base}/designation`,
      icon: Building2,
    },
    {
      name: "Banks",
      path: `${base}/banks`,
      icon: Landmark,
    },
    {
      name: "Attendance",
      path: `${base}/attendance`,
      icon: History,
    },
    {
      name: "Import",
      path: `${base}/import`,
      icon: Upload,
    },
  ];

  return (
    <div
      className="
        w-full
        max-w-full
        min-w-0
        px-2
        sm:px-3
        md:px-4
        lg:px-5
        xl:px-6
        py-2
        box-border
      "
    >
      {/* =====================================================
          CLASSIFICATION NAVBAR
          ===================================================== */}

      <div
        className="
          w-full
          max-w-full
          min-w-0
          rounded-xl
          border
          border-violet-200
          bg-white
          shadow-sm
          box-border
          overflow-hidden
        "
      >
        {/* =================================================
            TOP / NAVIGATION ROW
            ================================================= */}

        <div
          className="
            w-full
            min-w-0
            flex
            items-center
            px-2
            sm:px-3
            md:px-3
            py-2
            box-border
          "
        >
          {/* =================================================
              NAVIGATION ITEMS

              On mobile:
              - full width
              - horizontal scrolling
              - never hidden

              On desktop:
              - takes available space
              - controls stay beside it
              ================================================= */}

          <div
            className="
              flex
              flex-nowrap
              items-center
              gap-1.5
              sm:gap-2
              w-full
              min-w-0
              overflow-x-auto
              overflow-y-hidden
              whitespace-nowrap
              overscroll-x-contain
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === base}
                  className={({ isActive }) =>
                    `
                      shrink-0
                      h-9
                      min-h-9
                      px-3
                      sm:px-3.5
                      md:px-3
                      lg:px-3.5
                      rounded-lg
                      border
                      flex
                      flex-nowrap
                      items-center
                      justify-center
                      gap-1.5
                      whitespace-nowrap
                      text-[11px]
                      sm:text-xs
                      md:text-sm
                      font-medium
                      leading-none
                      transition-all
                      duration-150
                      box-border
                      ${
                        isActive
                          ? `
                            border-violet-300
                            bg-violet-50
                            text-violet-600
                            shadow-sm
                          `
                          : `
                            border-gray-200
                            bg-white
                            text-gray-600
                            shadow-sm
                            hover:border-violet-200
                            hover:text-violet-600
                            hover:bg-violet-50
                          `
                      }
                    `
                  }
                >
                  <Icon size={14} className="shrink-0" strokeWidth={1.8} />

                  <span className="whitespace-nowrap">{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* =================================================
              DESKTOP RIGHT SLOT

              Hidden on mobile because mobile gets a
              dedicated controls row below.
              ================================================= */}

          {rightSlot && (
            <div
              className="
                hidden
                md:flex
                shrink-0
                items-center
                gap-2
                ml-3
                pl-3
                border-l
                border-gray-100
                min-w-fit
                whitespace-nowrap
              "
            >
              {rightSlot}
            </div>
          )}

          {/* =================================================
              DEFAULT DESKTOP ICONS
              ================================================= */}

          {!rightSlot && (
            <div
              className="
                hidden
                md:flex
                shrink-0
                items-center
                gap-1
                md:gap-2
                ml-3
                pl-3
                text-gray-500
                border-l
                border-gray-100
              "
            >
              <button
                type="button"
                aria-label="Info"
                className="
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                  hover:text-gray-700
                  active:bg-gray-100
                  transition-colors
                  shrink-0
                "
              >
                <Info size={15} strokeWidth={2} />
              </button>

              <button
                type="button"
                aria-label="History"
                className="
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                  hover:text-gray-700
                  active:bg-gray-100
                  transition-colors
                  shrink-0
                "
              >
                <History size={15} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        {/* =====================================================
            MOBILE CONTROLS ROW

            Search + Add New + History

            This prevents the navigation from being squeezed
            or hidden on mobile.
            ===================================================== */}

        {rightSlot && (
          <div
            className="
              md:hidden
              w-full
              border-t
              border-gray-100
              px-2
              sm:px-3
              py-2
              bg-white
              box-border
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                w-full
                min-w-0
              "
            >
              {rightSlot}
            </div>
          </div>
        )}

        {/* =====================================================
            MOBILE DEFAULT ICONS
            ===================================================== */}

        {!rightSlot && (
          <div
            className="
              md:hidden
              flex
              items-center
              justify-end
              gap-1
              border-t
              border-gray-100
              px-2
              py-1.5
            "
          >
            <button
              type="button"
              aria-label="Info"
              className="
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center
                hover:bg-gray-100
                hover:text-gray-700
                transition-colors
              "
            >
              <Info size={15} strokeWidth={2} />
            </button>

            <button
              type="button"
              aria-label="History"
              className="
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center
                hover:bg-gray-100
                hover:text-gray-700
                transition-colors
              "
            >
              <History size={15} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
