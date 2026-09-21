import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ChevronDown,
  Filter,
  MoreVertical,
  Search,
  X,
  FileDown,
  Save,
  SlidersHorizontal,
} from "lucide-react";

export default function PTYearlyStatutoryReportPage() {
  const navigate = useNavigate();

  const [stateOpen, setStateOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);

  const [selectedState, setSelectedState] =
    useState("Select PT state");

  const [selectedGroup, setSelectedGroup] =
    useState("Select PT Group");

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const handleBack = () => {
    navigate("../pt");
  };

  const handlePFReport = () => {
    navigate("../pf");
  };

  const handleESIReport = () => {
    navigate("../esi");
  };

  const handleLWFReport = () => {
    navigate("../lwf");
  };

  const handlePTReport = () => {
    navigate("../pt");
  };

  /* ==========================================================
     CLEAR STATE
  ========================================================== */

  const clearState = () => {
    setSelectedState("Select PT state");
    setStateOpen(false);
  };

  /* ==========================================================
     CLEAR GROUP
  ========================================================== */

  const clearGroup = () => {
    setSelectedGroup("Select PT Group");
    setGroupOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb]">

      {/* =====================================================
          REPORT TABS
      ===================================================== */}

      <div className="px-4 pt-4 sm:px-5">
        <div
          className="
            flex
            min-h-[58px]
            w-full
            items-center
            gap-3
            overflow-x-auto
            rounded-xl
            border-2
            border-[#ddb6a8]
            bg-[#fffaf8]
            px-3
            py-2
          "
        >

          {/* PF REPORT */}

          <button
            type="button"
            onClick={handlePFReport}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ddb3a3]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
              hover:bg-[#fff8f5]
            "
          >
            <span className="text-[15px]">
              ♧
            </span>

            <span>
              PF Report
            </span>
          </button>


          {/* ESI REPORT */}

          <button
            type="button"
            onClick={handleESIReport}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ded9d6]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
              hover:bg-[#fff8f5]
            "
          >
            <span className="text-[18px]">
              +
            </span>

            <span>
              ESI Report
            </span>
          </button>


          {/* LWF REPORT */}

          <button
            type="button"
            onClick={handleLWFReport}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ded9d6]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
              hover:bg-[#fff8f5]
            "
          >
            <span className="text-[16px]">
              ♧
            </span>

            <span>
              LWF Report
            </span>
          </button>


          {/* PT REPORT - ACTIVE */}

          <button
            type="button"
            onClick={handlePTReport}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#c98f7c]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
            "
          >
            <span className="text-[16px]">
              ₹
            </span>

            <span>
              PT Report
            </span>
          </button>


          {/* RIGHT FILTER */}

          <div className="ml-auto flex shrink-0 items-center px-2">
            <Filter
              size={21}
              strokeWidth={1.8}
              className="text-[#8e8b89]"
            />
          </div>

        </div>
      </div>


      {/* =====================================================
          YEARLY REPORT HEADER
      ===================================================== */}

      <div className="px-4 pt-3 sm:px-5">

        <div
          className="
            flex
            min-h-[66px]
            w-full
            flex-wrap
            items-center
            gap-2
            rounded-xl
            border
            border-[#d9dde2]
            bg-white
            px-4
            shadow-sm
          "
        >

          {/* TITLE */}

          <div className="mr-auto">

            <div
              className="
                border-b-[3px]
                border-[#9a5a46]
                pb-[9px]
                pt-[5px]
              "
            >

              <h1
                className="
                  whitespace-nowrap
                  text-[17px]
                  font-semibold
                  text-[#8b4d3b]
                "
              >
                PT Yearly Statutory Report
              </h1>

            </div>

          </div>


          {/* BACK */}

          <button
            type="button"
            onClick={handleBack}
            className="
              flex
              h-[42px]
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-[#d5d1ce]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#625d59]
              shadow-sm
            "
          >

            <ArrowLeft
              size={19}
              strokeWidth={1.8}
            />

            <span>
              Back
            </span>

          </button>


          {/* FINANCIAL YEAR */}

          <div
            className="
              flex
              h-[42px]
              w-[185px]
              shrink-0
              items-center
              justify-between
              rounded-lg
              border
              border-[#dedbd8]
              bg-[#f5f6f9]
              px-3
              text-[14px]
              text-[#514f4d]
            "
          >

            <span>
              2026-2027
            </span>

            <ChevronDown
              size={15}
              className="text-[#77716d]"
            />

          </div>


          {/* PT STATE */}

          <div className="relative w-[185px] shrink-0">

            <button
              type="button"
              onClick={() => {
                setStateOpen((value) => !value);
                setGroupOpen(false);
              }}
              className="
                flex
                h-[42px]
                w-full
                items-center
                justify-between
                rounded-lg
                border
                border-[#dedbd8]
                bg-[#f5f6f9]
                px-3
                text-left
                text-[14px]
                text-[#514f4d]
              "
            >

              <span>
                {selectedState}
              </span>

              <ChevronDown
                size={15}
                className={`
                  text-[#77716d]
                  transition-transform
                  ${stateOpen ? "rotate-180" : ""}
                `}
              />

            </button>


            {stateOpen && (
              <div
                className="
                  absolute
                  left-0
                  top-[46px]
                  z-50
                  w-full
                  rounded-lg
                  border
                  border-[#e1ddd9]
                  bg-white
                  p-2
                  shadow-lg
                "
              >

                <button
                  type="button"
                  onClick={clearState}
                  className="
                    flex
                    h-[48px]
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    border
                    border-[#e3dfdc]
                    bg-white
                    px-4
                    text-[14px]
                    font-medium
                    text-[#625e5a]
                    hover:bg-[#faf7f5]
                  "
                >

                  <SlidersHorizontal
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>
                    Clear
                  </span>

                </button>

              </div>
            )}

          </div>


          {/* PT GROUP */}

          <div className="relative w-[185px] shrink-0">

            <button
              type="button"
              onClick={() => {
                setGroupOpen((value) => !value);
                setStateOpen(false);
              }}
              className="
                flex
                h-[42px]
                w-full
                items-center
                justify-between
                rounded-lg
                border
                border-[#dedbd8]
                bg-[#f5f6f9]
                px-3
                text-left
                text-[14px]
                text-[#514f4d]
              "
            >

              <span>
                {selectedGroup}
              </span>

              <ChevronDown
                size={15}
                className={`
                  text-[#77716d]
                  transition-transform
                  ${groupOpen ? "rotate-180" : ""}
                `}
              />

            </button>


            {groupOpen && (
              <div
                className="
                  absolute
                  left-0
                  top-[46px]
                  z-50
                  w-full
                  rounded-lg
                  border
                  border-[#e1ddd9]
                  bg-white
                  p-2
                  shadow-lg
                "
              >

                <button
                  type="button"
                  onClick={clearGroup}
                  className="
                    flex
                    h-[48px]
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    border
                    border-[#e3dfdc]
                    bg-white
                    px-4
                    text-[14px]
                    font-medium
                    text-[#625e5a]
                    hover:bg-[#faf7f5]
                  "
                >

                  <SlidersHorizontal
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>
                    Clear
                  </span>

                </button>

              </div>
            )}

          </div>


          {/* PDF */}

          <button
            type="button"
            className="
              flex
              h-[42px]
              w-[38px]
              shrink-0
              items-center
              justify-center
              text-[#d43f3f]
            "
          >

            <FileDown
              size={21}
              strokeWidth={1.8}
            />

          </button>

        </div>

      </div>


      {/* =====================================================
          FILTER ROW
      ===================================================== */}

      <div className="px-4 pt-2 sm:px-5">

        <div
          className="
            flex
            min-h-[54px]
            w-full
            flex-wrap
            items-center
            gap-5
            rounded-xl
            border
            border-[#d9dde2]
            bg-white
            px-4
            shadow-sm
          "
        >

          {/* SEARCH */}

          <div
            className="
              flex
              min-w-[180px]
              flex-1
              items-center
              gap-2
            "
          >

            <Search
              size={20}
              strokeWidth={1.8}
              className="text-[#9a9a9a]"
            />

            <span
              className="
                text-[14px]
                text-[#b4b1ae]
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
              text-[14px]
              font-medium
              text-[#625e5a]
            "
          >

            <span className="text-[21px]">
              +
            </span>

            <span>
              Add Filter
            </span>

          </button>


          <StaticFilter label="Query" />

          <StaticFilter label="Branch" />

          <StaticFilter label="Salary Structure" />

          <StaticFilter label="Leave" />

          <StaticFilter label="Attendance" />

          <StaticFilter label="Designation" />

          <StaticFilter label="Emp Status" />


          {/* MORE */}

          <button
            type="button"
            className="
              flex
              h-[32px]
              w-[25px]
              shrink-0
              items-center
              justify-center
              text-[#8d8884]
            "
          >
            <MoreVertical size={19} />
          </button>


          {/* CLOSE */}

          <button
            type="button"
            className="
              flex
              h-[32px]
              w-[25px]
              shrink-0
              items-center
              justify-center
              text-[#d14b43]
            "
          >
            <X size={20} />
          </button>

        </div>

      </div>


      {/* =====================================================
          AUTO FILL / SAVE
      ===================================================== */}

      <div className="px-4 pt-2 sm:px-5">

        <div
          className="
            flex
            min-h-[72px]
            w-full
            items-center
            justify-end
            gap-3
            rounded-xl
            border
            border-[#e0e3e7]
            bg-white
            px-4
            shadow-sm
          "
        >

          {/* AUTO FILL */}

          <button
            type="button"
            className="
              flex
              h-[48px]
              items-center
              justify-center
              rounded-lg
              bg-[#2097df]
              px-5
              text-[15px]
              font-semibold
              text-white
              shadow-sm
            "
          >
            Auto-Fill
          </button>


          {/* SAVE */}

          <button
            type="button"
            className="
              flex
              h-[48px]
              items-center
              gap-2
              rounded-lg
              bg-[#e3e5e8]
              px-5
              text-[15px]
              font-medium
              text-[#a4a7ab]
            "
          >

            <Save size={17} />

            <span>
              Save
            </span>

          </button>

        </div>

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      <div
        className="
          flex
          min-h-[500px]
          w-full
          items-center
          justify-center
          px-4
          sm:px-5
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            pb-16
            text-center
          "
        >

          {/* ILLUSTRATION */}

          <div
            className="
              relative
              mb-4
              h-[180px]
              w-[310px]
            "
          >

            {/* LEFT CIRCLE */}

            <div
              className="
                absolute
                left-[30px]
                top-[35px]
                h-[36px]
                w-[36px]
                rounded-full
                border
                border-[#dfe5ee]
              "
            />


            {/* RIGHT CIRCLE */}

            <div
              className="
                absolute
                right-[35px]
                top-[58px]
                h-[29px]
                w-[29px]
                rounded-full
                border
                border-[#dfe5ee]
              "
            />


            {/* BOTTOM CIRCLE */}

            <div
              className="
                absolute
                bottom-[20px]
                left-[75px]
                h-[25px]
                w-[25px]
                rounded-full
                border
                border-[#dfe5ee]
              "
            />


            {/* DOCUMENT */}

            <div
              className="
                absolute
                left-1/2
                top-[38px]
                h-[105px]
                w-[145px]
                -translate-x-1/2
                rounded-md
                border
                border-[#d9dfea]
                bg-white
                shadow-sm
              "
            >

              <div
                className="
                  h-[12px]
                  rounded-t-md
                  bg-[#b4b7ef]
                "
              />

              <div
                className="
                  flex
                  flex-col
                  items-center
                  pt-4
                "
              >

                <div
                  className="
                    flex
                    h-[45px]
                    w-[38px]
                    items-center
                    justify-center
                    rounded-md
                    bg-[#c7caf3]
                  "
                >

                  <div
                    className="
                      h-[22px]
                      w-[18px]
                      rounded-md
                      border-2
                      border-[#7f83cf]
                    "
                  />

                </div>


                <div
                  className="
                    mt-2
                    h-[6px]
                    w-[58px]
                    rounded-full
                    bg-[#dfe2ee]
                  "
                />

              </div>

            </div>


            {/* PERSON */}

            <div
              className="
                absolute
                bottom-[37px]
                right-[62px]
                h-[24px]
                w-[24px]
                rounded-full
                bg-[#e8b66e]
              "
            />


            <div
              className="
                absolute
                bottom-[15px]
                right-[47px]
                h-[29px]
                w-[53px]
                rounded-t-[28px]
                bg-[#24377d]
              "
            />

          </div>


          {/* MESSAGE */}

          <h2
            className="
              text-[17px]
              font-medium
              text-[#4c4d50]
            "
          >
            Did Not Find Any PT Report
          </h2>

        </div>

      </div>

    </div>
  );
}


/* ==========================================================
   FILTER COMPONENT
========================================================== */

interface StaticFilterProps {
  label: string;
}

function StaticFilter({
  label,
}: StaticFilterProps) {
  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-1
        text-[14px]
        font-medium
        text-[#625e5a]
      "
    >

      <span>
        {label}
      </span>

      <ChevronDown
        size={14}
        className="text-[#77716d]"
      />

    </div>
  );
}