





import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  ChevronDown,
  Check,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEmailSettings } from "./hooks/useEmailSettings";

/**
 * Compact, fully responsive dropdown (same props as StyledSelect: value / onValueChange / options).
 * - Shows 4 rows at a time and scrolls for the rest (e.g. days 1-31).
 * - The list is rendered in a portal with fixed positioning, so no card / editor box can clip it.
 * - Opens under the field, flips upward when there is no room, and never leaves the screen.
 * className is applied to the wrapper (height / width overrides).
 */
const SELECT_ITEM_HEIGHT = 40;
const SELECT_VISIBLE_ROWS = 4;

function ResponsiveSelect({
  value,
  onValueChange,
  options,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pos, setPos] = useState<{
    left: number;
    width: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const wanted =
      SELECT_ITEM_HEIGHT * Math.min(options.length, SELECT_VISIBLE_ROWS) + 10;
    const spaceBelow = vh - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const openUp = spaceBelow < wanted && spaceAbove > spaceBelow;
    const width = Math.min(Math.max(rect.width, 140), vw - 16);
    const left = Math.max(8, Math.min(rect.left, vw - width - 8));
    const room = openUp ? spaceAbove : spaceBelow;
    setPos({
      left,
      width,
      maxHeight: Math.max(Math.min(wanted, room), SELECT_ITEM_HEIGHT + 10),
      ...(openUp
        ? { bottom: vh - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
  }, [options.length]);

  const openList = () => {
    const idx = options.indexOf(value);
    setActiveIndex(idx >= 0 ? idx : 0);
    place();
    setOpen(true);
  };

  const choose = (option: string) => {
    onValueChange(option);
    setOpen(false);
    triggerRef.current?.focus();
  };

  // keep the list attached to the field, close on outside click / page scroll
  useEffect(() => {
    if (!open) return;
    const onResize = () => place();
    const onScroll = (e: Event) => {
      if (listRef.current && listRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (listRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open, place]);

  // bring the highlighted row into view (also on first open)
  useEffect(() => {
    if (!open || !pos || !listRef.current) return;
    const top = activeIndex * SELECT_ITEM_HEIGHT;
    const box = listRef.current;
    if (top < box.scrollTop) box.scrollTop = top;
    else if (top + SELECT_ITEM_HEIGHT > box.scrollTop + box.clientHeight - 8)
      box.scrollTop = top + SELECT_ITEM_HEIGHT - box.clientHeight + 8;
  }, [open, pos, activeIndex]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "Escape" || e.key === "Tab") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (options[activeIndex] !== undefined) choose(options[activeIndex]);
    }
  };

  return (
    <div
      className={`relative h-11 w-full min-w-0 max-w-full rounded-xl text-[14px] ${className}`}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex h-full w-full min-w-0 max-w-full cursor-pointer items-center justify-between gap-2 rounded-[inherit] border bg-[#F9F7FF] px-3 text-left text-[length:inherit] font-medium text-[#131313] outline-none transition-colors ${
          open
            ? "border-[#5932E9] ring-1 ring-[#ECE7FF]"
            : "border-[#2E2E2E] focus:border-[#5932E9] focus:ring-1 focus:ring-[#ECE7FF]"
        }`}
      >
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#626262] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={listRef}
            role="listbox"
            style={{
              position: "fixed",
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              maxHeight: pos.maxHeight,
              zIndex: 2147483000,
              boxSizing: "border-box",
              overflowY: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#C9BDF7 transparent",
              padding: 4,
              background: "#FFFFFF",
              border: "1px solid #DCD3FF",
              borderRadius: 12,
              boxShadow: "0 12px 28px rgba(89, 50, 233, 0.18)",
              fontFamily: "'Urbanist', sans-serif",
            }}
          >
            {options.map((option, index) => {
              const selected = option === value;
              const active = index === activeIndex;
              return (
                <div
                  key={option}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option)}
                  style={{
                    height: SELECT_ITEM_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: selected ? 600 : 500,
                    color: selected ? "#5932E9" : "#2E2E2E",
                    background: active ? "#ECE7FF" : "transparent",
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      flexShrink: 0,
                      display: "inline-flex",
                    }}
                  >
                    {selected && <Check className="h-4 w-4 text-[#5932E9]" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{option}</span>
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}

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