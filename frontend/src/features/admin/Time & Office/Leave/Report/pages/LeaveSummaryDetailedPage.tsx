import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";

export default function LeaveSummaryDetailedPage() {
  const navigate = useNavigate();
  const [fromMonth, setFromMonth] = useState("Aug/2026");
  const [toMonth, setToMonth] = useState("Sep/2026");
  const [groupBy, setGroupBy] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] p-3 font-[Urbanist]">
      <ReportHeader
        title="Leave Summary Report (Detailed)"
        fromMonth={fromMonth}
        toMonth={toMonth}
        onFromMonthChange={setFromMonth}
        onToMonthChange={setToMonth}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        groupByOptions={["Employee Leave Policy", "Intern Leave Policy"]}
        groupByMultiSelect
        groupByPlaceholder="Group by Leave Policy"
        onBack={() => navigate(-1)}
        onShowFilters={() => setShowFilters(true)}
        onRefresh={() => {
          setSearch("");
          setSelectedFilters({});
        }}
        showSubHeader
        showFilterButton
        showPdfExport
        showExcelExport
        showRefresh
      />

      <ReportFilters
        showFilters={showFilters}
        onHideFilters={() => setShowFilters(false)}
        search={search}
        onSearchChange={setSearch}
        onSearch={() => {}}
        onAddFilter={() => {}}
        filterOptions={[
          { key: "query", label: "Query", options: ["Employee Name", "Employee ID"] },
          { key: "branch", label: "Branch", options: ["All"] },
          { key: "salaryStructure", label: "Salary Structure", options: ["All"] },
          { key: "leave", label: "Leave", options: ["All"] },
          { key: "attendance", label: "Attendance", options: ["All"] },
          { key: "designation", label: "Designation", options: ["All"] },
          { key: "empStatus", label: "Emp Status", options: ["All", "Active", "Inactive"] },
        ]}
        selectedFilters={selectedFilters}
        onFiltersChange={setSelectedFilters}
      />

      <div className="mt-2">
        <ReportTable
          columns={[]}
          rows={[]}
          loading={false}
          emptyMessage="Leave Summary Report (Detailed) data is pending backend integration."
        />
      </div>
    </div>
  );
}
