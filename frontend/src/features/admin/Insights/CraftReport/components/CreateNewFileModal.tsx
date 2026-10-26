import { useEffect, useRef, useState } from "react";
import { UploadCloud, X, Save } from "lucide-react";

import ComboField from "./ComboField";
import {
  CRAFT_REPORT_CATEGORY_OPTIONS,
  CRAFT_REPORT_SUBCATEGORY_OPTIONS,
} from "../constants/craftReport.constants";
import type { CreateNewFilePayload } from "../types/craftReport.types";

interface CreateNewFileModalProps {
  onClose: () => void;
  onSave: (payload: CreateNewFilePayload) => void;
}

export default function CreateNewFileModal({
  onClose,
  onSave,
}: CreateNewFileModalProps) {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const subCategoryOptions =
    CRAFT_REPORT_SUBCATEGORY_OPTIONS[category.trim().toLowerCase()] ?? [];

  // Reset the picked sub category whenever the category changes,
  // so a stale sub category from a previous category can't linger.
  useEffect(() => {
    setSubCategory("");
  }, [category]);

  const isValid = category.trim() !== "" && fileName.trim() !== "";

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) setFile(files[0]);
  };

  const handleSave = () => {
    if (!isValid) return;
    onSave({ category, subCategory, fileName, file });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
    <div className="flex w-full max-w-md flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-[#814A3C]">
            Create New File
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 py-5">
          <ComboField
            label="Category"
            required
            value={category}
            onChange={setCategory}
            options={CRAFT_REPORT_CATEGORY_OPTIONS}
          />

          <ComboField
            label="Sub Category"
            value={subCategory}
            onChange={setSubCategory}
            options={subCategoryOptions}
            placeholder={
              category.trim() === ""
                ? "Select a category first"
                : "Start typing..."
            }
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              File Name<span className="ml-0.5 text-rose-500">*</span>
            </label>
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 outline-none focus:border-[#D97B3F] focus:bg-white focus:ring-1 focus:ring-[#F3D9C9]"
            />
          </div>

          {/* Drag & drop */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`flex min-h-[160px] flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors ${
              isDragActive
                ? "border-[#D97B3F] bg-[#FDF1E9]"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <UploadCloud size={26} className="mb-2 text-slate-400" />
            <p className="text-xs text-slate-500">Drag and drop</p>
            <p className="my-1 text-[11px] text-slate-400">- or -</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-[#D97B3F] hover:underline"
            >
              Browse
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            {file && (
              <p className="mt-3 max-w-full truncate text-[11px] text-slate-600">
                {file.name}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <X size={14} />
            Close
          </button>
          <button
            type="button"
            disabled={!isValid}
            onClick={handleSave}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#814A3C] px-4 text-xs font-medium text-white hover:bg-[#6c3d31] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}