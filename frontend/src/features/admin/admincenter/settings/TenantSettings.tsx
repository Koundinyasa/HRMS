// import { useRef } from "react";
// import { Upload, Info, Plus, Save } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useTenantSettings } from "./hooks/useTenantSettings";
// export default function TenantSettings() {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const {
//     logoPreview, 
//     ipAddress,  
//     setIpAddress, 
//     ipList,
//     passwordExpiry,
//     setPasswordExpiry,
//     isLoading,
//     isSaving,
//     isAddingIp,
//     isUploadingLogo,
//     handleFileChange,
//     handleAddIp,
//     handleSave,
//   } = useTenantSettings();
//   if (isLoading) {
//     return (
//       <div className="p-6 text-sm text-slate-500">Loading tenant settings…</div>
//     );
//   }
//   return (
//     <div className="w-full space-y-6">
//       {/* Settings Navigation Bar */}
//       {/* Main Settings Card */}
//       <Card className="rounded-2xl border-none bg-white p-8 shadow-sm space-y-8">  
//         {/* TOP SECTION: LOGO UPLOAD & GUIDELINES */}
//         <div className="grid grid-cols-12 gap-6 items-stretch">      
//           {/* Upload Box */}
//           <div
//             onClick={() => fileInputRef.current?.click()}
//             className="col-span-12 lg:col-span-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-300 bg-white p-8 text-center transition hover:bg-violet-50/30 cursor-pointer min-h-[220px]"
//           >
//             {logoPreview ? (
//               <img
//                 src={logoPreview}
//                 alt="Company Logo"
//                 className="max-h-28 object-contain mb-4"
//               />
//             ) : (
//               <>
//                 <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-[#7C5CFC]">
//                   <Upload className="h-6 w-6" />
//                 </div>
//                 <p className="text-sm font-semibold text-slate-800">
//                   Drag & drop logo here
//                 </p>
//                 <p className="mt-1 mb-4 text-xs text-slate-400">
//                   PNG, JPG up to 5MB
//                 </p>
//               </>
//             )}
//             <Button
//               type="button"
//               disabled={isUploadingLogo}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 fileInputRef.current?.click();
//               }}
//               className="h-9 rounded-xl bg-[#7C5CFC] px-5 text-xs font-medium text-white hover:bg-violet-700 shadow-none flex items-center gap-1.5"
//             >
//               <Plus className="h-4 w-4" />
//               Upload File
//             </Button>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept=".png,.jpg,.jpeg"
//               className="hidden"
//               onChange={(e) =>
//                 handleFileChange(e.target.files?.[0] || null)
//               }
//             />
//           </div>
//           {/* Guidelines Notice Box */}
//           <div className="col-span-12 lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-center">
//             <div className="flex items-start gap-3">
//               <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[#7C5CFC]">
//                 <Info className="h-4 w-4" />
//               </div>
//               <div className="space-y-3 text-xs">
//                 <h4 className="font-semibold text-slate-800 leading-tight">
//                   Satisfy Below conditions for better logo visibility
//                 </h4>
//                 <ul className="list-disc pl-4 space-y-1.5 text-slate-500">
//                   <li>Greater than 300 X 300 Pixels</li>
//                   <li>Transparent logo without any backdrops</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* BOTTOM SECTION: IP ADDRESS & PASSWORD EXPIRY */}
//         <div className="space-y-4">
//           <div className="flex flex-wrap items-center justify-between gap-6 pt-2"> 
//             {/* IP Address Input */}
//             <div className="flex items-center gap-3 flex-1 max-w-xl">
//               <Input
//                 placeholder="Enter IP address"
//                 value={ipAddress}
//                 onChange={(e) => setIpAddress(e.target.value)}
//                 className="h-10 border-slate-200 text-xs rounded-xl focus-visible:ring-violet-500 bg-slate-50/30"
//               />
//               <Button
//                 type="button"
//                 disabled={isAddingIp}
//                 onClick={handleAddIp}
//                 className="h-10 rounded-xl bg-slate-100 border border-slate-200/80 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-200 shadow-none shrink-0"
//               >
//                 {isAddingIp ? "Adding..." : "ADD IP"}
//               </Button>
//             </div>
//             {/* Password Expiry & Save Button */}
//             <div className="flex items-center gap-4 shrink-0">
//               <div className="flex items-center gap-3">
//                 <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
//                   Password Expiry in Days
//                 </span>
//                 <Input
//                   type="number"
//                   value={passwordExpiry}
//                   onChange={(e) => setPasswordExpiry(e.target.value)}
//                   className="h-10 w-20 text-center border-slate-200 text-xs rounded-xl bg-slate-50/50 font-semibold text-slate-800 focus-visible:ring-violet-500"
//                 />
//               </div>
//               <Button
//                 type="button"
//                 disabled={isSaving}
//                 onClick={handleSave}
//                 className="h-10 rounded-xl bg-[#7C5CFC] px-6 text-xs font-semibold text-white hover:bg-violet-700 shadow-sm flex items-center gap-2"
//               >
//                 <Save className="h-4 w-4" />
//                 {isSaving ? "Saving..." : "Save"}
//               </Button>
//             </div>
//           </div>
//           {/* Added IP List Tags */}
//           {ipList.length > 0 && (
//             <div className="flex flex-wrap gap-2 pt-2"> 
//               {ipList.map((ip, index) => (
//                 <div 
//                   key={index}
//                   className="rounded-full bg-violet-50 border border-violet-100 px-3 py-1 text-xs font-medium text-violet-700"
//                >
//                   {ip}  
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }













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
    isAddingIp,
    isUploadingLogo,
    handleFileChange,
    handleAddIp,
    handleSave,
  } = useTenantSettings();

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">Loading tenant settings…</div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card className="rounded-2xl border-none bg-white p-4 shadow-sm space-y-6 sm:p-8 sm:space-y-8">
        {/* TOP: LOGO + GUIDELINES */}
        <div className="grid grid-cols-12 gap-4 items-stretch sm:gap-6">
          {/* Upload box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="col-span-12 lg:col-span-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-300 bg-white p-6 text-center transition hover:bg-violet-50/30 cursor-pointer min-h-[200px] sm:p-8 sm:min-h-[220px]"
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company Logo"
                className="max-h-28 object-contain mb-4"
              />
            ) : (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-[#7C5CFC]">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
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
              className="h-9 rounded-xl bg-[#7C5CFC] px-5 text-xs font-medium text-white hover:bg-violet-700 shadow-none flex items-center gap-1.5"
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
          <div className="col-span-12 lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-center">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[#7C5CFC]">
                <Info className="h-4 w-4" />
              </div>
              <div className="space-y-3 text-xs">
                <h4 className="font-semibold text-slate-800 leading-tight">
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
            <div className="flex items-center gap-3 w-full sm:flex-1 sm:max-w-xl">
              <Input
                placeholder="Enter IP address"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="h-10 border-slate-200 text-xs rounded-xl focus-visible:ring-violet-500 bg-slate-50/30"
              />
              <Button
                type="button"
                disabled={isAddingIp}
                onClick={handleAddIp}
                className="h-10 rounded-xl bg-slate-100 border border-slate-200/80 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-200 shadow-none shrink-0"
              >
                {isAddingIp ? "Adding..." : "ADD IP"}
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 sm:shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
                  Password Expiry in Days
                </span>
                <Input
                  type="number"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(e.target.value)}
                  className="h-10 w-20 text-center border-slate-200 text-xs rounded-xl bg-slate-50/50 font-semibold text-slate-800 focus-visible:ring-violet-500"
                />
              </div>
              <Button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="h-10 w-full rounded-xl bg-[#7C5CFC] px-6 text-xs font-semibold text-white hover:bg-violet-700 shadow-sm flex items-center justify-center gap-2 sm:w-auto"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {ipList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {ipList.map((ip, index) => (
                <div
                  key={index}
                  className="rounded-full bg-violet-50 border border-violet-100 px-3 py-1 text-xs font-medium text-violet-700"
                >
                  {ip}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}