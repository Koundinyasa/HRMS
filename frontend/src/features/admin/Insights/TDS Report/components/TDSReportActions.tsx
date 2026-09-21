import React from "react";

interface TDSReportActionsProps {
  onView?: () => void;
  onDownload?: () => void;
}

export default function TDSReportActions({
  onView,
  onDownload,
}: TDSReportActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {onView && (
        <button
          type="button"
          onClick={onView}
          title="View"
          className="text-[#8b4f40] hover:opacity-80"
        >
          View
        </button>
      )}

      {onDownload && (
        <button
          type="button"
          onClick={onDownload}
          title="Download"
          className="text-[#35a853] hover:opacity-80"
        >
          Download
        </button>
      )}
    </div>
  );
}