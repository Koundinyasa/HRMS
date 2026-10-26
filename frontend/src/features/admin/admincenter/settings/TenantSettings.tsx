







import { useRef } from "react";
import { Upload, Info, Plus, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTenantSettings } from "./hooks/useTenantSettings";

export default function TenantSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    logoPreview,
    ipAddress,
    setIpAddress,
    ipList,
    passwordExpiry,
    setPasswordExpiry,
    isLoading,
    isSaving,
    loadError,
    message,
    isUploadingLogo,
    handleFileChange,
    handleAddIp,
    handleRemoveIp,
    handleSave,
  } = useTenantSettings();

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500 sm:p-6">Loading tenant settings…</div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-6">
      {loadError && (
        <div
          role="alert"
          className="rounded-xl border border-[#FAD5D1] bg-[#FAD5D1]/40 px-3 py-2 text-xs font-medium text-[#DD3232]"
        >
          Could not load tenant settings from the server.
        </div>
      )}
      <Card className="min-w-0 space-y-5 overflow-hidden rounded-2xl border-none bg-white p-3 shadow-sm sm:space-y-8 sm:p-8">
        {/* TOP: LOGO + GUIDELINES */}
        <div className="grid grid-cols-12 gap-4 items-stretch sm:gap-6">
          {/* Upload box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="col-span-12 lg:col-span-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#626262] bg-white p-4 text-center transition hover:bg-[#ECE7FF]/30 cursor-pointer min-h-[160px] min-w-0 sm:p-8 sm:min-h-[220px]"
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company Logo"
                className="mb-4 max-h-24 max-w-full object-contain sm:max-h-28"
              />
            ) : (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ECE7FF] text-[#5932E9]">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="font-['Urbanist',_sans-serif] text-[13px] font-semibold text-slate-800">
                  Drag & drop logo here
                </p>
                <p className="mt-1 mb-4 text-xs text-slate-400">
                  PNG, JPG up to 5MB
                </p>
              </>
            )}
            <Button
              type="button"
              disabled={isUploadingLogo}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="h-9 rounded-xl bg-[#5932E9] px-5 text-xs font-medium text-white hover:bg-[#4726BA] shadow-none flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Upload File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </div>

          {/* Guidelines */}
          <div className="col-span-12 flex min-w-0 flex-col justify-center rounded-2xl border border-slate-200 bg-white p-3 sm:p-6 lg:col-span-4">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ECE7FF] text-[#5932E9]">
                <Info className="h-4 w-4" />
              </div>
              <div className="min-w-0 space-y-3 text-xs">
                <h4 className="break-words font-semibold leading-tight text-slate-800">
                  Satisfy Below conditions for better logo visibility
                </h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-500">
                  <li>Greater than 300 X 300 Pixels</li>
                  <li>Transparent logo without any backdrops</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: IP + PASSWORD EXPIRY */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6">
            <div className="flex w-full min-w-0 items-center gap-2 sm:max-w-xl sm:flex-1 sm:gap-3">
              <Input
                placeholder="Enter IP address"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIp();
                  }
                }}
                className="h-10 min-w-0 flex-1 rounded-xl border-slate-200 bg-slate-50/30 text-base focus-visible:ring-[#5932E9] sm:text-xs"
              />
              <Button
                type="button"
                onClick={handleAddIp}
                className="h-10 rounded-xl bg-slate-100 border border-slate-200/80 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-200 shadow-none shrink-0"
              >
                ADD IP
              </Button>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:shrink-0">
              <div className="flex items-center justify-between gap-3 sm:justify-start">
                <span className="text-xs font-medium text-slate-700 sm:whitespace-nowrap">
                  Password Expiry in Days
                </span>
                <Input
                  type="number"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(e.target.value)}
                  className="h-10 w-20 shrink-0 rounded-xl border-slate-200 bg-slate-50/50 text-center text-base font-semibold text-slate-800 focus-visible:ring-[#5932E9] sm:text-xs"
                />
              </div>
              <Button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="h-10 w-full rounded-xl bg-[#5932E9] px-6 text-xs font-semibold text-white hover:bg-[#4726BA] shadow-sm flex items-center justify-center gap-2 sm:w-auto"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {message && (
            <div
              role="status"
              className={`rounded-xl border px-3 py-2 text-xs font-medium ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-[#FAD5D1] bg-[#FAD5D1]/40 text-[#DD3232]"
              }`}
            >
              {message.text}
            </div>
          )}

          {ipList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {ipList.map((ip) => (
                <div
                  key={ip}
                  className="flex max-w-full items-center gap-1.5 break-all rounded-full border border-[#ECE7FF] bg-[#ECE7FF] px-3 py-1 text-xs font-medium text-[#4726BA]"
                >
                  {ip}
                  <button
                    type="button"
                    aria-label={`Remove ${ip}`}
                    onClick={() => handleRemoveIp(ip)}
                    className="text-[#4726BA] hover:text-[#DD3232]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}