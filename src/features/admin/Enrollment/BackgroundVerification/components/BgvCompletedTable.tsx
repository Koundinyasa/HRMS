import { Search, FileSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BgvCandidate } from "../types/backgroundverification.types";

interface BgvCompletedTableProps {
  candidates: BgvCandidate[];
  search: string;
  onSearchChange: (value: string) => void;
}

export default function BgvCompletedTable({ candidates, search, onSearchChange }: BgvCompletedTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
        <Input className="pl-8 focus-visible:border-orange-500 focus-visible:ring-orange-500/50" placeholder="Search..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>

      {candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <FileSearch size={64} strokeWidth={1} />
          <p className="text-sm font-medium text-destructive">No Data Found in - Completed bgv</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead className="bg-muted/60">
              <tr className="text-left">
                <th className="font-semibold px-4 py-3">Candidate</th>
                <th className="font-semibold px-4 py-3">Designation</th>
                <th className="font-semibold px-4 py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.candidateId} className="border-t">
                  <td className="px-4 py-3">{candidate.candidateName}</td>
                  <td className="px-4 py-3">{candidate.designation}</td>
                  <td className="px-4 py-3">{candidate.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}