import { useState } from "react";
import { toast } from "react-toastify";
import { useLazyDownloadImportTemplateQuery, useUploadImportFileMutation } from "../api/classificationApi";
import { getBackendMessage } from "./getBackendMessage";
import type { ImportTemplateType } from "../types/classificationTypes";

const TEMPLATE_TYPES: ImportTemplateType[] = ["Branch Details", "Designation Details", "Bank Details"];

export const useImport = () => {
  const [templateType, setTemplateType] = useState<ImportTemplateType>(TEMPLATE_TYPES[0]);
  const [file, setFile] = useState<File | null>(null);

  const [fetchTemplate, { isFetching: isDownloading }] = useLazyDownloadImportTemplateQuery();
  const [uploadFile, { isLoading: isUploading }] = useUploadImportFileMutation();

  const downloadTemplate = async () => {
    try {
      const blob = await fetchTemplate(templateType).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateType.replace(/\s+/g, "_")}_Template.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to download the template.");
    }
  };

  const upload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    try {
      const res = await uploadFile({ type: templateType, file }).unwrap();
      toast.success(`${res.Message} — ${res.SuccessCount} succeeded, ${res.FailedCount} failed.`);
      setFile(null);
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to upload the file. Please try again.");
    }
  };

  return {
    templateType, setTemplateType, templateTypes: TEMPLATE_TYPES,
    file, setFile,
    downloadTemplate, isDownloading,
    upload, isUploading,
  };
};
