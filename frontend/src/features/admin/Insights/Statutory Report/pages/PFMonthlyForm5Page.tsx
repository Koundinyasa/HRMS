import {
  ChevronDown,
  ChevronLeft,
  FileDown,
  FileText,
  Filter,
  MoreVertical,
  Search,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function PFMonthlyForm5Page() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full w-full bg-[#f4f8fe] p-2 sm:p-3">

      {/* =====================================================
          TOP REPORT TABS
      ===================================================== */}

      <div
        className="
          w-full
          rounded-xl
          border
          border-[#e2c0b4]
          bg-[#fff8f5]
          px-3
          py-2
          shadow-sm
        "
      >
        <div className="flex flex-wrap items-center gap-4">

          {/* PF REPORT */}

          <button
            type="button"
            className="
              flex
              h-9
              min-w-[130px]
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[#d09a88]
              bg-white
              px-4
              text-sm
              font-medium
              text-[#8b5e52]
              shadow-sm
            "
          >
            PF Report
          </button>


          {/* ESI REPORT */}

          <button
            type="button"
            className="
              flex
              h-9
              min-w-[120px]
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[#dddddd]
              bg-white
              px-4
              text-sm
              font-medium
              text-[#555555]
              shadow-sm
            "
          >
            +
            ESI Report
          </button>


          {/* LWF REPORT */}

          <button
            type="button"
            className="
              flex
              h-9
              min-w-[120px]
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[#dddddd]
              bg-white
              px-4
              text-sm
              font-medium
              text-[#555555]
              shadow-sm
            "
          >
            LWF Report
          </button>


          {/* PT REPORT */}

          <button
            type="button"
            className="
              flex
              h-9
              min-w-[120px]
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[#dddddd]
              bg-white
              px-4
              text-sm
              font-medium
              text-[#555555]
              shadow-sm
            "
          >
            ₹
            PT Report
          </button>


          {/* RIGHT ICONS */}

          <div className="ml-auto flex items-center gap-5 pr-2">

            <button
              type="button"
              title="Export"
              className="text-[#679653]"
            >
              <FileDown size={21} />
            </button>

            <button
              type="button"
              title="Filter"
              className="text-[#9b8880]"
            >
              <Filter size={21} />
            </button>

            <button
              type="button"
              title="More"
              className="text-[#9b8880]"
            >
              <MoreVertical size={21} />
            </button>

          </div>

        </div>
      </div>


      {/* =====================================================
          FORM 5 HEADER
      ===================================================== */}

      <div
        className="
          mt-3
          w-full
          rounded-xl
          border
          border-[#ded5d1]
          bg-white
          px-4
          py-2
          shadow-sm
        "
      >
        <div
          className="
            flex
            min-h-[52px]
            flex-wrap
            items-center
            gap-3
          "
        >

          {/* TITLE */}

          <div
            className="
              flex
              h-10
              items-center
              border-b-[3px]
              border-[#c89584]
              px-0
              text-base
              font-semibold
              text-[#8b5e52]
            "
          >
            PF Monthly FORM-5
          </div>


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

            {/* BACK */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                flex
                h-10
                min-w-[115px]
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-[#d0c7c3]
                bg-white
                px-4
                text-sm
                font-medium
                text-[#555555]
                transition
                hover:border-[#c89584]
                hover:text-[#8b5e52]
              "
            >
              <ChevronLeft size={18} />
              Back
            </button>


            {/* MONTH */}

            <button
              type="button"
              className="
                flex
                h-10
                min-w-[185px]
                items-center
                justify-between
                rounded-lg
                bg-[#f4f1f0]
                px-4
                text-sm
                font-medium
                text-[#333333]
              "
            >
              <span>Sep/2026</span>

              <ChevronDown size={16} />
            </button>


            {/* ADVANCE FILTER */}

            <button
              type="button"
              className="
                flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#8b5e52]
                px-5
                text-sm
                font-medium
                text-white
                shadow-sm
              "
            >
              <Filter size={17} />

              Advance Filter
            </button>


            {/* PDF */}

            <button
              type="button"
              title="PDF"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                text-[#e33f48]
              "
            >
              <FileText size={22} />
            </button>


            {/* EXCEL */}

            <button
              type="button"
              title="Excel"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                text-[#579344]
              "
            >
              <FileDown size={22} />
            </button>


            {/* MORE */}

            <button
              type="button"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                text-[#9b8880]
              "
            >
              <MoreVertical size={21} />
            </button>

          </div>

        </div>
      </div>


      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div
        className="
          mt-1
          w-full
          overflow-x-auto
          rounded-xl
          border
          border-[#ded8d5]
          bg-white
          shadow-sm
        "
      >

        <div
          className="
            flex
            min-w-[1250px]
            items-center
            gap-3
            px-3
            py-2
          "
        >

          {/* SEARCH */}

          <div
            className="
              flex
              h-9
              w-[185px]
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-[#d9e0e8]
              px-3
              text-xs
              text-[#a0a7b2]
            "
          >
            <Search size={16} />

            <span>
              Search...
            </span>
          </div>


          {/* ADD FILTER */}

          <button
            type="button"
            className="
              flex
              h-9
              shrink-0
              items-center
              gap-2
              rounded-lg
              bg-[#8b5e52]
              px-3
              text-sm
              font-medium
              text-white
            "
          >
            <span className="text-base">
              +
            </span>

            Add Filter
          </button>


          <FilterItem label="Query" />
          <FilterItem label="Branch" />
          <FilterItem label="Salary Structure" />
          <FilterItem label="Leave" />
          <FilterItem label="Attendance" />
          <FilterItem label="Designation" />
          <FilterItem label="Emp Status" />


          <button
            type="button"
            className="text-[#9b8880]"
          >
            <MoreVertical size={18} />
          </button>


          <button
            type="button"
            className="ml-auto flex items-center gap-1 text-xs text-[#888888]"
          >
            <X size={13} />
            Clear
          </button>

        </div>
      </div>


      {/* =====================================================
          FORM 5 TABLE
      ===================================================== */}

      <div className="mt-4 w-full overflow-x-auto">

        <table
          className="
            w-full
            min-w-[1400px]
            border-separate
            border-spacing-y-2
          "
        >

          {/* HEADER */}

          <thead>

            <tr
              className="
                bg-[#fff1ec]
                text-left
                text-xs
                font-semibold
                text-[#4d3933]
              "
            >

              <th className="rounded-l-lg px-3 py-4">
                Sl. No.
              </th>

              <th className="px-3 py-4">
                Account No.
              </th>

              <th className="px-3 py-4">
                Name of the Member
              </th>

              <th className="px-3 py-4">
                Father's / husband's name
              </th>

              <th className="px-3 py-4">
                Date of birth
              </th>

              <th className="px-3 py-4">
                Sex
              </th>

              <th className="px-3 py-4">
                Date of joining
              </th>

              <th className="px-3 py-4">
                Previous Service Period
              </th>

              <th className="rounded-r-lg px-3 py-4">
                Remarks
              </th>

            </tr>

          </thead>


          {/* DATA */}

          <tbody>

            <tr
              className="
                bg-white
                text-sm
                text-[#26364d]
                shadow-sm
              "
            >

              <td className="rounded-l-lg px-3 py-4">
                1
              </td>

              <td className="px-3 py-4">
              </td>

              <td className="px-3 py-4">
                G.vasudha
              </td>

              <td className="px-3 py-4">
                Lakshmipathi Naidu.G
              </td>

              <td className="px-3 py-4">
                20/Jul/1997
              </td>

              <td className="px-3 py-4">
                Female
              </td>

              <td className="px-3 py-4">
                01/Sep/2026
              </td>

              <td className="px-3 py-4">
              </td>

              <td className="rounded-r-lg px-3 py-4">
              </td>

            </tr>

          </tbody>

        </table>

      </div>


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-end
          gap-5
          px-3
          py-2
          text-xs
          text-[#555555]
        "
      >

        <span>
          Rows per page
        </span>

        <button
          type="button"
          className="flex items-center gap-1"
        >
          10
          <ChevronDown size={13} />
        </button>

        <span>
          1 to 1 of 1
        </span>

        <button
          type="button"
          className="text-[#aaa]"
        >
          ‹
        </button>

        <button
          type="button"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-[#f0e9e6]
            text-[#8b5e52]
          "
        >
          1
        </button>

        <button
          type="button"
          className="text-[#777]"
        >
          ›
        </button>

      </div>

    </div>
  );
}


function FilterItem({
  label,
}: {
  label: string;
}) {
  return (
    <button
      type="button"
      className="
        flex
        h-9
        shrink-0
        items-center
        gap-2
        rounded-lg
        border
        border-[#d9e0e8]
        bg-white
        px-3
        text-xs
        text-[#555b66]
      "
    >
      {label}

      <ChevronDown size={14} />
    </button>
  );
}