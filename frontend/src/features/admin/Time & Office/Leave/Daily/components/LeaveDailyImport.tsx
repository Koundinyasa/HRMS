import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface LeaveDailyImportProps {
  onFileSelect?: (file: File) => void;
  loading?: boolean;
}

const LeaveDailyImport = ({
  onFileSelect,
  loading = false,
}: LeaveDailyImportProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);

    if (file) {
      onFileSelect?.(file);
    }
  };

  return (
    <div className="w-full font-[Urbanist]">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="flex h-[40px] items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium leading-[18px] text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Upload size={16} />

        {selectedFile ? selectedFile.name : "Import"}
      </button>
    </div>
  );
};

export default LeaveDailyImport;