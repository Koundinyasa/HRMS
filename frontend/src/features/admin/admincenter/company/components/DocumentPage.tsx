import React, { useState, useEffect } from "react";
import { Filter, X, Upload } from "lucide-react";
import documentImage from "../../../../../assets/images/documentImage.png";

interface Document {
  id: number;
  documentName: string;
  description: string;
  date: string;
  extension: string;
  showInSIA: string;
}

const tableHeaders = [
  "Document Name",
  "Description",
  "Date",
  "File Extension",
  "Show in SIA",
  "Action",
];

const documents: Document[] = [];

export default function DocumentPage() {
  const [showModal, setShowModal] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showInSIA, setShowInSIA] = useState(true);

  useEffect(() => {
    const open = () => setShowModal(true);
    window.addEventListener("open-add-document-modal", open);
    return () => window.removeEventListener("open-add-document-modal", open);
  }, []);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* TABLE HEADER – Desktop */}
        <div className="hidden md:block" style={{ backgroundColor: "#EDE9FE" }}>
          <div className="grid grid-cols-6 items-center px-5 py-3 lg:px-6">
            {tableHeaders.map((header) => (
              <div
                key={header}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700"
              >
                <span className="truncate">{header}</span>
                {header !== "Action" && (
                  <Filter size={13} className="shrink-0 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TABLE HEADER – Mobile */}
        <div className="px-4 py-3 md:hidden" style={{ backgroundColor: "#EDE9FE" }}>
          <p className="text-sm font-semibold text-slate-700">Documents</p>
        </div>

        {/* EMPTY / ROWS */}
        {documents.length === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center px-4 py-12 sm:min-h-[440px]">
            <img
              src={documentImage}
              alt="No Documents"
              className="mb-6 w-52 sm:mb-7 sm:w-64 md:w-72"
            />
            <p className="text-center text-base text-gray-600">
              Did Not Find Any Documents
            </p>
            <div className="mt-5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 shadow-sm">
              No Record Found
            </div>
          </div>
        ) : (
          <div>
            {documents.map((document) => (
              <div
                key={document.id}
                className="grid grid-cols-1 gap-3 border-t px-4 py-4 hover:bg-gray-50 sm:grid-cols-2 md:grid-cols-6 md:gap-0 md:px-6 md:py-4"
              >
                <div>
                  <span className="text-xs font-medium text-gray-400 md:hidden">Document Name</span>
                  <p className="text-sm">{document.documentName}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 md:hidden">Description</span>
                  <p className="text-sm">{document.description}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 md:hidden">Date</span>
                  <p className="text-sm">{document.date}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 md:hidden">File Extension</span>
                  <p className="text-sm">{document.extension}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 md:hidden">Show in SIA</span>
                  <p className="text-sm">{document.showInSIA}</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" className="text-sm text-blue-600 hover:underline">View</button>
                  <button type="button" className="text-sm text-green-600 hover:underline">Edit</button>
                  <button type="button" className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
            <div className="mb-5 flex items-center justify-between sm:mb-6">
              <h2 className="text-lg font-semibold sm:text-2xl">Add Document</h2>
              <button type="button" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Document Name</label>
                <input
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm sm:p-3"
                  placeholder="Enter document name"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-24 w-full rounded-lg border border-gray-200 p-2.5 text-sm sm:h-28 sm:p-3"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Upload File</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DDD6FE] p-5 sm:p-8">
                  <Upload size={28} className="mb-2 text-[#6C4BFF]" />
                  <p className="text-sm text-gray-600">Click to Upload</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                {file && <p className="mt-2 text-sm text-green-600">{file.name}</p>}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 sm:p-4">
                <span className="text-sm font-medium">Show in SIA</span>
                <button
                  type="button"
                  onClick={() => setShowInSIA(!showInSIA)}
                  className={`relative h-6 w-12 rounded-full transition sm:h-7 sm:w-14 ${
                    showInSIA ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition sm:top-1 ${
                      showInSIA ? "left-6 sm:left-8" : "left-0.5 sm:left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-[#6C4BFF] px-5 py-2 text-sm text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}