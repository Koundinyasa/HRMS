import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ChevronDown, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Undo2, Redo2, Puzzle,
} from "lucide-react";

// No document.execCommand anywhere in this file. execCommand is deprecated
// and some locked-down/managed browsers silently block it — if that was
// the actual problem, this version sidesteps it entirely by manipulating
// the DOM directly with the Selection/Range API, which every browser
// supports unconditionally.

type ToolbarIcon = ComponentType<{ size?: number; strokeWidth?: number }>;
const INLINE_BUTTONS: [ToolbarIcon, string][] = [
  [Bold, "B"],
  [Italic, "I"],
  [Underline, "U"],
  [Strikethrough, "S"],
];
const LIST_BUTTONS: [ToolbarIcon, "UL" | "OL"][] = [
  [List, "UL"],
  [ListOrdered, "OL"],
];
const FONT_FAMILIES = ["Arial", "Calibri", "Times New Roman"];
const FONT_SIZES_PX: [string, string][] = [
  ["13px", "Size 1"],
  ["15px", "Size 2"],
  ["17px", "Size 3"],
  ["20px", "Size 4"],
];
const FORMAT_BLOCKS: [string, string][] = [
  ["P", "Normal"],
  ["H1", "Heading 1"],
  ["H2", "Heading 2"],
];

interface ToolbarSelectProps {
  value: string;
  options: [string, string][];
  onSelect: (value: string) => void;
  onSaveSelection: () => void;
}

function ToolbarSelect({
  value,
  options,
  onSelect,
  onSaveSelection,
}: ToolbarSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    options.find(([optionValue]) => optionValue === value)?.[1] ??
    options[0][1];

  return (
    <div className="relative flex h-full items-center border-r border-[#E2E8F0] pr-2">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onMouseDown={(event) => {
          onSaveSelection();
          event.preventDefault();
        }}
        onClick={() => setOpen((previous) => !previous)}
        className="flex h-7 min-w-[82px] items-center justify-between gap-2 rounded px-2 text-xs text-[#2E2E2E] transition-colors hover:bg-[#F1EDFF] hover:text-[#7A5BED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A5BED]/40"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={12} className="shrink-0 text-[#626262]" />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-[100] mt-1 min-w-full overflow-hidden rounded-lg border border-[#E2E8F0] bg-white p-1 shadow-[0_8px_24px_rgba(15,23,42,0.16)]"
        >
          {options.map(([optionValue, label]) => (
            <button
              key={optionValue}
              type="button"
              role="option"
              aria-selected={value === optionValue}
              onMouseDown={(event) => {
                onSaveSelection();
                event.preventDefault();
              }}
              onClick={() => {
                onSelect(optionValue);
                setOpen(false);
              }}
              className={`block w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-xs transition-colors ${
                value === optionValue
                  ? "bg-[#F1EDFF] font-semibold text-[#7A5BED]"
                  : "text-[#2E2E2E] hover:bg-[#F8F7FF] hover:text-[#7A5BED]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  value: string;
  onChange: (html: string) => void;
  hasError: boolean;
}

export default function NotificationRichTextEditor({ value, onChange, hasError }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0]);
  const [fontSize, setFontSize] = useState(FONT_SIZES_PX[2][0]);
  const [formatBlock, setFormatBlock] = useState(FORMAT_BLOCKS[0][0]);

  const syncEditorState = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    onChange(html);
    const current = historyRef.current[historyIndexRef.current];
    if (html === current) return;
    const h = historyRef.current.slice(0, historyIndexRef.current + 1);
    h.push(html);
    historyRef.current = h;
    historyIndexRef.current = h.length - 1;
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
      historyRef.current = [value];
      historyIndexRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = (): Range | null => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || !editorRef.current) return null;
    const range = savedRangeRef.current ?? document.createRange();
    if (!savedRangeRef.current) {
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
    }
    sel.removeAllRanges();
    sel.addRange(range);
    return range;
  };

  // Wraps the current (highlighted) selection in a given element. No-op if
  // nothing is highlighted — same as every real editor. Used for inline
  // tags (<b>, <i>...) and for font family/size (a styled <span>).
  const wrapSelectionWith = (wrapper: HTMLElement) => {
    const range = restoreSelection();
    if (!range || range.collapsed) return;
    try {
      range.surroundContents(wrapper);
    } catch {
      const contents = range.extractContents();
      wrapper.appendChild(contents);
      range.insertNode(wrapper);
    }
    const sel = window.getSelection();
    const newRange = document.createRange();
    newRange.selectNodeContents(wrapper);
    sel?.removeAllRanges();
    sel?.addRange(newRange);
    savedRangeRef.current = newRange.cloneRange();
    syncEditorState();
  };
  const applyInlineTag = (tag: string) => wrapSelectionWith(document.createElement(tag));
  const applyFontFamily = (font: string) => {
    const span = document.createElement("span");
    span.style.fontFamily = font;
    wrapSelectionWith(span);
  };
  const applyFontSize = (px: string) => {
    const span = document.createElement("span");
    span.style.fontSize = px;
    wrapSelectionWith(span);
  };

  // Replaces the block (paragraph/heading) the cursor is in with a new tag.
  // Works with just a cursor position — no highlighting needed.
  const applyBlockTag = (tag: string) => {
    const range = restoreSelection();
    if (!range || !editorRef.current) return;
    let node: Node | null = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    let block = node as HTMLElement | null;
    while (block && block !== editorRef.current && !/^(P|H1|H2|DIV)$/.test(block.tagName)) {
      block = block.parentElement;
    }
    const newBlock = document.createElement(tag);
    if (!block || block === editorRef.current) {
      const directNode =
        range.startContainer === editorRef.current
          ? editorRef.current.childNodes[
              Math.min(range.startOffset, editorRef.current.childNodes.length - 1)
            ]
          : range.startContainer.parentNode === editorRef.current
          ? range.startContainer
          : null;
      if (directNode) {
        editorRef.current.insertBefore(newBlock, directNode);
        newBlock.appendChild(directNode);
      } else {
        newBlock.innerHTML = "<br>";
        range.insertNode(newBlock);
      }
    } else {
      newBlock.innerHTML = block.innerHTML || "<br>";
      block.replaceWith(newBlock);
    }
    const nextRange = document.createRange();
    nextRange.selectNodeContents(newBlock);
    nextRange.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(nextRange);
    savedRangeRef.current = nextRange.cloneRange();
    setFormatBlock(tag);
    syncEditorState();
  };

  const applyList = (kind: "UL" | "OL") => {
    const range = restoreSelection();
    if (!range || !editorRef.current) return;
    let node: Node | null = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    let block = node as HTMLElement | null;
    while (block && block !== editorRef.current && !/^(P|DIV|H1|H2)$/.test(block.tagName)) {
      block = block.parentElement;
    }
    const listItem = document.createElement("li");
    const list = document.createElement(kind);
    if (block && block !== editorRef.current) {
      listItem.innerHTML = block.innerHTML || "<br>";
      block.replaceWith(list);
    } else {
      const selectedContent = range.extractContents();
      if (selectedContent.childNodes.length > 0) {
        listItem.appendChild(selectedContent);
      } else {
        listItem.innerHTML = "<br>";
      }
      range.insertNode(list);
    }
    list.appendChild(listItem);

    const nextRange = document.createRange();
    nextRange.selectNodeContents(listItem);
    nextRange.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(nextRange);
    savedRangeRef.current = nextRange.cloneRange();
    syncEditorState();
  };

  const generateTemplate = () => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML =
      "<p>Dear Team,</p><p>We would like to inform you about [add notification details].</p><p>Thank you.</p>";
    editorRef.current.focus();

    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    savedRangeRef.current = range.cloneRange();
    syncEditorState();
  };

  const undo = () => {
    if (historyIndexRef.current <= 0 || !editorRef.current) return;
    historyIndexRef.current -= 1;
    editorRef.current.innerHTML = historyRef.current[historyIndexRef.current];
    onChange(editorRef.current.innerHTML);
  };
  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1 || !editorRef.current) return;
    historyIndexRef.current += 1;
    editorRef.current.innerHTML = historyRef.current[historyIndexRef.current];
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-[13px] font-semibold text-[#131313]">
          Notification <span className="text-[#DD3232] ml-1">*</span>
        </label>
        <button
          type="button"
          onClick={generateTemplate}
          className="flex items-center gap-1.5 h-[23px] px-2.5 rounded-full border border-[#16A34A] bg-[#F0FDF4] text-[#15803D] text-xs font-medium leading-4"
        >
          <Puzzle size={12} strokeWidth={2.5} />
          Generate
        </button>
      </div>

      <div className={`relative z-30 rounded-md border bg-white ${hasError ? "border-[#FCA5A5]" : "border-[#E2E8F0]"}`}>
        <div className="relative z-20 flex h-9 items-center gap-1 border-b border-[#E2E8F0] bg-[#F9FAFB] px-2 text-[#2E2E2E]">
          <ToolbarSelect
            value={fontFamily}
            options={FONT_FAMILIES.map((font): [string, string] => [font, font])}
            onSaveSelection={saveSelection}
            onSelect={(font) => {
              setFontFamily(font);
              applyFontFamily(font);
            }}
          />
          <ToolbarSelect
            value={fontSize}
            options={FONT_SIZES_PX}
            onSaveSelection={saveSelection}
            onSelect={(size) => {
              setFontSize(size);
              applyFontSize(size);
            }}
          />
          <ToolbarSelect
            value={formatBlock}
            options={FORMAT_BLOCKS}
            onSaveSelection={saveSelection}
            onSelect={applyBlockTag}
          />
          <div className="flex items-center gap-2.5 text-[#131313]">
            {INLINE_BUTTONS.map(([Icon, tag]) => (
              <button
                key={tag}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  saveSelection();
                }}
                onClick={() => applyInlineTag(tag)}
                className="hover:text-[#7A5BED]"
              >
                <Icon size={13} strokeWidth={2.5} />
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex h-8 items-center gap-2.5 border-b border-[#E2E8F0] bg-[#F9FAFB] px-3 text-[#131313]">
          {LIST_BUTTONS.map(([Icon, kind]) => (
            <button
              key={kind}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
              }}
              onClick={() => applyList(kind)}
              className="hover:text-[#7A5BED]"
            >
              <Icon size={13} strokeWidth={2.25} />
            </button>
          ))}
          <div className="w-px h-4 bg-[#E2E8F0]" />
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={undo} className="hover:text-[#7A5BED]">
            <Undo2 size={13} strokeWidth={2.25} />
          </button>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={redo} className="hover:text-[#7A5BED]">
            <Redo2 size={13} strokeWidth={2.25} />
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncEditorState}
          onBlur={syncEditorState}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          data-placeholder="Write something awesome..."
          className="notification-editor w-full block min-h-[96px] px-3.5 py-3.5 text-sm font-normal text-[#2E2E2E] outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 [&_h1]:my-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:my-2 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
        />
      </div>
    </div>
  );
}