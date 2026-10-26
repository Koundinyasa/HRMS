





import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Mark, mergeAttributes, type CommandProps } from "@tiptap/core";

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
  ChevronDown,
  Check,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEmailSettings } from "./hooks/useEmailSettings";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

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
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: CommandProps) =>
          chain().setMark("fontSize", { size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: CommandProps) =>
          chain().unsetMark("fontSize").run(),
    };
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

// Dropdown options are plain strings, so labels are mapped to real values here.
const FONT_SIZE_MAP: Record<string, string> = {
  "Size 1": "12px",
  "Size 2": "14px",
  "Size 3": "16px",
  "Size 4": "18px",
  "Size 5": "24px",
  "Size 6": "32px",
};
const fontSizeOptions = Object.keys(FONT_SIZE_MAP);

const HEADING_MAP: Record<string, string> = {
  Normal: "normal",
  "Heading 1": "1",
  "Heading 2": "2",
  "Heading 3": "3",
};
const headingOptions = Object.keys(HEADING_MAP);

const FONT_FAMILIES = ["Arial", "Calibri", "Times New Roman"];

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
    loadError,
    message,
    handleSave,
  } = useEmailSettings();

  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("Size 3");
  const [headingLevel, setHeadingLevel] = useState("Normal");

  const allTypeOptions =
    emailTypes && emailTypes.length > 0
      ? emailTypes.map((et) => et.name)
      : ["Pay Slip", "Offer Letter", "Appointment Letter"];

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

  useEffect(() => {
    if (editor && body && body !== editor.getHTML()) {
      editor.commands.setContent(body);
    }
  }, [body, editor]);

  const handleInsertVariable = (varValue: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(varValue).run();
  };

  if (isLoading) {
    return (
      <div className="p-4 text-xs text-[#626262] sm:p-6">Loading email settings…</div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-4 bg-[#F6F3FF] text-[#2E2E2E] sm:space-y-5">
      {loadError && (
        <div
          role="alert"
          className="rounded-xl border border-[#FAD5D1] bg-[#FAD5D1]/40 px-3 py-2 text-xs font-medium text-[#DD3232]"
        >
          Could not load email settings from the server. Showing default template.
        </div>
      )}
      <div className="grid w-full min-w-0 grid-cols-12 gap-3 sm:gap-6">
        {/* LEFT PANEL */}
        <Card className="col-span-12 min-w-0 space-y-4 rounded-2xl border-none bg-white p-3 shadow-sm sm:p-5 lg:col-span-4">
          {/* Email Type */}
          <div className="min-w-0 space-y-1.5">
            <Label className="font-['Urbanist',_sans-serif] text-[13px] font-semibold text-[#2E2E2E]">
              Type <span className="text-[#DD3232]">*</span>
            </Label>
            <ResponsiveSelect
              value={type}
              onValueChange={setType}
              options={typeOptions}
              className="!h-10 !text-xs"
            />
            {type !== "Pay Slip" && (
              <p className="mt-1 text-[11px] text-[#FF6200]">
                Saving isn't available yet for this email type.
              </p>
            )}
          </div>

          {/* Email Subject */}
          <div className="min-w-0 space-y-1.5">
            <Label className="font-['Urbanist',_sans-serif] text-[13px] font-semibold text-[#2E2E2E]">
              Subject <span className="text-[#DD3232]">*</span>
            </Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 rounded-xl border-[#EDEDED] text-base focus-visible:ring-[#5932E9] sm:text-xs"
            />
          </div>

          {/* Variables Container */}
          <div className="grid max-h-[200px] grid-cols-1 gap-x-4 gap-y-1 overflow-y-auto rounded-xl bg-[#ECE7FF] p-3 sm:max-h-[240px] sm:grid-cols-2 sm:p-4 lg:max-h-[480px] lg:grid-cols-1 lg:gap-y-2.5">
            {variablesList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleInsertVariable(item.value)}
                className="cursor-pointer break-all rounded-md py-1.5 text-xs font-medium text-[#2E2E2E] transition-colors hover:text-[#4726BA] active:bg-white/60 lg:py-0"
              >
                {item.label} :{" "}
                <span className="text-[#2E2E2E]">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
        {/* RIGHT PANEL */}
        <div className="col-span-12 min-w-0 space-y-3 sm:space-y-4 lg:col-span-8">
          <Card className="min-w-0 space-y-3 rounded-2xl border-none bg-white p-3 shadow-sm sm:space-y-4 sm:p-6">
            {/* Header / Action */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#5932E9] tracking-wide uppercase">
                MESSAGE 1
              </span>
              <Button
                type="button"
                className="h-8 shrink-0 rounded-lg bg-[#ECE7FF] px-3 text-xs font-semibold text-[#5932E9] hover:bg-[#ECE7FF] shadow-none border-none flex items-center gap-1.5"
              >
                <Wand2 className="h-3.5 w-3.5" />
                Generate
              </Button>
            </div>

            {/* Editor Box */}
            <div className="min-w-0 overflow-hidden rounded-xl border border-[#EDEDED]">
              {/* Toolbar */}
              <div className="settings-toolbar flex flex-wrap items-center gap-1.5 border-b border-[#EDEDED] bg-[#EDEDED]/50 p-1.5 text-xs text-[#2E2E2E] sm:gap-1 sm:p-2">
                <ResponsiveSelect
                  value={fontFamily}
                  onValueChange={setFontFamily}
                  options={FONT_FAMILIES}
                  className="!h-9 !w-auto !min-w-[110px] !text-xs !rounded-lg sm:!h-8 sm:!min-w-[120px]"
                />
                <ResponsiveSelect
                  value={fontSize}
                  onValueChange={(label) => {
                    setFontSize(label);
                    editor
                      ?.chain()
                      .focus()
                      .setFontSize(FONT_SIZE_MAP[label] ?? "16px")
                      .run();
                  }}
                  options={fontSizeOptions}
                  className="!h-9 !w-auto !min-w-[90px] !text-xs !rounded-lg sm:!h-8 sm:!min-w-[96px]"
                />
                <ResponsiveSelect
                  value={headingLevel}
                  onValueChange={(label) => {
                    setHeadingLevel(label);
                    const value = HEADING_MAP[label] ?? "normal";
                    if (value === "normal") {
                      editor?.chain().focus().setParagraph().run();
                    } else {
                      const level = Number(value) as 1 | 2 | 3;
                      editor?.chain().focus().toggleHeading({ level }).run();
                    }
                  }}
                  options={headingOptions}
                  className="!h-9 !w-auto !min-w-[110px] !text-xs !rounded-lg sm:!h-8 sm:!min-w-[120px]"
                />

                <div className="mx-0.5 hidden h-4 w-px bg-[#DDDDDD] sm:mx-1 sm:block" />

                {/* Styling Buttons */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`rounded p-2 hover:bg-[#DDDDDD] sm:p-1.5 ${
                    editor?.isActive("bold") ? "bg-[#DDDDDD] text-[#4726BA]" : ""
                  }`}
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`rounded p-2 hover:bg-[#DDDDDD] sm:p-1.5 ${
                    editor?.isActive("italic") ? "bg-[#DDDDDD] text-[#4726BA]" : ""
                  }`}
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`rounded p-2 hover:bg-[#DDDDDD] sm:p-1.5 ${
                    editor?.isActive("underline") ? "bg-[#DDDDDD] text-[#4726BA]" : ""
                  }`}
                >
                  <UnderlineIcon className="h-3.5 w-3.5" />
                </button>

                <div className="mx-0.5 hidden h-4 w-px bg-[#DDDDDD] sm:mx-1 sm:block" />
                {/* Alignments */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                  className={`rounded p-2 hover:bg-[#DDDDDD] sm:p-1.5 ${
                    editor?.isActive({ textAlign: "left" }) ? "bg-[#DDDDDD] text-[#4726BA]" : ""
                  }`}
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                  className={`rounded p-2 hover:bg-[#DDDDDD] sm:p-1.5 ${
                    editor?.isActive({ textAlign: "center" }) ? "bg-[#DDDDDD] text-[#4726BA]" : ""
                  }`}
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                  className={`rounded p-2 hover:bg-[#DDDDDD] sm:p-1.5 ${
                    editor?.isActive({ textAlign: "right" }) ? "bg-[#DDDDDD] text-[#4726BA]" : ""
                  }`}
                >
                  <AlignRight className="h-3.5 w-3.5" />
                </button>

                <div className="mx-0.5 hidden h-4 w-px bg-[#DDDDDD] sm:mx-1 sm:block" />
                {/* Lists */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`rounded p-2 hover:bg-[#DDDDDD] sm:p-1.5 ${
                    editor?.isActive("bulletList") ? "bg-[#DDDDDD] text-[#4726BA]" : ""
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`rounded p-2 hover:bg-[#DDDDDD] sm:p-1.5 ${
                    editor?.isActive("orderedList") ? "bg-[#DDDDDD] text-[#4726BA]" : ""
                  }`}
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* TipTap Editor Area */}
              <div className="min-h-[200px] overflow-x-auto p-3 text-sm leading-relaxed text-[#2E2E2E] outline-none sm:min-h-[340px] sm:p-5 sm:text-xs">
                <EditorContent
                  editor={editor}
                  className="prose max-w-none break-words focus:outline-none min-h-[160px] sm:min-h-[300px] [&_.ProseMirror]:break-words [&_img]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_.ProseMirror]:min-h-[160px] [&_.ProseMirror]:outline-none sm:[&_.ProseMirror]:min-h-[300px]"
                />
              </div>
            </div>
          </Card>

          {/* Warning Banner */}
          <div className="flex items-start gap-2.5 rounded-xl border border-[#FAD5D1] bg-[#FAD5D1]/40 p-3 text-xs text-[#DD3232] sm:p-3.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#DD3232] mt-0.5" />
            <span className="min-w-0 break-words">
              Please do not modify the variables (e.g. <strong>{"{username}"}</strong>) or insert extra spaces between the lines.
            </span>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-2.5 rounded-xl border border-[#ECE7FF] bg-[#ECE7FF]/60 p-3 text-xs text-[#2E2E2E] sm:p-3.5">
            <Info className="h-4 w-4 shrink-0 text-[#5932E9] mt-0.5" />
            <span className="min-w-0 break-words">
              Click the security icon to enable password protection for the Employee Payslip.
            </span>
          </div>

          {message && (
            <div
              role="status"
              className={`rounded-xl border px-3 py-2 text-xs font-medium ${
                message.type === "success"
                  ? "border-[#F5FFFA] bg-[#F5FFFA] text-[#10B981]"
                  : "border-[#FAD5D1] bg-[#FAD5D1]/40 text-[#DD3232]"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || type !== "Pay Slip"}
              className="h-10 w-full rounded-xl bg-[#5932E9] px-5 text-xs font-semibold text-white hover:bg-[#4726BA] shadow-sm flex items-center justify-center gap-2 sm:w-auto"
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