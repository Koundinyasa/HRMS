import { NavLink, Outlet, useParams } from "react-router-dom";
import {
  CalendarDays,
  FileSpreadsheet,
  Grid2X2,
  History,
  List,
} from "lucide-react";

import { useState } from "react";

import { useDashboard } from "../../../../dashboard/hooks/useDashboard";
import type { MenuItem } from "../../../../dashboard/types/dashboard.types";

import { MonthPicker } from "@/components/ui/monthpicker";

export default function TimeOfficeNavbar() {
  const { domain } = useParams();

  const { menuData } = useDashboard();

  // ============================================================
  // STATE
  // ============================================================

  const [selectedMonth, setSelectedMonth] =
    useState("Aug/2026");

  const [selectedEmployee, setSelectedEmployee] =
    useState("294112");

  const [viewMode, setViewMode] =
    useState<"list" | "calendar">("list");

  // ============================================================
  // GET REVIEW MENU
  // ============================================================

  const reviewMenu = menuData?.data?.[0]?.children?.find(
    (item: MenuItem) =>
      item.menuName?.trim().toLowerCase() === "review",
  );

  // ============================================================
  // GET TIME OFFICE MENU
  // ============================================================

  const timeOfficeMenu = reviewMenu?.children?.find(
    (item: MenuItem) =>
      item.menuName?.trim().toLowerCase() === "time office",
  );

  // ============================================================
  // GET REGULARIZATION MENU
  // ============================================================

  const regularizationMenu =
    timeOfficeMenu?.children?.find(
      (item: MenuItem) =>
        item.menuName?.trim().toLowerCase() ===
        "regularization",
    );

  // ============================================================
  // GET DYNAMIC TABS
  // ============================================================

  const tabs = regularizationMenu?.children ?? [];

  // ============================================================
  // BUILD ROUTE
  // ============================================================

  const getRoute = (tab: MenuItem) => {
    const routeUrl = tab.routeUrl?.trim();

    if (!routeUrl) {
      return "#";
    }

    

    return routeUrl.replace(
      /^\/?Employee/i,
      `/${domain}/employee`,
    );
  };

  // ============================================================
  // ICON ACTIONS
  // ============================================================

  const handleListView = () => {
    setViewMode("list");

    window.dispatchEvent(
      new CustomEvent("timeOfficeViewChange", {
        detail: {
          view: "list",
        },
      }),
    );
  };

  const handleCalendarView = () => {
    setViewMode("calendar");

    window.dispatchEvent(
      new CustomEvent("timeOfficeViewChange", {
        detail: {
          view: "calendar",
        },
      }),
    );
  };

  const handleGridClick = () => {
    window.dispatchEvent(
      new CustomEvent("timeOfficeGridClick"),
    );
  };

  const handleExport = () => {
    window.dispatchEvent(
      new CustomEvent("timeOfficeExport"),
    );
  };

  const handleHistory = () => {
    window.dispatchEvent(
      new CustomEvent("timeOfficeHistory"),
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="w-full font-[Urbanist]">

      {/* ========================================================
          TIME OFFICE NAVBAR
      ========================================================= */}

      <div
        className="
          mx-6
          mt-5
          flex
          min-h-[60px]
          items-center
          justify-between
          gap-4
          rounded-xl
          border
          border-black
          bg-white
          px-4
          shadow-sm
         font-[Urbanist]"
      >

        {/* ======================================================
            LEFT - DYNAMIC API TABS
        ======================================================= */}

        <div
          className="
            flex
            h-full
            min-w-0
            items-center
            gap-7
            overflow-x-auto
           font-[Urbanist]"
        >
          {tabs.map((tab: MenuItem) => (
            <NavLink
              key={tab.menuId}
              to={getRoute(tab)}
              className={({ isActive }) => `
                relative
                flex
                h-[60px]
                shrink-0
                items-center
                whitespace-nowrap
                px-1
                text-sm
                font-medium
                transition-colors

                ${
                  isActive
                    ? "text-sky-600"
                    : "text-slate-600 hover:text-sky-600"
                }

                after:absolute
                after:bottom-0
                after:left-0
                after:h-[2px]
                after:w-full

                ${
                  isActive
                    ? "after:bg-sky-500"
                    : "after:bg-transparent"
                }
              `}
            >
              {tab.menuName}
            </NavLink>
          ))}
        </div>

        {/* ======================================================
            RIGHT SIDE CONTROLS
        ======================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
           font-[Urbanist]"
        >

          {/* ====================================================
              LIST VIEW
          ===================================================== */}

          <button
            type="button"
            title="List View"
            onClick={handleListView}
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              transition-colors

              ${
                viewMode === "list"
                  ? "border-sky-500 bg-sky-500 text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }
            `}
          >
            <List
              size={18}
              strokeWidth={2}
            />
          </button>

          {/* ====================================================
              CALENDAR VIEW
          ===================================================== */}

          <button
            type="button"
            title="Calendar View"
            onClick={handleCalendarView}
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              transition-colors

              ${
                viewMode === "calendar"
                  ? "border-sky-500 bg-sky-500 text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }
            `}
          >
            <CalendarDays
              size={17}
              strokeWidth={2}
            />
          </button>

          {/* ====================================================
              MONTH PICKER
          ===================================================== */}

          <div className="w-[120px] font-[Urbanist]">
            <MonthPicker
              value={selectedMonth}
              onChange={setSelectedMonth}
              className="
                h-9
                rounded-lg
                border-black
                bg-white
               font-[Urbanist]"
            />
          </div>

          {/* ====================================================
              EMPLOYEE DROPDOWN
          ===================================================== */}

          <div className="relative font-[Urbanist]">
            <select
              value={selectedEmployee}
              onChange={(event) =>
                setSelectedEmployee(event.target.value)
              }
              className="
                h-9
                w-[180px]
                appearance-none
                rounded-lg
                border
                border-black
                bg-white
                px-3
                pr-8
                text-sm
                font-medium
                text-slate-700
                outline-none
                focus:border-black
               font-[Urbanist]"
            >
              <option value="294112">
                294112 Bhagyaraj...
              </option>
            </select>

            <span
              className="
                pointer-events-none
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                text-slate-500
               font-[Urbanist]"
            >
              ▾
            </span>
          </div>

          {/* ====================================================
              GRID
          ===================================================== */}

          <button
            type="button"
            title="Grid View"
            onClick={handleGridClick}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-black
              bg-white
              text-slate-600
              transition-colors
              hover:bg-slate-50
             font-[Urbanist]"
          >
            <Grid2X2
              size={17}
              strokeWidth={2}
            />
          </button>

          {/* ====================================================
              EXCEL
          ===================================================== */}

          <button
            type="button"
            title="Export Excel"
            onClick={handleExport}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-black
              bg-emerald-50
              text-emerald-600
              transition-colors
              hover:bg-emerald-100
             font-[Urbanist]"
          >
            <FileSpreadsheet
              size={18}
              strokeWidth={2}
            />
          </button>

          {/* ====================================================
              HISTORY
          ===================================================== */}

          <button
            type="button"
            title="History"
            onClick={handleHistory}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-black
              bg-white
              text-slate-600
              transition-colors
              hover:bg-slate-50
             font-[Urbanist]"
          >
            <History
              size={17}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* ========================================================
          CHILD PAGE
      ========================================================= */}

      <div className="w-full pt-3 font-[Urbanist]">
        <Outlet />
      </div>
    </div>
  );
}
