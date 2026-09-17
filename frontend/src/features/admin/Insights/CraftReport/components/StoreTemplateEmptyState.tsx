import noFilesImage from "@/assets/images/no-data.png";

export default function StoreTemplateEmptyState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center bg-white px-4">
      <img
        src={noFilesImage}
        alt="No files found for this state"
        className="mb-5 h-[180px] w-auto object-contain"
      />
      <p className="text-[13px] font-medium text-[#94A3B8]">
        No files found for this state
      </p>
    </div>
  );
}