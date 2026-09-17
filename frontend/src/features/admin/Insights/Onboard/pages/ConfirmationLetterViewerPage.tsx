
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  FileText,
  Menu,
  Printer,
  RefreshCw,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  X,
  Check,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useOnboard } from "../hooks/useOnboard";

export default function ConfirmationLetterViewerPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    employeeId,
    domain: domainParam,
  } = useParams<{
    employeeId: string;
    domain?: string;
  }>();

  /* ============================================================
     DOMAIN
  ============================================================ */

  const domain =
    domainParam ||
    location.pathname
      .split("/")
      .filter(Boolean)[0] ||
    "";

  const baseInsightsPath = domain
    ? `/${domain}/admin/insights`
    : "/insights";

  /* ============================================================
     EMPLOYEE DATA
  ============================================================ */

  const {
    employees,
  } = useOnboard();

  const employee =
    employees.find(
      (item) =>
        item.employeeId === employeeId,
    );

  /* ============================================================
     VIEWER STATES
  ============================================================ */

  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  const [
    isSearchOpen,
    setIsSearchOpen,
  ] = useState(false);

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    zoom,
    setZoom,
  ] = useState(100);

  const [
    isFullscreen,
    setIsFullscreen,
  ] = useState(false);

  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  const menuRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const viewerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  /* ============================================================
     CLOSE MENU WHEN CLICKING OUTSIDE
  ============================================================ */

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  /* ============================================================
     ESCAPE FULLSCREEN / MENU
  ============================================================ */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape"
      ) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  /* ============================================================
     BACK
  ============================================================ */

  const handleBack = () => {
    if (!domain) {
      navigate(-1);
      return;
    }

    navigate(
      `${baseInsightsPath}/onboard/document/confirmation-letter`,
    );
  };

  /* ============================================================
     REFRESH
  ============================================================ */

  const handleRefresh = () => {
    setRefreshKey(
      (previous) =>
        previous + 1,
    );

    setZoom(100);
    setSearchText("");
    setIsSearchOpen(false);
  };

  /* ============================================================
     ZOOM OUT
  ============================================================ */

  const handleZoomOut = () => {
    setZoom(
      (previous) =>
        Math.max(
          50,
          previous - 10,
        ),
    );
  };

  /* ============================================================
     ZOOM IN
  ============================================================ */

  const handleZoomIn = () => {
    setZoom(
      (previous) =>
        Math.min(
          200,
          previous + 10,
        ),
    );
  };

  /* ============================================================
     COPY DOCUMENT TEXT
  ============================================================ */

  const handleCopy = async () => {
    if (!employee) {
      return;
    }

    const text = `
Confirmation Letter

To,
${employee.employeeName}
ASSOCIATE SOFTWARE ENGINEER
Koundinyasa Technology Services Pvt. Ltd.

Subject: Confirmation Letter

Dear ${employee.employeeName},

We are pleased to inform you that your performance during the probationary period has been reviewed, and we are delighted to confirm your employment with KOUNDINYASA TECHNOLOGY SERVICES PVT. LTD. as ASSOCIATE SOFTWARE ENGINEER.

Your employment terms and conditions remain the same as mentioned in your offer letter.

As a confirmed employee, you will continue to be bound by the company's policies, procedures, and code of conduct.

We take this opportunity to thank you for your contributions during the probationary period and look forward to your continued commitment and performance in achieving KOUNDINYASA TECHNOLOGY SERVICES PVT. LTD.'s goals.

Should you have any questions or require clarification, please feel free to contact the HR team.

Once again, congratulations on your confirmation. We look forward to your success and growth with us!

Warm Regards,

RAJESH UBBAPALLY
HR RECRUITER
Koundinyasa Technology Services Pvt. Ltd.
    `.trim();

    try {
      await navigator.clipboard.writeText(
        text,
      );

      alert(
        "Confirmation letter copied successfully.",
      );
    } catch {
      alert(
        "Unable to copy the confirmation letter.",
      );
    }
  };

  /* ============================================================
     PRINT
  ============================================================ */

  const handlePrint = () => {
    window.print();
  };

  /* ============================================================
     FULLSCREEN
  ============================================================ */

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await viewerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(false);
    }
  };

  /* ============================================================
     FULLSCREEN CHANGE
  ============================================================ */

  useEffect(() => {
    const handleFullscreenChange =
      () => {
        setIsFullscreen(
          Boolean(
            document.fullscreenElement,
          ),
        );
      };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  /* ============================================================
     SEARCH
  ============================================================ */

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(
      event.target.value,
    );
  };

  /* ============================================================
     IF EMPLOYEE NOT FOUND
  ============================================================ */

  if (!employee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef2f1] p-6">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">

          <FileText
            size={40}
            className="mx-auto mb-4 text-slate-300"
          />

          <h1 className="text-lg font-semibold text-slate-800">
            Confirmation Letter Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The requested employee could not be found.
          </p>

          <button
            type="button"
            onClick={handleBack}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#246278] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d5062]"
          >
            <ArrowLeft size={15} />

            Back to Confirmation Letters
          </button>

        </div>
      </div>
    );
  }

  return (
    <div
      ref={viewerRef}
      key={refreshKey}
      className="min-h-screen bg-[#eef2f1]"
    >

      {/* ========================================================
          TOP HEADER
      ======================================================== */}

      <div className="border-b border-slate-200 bg-white px-3 py-3 sm:px-6 print:hidden">

        <div className="w-fit border-b-2 border-[#4A90E2] pb-2">

          <span className="text-sm font-medium text-[#4A90E2]">
            Onboard Report
          </span>

        </div>

      </div>

      {/* ========================================================
          DOCUMENT HEADER
      ======================================================== */}

      <div className="border-b border-slate-200 bg-white px-3 py-2 sm:px-6 print:hidden">

        <div className="flex items-center justify-between gap-3">

          <div className="border-b-2 border-[#4A90E2] pb-2">

            <span className="text-sm font-medium text-[#4A90E2]">
              Confirmation Letter
            </span>

          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handleBack}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft
                size={14}
              />

              Back
            </button>

            <button
              type="button"
              className="hidden h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-500 sm:flex"
            >
              Confirmation Letter

              <ChevronDown
                size={13}
              />
            </button>

          </div>

        </div>

      </div>

      {/* ========================================================
          VIEWER
      ======================================================== */}

      <div className="flex h-[calc(100vh-116px)] overflow-hidden">

        {/* ======================================================
            LEFT TOOLBAR
        ====================================================== */}

        <aside className="relative hidden w-[52px] shrink-0 flex-col items-center bg-[#246278] text-white md:flex">

          {/* ====================================================
              THREE LINE MENU
          ==================================================== */}

          <div
            ref={menuRef}
            className="relative w-full"
          >

            <button
              type="button"
              title="Open menu"
              onClick={() =>
                setIsMenuOpen(
                  (previous) =>
                    !previous,
                )
              }
              className={[
                "flex h-[52px] w-full items-center justify-center border-b border-white/10 transition",
                isMenuOpen
                  ? "bg-[#1d5665]"
                  : "hover:bg-[#1d5665]",
              ].join(" ")}
            >
              {isMenuOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>

            {/* ================================================
                MENU DROPDOWN
            ================================================= */}

            {isMenuOpen && (
              <div className="absolute left-[52px] top-0 z-[999] w-[270px] rounded-md border border-slate-200 bg-white text-slate-700 shadow-2xl">

                <div className="border-b border-slate-200 px-4 py-3">

                  <div className="text-sm font-semibold text-slate-800">
                    Document Menu
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    Confirmation Letter
                  </div>

                </div>

                {/* SEARCH */}

                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(
                      true,
                    );

                    setIsMenuOpen(
                      false,
                    );
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <Search
                    size={18}
                  />

                  Search
                </button>

                {/* REFRESH */}

                <button
                  type="button"
                  onClick={() => {
                    handleRefresh();
                    setIsMenuOpen(
                      false,
                    );
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <RefreshCw
                    size={18}
                  />

                  Refresh
                </button>

                {/* COPY */}

                <button
                  type="button"
                  onClick={() => {
                    handleCopy();
                    setIsMenuOpen(
                      false,
                    );
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <Copy
                    size={18}
                  />

                  Copy
                </button>

                {/* PRINT */}

                <button
                  type="button"
                  onClick={() => {
                    handlePrint();
                    setIsMenuOpen(
                      false,
                    );
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <Printer
                    size={18}
                  />

                  Print
                </button>

                {/* FULLSCREEN */}

                <button
                  type="button"
                  onClick={() => {
                    handleFullscreen();
                    setIsMenuOpen(
                      false,
                    );
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <Maximize
                    size={18}
                  />

                  Fullscreen
                </button>

                <div className="border-t border-slate-200" />

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(
                      false,
                    );

                    handleBack();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
                >
                  <X
                    size={18}
                  />

                  Close
                </button>

              </div>
            )}

          </div>

          {/* ====================================================
              SEARCH BUTTON
          ==================================================== */}

          <button
            type="button"
            title="Search"
            onClick={() =>
              setIsSearchOpen(
                (previous) =>
                  !previous,
              )
            }
            className="flex h-[52px] w-full items-center justify-center border-b border-white/10 hover:bg-[#1d5665]"
          >
            <Search
              size={20}
            />
          </button>

          {/* ====================================================
              EXIT / BACK BUTTON
          ==================================================== */}

          <button
            type="button"
            title="Close"
            onClick={handleBack}
            className="flex h-[52px] w-full items-center justify-center border-b border-white/10 hover:bg-[#1d5665]"
          >
            <LogOutIcon />
          </button>

        </aside>

        {/* ======================================================
            MAIN VIEWER
        ====================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* ====================================================
              SEARCH BAR
          ==================================================== */}

          {isSearchOpen && (
            <div className="flex h-[48px] shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4">

              <Search
                size={17}
                className="text-slate-400"
              />

              <input
                autoFocus
                type="text"
                value={searchText}
                onChange={
                  handleSearch
                }
                placeholder="Search in document..."
                className="h-8 flex-1 border-none text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

              {searchText && (
                <span className="text-xs text-slate-400">
                  {employee.employeeName
                    .toLowerCase()
                    .includes(
                      searchText.toLowerCase(),
                    )
                    ? "Match found"
                    : "No match"}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  setIsSearchOpen(
                    false,
                  );
                }}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X
                  size={17}
                />
              </button>

            </div>
          )}

          {/* ====================================================
              PDF TOOLBAR
          ==================================================== */}

          <div className="flex h-[48px] shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-200 bg-[#f7f8f8] px-2 text-slate-500 print:hidden">

            {/* FIRST PAGE */}

            <ToolbarButton
              title="First page"
              onClick={() => {}}
            >
              <ChevronsLeft
                size={17}
              />
            </ToolbarButton>

            {/* PREVIOUS */}

            <ToolbarButton
              title="Previous page"
              onClick={() => {}}
            >
              <ChevronLeft
                size={17}
              />
            </ToolbarButton>

            {/* PAGE NUMBER */}

            <span className="mx-2 whitespace-nowrap text-[11px] text-slate-400">
              1 / 1
            </span>

            {/* NEXT */}

            <ToolbarButton
              title="Next page"
              onClick={() => {}}
            >
              <ChevronRight
                size={17}
              />
            </ToolbarButton>

            {/* LAST PAGE */}

            <ToolbarButton
              title="Last page"
              onClick={() => {}}
            >
              <ChevronsRight
                size={17}
              />
            </ToolbarButton>

            <div className="mx-2 h-5 w-px bg-slate-300" />

            {/* REFRESH */}

            <ToolbarButton
              title="Refresh"
              onClick={
                handleRefresh
              }
            >
              <RefreshCw
                size={16}
              />
            </ToolbarButton>

            <span className="ml-1 mr-3 whitespace-nowrap text-[11px]">
              Refresh
            </span>

            {/* COPY */}

            <ToolbarButton
              title="Copy"
              onClick={
                handleCopy
              }
            >
              <Copy
                size={16}
              />
            </ToolbarButton>

            {/* ZOOM OUT */}

            <ToolbarButton
              title="Zoom out"
              onClick={
                handleZoomOut
              }
            >
              <ZoomOut
                size={16}
              />
            </ToolbarButton>

            {/* ZOOM VALUE */}

            <span className="min-w-[45px] text-center text-[11px] text-slate-500">
              {zoom}%
            </span>

            {/* ZOOM IN */}

            <ToolbarButton
              title="Zoom in"
              onClick={
                handleZoomIn
              }
            >
              <ZoomIn
                size={16}
              />
            </ToolbarButton>

            {/* FULLSCREEN */}

            <ToolbarButton
              title={
                isFullscreen
                  ? "Exit fullscreen"
                  : "Fullscreen"
              }
              onClick={
                handleFullscreen
              }
            >
              <Maximize
                size={16}
              />
            </ToolbarButton>

            {/* PRINT */}

            <button
              type="button"
              onClick={
                handlePrint
              }
              className="ml-auto inline-flex h-8 shrink-0 items-center gap-2 rounded px-3 text-[11px] hover:bg-slate-200"
            >
              <Printer
                size={16}
              />

              Print
            </button>

          </div>

          {/* ====================================================
              DOCUMENT AREA
          ==================================================== */}

          <div className="flex-1 overflow-auto bg-[#dfe4e4] p-4 sm:p-8">

            <div
              className="mx-auto origin-top min-h-[900px] w-full max-w-[625px] bg-white px-7 py-6 shadow-sm transition-transform duration-200 sm:px-10"
              style={{
                transform: `scale(${zoom / 100})`,
                marginBottom:
                  `${(zoom - 100) * 8}px`,
              }}
            >

              {/* ==================================================
                  COMPANY HEADER
              ================================================== */}

              <div className="flex items-start justify-between border-b border-slate-300 pb-5">

                <div className="pt-1">

                  <div className="text-[18px] font-bold italic tracking-tight text-[#2b9bd0]">
                    KOUNDINYASA
                  </div>

                  <div className="text-[6px] font-semibold tracking-[1px] text-[#2b9bd0]">
                    TECHNOLOGY SERVICES
                  </div>

                </div>

                <div className="text-center">

                  <h2 className="text-[13px] font-bold text-slate-900">
                    Koundinyasa Technology Services Pvt. Ltd.
                  </h2>

                  <p className="mt-1 text-[8px] text-slate-600">
                    Vasavi Sky city, 6th floor, 609,
                    Gachibowli Cir, Telecom Nagar,
                    Hyd TS 32
                  </p>

                </div>

              </div>

              {/* ==================================================
                  LETTER CONTENT
              ================================================== */}

              <div className="mt-6 text-[10px] leading-[1.65] text-slate-700">

                <p className="font-semibold">
                  To,
                </p>

                <p className="mt-1">
                  {employee.employeeName}
                </p>

                <p>
                  ASSOCIATE SOFTWARE ENGINEER
                </p>

                <p>
                  Koundinyasa Technology Services Pvt. Ltd.
                </p>

                <p className="mt-2">

                  <span className="font-bold">
                    Subject :
                  </span>{" "}

                  Confirmation Letter

                </p>

                <p className="mt-3">
                  Dear {employee.employeeName},
                </p>

                <p className="mt-4">
                  We are pleased to inform you that
                  your performance during the
                  probationary period has been reviewed,
                  and we are delighted to confirm your
                  employment with KOUNDINYASA TECHNOLOGY
                  SERVICES PVT. LTD. as ASSOCIATE
                  SOFTWARE ENGINEER.
                </p>

                <p className="mt-2">
                  Your employment terms and conditions
                  remain the same as mentioned in your
                  offer letter.
                </p>

                <p className="mt-2">
                  As a confirmed employee, you will
                  continue to be bound by the company&apos;s
                  policies, procedures, and code of
                  conduct.
                </p>

                <p className="mt-2">
                  We take this opportunity to thank you
                  for your contributions during the
                  probationary period and look forward
                  to your continued commitment and
                  performance in achieving KOUNDINYASA
                  TECHNOLOGY SERVICES PVT. LTD.&apos;s
                  goals.
                </p>

                <p className="mt-2">
                  Should you have any questions or
                  require clarification, please feel
                  free to contact the HR team.
                </p>

                <p className="mt-2">
                  Once again, congratulations on your
                  confirmation. We look forward to your
                  success and growth with us!
                </p>

                <p className="mt-6">
                  Warm Regards,
                </p>

                <p className="mt-4 font-semibold text-slate-800">
                  RAJESH UBBAPALLY
                </p>

                <p className="text-slate-600">
                  HR RECRUITER
                </p>

                <p className="mt-1 text-slate-500">
                  Koundinyasa Technology Services Pvt. Ltd.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* ================================================================
   TOOLBAR BUTTON
================================================================ */

function ToolbarButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-slate-200"
    >
      {children}
    </button>
  );
}

/* ================================================================
   EXIT ICON
================================================================ */

function LogOutIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

      <polyline points="16 17 21 12 16 7" />

      <line
        x1="21"
        y1="12"
        x2="9"
        y2="12"
      />
    </svg>
  );
}