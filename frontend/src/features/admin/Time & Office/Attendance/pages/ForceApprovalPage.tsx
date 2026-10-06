import { ForceApprovalPanel1 } from "../components/Forceapprovalpanel1";

export default function ForceApprovalPage() {
  // ⚠️ No backend endpoint exists yet for force-approval records
  // (attendanceApi.ts has no matching query/mutation) — rendering the
  // empty state until one is available. Wire up records + onForceApprove
  // once that endpoint exists.
  return <ForceApprovalPanel1 records={[]} onForceApprove={() => {}} />;
}