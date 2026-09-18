



export default function OnboardConfirmationLetterPage() {
  const navigate = useNavigate();

  const { docType, domain } = useParams<{
    docType?: string;
    domain?: string;
  }>();

  const {
    employees,
    filters,
    updateFilter,
    resetFilters,
  } = useOnboard();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fixed confirmation-letter route does not provide :docType
  const resolvedDocType = docType ?? "confirmation-letter";

  const documentTitle =
    ONBOARD_DOCUMENTS.find(
      (document) => document.value === resolvedDocType,
    )?.label ?? "Confirmation Letter";

  const baseInsightsPath = domain
    ? `/${domain}/admin/insights`
    : "/insights";

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.search,
    filters.branch,
    filters.designation,
    filters.employeeStatus,
  ]);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return employees.slice(start, start + rowsPerPage);
  }, [employees, currentPage, rowsPerPage]);

  const handleSearchChange = (value: string) => {
    updateFilter("search", value);
  };

  const handleFilterChange = (
    key: "search" | "branch" | "designation" | "employeeStatus",
    value: string,
  ) => {
    updateFilter(key, value);
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleBack = () => {
    navigate(`${baseInsightsPath}/onboard`);
  };

  const handleViewEmployee = (employee: OnboardEmployee) => {
    // Relative path works when already on confirmation-letter list
    if (resolvedDocType === "confirmation-letter") {
      navigate(`${employee.employeeId}`);
      return;
    }

    navigate(
      `${baseInsightsPath}/onboard/document/confirmation-letter/${employee.employeeId}`,
    );
  };

  return (
    <div className="min-h-[calc(100vh-82px)] bg-[#f5f7fb] p-2 sm:p-3">
      <div className="min-h-[calc(100vh-100px)] overflow-hidden rounded-md border border-slate-200 bg-[#f8f9fc]">
        <OnboardHeader title={documentTitle} onBack={handleBack} />

        <OnboardFilters
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        <OnboardTable
          employees={paginatedEmployees}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onView={handleViewEmployee}
        />

        <OnboardPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          total={employees.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
}