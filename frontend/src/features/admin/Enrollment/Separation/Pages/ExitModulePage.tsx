import React, { useState } from "react";
import { CalendarDays, Plus, History, ChevronDown, X, Save } from "lucide-react";

/* =========================================================
   CUSTOM ILLUSTRATED ICONS (match dashboard stat cards)
========================================================= */

function TotalPeopleIcon({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.83} viewBox="0 0 120 100" fill="none">
      <circle cx="28" cy="34" r="10" fill="#f0c39a" />
      <path d="M20 27c1-4 5-6 8-6s7 2 8 6c-2 2-5 3-8 3s-6-1-8-3z" fill="#2b2b2b" />
      <path d="M13 66c0-11 6.7-19 15-19s15 8 15 19" fill="#0f8b8c" />

      <circle cx="92" cy="34" r="10" fill="#f0c39a" />
      <path d="M84 27c1-4 5-6 8-6s7 2 8 6c-2 2-5 3-8 3s-6-1-8-3z" fill="#2b2b2b" />
      <path d="M77 66c0-11 6.7-19 15-19s15 8 15 19" fill="#3f7dd8" />

      <circle cx="60" cy="30" r="13" fill="#f0c39a" />
      <path
        d="M43 27c0-10 8-18 17-18s17 8 17 18c0 3-1 5-2 7-1-6-3-9-4-9-3 3-9 5-15 5-4 0-7-1-9-3-1 3-2 6-2 9-1-2-2-6-2-9z"
        fill="#241f1a"
      />
      <path d="M33 74c0-13.8 12.1-25 27-25s27 11.2 27 25" fill="#ab3f66" />
      <path d="M50 52l10 10 10-10-3-3c-2 1.5-5 2.5-7 2.5s-5-1-7-2.5z" fill="#ffffff" />

      <circle cx="60" cy="85" r="13" fill="#149c7c" stroke="#ffffff" strokeWidth="2.5" />
      <path
        d="M53.5 85l4.5 4.5 8.5-8.5"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function ProgressIcon({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="16" y="34" width="46" height="34" rx="4" fill="#2bb6c4" />
      <rect x="21" y="39" width="36" height="24" rx="1.5" fill="#e7f8fa" />
      <rect x="36" y="68" width="6" height="8" fill="#bcdfe3" />
      <rect x="26" y="76" width="26" height="4" rx="2" fill="#bcdfe3" />

      <rect x="34" y="10" width="8" height="26" rx="1" fill="#f5a623" transform="rotate(-8 38 23)" />
      <path d="M33 10l6-1 2 3-4 6z" fill="#2bb6c4" transform="rotate(-8 38 23)" />

      <g fill="#c9d3d6">
        <circle cx="39" cy="51" r="7" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <rect key={deg} x="37.3" y="41.5" width="3.4" height="4.5" rx="1" transform={`rotate(${deg} 39 51)`} />
        ))}
      </g>
      <circle cx="39" cy="51" r="3.2" fill="#e7f8fa" />

      <g fill="#f9c74f">
        <circle cx="72" cy="28" r="13" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect key={deg} x="69.7" y="12" width="4.6" height="6.5" rx="1.4" transform={`rotate(${deg} 72 28)`} />
        ))}
      </g>
      <circle cx="72" cy="28" r="5.5" fill="#fdeab8" />

      <circle cx="76" cy="68" r="15" fill="#ffffff" stroke="#f4679a" strokeWidth="3" />
      <path d="M76 68V56a12 12 0 0 1 0 24z" fill="#f9b8ce" opacity="0.9" />
      <path d="M76 68V58" stroke="#f4679a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M76 68l7 4" stroke="#f4679a" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function OffboardedIcon({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="18" y="10" width="7" height="80" rx="1.5" fill="#7fb8e8" />
      <path d="M25 12 L52 22 L52 78 L25 88 Z" fill="#bfe0f7" />
      <path d="M25 12 L52 22 L52 78 L25 88 Z" fill="none" stroke="#8fc4e8" strokeWidth="1.5" />
      <circle cx="45" cy="52" r="2.4" fill="#f0b429" />

      <circle cx="70" cy="26" r="8" fill="#3f7dd8" />
      <path
        d="M70 34c-6 0-10 4-11 10l-2 12 6 1 2-9 2 6-4 14 6 2 5-13 3 13 6-1-3-16 2-9c-1-6-6-10-12-10z"
        fill="#3f7dd8"
      />
      <path d="M58 44l-10 5 2 5 11-4z" fill="#3f7dd8" />

      <rect x="46" y="55" width="18" height="14" rx="2.5" fill="#e8703a" />
      <rect x="52" y="51" width="6" height="5" rx="1.5" fill="none" stroke="#e8703a" strokeWidth="2" />
      <rect x="46" y="60" width="18" height="3" fill="#c85a2a" />
    </svg>
  );
}

/* =========================================================
   EMPTY-STATE ILLUSTRATION — confused desk worker
   (Offboarded Employee / Exit Interview / no-data states)
========================================================= */

function ConfusedDeskIllustration({ size = 190 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.955} viewBox="0 0 440 420" fill="none">
      {/* browser window background */}
      <rect x="65" y="18" width="270" height="215" rx="6" fill="#f3f5f8" stroke="#e7eaf0" strokeWidth="1.5" />
      <circle cx="80" cy="30" r="2.5" fill="#d7dce3" />
      <circle cx="90" cy="30" r="2.5" fill="#d7dce3" />
      <circle cx="100" cy="30" r="2.5" fill="#d7dce3" />
      <line x1="65" y1="40" x2="335" y2="40" stroke="#e7eaf0" strokeWidth="1.5" />

      {/* two question mark cards */}
      <g transform="rotate(-6 175 95)">
        <rect x="150" y="65" width="55" height="70" rx="3" fill="#ffffff" stroke="#e3e7ed" strokeWidth="1.5" />
        <text x="177" y="112" fontSize="30" fontWeight="700" fill="#9aa5b1" textAnchor="middle">
          ?
        </text>
      </g>
      <g transform="rotate(6 205 100)">
        <rect x="182" y="72" width="55" height="70" rx="3" fill="#ffffff" stroke="#e3e7ed" strokeWidth="1.5" />
        <text x="209" y="119" fontSize="30" fontWeight="700" fill="#9aa5b1" textAnchor="middle">
          ?
        </text>
      </g>

      {/* big pink question mark */}
      <text x="55" y="130" fontSize="90" fontWeight="700" fill="none" stroke="#f5a3c7" strokeWidth="6">
        ?
      </text>

      {/* ground line */}
      <line x1="60" y1="300" x2="400" y2="300" stroke="#e7eaf0" strokeWidth="1.5" />

      {/* chair */}
      <rect x="322" y="110" width="11" height="110" rx="4" fill="#d7dce3" />
      <path d="M316 210l-8 88" stroke="#c3cad3" strokeWidth="8" strokeLinecap="round" />
      <path d="M340 210l10 88" stroke="#c3cad3" strokeWidth="8" strokeLinecap="round" />

      {/* desk drawer unit */}
      <rect x="130" y="205" width="80" height="65" rx="3" fill="#eef1f5" stroke="#e2e6ec" strokeWidth="1.5" />
      <rect x="140" y="220" width="60" height="6" rx="2" fill="#dde2e8" />
      <rect x="140" y="240" width="60" height="6" rx="2" fill="#dde2e8" />

      {/* desk top */}
      <rect x="100" y="192" width="240" height="14" rx="3" fill="#f5b731" />
      <path d="M104 206l-24 90" stroke="#f5b731" strokeWidth="9" strokeLinecap="round" />
      <path d="M330 206l16 90" stroke="#f5b731" strokeWidth="9" strokeLinecap="round" />

      {/* plant */}
      <rect x="160" y="178" width="18" height="16" rx="2" fill="#2b2b2b" />
      <path d="M169 178c-1-12-11-16-18-16 1 10 8 15 18 16z" fill="#3fb27f" />
      <path d="M169 178c1-10 9-14 16-13-1 9-8 12-16 13z" fill="#2f9d6b" />

      {/* monitor */}
      <rect x="188" y="150" width="70" height="46" rx="4" fill="#2b3a67" />
      <rect x="193" y="155" width="60" height="35" rx="2" fill="#3f5aa8" />
      <rect x="215" y="196" width="16" height="10" fill="#9aa5b1" />
      <rect x="203" y="206" width="40" height="4" rx="2" fill="#9aa5b1" />

      {/* legs crossed */}
      <path d="M235 200c20 12 45 16 65 10l8 22c-26 10-58 6-84-8z" fill="#f5822a" />
      <path d="M255 200c14 20 18 44 10 64l-22-4c4-20 2-42-8-58z" fill="#f5822a" />

      {/* shoes */}
      <path d="M295 226c8 2 13 8 11 15-2 6-9 9-16 6-6-2-9-8-7-14z" fill="#f5b731" />
      <path d="M235 258c-3 8 2 15 11 16 8 1 14-4 14-11l-11-8z" fill="#f5b731" />

      {/* torso */}
      <path
        d="M230 130c0-16 14-27 30-27s30 11 30 27v58c0 8-13 12-30 12s-30-4-30-12z"
        fill="#3f7dd8"
      />
      {/* collar */}
      <path d="M252 108c4 5 12 5 16 0" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* arms bent to head */}
      <path d="M236 140c-10-9-13-22-8-33" stroke="#f0c39a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M284 140c10-9 13-22 8-33" stroke="#f0c39a" strokeWidth="12" strokeLinecap="round" fill="none" />

      {/* pink sparkle */}
      <path d="M300 65l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="#f5a3c7" />

      {/* hands on head */}
      <circle cx="234" cy="100" r="10" fill="#f0c39a" />
      <circle cx="286" cy="100" r="10" fill="#f0c39a" />

      {/* head */}
      <circle cx="260" cy="105" r="22" fill="#f0c39a" />
      <path
        d="M238 100c0-16 10-26 22-26s22 10 22 26c-4 4-13 6-22 6s-18-2-22-6z"
        fill="#241f1a"
      />
    </svg>
  );
}


type SeparationForm = {
  employeeId: string;
  noticePeriod: string;
  resignedDate: string;
  leavingDate: string;
  reason: string;
  contactDetail: string;
  approvedDate: string;
  remarks: string;
};

type FormErrors = Partial<Record<keyof SeparationForm, string>>;

type Policy = {
  id: number;
  name: string;
};

type PolicyForm = {
  policyName: string;
  noticePeriod: string;
  signatory: string;
  leavingMethod: string;
  showFFS: boolean;
  sendMail: boolean;
};

type Employee = {
  id: number;
  name: string;
};

type KTTask = {
  id: number;
  taskName: string;
  assignedTo: string;
};

type PolicyError = Partial<Record<keyof PolicyForm, string>>;

/* =========================================================
   CONSTANTS
========================================================= */

const reasons: string[] = [
  "Career Advancement",
  "Relocation",
  "Retired",
  "Death in Service",
  "Permanent Disability",
  "Suspension Of Work",
];

const signatoryOptions: string[] = [
  "Rajesh Ubbapally",
  "Anusha Mawilapalli",
  "Chandra Shekar Sakla",
  "Varalaxmi Gumudala",
  "Nikhitha Narala",
  "Sreya Chalumuri",
  "Rohith Kumar Karkonda",
  "Praveen Kumar Yadav Arva",
  "Shamsh Tabrez Mohammed",
  "Rakesh Peddi",
  "Ishika Santosh Mokati",
  "Rama Veera Manikanta Pusunuri",
  "Umar Shareef Shaik",
  "Tharun Nagarjunapu",
  "Divyasree Taguru",
  "Naveen Penaganti",
  "Rajesh Reddy Thuti",
  "Priyaslika Nagendla",
];

/* =========================================================
   HELPERS — convert between DD-MM-YYYY (display) and
   YYYY-MM-DD (native <input type="date"> value)
========================================================= */

function toInputDate(ddmmyyyy: string): string {
  if (!ddmmyyyy) return "";
  const parts = ddmmyyyy.split("-");
  if (parts.length !== 3) return "";
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm}-${dd}`;
}

function toDisplayDate(yyyymmdd: string): string {
  if (!yyyymmdd) return "";
  const parts = yyyymmdd.split("-");
  if (parts.length !== 3) return "";
  const [yyyy, mm, dd] = parts;
  return `${dd}-${mm}-${yyyy}`;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ExitModulePage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const [fromMonth, setFromMonth] = useState("01-06-2026");
  const [toMonth, setToMonth] = useState("12-06-2026");

  const [showEmployeeModal, setShowEmployeeModal] = useState<boolean>(false);
  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);
  const [showReasonDropdown, setShowReasonDropdown] = useState<boolean>(false);

  const [saved, setSaved] = useState<boolean>(false);

  const [form, setForm] = useState<SeparationForm>({
    employeeId: "",
    noticePeriod: "",
    resignedDate: "",
    leavingDate: "",
    reason: "",
    contactDetail: "",
    approvedDate: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<number | null>(null);

  const [showPolicyModal, setShowPolicyModal] = useState<boolean>(false);
  const [showSignatoryDropdown, setShowSignatoryDropdown] = useState<boolean>(false);
  const [policyForm, setPolicyForm] = useState<PolicyForm>({
    policyName: "",
    noticePeriod: "",
    signatory: "",
    leavingMethod: "resignation",
    showFFS: true,
    sendMail: true,
  });
  const [policyErrors, setPolicyErrors] = useState<PolicyError>({});

  const [employeePool] = useState<Employee[]>(signatoryOptions.map((name, i) => ({ id: i + 1, name })));
  const [showAddEmployeesModal, setShowAddEmployeesModal] = useState<boolean>(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [policyEmployees, setPolicyEmployees] = useState<Employee[]>([]);

  const [showKTTasksModal, setShowKTTasksModal] = useState<boolean>(false);
  const [ktTaskDraft, setKtTaskDraft] = useState<KTTask[]>([{ id: Date.now(), taskName: "", assignedTo: "" }]);
  const [policyKTTasks, setPolicyKTTasks] = useState<KTTask[]>([]);

  const updateForm = (field: keyof SeparationForm, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const openEmployeeModal = () => {
    setShowEmployeeModal(true);
    setShowDiscardModal(false);
    setSaved(false);
  };

  const closeEmployeeModal = () => {
    setShowDiscardModal(true);
  };

  const discardChanges = () => {
    setForm({
      employeeId: "",
      noticePeriod: "",
      resignedDate: "",
      leavingDate: "",
      reason: "",
      contactDetail: "",
      approvedDate: "",
      remarks: "",
    });
    setErrors({});
    setShowDiscardModal(false);
    setShowEmployeeModal(false);
    setShowReasonDropdown(false);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!form.noticePeriod.trim()) newErrors.noticePeriod = "Field Required";
    if (!form.resignedDate.trim()) newErrors.resignedDate = "Field Required";
    if (!form.leavingDate.trim()) newErrors.leavingDate = "Field Required";
    if (!form.reason.trim()) newErrors.reason = "Field Required";
    if (!form.approvedDate.trim()) newErrors.approvedDate = "Field Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveEmployee = () => {
    if (!validateForm()) return;
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowEmployeeModal(false);
      setForm({
        employeeId: "",
        noticePeriod: "",
        resignedDate: "",
        leavingDate: "",
        reason: "",
        contactDetail: "",
        approvedDate: "",
        remarks: "",
      });
      setErrors({});
    }, 1200);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "add") openEmployeeModal();
  };

  const openPolicyModal = () => {
    setShowPolicyModal(true);
    setShowSignatoryDropdown(false);
    setPolicyErrors({});
    setPolicyForm({
      policyName: "",
      noticePeriod: "",
      signatory: "",
      leavingMethod: "resignation",
      showFFS: true,
      sendMail: true,
    });
    setPolicyEmployees([]);
    setSelectedEmployeeIds([]);
    setPolicyKTTasks([]);
    setKtTaskDraft([{ id: Date.now(), taskName: "", assignedTo: "" }]);
  };

  const openAddEmployeesModal = () => {
    setSelectedEmployeeIds(policyEmployees.map((emp) => emp.id));
    setShowAddEmployeesModal(true);
  };

  const closeAddEmployeesModal = () => setShowAddEmployeesModal(false);

  const toggleEmployeeSelection = (id: number) => {
    setSelectedEmployeeIds((previous) =>
      previous.includes(id) ? previous.filter((existingId) => existingId !== id) : [...previous, id]
    );
  };

  const confirmAddEmployees = () => {
    setPolicyEmployees(employeePool.filter((emp) => selectedEmployeeIds.includes(emp.id)));
    setShowAddEmployeesModal(false);
  };

  const openKTTasksModal = () => {
    setKtTaskDraft(
      policyKTTasks.length
        ? policyKTTasks.map((task) => ({ ...task }))
        : [{ id: Date.now(), taskName: "", assignedTo: "" }]
    );
    setShowKTTasksModal(true);
  };

  const closeKTTasksModal = () => setShowKTTasksModal(false);

  const addKTTaskRow = () => {
    setKtTaskDraft((previous) => [...previous, { id: Date.now() + Math.random(), taskName: "", assignedTo: "" }]);
  };

  const removeKTTaskRow = (id) => {
    setKtTaskDraft((previous) => (previous.length > 1 ? previous.filter((task) => task.id !== id) : previous));
  };

  const updateKTTaskRow = (id: number, field: keyof KTTask, value: string) => {
    setKtTaskDraft((previous) => previous.map((task) => (task.id === id ? { ...task, [field]: value } : task)));
  };

  const saveKTTasks = () => {
    setPolicyKTTasks(ktTaskDraft.filter((task) => task.taskName.trim()));
    setShowKTTasksModal(false);
  };

  const closePolicyModal = () => {
    setShowPolicyModal(false);
    setShowSignatoryDropdown(false);
  };

  const updatePolicyForm = (field: keyof PolicyForm, value: string | boolean) => {
    setPolicyForm((previous) => ({ ...previous, [field]: value }));
    setPolicyErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const validatePolicyForm = () => {
    const newErrors: PolicyError = {};
    if (!policyForm.policyName.trim()) newErrors.policyName = "Field Required";
    if (!policyForm.noticePeriod.trim()) newErrors.noticePeriod = "Field Required";
    if (!policyForm.signatory.trim()) newErrors.signatory = "Field Required";
    setPolicyErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const savePolicy = () => {
    if (!validatePolicyForm()) return;
    const newPolicy: Policy = { id: Date.now(), name: policyForm.policyName.trim() };
    setPolicies((previous) => [...previous, newPolicy]);
    setSelectedPolicy(newPolicy.id);
    setShowPolicyModal(false);
    setShowSignatoryDropdown(false);
  };

  /* =========================================================
     DASHBOARD
  ========================================================= */

  const dateInputCls =
    "w-full h-[31px] border border-[#d0d5dd] rounded-[3px] pl-3 pr-[30px] text-[10px] text-[#344054] outline-none bg-white cursor-pointer focus:border-[#1598df] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:p-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer";

  const renderDashboard = () => {
    return (
      <>
        <div className="h-12 bg-white border border-[#e4e7ec] flex justify-end items-center gap-6 px-[18px] mb-2 max-[900px]:justify-start max-[900px]:overflow-x-auto">
          <div className="flex items-center gap-2 relative">
            <label className="text-[10px] text-[#667085]">From Month</label>
            <div className="relative w-[185px]">
              <input
                type="date"
                className={dateInputCls}
                value={toInputDate(fromMonth)}
                onChange={(e) => setFromMonth(toDisplayDate(e.target.value))}
              />
              <CalendarDays
                size={14}
                className="absolute right-[9px] top-1/2 -translate-y-1/2 text-[#98a2b3] pointer-events-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <label className="text-[10px] text-[#667085]">To Month</label>
            <div className="relative w-[185px]">
              <input
                type="date"
                className={dateInputCls}
                value={toInputDate(toMonth)}
                onChange={(e) => setToMonth(toDisplayDate(e.target.value))}
              />
              <CalendarDays
                size={14}
                className="absolute right-[9px] top-1/2 -translate-y-1/2 text-[#98a2b3] pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-3 gap-2.5 mb-2 max-[900px]:grid-cols-1">
          <div className="h-[108px] bg-white border border-[#e4e7ec] rounded-[5px] relative p-[18px] overflow-hidden">
            <div className="absolute left-[42px] top-[22px] w-12 h-12 flex items-center justify-center">
              <TotalPeopleIcon />
            </div>
            <div className="absolute right-12 top-[30px] min-w-[58px] h-7 px-3 flex justify-center items-center rounded-[3px] text-white text-sm font-semibold bg-[#23a9d0]">
              Total
            </div>
            <div className="absolute left-1/2 bottom-[10px] -translate-x-1/2 min-w-[34px] h-[25px] flex justify-center items-center bg-[#edf1f5] rounded text-[#344054] text-[11px] shadow-[0_1px_2px_rgba(0,0,0,.08)]">
              0
            </div>
          </div>

          <div className="h-[108px] bg-white border border-[#e4e7ec] rounded-[5px] relative p-[18px] overflow-hidden">
            <div className="absolute left-[42px] top-[22px] w-12 h-12 flex items-center justify-center">
              <ProgressIcon />
            </div>
            <div className="absolute right-12 top-[30px] min-w-[58px] h-7 px-3 flex justify-center items-center rounded-[3px] text-[#242424] text-sm font-semibold bg-[#f6c436]">
              Progress
            </div>
            <div className="absolute left-1/2 bottom-[10px] -translate-x-1/2 min-w-[34px] h-[25px] flex justify-center items-center bg-[#edf1f5] rounded text-[#344054] text-[11px] shadow-[0_1px_2px_rgba(0,0,0,.08)]">
              0
            </div>
          </div>

          <div className="h-[108px] bg-white border border-[#e4e7ec] rounded-[5px] relative p-[18px] overflow-hidden">
            <div className="absolute left-[42px] top-[22px] w-12 h-12 flex items-center justify-center">
              <OffboardedIcon />
            </div>
            <div className="absolute right-12 top-[30px] min-w-[58px] h-7 px-3 flex justify-center items-center rounded-[3px] text-white text-sm font-semibold bg-[#18b58a]">
              Offboarded
            </div>
            <div className="absolute left-1/2 bottom-[10px] -translate-x-1/2 min-w-[34px] h-[25px] flex justify-center items-center bg-[#edf1f5] rounded text-[#344054] text-[11px] shadow-[0_1px_2px_rgba(0,0,0,.08)]">
              0
            </div>
          </div>
        </div>

        <div className="w-full h-[350px] bg-white border border-[#e4e7ec] rounded-[5px] p-5">
          <div className="text-[#667085] text-[11px] mb-1">Exit Employee monthlywise</div>
          <div className="w-full h-[300px] overflow-hidden [&>svg]:w-full [&>svg]:h-[300px] [&>svg]:block">
            <svg width="100%" height="300" viewBox="0 0 1100 300" preserveAspectRatio="none">
              <line x1="55" y1="25" x2="1080" y2="25" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="55" y1="85" x2="1080" y2="85" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="55" y1="145" x2="1080" y2="145" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="55" y1="205" x2="1080" y2="205" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="55" y1="265" x2="1080" y2="265" stroke="#E5E7EB" strokeWidth="1" />

              <text x="40" y="29" textAnchor="end" fontSize="10" fill="#667085">12</text>
              <text x="40" y="89" textAnchor="end" fontSize="10" fill="#667085">9</text>
              <text x="40" y="149" textAnchor="end" fontSize="10" fill="#667085">6</text>
              <text x="40" y="209" textAnchor="end" fontSize="10" fill="#667085">3</text>
              <text x="40" y="269" textAnchor="end" fontSize="10" fill="#667085">0</text>

              <text x="12" y="150" textAnchor="middle" fontSize="9" fill="#667085" transform="rotate(-90 12 150)">
                Exit Employee monthlywise
              </text>

              <defs>
                <linearGradient id="exitChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1598DF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1598DF" stopOpacity="0.04" />
                </linearGradient>
              </defs>

              <path
                d="M55 32 C110 33 150 37 200 47 C255 58 305 77 355 95 C410 115 460 135 510 143 C565 152 615 153 665 154 C720 155 770 166 815 182 C870 201 915 220 960 236 C1005 250 1045 257 1080 260 L1080 265 L55 265 Z"
                fill="url(#exitChartGradient)"
              />
              <path
                d="M55 32 C110 33 150 37 200 47 C255 58 305 77 355 95 C410 115 460 135 510 143 C565 152 615 153 665 154 C720 155 770 166 815 182 C870 201 915 220 960 236 C1005 250 1045 257 1080 260"
                fill="none"
                stroke="#1598DF"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <text x="55" y="290" textAnchor="middle" fontSize="9" fill="#667085">Jan</text>
              <text x="148" y="290" textAnchor="middle" fontSize="9" fill="#667085">Feb</text>
              <text x="241" y="290" textAnchor="middle" fontSize="9" fill="#667085">Mar</text>
              <text x="334" y="290" textAnchor="middle" fontSize="9" fill="#667085">Apr</text>
              <text x="427" y="290" textAnchor="middle" fontSize="9" fill="#667085">May</text>
              <text x="520" y="290" textAnchor="middle" fontSize="9" fill="#667085">Jun</text>
              <text x="613" y="290" textAnchor="middle" fontSize="9" fill="#667085">Jul</text>
              <text x="706" y="290" textAnchor="middle" fontSize="9" fill="#667085">Aug</text>
              <text x="799" y="290" textAnchor="middle" fontSize="9" fill="#667085">Sep</text>
              <text x="892" y="290" textAnchor="middle" fontSize="9" fill="#667085">Oct</text>
              <text x="985" y="290" textAnchor="middle" fontSize="9" fill="#667085">Nov</text>
              <text x="1080" y="290" textAnchor="middle" fontSize="9" fill="#667085">Dec</text>
            </svg>
          </div>
        </div>
      </>
    );
  };

  const addButtonCls =
    "border-none bg-[#1598df] text-white h-[34px] px-3.5 rounded flex items-center gap-1 text-[11px] cursor-pointer hover:bg-[#0b86c8]";
  const policyItemBase =
    "w-full h-[38px] border-none bg-transparent text-left px-3.5 text-[11px] text-[#475467] cursor-pointer hover:bg-[#f6fafd] hover:text-[#1598df]";
  const policyItemActive =
    "bg-[#e8f4fc] text-[#1598df] font-semibold border-r-[3px] border-r-[#1598df]";

  const renderAddEmployeeList = () => {
    return (
      <div className="w-full min-h-[400px] bg-white border border-[#e4e7ec] rounded-[5px] p-[18px]">
        <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3.5">
          <div>
            <h2 className="m-0 text-[15px] text-[#344054]">Add Employee &amp; List</h2>
            <p className="mt-1.5 mb-0 text-[#667085] text-[11px]">Manage employees for separation</p>
          </div>
          <button className={addButtonCls} onClick={openEmployeeModal}>
            <span>＋</span>
            Add Employee
          </button>
        </div>

        <div className="min-h-[320px] flex flex-col items-center justify-center text-center">
          <div className="mb-3.5 flex justify-center">
            <ConfusedDeskIllustration size={150} />
          </div>
          <h3 className="m-0 text-sm text-[#344054]">No employees added</h3>
          <p className="text-[#667085] text-[11px] my-[7px] mb-[15px]">
            Click "Add Employee" to create a separation employee.
          </p>
          <button className={addButtonCls} onClick={openEmployeeModal}>
            <span>＋</span>
            Add Employee
          </button>
        </div>
      </div>
    );
  };

  const renderOffboarded = () => {
    return (
      <div className="w-full min-h-[400px] bg-white border border-[#e4e7ec] rounded-[5px] p-[18px]">
        <div>
          <h2 className="m-0 text-[15px] text-[#344054]">Offboarded Employee</h2>
          <p className="mt-1.5 mb-0 text-[#667085] text-[11px]">
            View employees who have completed the separation process.
          </p>
        </div>

        <div className="min-h-[320px] flex flex-col items-center justify-center text-center">
          <div className="mb-3.5 flex justify-center">
            <ConfusedDeskIllustration size={190} />
          </div>
          <h3 className="text-[#e0665c] text-[13px] font-semibold">No Data Found in - Offboarded employee</h3>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    const selected = policies.find((p) => p.id === selectedPolicy);

    return (
      <div className="w-full min-h-[520px] flex bg-white border border-[#e4e7ec] border-t-0">
        <aside className="w-[190px] min-w-[190px] border-r border-[#e4e7ec] flex flex-col">
          <div className="h-[46px] flex items-center justify-between px-3.5 text-xs font-bold text-[#344054]">
            <span>Policy</span>
            <button
              className="w-6 h-6 border border-[#bfe0f7] rounded bg-[#eaf5fd] text-[#1598df] flex items-center justify-center cursor-pointer hover:bg-[#dcf0fb]"
              onClick={openPolicyModal}
              aria-label="Add policy"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {policies.map((policy) => (
              <button
                key={policy.id}
                className={
                  policy.id === selectedPolicy ? `${policyItemBase} ${policyItemActive}` : policyItemBase
                }
                onClick={() => setSelectedPolicy(policy.id)}
              >
                {policy.name}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 bg-[#f7f9fb] p-4 px-5">
          {selected ? (
            <div className="text-[13px] font-semibold text-[#344054]">{selected.name}</div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderInterview = () => {
    return (
      <div className="w-full min-h-[400px] bg-white border border-[#e4e7ec] rounded-[5px] p-[18px]">
        <div className="min-h-[320px] flex flex-col items-center justify-center text-center">
          <div className="mb-3.5 flex justify-center">
            <ConfusedDeskIllustration size={190} />
          </div>
          <h3 className="text-[#e0665c] text-[13px] font-semibold">No Data Found in - Exit interview summary</h3>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "add":
        return renderAddEmployeeList();
      case "offboarded":
        return renderOffboarded();
      case "settings":
        return renderSettings();
      case "interview":
        return renderInterview();
      default:
        return renderDashboard();
    }
  };

  const inputCls = (hasError = false): string =>
    `w-full h-[31px] border rounded-[3px] px-2.5 outline-none text-[10px] text-[#344054] placeholder:text-[#98a2b3] ${
      hasError
        ? "border-[#f04438] bg-[#fff7f6]"
        : "border-transparent bg-[#e9f0f7] focus:border-[#1598df] focus:bg-white"
    }`;
  const errorTextCls = "text-[#f04438] text-[9px] block mt-[3px]";
  const reasonSelectCls = (hasError = false): string =>
    `w-full h-[31px] rounded-[3px] px-2.5 flex items-center justify-between cursor-pointer text-[10px] border hover:border-[#1598df] ${
      hasError ? "border-[#f04438] bg-[#fff7f6] text-[#344054]" : "border-transparent bg-[#e9f0f7] text-[#667085]"
    }`;
  const reasonMenuCls =
    "absolute left-0 right-0 top-[34px] bg-white border border-[#d0d5dd] shadow-[0_6px_15px_rgba(0,0,0,.15)] z-[10001] max-h-[190px] overflow-y-auto";
  const reasonMenuItemCls =
    "w-full h-[25px] border-none bg-white text-left px-2.5 text-[9px] text-[#475467] cursor-pointer hover:bg-[#edf7fd] hover:text-[#1598df]";
  const closeButtonCls =
    "h-[30px] px-3.5 rounded-[3px] text-[10px] cursor-pointer flex items-center gap-[5px] bg-white text-[#475467] border border-[#d0d5dd] hover:bg-[#f2f4f7]";
  const saveButtonCls =
    "h-[30px] px-3.5 rounded-[3px] text-[10px] cursor-pointer flex items-center gap-[5px] bg-[#1598df] text-white border border-[#1598df] hover:bg-[#087fbe]";

  const tabBase =
    "h-[42px] px-4 border-none bg-transparent text-[#667085] text-[11px] cursor-pointer relative whitespace-nowrap hover:text-[#1498df]";
  const tabActive =
    "text-[#1498df] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-[2px] after:bg-[#1498df]";

  return (
    <div className="w-full min-h-screen bg-[#f5f7fa] text-[#344054] font-[Arial,Helvetica,sans-serif] text-xs [&_*]:box-border">
      <div className="w-full h-[43px] bg-white border border-[#e4e7ec] flex items-center pl-2.5 gap-1 max-[900px]:overflow-x-auto">
              <button
                className={activeTab === "dashboard" ? `${tabBase} ${tabActive}` : tabBase}
                onClick={() => handleTabClick("dashboard")}
              >
                Dashboard
              </button>
              <button
                className={activeTab === "add" ? `${tabBase} ${tabActive}` : tabBase}
                onClick={() => handleTabClick("add")}
              >
                Add Employee &amp; List
              </button>
              <button
                className={activeTab === "offboarded" ? `${tabBase} ${tabActive}` : tabBase}
                onClick={() => handleTabClick("offboarded")}
              >
                Offboarded Employee
              </button>
              <button
                className={activeTab === "settings" ? `${tabBase} ${tabActive}` : tabBase}
                onClick={() => handleTabClick("settings")}
              >
                Settings
              </button>
              <button
                className={activeTab === "interview" ? `${tabBase} ${tabActive}` : tabBase}
                onClick={() => handleTabClick("interview")}
              >
                Exit Interview Summary
              </button>

              {activeTab === "settings" && (
                <div className="ml-auto flex items-center gap-2 pr-3">
                  <button
                    className="h-[30px] px-3 border border-[#e4e7ec] rounded bg-[#f2f4f7] text-[#98a2b3] text-[10.5px] flex items-center gap-1.5 cursor-not-allowed"
                    disabled
                  >
                    <span>Select Activity</span>
                    <ChevronDown size={13} />
                  </button>
                  <button
                    className="w-[30px] h-[30px] border border-[#e4e7ec] rounded bg-white text-[#667085] flex items-center justify-center cursor-pointer hover:border-[#1598df] hover:text-[#1598df]"
                    aria-label="History"
                  >
                    <History size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className={activeTab === "settings" ? "w-full p-0" : "w-full p-2"}>{renderContent()}</div>

            {showEmployeeModal && (
              <div className="fixed inset-0 bg-black/[.52] flex items-center justify-center z-[9999] p-2 sm:p-3 overflow-hidden">
                <div className="w-full max-w-[520px] max-h-[calc(100dvh-16px)] sm:max-h-[calc(100dvh-24px)] bg-white rounded overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,.25)] flex flex-col">
                  <div className="h-[48px] min-h-[48px] shrink-0 border-b border-[#e4e7ec] flex items-center px-4 sm:px-[18px]">
                    <h2 className="m-0 text-[#344054] text-sm">Separation Employee</h2>
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-[18px] sm:px-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-3">
                      <div className="relative">
                        <label className="block text-[#344054] text-[10px] mb-1.5">Employee Id/Name</label>
                        <input
                          type="text"
                          value={form.employeeId}
                          onChange={(e) => updateForm("employeeId", e.target.value)}
                          placeholder="Enter name or id for more..."
                          className={inputCls()}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-[#344054] text-[10px] mb-1.5">
                          Notice Period<span className="text-[#f04438] ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.noticePeriod}
                          onChange={(e) => updateForm("noticePeriod", e.target.value)}
                          placeholder="Enter notice period"
                          className={inputCls(errors.noticePeriod)}
                        />
                        {errors.noticePeriod && <span className={errorTextCls}>{errors.noticePeriod}</span>}
                      </div>

                      <div className="relative">
                        <label className="block text-[#344054] text-[10px] mb-1.5">
                          Resigned Date<span className="text-[#f04438] ml-0.5">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="date"
                            value={form.resignedDate}
                            onChange={(e) => updateForm("resignedDate", e.target.value)}
                            className={`${inputCls(errors.resignedDate)} pr-[30px] cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                          />
                          <CalendarDays size={13} className="absolute right-[9px] text-[#98a2b3] pointer-events-none" />
                        </div>
                        {errors.resignedDate && <span className={errorTextCls}>{errors.resignedDate}</span>}
                      </div>

                      <div className="relative">
                        <label className="block text-[#344054] text-[10px] mb-1.5">
                          Date Of Leaving<span className="text-[#f04438] ml-0.5">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="date"
                            value={form.leavingDate}
                            onChange={(e) => updateForm("leavingDate", e.target.value)}
                            className={`${inputCls(errors.leavingDate)} pr-[30px] cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                          />
                          <CalendarDays size={13} className="absolute right-[9px] text-[#98a2b3] pointer-events-none" />
                        </div>
                        {errors.leavingDate && <span className={errorTextCls}>{errors.leavingDate}</span>}
                      </div>

                      <div className="relative">
                        <label className="block text-[#344054] text-[10px] mb-1.5">
                          Reason<span className="text-[#f04438] ml-0.5">*</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            className={reasonSelectCls(errors.reason)}
                            onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                          >
                            <span>{form.reason || "Select Reason"}</span>
                            <span>▾</span>
                          </button>

                          {showReasonDropdown && (
                            <div className={reasonMenuCls}>
                              <button
                                type="button"
                                className={reasonMenuItemCls}
                                onClick={() => {
                                  updateForm("reason", "");
                                  setShowReasonDropdown(false);
                                }}
                              >
                                Select Reason
                              </button>

                              {reasons.map((reason) => (
                                <button
                                  key={reason}
                                  type="button"
                                  className={reasonMenuItemCls}
                                  onClick={() => {
                                    updateForm("reason", reason);
                                    setShowReasonDropdown(false);
                                  }}
                                >
                                  {reason}
                                </button>
                              ))}

                              <button
                                type="button"
                                className={`${reasonMenuItemCls} text-[#1598df] font-semibold border-t border-[#eaecf0]`}
                              >
                                Add Reason
                              </button>
                            </div>
                          )}
                        </div>
                        {errors.reason && <span className={errorTextCls}>{errors.reason}</span>}
                      </div>

                      <div className="relative">
                        <label className="block text-[#344054] text-[10px] mb-1.5">Contact Detail</label>
                        <input
                          type="text"
                          value={form.contactDetail}
                          onChange={(e) => updateForm("contactDetail", e.target.value)}
                          placeholder="944XXXXXXX"
                          className={inputCls()}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-[#344054] text-[10px] mb-1.5">
                          Approved Date Of Leaving<span className="text-[#f04438] ml-0.5">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="date"
                            value={form.approvedDate}
                            onChange={(e) => updateForm("approvedDate", e.target.value)}
                            className={`${inputCls(errors.approvedDate)} pr-[30px] cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                          />
                          <CalendarDays size={13} className="absolute right-[9px] text-[#98a2b3] pointer-events-none" />
                        </div>
                        {errors.approvedDate && <span className={errorTextCls}>{errors.approvedDate}</span>}
                      </div>

                      <div></div>

                      <div className="relative sm:col-span-2">
                        <label className="block text-[#344054] text-[10px] mb-1.5">Remarks</label>
                        <textarea
                          value={form.remarks}
                          onChange={(e) => updateForm("remarks", e.target.value)}
                          placeholder=""
                          className={`${inputCls()} h-[55px] resize-none pt-2`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-[58px] min-h-[58px] shrink-0 bg-[#f8fafc] border-t border-[#e4e7ec] flex items-center justify-end gap-2 px-3.5">
                    <button type="button" className={closeButtonCls} onClick={closeEmployeeModal}>
                      <X size={13} strokeWidth={2.5} />
                      Close
                    </button>
                    <button type="button" className={saveButtonCls} onClick={saveEmployee}>
                      <Save size={13} strokeWidth={2.5} />
                      {saved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showDiscardModal && (
              <div className="fixed inset-0 bg-black/[.52] flex justify-center items-center z-[10000]">
                <div className="w-[340px] bg-white rounded overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,.3)]">
                  <div className="h-[45px] flex items-center gap-2 px-3.5 border-b border-[#eaecf0] text-[#344054] text-xs font-semibold">
                    <span className="text-[#f6c436]">⚠</span>
                    <span>Form Confirm</span>
                  </div>

                  <div className="text-center py-[22px] px-2.5">
                    <div className="text-[#f6c436] text-[11px] mb-2">Are you sure</div>
                    <div className="text-[#f6c436] text-xs font-semibold">You want to Discard your Changes!</div>
                  </div>

                  <div className="h-[55px] flex justify-end items-center gap-2 px-3 bg-[#f8fafc] border-t border-[#eaecf0]">
                    <button
                      className="h-[30px] px-3 rounded-[3px] cursor-pointer text-[10px] bg-white border border-[#d0d5dd] text-[#475467]"
                      onClick={() => setShowDiscardModal(false)}
                    >
                      ×&nbsp; Cancel
                    </button>
                    <button
                      className="h-[30px] px-3 rounded-[3px] cursor-pointer text-[10px] bg-[#f6c436] border border-[#f6c436] text-[#242424] font-semibold"
                      onClick={discardChanges}
                    >
                      ⚡&nbsp; Discard
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showPolicyModal && (
              <div className="fixed inset-0 bg-black/[.52] flex justify-center items-center z-[9999]">
                <div className="w-[560px] max-w-[calc(100vw-30px)] bg-white rounded overflow-visible shadow-[0_15px_40px_rgba(0,0,0,.25)]">
                  <div className="h-[55px] border-b border-[#e4e7ec] flex items-center px-[18px]">
                    <h2 className="m-0 text-[#344054] text-sm">Separation Policy Master</h2>
                  </div>

                  <div className="p-[18px] px-5">
                    <div className="grid grid-cols-2 gap-x-3.5 gap-y-3 max-[900px]:grid-cols-1">
                      <div className="relative">
                        <label className="block text-[#344054] text-[10px] mb-1.5">
                          Policy Name<span className="text-[#f04438] ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          value={policyForm.policyName}
                          onChange={(e) => updatePolicyForm("policyName", e.target.value)}
                          placeholder="Enter policy name"
                          className={inputCls(policyErrors.policyName)}
                        />
                        {policyErrors.policyName && (
                          <span className={errorTextCls}>{policyErrors.policyName}</span>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-[#344054] text-[10px] mb-1.5">
                          Notice Period<span className="text-[#f04438] ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          value={policyForm.noticePeriod}
                          onChange={(e) => updatePolicyForm("noticePeriod", e.target.value)}
                          placeholder="Enter notice period"
                          className={inputCls(policyErrors.noticePeriod)}
                        />
                        {policyErrors.noticePeriod && (
                          <span className={errorTextCls}>{policyErrors.noticePeriod}</span>
                        )}
                      </div>

                      <div className="relative col-span-2 max-[900px]:col-span-1">
                        <label className="block text-[#344054] text-[10px] mb-1.5">
                          Exit Module Email Signatory<span className="text-[#f04438] ml-0.5">*</span>
                        </label>

                        <div className="relative">
                          <button
                            type="button"
                            className={reasonSelectCls(policyErrors.signatory)}
                            onClick={() => setShowSignatoryDropdown(!showSignatoryDropdown)}
                          >
                            <span>{policyForm.signatory || "Select Exit Module Email Signatory"}</span>
                            <span>▾</span>
                          </button>

                          {showSignatoryDropdown && (
                            <div className={`${reasonMenuCls} max-h-[230px]`}>
                              {signatoryOptions.map((name) => (
                                <button
                                  key={name}
                                  type="button"
                                  className={reasonMenuItemCls}
                                  onClick={() => {
                                    updatePolicyForm("signatory", name);
                                    setShowSignatoryDropdown(false);
                                  }}
                                >
                                  {name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {policyErrors.signatory && (
                          <span className={errorTextCls}>{policyErrors.signatory}</span>
                        )}
                      </div>

                      <div className="relative col-span-2 max-[900px]:col-span-1">
                        <label className="block text-[#344054] text-[10px] mb-2">
                          Choose your preferred method for calculating the "Date of leaving"
                        </label>

                        <div className="flex items-center gap-2 py-1.5">
                          <input
                            type="radio"
                            id="leaving-resignation"
                            name="leavingMethod"
                            className="w-3.5 h-3.5 accent-[#1598df] cursor-pointer"
                            checked={policyForm.leavingMethod === "resignation"}
                            onChange={() => updatePolicyForm("leavingMethod", "resignation")}
                          />
                          <label
                            htmlFor="leaving-resignation"
                            className="text-[10.5px] text-[#344054] cursor-pointer"
                          >
                            Resignation date + notice period
                          </label>
                        </div>

                        <div className="flex items-center gap-2 py-1.5">
                          <input
                            type="radio"
                            id="leaving-approval"
                            name="leavingMethod"
                            className="w-3.5 h-3.5 accent-[#1598df] cursor-pointer"
                            checked={policyForm.leavingMethod === "approval"}
                            onChange={() => updatePolicyForm("leavingMethod", "approval")}
                          />
                          <label
                            htmlFor="leaving-approval"
                            className="text-[10.5px] text-[#344054] cursor-pointer"
                          >
                            Resignation approval date + notice period
                          </label>
                        </div>
                      </div>

                      <div className="relative col-span-2 max-[900px]:col-span-1">
                        <div className="flex items-center gap-2 py-[5px]">
                          <input
                            type="checkbox"
                            id="show-ffs"
                            className="w-3.5 h-3.5 accent-[#1598df] cursor-pointer"
                            checked={policyForm.showFFS}
                            onChange={(e) => updatePolicyForm("showFFS", e.target.checked)}
                          />
                          <label htmlFor="show-ffs" className="text-[10.5px] text-[#344054] cursor-pointer">
                            Show FFS to Employee (ESS)
                          </label>
                        </div>

                        <div className="flex items-center gap-2 py-[5px]">
                          <input
                            type="checkbox"
                            id="send-mail"
                            className="w-3.5 h-3.5 accent-[#1598df] cursor-pointer"
                            checked={policyForm.sendMail}
                            onChange={(e) => updatePolicyForm("sendMail", e.target.checked)}
                          />
                          <label htmlFor="send-mail" className="text-[10.5px] text-[#344054] cursor-pointer">
                            Mail to be sent after accepting the resignation
                          </label>
                        </div>
                      </div>

                      {(policyEmployees.length > 0 || policyKTTasks.length > 0) && (
                        <div className="col-span-2 max-[900px]:col-span-1 flex flex-wrap gap-2 pt-1">
                          {policyEmployees.length > 0 && (
                            <span className="text-[10px] text-[#1598df] bg-[#eaf6fd] border border-[#cdeaf8] rounded-full px-2.5 py-1">
                              {policyEmployees.length} employee{policyEmployees.length > 1 ? "s" : ""} added
                            </span>
                          )}
                          {policyKTTasks.length > 0 && (
                            <span className="text-[10px] text-[#1598df] bg-[#eaf6fd] border border-[#cdeaf8] rounded-full px-2.5 py-1">
                              {policyKTTasks.length} KT task{policyKTTasks.length > 1 ? "s" : ""} created
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-[58px] bg-[#f8fafc] border-t border-[#e4e7ec] flex items-center justify-between px-4">
                    <div className="flex gap-[18px]">
                      <button
                        type="button"
                        className="border-none bg-transparent text-[#1598df] text-[10.5px] font-semibold cursor-pointer p-0 hover:underline"
                        onClick={openAddEmployeesModal}
                      >
                        Add Employees{policyEmployees.length > 0 ? ` (${policyEmployees.length})` : ""}
                      </button>
                      <button
                        type="button"
                        className="border-none bg-transparent text-[#1598df] text-[10.5px] font-semibold cursor-pointer p-0 hover:underline"
                        onClick={openKTTasksModal}
                      >
                        Create Default KT Tasks{policyKTTasks.length > 0 ? ` (${policyKTTasks.length})` : ""}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button type="button" className={closeButtonCls} onClick={closePolicyModal}>
                        <X size={13} strokeWidth={2.5} />
                        Close
                      </button>
                      <button type="button" className={saveButtonCls} onClick={savePolicy}>
                        <Save size={13} strokeWidth={2.5} />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showAddEmployeesModal && (
              <div className="fixed inset-0 bg-black/[.52] flex justify-center items-center z-[10002]">
                <div className="w-[380px] max-w-[calc(100vw-30px)] bg-white rounded overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,.25)]">
                  <div className="h-[50px] border-b border-[#e4e7ec] flex items-center justify-between px-4">
                    <h2 className="m-0 text-[#344054] text-[13px]">Add Employees</h2>
                    <button
                      type="button"
                      className="border-none bg-transparent cursor-pointer text-[#98a2b3] hover:text-[#475467]"
                      onClick={closeAddEmployeesModal}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="max-h-[320px] overflow-y-auto py-2">
                    {employeePool.map((emp) => (
                      <label
                        key={emp.id}
                        className="flex items-center gap-2.5 px-4 py-2 text-[11px] text-[#344054] cursor-pointer hover:bg-[#f6fafd]"
                      >
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 accent-[#1598df] cursor-pointer"
                          checked={selectedEmployeeIds.includes(emp.id)}
                          onChange={() => toggleEmployeeSelection(emp.id)}
                        />
                        {emp.name}
                      </label>
                    ))}
                  </div>

                  <div className="h-[52px] bg-[#f8fafc] border-t border-[#e4e7ec] flex items-center justify-between px-4">
                    <span className="text-[10px] text-[#667085]">{selectedEmployeeIds.length} selected</span>
                    <div className="flex gap-2">
                      <button type="button" className={closeButtonCls} onClick={closeAddEmployeesModal}>
                        <X size={13} strokeWidth={2.5} />
                        Close
                      </button>
                      <button type="button" className={saveButtonCls} onClick={confirmAddEmployees}>
                        <Save size={13} strokeWidth={2.5} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showKTTasksModal && (
              <div className="fixed inset-0 bg-black/[.52] flex justify-center items-center z-[10002]">
                <div className="w-[460px] max-w-[calc(100vw-30px)] bg-white rounded overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,.25)]">
                  <div className="h-[50px] border-b border-[#e4e7ec] flex items-center justify-between px-4">
                    <h2 className="m-0 text-[#344054] text-[13px]">Create Default KT Tasks</h2>
                    <button
                      type="button"
                      className="border-none bg-transparent cursor-pointer text-[#98a2b3] hover:text-[#475467]"
                      onClick={closeKTTasksModal}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="max-h-[320px] overflow-y-auto p-4 flex flex-col gap-2.5">
                    {ktTaskDraft.map((task, index) => (
                      <div key={task.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={task.taskName}
                          onChange={(e) => updateKTTaskRow(task.id, "taskName", e.target.value)}
                          placeholder={`Task ${index + 1} name`}
                          className={`${inputCls(false)} flex-1`}
                        />
                        <input
                          type="text"
                          value={task.assignedTo}
                          onChange={(e) => updateKTTaskRow(task.id, "assignedTo", e.target.value)}
                          placeholder="Assigned to"
                          className={`${inputCls(false)} w-[130px]`}
                        />
                        <button
                          type="button"
                          className="border-none bg-transparent text-[#98a2b3] hover:text-[#f04438] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => removeKTTaskRow(task.id)}
                          disabled={ktTaskDraft.length === 1}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="self-start border-none bg-transparent text-[#1598df] text-[10.5px] font-semibold cursor-pointer p-0 hover:underline flex items-center gap-1"
                      onClick={addKTTaskRow}
                    >
                      <Plus size={12} strokeWidth={2.5} />
                      Add Task
                    </button>
                  </div>

                  <div className="h-[52px] bg-[#f8fafc] border-t border-[#e4e7ec] flex items-center justify-end gap-2 px-4">
                    <button type="button" className={closeButtonCls} onClick={closeKTTasksModal}>
                      <X size={13} strokeWidth={2.5} />
                      Close
                    </button>
                    <button type="button" className={saveButtonCls} onClick={saveKTTasks}>
                      <Save size={13} strokeWidth={2.5} />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

    </div>
  );
}
