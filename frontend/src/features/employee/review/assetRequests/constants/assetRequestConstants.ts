import type {
  AssetRequestPriority,
  AssetRequestStatus,
} from "../types/assetRequest.types";

export const ASSET_REQUEST_STATUS: AssetRequestStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
];

export const ASSET_REQUEST_PRIORITIES: AssetRequestPriority[] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const ASSET_TYPES = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Headset",
  "Mobile",
  "Tablet",
  "Printer",
  "Other",
];

export const ASSET_REQUEST_PAGE_SIZE = 10;