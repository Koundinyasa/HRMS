import { Plus, Search } from "lucide-react";

interface RecruitmentHeaderProps {
  pageTitle: string;
  search: string;
  setSearch: (search: string) => void;
  showActions?: boolean;
  onNewOpening: () => void;
}

export function RecruitmentHeader({
  pageTitle,
  search,
  setSearch,
  showActions = true,
  onNewOpening,
}: RecruitmentHeaderProps) {
  return (
    <div className="border-b border-[#dfe6e1] bg-white px-5 pt-5 sm:px-8 sm:pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#6f8178]">
            Talent Hub
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[30px]">
            {pageTitle}
          </h1>
        </div>
        {showActions && (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <label className="relative block min-w-0 sm:w-[290px]">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74837b]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search candidates or roles"
                aria-label="Search candidates or roles"
                className="h-11 w-full rounded-xl border border-[#dce4de] bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#537b65] focus:ring-2 focus:ring-[#537b65]/15"
              />
            </label>
            <button
              type="button"
              onClick={onNewOpening}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#e5a538] px-5 text-sm font-semibold text-[#342712] transition hover:bg-[#d99a2b] focus:outline-none focus:ring-2 focus:ring-[#e5a538]/40"
            >
              <Plus className="h-4 w-4" />
              New job opening
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
