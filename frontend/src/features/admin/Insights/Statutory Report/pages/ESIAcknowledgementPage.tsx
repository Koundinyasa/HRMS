import { useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  CalendarDays,
  CloudUpload,
  X,
  Filter,
  Clock3,
} from "lucide-react";

const MONTHS = ["Sep/2026", "Aug/2026", "Jul/2026"];

const inputClass =
  "h-[52px] w-full rounded-lg border border-[#e1e5ec] bg-[#eef1f7] px-4 text-[15px] text-[#273147] outline-none focus:border-[#2498df]";

function TopNavigation() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70px] items-center gap-8 overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white px-5 shadow-sm">
      <button
        type="button"
        onClick={() => navigate("../../")}
        className="h-[70px] shrink-0 border-b-2 border-transparent px-1 text-[18px] font-medium text-[#62656d]"
      >
        PF Report
      </button>

      <button
        type="button"
        onClick={() => navigate("../")}
        className="h-[70px] shrink-0 border-b-[3px] border-[#2498df] px-1 text-[18px] font-semibold text-[#2498df]"
      >
        ESI Report
      </button>

      <button
        type="button"
        onClick={() => navigate("../../lwf")}
        className="h-[70px] shrink-0 border-b-2 border-transparent px-1 text-[18px] font-medium text-[#62656d]"
      >
        LWF Report
      </button>

      <button
        type="button"
        onClick={() => navigate("../../pt")}
        className="h-[70px] shrink-0 border-b-2 border-transparent px-1 text-[18px] font-medium text-[#62656d]"
      >
        PT Report
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-5">
        <Filter className="h-6 w-6 text-[#8d99ad]" />
        <Clock3 className="h-6 w-6 text-[#8d99ad]" />
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[16px] font-medium text-[#252d40]">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-[16px] font-medium text-[#252d40]">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} appearance-none pr-12`}
        >
          <option value="">Select</option>

          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737984]" />
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[16px] font-medium text-[#252d40]">
        {label}
      </label>

      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} pr-12`}
        />

        <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8d99ad]" />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e3e5e9] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="whitespace-nowrap text-[17px] font-semibold text-[#20283a]">
          {title}
        </h2>

        <div className="h-px flex-1 bg-[#dfe2e7]" />
      </div>

      {children}
    </div>
  );
}

export default function ESIAcknowledgementPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [month, setMonth] = useState("Sep/2026");
  const [group, setGroup] = useState("");

  const [paidAmount, setPaidAmount] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("");
  const [bank, setBank] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [trrnNo, setTrrnNo] = useState("");

  const [acknowledgementNumber, setAcknowledgementNumber] =
    useState("");

  const [ackPaidDate, setAckPaidDate] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.size > 1024 * 1024) {
      alert("File size should not exceed 1 MB.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (!droppedFile) {
      return;
    }

    if (droppedFile.size > 1024 * 1024) {
      alert("File size should not exceed 1 MB.");
      return;
    }

    setFile(droppedFile);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f6fb] p-3 sm:p-4">
      <TopNavigation />

      <div className="mt-3 rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-5 py-3">
          <h1 className="border-b-[3px] border-[#2498df] pb-3 pt-1 text-[18px] font-semibold text-[#2498df]">
            ESI Acknowledgement
          </h1>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-12 items-center gap-2 rounded-lg border border-[#aeb2b9] bg-white px-5 text-[16px] font-medium text-[#4d535e]"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="h-12 min-w-[180px] appearance-none rounded-lg border border-[#dfe3ea] bg-[#eef1f7] px-4 pr-10 text-[16px] outline-none"
              >
                {MONTHS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>

            <div className="relative">
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="h-12 min-w-[200px] appearance-none rounded-lg border border-[#dfe3ea] bg-white px-4 pr-10 text-[16px] outline-none"
              >
                <option value="">ESI Group</option>
                <option>ESI Group 1</option>
                <option>ESI Group 2</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Section title="Payment Details">
          <div className="space-y-5">
            <FormField
              label="Paid Amount"
              value={paidAmount}
              onChange={setPaidAmount}
            />

            <SelectField
              label="Mode of Payment"
              value={modeOfPayment}
              onChange={setModeOfPayment}
              options={[
                "Online",
                "Cheque",
                "Cash",
                "Bank Transfer",
              ]}
            />

            <FormField
              label="Bank"
              value={bank}
              onChange={setBank}
            />

            <FormField
              label="Reference No"
              required
              value={referenceNo}
              onChange={setReferenceNo}
            />

            <DateField
              label="Paid Date"
              value={paidDate}
              onChange={setPaidDate}
            />

            <FormField
              label="TRRN No."
              value={trrnNo}
              onChange={setTrrnNo}
            />
          </div>
        </Section>

        <Section title="Acknowledgement Details">
          <div className="space-y-5">
            <FormField
              label="Acknowledgement Number"
              value={acknowledgementNumber}
              onChange={setAcknowledgementNumber}
            />

            <DateField
              label="Ack Paid Date"
              value={ackPaidDate}
              onChange={setAckPaidDate}
            />

            <div className="border-t border-[#e1e3e7] pt-5">
              <label className="mb-2 block text-[16px] font-medium text-[#252d40]">
                Attachment
              </label>

              <div
                onClick={() =>
                  fileInputRef.current?.click()
                }
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={handleDrop}
                className="flex min-h-[285px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#aeb5bd] bg-white px-5 text-center hover:bg-[#fafcff]"
              >
                <CloudUpload className="mb-3 h-9 w-9 text-[#b8bbc0]" />

                {file ? (
                  <>
                    <p className="text-[15px] font-medium text-[#2498df]">
                      {file.name}
                    </p>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setFile(null);
                      }}
                      className="mt-2 flex items-center gap-1 text-sm text-red-500"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[16px] text-[#aaaeb5]">
                      Drag and drop
                    </p>

                    <p className="my-1 text-[15px] text-[#999da5]">
                      - or -
                    </p>

                    <span className="text-[16px] font-medium text-[#2498df]">
                      Browse
                    </span>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <p className="mt-2 text-xs text-[#8b9099]">
                Maximum file size: 1 MB
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}