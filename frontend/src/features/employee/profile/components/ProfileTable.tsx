import { useState } from "react";
 
import { Card, CardContent } from "@/components/ui/card";
 
import { Eye, Download, X } from "lucide-react";
 
import {
  PROFILE_ICONS,
  HIDDEN_FIELDS,
} from "../constants/profile.constants";
 
import type { ProfileSectionProps } from "../types/profile.types";
 
interface DocumentAction {
  view?: boolean;
  download?: boolean;
  url?: string;
  filePath?: string;
}
 
export default function ProfileTable({
  section,
}: ProfileSectionProps) {
  const Icon = PROFILE_ICONS[section.icon];
 
  // =====================================================
  // PREVIEW STATE
  // =====================================================
 
  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);
 
  const [previewFileName, setPreviewFileName] =
    useState<string>("");
 
  const [previewError, setPreviewError] =
    useState<boolean>(false);
 
  // =====================================================
  // GET DOCUMENT URL
  // =====================================================
 
  const getDocumentUrl = (
    action: DocumentAction,
  ): string | null => {
    const filePath =
      action.url || action.filePath;
 
    if (!filePath) {
      return null;
    }
 
    // If backend already returns complete URL
    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }
 
    // Keep /documents/... unchanged
    // Vite proxy will forward it to backend
    return filePath.startsWith("/")
      ? filePath
      : `/${filePath}`;
  };
 
  // =====================================================
  // VIEW
  // =====================================================
 
  const handleView = (
    action: DocumentAction,
  ) => {
    const url = getDocumentUrl(action);
 
    if (!url) {
      alert("No file available to preview.");
      return;
    }
 
    const fileName = decodeURIComponent(
      url.split("/").pop() ||
        "document.pdf",
    );
 
    setPreviewFileName(fileName);
    setPreviewError(false);
    setPreviewUrl(url);
  };
 
  // =====================================================
  // DOWNLOAD
  //
  // DOWNLOAD FILE
  // AND OPEN SAME PREVIEW MODEL
  // =====================================================
const handleDownload = async (
  action: DocumentAction,
) => {
  const url = getDocumentUrl(action);
 
  if (!url) {
    alert("No file available to download.");
    return;
  }
 
  try {
    const response = await fetch(url);
 
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
 
    const blob = await response.blob();
 
    const blobUrl = window.URL.createObjectURL(blob);
 
    const fileName = decodeURIComponent(
      url.split("/").pop() || "document.pdf",
    );
 
    const link = document.createElement("a");
 
    link.href = blobUrl;
    link.download = fileName;
 
    // IMPORTANT:
    // Do NOT set target="_blank"
    // Do NOT call handleView()
    // Do NOT call setPreviewUrl()
 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
 
    // Give Chrome enough time to start the download
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);
 
  } catch (error) {
    console.error("Document download error:", error);
    alert("Failed to download document.");
  }
};
  // =====================================================
  // CLOSE PREVIEW
  // =====================================================
 
  const handleClosePreview = () => {
    // If preview uses a blob URL, release it
    if (
      previewUrl &&
      previewUrl.startsWith("blob:")
    ) {
      window.URL.revokeObjectURL(
        previewUrl,
      );
    }
 
    setPreviewUrl(null);
    setPreviewFileName("");
    setPreviewError(false);
  };
 
  // =====================================================
  // NO RECORDS
  // =====================================================
 
  if (!section.records?.length) {
    return (
      <div className="w-full px-4 py-10 text-center text-slate-500">
        No records found.
      </div>
    );
  }
 
  // =====================================================
  // TABLE HEADERS
  // =====================================================
 
  const headers =
    section.records[0].fields.filter(
      (field) =>
        !HIDDEN_FIELDS.includes(
          field.label,
        ),
    );
 
  return (
    <>
      <Card className="w-full max-w-full overflow-hidden border-0 shadow-none">
        <CardContent className="p-0">
 
          {/* =================================================
              SECTION HEADER
          ================================================= */}
 
          <div className="flex items-center gap-3 px-6 py-5">
            <div className="flex h-8 w-8 items-center justify-center">
              {Icon && (
                <Icon className="h-5 w-5 text-blue-600" />
              )}
            </div>
 
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {section.title}
              </h2>
 
              <p className="text-xs text-slate-500">
                {section.records.length} Records
              </p>
            </div>
          </div>
 
          {/* =================================================
              TABLE
          ================================================= */}
 
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
 
              <thead>
                <tr className="border-y border-slate-300">
 
                  {headers.map((field) => (
                    <th
                      key={field.label}
                      className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-slate-700"
                    >
                      {field.label}
                    </th>
                  ))}
 
                </tr>
              </thead>
 
              <tbody>
 
                {section.records.map(
                  (record, recordIndex) => (
 
                    <tr
                      key={recordIndex}
                      className="border-b border-slate-300"
                    >
 
                      {headers.map(
                        (field, fieldIndex) => {
 
                          const fieldValue =
                            record.fields.find(
                              (item) =>
                                item.label ===
                                field.label,
                            )?.value;
 
                          // =================================================
                          // ACTIONS
                          // =================================================
 
                          if (
                            field.label ===
                              "Actions" &&
                            typeof fieldValue ===
                              "object" &&
                            fieldValue !== null
                          ) {
 
                            const action =
                              fieldValue as DocumentAction;
 
                            return (
                              <td
                                key={fieldIndex}
                                className="px-4 py-3 text-center"
                              >
 
                                <div className="flex items-center justify-center gap-4">
 
                                  {/* =========================================
                                      VIEW ICON
                                  ========================================= */}
 
                                  {action.view && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleView(
                                          action,
                                        )
                                      }
                                      title="View document"
                                      className="text-slate-600 transition-colors hover:text-blue-600"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                  )}
 
                                  {/* =========================================
                                      DOWNLOAD ICON
                                  ========================================= */}
 
                                  {action.download && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDownload(
                                          action,
                                        )
                                      }
                                      title="Download document"
                                      className="text-slate-600 transition-colors hover:text-green-600"
                                    >
                                      <Download className="h-4 w-4" />
                                    </button>
                                  )}
 
                                </div>
 
                              </td>
                            );
                          }
 
                          // =================================================
                          // NORMAL FIELD
                          // =================================================
 
                          return (
                            <td
                              key={fieldIndex}
                              className="px-4 py-3 text-sm text-slate-700"
                            >
                              {fieldValue !==
                                undefined &&
                              fieldValue !==
                                null
                                ? String(
                                    fieldValue,
                                  )
                                : "-"}
                            </td>
                          );
                        },
                      )}
 
                    </tr>
 
                  ),
                )}
 
              </tbody>
            </table>
          </div>
 
        </CardContent>
      </Card>
 
      {/* =====================================================
          SAME DOCUMENT PREVIEW MODEL
          USED FOR BOTH VIEW AND DOWNLOAD
      ===================================================== */}
 
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
 
          <div className="flex h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
 
            {/* =================================================
                HEADER
            ================================================= */}
 
            <div className="flex items-center justify-between border-b px-4 py-3">
 
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Document Preview
                </h2>
 
                <p className="text-xs text-slate-500">
                  {previewFileName}
                </p>
              </div>
 
              <button
                type="button"
                title="Close"
                onClick={
                  handleClosePreview
                }
                className="text-slate-500 transition-colors hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
 
            </div>
 
            {/* =================================================
                PDF PREVIEW
            ================================================= */}
 
            <div className="flex-1 overflow-hidden bg-slate-100">
 
              {previewError ? (
                <div className="flex h-full items-center justify-center text-sm text-red-500">
                  Unable to preview document.
                </div>
              ) : (
                <iframe
                  src={previewUrl}
                  title="Document Preview"
                  className="h-full w-full border-0"
                  onError={() =>
                    setPreviewError(true)
                  }
                />
              )}
 
            </div>
 
            {/* =================================================
                FOOTER
            ================================================= */}
 
            <div className="flex justify-end border-t bg-white px-4 py-3">
 
              <button
                type="button"
                onClick={
                  handleClosePreview
                }
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                Close
              </button>
 
            </div>
 
          </div>
        </div>
      )}
    </>
  );
}