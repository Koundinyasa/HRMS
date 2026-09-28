import type { EmployeeFormValues, FieldName, FormErrors } from "../types/types";

export interface Rule {
  label: string;
  required?: boolean;
  requiredMsg?: string;
  check?: (value: string, all: EmployeeFormValues) => string;
}

const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const reMobile = /^[6-9]\d{9}$/;
const reName = /^[A-Za-z][A-Za-z .'-]*$/;

const mobileMsg = "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.";
const nameMsg = "Use letters, spaces, dots, hyphens or apostrophes.";

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export function generateEmployeeCode(length = 6): string {
  let out = "";
  for (let i = 0; i < length; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return out;
}

const TEMP_PW_CHARS = {
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lower: "abcdefghijkmnpqrstuvwxyz",
  digit: "23456789",
  symbol: "!@#$%^&*",
};
export function generateTempPassword(length = 14): string {
  const all = TEMP_PW_CHARS.upper + TEMP_PW_CHARS.lower + TEMP_PW_CHARS.digit + TEMP_PW_CHARS.symbol;
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  const required = [
    pick(TEMP_PW_CHARS.upper),
    pick(TEMP_PW_CHARS.lower),
    pick(TEMP_PW_CHARS.digit),
    pick(TEMP_PW_CHARS.symbol),
  ];
  const rest = Array.from({ length: Math.max(length - required.length, 0) }, () => pick(all));
  const chars = [...required, ...rest];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function ageOn(dob: string, onDate: string): number {
  const b = new Date(`${dob}T00:00:00`);
  const d = new Date(`${onDate}T00:00:00`);
  let age = d.getFullYear() - b.getFullYear();
  const m = d.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && d.getDate() < b.getDate())) age -= 1;
  return age;
}

export const RULES: Record<FieldName, Rule> = {
  EmployeeID: {
    label: "Employee ID",
    required: true,
    check: (v) => (/^[A-Za-z0-9_-]{2,50}$/.test(v) ? "" : "Use 2–50 letters, numbers, _ or -."),
  },
  Code: {
    label: "Employee code",
    required: true,
    check: (v) => (/^[A-Z0-9]{4,12}$/.test(v) ? "" : "Code is 4–12 capital letters or digits."),
  },
  FirstName: {
    label: "First name",
    required: true,
    check: (v) => (reName.test(v) ? "" : nameMsg),
  },
  LastName: {
    label: "Last name",
    check: (v) => (reName.test(v) ? "" : nameMsg),
  },
  DOB: {
    label: "Date of birth",
    check: (v, all) => {
      if (v > todayISO()) return "Date of birth can't be in the future.";
      if (all.DOJ && ageOn(v, all.DOJ) < 14) return "Employee must be at least 14 on the joining date.";
      return "";
    },
  },
  GenderID: { label: "Gender" },
  MaritalStatusID: { label: "Marital status" },
  CompanyID: { label: "Company", required: true },
  BranchID: { label: "Branch", required: true },
  DeptID: { label: "Department", required: true },
  DesignationID: { label: "Designation", required: true },
  RoleID: { label: "Role", required: true },
  ReportingManagerID: { label: "Reporting manager" },
  Grade: { label: "Grade" },
  EmploymentTypeID: { label: "Employment type", required: true },
  EmploymentStatusID: { label: "Employment status", required: true },
  DOJ: {
    label: "Date of joining",
    required: true,
    check: (v, all) => {
      if (all.DOB && v < all.DOB) return "Joining date can't be before date of birth.";
      return "";
    },
  },
  DOL: {
    label: "Date of leaving",
    check: (v, all) => {
      if (all.DOJ && v < all.DOJ) return "Leaving date can't be before joining date.";
      return "";
    },
  },
  Email: {
    label: "Work email",
    required: true,
    check: (v) => (reEmail.test(v) ? "" : "Enter a valid email address."),
  },
  AlternateEmailId: {
    label: "Personal email",
    check: (v, all) => {
      if (!reEmail.test(v)) return "Enter a valid email address.";
      if (v.toLowerCase() === all.Email.trim().toLowerCase())
        return "Use a different address from the work email.";
      return "";
    },
  },
  Mobileno: { label: "Mobile number", check: (v) => (reMobile.test(v) ? "" : mobileMsg) },
  AltMobileNo: { label: "Alternate mobile", check: (v) => (reMobile.test(v) ? "" : mobileMsg) },
  EmergencyNo: {
    label: "Emergency contact number",
    check: (v) => (reMobile.test(v) ? "" : mobileMsg),
  },
  AadhaarNumber: {
    label: "Aadhaar number",
    check: (v) =>
      /^[2-9]\d{11}$/.test(v) ? "" : "Aadhaar is 12 digits and can't start with 0 or 1.",
  },
  PANNumber: {
    label: "PAN",
    check: (v) =>
      /^[A-Z]{5}\d{4}[A-Z]$/.test(v) ? "" : "PAN format is 5 letters, 4 digits, 1 letter (ABCDE1234F).",
  },
  UANNumber: { label: "UAN", check: (v) => (/^\d{12}$/.test(v) ? "" : "UAN is 12 digits.") },
  PFNumber: {
    label: "PF number",
    check: (v) => (/^[A-Z0-9/]{5,30}$/.test(v) ? "" : "Use 5–30 letters, numbers or slashes."),
  },
  UserID: {
    label: "User ID",
    check: (v) =>
      /^[A-Za-z0-9@._-]{4,100}$/.test(v) ? "" : "Use 4–100 letters, numbers or @ . _ -",
  },
};

export const FIELD_NAMES = Object.keys(RULES) as FieldName[];

export const EMPTY_VALUES = Object.fromEntries(
  FIELD_NAMES.map((n) => [n, ""]),
) as unknown as EmployeeFormValues;

export function validateField(name: FieldName, values: EmployeeFormValues): string {
  const rule = RULES[name];
  const value = values[name].trim();
  if (!value) return rule.required ? rule.requiredMsg ?? `${rule.label} is required.` : "";
  return rule.check ? rule.check(value, values) : "";
}

export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

export function validatePhoto(file: File | null): string {
  if (!file) return "";
  if (!PHOTO_TYPES.includes(file.type)) return "Choose a JPG, PNG or WebP image.";
  if (file.size > MAX_PHOTO_BYTES) return "Photo is larger than 2 MB. Choose a smaller image.";
  return "";
}

export function validateAll(values: EmployeeFormValues, photo: File | null): FormErrors {
  const errors: FormErrors = {};
  for (const name of FIELD_NAMES) {
    const msg = validateField(name, values);
    if (msg) errors[name] = msg;
  }
  const photoMsg = validatePhoto(photo);
  if (photoMsg) errors.ProfilePhoto = photoMsg;
  return errors;
}