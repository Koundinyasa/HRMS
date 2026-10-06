import { useState } from "react";
import AdjustmentImport from "../components/AdjustmentImport";
import AdjustmentTabs from "../components/AdjustmentTabs";
import { ClockFading } from "lucide-react";

const AdjustmentImportPage = () => {
  const [showFilters, setShowFilters] = useState(true);
  const handleFileSelect = (file: File) => {
    console.log("Selected adjustment file:", file.name);
  };

  const handleUpload = (file: File) => {
    console.log("Uploading adjustment file:", file.name);
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden font-[Urbanist]">
      {/* =========================================================
          TOP TABS
      ========================================================= */}
      <div className="mb-3 h-[70px] w-full overflow-x-auto rounded-[10px] border border-[#df8d7c] bg-[#fff7f5] px-5 shadow-sm [scrollbar-color:#a45a4a_#f3e5e1] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f3e5e1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#a45a4a] xl:overflow-x-visible xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
        <div className="flex h-full w-max min-w-full items-center">
        <div className="shrink-0">
          <AdjustmentTabs />
        </div>

        {/* Right icons exactly like screenshot */}
        <div className="ml-6 flex shrink-0 items-center gap-6">
          <button
            type="button"
            aria-label="Filter"
            onClick={() => setShowFilters(true)}
            className="text-[#9a5547]"
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6L14 14.5V20a1 1 0 0 1-.55.89l-3 1.5A1 1 0 0 1 9 21.5v-7L3.2 5.6A1 1 0 0 1 3 5Z" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="History"
            className="text-[#9a5547]"
          >
            <ClockFading size={25} strokeWidth={1.8} />
          </button>
        </div>
        </div>
      </div>

      {/* =========================================================
          IMPORT CONTENT
      ========================================================= */}
      <AdjustmentImport
        onFileSelect={handleFileSelect}
        onUpload={handleUpload}
        showFilters={showFilters}
        onHideFilters={() => setShowFilters(false)}
      />
    </div>
  );
};

export default AdjustmentImportPage;
