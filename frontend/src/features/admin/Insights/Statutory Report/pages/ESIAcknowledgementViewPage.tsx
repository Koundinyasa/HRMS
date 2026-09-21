import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  MoreVertical,
  X,
  Clock3,
  FileSpreadsheet,
  Filter,
} from "lucide-react";

const MONTHS = ["Sep/2026", "Aug/2026", "Jul/2026"];

function TopNavigation() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70px] items-center gap-8 overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white px-5 shadow-sm">
      <button
        type="button"
        onClick={() => navigate("../../")}
        className="h-[70px] shrink-0 border-b-2 border-transparent px-1 text-[18px] font-medium text-[#62656d]"
      >
        PF Report
      </button>

      <button
        type="button"
        onClick={() => navigate("../")}
        className="h-[70px] shrink-0 border-b-[3px] border-[#2498df] px-1 text-[18px] font-semibold text-[#2498df]"
      >
        ESI Report
      </button>

      <button
        type="button"
        onClick={() => navigate("../../lwf")}
        className="h-[70px] shrink-0 border-b-2 border-transparent px-1 text-[18px] font-medium text-[#62656d]"
      >
        LWF Report
      </button>

      <button
        type="button"
        onClick={() => navigate("../../pt")}
        className="h-[70px] shrink-0 border-b-2 border-transparent px-1 text-[18px] font-medium text-[#62656d]"
      >
        PT Report
      </button>

      <div className="ml-auto flex items-center gap-5">
        <Filter className="h-6 w-6 text-[#8d99ad]" />
        <Clock3 className="h-6 w-6 text-[#8d99ad]" />
      </div>
    </div>
  );
}

function MonthSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 min-w-[170px] appearance-none rounded-lg border border-[#dfe3ea] bg-[#eef1f7] px-4 pr-10 text-[16px] font-medium text-[#252b3a] outline-none"
      >
        {MONTHS.map((month) => (
          <option key={month}>{month}</option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777d88]" />
    </div>
  );
}

function Filters() {
  const [search, setSearch] = useState("");

  const filters = [
    "Query",
    "Branch",
    "Salary Structure",
    "Leave",
    "Attendance",
    "Designation",
    "Emp Status",
  ];

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      <div className="flex min-h-[58px] flex-wrap items-center gap-4 px-4 py-2">
        <div className="flex min-w-[180px] flex-1 items-center gap-3">
          <Search className="h-5 w-5 text-[#96a0b3]" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Start Typing..."
            className="w-full bg-transparent text-[16px] outline-none placeholder:text-[#d9dbe1]"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-2 whitespace-nowrap text-[16px] font-medium text-[#686b73]"
        >
          <Plus className="h-5 w-5" />
          Add Filter
        </button>

        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="flex items-center gap-2 whitespace-nowrap text-[15px] font-medium text-[#73767d]"
          >
            {filter}
            <ChevronDown className="h-4 w-4" />
          </button>
        ))}

        <button type="button" className="text-[#9aa0ad]">
          <MoreVertical className="h-5 w-5" />
        </button>

        <button type="button" className="text-[#ef4d57]">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center">
      <div className="relative flex h-[230px] w-[300px] items-center justify-center">
        <div className="absolute h-[190px] w-[220px] rounded-full bg-[#f1f4ff]" />

        <div className="relative flex h-[130px] w-[150px] flex-col items-center justify-center rounded-md border-[7px] border-[#aebef5] bg-[#f9faff]">
          <div className="absolute -top-[7px] left-0 right-0 h-5 bg-[#9dadf2]" />

          <div className="mt-3 flex h-14 w-12 items-center justify-center rounded bg-[#a7b8f3]">
            <span className="text-2xl text-white">
              ☹
            </span>
          </div>

          <span className="mt-1 text-[8px] font-bold text-[#414b6a]">
            NO DATA
          </span>
        </div>
      </div>

      <p className="text-[18px] font-medium text-[#18233a]">
        Did Not Find Any Esi Report
      </p>
    </div>
  );
}

export default function ESIAcknowledgementViewPage() {
  const navigate = useNavigate();

  const [fromMonth, setFromMonth] = useState("Sep/2026");
  const [toMonth, setToMonth] = useState("Sep/2026");
  const [group, setGroup] = useState("");

  return (
    <div className="min-h-screen w-full bg-[#f4f6fb] p-3 sm:p-4">
      <TopNavigation />

      <div className="mt-3 rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-5 py-3">
          <h1 className="border-b-[3px] border-[#2498df] pb-3 pt-1 text-[18px] font-semibold text-[#2498df]">
            ESI Acknowledgement View
          </h1>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-12 items-center gap-2 rounded-lg border border-[#aeb2b9] bg-white px-5 text-[16px] font-medium text-[#4d535e]"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-[15px] text-[#252d40]">
                From Month
              </span>

              <MonthSelect
                value={fromMonth}
                onChange={setFromMonth}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-[15px] text-[#252d40]">
                To Month
              </span>

              <MonthSelect
                value={toMonth}
                onChange={setToMonth}
              />
            </div>

            <div className="relative">
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="h-12 min-w-[190px] appearance-none rounded-lg border border-[#dfe3ea] bg-white px-4 pr-10 text-[16px] outline-none"
              >
                <option value="">ESI Group</option>
                <option>ESI Group 1</option>
                <option>ESI Group 2</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>

            <button
              type="button"
              title="Export Excel"
            >
              <FileSpreadsheet className="h-7 w-7 text-[#43a047]" />
            </button>
          </div>
        </div>

        <Filters />
      </div>

      <EmptyState />
    </div>
  );
}