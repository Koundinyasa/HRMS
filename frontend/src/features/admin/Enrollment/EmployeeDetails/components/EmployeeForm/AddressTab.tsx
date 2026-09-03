import React, { useState } from "react";
import { ArrowRight, Phone, Mail } from "lucide-react";

/* ============================================================
   STYLE TOKENS
============================================================ */

const FIELD =
  "h-[40px] w-full rounded-[4px] border border-[#E2E5E9] bg-white px-3 text-[13px] " +
  "text-[#475467] outline-none transition-all duration-150 placeholder:text-[#B6BDC7] " +
  "focus:border-[#2589E8] focus:ring-2 focus:ring-[#2589E8]/15";

const LABEL = "mb-[6px] block text-[12px] leading-[15px] font-medium text-[#667085]";

const CARD =
  "rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]";

/* ============================================================
   FIELD SCHEMA
============================================================ */

interface AddressFieldDef {
  key: string;
  label: string;
}

const ADDRESS_FIELDS: AddressFieldDef[] = [
  { key: "residentialNo", label: "Residential No." },
  { key: "residentialName", label: "Residential Name" },
  { key: "street", label: "Street" },
  { key: "locality", label: "Locality" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pincode", label: "Pincode" },
  { key: "country", label: "Country" },
];

const CONTACT_FIELDS: AddressFieldDef[] = [
  { key: "mobileNo", label: "Mobile No." },
  { key: "altMobileNo", label: "Alt Mobile No." },
  { key: "officialEmailId", label: "Official Email Id" },
  { key: "alternateEmailId", label: "Alternate Email Id" },
  { key: "emergencyNo", label: "Emergency No." },
];

type AddressBlock = Record<string, string>;

/* ============================================================
   TEXT FIELD
============================================================ */

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
}) => (
  <div>
    <label className={LABEL}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={FIELD}
    />
  </div>
);

/* ============================================================
   PANEL — white card with the light-blue header pill
============================================================ */

interface PanelProps {
  title: string;
  onCopy?: () => void;
  copyTitle?: string;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, onCopy, copyTitle, children }) => (
  <div className={`${CARD} flex min-w-0 flex-1 flex-col p-3.5`}>
    <div className="relative mb-4 flex h-[34px] shrink-0 items-center justify-center rounded-[4px] bg-[#DCEEFB] px-3">
      <span className="text-[13px] font-medium text-[#4A6B85]">{title}</span>

      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          title={copyTitle}
          aria-label={copyTitle}
          className="absolute right-2.5 grid h-[24px] w-[24px] place-items-center rounded text-[#2196F3] transition-colors hover:bg-white/70"
        >
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>

    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">{children}</div>
  </div>
);

/* ============================================================
   ADDRESS TAB
============================================================ */

interface AddressTabProps {
  form: any;
  set?: (key: string, value: any) => void;
}

const AddressTab: React.FC<AddressTabProps> = ({ form }) => {
  const [present, setPresent] = useState<AddressBlock>({
    residentialNo: "13-1-56-4/2, #57",
    residentialName: "SRIDHAR REDDY BUILDING",
    street: "AVANTI NAGAR THOTA, MOTI NAGAR, NEAR YOUSUFGUDA",
    locality: "ERRAGADDA",
    city: "HYDERABAD",
    state: "TELANGANA",
    pincode: "500018",
    country: "INDIA",
  });

  const [permanent, setPermanent] = useState<AddressBlock>({
    residentialNo: "1-22, RAMACHANDRA PURAM VILLAGE",
    residentialName: "AVURAPALLI CHANTI NILAYAM",
    street: "PONDURU POST, KOTAURATLA MANDAL",
    locality: "ANAKAPALLI DISTRICT",
    city: "VISAKHAPATNAM",
    state: "ANDHRA PRADESH",
    pincode: "531033",
    country: "INDIA",
  });

  const [contact, setContact] = useState<AddressBlock>({
    mobileNo: "9491964186",
    altMobileNo: "9346778878",
    officialEmailId: "bhagyaraja.a@koundinyasatech.com",
    alternateEmailId: "rajab9436@gmail.com",
    emergencyNo: "7799860843",
  });

  const setPresentField = (key: string, value: string) =>
    setPresent((p) => ({ ...p, [key]: value }));

  const setPermanentField = (key: string, value: string) =>
    setPermanent((p) => ({ ...p, [key]: value }));

  const setContactField = (key: string, value: string) =>
    setContact((p) => ({ ...p, [key]: value }));

  /** Copy Present Address across to Permanent Address */
  const copyToPermanent = () => setPermanent({ ...present });

  return (
    <div className="flex h-full min-h-[480px] gap-5">
      {/* ===================== LEFT: PROFILE CARD ===================== */}
      <div className="w-[210px] shrink-0">
        <div className={`${CARD} overflow-hidden`}>
          <div className="flex justify-center px-4 pt-4">
            <div className="h-[188px] w-[158px] overflow-hidden rounded-md border border-gray-200 bg-gray-50">
              <img
                src={form?.photoUrl || "https://i.pravatar.cc/300?u=294640"}
                alt={form?.fullName || "Employee"}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="px-4 pb-4 pt-3 text-center">
            <h3 className="text-[13.5px] font-semibold uppercase leading-tight tracking-tight text-[#5B7C99]">
              {form?.fullName || "BHAGYARAJA AVURAPALLI"}
            </h3>

            <div className="mt-1.5 inline-flex items-center rounded-full bg-[#E8F5E9] px-2.5 py-[2px] text-[11px] font-medium text-[#2E7D32]">
              {form?.empId || "294640"}
            </div>

            <p className="mt-2 text-[11px] leading-[1.35] text-gray-500">
              {form?.designation || "Senior Software Engineer"} |{" "}
              {form?.branch || "Koundinyasa Technology Services Pvt. Ltd."}
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              DOJ {form?.dateOfJoining || "31/Mar/2026"}
            </p>

            <div className="mt-3 space-y-1.5 pl-1 text-left">
              <div className="flex items-center gap-2 text-[12px] text-gray-600">
                <Phone size={12} className="shrink-0 text-gray-400" />
                <span>{form?.mobile || "9491964186"}</span>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-gray-600">
                <Mail size={12} className="shrink-0 text-gray-400" />
                <span className="truncate" title={form?.email}>
                  {form?.email || "bhagyaraja.a@koundinyasatech.com"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== RIGHT: THREE PANELS ===================== */}
      <div className="flex min-h-0 flex-1 gap-4">
        <Panel
          title="Present Address"
          onCopy={copyToPermanent}
          copyTitle="Copy to Permanent Address"
        >
          {ADDRESS_FIELDS.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              value={present[f.key] ?? ""}
              onChange={(v) => setPresentField(f.key, v)}
            />
          ))}
        </Panel>

        <Panel title="Permanent Address">
          {ADDRESS_FIELDS.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              value={permanent[f.key] ?? ""}
              onChange={(v) => setPermanentField(f.key, v)}
            />
          ))}
        </Panel>

        <Panel title="Contact Info.">
          {CONTACT_FIELDS.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              type={f.key.toLowerCase().includes("email") ? "email" : "text"}
              value={contact[f.key] ?? ""}
              onChange={(v) => setContactField(f.key, v)}
            />
          ))}
        </Panel>
      </div>
    </div>
  );
};

export default AddressTab;