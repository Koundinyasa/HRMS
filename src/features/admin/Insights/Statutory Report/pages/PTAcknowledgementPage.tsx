import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  UploadCloud,
  IndianRupee,
  Plus,
  UsersRound,
  Shield,
} from "lucide-react";

export default function PTAcknowledgementPage() {
  const navigate = useNavigate();

  /* =====================================================
     TOP REPORT NAVIGATION
  ===================================================== */

  const goToPF = () => {
    navigate("../pf");
  };

  const goToESI = () => {
    navigate("../esi");
  };

  const goToLWF = () => {
    navigate("../lwf");
  };

  const goToPT = () => {
    navigate("../pt");
  };

  /* =====================================================
     BACK
  ===================================================== */

  const handleBack = () => {
    navigate("../pt");
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] p-3 sm:p-4">

      {/* =====================================================
          TOP REPORT NAVIGATION
      ===================================================== */}

      <div
        className="
          w-full
          rounded-xl
          border
          border-[#ddd7d3]
          bg-white
          px-4
          shadow-[0_1px_5px_rgba(0,0,0,0.08)]
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

          {/* PF */}

          <button
            type="button"
            onClick={goToPF}
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
              text-[#4d4d4d]
              transition
              hover:text-[#8b5a4c]
            "
          >
            <Shield size={17} />

            PF Report
          </button>


          {/* ESI */}

          <button
            type="button"
            onClick={goToESI}
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
              text-[#4d4d4d]
              transition
              hover:text-[#8b5a4c]
            "
          >
            <Plus size={17} />

            ESI Report
          </button>


          {/* LWF */}

          <button
            type="button"
            onClick={goToLWF}
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
              text-[#4d4d4d]
              transition
              hover:text-[#8b5a4c]
            "
          >
            <UsersRound size={17} />

            LWF Report
          </button>


          {/* PT ACTIVE */}

          <button
            type="button"
            onClick={goToPT}
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
            <IndianRupee size={17} />

            PT Report
          </button>

        </div>
      </div>


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        className="
          mt-3
          w-full
          rounded-xl
          border
          border-[#ddd7d3]
          bg-white
          px-4
          py-2
          shadow-[0_1px_5px_rgba(0,0,0,0.06)]
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

          {/* TITLE */}

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
            PT Acknowledgement
          </h1>


          {/* RIGHT SIDE */}

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
              onClick={handleBack}
              className="
                flex
                h-12
                items-center
                gap-2
                rounded-lg
                border
                border-[#d1cbc7]
                bg-white
                px-5
                text-[15px]
                font-medium
                text-[#4d4d4d]
                shadow-sm
                transition
                hover:bg-[#fff8f5]
              "
            >
              <ArrowLeft size={19} />

              Back
            </button>


            {/* MONTH */}

            <button
              type="button"
              className="
                flex
                h-12
                min-w-[190px]
                items-center
                justify-between
                rounded-lg
                border
                border-[#ddd7d3]
                bg-[#f4f6fa]
                px-5
                text-[15px]
                font-medium
                text-[#444444]
              "
            >
              <span>
                Sep/2026
              </span>

              <ChevronDown
                size={18}
                className="text-[#777777]"
              />
            </button>


            {/* PT GROUP */}

            <button
              type="button"
              className="
                flex
                h-12
                min-w-[190px]
                items-center
                justify-between
                rounded-lg
                border
                border-[#ddd7d3]
                bg-white
                px-5
                text-[15px]
                font-medium
                text-[#444444]
              "
            >
              <span>
                PT Group
              </span>

              <ChevronDown
                size={18}
                className="text-[#777777]"
              />
            </button>

          </div>

        </div>
      </div>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          mt-3
          grid
          grid-cols-1
          gap-3
          xl:grid-cols-2
        "
      >

        {/* ===================================================
            PAYMENT DETAILS
        =================================================== */}

        <div
          className="
            rounded-xl
            border
            border-[#ddd7d3]
            bg-white
            p-3
            shadow-[0_1px_5px_rgba(0,0,0,0.06)]
          "
        >

          {/* SECTION TITLE */}

          <div className="mb-4 flex items-center gap-3">
            <h2
              className="
                shrink-0
                text-[16px]
                font-semibold
                text-[#222222]
              "
            >
              Payment Details
            </h2>

            <div className="h-px flex-1 bg-[#ddd7d3]" />
          </div>


          {/* PAID AMOUNT */}

          <FormField label="Paid Amount">
            <div className="h-[62px] rounded-lg bg-[#e9edf3]" />
          </FormField>


          {/* MODE OF PAYMENT */}

          <FormField label="Mode of Payment">
            <div
              className="
                flex
                h-[62px]
                items-center
                justify-end
                rounded-lg
                bg-[#e9edf3]
                px-5
              "
            >
              <ChevronDown
                size={18}
                className="text-[#8c9ab0]"
              />
            </div>
          </FormField>


          {/* BANK */}

          <FormField label="Bank">
            <div className="h-[62px] rounded-lg bg-[#e9edf3]" />
          </FormField>


          {/* REFERENCE */}

          <FormField label="Reference No" required>
            <div className="h-[62px] rounded-lg bg-[#e9edf3]" />
          </FormField>


          {/* PAID DATE */}

          <FormField label="Paid Date">
            <div
              className="
                flex
                h-[62px]
                items-center
                justify-between
                rounded-lg
                bg-[#e9edf3]
                px-4
              "
            >
              <span className="text-[14px] text-[#aeb8c8]">
                DD-MM-YYYY
              </span>

              <CalendarDays
                size={18}
                className="text-[#8c9ab0]"
              />
            </div>
          </FormField>


          {/* TRRN */}

          <FormField label="TRRN No.">
            <div className="h-[62px] rounded-lg bg-[#e9edf3]" />
          </FormField>

        </div>


        {/* ===================================================
            ACKNOWLEDGEMENT DETAILS
        =================================================== */}

        <div
          className="
            rounded-xl
            border
            border-[#ddd7d3]
            bg-white
            p-3
            shadow-[0_1px_5px_rgba(0,0,0,0.06)]
          "
        >

          {/* SECTION TITLE */}

          <div className="mb-4 flex items-center gap-3">
            <h2
              className="
                shrink-0
                text-[16px]
                font-semibold
                text-[#222222]
              "
            >
              Acknowledgement Details
            </h2>

            <div className="h-px flex-1 bg-[#ddd7d3]" />
          </div>


          {/* ACK NUMBER */}

          <FormField label="Acknowledgement Number">
            <div
              className="
                h-[62px]
                rounded-lg
                border
                border-[#c6cbd3]
                bg-[#e9edf3]
              "
            />
          </FormField>


          {/* ACK PAID DATE */}

          <FormField label="Ack Paid Date">
            <div
              className="
                flex
                h-[62px]
                items-center
                justify-between
                rounded-lg
                bg-[#e9edf3]
                px-4
              "
            >
              <span className="text-[14px] text-[#aeb8c8]">
                DD-MM-YYYY
              </span>

              <CalendarDays
                size={18}
                className="text-[#8c9ab0]"
              />
            </div>
          </FormField>


          {/* DIVIDER */}

          <div className="my-5 h-px bg-[#ddd7d3]" />


          {/* ATTACHMENT */}

          <div>

            <label
              className="
                mb-3
                block
                text-[15px]
                font-medium
                text-[#444444]
              "
            >
              Attachment
            </label>


            <div
              className="
                flex
                min-h-[280px]
                flex-col
                items-center
                justify-center
                rounded-lg
                border-2
                border-dashed
                border-[#bdb7b3]
                bg-white
                px-4
                text-center
              "
            >

              <UploadCloud
                size={30}
                strokeWidth={1.7}
                className="mb-3 text-[#b6b6b6]"
              />

              <p className="text-[15px] text-[#999999]">
                Drag and drop
              </p>

              <p className="my-1 text-[14px] text-[#999999]">
                - OR -
              </p>

              <button
                type="button"
                className="
                  text-[15px]
                  font-semibold
                  text-[#8b5a4c]
                  hover:underline
                "
              >
                Browse
              </button>

              <p className="mt-3 text-[12px] text-[#aaaaaa]">
                Max. Size 1 MB
              </p>

            </div>

          </div>


          {/* SAVE BUTTON */}

          <div className="mt-5 flex justify-end">

            <button
              type="button"
              className="
                h-11
                rounded-lg
                bg-[#c89584]
                px-7
                text-[14px]
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-[#b98270]
              "
            >
              Save
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   FORM FIELD
========================================================= */

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="mb-4">

      <label
        className="
          mb-2
          block
          text-[15px]
          font-medium
          text-[#333333]
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}

    </div>
  );
}