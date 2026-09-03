import { useState, Fragment } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import DropdownSelect from "../../../components/DropdownSelect";
import { BGV_OVERALL_STATUS_OPTIONS, BGV_VERIFICATION_STATUS_LABELS } from "../constants/backgroundverification.constants";
import type { OngoingBgvCandidate, BgvOverallStatus } from "../types/backgroundverification.types";

interface BgvOngoingTableProps {
  candidates: OngoingBgvCandidate[];
  externalVerifier: string;
  onExternalVerifierChange: (value: string) => void;
  activities: string;
  onActivitiesChange: (value: string) => void;
  selectedIds: string[];
  onToggleId: (candidateId: string) => void;
  onSend: () => void;
  onOverallStatusChange: (candidateId: string, status: BgvOverallStatus) => void;
  onSendMail: (candidateId: string, verificationType: string) => void;
  onEditVerification: (candidateId: string, verificationType: string) => void;
  onDeleteVerification: (candidateId: string, verificationType: string) => void;
}

export default function BgvOngoingTable({
  candidates,
  externalVerifier,
  onExternalVerifierChange,
  activities,
  onActivitiesChange,
  selectedIds,
  onToggleId,
  onSend,
  onOverallStatusChange,
  onSendMail,
  onEditVerification,
  onDeleteVerification,
}: BgvOngoingTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:items-end">
        <div>
          <label className="text-sm font-medium">
            External Verifier<span className="text-destructive">*</span>
          </label>
          <DropdownSelect
            options={[{ label: "Select", value: "" }]}
            value={externalVerifier}
            onChange={onExternalVerifierChange}
            menuClassName="w-full"
            className="h-8 w-full mt-1 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium">Activities</label>
            <DropdownSelect
              options={[{ label: "Select", value: "" }]}
              value={activities}
              onChange={onActivitiesChange}
              menuClassName="w-full"
              className="h-8 w-full mt-1 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            />
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-orange-500 text-orange-600 hover:bg-orange-50"
            onClick={onSend}
            disabled={!externalVerifier || selectedIds.length === 0}
          >
            Send
          </Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-muted/60">
            <tr className="text-left">
              <th className="font-semibold px-4 py-3">Candidate</th>
              <th className="font-semibold px-4 py-3">Designation</th>
              <th className="font-semibold px-4 py-3">Email</th>
              <th className="font-semibold px-4 py-3">Overall Status</th>
              <th className="font-semibold px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <Fragment key={candidate.candidateId}>
                <tr className="border-t">
                  <td className="px-4 py-3">{candidate.candidateName}</td>
                  <td className="px-4 py-3">{candidate.designation}</td>
                  <td className="px-4 py-3">{candidate.email}</td>
                  <td className="px-4 py-3">
                    <DropdownSelect
                      options={[{ label: "Select", value: "" }, ...BGV_OVERALL_STATUS_OPTIONS]}
                      value={candidate.overallStatus ?? ""}
                      onChange={(value) => onOverallStatusChange(candidate.candidateId, value as BgvOverallStatus)}
                      menuClassName="w-36"
                      className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setExpandedId((prev) => (prev === candidate.candidateId ? null : candidate.candidateId))}
                        className="text-blue-500"
                      >
                        <Eye size={17} />
                      </button>
                      <Checkbox
                        checked={selectedIds.includes(candidate.candidateId)}
                        onCheckedChange={() => onToggleId(candidate.candidateId)}
                      />
                    </div>
                  </td>
                </tr>
                {expandedId === candidate.candidateId && (
                  <tr>
                    <td colSpan={5} className="p-0">
                      <div className="border-t bg-muted/30 overflow-x-auto">
                        <table className="w-full text-sm min-w-[560px]">
                          <thead>
                            <tr className="text-left">
                              <th className="font-semibold px-4 py-2">Verification Type</th>
                              <th className="font-semibold px-4 py-2">Verification Date</th>
                              <th className="font-semibold px-4 py-2">Status</th>
                              <th className="font-semibold px-4 py-2 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {candidate.verifications.map((verification) => (
                              <tr key={verification.verificationType} className="border-t">
                                <td className="px-4 py-2">{verification.verificationType}</td>
                                <td className="px-4 py-2">{verification.verificationDate}</td>
                                <td className="px-4 py-2">
                                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                    {BGV_VERIFICATION_STATUS_LABELS[verification.status]}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center justify-end gap-3">
                                    {verification.status === "pending" && (
                                      <Button size="sm" variant="outline" onClick={() => onSendMail(candidate.candidateId, verification.verificationType)}>
                                        Send Mail
                                      </Button>
                                    )}
                                    <button type="button" onClick={() => onEditVerification(candidate.candidateId, verification.verificationType)} className="text-muted-foreground">
                                      <Pencil size={15} />
                                    </button>
                                    <button type="button" onClick={() => onDeleteVerification(candidate.candidateId, verification.verificationType)} className="text-destructive">
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No candidates found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}