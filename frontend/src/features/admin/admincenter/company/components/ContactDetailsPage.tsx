



import React from "react";
import { Filter } from "lucide-react";
import contactImage from "../../../../../assets/images/contactImage.png";

const tableHeaders = [
  "Document Name",
  "Description",
  "Date",
  "File Extension",
  "Show in SIA",
  "Action",
];

export default function ContactDetailsPage() {
  return (
    <div className="w-full font-['Urbanist'] text-slate-800">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* TABLE HEADER – Desktop */}
        <div className="hidden md:block" style={{ backgroundColor: "#EDE9FE" }}>
          <div className="grid grid-cols-6 items-center px-5 py-3 lg:px-6">
            {tableHeaders.map((header) => (
              <div
                key={header}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700"
              >
                <span className="truncate">{header}</span>
                {header !== "Action" && (
                  <Filter size={13} className="shrink-0 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TABLE HEADER – Mobile */}
        <div className="px-4 py-3 md:hidden" style={{ backgroundColor: "#EDE9FE" }}>
          <p className="text-sm font-semibold text-slate-700">Contact Details</p>
        </div>

        {/* EMPTY STATE */}
        <div className="flex min-h-[380px] flex-col items-center justify-center px-4 py-12 sm:min-h-[440px]">
          <img
            src={contactImage}
            alt="No Contact Details"
            className="mb-6 w-52 sm:mb-7 sm:w-64 md:w-72"
          />
          <p className="text-center text-base text-gray-600">
            Did Not Find Any Contact Details
          </p>
          <div className="mt-5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 shadow-sm">
            No Record Found
          </div>
        </div>
      </div>
    </div>
  );
}


