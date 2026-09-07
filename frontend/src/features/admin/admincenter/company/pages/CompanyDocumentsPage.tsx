// import { Outlet, useParams } from "react-router-dom";
// import TabBar from "@/features/admin/components/TabBar";
// import { COMPANY_DOCUMENTS_TABS } from "../constants/company.constants";

// export default function CompanyDocumentsPage() {
//   const { domain } = useParams();
//   const basePath = `/${domain}/admin/admin-center/company/documents`;

//   return (
//     <div>
//       <TabBar basePath={basePath} tabs={COMPANY_DOCUMENTS_TABS} />
//       <Outlet />
//     </div>
//   );
// }


import {Outlet,NavLink,useParams} from "react-router-dom";
import {Search,Plus,Clock,FileText,UserRound,CreditCard} from "lucide-react";
import { useState } from "react";

const tabs = [
  {
    label: "Document",
    path: "document",
    icon: FileText,
  },
  {
    label: "Contact Details",
    path: "contact-details",
    icon: UserRound,
  },
  {
    label: "Subscription Details",
    path: "subscription-details",
    icon: CreditCard,
  },
];

export default function CompanyDocumentsPage() {
  const { domain } = useParams();

  const [search, setSearch] = useState("");

  const basePath =
    `/${domain}/admin/admin-center/company/documents`;

  return (
    <div
      className="
        w-full
        min-w-0
        max-w-full
        overflow-x-hidden
      "
    >
      {/* =========================================================
          TOP NAV
      ========================================================= */}

      <div
        className="
          flex
          w-full
          min-w-0
          max-w-full
          flex-col
          gap-2
          rounded-[12px]
          px-2
          py-2
          sm:px-2.5
        "
        style={{
          backgroundColor: "#F5F3FF",
          border: "1px solid #EDE9FE",
        }}
      >
        {/* ======================================================
            TABS
        ====================================================== */}

        <div
          className="
            flex
            min-w-0
            w-full
            items-center
            gap-1
            overflow-x-auto
            scrollbar-hide
          "
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.path}
                to={`${basePath}/${tab.path}`}
                end
                className="shrink-0"
              >
                {({ isActive }) => (
                  <div
                    className="
                      flex
                      h-8
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-[8px]
                      px-2.5
                      text-[12px]
                      font-medium
                      whitespace-nowrap
                      transition-all
                      sm:h-[30px]
                      sm:px-3
                      sm:text-[12.5px]
                    "
                    style={
                      isActive
                        ? {
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #7C3AED",
                            color: "#7C3AED",
                            fontWeight: 600,
                          }
                        : {
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #DDD6FE",
                            color: "#64748B",
                          }
                    }
                  >
                    <Icon
                      size={13}
                      strokeWidth={
                        isActive ? 2 : 1.7
                      }
                      color={
                        isActive
                          ? "#7C3AED"
                          : "#94A3B8"
                      }
                    />

                    <span>{tab.label}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* ======================================================
            SEARCH + ACTIONS
        ====================================================== */}

        <div
          className="
            flex
            w-full
            min-w-0
            items-center
            gap-1.5
          "
        >
          {/* SEARCH */}

          <div
            className="
              relative
              min-w-0
              flex-1
            "
          >
            <Search
              size={13}
              className="
                pointer-events-none
                absolute
                left-2.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search..."
              className="
                h-8
                w-full
                rounded-[8px]
                border
                border-[#DDD6FE]
                bg-white
                pl-8
                pr-2
                text-[12px]
                text-slate-600
                outline-none
                placeholder:text-slate-400
                focus:border-[#C4B5FD]
                sm:h-[30px]
                sm:pr-3
              "
            />
          </div>

          {/* ==================================================
              ADD DOCUMENT BUTTON
              No popup / no modal
          ================================================== */}

          <button
            type="button"
            className="
              flex
              h-8
              shrink-0
              items-center
              justify-center
              gap-1
              rounded-[8px]
              border
              border-[#7C3AED]
              bg-white
              px-2.5
              text-[12px]
              font-medium
              text-[#7C3AED]
              hover:bg-[#F5F3FF]
              sm:h-[30px]
              sm:px-3
              sm:text-[12.5px]
            "
          >
            <Plus
              size={13}
              strokeWidth={2}
            />

            <span className="hidden xs:inline">
              Add Document
            </span>

            <span className="xs:hidden">
              Add
            </span>
          </button>

          {/* ==================================================
              HISTORY
          ================================================== */}

          <button
            type="button"
            title="History"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-[8px]
              border
              border-[#DDD6FE]
              bg-white
              text-slate-500
              hover:bg-[#F5F3FF]
              sm:h-[30px]
              sm:w-[30px]
            "
          >
            <Clock
              size={15}
              strokeWidth={1.7}
            />
          </button>
        </div>
      </div>

      {/* =========================================================
          SECOND BAR
      ========================================================= */}

      <div
        className="
          mt-2
          flex
          h-8
          w-full
          items-center
          gap-1
          rounded-[8px]
          px-2
        "
        style={{
          backgroundColor: "#F3F4F6",
          border: "1px solid #E5E7EB",
        }}
      >
        {/* LIST VIEW */}

        <button
          type="button"
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded
            hover:bg-white
          "
          title="List view"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
          >
            <rect
              x="2"
              y="3.5"
              width="12"
              height="1.8"
              rx="0.4"
              fill="#22C55E"
            />

            <rect
              x="2"
              y="7.1"
              width="12"
              height="1.8"
              rx="0.4"
              fill="#22C55E"
            />

            <rect
              x="2"
              y="10.7"
              width="12"
              height="1.8"
              rx="0.4"
              fill="#22C55E"
            />
          </svg>
        </button>

        {/* CLEAR */}

        <button
          type="button"
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded
            text-[#EF4444]
            hover:bg-white
          "
          title="Clear"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div
        className="
          mt-3
          w-full
          min-w-0
          max-w-full
          overflow-x-hidden
        "
      >
        <Outlet />
      </div>
    </div>
  );
}