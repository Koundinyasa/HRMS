// Shared error-extraction helper, same shape as the inline version used in
// the asset feature's hooks (useAssetManagement / useAssetApproval).
export function getBackendMessage(err: unknown): string | undefined {
  if (err && typeof err === "object" && "data" in err) {
    return (err as { data?: { Message?: string } }).data?.Message;
  }
  return undefined;
}
