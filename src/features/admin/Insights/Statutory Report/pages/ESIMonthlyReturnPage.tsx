import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  MoreVertical,
  X,
  Filter,
  Clock3,
  Info,
  FileSpreadsheet,
  Bookmark,
} from "lucide-react";

type EmployeeRow = {
  ipNumber: string;
  ipName: string;
  days: string;
  monthlyWages: string;
  reasonCode: string;
  lastWorkingDate: string;
};

const MONTHS = ["Sep/2026", "Aug/2026", "Jul/2026"];

const INITIAL_ROWS: EmployeeRow[] = [
  {
    ipNumber: "5218055079",
    ipName: "Madhukar Deshetti",
    days: "30.00",
    monthlyWages: "0.00",
    reasonCode: "Without Reason",
    lastWorkingDate: "",
  },
  {
    ipNumber: "5220104891",
    ipName: "Anil Kumar Gunti",
    days: "30.00",
    monthlyWages: "0.00",
    reasonCode: "Without Reason",
    lastWorkingDate: "",
  },
];

const inputClass =
  "h-12 rounded-lg border border-[#dfe3ea] bg-white px-4 text-[15px] text-[#252b3a] outline-none focus:border-[#2498df]";

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

      <div className="ml-auto flex shrink-0 items-center gap-5">
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
        className={`${inputClass} min-w-[180px] appearance-none bg-[#eef1f7] pr-10`}
      >
        {MONTHS.map((month) => (
          <option key={month}>{month}</option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777b84]" />
    </div>
  );
}

function EsiGroupSelect() {
  return (
    <div className="relative">
      <select
        defaultValue=""
        className={`${inputClass} min-w-[200px] appearance-none pr-10`}
      >
        <option value="" disabled>
          Select ESI Group
        </option>
        <option value="group1">ESI Group 1</option>
        <option value="group2">ESI Group 2</option>
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777b84]" />
    </div>
  );
}

function FilterBar() {
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
          <Search className="h-5 w-5 shrink-0 text-[#96a0b3]" />

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

        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className="flex items-center gap-2 whitespace-nowrap text-[15px] font-medium text-[#73767d]"
          >
            {item}
            <ChevronDown className="h-4 w-4" />
          </button>
        ))}

        <button type="button" className="p-1 text-[#9399aa]">
          <MoreVertical className="h-5 w-5" />
        </button>

        <button type="button" className="p-1 text-[#ef4d57]">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-[70px] flex-wrap items-center justify-end gap-5 border-t border-[#edf0f4] px-4">
        <label className="flex cursor-pointer items-center gap-3 text-[15px] text-[#252b3a]">
          <input
            type="checkbox"
            defaultChecked
            className="h-5 w-5 accent-[#2498df]"
          />
          Calendar Based
        </label>

        <Info className="h-6 w-6 text-[#b1b5bd]" />

        <button type="button" title="Export Excel">
          <FileSpreadsheet className="h-7 w-7 text-[#43a047]" />
        </button>

        <button
          type="button"
          className="flex h-12 items-center gap-2 rounded-lg bg-[#2498df] px-6 text-[16px] font-semibold text-white"
        >
          <Bookmark className="h-5 w-5" />
          Save
        </button>
      </div>
    </div>
  );
}

function ReasonSelect({
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
        className="h-12 w-[185px] appearance-none rounded-lg border border-[#e1e4e9] bg-white px-4 pr-9 text-[15px] text-[#252b3a] outline-none"
      >
        <option>Without Reason</option>
        <option>Retirement</option>
        <option>Resignation</option>
        <option>Termination</option>
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />
    </div>
  );
}

export default function ESIMonthlyReturnPage() {
  const navigate = useNavigate();

  const [month, setMonth] = useState("Sep/2026");
  const [rows, setRows] = useState<EmployeeRow[]>(INITIAL_ROWS);

  const updateReason = (index: number, value: string) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, reasonCode: value }
          : row,
      ),
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f6fb] p-3 sm:p-4">
      <TopNavigation />

      <div className="mt-3 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#e5e7eb] px-5 py-3">
          <h1 className="border-b-[3px] border-[#2498df] pb-3 pt-1 text-[18px] font-semibold text-[#2498df]">
            ESI Monthly Return Report
          </h1>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-12 items-center gap-2 rounded-lg border border-[#c8cbd1] bg-white px-5 text-[16px] font-medium text-[#555963]"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            <MonthSelect
              value={month}
              onChange={setMonth}
            />

            <EsiGroupSelect />
          </div>
        </div>

        <FilterBar />
      </div>

      <div className="mt-3 overflow-x-auto">
        <div className="min-w-[1100px]">
          <div className="grid grid-cols-[1.05fr_1.8fr_0.9fr_1.25fr_1.65fr_1.1fr] items-center rounded-t-lg bg-[#d8ebf8] px-4 py-5 text-[16px] font-semibold text-[#18233a]">
            <div>IP Number</div>
            <div>IP Name</div>
            <div>Days</div>
            <div>Monthly Wages</div>
            <div>Reason Code</div>
            <div>Last Working Date</div>
          </div>

          {rows.map((row, index) => (
            <div
              key={row.ipNumber}
              className="mt-3 grid min-h-[85px] grid-cols-[1.05fr_1.8fr_0.9fr_1.25fr_1.65fr_1.1fr] items-center rounded-lg bg-white px-4 py-3 shadow-sm"
            >
              <div className="text-[15px] text-[#15213a]">
                {row.ipNumber}
              </div>

              <div className="text-[15px] font-medium text-[#15213a]">
                {row.ipName}
              </div>

              <div className="text-[15px] text-[#15213a]">
                {row.days}
              </div>

              <div className="text-[15px] text-[#15213a]">
                {row.monthlyWages}
              </div>

              <ReasonSelect
                value={row.reasonCode}
                onChange={(value) =>
                  updateReason(index, value)
                }
              />

              <div className="text-[15px] text-[#15213a]">
                {row.lastWorkingDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-7 px-3 pb-4 text-[15px] text-[#333b4b]">
        <div className="flex items-center gap-2">
          Rows per page

          <select
            defaultValue="10"
            className="bg-transparent outline-none"
          >
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>

          <ChevronDown className="h-4 w-4" />
        </div>

        <span>1 to 2 of 2</span>

        <button type="button" className="text-[#a9adb5]">
          ‹
        </button>

        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef0f4]">
          1
        </span>

        <button type="button" className="text-[#a9adb5]">
          ›
        </button>
      </div>
    </div>
  );
}