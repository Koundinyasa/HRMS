import { Printer } from "lucide-react";

export default function LetterPreview() {
  const printLetter = () => {
    window.print();
  };

  return (
    <div className="mt-6 rounded-xl border border-gray-300 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 print:hidden">
        <h2 className="text-lg font-bold text-black">
          Letter Preview
        </h2>

        <button
          type="button"
          onClick={printLetter}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          <Printer size={16} />
          Print
        </button>
      </div>

      {/* <div className="mx-auto max-w-[850px] p-8 md:p-12"> */}
      <div className="mx-auto w-full max-w-[850px] p-4 sm:p-6 md:p-12">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold">
            Koundinyasa Technology Services Pvt. Ltd.
          </h1>

          <p className="text-sm text-gray-500">
            Human Resources Department
          </p>
        </div>

        {/* <div className="mb-8 flex justify-between text-sm"> */}
        <div className="mb-8 flex flex-col gap-2 text-sm sm:flex-row sm:justify-between">
          <span>Date: ______________</span>
          <span>Employee ID: ______________</span>
        </div>

        <h2 className="mb-8 text-center text-xl font-bold underline">
          TO WHOMSOEVER IT MAY CONCERN
        </h2>

        {/* <div className="space-y-5 text-justify text-base leading-8 text-gray-800"> */}
        <div className="space-y-4 text-justify text-sm leading-7 text-gray-800 sm:space-y-5 sm:text-base sm:leading-8">
          <p>
            This is to certify that Mr./Ms.{" "}
            <strong>Employee Name</strong> was employed with
            Koundinyasa Technology Services Pvt. Ltd. as{" "}
            <strong>Designation</strong> in the{" "}
            <strong>Department</strong> department.
          </p>

          <p>
            The employee worked with the organization from{" "}
            <strong>Joining Date</strong> to{" "}
            <strong>Relieving Date</strong>.
          </p>

          <p>
            We wish the employee success in all future
            professional endeavors.
          </p>
        </div>

        <div className="mt-16">
          <p className="font-semibold">For Koundinyasa Technology</p>

          <div className="mt-12">
            <p className="font-semibold">
              Authorized Signatory
            </p>

            <p className="text-sm text-gray-500">
              Human Resources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}