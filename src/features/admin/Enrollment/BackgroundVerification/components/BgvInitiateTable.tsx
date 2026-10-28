import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { BGV_INITIATE_FILTER_FIELDS } from "../constants/backgroundverification.constants";
import type { BgvCandidate, BgvInitiateFilters } from "../types/backgroundverification.types";

interface BgvInitiateTableProps {
  candidates: BgvCandidate[];
  filters: BgvInitiateFilters;
  onFiltersChange: (filters: BgvInitiateFilters) => void;
  selectedIds: string[];
  onToggleId: (candidateId: string) => void;
  onInitiate: () => void;
  isInitiating?: boolean;
}

export default function BgvInitiateTable({
  candidates,
  filters,
  onFiltersChange,
  selectedIds,
  onToggleId,
  onInitiate,
  isInitiating,
}: BgvInitiateTableProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={onInitiate}
          disabled={selectedIds.length === 0 || isInitiating}
        >
          Initiate BGV
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
          <Input
            className="pl-8 focus-visible:border-orange-500 focus-visible:ring-orange-500/50"
            placeholder="Start Typing..."
            value={filters.search ?? ""}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          />
        </div>
        {BGV_INITIATE_FILTER_FIELDS.map((field) => (
          <Button
            key={field.value}
            variant="outline"
            size="sm"
            className={
              activeFilter === field.value
                ? "border-orange-500 text-orange-600 bg-orange-50"
                : undefined
            }
            onClick={() => setActiveFilter((prev) => (prev === field.value ? null : field.value))}
          >
            {field.label}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="bg-muted/60">
            <tr className="text-left">
              <th className="font-semibold px-4 py-3">Candidate</th>
              <th className="font-semibold px-4 py-3">Designation</th>
              <th className="font-semibold px-4 py-3">Email</th>
              <th className="font-semibold px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.candidateId} className="border-t">
                <td className="px-4 py-3">{candidate.candidateName}</td>
                <td className="px-4 py-3">{candidate.designation}</td>
                <td className="px-4 py-3">{candidate.email}</td>
                <td className="px-4 py-3 flex justify-end">
                  <Checkbox
                    checked={selectedIds.includes(candidate.candidateId)}
                    onCheckedChange={() => onToggleId(candidate.candidateId)}
                  />
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  No candidates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}