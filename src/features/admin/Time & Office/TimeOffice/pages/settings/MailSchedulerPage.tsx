import { useState } from "react";
import {
  AlignLeft,
  Bold,
  Code,
  Indent,
  Italic,
  Link2,
  List,
  ListOrdered,
  Outdent,
  Quote,
  Redo2,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo2,
} from "lucide-react";
import SettingsLayout from "./SettingsLayout";
import DropdownSelect from "../../../../components/DropdownSelect";

const MAIL_SENDING_TYPE_OPTIONS = [
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
];

const TOOLBAR_ICONS = [Bold, Italic, Underline, Strikethrough, List, ListOrdered, Outdent, Indent, Subscript, Superscript, Quote, AlignLeft, Link2, Code, Undo2, Redo2];

export default function MailSchedulerPage() {
  const [active, setActive] = useState(true);
  const [body, setBody] = useState("");
  const [scheduleFor, setScheduleFor] = useState("");
  const [reportingType, setReportingType] = useState("");
  const [reportingFormat, setReportingFormat] = useState("PDF Only");
  const [autoMailTo, setAutoMailTo] = useState("");
  const [mailSendingType, setMailSendingType] = useState("Daily");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("Size 3");
  const [textStyle, setTextStyle] = useState("Normal");

  return (
    <SettingsLayout>
      <div className="flex justify-end -mt-2">
        <button type="button" className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium">Save</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Basic Information</h3>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Active
                <button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  onClick={() => setActive((v) => !v)}
                  className={`relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full transition-colors ${active ? "bg-emerald-600" : "bg-slate-200"}`}
                >
                  <span className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${active ? "translate-x-[15px]" : "translate-x-0.5"}`} />
                </button>
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm text-slate-700">
              Schedule For
              <DropdownSelect
                options={[{ label: "Select Schedule For", value: "" }]}
                value={scheduleFor}
                onChange={setScheduleFor}
                menuClassName="w-44"
                className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-slate-700">
              Reporting Type
              <DropdownSelect
                options={[{ label: "Select Reporting Type", value: "" }]}
                value={reportingType}
                onChange={setReportingType}
                menuClassName="w-44"
                className="h-9 rounded-lg border border-amber-200 bg-amber-50/40 px-2.5 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-slate-700">
              Reporting Format
              <DropdownSelect
                options={[{ label: "PDF Only", value: "PDF Only" }]}
                value={reportingFormat}
                onChange={setReportingFormat}
                menuClassName="w-32"
                className="h-9 rounded-lg border border-amber-200 bg-amber-50/40 px-2.5 text-sm"
              />
            </label>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-800">Auto Mail</h3>
            <label className="flex flex-col gap-1.5 text-sm text-slate-700">
              Auto Mail To
              <DropdownSelect
                options={[{ label: "Select Auto Mail To", value: "" }]}
                value={autoMailTo}
                onChange={setAutoMailTo}
                menuClassName="w-44"
                className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm"
              />
            </label>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-800">Schedule Settings</h3>
            <label className="flex flex-col gap-1.5 text-sm text-slate-700">
              Mail Sending Type
              <DropdownSelect
                options={MAIL_SENDING_TYPE_OPTIONS}
                value={mailSendingType}
                onChange={setMailSendingType}
                menuClassName="w-32"
                className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 h-fit">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Mail Configuration</h3>
            <button type="button" className="text-xs font-medium text-emerald-600">Placeholder</button>
          </div>

          <label className="text-sm text-slate-700">Mail Body</label>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 border-b border-slate-200 flex-wrap">
              <DropdownSelect
                options={[{ label: "Arial", value: "Arial" }]}
                value={fontFamily}
                onChange={setFontFamily}
                menuClassName="w-24"
                className="h-7 rounded border border-slate-200 text-xs px-1 bg-white"
              />
              <DropdownSelect
                options={[{ label: "Size 3", value: "Size 3" }]}
                value={fontSize}
                onChange={setFontSize}
                menuClassName="w-20"
                className="h-7 rounded border border-slate-200 text-xs px-1 bg-white"
              />
              <DropdownSelect
                options={[{ label: "Normal", value: "Normal" }]}
                value={textStyle}
                onChange={setTextStyle}
                menuClassName="w-24"
                className="h-7 rounded border border-slate-200 text-xs px-1 bg-white"
              />
              {TOOLBAR_ICONS.map((Icon, i) => (
                <Icon key={i} size={14} className="text-slate-400" />
              ))}
            </div>
            <textarea
              rows={8}
              placeholder="Write something awesome...."
              className="w-full px-3 py-2 text-sm outline-none resize-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
