import { useState } from "react";

import {
  ChevronDown,
  ChevronLeft,
  FileDown,
  Filter,
  IndianRupee,
  MoreVertical,
  Plus,
  Search,
  Shield,
  UsersRound,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function SupplementaryReportPage() {
  const navigate = useNavigate();

  // =========================================================
  // PF GROUP DROPDOWN
  // =========================================================

  const [pfGroupOpen, setPfGroupOpen] = useState(false);

  const [selectedPFGroup, setSelectedPFGroup] = useState("");

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f3f6fb] p-3 sm:p-5">

      {/* =====================================================
          TOP REPORT TABS
      ===================================================== */}

      <div
        className="
          rounded-xl
          border-2
          border-[#d8b2a5]
          bg-[#fff8f5]
          px-3
          py-3
          sm:px-4
        "
      >
        <div
          className="
            flex
            min-h-[54px]
            items-center
            gap-3
            overflow-x-auto
          "
        >

          {/* =================================================
              PF REPORT
          ================================================= */}

          <button
            type="button"
            className="
              flex
              h-10
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-[#c99482]
              bg-white
              px-4
              text-[15px]
              font-medium
              text-[#8c5a4d]
              shadow-sm
            "
          >
            <Shield size={17} />

            <span>
              PF Report
            </span>
          </button>


          {/* =================================================
              ESI REPORT
          ================================================= */}

          <button
            type="button"
            className="
              flex
              h-10
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-[#d9d9d9]
              bg-white
              px-4
              text-[15px]
              font-medium
              text-[#444444]
              shadow-sm
              hover:bg-[#fffaf8]
            "
          >
            <Plus size={17} />

            <span>
              ESI Report
            </span>
          </button>


          {/* =================================================
              LWF REPORT
          ================================================= */}

          <button
            type="button"
            className="
              flex
              h-10
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-[#d9d9d9]
              bg-white
              px-4
              text-[15px]
              font-medium
              text-[#444444]
              shadow-sm
              hover:bg-[#fffaf8]
            "
          >
            <UsersRound size={17} />

            <span>
              LWF Report
            </span>
          </button>


          {/* =================================================
              PT REPORT
          ================================================= */}

          <button
            type="button"
            className="
              flex
              h-10
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-[#d9d9d9]
              bg-white
              px-4
              text-[15px]
              font-medium
              text-[#444444]
              shadow-sm
              hover:bg-[#fffaf8]
            "
          >
            <IndianRupee size={17} />

            <span>
              PT Report
            </span>
          </button>


          {/* =================================================
              RIGHT ICONS
          ================================================= */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-5
              pr-2
            "
          >

            {/* EXCEL */}

            <button
              type="button"
              className="text-[#398d49]"
              title="Export"
            >
              <FileDown size={23} />
            </button>


            {/* FILTER */}

            <button
              type="button"
              className="text-[#8f91a0]"
              title="Filter"
            >
              <Filter size={22} />
            </button>


            {/* HISTORY */}

            <button
              type="button"
              className="text-[#8f91a0]"
              title="History"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 25 25"
                fill="none"
              >
                <circle
                  cx="12.5"
                  cy="12.5"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M12.5 7V12.5L16 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

          </div>

        </div>
      </div>


      {/* =====================================================
          REPORT HEADER
      ===================================================== */}

      <div
        className="
          mt-4
          rounded-xl
          bg-white
          px-4
          py-3
          shadow-[0_2px_8px_rgba(0,0,0,0.08)]
          sm:px-5
        "
      >

        <div
          className="
            flex
            min-h-[58px]
            flex-wrap
            items-center
            gap-3
          "
        >

          {/* =================================================
              TITLE
          ================================================= */}

          <h1
            className="
              mr-auto
              inline-block
              border-b-[3px]
              border-[#b77a68]
              pb-2
              text-[18px]
              font-semibold
              text-[#8c5a4d]
              sm:text-[19px]
            "
          >
            Supplementary Report
          </h1>


          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              flex
              h-12
              items-center
              gap-2
              rounded-lg
              border
              border-[#c9c9c9]
              bg-white
              px-4
              text-base
              font-medium
              text-[#555555]
              hover:bg-[#fffaf8]
              sm:px-5
            "
          >
            <ChevronLeft size={21} />

            <span>
              Back
            </span>
          </button>


          {/* =================================================
              MONTH
          ================================================= */}

          <button
            type="button"
            className="
              flex
              h-12
              min-w-[170px]
              items-center
              justify-between
              rounded-lg
              bg-[#f4efec]
              px-5
              text-base
              font-medium
              text-[#444444]
              hover:bg-[#eee7e3]
            "
          >
            <span>
              Sep/2026
            </span>

            <ChevronDown size={18} />
          </button>


          {/* =================================================
              SELECT PF GROUP
          ================================================= */}

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
                h-12
                min-w-[195px]
                items-center
                justify-between
                rounded-lg
                border
                bg-white
                px-4
                text-base
                text-[#444444]
                ${
                  pfGroupOpen
                    ? "border-[#b77a68] ring-1 ring-[#d8b2a5]"
                    : "border-[#d5d1cf]"
                }
              `}
            >

              <span>
                {selectedPFGroup || "Select PF Group"}
              </span>

              <ChevronDown
                size={17}
                className={`
                  transition-transform
                  ${
                    pfGroupOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>


            {/* =================================================
                PF GROUP DROPDOWN
            ================================================= */}

            {pfGroupOpen && (
              <div
                className="
                  absolute
                  left-0
                  top-[55px]
                  z-[100]
                  w-[195px]
                  rounded-lg
                  border
                  border-[#e1d8d4]
                  bg-white
                  p-3
                  shadow-[0_4px_16px_rgba(0,0,0,0.18)]
                "
              >

                {/* DEFAULT PF */}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPFGroup(
                      selectedPFGroup ===
                        "Default PF"
                        ? ""
                        : "Default PF",
                    );
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-md
                    px-2
                    py-2
                    text-left
                    text-[16px]
                    text-[#3f4249]
                    hover:bg-[#fff5f1]
                  "
                >

                  <span
                    className={`
                      flex
                      h-[19px]
                      w-[19px]
                      items-center
                      justify-center
                      rounded-[2px]
                      border-2
                      ${
                        selectedPFGroup ===
                        "Default PF"
                          ? "border-[#b77a68] bg-[#b77a68]"
                          : "border-[#8d939c] bg-white"
                      }
                    `}
                  >

                    {selectedPFGroup ===
                      "Default PF" && (
                      <span
                        className="
                          text-[13px]
                          font-bold
                          text-white
                        "
                      >
                        ✓
                      </span>
                    )}

                  </span>

                  <span>
                    Default PF
                  </span>

                </button>


                {/* CLEAR */}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPFGroup("");
                    setPfGroupOpen(false);
                  }}
                  className="
                    mt-3
                    flex
                    h-[48px]
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-lg
                    border
                    border-[#c9cdd3]
                    bg-white
                    text-[16px]
                    font-medium
                    text-[#737985]
                    hover:bg-[#fff8f5]
                  "
                >

                  <span className="text-[20px]">
                    ≡
                  </span>

                  <span>
                    Clear
                  </span>

                </button>

              </div>
            )}

          </div>


          {/* =================================================
              ADVANCE FILTER
          ================================================= */}

          <button
            type="button"
            className="
              flex
              h-12
              items-center
              gap-3
              rounded-lg
              bg-[#b77a68]
              px-5
              text-base
              font-medium
              text-white
              shadow-sm
              hover:bg-[#a86d5c]
            "
          >

            <Filter size={18} />

            <span>
              Advance Filter
            </span>

          </button>


          {/* =================================================
              PDF
          ================================================= */}

          <button
            type="button"
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              text-[#d64545]
            "
            title="PDF"
          >
            <span className="text-sm font-bold">
              PDF
            </span>
          </button>

        </div>

      </div>


      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div
        className="
          mt-4
          w-full
          overflow-x-auto
          rounded-xl
          bg-white
          shadow-[0_2px_8px_rgba(0,0,0,0.08)]
        "
      >

        <div
          className="
            flex
            h-[60px]
            min-w-[1080px]
            items-center
            gap-5
            px-4
          "
        >

          {/* MORE */}

          <button
            type="button"
            className="shrink-0 text-[#9ba2b2]"
            title="More"
          >
            <MoreVertical size={22} />
          </button>


          {/* CLOSE */}

          <button
            type="button"
            className="shrink-0 text-[#b77a68]"
            title="Close"
          >
            <X size={23} />
          </button>


          {/* SEARCH */}

          <div
            className="
              flex
              min-w-[180px]
              flex-1
              items-center
              gap-3
              text-[#b7bcc8]
            "
          >

            <Search size={22} />

            <span className="whitespace-nowrap text-[15px]">
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
              whitespace-nowrap
              text-[15px]
              font-medium
              text-[#555555]
            "
          >

            <span className="text-xl">
              +
            </span>

            <span>
              Add Filter
            </span>

          </button>


          {/* QUERY */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1
              whitespace-nowrap
              text-[15px]
              text-[#555555]
            "
          >
            Query

            <ChevronDown size={15} />
          </button>


          {/* BRANCH */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1
              whitespace-nowrap
              text-[15px]
              text-[#555555]
            "
          >
            Branch

            <ChevronDown size={15} />
          </button>


          {/* SALARY STRUCTURE */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1
              whitespace-nowrap
              text-[15px]
              text-[#555555]
            "
          >
            Salary Structure

            <ChevronDown size={15} />
          </button>


          {/* LEAVE */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1
              whitespace-nowrap
              text-[15px]
              text-[#555555]
            "
          >
            Leave

            <ChevronDown size={15} />
          </button>


          {/* ATTENDANCE */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1
              whitespace-nowrap
              text-[15px]
              text-[#555555]
            "
          >
            Attendance

            <ChevronDown size={15} />
          </button>


          {/* DESIGNATION */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1
              whitespace-nowrap
              text-[15px]
              text-[#555555]
            "
          >
            Designation

            <ChevronDown size={15} />
          </button>


          {/* EMP STATUS */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1
              whitespace-nowrap
              text-[15px]
              text-[#555555]
            "
          >
            Emp Status

            <ChevronDown size={15} />
          </button>

        </div>

      </div>


      {/* =====================================================
          EMPTY REPORT AREA
      ===================================================== */}

      <div
        className="
          mt-0
          flex
          min-h-[560px]
          w-full
          items-center
          justify-center
          bg-[#f3f6fb]
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            pt-6
          "
        >

          {/* =================================================
              EMPTY STATE ILLUSTRATION
          ================================================= */}

          <div
            className="
              relative
              h-[270px]
              w-[360px]
            "
          >

            {/* WINDOW */}

            <div
              className="
                absolute
                left-[100px]
                top-[35px]
                h-[170px]
                w-[170px]
                rounded-t-[8px]
                border
                border-[#c7cbd1]
                bg-white
                opacity-80
              "
            >

              <div
                className="
                  flex
                  h-[18px]
                  items-center
                  gap-1
                  border-b
                  border-[#d8dadd]
                  px-2
                "
              >

                <span className="h-[5px] w-[5px] rounded-full bg-[#d0d0d0]" />

                <span className="h-[5px] w-[5px] rounded-full bg-[#d0d0d0]" />

                <span className="h-[5px] w-[5px] rounded-full bg-[#d0d0d0]" />

                <span
                  className="
                    ml-2
                    h-[4px]
                    w-[70px]
                    rounded-full
                    bg-[#d5d5d5]
                  "
                />

              </div>

            </div>


            {/* QUESTION MARK 1 */}

            <div
              className="
                absolute
                left-[65px]
                top-[70px]
                text-[55px]
                font-bold
                text-[#f0a8c5]
              "
            >
              ?
            </div>


            {/* QUESTION MARK 2 */}

            <div
              className="
                absolute
                left-[205px]
                top-[78px]
                text-[45px]
                font-bold
                text-[#d9dce2]
              "
            >
              ?
            </div>


            {/* QUESTION MARK 3 */}

            <div
              className="
                absolute
                left-[245px]
                top-[78px]
                text-[45px]
                font-bold
                text-[#d9dce2]
              "
            >
              ?
            </div>


            {/* PERSON HEAD */}

            <div
              className="
                absolute
                left-[195px]
                top-[90px]
                z-20
                h-[43px]
                w-[43px]
                rounded-full
                bg-[#f5c7a5]
              "
            />


            {/* HAIR */}

            <div
              className="
                absolute
                left-[193px]
                top-[88px]
                z-30
                h-[18px]
                w-[46px]
                rounded-t-full
                bg-[#2e2928]
              "
            />


            {/* BODY */}

            <div
              className="
                absolute
                left-[173px]
                top-[125px]
                z-10
                h-[92px]
                w-[92px]
                rounded-[35px_35px_20px_20px]
                bg-[#3293d8]
              "
            />


            {/* COMPUTER */}

            <div
              className="
                absolute
                left-[145px]
                top-[145px]
                z-30
                h-[70px]
                w-[85px]
                rounded-[5px]
                border-[5px]
                border-[#3138bd]
                bg-[#5157dc]
              "
            />


            {/* COMPUTER STAND */}

            <div
              className="
                absolute
                left-[181px]
                top-[211px]
                z-20
                h-[22px]
                w-[10px]
                bg-[#4c50c8]
              "
            />


            {/* DESK */}

            <div
              className="
                absolute
                left-[75px]
                top-[205px]
                z-30
                h-[16px]
                w-[280px]
                rounded-full
                bg-[#f3b400]
              "
            />


            {/* DESK LEFT LEG */}

            <div
              className="
                absolute
                left-[95px]
                top-[215px]
                h-[60px]
                w-[8px]
                rotate-[5deg]
                bg-[#efb500]
              "
            />


            {/* DESK RIGHT LEG */}

            <div
              className="
                absolute
                left-[330px]
                top-[215px]
                h-[60px]
                w-[8px]
                -rotate-[5deg]
                bg-[#efb500]
              "
            />


            {/* PLANT POT */}

            <div
              className="
                absolute
                left-[120px]
                top-[170px]
                z-40
                h-[30px]
                w-[20px]
                rounded-b-full
                bg-[#f0a0a8]
              "
            />


            {/* PLANT LEFT */}

            <div
              className="
                absolute
                left-[123px]
                top-[145px]
                z-40
                h-[30px]
                w-[7px]
                -rotate-[20deg]
                rounded-full
                bg-[#74bd72]
              "
            />


            {/* PLANT RIGHT */}

            <div
              className="
                absolute
                left-[133px]
                top-[147px]
                z-40
                h-[28px]
                w-[7px]
                rotate-[25deg]
                rounded-full
                bg-[#64ad69]
              "
            />


            {/* FLOOR LINE */}

            <div
              className="
                absolute
                bottom-[2px]
                left-[75px]
                h-[1px]
                w-[285px]
                bg-[#aeb2b7]
              "
            />

          </div>


          {/* =================================================
              EMPTY TEXT
          ================================================= */}

          <div
            className="
              mt-1
              text-center
              text-[19px]
              font-semibold
              text-[#b77a68]
              sm:text-[20px]
            "
          >
            No Data Found in - Pf report
          </div>

        </div>

      </div>

    </div>
  );
}