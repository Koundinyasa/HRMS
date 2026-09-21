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

export default function PFMonthlyForm10Page() {
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

          <button
            type="button"
            className="
              flex
              h-9
              min-w-[130px]
              items-center
              justify-center
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


          <button
            type="button"
            className="
              flex
              h-9
              min-w-[120px]
              items-center
              justify-center
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
            + ESI Report
          </button>


          <button
            type="button"
            className="
              flex
              h-9
              min-w-[120px]
              items-center
              justify-center
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


          <button
            type="button"
            className="
              flex
              h-9
              min-w-[120px]
              items-center
              justify-center
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
            ₹ PT Report
          </button>


          <div className="ml-auto flex items-center gap-5 pr-2">

            <button
              type="button"
              className="text-[#679653]"
            >
              <FileDown size={21} />
            </button>

            <button
              type="button"
              className="text-[#9b8880]"
            >
              <Filter size={21} />
            </button>

            <button
              type="button"
              className="text-[#9b8880]"
            >
              <MoreVertical size={21} />
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          FORM 10 HEADER
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
              text-base
              font-semibold
              text-[#8b5e52]
            "
          >
            PF Monthly FORM-10
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
              Sep/2026

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

            Search...
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
            className="ml-auto text-[#e63845]"
          >
            <X size={20} />
          </button>

        </div>

      </div>


      {/* =====================================================
          NO DATA AREA
      ===================================================== */}

      <div
        className="
          flex
          min-h-[560px]
          flex-col
          items-center
          justify-center
          bg-[#f4f8fe]
        "
      >

        {/* ILLUSTRATION */}

        <div
          className="
            relative
            h-[320px]
            w-[390px]
            max-w-full
          "
        >

          {/* BACKGROUND CIRCLE */}

          <div
            className="
              absolute
              left-[100px]
              top-[30px]
              h-[150px]
              w-[150px]
              rounded-full
              bg-[#fff1ec]
            "
          />


          {/* LEFT DECORATION */}

          <div
            className="
              absolute
              left-[35px]
              top-[120px]
              h-[35px]
              w-[55px]
              rotate-[-10deg]
              rounded-full
              border
              border-dashed
              border-[#dfc1b7]
            "
          />


          {/* RIGHT DECORATION */}

          <div
            className="
              absolute
              right-[35px]
              top-[140px]
              h-[40px]
              w-[60px]
              rotate-[12deg]
              rounded-full
              border
              border-dashed
              border-[#dfc1b7]
            "
          />


          {/* WINDOW */}

          <div
            className="
              absolute
              left-[105px]
              top-[55px]
              h-[155px]
              w-[180px]
              rounded-md
              border
              border-[#d2d2d2]
              bg-white
              shadow-sm
            "
          >

            {/* WINDOW BAR */}

            <div
              className="
                flex
                h-[18px]
                items-center
                gap-1
                rounded-t-md
                bg-[#c89584]
                px-2
              "
            >

              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-white" />

              <span
                className="
                  ml-1
                  h-1.5
                  w-[55px]
                  rounded-full
                  bg-white
                "
              />

            </div>


            {/* PAPER 1 */}

            <div
              className="
                absolute
                left-[48px]
                top-[45px]
                h-[62px]
                w-[48px]
                rotate-[-15deg]
                border
                border-[#d2d2d2]
                bg-white
                text-center
                text-2xl
                leading-[62px]
                text-[#c7b4ad]
              "
            >
              ?
            </div>


            {/* PAPER 2 */}

            <div
              className="
                absolute
                right-[35px]
                top-[48px]
                h-[62px]
                w-[48px]
                rotate-[15deg]
                border
                border-[#d2d2d2]
                bg-white
                text-center
                text-2xl
                leading-[62px]
                text-[#c7b4ad]
              "
            >
              ?
            </div>

          </div>


          {/* LARGE QUESTION */}

          <div
            className="
              absolute
              left-[70px]
              top-[115px]
              text-[58px]
              font-bold
              text-[#f09bbd]
            "
          >
            ?
          </div>


          {/* PERSON */}

          <div
            className="
              absolute
              bottom-[30px]
              left-[160px]
            "
          >

            {/* HEAD */}

            <div
              className="
                mx-auto
                h-9
                w-9
                rounded-full
                bg-[#efa77d]
              "
            />


            {/* HAIR */}

            <div
              className="
                mx-auto
                -mt-9
                h-5
                w-9
                rounded-t-full
                bg-[#222222]
              "
            />


            {/* BODY */}

            <div
              className="
                mt-2
                h-[75px]
                w-[72px]
                rounded-t-[30px]
                bg-[#6c473e]
              "
            />


            {/* LEFT ARM */}

            <div
              className="
                absolute
                -left-[22px]
                top-[30px]
                h-[52px]
                w-[18px]
                rotate-[-40deg]
                rounded-full
                bg-[#6c473e]
              "
            />


            {/* RIGHT ARM */}

            <div
              className="
                absolute
                right-[-22px]
                top-[30px]
                h-[52px]
                w-[18px]
                rotate-[40deg]
                rounded-full
                bg-[#6c473e]
              "
            />

          </div>


          {/* DESK */}

          <div
            className="
              absolute
              bottom-[58px]
              left-[75px]
              h-3
              w-[240px]
              rounded-full
              bg-[#c89584]
            "
          />


          {/* LEFT DESK LEG */}

          <div
            className="
              absolute
              bottom-[0]
              left-[90px]
              h-[62px]
              w-2
              rotate-[7deg]
              bg-[#8b5e52]
            "
          />


          {/* RIGHT DESK LEG */}

          <div
            className="
              absolute
              bottom-[0]
              right-[85px]
              h-[62px]
              w-2
              rotate-[-7deg]
              bg-[#8b5e52]
            "
          />


          {/* MONITOR */}

          <div
            className="
              absolute
              bottom-[69px]
              left-[165px]
              h-[58px]
              w-[72px]
              rounded-md
              bg-[#c89584]
            "
          >


            <div
              className="
                absolute
                left-[23px]
                top-[16px]
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                border-2
                border-white
                text-xs
                text-white
              "
            >
              ☹
            </div>

          </div>


          {/* MONITOR STAND */}

          <div
            className="
              absolute
              bottom-[57px]
              left-[197px]
              h-4
              w-2
              bg-[#8b5e52]
            "
          />


          {/* PLANT */}

          <div
            className="
              absolute
              bottom-[59px]
              left-[130px]
              text-[27px]
            "
          >
            🌱
          </div>

        </div>


        {/* NO DATA MESSAGE */}

        <p
          className="
            mt-1
            text-[17px]
            font-medium
            text-[#c57979]
          "
        >
          No Data Found in - Pf report
        </p>

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