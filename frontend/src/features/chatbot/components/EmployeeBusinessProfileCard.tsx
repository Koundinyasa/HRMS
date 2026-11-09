import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type {
  EmployeeBusinessProfile,
  EmployeeProfileField,
  EmployeeProfileSection,
  EmployeeProfileValue,
} from "../types/chatbot.types";
 
const GRADIENT_STYLE = { backgroundImage: "var(--primary-gradient)" };
const FILE_PATH_VALUE = /[\\/]|^[a-z]:[\\/]|^file:\/\//i;
const PROFILE_DATE_LABEL = /\b(date|dob|doj|joining|birth|expiry|passing)\b/i;
const ISO_DATE_VALUE =
  /^(\d{4})-(\d{2})-(\d{2})(?:$|T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?$)/;
 
function displayValue(
  value: EmployeeProfileValue | undefined,
  label?: string,
): string {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "Not provided";
  }
  const text = String(value).trim();
  if (label && PROFILE_DATE_LABEL.test(label)) {
    const match = ISO_DATE_VALUE.exec(text);
    if (match) {
      const [, year, month, day] = match;
      const parsed = new Date(Number(year), Number(month) - 1, Number(day));
      if (
        parsed.getFullYear() === Number(year) &&
        parsed.getMonth() === Number(month) - 1 &&
        parsed.getDate() === Number(day)
      ) {
        return parsed.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }
  }
  return text;
}
 
function hasValue(value: EmployeeProfileValue | undefined): boolean {
  return value !== null && value !== undefined && String(value).trim() !== "";
}
 
function isEmployeeIdField(field: EmployeeProfileField): boolean {
  return /\bemploy(?:ee)?\s*id\b/i.test(field.label);
}
 
function isEmploymentLookupIdField(field: EmployeeProfileField): boolean {
  const label = normalizedLabel(field.label);
  return label === "employmenttypeid" || label === "employmentstatusid";
}
 
function displaySectionTitle(section: EmployeeProfileSection): string {
  return /^address$/i.test(section.title.trim())
    ? "Address Details"
    : section.title
        .replace(/^experience$/i, "Experience Details")
        .replace(/^education$/i, "Education Details")
        .replace(/^family details$/i, "Family Details");
}
 
function isSafeField(field: EmployeeProfileField): boolean {
  const label = normalizedLabel(field.label);
  const hasSensitiveLabel =
    /account|ifsc|salary|aadhaar|passport|uan|password|filepath|documentpath|storedpath|documentnumber|certificatenumber|experienceletter|relievingletter|certificatefile/.test(
      label,
    ) ||
    /\bpan\b/i.test(field.label) ||
    /pan(?:number|no|card|id)?$/.test(label) ||
    /\bpf\b/i.test(field.label) ||
    /pf(?:number|no)?$/.test(label);
  return (
    !isEmployeeIdField(field) &&
    !isEmploymentLookupIdField(field) &&
    !hasSensitiveLabel &&
    !(
      typeof field.value === "string" &&
      FILE_PATH_VALUE.test(field.value.trim())
    )
  );
}
 
const SAFE_BANK_FIELD_LABELS = new Set([
  "accountholdername",
  "accountnumber",
  "accounttype",
  "ifsccode",
  "bankcode",
  "bankname",
  "branchname",
  "city",
  "state",
  "bankaddress",
]);
 
function isSafeBankField(field: EmployeeProfileField): boolean {
  return (
    SAFE_BANK_FIELD_LABELS.has(normalizedLabel(field.label)) &&
    !(
      typeof field.value === "string" &&
      FILE_PATH_VALUE.test(field.value.trim())
    )
  );
}
 
type PdfSectionRow =
  | { kind: "emptyState" }
  | { kind: "recordHeading"; heading: string }
  | {
      kind: "field";
      label: string;
      value: EmployeeProfileValue;
      showEmpty?: boolean;
    }
  | { kind: "education"; values: EmployeeProfileValue[] };
 
function getSectionRecords(
  section: EmployeeProfileSection,
): { heading?: string; fields: EmployeeProfileField[] }[] {
  const isBankSection = sectionKind(section) === "bank";
  const isDisplayable = (field: EmployeeProfileField) =>
    isSafeField(field) || (isBankSection && isSafeBankField(field));
  const records: { heading?: string; fields: EmployeeProfileField[] }[] =
    section.records?.map((record) => ({
      heading: record.heading,
      fields: record.fields.filter(isDisplayable),
    })) ?? [];
  const sectionFields = section.fields?.filter(isDisplayable) ?? [];
  if (sectionFields.length > 0) {
    records.unshift({ fields: sectionFields });
  }
  return records.filter(
    (record) => record.fields.length > 0 || Boolean(record.heading),
  );
}
 
function normalizedLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "");
}
 
function canonicalPersonalLabel(label: string): string {
  const normalized = normalizedLabel(label);
  const aliases: Record<string, string> = {
    company: "Company Name",
    companyname: "Company Name",
    designationname: "Designation",
    reportingmanager: "Reporting Manager Name",
    reportingmanagername: "Reporting Manager Name",
    dob: "Date of Birth",
    dateofbirth: "Date of Birth",
    doj: "Date of Joining",
    dateofjoining: "Date of Joining",
    dol: "Date of Leaving",
    dateofleaving: "Date of Leaving",
    grade: "Employment Grade",
    gradevalue: "Employment Grade",
    employmentgrade: "Employment Grade",
    email: "Official Email",
    emailid: "Official Email",
    officialemailid: "Official Email",
    mobileno: "Mobile Number",
    mobilenumber: "Mobile Number",
    employmenttypename: "Employment Type",
    employmentstatusname: "Employment Status",
  };
  return aliases[normalized] ?? label;
}
 
function fieldValue(
  fields: EmployeeProfileField[],
  labels: string[],
): EmployeeProfileValue | undefined {
  return fieldForLabels(fields, labels)?.value;
}
 
function fieldForLabels(
  fields: EmployeeProfileField[],
  labels: string[],
): EmployeeProfileField | undefined {
  const acceptedLabels = new Set(labels.map(normalizedLabel));
  return fields.find((field) =>
    acceptedLabels.has(normalizedLabel(field.label)),
  );
}
 
function getPersonalFields(
  profile: EmployeeBusinessProfile,
): EmployeeProfileField[] {
  const personalSection = profile.sections.find(
    (section) => section.title.trim().toLowerCase() === "personal information",
  );
  const headerOnlyLabels = new Set([
    "employeeid",
    "employeename",
    "fullname",
    "profilephoto",
  ]);
  const returnedFields = [
    ...(personalSection?.fields ?? []),
    ...(personalSection?.records ?? []).flatMap((record) => record.fields),
  ]
    .filter(
      (field) =>
        isSafeField(field) &&
        !headerOnlyLabels.has(normalizedLabel(field.label)),
    )
    .map((field) => ({
      ...field,
      label: canonicalPersonalLabel(field.label),
    }));
  const fallbackFields: EmployeeProfileField[] = [
    { label: "First Name", value: profile.identity.firstName },
    { label: "Last Name", value: profile.identity.lastName },
    { label: "Date of Birth", value: profile.identity.dateOfBirth },
    { label: "Gender", value: profile.identity.gender },
    { label: "Date of Joining", value: profile.employment.dateOfJoining },
    { label: "Date of Leaving", value: profile.employment.dateOfLeaving },
    { label: "Employment Grade", value: profile.employment.grade },
    { label: "Official Email", value: profile.contact.email },
    { label: "Mobile Number", value: profile.contact.mobileNo },
    { label: "Company Name", value: profile.organization.companyName },
    { label: "Branch", value: profile.organization.branchName },
    { label: "Department", value: profile.organization.departmentName },
    { label: "Designation", value: profile.organization.designationName },
    {
      label: "Reporting Manager Name",
      value: profile.organization.reportingManagerName,
    },
    { label: "Employment Type", value: profile.organization.employmentType },
    {
      label: "Employment Status",
      value: profile.organization.employmentStatus,
    },
  ].filter(isSafeField);
  const fieldMap = new Map<string, EmployeeProfileField>();
  for (const field of [
    ...returnedFields,
    ...fallbackFields.map((fallback) => ({
      ...fallback,
      label: canonicalPersonalLabel(fallback.label),
    })),
  ]) {
    const key = normalizedLabel(field.label);
    const current = fieldMap.get(key);
    if (!current || (!hasValue(current.value) && hasValue(field.value))) {
      fieldMap.set(key, field);
    }
  }
  return [...fieldMap.values()];
}
 
function getEducationRow(record: ProfileRecord) {
  const educationLevel = fieldForLabels(record.fields, [
    "Education Level",
    "Level",
  ]);
  const degree = fieldForLabels(record.fields, [
    "Degree",
    "Qualification",
    "Course",
  ]);
  const institution = fieldForLabels(record.fields, [
    "Institution",
    "Institution Name",
  ]);
  const university = fieldForLabels(record.fields, [
    "Board / University",
    "University",
  ]);
  const specialization = fieldForLabels(record.fields, ["Specialization"]);
  const startDate = fieldForLabels(record.fields, ["Start Date"]);
  const endDate = fieldForLabels(record.fields, ["End Date"]);
  const passingYear = fieldForLabels(record.fields, ["Year of Passing"]);
  const grade = fieldForLabels(record.fields, ["Grade", "Grade Value"]);
  const gradeType = fieldForLabels(record.fields, ["Grade Type"]);
  const country = fieldForLabels(record.fields, ["Country"]);
  const state = fieldForLabels(record.fields, ["State"]);
  const displayedFields = new Set(
    [
      educationLevel,
      degree,
      institution,
      university,
      specialization,
      startDate,
      endDate,
      passingYear,
      grade,
      gradeType,
      country,
      state,
    ].filter((field): field is EmployeeProfileField => field !== undefined),
  );
  const gradeValue = grade?.value;
  const gradeTypeValue = gradeType?.value;
  const gradeLabel =
    hasValue(gradeValue) && hasValue(gradeTypeValue)
      ? `${displayValue(gradeValue)} (${displayValue(gradeTypeValue)})`
      : hasValue(gradeValue)
        ? displayValue(gradeValue)
        : hasValue(gradeTypeValue)
          ? displayValue(gradeTypeValue)
          : "";
 
  return {
    degree: degree?.value,
    educationLevel: educationLevel?.value,
    institution: institution?.value,
    university: university?.value,
    specialization: specialization?.value,
    startDate: startDate?.value,
    endDate: endDate?.value,
    passingYear: passingYear?.value,
    grade: gradeLabel,
    country: country?.value,
    state: state?.value,
    additionalFields: record.fields.filter(
      (field) => !displayedFields.has(field),
    ),
  };
}
 
function sectionKind(
  section: EmployeeProfileSection,
):
  | "bank"
  | "address"
  | "family"
  | "documents"
  | "experience"
  | "education"
  | "other" {
  const title = section.title.toLowerCase();
  if (title.includes("bank")) return "bank";
  if (title.includes("address")) return "address";
  if (title.includes("family")) return "family";
  if (title.includes("document")) return "documents";
  if (title.includes("experience")) return "experience";
  if (title.includes("education")) return "education";
  return "other";
}
 
const PROFILE_SECTION_ORDER: Record<ReturnType<typeof sectionKind>, number> = {
  bank: 6,
  address: 0,
  family: 1,
  documents: 7,
  experience: 2,
  education: 3,
  other: 8,
};
 
function getAdditionalSections(
  sections: EmployeeProfileSection[],
  personalFields: EmployeeProfileField[],
): { section: EmployeeProfileSection; records: ProfileRecord[] }[] {
  const personalValues = new Set(
    personalFields.map(
      (field) =>
        `${normalizedLabel(field.label)}:${String(field.value ?? "")
          .trim()
          .toLowerCase()}`,
    ),
  );
  return sections
    .filter(
      (section) =>
        section.title.trim().toLowerCase() !== "personal information",
    )
    .filter((section) => {
      const kind = sectionKind(section);
      return (
        ["address", "bank", "family", "experience", "education"].includes(
          kind,
        )
      );
    })
    .map((section) => {
      const kind = sectionKind(section);
      const records = getSectionRecords(section).map((record) => ({
        ...record,
        fields:
          kind === "address"
            ? record.fields.filter(
                (field) =>
                  !personalValues.has(
                    `${normalizedLabel(field.label)}:${String(
                      field.value ?? "",
                    )
                      .trim()
                      .toLowerCase()}`,
                  ),
              )
            : record.fields,
      }));
      return {
        section,
        records: records.filter(
          (record) => record.fields.length > 0 || Boolean(record.heading),
        ),
      };
    })
    .sort(
      (left, right) =>
        PROFILE_SECTION_ORDER[sectionKind(left.section)] -
        PROFILE_SECTION_ORDER[sectionKind(right.section)],
    );
}
 
function ProfileField({
  label,
  value,
  showEmpty = false,
}: {
  label: string;
  value: EmployeeProfileValue;
  showEmpty?: boolean;
}) {
  if (!showEmpty && !hasValue(value)) return null;
 
  return (
    <div className="min-w-0 rounded-xl bg-[#f7f8fc] px-3 py-2.5">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#747b91]">
        {label}
      </dt>
      <dd className="m-0 mt-1 break-words text-[12px] font-medium text-[#252a38]">
        {displayValue(value, label)}
      </dd>
    </div>
  );
}
 
type ProfileRecord = { heading?: string; fields: EmployeeProfileField[] };
type RecordVariant =
  | "bank"
  | "address"
  | "family"
  | "documents"
  | "experience"
  | "education"
  | "other";
 
function recordHeading(
  record: ProfileRecord,
  variant: RecordVariant,
): string | null {
  if (record.heading) return record.heading;
  const headingFields: Record<RecordVariant, string[]> = {
    bank: [],
    address: ["Address Type"],
    family: ["Family Member Name", "Member Name", "Name"],
    documents: ["Document Name", "Document Title"],
    experience: ["Company", "Company Name", "Previous Company Name"],
    education: [],
    other: [],
  };
  const heading = fieldValue(record.fields, headingFields[variant]);
  return hasValue(heading ?? null) ? String(heading) : null;
}
 
function isRecordHeadingField(
  field: EmployeeProfileField,
  variant: RecordVariant,
): boolean {
  const label = normalizedLabel(field.label);
  if (variant === "bank") return false;
  if (variant === "address") {
    return label === "addresstype" && hasValue(field.value);
  }
  if (variant === "family") {
    return (
      ["familymembername", "membername", "name"].includes(label) &&
      hasValue(field.value)
    );
  }
  if (variant === "documents") {
    return ["documentname", "documenttitle"].includes(label);
  }
  if (variant === "experience") {
    return (
      ["company", "companyname", "previouscompanyname"].includes(label) &&
      hasValue(field.value)
    );
  }
  return false;
}
 
function RecordList({
  records,
  variant,
}: {
  records: ProfileRecord[];
  variant: RecordVariant;
}) {
  const compact = variant === "documents";
  const gridClass =
    variant === "address" || variant === "family"
      ? "grid gap-2 sm:grid-cols-2"
      : "grid gap-1.5";
  return (
    <div className={gridClass}>
      {records.map((record, index) => {
        const heading = recordHeading(record, variant);
        const fields = record.fields.filter(
          (field) => !isRecordHeadingField(field, variant),
        );
        return (
          <article
            key={`${variant}-record-${index}`}
            className={`rounded-xl border border-[#eceef5] bg-white ${
              compact ? "px-3 py-2" : "px-3 py-2.5 shadow-sm"
            }`}
          >
            {heading && (
              <h5 className="m-0 mb-2 text-[11px] font-semibold text-[#434a5d]">
                {heading}
              </h5>
            )}
            <dl className="m-0 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {fields.map((field, fieldIndex) => (
                <ProfileField
                  key={`${field.label}-${fieldIndex}`}
                  label={field.label}
                  value={field.value}
                  showEmpty
                />
              ))}
            </dl>
          </article>
        );
      })}
    </div>
  );
}
 
function EducationRecords({ records }: { records: ProfileRecord[] }) {
  const rows = records.map(getEducationRow);
 
  return (
    <div className="overflow-x-auto rounded-xl border border-[#eceef5]">
      <table className="w-full min-w-[680px] border-collapse text-left text-[11px]">
        <thead className="bg-[#f7f8fc] text-[#555d72]">
          <tr>
            {[
              "Education level",
              "Degree",
              "Specialization",
              "Institution",
              "University",
              "Start date",
              "End date",
              "Year of passing",
              "Grade",
              "Country",
              "State",
              "Other details",
            ].map((heading) => (
              <th
                key={heading}
                className="border-b border-[#eceef5] px-3 py-2 font-semibold"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`education-${index}`}
              className="align-top even:bg-[#fbfcfe]"
            >
              {[
                row.educationLevel,
                row.degree,
                row.specialization,
                row.institution,
                row.university,
                row.startDate,
                row.endDate,
                row.passingYear,
                row.grade,
                row.country,
                row.state,
              ].map((value, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border-b border-[#eceef5] px-3 py-2 text-[#252a38]"
                >
                  {displayValue(value ?? null)}
                </td>
              ))}
              <td className="border-b border-[#eceef5] px-3 py-2 text-[#252a38]">
                {row.additionalFields.length > 0
                  ? row.additionalFields
                      .map(
                        (field) =>
                          `${field.label}: ${displayValue(field.value, field.label)}`,
                      )
                      .join(" · ")
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
function EmployeePhoto({
  photo,
  name,
}: {
  photo: string | null;
  name: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const initials = (name ?? "Employee")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
 
  if (photo && !failed) {
    return (
      <img
        src={photo}
        alt={name ? `${name} profile` : "Employee profile"}
        onError={() => setFailed(true)}
        className="h-14 w-14 shrink-0 rounded-full border border-[#eceef5] object-cover"
      />
    );
  }
 
  return (
    <div
      aria-label="Employee photo unavailable"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm font-bold text-[var(--primary-color)]"
    >
      {initials || "?"}
    </div>
  );
}
 
function downloadEmployeeProfilePdf(profile: EmployeeBusinessProfile): void {
  const document = new jsPDF();
  const { identity } = profile;
  const personalFields = getPersonalFields(profile);
  const fullName =
    identity.fullName ||
    [identity.firstName, identity.lastName].filter(Boolean).join(" ") ||
    "Employee Profile";
  const employeeId = identity.employeeId?.trim() || "Employee";
  const filenameId = employeeId.replace(/[^a-zA-Z0-9_-]+/g, "_");
  const margin = 16;
 
  const drawPageHeader = () => {
    document.setFillColor(91, 77, 220);
    document.rect(0, 0, document.internal.pageSize.getWidth(), 28, "F");
    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(15);
    document.text("Employee Business Profile", margin, 12);
    document.setFont("helvetica", "normal");
    document.setFontSize(9);
    document.text(fullName, margin, 20);
    document.text(`Employee ID: ${employeeId}`, margin, 25);
  };
 
  const addSection = (
    title: string,
    rows: PdfSectionRow[],
    startY: number,
    tableColumns?: string[],
  ) => {
    const visibleRows = rows.filter(
      (row) =>
        row.kind === "emptyState" ||
        row.kind === "recordHeading" ||
        (row.kind === "field" &&
          (row.showEmpty || hasValue(row.value)) &&
          !isEmployeeIdField({ label: row.label, value: row.value })) ||
        row.kind === "education",
    );
    if (visibleRows.length === 0) return startY;
 
    let finalY = startY;
    let finalPage = 1;
    autoTable(document, {
      startY,
      margin: { left: margin, right: margin, top: 34, bottom: 18 },
      head: tableColumns
        ? [
            [
              {
                content: title,
                colSpan: tableColumns.length,
                styles: { halign: "left" as const },
              },
            ],
            tableColumns,
          ]
        : [[title, ""]],
      showHead: tableColumns ? "everyPage" : "firstPage",
      body: visibleRows.map((row) =>
        row.kind === "emptyState"
          ? [
              {
                content: "No information available",
                colSpan: tableColumns?.length ?? 2,
                styles: { fontStyle: "italic" as const },
              },
            ]
          : row.kind === "recordHeading"
            ? [
                {
                  content: row.heading,
                  colSpan: 2,
                  styles: {
                    fontStyle: "bold" as const,
                    fillColor: [247, 248, 252] as [number, number, number],
                  },
                },
              ]
            : row.kind === "education"
              ? row.values.map((value) => displayValue(value))
              : [row.label, displayValue(row.value, row.label)],
      ),
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: tableColumns && tableColumns.length > 2 ? 6 : 9,
        cellPadding: tableColumns && tableColumns.length > 2 ? 2 : 3,
        overflow: "linebreak",
        textColor: [37, 42, 56],
        lineColor: [229, 232, 240],
      },
      headStyles: {
        fillColor: [91, 77, 220],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: tableColumns
        ? tableColumns.length === 2
          ? {
              0: { cellWidth: 27 },
              1: { cellWidth: 30 },
            }
          : {}
        : {
            0: { cellWidth: 55, fontStyle: "bold" },
            1: { cellWidth: "auto" },
          },
      didDrawPage: drawPageHeader,
      didDrawCell: ({ cursor, pageNumber }) => {
        if (!cursor || pageNumber < finalPage) return;
        if (pageNumber > finalPage) {
          finalPage = pageNumber;
          finalY = cursor.y;
          return;
        }
        finalY = Math.max(finalY, cursor.y);
      },
    });
 
    return finalY + 7;
  };
 
  let nextY = 36;
  nextY = addSection(
    "Personal Information",
    personalFields.map(({ label, value }) => ({
      kind: "field" as const,
      label,
      value,
      showEmpty: true,
    })),
    nextY,
  );
 
  for (const { section, records } of getAdditionalSections(
    profile.sections,
    personalFields,
  )) {
    const variant = sectionKind(section);
    if (variant === "education") {
      const educationRows: PdfSectionRow[] = records.map((record) => {
        const row = getEducationRow(record);
        const otherDetails = row.additionalFields
          .map(
            (field) =>
              `${field.label}: ${displayValue(field.value, field.label)}`,
          )
          .join(" · ");
        return {
          kind: "education",
          values: [
            row.educationLevel,
            row.degree,
            row.specialization,
            row.institution,
            row.university,
            row.startDate,
            row.endDate,
            row.passingYear,
            row.grade,
            row.country,
            row.state,
            otherDetails || null,
          ].map((value) => value ?? null),
        };
      });
      nextY = addSection(
        displaySectionTitle(section),
        educationRows.length > 0 ? educationRows : [{ kind: "emptyState" }],
        nextY,
        [
          "Education Level",
          "Degree",
          "Specialization",
          "Institution",
          "Board / University",
          "Start Date",
          "End Date",
          "Year of Passing",
          "Grade",
          "Country",
          "State",
          "Other Details",
        ],
      );
      continue;
    }
 
    const rows = records.flatMap((record) => {
      const heading = recordHeading(record, variant);
      return [
        ...(heading ? [{ kind: "recordHeading" as const, heading }] : []),
        ...record.fields
          .filter((field) => !isRecordHeadingField(field, variant))
          .map(
            (field) =>
              ({
                kind: "field",
                label: field.label,
                value: field.value,
                showEmpty: true,
              }) as const,
          ),
      ];
    });
    nextY = addSection(
      displaySectionTitle(section),
      rows.length > 0 ? rows : [{ kind: "emptyState" }],
      nextY,
    );
  }
 
  const pageCount = document.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    document.setPage(page);
    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.setTextColor(116, 123, 145);
    document.text(
      `Page ${page} of ${pageCount}`,
      document.internal.pageSize.getWidth() - margin,
      document.internal.pageSize.getHeight() - 8,
      { align: "right" },
    );
  }
 
  document.save(`Employee_Profile_${filenameId}.pdf`);
}
 
export default function EmployeeBusinessProfileCard({
  profile,
  onClose,
}: {
  profile: EmployeeBusinessProfile;
  onClose: () => void;
}) {
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { identity } = profile;
  const personalFields = getPersonalFields(profile);
  const fullName =
    identity.fullName ||
    [identity.firstName, identity.lastName].filter(Boolean).join(" ") ||
    "Employee profile";
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
 
  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-3 py-4 sm:px-5"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Employee profile for ${fullName}`}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[min(820px,calc(100dvh-2rem))] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header
          style={GRADIENT_STYLE}
          className="sticky top-0 z-10 flex shrink-0 items-center gap-3 px-4 py-3.5 sm:px-5"
        >
          <EmployeePhoto photo={identity.profilePhoto} name={fullName} />
          <div className="min-w-0 flex-1">
            <h3 className="m-0 truncate text-[15px] font-semibold text-white">
              {fullName}
            </h3>
            <p className="m-0 mt-1 truncate text-[11px] text-white/85">
              Employee ID: {displayValue(identity.employeeId)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close employee profile"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-2xl leading-none text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            &times;
          </button>
        </header>
 
        <div className="overflow-y-auto px-4 py-4 sm:px-5">
          <section>
            <h4 className="m-0 mb-2 text-[11px] font-bold uppercase tracking-wide text-[#555d72]">
              Personal Information
            </h4>
            <dl className="m-0 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {personalFields.map((field, index) => (
                <ProfileField
                  key={`personal-${field.label}-${index}`}
                  label={field.label}
                  value={field.value}
                  showEmpty
                />
              ))}
            </dl>
          </section>
 
          {getAdditionalSections(profile.sections, personalFields).map(
            ({ section, records }) => {
              const kind = sectionKind(section);
              const title = displaySectionTitle(section);
              return (
                <section
                  key={`${section.title}-${section.icon}`}
                  className="mt-4"
                >
                  <h4 className="m-0 mb-2 text-[11px] font-bold uppercase tracking-wide text-[#555d72]">
                    {title}
                  </h4>
                  {records.length === 0 ? (
                    <p className="m-0 rounded-xl bg-[#f7f8fc] px-3 py-3 text-[12px] text-[#747b91]">
                      No information available
                    </p>
                  ) : kind === "education" ? (
                    <EducationRecords records={records} />
                  ) : (
                    <RecordList records={records} variant={kind} />
                  )}
                </section>
              );
            },
          )}
        </div>
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[#eceef5] bg-white px-4 py-3 sm:px-5">
          <p
            role="status"
            className="m-0 min-w-0 flex-1 text-[11px] text-[#9a2f2f]"
          >
            {downloadError}
          </p>
          <button
            type="button"
            style={GRADIENT_STYLE}
            onClick={() => {
              try {
                setDownloadError(null);
                downloadEmployeeProfilePdf(profile);
              } catch {
                setDownloadError(
                  "Unable to generate the employee profile PDF.",
                );
              }
            }}
            className="rounded-xl border-none px-4 py-2.5 text-[12px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]"
          >
            Download PDF
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
