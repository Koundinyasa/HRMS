import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, User, Briefcase, ShieldCheck, MapPin, FileText, LogOut, Workflow } from "lucide-react";
import { useGetEmployeeDetailQuery } from "../api/employeeListApi";
import { openProtectedFileInTab, resolveFileUrl } from "@/app/fileAccess";
 
const TABS = [
  { key: "general", label: "General", icon: User },
  { key: "classification", label: "Classification", icon: Briefcase },
  { key: "statutory", label: "Statutory", icon: ShieldCheck },
  { key: "address", label: "Address", icon: MapPin },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "separation", label: "Separation", icon: LogOut },
  { key: "workflow", label: "Workflow", icon: Workflow },
] as const;
 
type TabKey = (typeof TABS)[number]["key"];
 
function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="min-w-0">
      <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#626262]">{label}</div>
      <div className="mt-1 truncate text-[14.5px] text-[#131313]">{value}</div>
    </div>
  );
}
 
function Boolean_({ label, value }: { label: string; value: 0 | 1 | undefined }) {
  if (value === undefined) return null;
  return (
    <div className="flex items-center gap-[8px]">
      <span className={["h-[8px] w-[8px] rounded-full", value === 1 ? "bg-[#10B981]" : "bg-[#BFBFBF]"].join(" ")} />
      <span className="text-[13.5px] text-[#131313]">{label}</span>
    </div>
  );
}
 
// Opens an employee document with the login session (refreshing it if the
// access token has expired) instead of a plain link.
async function viewDocument(filePath: string) {
  try {
    const opened = await openProtectedFileInTab(resolveFileUrl(filePath));
    if (!opened) window.alert("Allow pop-ups to view the document.");
  } catch (err) {
    window.alert(err instanceof Error ? err.message : "Could not open the document.");
  }
}

export default function EmployeeDetailPage() {
  const { empId } = useParams<{ empId: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("general");
 
  const { data, isLoading, isError } = useGetEmployeeDetailQuery(empId!, { skip: !empId });
 
  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center text-[14px] text-[#626262]">Loading employee details...</div>;
  }
 
  if (isError || !data) {
    return <div className="flex min-h-[400px] items-center justify-center text-[14px] text-[#DD3232]">Could not load employee details.</div>;
  }
 
  const { general, classification, statutory, address, documents, separation, workflowDetails } = data;
  const g = general[0];
  const c = classification[0];
  const s = statutory[0];
  const a = address[0];
  const sep = separation[0];
 
  return (
    <div className="w-full text-[#131313]">
      <Link
        to=".."
        relative="path"
        className="mb-3 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#626262] hover:text-[#FF6200]"
      >
        <ArrowLeft size={15} /> Back to Employee List
      </Link>

      <div className="rounded-[8px] border border-[#E2E2E2] bg-white p-[16px] shadow-[0_1px_3px_rgba(19,19,19,0.07)]">
        <div className="flex items-center gap-[14px]">
          {g?.ProfilePhoto ? (
            <img src={g.ProfilePhoto} alt={g.FullName} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF5EE] text-[22px] font-semibold text-[#FF6200]">
              {g?.FullName?.charAt(0) ?? "?"}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-[20px] font-bold text-[#131313]">{g?.FullName ?? "—"}</div>
            {c?.DesignationName && <div className="mt-0.5 text-[14px] text-[#626262]">{c.DesignationName}</div>}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#626262]">
              {g?.EmployeeID && <span>ID: {g.EmployeeID}</span>}
              {g?.Email && <span>{g.Email}</span>}
              {c?.Department && <span>{c.Department}</span>}
            </div>
          </div>
        </div>
      </div>
 
      <div className="mt-[10px] flex flex-wrap gap-[4px] rounded-[8px] border border-[#E2E2E2] bg-white p-[4px] shadow-[0_1px_3px_rgba(19,19,19,0.07)]">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={[
              "flex items-center gap-[6px] rounded-lg px-4 py-2 text-[13.5px] font-medium transition-colors",
              activeTab === key ? "bg-[#FFF5EE] text-[#FF6200]" : "text-[#626262] hover:bg-[#F5F5F5]",
            ].join(" ")}
          >
            <Icon size={15} strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>
 
      <div className="mt-[10px] rounded-[8px] border border-[#E2E2E2] bg-white p-[18px] shadow-[0_1px_3px_rgba(19,19,19,0.07)]">
        {activeTab === "general" && g && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[18px]">
            <Field label="First Name" value={g.FirstName} />
            <Field label="Last Name" value={g.LastName} />
            <Field label="Date of Birth" value={g.DateofBirth} />
            <Field label="Date of Joining" value={g.DateofJoining} />
            <Field label="Email" value={g.Email} />
            <Field label="Gender" value={g.Gender} />
            <Field label="Marital Status" value={g.MaritalStatus} />
            <Field label="Father Name" value={g.FatherName} />
            <Field label="Spouse Name" value={g.SpouseName} />
            <Field label="Reporting Authority" value={g.ReportingAuthorityName} />
          </div>
        )}
 
        {activeTab === "classification" && c && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[18px]">
            <Field label="Branch" value={c.BranchName} />
            <Field label="Department" value={c.Department} />
            <Field label="Designation" value={c.DesignationName} />
            <Field label="Leave Policy" value={c.LeavePolicy} />
            <Field label="Bank Name" value={c.BankName} />
            <Field label="Account Number" value={c.AccountNumber} />
            <Field label="IFSC" value={c.IFSC} />
          </div>
        )}
 
        {activeTab === "statutory" && s && (
          <div className="space-y-[20px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[18px]">
              <Field label="Aadhaar Number" value={s.AadhaarNumber} />
              <Field label="PAN Number" value={s.PANNumber} />
              <Field label="PF Number" value={s.PFNumber} />
              <Field label="UAN Number" value={s.UANNumber} />
              <Field label="ESI Number" value={s.ESINumber} />
              <Field label="Financial Year" value={s.FinancialYear} />
              <Field label="Effective From" value={s.EffectiveFrom} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px] pt-[14px] border-t border-[#E2E2E2]">
              <Boolean_ label="PF Applicable" value={s.PFApplicable} />
              <Boolean_ label="Voluntary PF" value={s.PFVoluntary} />
              <Boolean_ label="Zero Pension" value={s.ZeroPension} />
              <Boolean_ label="Restrict Employee PF" value={s.RestrictEmployeePF} />
              <Boolean_ label="Zero PT" value={s.ZeroPT} />
              <Boolean_ label="ESI Applicable" value={s.ESIApplicable} />
              <Boolean_ label="International Worker" value={s.InternationalWorker} />
              <Boolean_ label="LWF Applicable" value={s.LWFApplicable} />
            </div>
          </div>
        )}
 
        {activeTab === "address" && a && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[18px]">
            <Field label="Address Type" value={a.AddressType} />
            <Field label="Residential Name/No" value={a.ResidentialNameNo} />
            <Field label="Street" value={a.Street} />
            <Field label="Locality" value={a.Locality} />
            <Field label="City" value={a.City} />
            <Field label="State" value={a.State} />
            <Field label="Pin Code" value={a.PinCode} />
            <Field label="Mobile No" value={a.MobileNo} />
            <Field label="Alt Mobile No" value={a.AltMobileNo} />
            <Field label="Official Email" value={a.OfficialEmailId} />
            <Field label="Alternate Email" value={a.AlternateEmailId} />
            <Field label="Emergency No" value={a.EmergencyNo} />
          </div>
        )}
 
        {activeTab === "documents" && (
          documents.length === 0 ? (
            <div className="py-[40px] text-center text-[14px] text-[#626262]">No documents uploaded.</div>
          ) : (
            <div className="space-y-[8px]">
              {documents.map((doc) => (
                <div key={doc.ID} className="flex items-center justify-between rounded-[6px] border border-[#E2E2E2] px-[14px] py-[10px]">
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold text-[#131313]">{doc.DocumentName ?? doc.FileName}</div>
                    <div className="mt-[2px] text-[13px] text-[#626262]">
                      {doc.DocumentType && <span>{doc.DocumentType} · </span>}
                      {doc.Date && <span>{doc.Date}</span>}
                    </div>
                  </div>
                  {doc.FilePath && (
                    <button type="button" onClick={() => void viewDocument(doc.FilePath!)} className="shrink-0 text-[13px] font-semibold text-[#FF6200] hover:underline">
                      View
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        )}
 
        {activeTab === "separation" && (
          sep && (sep.ResignationDate || sep.DateofLeaving || sep.Reason || sep.Remarks) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[18px]">
              <Field label="Resignation Date" value={sep.ResignationDate} />
              <Field label="Date of Leaving" value={sep.DateofLeaving} />
              <Field label="Reason" value={sep.Reason} />
              <Field label="Remarks" value={sep.Remarks} />
            </div>
          ) : (
            <div className="py-[40px] text-center text-[14px] text-[#626262]">No separation record — employee is active.</div>
          )
        )}
 
        {activeTab === "workflow" && (
          workflowDetails.length === 0 ? (
            <div className="py-[40px] text-center text-[14px] text-[#626262]">No workflow details available.</div>
          ) : (
            <div className="space-y-[8px]">
              {workflowDetails.map((w, i) => (
                <div key={`${w.Name}-${w.SlNo}-${i}`} className="flex items-center justify-between rounded-[6px] border border-[#E2E2E2] px-[14px] py-[10px]">
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-[#131313]">{w.WorkflowName}</div>
                    <div className="mt-[2px] text-[13px] text-[#626262]">
                      {w.Approver && <span>Approver: {w.Approver}</span>}
                      {w.GroupName && <span> · {w.GroupName}</span>}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-[4px] bg-[#FFF5EE] px-2.5 py-1 text-[12px] font-semibold text-[#FF6200]">
                    Level {w.Level}
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}