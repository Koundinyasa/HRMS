import type {
  AssetRequestStatus,
} from "../types/assetRequest.types";

interface Props {
  status: AssetRequestStatus;
}

const statusStyles: Record<
  AssetRequestStatus,
  string
> = {
  Pending:
    "bg-amber-50 text-amber-600 border-amber-200",

  Approved:
    "bg-green-50 text-green-600 border-green-200",

  Rejected:
    "bg-red-50 text-red-600 border-red-200",

  Cancelled:
    "bg-gray-50 text-gray-600 border-gray-200",
};

const AssetRequestStatusBadge = ({
  status,
}: Props) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

export default AssetRequestStatusBadge;