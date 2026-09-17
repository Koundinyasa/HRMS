// import { useEffect } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
// import { Mark, mergeAttributes } from "@tiptap/core";

// import {
//   Bold,
//   Italic,
//   Underline as UnderlineIcon,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   List,
//   ListOrdered,
//   Wand2,
//   ChevronDown,
//   AlertTriangle,
//   Info,
//   Save,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { useEmailSettings } from "./hooks/useEmailSettings";

// // Custom font-size mark — built on @tiptap/core only, no extra package needed
// const FontSize = Mark.create({
//   name: "fontSize",
//   addAttributes() {
//     return {
//       size: {
//         default: null,
//         parseHTML: (element: HTMLElement) => element.style.fontSize || null,
//         renderHTML: (attributes: { size?: string }) => {
//           if (!attributes.size) return {};
//           return { style: `font-size: ${attributes.size}` };
//         },
//       },
//     };
//   },
//   parseHTML() {
//     return [{ style: "font-size" }];
//   },
//   renderHTML({ HTMLAttributes }: any) {
//     return ["span", mergeAttributes(HTMLAttributes), 0];
//   },
//   addCommands() {
//     return {
//       setFontSize:
//         (size: string) =>
//         ({ chain }: any) =>
//           chain().setMark("fontSize", { size }).run(),
//       unsetFontSize:
//         () =>
//         ({ chain }: any) =>
//           chain().unsetMark("fontSize").run(),
//     } as any;
//   },
// });

// const variablesList = [
//   { label: "User Name", value: "{username}" },
//   { label: "Employee Name", value: "{empname}" },
//   { label: "Company Name", value: "{companyname}" },
//   { label: "HR Name", value: "{hrname}" },
//   { label: "Designation", value: "{designation}" },
//   { label: "Link", value: "{link}" },
//   { label: "Logo", value: "{logo}" },
//   { label: "Month Year", value: "{monthyear}" },
//   { label: "Password", value: "{password}" },
//   { label: "Login User", value: "{loginuser}" },
//   { label: "Leave Date", value: "{leavedate}" },
//   { label: "From Date", value: "{fromdate}" },
//   { label: "To Date", value: "{todate}" },
//   { label: "Reason", value: "{reason}" },
//   { label: "Leave", value: "{leave}" },
//   { label: "Approver Name", value: "{approvername}" },
//   { label: "Portal Link", value: "{portallink}" },
//   { label: "Emp Leave Details", value: "{empleavedetails}" },
// ];

// export default function EmailSettings() {
//   const {
//     emailTypes,
//     type,
//     setType,
//     subject,
//     setSubject,
//     body,
//     setBody,
//     isLoading,
//     isSaving,
//     handleSave,
//   } = useEmailSettings();

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       FontSize,
//       TextAlign.configure({
//         types: ["heading", "paragraph"],
//       }),
//     ],
//     content: body,
//     onUpdate: ({ editor }) => {
//       setBody(editor.getHTML());
//     },
//   });

//   // Sync content from hook → editor
//   useEffect(() => {
//     if (editor && body && body !== editor.getHTML()) {
//       editor.commands.setContent(body);
//     }
//   }, [body, editor]);

//   // Insert variable tag into TipTap editor
//   const handleInsertVariable = (varValue: string) => {
//     if (!editor) return;
//     editor.chain().focus().insertContent(varValue).run();
//   };

//   if (isLoading) {
//     return (
//       <div className="p-6 text-xs text-slate-500">Loading email settings…</div>
//     );
//   }

//   return (
//     <div className="w-full space-y-5 bg-[#F5F6FA] text-slate-700">
//       <div className="grid grid-cols-12 gap-6">
//         {/* LEFT PANEL */}
//         <Card className="col-span-4 rounded-2xl border-none bg-white p-5 shadow-sm space-y-4">
//           {/* Email Type */}
//           <div className="space-y-1.5">
//             <Label className="text-xs font-medium text-slate-700">
//               Type <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <select
//                 value={type}
//                 onChange={(e) => setType(e.target.value)}
//                 className="w-full h-10 appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs text-slate-800 outline-none focus:border-violet-500"
//               >
//                 {emailTypes && emailTypes.length > 0 ? (
//                   emailTypes.map((et) => (
//                     <option key={et.id} value={et.name}>
//                       {et.name}
//                     </option>
//                   ))
//                 ) : (
//                   <>
//                     <option value="Pay Slip">Pay Slip</option>
//                     <option value="Offer Letter">Offer Letter</option>
//                     <option value="Appointment Letter">
//                       Appointment Letter
//                     </option>
//                   </>
//                 )}
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-600 pointer-events-none" />
//             </div>
//             {type !== "Pay Slip" && (
//               <p className="mt-1 text-[11px] text-amber-600">
//                 Saving isn't available yet for this email type.
//               </p>
//             )}
//           </div>

//           {/* Email Subject */}
//           <div className="space-y-1.5">
//             <Label className="text-xs font-medium text-slate-700">
//               Subject <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               className="h-10 border-slate-200 text-xs rounded-xl focus-visible:ring-violet-500"
//             />
//           </div>

//           {/* Variables Container */}
//           <div className="rounded-xl bg-[#F0EEFF] p-4 space-y-2.5 max-h-[480px] overflow-y-auto">
//             {variablesList.map((item, idx) => (
//               <div
//                 key={idx}
//                 onClick={() => handleInsertVariable(item.value)}
//                 className="text-xs text-slate-700 font-medium cursor-pointer hover:text-violet-700 transition-colors"
//               >
//                 {item.label} :{" "}
//                 <span className="text-slate-600">{item.value}</span>
//               </div>
//             ))}
//           </div>
//         </Card>
//         {/* RIGHT PANEL */}
//         <div className="col-span-8 space-y-4">
//           <Card className="rounded-2xl border-none bg-white p-6 shadow-sm space-y-4">
//             {/* Header / Action */}
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-bold text-violet-600 tracking-wide uppercase">
//                 MESSAGE 1
//               </span>
//               <Button
//                 type="button"
//                 className="h-8 rounded-lg bg-[#EBE8FC] px-3 text-xs font-semibold text-[#7C5CFC] hover:bg-violet-100 shadow-none border-none flex items-center gap-1.5"
//               >
//                 <Wand2 className="h-3.5 w-3.5" />
//                 Generate
//               </Button>
//             </div>

//             {/* Editor Box */}
//             <div className="rounded-xl border border-slate-200 overflow-hidden">
//               {/* Toolbar */}
//               <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/50 p-2 text-slate-600 text-xs">
//                 <select className="h-7 rounded border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none">
//                   <option>Arial</option>
//                   <option>Calibri</option>
//                   <option>Times New Roman</option>
//                 </select>
//                 <select
//                   onChange={(e) =>
//                     editor?.chain().focus().setFontSize(e.target.value).run()
//                   }
//                   className="h-7 rounded border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none"
//                   defaultValue="16px"
//                 >
//                   <option value="12px">Size 1</option>
//                   <option value="14px">Size 2</option>
//                   <option value="16px">Size 3</option>
//                   <option value="18px">Size 4</option>
//                   <option value="24px">Size 5</option>
//                   <option value="32px">Size 6</option>
//                 </select>
//                 <select
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     if (value === "normal") {
//                       editor?.chain().focus().setParagraph().run();
//                     } else {
//                       const level = Number(value) as 1 | 2 | 3;
//                       editor?.chain().focus().toggleHeading({ level }).run();
//                     }
//                   }}
//                   className="h-7 rounded border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none"
//                   defaultValue="normal"
//                 >
//                   <option value="normal">Normal</option>
//                   <option value="1">Heading 1</option>
//                   <option value="2">Heading 2</option>
//                   <option value="3">Heading 3</option>
//                 </select>

//                 <div className="h-4 w-[1px] bg-slate-300 mx-1" />

//                 {/* Styling Buttons */}
//                 <button
//                   type="button"
//                   onClick={() => editor?.chain().focus().toggleBold().run()}
//                   className={`p-1.5 rounded hover:bg-slate-200 ${
//                     editor?.isActive("bold") ? "bg-slate-200 text-violet-700" : ""
//                   }`}
//                 >
//                   <Bold className="h-3.5 w-3.5" />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => editor?.chain().focus().toggleItalic().run()}
//                   className={`p-1.5 rounded hover:bg-slate-200 ${
//                     editor?.isActive("italic") ? "bg-slate-200 text-violet-700" : ""
//                   }`}
//                 >
//                   <Italic className="h-3.5 w-3.5" />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => editor?.chain().focus().toggleUnderline().run()}
//                   className={`p-1.5 rounded hover:bg-slate-200 ${
//                     editor?.isActive("underline") ? "bg-slate-200 text-violet-700" : ""
//                   }`}
//                 >
//                   <UnderlineIcon className="h-3.5 w-3.5" />
//                 </button>

//                 <div className="h-4 w-[1px] bg-slate-300 mx-1" />
//                 {/* Alignments */}
//                 <button
//                   type="button"
//                   onClick={() => editor?.chain().focus().setTextAlign("left").run()}
//                   className={`p-1.5 rounded hover:bg-slate-200 ${
//                     editor?.isActive({ textAlign: "left" }) ? "bg-slate-200 text-violet-700" : ""
//                   }`}
//                 >
//                   <AlignLeft className="h-3.5 w-3.5" />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => editor?.chain().focus().setTextAlign("center").run()}
//                   className={`p-1.5 rounded hover:bg-slate-200 ${
//                     editor?.isActive({ textAlign: "center" }) ? "bg-slate-200 text-violet-700" : ""
//                   }`}
//                 >
//                   <AlignCenter className="h-3.5 w-3.5" />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => editor?.chain().focus().setTextAlign("right").run()}
//                   className={`p-1.5 rounded hover:bg-slate-200 ${
//                     editor?.isActive({ textAlign: "right" }) ? "bg-slate-200 text-violet-700" : ""
//                   }`}
//                 >
//                   <AlignRight className="h-3.5 w-3.5" />
//                 </button>

//                 <div className="h-4 w-[1px] bg-slate-300 mx-1" />
//                 {/* Lists */}
//                 <button
//                   type="button"
//                   onClick={() => editor?.chain().focus().toggleBulletList().run()}
//                   className={`p-1.5 rounded hover:bg-slate-200 ${
//                     editor?.isActive("bulletList") ? "bg-slate-200 text-violet-700" : ""
//                   }`}
//                 >
//                   <List className="h-3.5 w-3.5" />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => editor?.chain().focus().toggleOrderedList().run()}
//                   className={`p-1.5 rounded hover:bg-slate-200 ${
//                     editor?.isActive("orderedList") ? "bg-slate-200 text-violet-700" : ""
//                   }`}
//                 >
//                   <ListOrdered className="h-3.5 w-3.5" />
//                 </button>
//               </div>

//               {/* TipTap Editor Area */}
//               <div className="min-h-[340px] p-5 text-xs leading-relaxed text-slate-700 outline-none">
//                 <EditorContent
//                   editor={editor}
//                   className="prose max-w-none focus:outline-none min-h-[300px]"
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Warning Banner */}
//           <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/60 p-3.5 text-xs text-red-600">
//             <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
//             <span>
//               Please do not modify the variables (e.g. <strong>{"{username}"}</strong>) or insert extra spaces between the lines.
//             </span>
//           </div>

//           {/* Info Banner */}
//           <div className="flex items-center gap-2.5 rounded-xl border border-violet-100 bg-violet-50/60 p-3.5 text-xs text-slate-600">
//             <Info className="h-4 w-4 shrink-0 text-violet-500" />
//             <span>
//               Click the security icon to enable password protection for the Employee Payslip.
//             </span>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 pt-2">
//             <Button
//               type="button"
//               onClick={handleSave}
//               disabled={isSaving || type !== "Pay Slip"}
//               className="h-10 rounded-xl bg-[#7C5CFC] px-5 text-xs font-semibold text-white hover:bg-violet-700 shadow-sm flex items-center gap-2"
//             >
//               <Save className="h-4 w-4" />
//               {isSaving ? "Saving..." : "Save Changes"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

















import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Mark, mergeAttributes } from "@tiptap/core";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Wand2,
  AlertTriangle,
  Info,
  Save,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StyledSelect } from "@/components/ui/select";

import { useEmailSettings } from "./hooks/useEmailSettings";

// Custom font-size mark — built on @tiptap/core only, no extra package needed
const FontSize = Mark.create({
  name: "fontSize",
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
        renderHTML: (attributes: { size?: string }) => {
          if (!attributes.size) return {};
          return { style: `font-size: ${attributes.size}` };
        },
      },
    };
  },
  parseHTML() {
    return [{ style: "font-size" }];
  },
  renderHTML({ HTMLAttributes }: any) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: any) =>
          chain().setMark("fontSize", { size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: any) =>
          chain().unsetMark("fontSize").run(),
    } as any;
  },                
});

const variablesList = [
  { label: "User Name", value: "{username}" },
  { label: "Employee Name", value: "{empname}" },
  { label: "Company Name", value: "{companyname}" },
  { label: "HR Name", value: "{hrname}" },
  { label: "Designation", value: "{designation}" },
  { label: "Link", value: "{link}" },
  { label: "Logo", value: "{logo}" },
  { label: "Month Year", value: "{monthyear}" },
  { label: "Password", value: "{password}" },
  { label: "Login User", value: "{loginuser}" },
  { label: "Leave Date", value: "{leavedate}" },
  { label: "From Date", value: "{fromdate}" },
  { label: "To Date", value: "{todate}" },
  { label: "Reason", value: "{reason}" },
  { label: "Leave", value: "{leave}" },
  { label: "Approver Name", value: "{approvername}" },
  { label: "Portal Link", value: "{portallink}" },
  { label: "Emp Leave Details", value: "{empleavedetails}" },
];

const fontSizeOptions = [
  { label: "Size 1", value: "12px" },
  { label: "Size 2", value: "14px" },
  { label: "Size 3", value: "16px" },
  { label: "Size 4", value: "18px" },
  { label: "Size 5", value: "24px" },
  { label: "Size 6", value: "32px" },
];

const headingOptions = [
  { label: "Normal", value: "normal" },
  { label: "Heading 1", value: "1" },
  { label: "Heading 2", value: "2" },
  { label: "Heading 3", value: "3" },
];

export default function EmailSettings() {
  const {
    emailTypes,                
    type,
    setType,
    subject,
    setSubject,          
    body,
    setBody,
    isLoading,
    isSaving,
    handleSave,
  } = useEmailSettings();

  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("16px");
  const [headingLevel, setHeadingLevel] = useState("normal");

  const allTypeOptions =
    emailTypes && emailTypes.length > 0
      ? emailTypes.map((et) => et.name)
      : ["Pay Slip", "Offer Letter", "Appointment Letter"];

  // Show only the OTHER items — the currently selected type is already
  // shown in the closed trigger via `value`, so it must not also appear
  // inside the option list or it renders twice (once in the trigger,
  // once again as a list item).
  const typeOptions = [
  type,
  ...allTypeOptions.filter((option) => option !== type),
].slice(0, 3);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: body,
    onUpdate: ({ editor }) => {
      setBody(editor.getHTML());
    },
  });

  // Sync content from hook → editor
  useEffect(() => {
    if (editor && body && body !== editor.getHTML()) {
      editor.commands.setContent(body);
    }
  }, [body, editor]);

  // Insert variable tag into TipTap editor
  const handleInsertVariable = (varValue: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(varValue).run();
  };

  if (isLoading) {
    return (
      <div className="p-6 text-xs text-slate-500">Loading email settings…</div>
    );
  }

  return (
    <div className="w-full space-y-5 bg-[#F5F6FA] text-slate-700">
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {/* LEFT PANEL */}
        <Card className="col-span-12 lg:col-span-4 rounded-2xl border-none bg-white p-4 shadow-sm space-y-4 sm:p-5">
          {/* Email Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">
              Type <span className="text-red-500">*</span>
            </Label>
            <StyledSelect
              value={type}
              onValueChange={setType}
              options={typeOptions}
              className="!h-10 !text-xs"
            />
            {type !== "Pay Slip" && (
              <p className="mt-1 text-[11px] text-amber-600">
                Saving isn't available yet for this email type.
              </p>
            )}
          </div>

          {/* Email Subject */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 border-slate-200 text-xs rounded-xl focus-visible:ring-violet-500"
            />
          </div>

          {/* Variables Container */}
          <div className="rounded-xl bg-[#F0EEFF] p-4 space-y-2.5 max-h-[260px] overflow-y-auto lg:max-h-[480px]">
            {variablesList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleInsertVariable(item.value)}
                className="text-xs text-slate-700 font-medium cursor-pointer hover:text-violet-700 transition-colors"
              >
                {item.label} :{" "}
                <span className="text-slate-600">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
        {/* RIGHT PANEL */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Card className="rounded-2xl border-none bg-white p-4 shadow-sm space-y-4 sm:p-6">
            {/* Header / Action */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-violet-600 tracking-wide uppercase">
                MESSAGE 1
              </span>
              <Button
                type="button"
                className="h-8 shrink-0 rounded-lg bg-[#EBE8FC] px-3 text-xs font-semibold text-[#7C5CFC] hover:bg-violet-100 shadow-none border-none flex items-center gap-1.5"
              >
                <Wand2 className="h-3.5 w-3.5" />
                Generate
              </Button>
            </div>

            {/* Editor Box */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/50 p-2 text-slate-600 text-xs">
                <StyledSelect
                  value={fontFamily}
                  onValueChange={setFontFamily}
                  options={["Arial", "Calibri", "Times New Roman"]}
                  className="!h-7 !w-auto !min-w-[112px] !text-xs !px-2 !rounded-md"
                />
                <StyledSelect
                  value={fontSize}
                  onValueChange={(value) => {
                    setFontSize(value);
                    editor?.chain().focus().setFontSize(value).run();      
                  }}
                  options={fontSizeOptions}
                  className="!h-7 !w-auto !min-w-[80px] !text-xs !px-2 !rounded-md"
                />
                <StyledSelect
                  value={headingLevel}
                  onValueChange={(value) => {
                    setHeadingLevel(value);
                    if (value === "normal") {
                      editor?.chain().focus().setParagraph().run();
                    } else {
                      const level = Number(value) as 1 | 2 | 3;
                      editor?.chain().focus().toggleHeading({ level }).run();
                    }
                  }}
                  options={headingOptions}              
                  className="!h-7 !w-auto !min-w-[112px] !text-xs !px-2 !rounded-md"                          
                />

                <div className="h-4 w-[1px] bg-slate-300 mx-1" />             

                {/* Styling Buttons */}                   
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded hover:bg-slate-200 ${
                    editor?.isActive("bold") ? "bg-slate-200 text-violet-700" : ""
                  }`}
                >
                  <Bold className="h-3.5 w-3.5" />         
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded hover:bg-slate-200 ${
                    editor?.isActive("italic") ? "bg-slate-200 text-violet-700" : ""
                  }`}
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`p-1.5 rounded hover:bg-slate-200 ${
                    editor?.isActive("underline") ? "bg-slate-200 text-violet-700" : ""
                  }`}
                >
                  <UnderlineIcon className="h-3.5 w-3.5" />
                </button>

                <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                {/* Alignments */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                  className={`p-1.5 rounded hover:bg-slate-200 ${
                    editor?.isActive({ textAlign: "left" }) ? "bg-slate-200 text-violet-700" : ""
                  }`}
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                  className={`p-1.5 rounded hover:bg-slate-200 ${
                    editor?.isActive({ textAlign: "center" }) ? "bg-slate-200 text-violet-700" : ""
                  }`}
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                  className={`p-1.5 rounded hover:bg-slate-200 ${
                    editor?.isActive({ textAlign: "right" }) ? "bg-slate-200 text-violet-700" : ""
                  }`}
                >
                  <AlignRight className="h-3.5 w-3.5" />
                </button>

                <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                {/* Lists */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded hover:bg-slate-200 ${
                    editor?.isActive("bulletList") ? "bg-slate-200 text-violet-700" : ""
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-1.5 rounded hover:bg-slate-200 ${
                    editor?.isActive("orderedList") ? "bg-slate-200 text-violet-700" : ""
                  }`}
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* TipTap Editor Area */}
              <div className="min-h-[220px] p-3 text-xs leading-relaxed text-slate-700 outline-none sm:min-h-[340px] sm:p-5">
                <EditorContent
                  editor={editor}
                  className="prose max-w-none focus:outline-none min-h-[180px] sm:min-h-[300px]"
                />
              </div>
            </div>
          </Card>

          {/* Warning Banner */}
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/60 p-3.5 text-xs text-red-600">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <span>
              Please do not modify the variables (e.g. <strong>{"{username}"}</strong>) or insert extra spaces between the lines.
            </span>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-2.5 rounded-xl border border-violet-100 bg-violet-50/60 p-3.5 text-xs text-slate-600">
            <Info className="h-4 w-4 shrink-0 text-violet-500 mt-0.5" />
            <span>
              Click the security icon to enable password protection for the Employee Payslip.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || type !== "Pay Slip"}
              className="h-10 w-full rounded-xl bg-[#7C5CFC] px-5 text-xs font-semibold text-white hover:bg-violet-700 shadow-sm flex items-center justify-center gap-2 sm:w-auto"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}