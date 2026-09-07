import React, { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CloudUpload,
  Download,
  FileCheck2,
  FileSpreadsheet,
  X,
} from "lucide-react";

const TEMPLATE_OPTIONS = [
  "Employee Details",
  "Employee Contact Details",
  "Employee Bank A/c Number",
  "Employee Classification Details",
  "Employee DOL",
  "Employee Basic Details",
  "Employee HR Category",
];

const ImportPage = () => {
  const [selectedTemplate, setSelectedTemplate] =
    useState("Employee Details");

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [isDragOver, setIsDragOver] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    const allowedExtensions = [
      ".xlsx",
      ".xls",
      ".csv",
    ];

    const fileName = file.name.toLowerCase();

    const isValid = allowedExtensions.some(
      (extension) =>
        fileName.endsWith(extension)
    );

    if (!isValid) {
      alert(
        "Please upload a valid Excel or CSV file."
      );
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setIsDragOver(false);

    handleFile(event.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleTemplateDownload = () => {
    const content =
      "Employee ID,Employee Name,Date of Joining\n";

    const blob = new Blob([content], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedTemplate.replace(
      /\s+/g,
      "_"
    )}_Template.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    alert(
      `${selectedFile.name} is ready for upload.`
    );
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-white">
      {/* Page Header */}
      <div className="h-[36px] bg-[#eaf2fb] border-b border-gray-200 flex items-center justify-center">
        <h2 className="text-[13px] font-semibold text-gray-700">
          Employee Details
        </h2>
      </div>

      <div className="p-4">
        {/* Template Selection */}
        <div className="relative w-[200px]">
          <label className="block text-[12px] font-medium text-gray-600 mb-1">
            Template Type
            <span className="text-red-500">
              *
            </span>
          </label>

          <button
            type="button"
            onClick={() =>
              setShowDropdown((value) => !value)
            }
            className={`w-[170px] h-[34px] px-3 flex items-center justify-between border rounded-md bg-white text-[12px] ${
              showDropdown
                ? "border-[#2196F3] ring-1 ring-[#90CAF9]"
                : "border-gray-300"
            }`}
          >
            <span className="text-gray-700">
              {selectedTemplate}
            </span>

            {showDropdown ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-[56px] z-50 w-[210px] rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
              <div className="px-3 py-2 text-[11px] text-gray-400 border-b border-gray-100">
                Select Template Type
              </div>

              {TEMPLATE_OPTIONS.map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(
                        option
                      );
                      setShowDropdown(false);
                      removeFile();
                    }}
                    className={`w-full text-left px-3 py-2 text-[12px] hover:bg-blue-50 ${
                      selectedTemplate ===
                      option
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Information Message */}
        <div className="mt-4 rounded-md bg-[#f5f3ff] border border-[#ece7ff] px-4 py-2.5 text-[12px] text-gray-600">
          <span className="font-medium">
            Important:
          </span>{" "}
          For Date of Joining, change the
          "Statutory Effective From" field to
          text format in the Excel template before
          uploading file.
        </div>

        {/* Main Upload Section */}
        <div className="mt-2 grid grid-cols-[1fr_32%] gap-6">
          {/* Upload Area */}
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() =>
              setIsDragOver(false)
            }
            onDrop={handleDrop}
            className={`min-h-[270px] border-2 border-dashed rounded-md bg-white flex flex-col items-center justify-center transition-colors ${
              isDragOver
                ? "border-[#2196F3] bg-blue-50"
                : "border-gray-300"
            }`}
          >
            {!selectedFile ? (
              <>
                <CloudUpload
                  size={30}
                  className="text-gray-300 mb-2"
                />

                <p className="text-[13px] text-gray-400">
                  Drag and drop
                </p>

                <p className="text-[12px] text-gray-400 my-1">
                  - or -
                </p>

                <button
                  type="button"
                  onClick={handleBrowse}
                  className="text-[13px] font-medium text-[#2196F3] hover:underline"
                >
                  Browse
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            ) : (
              <div className="flex flex-col items-center">
                <FileSpreadsheet
                  size={34}
                  className="text-green-500 mb-3"
                />

                <p className="text-[13px] font-medium text-gray-700">
                  {selectedFile.name}
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  {(
                    selectedFile.size /
                    1024
                  ).toFixed(1)}{" "}
                  KB
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleBrowse}
                    className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Replace
                  </button>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-red-500 border border-red-200 rounded-md hover:bg-red-50"
                  >
                    <X size={13} />
                    Remove
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* File Requirement */}
          <div className="border border-gray-200 rounded-md overflow-hidden min-h-[270px]">
            <div className="bg-[#e7eef6] px-4 py-3">
              <h3 className="text-[15px] font-semibold text-gray-700">
                File Requirement
              </h3>
            </div>

            <div className="px-4 py-7">
              <div className="flex items-center gap-3">
                <FileCheck2
                  size={22}
                  className="text-emerald-400"
                />

                <span className="text-[13px] font-medium text-emerald-500">
                  The Selected File
                  should be valid
                </span>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="text-[11px] text-gray-400">
                  Supported formats
                </div>

                <div className="mt-1 text-[12px] text-gray-600">
                  .xlsx, .xls, .csv
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-center gap-2 mt-[-52px] relative z-10">
          <button
            type="button"
            onClick={handleTemplateDownload}
            className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white text-[13px] font-medium"
          >
            <Download size={14} />
            Template
          </button>

          <button
            type="button"
            onClick={handleUpload}
            className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#2196F3] hover:bg-[#1976D2] text-white text-[13px] font-medium"
          >
            <FileCheck2 size={14} />
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;