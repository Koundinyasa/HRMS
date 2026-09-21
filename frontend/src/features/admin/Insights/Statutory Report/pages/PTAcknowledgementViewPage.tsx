import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Clock3,
  Filter,
  MoreVertical,
  Plus,
  Search,
  X,
  FileText,
  Shield,
  UsersRound,
  IndianRupee,
} from "lucide-react";

export default function PTAcknowledgementViewPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] p-3 sm:p-4">

      {/* =========================================================
          TOP REPORT TABS
      ========================================================= */}

      <div
        className="
          w-full
          rounded-xl
          border
          border-[#ddd7d3]
          bg-white
          px-4
          shadow-[0_1px_5px_rgba(0,0,0,0.07)]
        "
      >
        <div
          className="
            flex
            min-h-[68px]
            items-center
            gap-7
            overflow-x-auto
          "
        >

          {/* PF REPORT */}

          <button
            type="button"
            className="
              flex
              h-[58px]
              shrink-0
              items-center
              gap-2
              border-b-[3px]
              border-transparent
              px-1
              text-[16px]
              font-medium
              text-[#4b4b4b]
              transition
              hover:text-[#8b5a4c]
            "
          >
            <Shield size={17} strokeWidth={1.8} />

            PF Report
          </button>


          {/* ESI REPORT */}

          <button
            type="button"
            className="
              flex
              h-[58px]
              shrink-0
              items-center
              gap-2
              border-b-[3px]
              border-transparent
              px-1
              text-[16px]
              font-medium
              text-[#4b4b4b]
              transition
              hover:text-[#8b5a4c]
            "
          >
            <Plus size={17} strokeWidth={1.8} />

            ESI Report
          </button>


          {/* LWF REPORT */}

          <button
            type="button"
            className="
              flex
              h-[58px]
              shrink-0
              items-center
              gap-2
              border-b-[3px]
              border-transparent
              px-1
              text-[16px]
              font-medium
              text-[#4b4b4b]
              transition
              hover:text-[#8b5a4c]
            "
          >
            <UsersRound size={17} strokeWidth={1.8} />

            LWF Report
          </button>


          {/* PT REPORT - ACTIVE */}

          <button
            type="button"
            className="
              flex
              h-[58px]
              shrink-0
              items-center
              gap-2
              border-b-[3px]
              border-[#c89584]
              px-1
              text-[16px]
              font-semibold
              text-[#8b5a4c]
            "
          >
            <IndianRupee size={17} strokeWidth={1.8} />

            PT Report
          </button>


          {/* RIGHT SIDE ICONS */}

          <div className="ml-auto flex items-center gap-5">

            <Filter
              size={21}
              strokeWidth={1.8}
              className="shrink-0 text-[#8b5a4c]"
            />

            <Clock3
              size={21}
              strokeWidth={1.8}
              className="shrink-0 text-[#8b5a4c]"
            />

          </div>

        </div>
      </div>


      {/* =========================================================
          PAGE HEADER
      ========================================================= */}

      <div
        className="
          mt-3
          w-full
          rounded-xl
          border
          border-[#ddd7d3]
          bg-white
          px-4
          shadow-[0_1px_5px_rgba(0,0,0,0.07)]
        "
      >

        <div
          className="
            flex
            min-h-[68px]
            flex-wrap
            items-center
            gap-3
          "
        >

          {/* PAGE TITLE */}

          <div className="shrink-0">

            <h1
              className="
                border-b-[3px]
                border-[#c89584]
                pb-2
                text-[18px]
                font-semibold
                text-[#8b5a4c]
              "
            >
              PT Acknowledgement View
            </h1>

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
              onClick={() => navigate("../pt")}
              className="
                flex
                h-[48px]
                items-center
                gap-2
                rounded-lg
                border
                border-[#d2ccc8]
                bg-white
                px-5
                text-[15px]
                font-medium
                text-[#4b4b4b]
                shadow-sm
                transition
                hover:bg-[#fff8f5]
              "
            >
              <ArrowLeft
                size={19}
                strokeWidth={1.8}
              />

              Back
            </button>


            {/* FROM MONTH LABEL */}

            <span
              className="
                text-[15px]
                font-medium
                text-[#4b4b4b]
              "
            >
              From Month
            </span>


            {/* FROM MONTH */}

            <button
              type="button"
              className="
                flex
                h-[48px]
                min-w-[170px]
                items-center
                justify-between
                rounded-lg
                border
                border-[#ddd7d3]
                bg-[#f3f5f9]
                px-4
                text-[15px]
                font-medium
                text-[#4b4b4b]
              "
            >
              <span>Sep/2026</span>

              <ChevronDown
                size={17}
                className="text-[#777777]"
              />
            </button>


            {/* TO MONTH LABEL */}

            <span
              className="
                text-[15px]
                font-medium
                text-[#4b4b4b]
              "
            >
              To Month
            </span>


            {/* TO MONTH */}

            <button
              type="button"
              className="
                flex
                h-[48px]
                min-w-[170px]
                items-center
                justify-between
                rounded-lg
                border
                border-[#ddd7d3]
                bg-[#f3f5f9]
                px-4
                text-[15px]
                font-medium
                text-[#4b4b4b]
              "
            >
              <span>Sep/2026</span>

              <ChevronDown
                size={17}
                className="text-[#777777]"
              />
            </button>


            {/* PT GROUP LABEL */}

            <span
              className="
                text-[15px]
                font-medium
                text-[#4b4b4b]
              "
            >
              PT Group
            </span>


            {/* PT GROUP */}

            <button
              type="button"
              className="
                flex
                h-[48px]
                min-w-[210px]
                items-center
                justify-between
                rounded-lg
                border
                border-[#ddd7d3]
                bg-white
                px-4
                text-[15px]
                font-medium
                text-[#4b4b4b]
              "
            >
              <span></span>

              <ChevronDown
                size={17}
                className="text-[#777777]"
              />
            </button>


            {/* EXCEL ICON */}

            <button
              type="button"
              className="
                flex
                h-[48px]
                w-[45px]
                items-center
                justify-center
                rounded-lg
                bg-transparent
              "
            >
              <FileText
                size={20}
                strokeWidth={1.8}
                className="text-[#8b5a4c]"
              />
            </button>

          </div>

        </div>

      </div>


      {/* =========================================================
          FILTER BAR
      ========================================================= */}

      <div
        className="
          mt-2
          w-full
          rounded-xl
          border
          border-[#ddd7d3]
          bg-white
          shadow-[0_1px_5px_rgba(0,0,0,0.07)]
        "
      >

        <div
          className="
            flex
            min-h-[55px]
            items-center
            gap-5
            overflow-x-auto
            px-4
          "
        >

          {/* SEARCH */}

          <div
            className="
              flex
              min-w-[270px]
              flex-1
              items-center
              gap-3
            "
          >

            <Search
              size={20}
              strokeWidth={1.8}
              className="text-[#8b5a4c]"
            />

            <span
              className="
                text-[14px]
                text-[#a9a9a9]
              "
            >
              Start Typing...
            </span>

          </div>


          {/* ADD FILTER */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-2
              text-[15px]
              font-medium
              text-[#4b4b4b]
            "
          >
            <Plus size={18} />

            Add Filter
          </button>


          {/* QUERY */}

          <FilterOption label="Query" />


          {/* BRANCH */}

          <FilterOption label="Branch" />


          {/* SALARY STRUCTURE */}

          <FilterOption label="Salary Structure" />


          {/* LEAVE */}

          <FilterOption label="Leave" />


          {/* ATTENDANCE */}

          <FilterOption label="Attendance" />


          {/* DESIGNATION */}

          <FilterOption label="Designation" />


          {/* EMP STATUS */}

          <FilterOption label="Emp Status" />


          {/* MORE */}

          <button
            type="button"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-md
              text-[#777777]
            "
          >
            <MoreVertical size={19} />
          </button>


          {/* CLOSE */}

          <button
            type="button"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              text-[#a75f50]
            "
          >
            <X size={21} />
          </button>

        </div>

      </div>


      {/* =========================================================
          EMPTY STATE
      ========================================================= */}

      <div
        className="
          flex
          min-h-[580px]
          w-full
          items-center
          justify-center
          bg-[#f4f7fb]
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            text-center
          "
        >

          {/* EMPTY STATE ILLUSTRATION */}

          <div
            className="
              relative
              mb-5
              flex
              h-[220px]
              w-[300px]
              items-center
              justify-center
            "
          >

            {/* BACK CIRCLE */}

            <div
              className="
                absolute
                left-[30px]
                top-[55px]
                h-[34px]
                w-[34px]
                rounded-full
                border
                border-[#d8dfeb]
                bg-transparent
              "
            />


            {/* MAIN DOCUMENT */}

            <div
              className="
                relative
                mt-2
                flex
                h-[145px]
                w-[145px]
                flex-col
                items-center
                rounded-lg
                border
                border-[#dce2ec]
                bg-white
                shadow-[0_2px_8px_rgba(0,0,0,0.05)]
              "
            >

              {/* TOP BAR */}

              <div
                className="
                  h-[12px]
                  w-full
                  rounded-t-lg
                  bg-[#aeb7ed]
                "
              />

              {/* DOCUMENT */}

              <div
                className="
                  mt-6
                  flex
                  h-[58px]
                  w-[50px]
                  items-center
                  justify-center
                  rounded-md
                  bg-[#d5d9f8]
                "
              >

                <div
                  className="
                    h-[25px]
                    w-[20px]
                    rounded-md
                    border-2
                    border-[#8792d8]
                  "
                />

              </div>


              {/* SMALL LINE */}

              <div
                className="
                  mt-3
                  h-[6px]
                  w-[55px]
                  rounded-full
                  bg-[#d9deeb]
                "
              />

            </div>


            {/* RIGHT CIRCLE */}

            <div
              className="
                absolute
                right-[35px]
                top-[80px]
                h-[30px]
                w-[30px]
                rounded-full
                border
                border-[#d8dfeb]
                bg-transparent
              "
            />


            {/* PERSON */}

            <div
              className="
                absolute
                bottom-[23px]
                right-[75px]
                h-[40px]
                w-[40px]
                rounded-t-full
                bg-[#243878]
              "
            />

            <div
              className="
                absolute
                bottom-[55px]
                right-[86px]
                h-[24px]
                w-[24px]
                rounded-full
                bg-[#e6a957]
              "
            />

          </div>


          {/* EMPTY TEXT */}

          <p
            className="
              text-[17px]
              font-medium
              text-[#333333]
            "
          >
            Did Not Find Any PT Report
          </p>

        </div>

      </div>

    </div>
  );
}


/* =============================================================
   FILTER OPTION
============================================================= */

function FilterOption({
  label,
}: {
  label: string;
}) {
  return (
    <button
      type="button"
      className="
        flex
        shrink-0
        items-center
        gap-1.5
        whitespace-nowrap
        text-[14px]
        font-medium
        text-[#555555]
      "
    >
      {label}

      <ChevronDown
        size={15}
        strokeWidth={1.8}
        className="text-[#777777]"
      />
    </button>
  );
}