import noPunchesImage from "../../../../../../assets/images/no punch image.png";

import type {
  RequestStatusProps,
} from "../types/attendanceOverview.types";

export default function RequestStatus({
  onRaiseRequest,
}: RequestStatusProps) {
  return (
    <div className="rounded-xl border border-black bg-white p-5 shadow-sm font-[Urbanist]">
      <h3 className="mb-3 text-sm font-semibold text-slate-700 font-[Urbanist]">
        Request status
      </h3>

      <div className="flex flex-col items-center justify-center py-6 text-center font-[Urbanist]">
        <img
  src={noPunchesImage}
  alt="No Punch Requests"
  className="h-32 w-32 object-contain font-[Urbanist]"
/>

        <div className="mt-4 w-full rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-500 font-[Urbanist]">
          No Punch Requests Found
        </div>

        <button
          type="button"
          onClick={onRaiseRequest}
          className="mt-3 text-xs font-semibold text-sky-700 hover:underline font-[Urbanist]"
        >
          Raise a request
        </button>
      </div>
    </div>
  );
}
