import { useState } from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  MoreVertical,
  Search,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function SalaryReportPage() {
  const navigate = useNavigate();

  const [pfGroupOpen, setPfGroupOpen] = useState(false);
  const [selectedPFGroup, setSelectedPFGroup] = useState("");

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f7fb] p-2">

      {/* =====================================================
          TOP SALARY HEADER
      ===================================================== */}

      <div
        className="
          rounded-xl
          border
          border-[#dedede]
          bg-white
          px-3
          py-3
          shadow-[0_1px_5px_rgba(0,0,0,0.08)]
        "
      >
        <div className="flex flex-wrap items-center gap-3">

          {/* SALARY */}

          <button
            type="button"
            className="
              flex
              h-10
              items-center
              gap-2
              rounded-lg
              border
              border-[#a56855]
              bg-white
              px-5
              text-sm
              font-medium
              text-[#8d5545]
            "
          >
            <span className="text-base">$</span>

            <span>
              Salary
            </span>
          </button>


          {/* RIGHT CONTROLS */}

          <div
            className="
              ml-auto
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            {/* DATE */}

            <button
              type="button"
              className="
                flex
                h-9
                items-center
                gap-2
                rounded-md
                border
                border-[#e1e5eb]
                bg-white
                px-3
                text-xs
                text-[#4d5561]
              "
            >
              <span>
                02-09-2026
              </span>

              <CalendarDays size={14} />
            </button>


            {/* PF GROUP */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setPfGroupOpen(
                    (previous) => !previous,
                  )
                }
                className={`
                  flex
                  h-9
                  min-w-[115px]
                  items-center
                  justify-between
                  rounded-md
                  border
                  bg-white
                  px-3
                  text-xs
                  text-[#4d5561]
                  ${
                    pfGroupOpen
                      ? "border-[#a56855]"
                      : "border-[#e1e5eb]"
                  }
                `}
              >
                <span>
                  {selectedPFGroup || "Select PF Group"}
                </span>

                <ChevronDown size={14} />
              </button>


              {pfGroupOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-11
                    z-50
                    w-[190px]
                    rounded-lg
                    border
                    border-[#ddd]
                    bg-white
                    p-3
                    shadow-lg
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPFGroup(
                        selectedPFGroup === "Default PF"
                          ? ""
                          : "Default PF",
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-md
                      px-2
                      py-2
                      text-left
                      text-sm
                      text-[#444]
                      hover:bg-[#fff5f1]
                    "
                  >

                    <span
                      className={`
                        flex
                        h-4
                        w-4
                        items-center
                        justify-center
                        rounded-sm
                        border
                        ${
                          selectedPFGroup === "Default PF"
                            ? "border-[#8d5545] bg-[#8d5545]"
                            : "border-[#999] bg-white"
                        }
                      `}
                    >
                      {selectedPFGroup === "Default PF" && (
                        <span className="text-[10px] text-white">
                          ✓
                        </span>
                      )}
                    </span>

                    Default PF

                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPFGroup("");
                      setPfGroupOpen(false);
                    }}
                    className="
                      mt-2
                      flex
                      h-9
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-md
                      border
                      border-[#d4d4d4]
                      text-sm
                      text-[#777]
                    "
                  >
                    <span>
                      ≡
                    </span>

                    Clear
                  </button>

                </div>
              )}

            </div>


            {/* ADVANCE FILTER */}

            <button
              type="button"
              className="
                flex
                h-9
                items-center
                gap-2
                rounded-md
                border
                border-[#a56855]
                bg-[#fff7f4]
                px-3
                text-xs
                font-medium
                text-[#8d5545]
              "
            >
              Advance Filter

              <Filter size={14} />
            </button>


            {/* BACK */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                flex
                h-9
                items-center
                gap-2
                rounded-md
                bg-[#8d5545]
                px-4
                text-xs
                font-medium
                text-white
              "
            >
              <ChevronLeft size={15} />

              Back
            </button>

          </div>

        </div>
      </div>


      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div
        className="
          mt-3
          overflow-x-auto
          rounded-xl
          border
          border-[#dedede]
          bg-white
          shadow-[0_1px_5px_rgba(0,0,0,0.06)]
        "
      >

        <div
          className="
            flex
            min-w-[1000px]
            items-center
            gap-3
            px-3
            py-3
          "
        >

          {/* SEARCH */}

          <div
            className="
              flex
              h-8
              w-[185px]
              shrink-0
              items-center
              gap-2
              rounded-md
              border
              border-[#d4d8de]
              px-3
              text-xs
              text-[#a2a8b2]
            "
          >
            <Search size={14} />

            <span>
              Search...
            </span>
          </div>


          {/* ADD FILTER */}

          <button
            type="button"
            className="
              flex
              h-8
              shrink-0
              items-center
              gap-2
              rounded-md
              bg-[#8d5545]
              px-3
              text-xs
              font-medium
              text-white
            "
          >
            <span>
              +
            </span>

            Add Filter
          </button>


          {/* QUERY */}

          <button
            type="button"
            className="
              flex
              h-8
              shrink-0
              items-center
              gap-2
              rounded-md
              border
              border-[#e0e4ea]
              bg-white
              px-3
              text-xs
              text-[#444]
            "
          >
            Query
            <ChevronDown size={12} />
          </button>


          {/* BRANCH */}

          <button
            type="button"
            className="
              flex
              h-8
              shrink-0
              items-center
              gap-2
              rounded-md
              border
              border-[#e0e4ea]
              bg-white
              px-3
              text-xs
              text-[#444]
            "
          >
            Branch
            <ChevronDown size={12} />
          </button>


          {/* SALARY STRUCTURE */}

          <button
            type="button"
            className="
              flex
              h-8
              shrink-0
              items-center
              gap-2
              rounded-md
              border
              border-[#e0e4ea]
              bg-white
              px-3
              text-xs
              text-[#444]
            "
          >
            Salary Structure
            <ChevronDown size={12} />
          </button>


          {/* LEAVE */}

          <button
            type="button"
            className="
              flex
              h-8
              shrink-0
              items-center
              gap-2
              rounded-md
              border
              border-[#e0e4ea]
              bg-white
              px-3
              text-xs
              text-[#444]
            "
          >
            Leave
            <ChevronDown size={12} />
          </button>


          {/* ATTENDANCE */}

          <button
            type="button"
            className="
              flex
              h-8
              shrink-0
              items-center
              gap-2
              rounded-md
              border
              border-[#e0e4ea]
              bg-white
              px-3
              text-xs
              text-[#444]
            "
          >
            Attendance
            <ChevronDown size={12} />
          </button>


          {/* DESIGNATION */}

          <button
            type="button"
            className="
              flex
              h-8
              shrink-0
              items-center
              gap-2
              rounded-md
              border
              border-[#e0e4ea]
              bg-white
              px-3
              text-xs
              text-[#444]
            "
          >
            Designation
            <ChevronDown size={12} />
          </button>


          {/* EMP STATUS */}

          <button
            type="button"
            className="
              flex
              h-8
              shrink-0
              items-center
              gap-2
              rounded-md
              border
              border-[#e0e4ea]
              bg-white
              px-3
              text-xs
              text-[#444]
            "
          >
            Emp Status
            <ChevronDown size={12} />
          </button>


          {/* CLEAR */}

          <button
            type="button"
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-1
              text-xs
              text-[#8992a0]
            "
          >
            <X size={12} />

            Clear
          </button>

        </div>

      </div>


      {/* =====================================================
          SUMMARY + E RETURN
      ===================================================== */}

      <div
        className="
          mt-4
          grid
          grid-cols-1
          gap-4
          lg:grid-cols-[minmax(0,1fr)_280px]
        "
      >

        {/* SUMMARY */}

        <div>

          <div
            className="
              flex
              h-9
              items-center
              gap-3
              rounded-lg
              border
              border-[#d8d8d8]
              bg-white
              px-3
            "
          >

            <div
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded
                border
                border-[#b77b68]
                text-[#8d5545]
              "
            >
              <FileText size={14} />
            </div>

            <span className="text-sm font-medium text-[#444]">
              Summary
            </span>

          </div>


          <div
            className="
              mt-2
              grid
              grid-cols-1
              gap-2
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            {/* EMPLOYEE PF EARNING */}

            <div
              className="
                rounded-lg
                border
                border-[#d8d8d8]
                bg-white
                px-2
                py-2
              "
            >
              <div className="text-[10px] text-[#777]">
                Employee PF Earning
              </div>

              <div className="mt-1 text-xs font-medium text-[#333]">
                1,116,039.00
              </div>
            </div>


            {/* EMPLOYEE EPF CONTRIBUTION */}

            <div
              className="
                rounded-lg
                border
                border-[#d8d8d8]
                bg-white
                px-2
                py-2
              "
            >
              <div className="text-[10px] text-[#777]">
                Employee EPF Contribution
              </div>

              <div className="mt-1 text-xs font-medium text-[#333]">
                133,924.00
              </div>
            </div>


            {/* EMPLOYER PF CONTRIBUTION */}

            <div
              className="
                rounded-lg
                border
                border-[#d8d8d8]
                bg-white
                px-2
                py-2
              "
            >
              <div className="text-[10px] text-[#777]">
                Employer PF Contribution
              </div>

              <div className="mt-1 text-xs font-medium text-[#333]">
                1,002,000.00
              </div>
            </div>


            {/* EDLI WAGES */}

            <div
              className="
                rounded-lg
                border
                border-[#d8d8d8]
                bg-white
                px-2
                py-2
              "
            >
              <div className="text-[10px] text-[#777]">
                EDLI Wages
              </div>

              <div className="mt-1 text-xs font-medium text-[#333]">
                1,002,000.00
              </div>
            </div>


            {/* EMPLOYEE PF VOL CONTRIBUTION */}

            <div
              className="
                rounded-lg
                border
                border-[#d8d8d8]
                bg-white
                px-2
                py-2
              "
            >
              <div className="text-[10px] text-[#777]">
                Employee PF Vol. Contribution
              </div>

              <div className="mt-1 text-xs font-medium text-[#333]">
                0.00
              </div>
            </div>


            {/* PENSION WAGES */}

            <div
              className="
                rounded-lg
                border
                border-[#d8d8d8]
                bg-white
                px-2
                py-2
              "
            >
              <div className="text-[10px] text-[#777]">
                Pension Wages
              </div>

              <div className="mt-1 text-xs font-medium text-[#333]">
                1,002,000.00
              </div>
            </div>

          </div>

        </div>


        {/* =====================================================
            E RETURN
        ===================================================== */}

        <div
          className="
            h-fit
            overflow-hidden
            rounded-lg
            border
            border-[#d8d8d8]
            bg-white
            shadow-[0_2px_8px_rgba(0,0,0,0.08)]
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              bg-[#fff3ef]
              px-3
              py-2
            "
          >

            <span className="text-sm font-medium text-[#555]">
              e Return
            </span>

            <button
              type="button"
              className="
                rounded-md
                bg-[#8d5545]
                px-3
                py-1
                text-[10px]
                font-medium
                text-white
              "
            >
              Generate
            </button>

          </div>


          <div className="min-h-[68px] bg-white" />


          <div
            className="
              flex
              justify-end
              border-t
              border-[#edf0f3]
              bg-[#f8fafc]
              px-3
              py-2
            "
          >

            <button
              type="button"
              className="
                rounded-md
                bg-[#8d5545]
                px-3
                py-1
                text-[10px]
                font-medium
                text-white
              "
            >
              Save
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          SALARY TABLE
      ===================================================== */}

      <div
        className="
          mt-5
          w-full
          overflow-x-auto
          rounded-lg
          border
          border-[#d8d8d8]
          bg-white
          shadow-[0_2px_8px_rgba(0,0,0,0.08)]
        "
      >

        <table className="w-full min-w-[1150px] border-collapse">

          {/* HEADER */}

          <thead>

            <tr className="bg-[#fff3ef]">

              <th className="px-3 py-3 text-left text-[10px] font-semibold text-[#555]">
                Sl.No
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-semibold text-[#555]">
                UAN
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-semibold text-[#555]">
                Employee Name
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-semibold text-[#555]">
                Gross Wages
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-semibold text-[#555]">
                EPF Wages
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-semibold text-[#555]">
                EPS Wages
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-semibold text-[#555]">
                EDLI Wages
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-semibold text-[#555]">
                EPF Cont.
                <br />
                Remitted
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-semibold text-[#555]">
                EPS Cont.
                <br />
                Remitted
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-semibold text-[#555]">
                EPF & EPS
                <br />
                Diff Remitted
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-semibold text-[#555]">
                NCP Days
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-semibold text-[#555]">
                Refund of
                <br />
                Advances
              </th>

            </tr>

          </thead>


          {/* BODY */}

          <tbody>

            <tr className="border-t border-[#e7e7e7]">

              <td className="px-3 py-2 text-xs text-[#555]">
                30
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                102338421984
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                Veera Reddy Chintapalli
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                35862.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs font-semibold text-[#269d71]">
                1512.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                1050.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                462.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                0
              </td>

              <td className="px-3 py-2 text-right">
                <input
                  value="0.00"
                  readOnly
                  className="
                    w-[75px]
                    rounded-md
                    border
                    border-[#e1e5eb]
                    px-2
                    py-1
                    text-right
                    text-xs
                    text-[#aaa]
                    outline-none
                  "
                />
              </td>

            </tr>


            <tr className="border-t border-[#e7e7e7]">

              <td className="px-3 py-2 text-xs text-[#555]">
                31
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                102338415642
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                Nagaraju Thota
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                35862.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs font-semibold text-[#269d71]">
                1512.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                1050.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                462.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                0
              </td>

              <td className="px-3 py-2 text-right">
                <input
                  value="0.00"
                  readOnly
                  className="
                    w-[75px]
                    rounded-md
                    border
                    border-[#e1e5eb]
                    px-2
                    py-1
                    text-right
                    text-xs
                    text-[#aaa]
                    outline-none
                  "
                />
              </td>

            </tr>


            <tr className="border-t border-[#e7e7e7]">

              <td className="px-3 py-2 text-xs text-[#555]">
                32
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                101844911852
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                Sampath Tangutoori
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                35862.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs font-semibold text-[#269d71]">
                1512.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                1050.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                462.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                0
              </td>

              <td className="px-3 py-2 text-right">
                <input
                  value="0.00"
                  readOnly
                  className="
                    w-[75px]
                    rounded-md
                    border
                    border-[#e1e5eb]
                    px-2
                    py-1
                    text-right
                    text-xs
                    text-[#aaa]
                    outline-none
                  "
                />
              </td>

            </tr>


            <tr className="border-t border-[#e7e7e7]">

              <td className="px-3 py-2 text-xs text-[#555]">
                33
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                102338414501
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                VENKATESH BATTINA
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                35862.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs font-semibold text-[#269d71]">
                1512.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                1050.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                462.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                0
              </td>

              <td className="px-3 py-2 text-right">
                <input
                  value="0.00"
                  readOnly
                  className="
                    w-[75px]
                    rounded-md
                    border
                    border-[#e1e5eb]
                    px-2
                    py-1
                    text-right
                    text-xs
                    text-[#aaa]
                    outline-none
                  "
                />
              </td>

            </tr>


            <tr className="border-t border-[#e7e7e7]">

              <td className="px-3 py-2 text-xs text-[#555]">
                34
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                102338416163
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                Siddela Suresh
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                35862.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs font-semibold text-[#269d71]">
                1512.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                1050.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                462.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                0
              </td>

              <td className="px-3 py-2 text-right">
                <input
                  value="0.00"
                  readOnly
                  className="
                    w-[75px]
                    rounded-md
                    border
                    border-[#e1e5eb]
                    px-2
                    py-1
                    text-right
                    text-xs
                    text-[#aaa]
                    outline-none
                  "
                />
              </td>

            </tr>


            <tr className="border-t border-[#e7e7e7]">

              <td className="px-3 py-2 text-xs text-[#555]">
                35
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                102341141838
              </td>

              <td className="px-3 py-2 text-xs text-[#555]">
                Akshitha Naidu Yetukooru
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                35862.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                12600.00
              </td>

              <td className="px-3 py-2 text-right text-xs font-semibold text-[#269d71]">
                1512.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                1050.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                462.00
              </td>

              <td className="px-3 py-2 text-right text-xs text-[#555]">
                0
              </td>

              <td className="px-3 py-2 text-right">
                <input
                  value="0.00"
                  readOnly
                  className="
                    w-[75px]
                    rounded-md
                    border
                    border-[#e1e5eb]
                    px-2
                    py-1
                    text-right
                    text-xs
                    text-[#aaa]
                    outline-none
                  "
                />
              </td>

            </tr>

          </tbody>

        </table>


        {/* =====================================================
            TABLE FOOTER
        ===================================================== */}

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            border-t
            border-[#e5e5e5]
            bg-[#fafbfc]
            px-3
            py-2
          "
        >

          <span className="text-[10px] text-[#777]">
            Showing 1-6 of 6 entries
          </span>


          <div className="flex items-center gap-1">

            <button
              type="button"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                border
                border-[#e1e5eb]
                bg-white
                text-[#a4abb5]
              "
            >
              <ChevronLeft size={14} />
            </button>


            <button
              type="button"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                bg-[#8d5545]
                text-xs
                font-medium
                text-white
              "
            >
              1
            </button>


            <button
              type="button"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                border
                border-[#e1e5eb]
                bg-white
                text-[#7b838e]
              "
            >
              <ChevronRight size={14} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}