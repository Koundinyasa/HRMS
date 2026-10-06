import React from "react";
import noDataImage from "@/assets/images/no-data.png";
export default function ReportEmptyState({message="No Data Found - Report"}:{message?:string}){return <div className="flex min-h-[390px] w-full flex-col items-center justify-center bg-white px-4 py-8 font-[Urbanist]"><img src={noDataImage} alt="No data" className="w-[300px] max-w-full object-contain"/><p className="mt-2 text-center text-[14px] font-medium text-[#98A2B3]">{message}</p></div>}
