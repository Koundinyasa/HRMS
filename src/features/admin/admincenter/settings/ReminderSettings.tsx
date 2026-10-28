// import { useEffect, useRef, useState } from "react";
// import {
//   Plus,
//   Wand2,
//   Gift,
//   Award,
//   CheckCircle2,
//   Briefcase,
//   FileText,
//   Sun,
//   UserCheck,
//   RefreshCw,
//   XCircle,
//   Bold,
//   Italic,
//   Underline,
//   Strikethrough,
//   List,
//   ListOrdered,
//   AlignLeft,
//   AlignCenter,
//   Link,
//   Code,
//   Undo,
//   Redo,
//   ChevronDown,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";

// import { useReminderSettings } from "./hooks/useReminderSettings";
// import type { ReminderType } from "./types/settingstypes";

// interface ReminderOption {
//   label: string;
//   type: ReminderType;
//   icon: React.ElementType;
// }

// const REMINDER_OPTIONS: ReminderOption[] = [
//   { label: "Birthday", type: "birthday", icon: Gift },
//   { label: "Work Anniversary", type: "workAnniversary", icon: Award },
//   { label: "Confirmation Date", type: "confirmationDate", icon: CheckCircle2 },
//   { label: "Last working day", type: "lastWorkingDay", icon: Briefcase },
//   { label: "Probation completion", type: "probationCompletion", icon: FileText },
//   { label: "Retirement", type: "retirement", icon: Sun },
//   { label: "Interview Reminder", type: "interviewReminder", icon: UserCheck },
//   { label: "Subscription Reminder", type: "subscriptionReminder", icon: RefreshCw },
//   { label: "Passport Expiry", type: "passportExpiry", icon: XCircle },
// ];

// export default function ReminderSettings() {
//   const [selectedType, setSelectedType] = useState<ReminderType>("birthday");
//   const editorRef = useRef<HTMLDivElement>(null);

//   const {
//     formData,
//     setFormData,
//     isLoading,
//     isSaving,
//     toggleOption,
//     handleSave,
//     handleCancel,
//   } = useReminderSettings(selectedType);

//   // Keep the contentEditable div's DOM content in sync when reminder data loads or changes
//   useEffect(() => {
//     if (editorRef.current && document.activeElement !== editorRef.current) {
//       editorRef.current.innerHTML = formData.body || "";
//     }
//   }, [formData.body]);

//   function executeCommand(command: string, value: string | undefined = undefined) {
//     document.execCommand(command, false, value);
//   }

//   function handleGenerate() {
//     console.log("Generate");
//   }

//   return (
//     <div className="grid grid-cols-12 gap-6 w-full">
//       {/* REMINDERS LIST SIDEBAR */}
//       <Card className="col-span-12 md:col-span-4 lg:col-span-3 rounded-2xl bg-white p-4 shadow-md border border-gray-100">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-sm font-bold text-slate-800">Reminders</h2>
//           <Button
//             type="button"
//             size="icon"
//             className="h-7 w-7 rounded-lg border border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100 shadow-none"
//           >
//             <Plus className="h-4 w-4" />
//           </Button>
//         </div>

//         <div className="space-y-1">
//           {REMINDER_OPTIONS.map((option) => {
//             const Icon = option.icon;
//             const isSelected = selectedType === option.type;
//             return (
//               <button
//                 key={option.type}
//                 type="button"
//                 onClick={() => setSelectedType(option.type)}
//                 className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all ${
//                   isSelected
//                     ? "bg-[#EBE8FC] text-[#7C5CFC]"
//                     : "text-slate-600 hover:bg-slate-50"
//                 }`}
//               >
//                 <Icon className={`h-4 w-4 ${isSelected ? "text-[#7C5CFC]" : "text-violet-400"}`} />
//                 <span>{option.label}</span>
//               </button>
//             );
//           })}
//         </div>
//       </Card>

//       {/* RIGHT CONFIGURATION PANEL */}
//       <Card className="col-span-12 md:col-span-8 lg:col-span-9 rounded-2xl bg-white p-6 shadow-md border border-gray-100 space-y-6">
//         {isLoading ? (
//           <div className="text-xs text-slate-500">Loading reminder settings…</div>
//         ) : (
//           <>
//             {/* TOP ROW: REMINDER BEFORE & APPLICABILITY */}
//             <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
//               {/* Days Input */}
//               <div className="flex items-center gap-2">
//                 <span className="font-semibold text-slate-700">Reminder Before</span>
//                 <Input
//                   type="number"
//                   value={formData.daysBefore}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, daysBefore: Number(e.target.value) }))
//                   }
//                   className="h-8 w-16 text-center border-slate-200 text-xs rounded-md"
//                 />
//                 <span className="text-slate-500">Days</span>
//               </div>

//               {/* Applicability Checkboxes */}
//               <div className="flex items-center gap-4">
//                 <span className="font-semibold text-slate-700">Applicability -</span>
//                 {(
//                   [
//                     { key: "ess", label: "ESS" },
//                     { key: "hrms", label: "HRMS" },
//                     { key: "sendMail", label: "Send Mail" },
//                     { key: "active", label: "Is Active" },
//                   ] as const
//                 ).map(({ key, label }) => (
//                   <label key={key} className="flex items-center gap-1.5 cursor-pointer">
//                     <Checkbox
//                       checked={formData.applicability[key]}
//                       onCheckedChange={() => toggleOption(key)}
//                       className="h-4 w-4 rounded bg-emerald-600 border-emerald-600 text-white data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
//                     />
//                     <span className="text-slate-600 font-medium">{label}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* EMAIL SUBJECT */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-violet-600 block">
//                 Email Subject
//               </label>
//               <Input
//                 value={formData.subject}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
//                 className="h-10 border-slate-200 text-xs rounded-lg focus-visible:ring-violet-500"
//               />
//             </div>

//             {/* EMAIL BODY WITH TOP-RIGHT AI GENERATE BUTTON */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <label className="text-xs font-semibold text-violet-600">
//                   Email Body
//                 </label>
//                 <Button
//                   type="button"
//                   onClick={handleGenerate}
//                   className="h-8 rounded-lg bg-[#EBE8FC] px-3 text-xs font-semibold text-[#7C5CFC] hover:bg-violet-100 shadow-none border-none flex items-center gap-1.5"
//                 >
//                   <Wand2 className="h-3.5 w-3.5" />
//                   Generate
//                 </Button>
//               </div>

//               {/* EDITOR CONTAINER */}
//               <div className="rounded-xl border border-slate-200 overflow-hidden">
//                 {/* EDITOR TOOLBAR */}
//                 <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/50 p-2 text-slate-600 text-xs">
//                   <select className="h-7 rounded border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none">
//                     <option>Arial</option>
//                     <option>Calibri</option>
//                   </select>

//                   <div className="flex items-center h-7 rounded border border-slate-200 bg-white px-1 text-xs">
//                     <span>Size 3</span>
//                     <ChevronDown className="h-3 w-3 ml-1 text-slate-400" />
//                   </div>

//                   <div className="flex items-center h-7 rounded border border-slate-200 bg-white px-1 text-xs">
//                     <span>Normal</span>
//                     <ChevronDown className="h-3 w-3 ml-1 text-slate-400" />
//                   </div>

//                   <div className="h-4 w-[1px] bg-slate-300 mx-1" />

//                   <button
//                     type="button"
//                     onClick={() => executeCommand("bold")}
//                     className="p-1.5 hover:bg-slate-200 rounded font-bold"
//                   >
//                     <Bold className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => executeCommand("italic")}
//                     className="p-1.5 hover:bg-slate-200 rounded italic"
//                   >
//                     <Italic className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => executeCommand("underline")}
//                     className="p-1.5 hover:bg-slate-200 rounded underline"
//                   >
//                     <Underline className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => executeCommand("strikeThrough")}
//                     className="p-1.5 hover:bg-slate-200 rounded line-through"
//                   >
//                     <Strikethrough className="h-3.5 w-3.5" />
//                   </button>

//                   <div className="h-4 w-[1px] bg-slate-300 mx-1" />

//                   <button
//                     type="button"
//                     onClick={() => executeCommand("insertUnorderedList")}
//                     className="p-1.5 hover:bg-slate-200 rounded"
//                   >
//                     <List className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => executeCommand("insertOrderedList")}
//                     className="p-1.5 hover:bg-slate-200 rounded"
//                   >
//                     <ListOrdered className="h-3.5 w-3.5" />
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => executeCommand("justifyLeft")}
//                     className="p-1.5 hover:bg-slate-200 rounded"
//                   >
//                     <AlignLeft className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => executeCommand("justifyCenter")}
//                     className="p-1.5 hover:bg-slate-200 rounded"
//                   >
//                     <AlignCenter className="h-3.5 w-3.5" />
//                   </button>

//                   <div className="h-4 w-[1px] bg-slate-300 mx-1" />

//                   <button type="button" className="p-1.5 hover:bg-slate-200 rounded">
//                     <Link className="h-3.5 w-3.5" />
//                   </button>
//                   <button type="button" className="p-1.5 hover:bg-slate-200 rounded">
//                     <Code className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => executeCommand("undo")}
//                     className="p-1.5 hover:bg-slate-200 rounded"
//                   >
//                     <Undo className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => executeCommand("redo")}
//                     className="p-1.5 hover:bg-slate-200 rounded"
//                   >
//                     <Redo className="h-3.5 w-3.5" />
//                   </button>
//                 </div>

//                 {/* EDITABLE BODY */}
//                 <div
//                   ref={editorRef}
//                   contentEditable
//                   suppressContentEditableWarning
//                   onBlur={(e) =>
//                     setFormData((prev) => ({ ...prev, body: e.currentTarget.innerHTML }))
//                   }
//                   className="min-h-[260px] p-4 text-xs leading-relaxed text-slate-700 outline-none space-y-3"
//                 />
//               </div>
//             </div>

//             {/* FOOTER */}
//             <div className="flex justify-end gap-3 pt-2">
//               <Button type="button" variant="outline" onClick={handleCancel}>
//                 Cancel
//               </Button>
//               <Button
//                 type="button"
//                 onClick={handleSave}
//                 disabled={isSaving}
//                 className="bg-violet-600 hover:bg-violet-700 text-white"
//               >
//                 {isSaving ? "Saving..." : "Save Changes"}
//               </Button>
//             </div>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// }

























import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Wand2,
  Gift,
  Award,
  CheckCircle2,
  Briefcase,
  FileText,
  Sun,
  UserCheck,
  RefreshCw,
  XCircle,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  Link,
  Code,
  Undo,
  Redo,
  ChevronDown,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { useReminderSettings } from "./hooks/useReminderSettings";
import type { ReminderType } from "./types/settingstypes";

interface ReminderOption {
  label: string;
  type: ReminderType;
  icon: React.ElementType;
}

const REMINDER_OPTIONS: ReminderOption[] = [
  { label: "Birthday", type: "birthday", icon: Gift },
  { label: "Work Anniversary", type: "workAnniversary", icon: Award },
  { label: "Confirmation Date", type: "confirmationDate", icon: CheckCircle2 },
  { label: "Last working day", type: "lastWorkingDay", icon: Briefcase },
  { label: "Probation completion", type: "probationCompletion", icon: FileText },
  { label: "Retirement", type: "retirement", icon: Sun },
  { label: "Interview Reminder", type: "interviewReminder", icon: UserCheck },
  { label: "Subscription Reminder", type: "subscriptionReminder", icon: RefreshCw },
  { label: "Passport Expiry", type: "passportExpiry", icon: XCircle },
];

export default function ReminderSettings() {
  const [selectedType, setSelectedType] = useState<ReminderType>("birthday");
  const editorRef = useRef<HTMLDivElement>(null);

  const {
    formData,
    setFormData,
    isLoading,
    isSaving,
    toggleOption,
    handleSave,
    handleCancel,
  } = useReminderSettings(selectedType);

  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = formData.body || "";
    }
  }, [formData.body]);

  function executeCommand(command: string, value: string | undefined = undefined) {
    document.execCommand(command, false, value);
  }

  function handleGenerate() {
    console.log("Generate");
  }

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {/* LEFT – REMINDERS LIST */}
        <Card className="col-span-12 md:col-span-4 lg:col-span-3 min-w-0 rounded-2xl bg-white p-4 shadow-md border border-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Reminders</h2>
            <Button
              type="button"
              size="icon"
              className="h-7 w-7 rounded-lg border border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100 shadow-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 md:block md:space-y-1 md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {REMINDER_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedType === option.type;
              return (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => setSelectedType(option.type)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all md:w-full ${
                    isSelected
                      ? "bg-[#EBE8FC] text-[#7C5CFC]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isSelected ? "text-[#7C5CFC]" : "text-violet-400"
                    }`}
                  />
                  <span className="whitespace-nowrap">{option.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* RIGHT – CONFIGURATION PANEL */}
        <Card className="col-span-12 md:col-span-8 lg:col-span-9 min-w-0 rounded-2xl bg-white p-4 shadow-md border border-gray-100 space-y-5 sm:p-6 sm:space-y-6">
          {isLoading ? (
            <div className="text-xs text-slate-500">Loading reminder settings…</div>
          ) : (
            <>
              {/* TOP ROW */}
              <div className="flex flex-col gap-3 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Reminder Before</span>
                  <Input
                    type="number"
                    value={formData.daysBefore}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        daysBefore: Number(e.target.value),
                      }))
                    }
                    className="h-8 w-16 text-center border-slate-200 text-xs rounded-md"
                  />
                  <span className="text-slate-500">Days</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className="font-semibold text-slate-700">Applicability -</span>
                  {(
                    [
                      { key: "ess", label: "ESS" },
                      { key: "hrms", label: "HRMS" },
                      { key: "sendMail", label: "Send Mail" },
                      { key: "active", label: "Is Active" },
                    ] as const
                  ).map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                      <Checkbox
                        checked={formData.applicability[key]}
                        onCheckedChange={() => toggleOption(key)}
                        className="h-4 w-4 rounded data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                      />
                      <span className="text-slate-600 font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* EMAIL SUBJECT */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-violet-600 block">
                  Email Subject
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  className="h-10 border-slate-200 text-xs rounded-lg focus-visible:ring-violet-500"
                />
              </div>

              {/* EMAIL BODY */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-violet-600">
                    Email Body
                  </label>
                  <Button
                    type="button"
                    onClick={handleGenerate}
                    className="h-8 shrink-0 rounded-lg bg-[#EBE8FC] px-3 text-xs font-semibold text-[#7C5CFC] hover:bg-violet-100 shadow-none border-none flex items-center gap-1.5"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    Generate
                  </Button>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  {/* TOOLBAR */}
                  <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/50 p-2 text-slate-600 text-xs">
                    <select className="h-7 rounded border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none">
                      <option>Arial</option>
                      <option>Calibri</option>
                    </select>

                    <div className="flex items-center h-7 rounded border border-slate-200 bg-white px-1.5 text-xs">
                      <span>Size 3</span>
                      <ChevronDown className="h-3 w-3 ml-1 text-slate-400" />
                    </div>

                    <div className="flex items-center h-7 rounded border border-slate-200 bg-white px-1.5 text-xs">
                      <span>Normal</span>
                      <ChevronDown className="h-3 w-3 ml-1 text-slate-400" />
                    </div>

                    <div className="h-4 w-px bg-slate-300 mx-0.5" />

                    <button type="button" onClick={() => executeCommand("bold")} className="p-1.5 hover:bg-slate-200 rounded">
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => executeCommand("italic")} className="p-1.5 hover:bg-slate-200 rounded">
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => executeCommand("underline")} className="p-1.5 hover:bg-slate-200 rounded">
                      <Underline className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => executeCommand("strikeThrough")} className="p-1.5 hover:bg-slate-200 rounded">
                      <Strikethrough className="h-3.5 w-3.5" />
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-0.5" />

                    <button type="button" onClick={() => executeCommand("insertUnorderedList")} className="p-1.5 hover:bg-slate-200 rounded">
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => executeCommand("insertOrderedList")} className="p-1.5 hover:bg-slate-200 rounded">
                      <ListOrdered className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => executeCommand("justifyLeft")} className="p-1.5 hover:bg-slate-200 rounded">
                      <AlignLeft className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => executeCommand("justifyCenter")} className="p-1.5 hover:bg-slate-200 rounded">
                      <AlignCenter className="h-3.5 w-3.5" />
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-0.5" />

                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded">
                      <Link className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded">
                      <Code className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => executeCommand("undo")} className="p-1.5 hover:bg-slate-200 rounded">
                      <Undo className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => executeCommand("redo")} className="p-1.5 hover:bg-slate-200 rounded">
                      <Redo className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* EDITABLE AREA */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        body: e.currentTarget.innerHTML,
                      }))
                    }
                    className="min-h-[180px] sm:min-h-[240px] p-3 sm:p-4 text-xs leading-relaxed text-slate-700 outline-none"
                  />
                </div>
              </div>

              {/* FOOTER BUTTONS */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white sm:w-auto"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}