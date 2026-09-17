




// common/EmptyState.tsx
import { useState } from "react";
import noDataImage from "../../../../../../assets/images/no-data.png";

interface EmptyStateProps {
  message?: string;
  variant?: "illustration" | "simple";
}

export default function EmptyState({
  message = "No records found",
  variant = "illustration",
}: EmptyStateProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (variant === "simple" || imageFailed) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm text-center px-4">
        {message}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 gap-4 px-4">
      <img
        src={noDataImage}
        alt="No data"
        className="w-40 sm:w-56 h-auto"
        onError={() => setImageFailed(true)}
      />
      <p className="text-sm text-red-400 font-medium text-center">{message}</p>
    </div>
  );
}