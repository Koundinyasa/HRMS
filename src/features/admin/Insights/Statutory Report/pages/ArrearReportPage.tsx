import { useState } from "react";

import {
  ChevronDown,
  ChevronLeft,
  FileDown,
  Filter,
  MoreVertical,
  Search,
  X,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";


export default function ArrearReportPage() {
  const navigate = useNavigate();

  const [pfGroupOpen, setPfGroupOpen] = useState(false);
  const [selectedPFGroup, setSelectedPFGroup] = useState("");


  return (
    <div className="min-h-full w-full bg-[#f4f8fe] p-2 sm:p-3">

      {/* =====================================================
          TOP REPORT NAVIGATION
      ===================================================== */}

      <div
        className="
          w-full
          rounded-xl
          border
          border-[#e1d6d1]
          bg-[#fff8f5]
          px-3
          py-2
          shadow-sm
        "
      >

        <div className="flex flex-wrap items-center gap-4">

          {/* ==================================================
              PF REPORT
          ================================================== */}

          <NavLink
            to="../"
            className="
              flex
              h-9
              min-w-[130px]
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[#c99b8e]
              bg-white
              px-4
              text-sm
              font-medium
              text-[#8b5e52]
              shadow-sm
            "
          >
            <span>
              PF Report
            </span>
          </NavLink>


          {/* ==================================================
              ESI REPORT
          ================================================== */}

          <NavLink
            to="../../esi"
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
            <span>
              ESI Report
            </span>
          </NavLink>


          {/* ==================================================
              LWF REPORT
          ================================================== */}

          <NavLink
            to="../../lwf"
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
            <span>
              LWF Report
            </span>
          </NavLink>


          {/* ==================================================
              PT REPORT
          ================================================== */}

          <NavLink
            to="../../pt"
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
            <span>
              PT Report
            </span>
          </NavLink>


          {/* ==================================================
              RIGHT SIDE ICONS
          ================================================== */}

          <div className="ml-auto flex items-center gap-5 pr-2">

            <button
              type="button"
              title="Export"
              className="text-[#679653]"
            >
              <FileDown
                size={22}
                strokeWidth={2}
              />
            </button>


            <button
              type="button"
              title="Filter"
              className="text-[#9d8b84]"
            >
              <Filter
                size={22}
                strokeWidth={2}
              />
            </button>


            <button
              type="button"
              title="More"
              className="text-[#9d8b84]"
            >
              <MoreVertical
                size={22}
                strokeWidth={2}
              />
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          ARREAR HEADER
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

          {/* ==================================================
              TITLE
          ================================================== */}

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
            Arrear
          </div>


          {/* ==================================================
              RIGHT CONTROLS
          ================================================== */}

          <div
            className="
              ml-auto
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            {/* ==================================================
                BACK
            ================================================== */}

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

              <ChevronLeft
                size={18}
              />

              Back

            </button>


            {/* ==================================================
                DATE
            ================================================== */}

            <button
              type="button"
              className="
                flex
                h-10
                min-w-[185px]
                items-center
                justify-between
                rounded-lg
                border
                border-[#e0d9d5]
                bg-[#f4f3f5]
                px-4
                text-sm
                font-medium
                text-[#333333]
              "
            >

              <span>
                Sep/2026
              </span>

              <ChevronDown
                size={16}
              />

            </button>


            {/* ==================================================
                PF GROUP
            ================================================== */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setPfGroupOpen(
                    (previous) => !previous
                  )
                }
                className="
                  flex
                  h-10
                  min-w-[195px]
                  items-center
                  justify-between
                  rounded-lg
                  border
                  border-[#ddd5d1]
                  bg-white
                  px-4
                  text-sm
                  text-[#333333]
                "
              >

                <span>
                  {selectedPFGroup || "Select PF Group"}
                </span>

                <ChevronDown
                  size={16}
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


              {/* ==================================================
                  PF GROUP DROPDOWN
              ================================================== */}

              {pfGroupOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-[210px]
                    rounded-lg
                    border
                    border-[#ddd5d1]
                    bg-white
                    p-2
                    shadow-lg
                  "
                >

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPFGroup(
                        selectedPFGroup === "Default PF"
                          ? ""
                          : "Default PF"
                      );

                      setPfGroupOpen(false);
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-md
                      px-3
                      py-2
                      text-left
                      text-sm
                      text-[#444444]
                      hover:bg-[#fff6f2]
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
                            ? "border-[#8b5e52] bg-[#8b5e52]"
                            : "border-[#999999]"
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
                      mt-1
                      w-full
                      rounded-md
                      border
                      border-[#ddd5d1]
                      py-2
                      text-sm
                      text-[#777777]
                    "
                  >
                    Clear
                  </button>

                </div>
              )}

            </div>


            {/* ==================================================
                ADVANCE FILTER
            ================================================== */}

            <button
              type="button"
              className="
                flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-[#8b5e52]
                bg-white
                px-4
                text-sm
                font-medium
                text-[#8b5e52]
                transition
                hover:bg-[#fff6f2]
              "
            >

              <Filter
                size={17}
              />

              Advance Filter

            </button>


            {/* ==================================================
                EXCEL
            ================================================== */}

            <button
              type="button"
              title="Export Excel"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                text-[#679653]
              "
            >

              <FileDown
                size={23}
              />

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
          border-[#e0d9d5]
          bg-white
          shadow-sm
        "
      >

        <div
          className="
            flex
            min-w-[1150px]
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

            <Search
              size={16}
            />

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


          {/* QUERY */}

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

            Query

            <ChevronDown
              size={14}
            />

          </button>


          {/* BRANCH */}

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

            Branch

            <ChevronDown
              size={14}
            />

          </button>


          {/* SALARY STRUCTURE */}

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

            Salary Structure

            <ChevronDown
              size={14}
            />

          </button>


          {/* LEAVE */}

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

            Leave

            <ChevronDown
              size={14}
            />

          </button>


          {/* ATTENDANCE */}

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

            Attendance

            <ChevronDown
              size={14}
            />

          </button>


          {/* DESIGNATION */}

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

            Designation

            <ChevronDown
              size={14}
            />

          </button>


          {/* EMP STATUS */}

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

            Emp Status

            <ChevronDown
              size={14}
            />

          </button>


          {/* MORE */}

          <button
            type="button"
            className="
              shrink-0
              text-[#9b8a84]
            "
          >

            <MoreVertical
              size={18}
            />

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
              text-[#8b8f96]
            "
          >

            <X
              size={13}
            />

            Clear

          </button>

        </div>

      </div>


      {/* =====================================================
          MAIN CONTENT AREA
      ===================================================== */}

      <div
        className="
          mt-4
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-[minmax(0,1fr)_280px]
        "
      >

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <div className="min-w-0">

          {/* ==================================================
              SUMMARY HEADER
          ================================================== */}

          <div
            className="
              flex
              h-10
              items-center
              gap-3
              rounded-xl
              border
              border-[#ded8d5]
              bg-white
              px-3
              shadow-sm
            "
          >

            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                border
                border-[#c89584]
                text-[#8b5e52]
              "
            >
              ▣
            </div>

            <span
              className="
                text-sm
                font-medium
                text-[#333333]
              "
            >
              Summary
            </span>

          </div>


          {/* ==================================================
              SUMMARY CARDS
          ================================================== */}

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

            {[
              "Employee PF Earning",
              "Employee EPF Contribution",
              "Employer PF Contribution",
              "EDLI Wages",
              "Employee PF Vol. Contribution",
              "Pension Wages",
            ].map((label) => (
              <div
                key={label}
                className="
                  min-h-[54px]
                  rounded-lg
                  border
                  border-[#d8d8d8]
                  bg-white
                  px-2
                  py-2
                "
              >

                <p
                  className="
                    text-[10px]
                    text-[#7b858f]
                  "
                >
                  {label}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    text-[#333333]
                  "
                >
                  0.00
                </p>

              </div>
            ))}

          </div>


          {/* ==================================================
              NO DATA TABLE AREA
          ================================================== */}

          <div
            className="
              mt-4
              min-h-[210px]
              overflow-hidden
              rounded-xl
              border
              border-[#ded8d5]
              bg-white
              shadow-sm
            "
          >

            {/* TABLE HEADER */}

            <div
              className="
                grid
                grid-cols-4
                border-b
                border-[#e5dfdc]
                bg-[#fff4ef]
                px-3
                py-3
                text-[10px]
                font-medium
                text-[#5d514d]
              "
            >

              <span>
                Sl.No
              </span>

              <span>
                UAN
              </span>

              <span>
                Employee Name
              </span>

              <span>
                Gross Wages
              </span>

            </div>


            {/* EMPTY BODY */}

            <div
              className="
                flex
                min-h-[150px]
                items-center
                justify-center
                text-xs
                text-[#9b9b9b]
              "
            >
              No Arrear Report Data
            </div>

          </div>

        </div>


        {/* ==================================================
            E RETURN CARD
        ================================================== */}

        <div
          className="
            h-fit
            overflow-hidden
            rounded-xl
            border
            border-[#ded8d5]
            bg-white
            shadow-sm
          "
        >

          {/* E RETURN HEADER */}

          <div
            className="
              flex
              h-10
              items-center
              justify-between
              border-b
              border-[#eaded9]
              bg-[#fff4ef]
              px-3
            "
          >

            <span
              className="
                text-sm
                font-medium
                text-[#8b5e52]
              "
            >
              e Return
            </span>


            <button
              type="button"
              className="
                flex
                h-7
                items-center
                justify-center
                rounded-lg
                bg-[#8b5e52]
                px-3
                text-xs
                font-medium
                text-white
              "
            >
              Generate
            </button>

          </div>


          {/* E RETURN BODY */}

          <div className="min-h-[100px] bg-white" />


          {/* SAVE */}

          <div
            className="
              flex
              justify-end
              border-t
              border-[#eee8e5]
              px-3
              py-2
            "
          >

            <button
              type="button"
              className="
                flex
                h-8
                items-center
                justify-center
                gap-1
                rounded-lg
                bg-[#8b5e52]
                px-4
                text-xs
                font-medium
                text-white
              "
            >
              ♧
              Save
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          NO DATA ILLUSTRATION
      ===================================================== */}

      <div
        className="
          flex
          min-h-[300px]
          flex-col
          items-center
          justify-center
          bg-[#f4f8fe]
          pb-8
        "
      >

        <div
          className="
            relative
            h-[190px]
            w-[300px]
          "
        >

          {/* BACKGROUND */}

          <div
            className="
              absolute
              left-[78px]
              top-[25px]
              h-[125px]
              w-[125px]
              rounded-full
              bg-[#fff3ee]
            "
          />


          {/* LEFT DASHED CIRCLE */}

          <div
            className="
              absolute
              left-[30px]
              top-[85px]
              h-[32px]
              w-[48px]
              rotate-[-10deg]
              rounded-full
              border
              border-dashed
              border-[#ddc4ba]
            "
          />


          {/* RIGHT DASHED CIRCLE */}

          <div
            className="
              absolute
              right-[25px]
              top-[105px]
              h-[40px]
              w-[55px]
              rotate-[15deg]
              rounded-full
              border
              border-dashed
              border-[#ddc4ba]
            "
          />


          {/* DOCUMENT */}

          <div
            className="
              absolute
              left-[82px]
              top-[68px]
              h-[95px]
              w-[125px]
              rounded
              bg-white
              shadow-sm
            "
          >

            {/* DOCUMENT TOP */}

            <div
              className="
                flex
                h-[15px]
                items-center
                bg-[#c89584]
                px-2
              "
            >
              <span className="text-[7px] text-white">
                •••
              </span>
            </div>


            {/* DOCUMENT CONTENT */}

            <div
              className="
                flex
                h-[80px]
                flex-col
                items-center
                justify-center
              "
            >

              <div
                className="
                  flex
                  h-[38px]
                  w-[32px]
                  items-center
                  justify-center
                  rounded
                  bg-[#c89584]
                  text-white
                "
              >
                ☹
              </div>

              <span
                className="
                  mt-2
                  text-[7px]
                  font-semibold
                  text-[#555555]
                "
              >
                NO DATA
              </span>

            </div>

          </div>


          {/* PERSON */}

          <div
            className="
              absolute
              bottom-0
              left-[140px]
            "
          >

            <div
              className="
                mx-auto
                h-6
                w-6
                rounded-full
                bg-[#e7a06d]
              "
            />

            <div
              className="
                h-8
                w-10
                rounded-t-[15px]
                bg-[#68463d]
              "
            />

            <div
              className="
                -mt-1
                ml-[-6px]
                h-5
                w-[58px]
                rounded-b-[50%]
                bg-[#51362f]
              "
            />

          </div>

        </div>


        <p
          className="
            mt-1
            text-sm
            font-medium
            text-[#343434]
          "
        >
          Did Not Find Any Pf Report
        </p>

      </div>

    </div>
  );
}