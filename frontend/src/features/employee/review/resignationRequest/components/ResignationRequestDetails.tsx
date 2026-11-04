import type { ResignationRequest } from "../types/resignationRequest.types";

interface ResignationRequestDetailsProps {
  request: ResignationRequest;
  onClose: () => void;
}

const ResignationRequestDetails = ({
  request,
  onClose,
}: ResignationRequestDetailsProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0b315d]">
            Resignation Request Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">Request ID</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {request.requestId || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Employee Name</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {request.employeeName || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Resignation Date</p>
            <p className="mt-1 text-sm text-slate-700">
              {request.resignationDate || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Last Working Date</p>
            <p className="mt-1 text-sm text-slate-700">
              {request.lastWorkingDate || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Status</p>
            <p className="mt-1 text-sm text-slate-700">
              {request.status || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Submitted Date</p>
            <p className="mt-1 text-sm text-slate-700">
              {request.submittedDate || "-"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs text-slate-400">Reason</p>
            <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              {request.reason || "-"}
            </p>
          </div>

          {request.remarks && (
            <div className="md:col-span-2">
              <p className="text-xs text-slate-400">Remarks</p>
              <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                {request.remarks}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResignationRequestDetails;