export interface AssetRequestInput {
  assetId: number | null;
  reason: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateAssetRequest(input: AssetRequestInput): ValidationResult {
  if (!input.assetId) return { valid: false, error: "Please select an asset type." };
  if (!input.reason.trim()) return { valid: false, error: "Please provide a reason for this request." };
  return { valid: true };
}
