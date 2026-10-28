import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronDown,
  Upload,
} from "lucide-react";

import type { CompletedCandidateRow } from "../../types/preEnrollment.types";
import { getCandidateById } from "../../constants/completed-candidate.constants";
import {
  getAddCandidateById,
  updateAddCandidate,
  type AddCandidateRow,
} from "../../constants/add-candidate.constants";

type CandidateNavigationState = {
  candidateSource?: "add";
  candidate?: AddCandidateRow;
};

export default function CandidatePortalInfoPage() {
  const { candidateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(candidateId);
  const navigationState = location.state as CandidateNavigationState | null;

  const candidate = useMemo(
    () => navigationState?.candidateSource === "add"
      ? navigationState.candidate ?? getAddCandidateById(id)
      : getCandidateById(id),
    [id, navigationState]
  );

  const candidateData = candidate as ((CompletedCandidateRow | AddCandidateRow) & {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    fatherName?: string;
    maritalStatus?: string;
    spouseName?: string;
    dateOfBirth?: string;
    gender?: string;
    title?: string;
    physicallyChallenged?: boolean;
    profileImage?: string;
  }) | undefined;

  /* =========================================================
     NAME VALUES
  ========================================================= */

  const fullName = candidateData?.name || "";

  const nameParts = fullName.trim().split(/\s+/);

  const initialFirstName =
    candidateData?.firstName || nameParts[0] || "";

  const initialLastName =
    candidateData?.lastName ||
    (nameParts.length > 1
      ? nameParts[nameParts.length - 1]
      : "");

  const initialMiddleName =
    candidateData?.middleName ||
    (nameParts.length > 2
      ? nameParts.slice(1, -1).join(" ")
      : "");

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [title, setTitle] = useState(
    candidateData?.title || "Mr."
  );

  const [firstName, setFirstName] = useState(
    initialFirstName
  );

  const [middleName, setMiddleName] = useState(
    initialMiddleName
  );

  const [lastName, setLastName] = useState(
    initialLastName
  );

  const [fatherName, setFatherName] = useState(
    candidateData?.fatherName || "AVURAPALLI CHANTI"
  );

  const [maritalStatus, setMaritalStatus] = useState(
    candidateData?.maritalStatus || "Married"
  );

  const [spouseName, setSpouseName] = useState(
    candidateData?.spouseName || "AVURAPALLI NAGINI"
  );

  const [dateOfBirth, setDateOfBirth] = useState(
    candidateData?.dateOfBirth || "1993-12-31"
  );

  const [gender, setGender] = useState(
    candidateData?.gender || "Male"
  );

  const [physicallyChallenged, setPhysicallyChallenged] =
    useState(candidateData?.physicallyChallenged || false);

  const [email, setEmail] = useState(candidateData?.email || "");
  const [mobile, setMobile] = useState(candidateData?.mobile || "");

  /* =========================================================
     FULL NAME
  ========================================================= */

  const fullNameValue = [
    firstName,
    middleName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = () => {
    if (navigationState?.candidateSource === "add") {
      updateAddCandidate(id, {
        name: fullNameValue,
        email,
        mobile,
      });
    }

    console.log("Candidate details:", {
      title,
      firstName,
      middleName,
      lastName,
      fatherName,
      maritalStatus,
      spouseName,
      fullName: fullNameValue,
      dateOfBirth,
      gender,
      physicallyChallenged,
      email,
      mobile,
    });
  };

  if (!candidate) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white">
        <p className="text-sm text-slate-500">
          Candidate not found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* =====================================================
          MAIN WHITE CARD
      ===================================================== */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white px-6 pb-6 pt-6 shadow-[0_4px_14px_rgba(15,23,42,0.10)]">

        {/* ===================================================
            PROFILE PHOTO
        =================================================== */}
        <div className="flex items-center gap-4">

          {/* Upload Box */}
          <button
            type="button"
            className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 transition-all hover:border-orange-300 hover:bg-orange-50"
          >
            <Upload
              size={21}
              strokeWidth={1.8}
              className="text-slate-600"
            />
          </button>

          {/* Photo Details */}
          <div>
            <p className="text-sm font-medium text-slate-800">
              Profile Photo
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              JPG or PNG. Maximum size of 800K.
            </p>
          </div>

        </div>

        {/* ===================================================
            DIVIDER
        =================================================== */}
        <div className="my-5 border-t border-slate-200" />

        {/* ===================================================
            GENERAL DETAILS
        =================================================== */}
        <section>

          <h2 className="mb-5 text-sm font-semibold text-slate-800">
            General Details
          </h2>

          <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">

            {/* =================================================
                TITLE + FIRST NAME
            ================================================= */}
            <div className="flex gap-3">

              {/* Title */}
              <div className="w-[78px] shrink-0">

                <label className="mb-1.5 block text-[11px] font-medium text-slate-700">
                  Title
                </label>

                <div className="relative">
                  <select
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    className="h-[32px] w-full appearance-none rounded-md border border-slate-200 bg-white px-2.5 pr-7 text-[12px] text-slate-700 outline-none transition focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </select>

                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                </div>

              </div>

              {/* First Name */}
              <div className="flex-1">

                <label className="mb-1.5 block text-[11px] font-medium text-slate-700">
                  First Name
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
                  className="h-[32px] w-full rounded-md border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none transition focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                />

              </div>

            </div>

            {/* =================================================
                FATHER NAME
            ================================================= */}
            <InputField
              label="Father Name"
              value={fatherName}
              onChange={setFatherName}
            />

            {/* =================================================
                MIDDLE NAME
            ================================================= */}
            <InputField
              label="Middle Name"
              value={middleName}
              placeholder="Enter Middle Name"
              onChange={setMiddleName}
            />

            {/* =================================================
                MARITAL STATUS
            ================================================= */}
            <SelectField
              label="Marital Status"
              value={maritalStatus}
              options={[
                "Married",
                "Single",
                "Divorced",
                "Widowed",
              ]}
              onChange={setMaritalStatus}
            />

            {/* =================================================
                LAST NAME
            ================================================= */}
            <InputField
              label="Last Name"
              value={lastName}
              onChange={setLastName}
            />

            {/* =================================================
                SPOUSE NAME
            ================================================= */}
            <InputField
              label="Spouse Name"
              value={spouseName}
              onChange={setSpouseName}
            />

            {/* =================================================
                FULL NAME
            ================================================= */}
            <InputField
              label="Full Name"
              value={fullNameValue}
              disabled
              onChange={() => {}}
            />

            <InputField
              label="Email"
              value={email}
              onChange={setEmail}
            />

            <InputField
              label="Mobile"
              value={mobile}
              onChange={setMobile}
            />

            {/* =================================================
                DATE OF BIRTH
            ================================================= */}
            <DateField
              label="Date Of Birth"
              value={dateOfBirth}
              onChange={setDateOfBirth}
            />

            {/* =================================================
                GENDER
            ================================================= */}
            <SelectField
              label="Gender"
              value={gender}
              options={[
                "Male",
                "Female",
                "Other",
              ]}
              onChange={setGender}
            />

            {/* =================================================
                PHYSICALLY CHALLENGED
            ================================================= */}
            <div className="flex items-end pb-1">

              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-slate-600">

                <input
                  type="checkbox"
                  checked={physicallyChallenged}
                  onChange={(e) =>
                    setPhysicallyChallenged(
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 accent-orange-500"
                />

                <span>
                  Physically Challenged
                </span>

              </label>

            </div>

          </div>

        </section>

        {/* ===================================================
            BOTTOM DIVIDER
        =================================================== */}
        <div className="mt-5 border-t border-slate-200" />

        {/* ===================================================
            ACTION BUTTONS
        =================================================== */}
        <div className="flex items-center justify-end gap-2 pt-5">

          {/* Cancel */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-[32px] rounded-lg border border-slate-200 bg-white px-4 text-[12px] font-medium text-slate-600 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
          >
            Cancel
          </button>

          {/* Save Details */}
          <button
            type="button"
            onClick={handleSave}
            className="h-[32px] rounded-lg bg-orange-500 px-5 text-[12px] font-semibold text-white shadow-[0_3px_8px_rgba(249,115,22,0.25)] transition-all hover:bg-orange-600"
          >
            Save Details
          </button>

        </div>

      </div>
    </div>
  );
}

/* =============================================================
   INPUT FIELD
============================================================= */

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="w-full">

      <label className="mb-1.5 block text-[11px] font-medium text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`h-[32px] w-full rounded-md border border-slate-200 px-3 text-[12px] outline-none transition ${
          disabled
            ? "cursor-not-allowed bg-slate-50 text-slate-500"
            : "bg-white text-slate-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
        }`}
      />

    </div>
  );
}

/* =============================================================
   SELECT FIELD
============================================================= */

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="w-full">

      <label className="mb-1.5 block text-[11px] font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-[32px] w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-8 text-[12px] text-slate-700 outline-none transition focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={13}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600"
        />

      </div>

    </div>
  );
}

/* =============================================================
   DATE FIELD
============================================================= */

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function DateField({
  label,
  value,
  onChange,
}: DateFieldProps) {
  return (
    <div className="w-full">

      <label className="mb-1.5 block text-[11px] font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">

        <input
          type="date"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-[32px] w-full rounded-md border border-slate-200 bg-white px-3 pr-9 text-[12px] text-slate-700 outline-none transition focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
        />

        <CalendarDays
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
        />

      </div>

    </div>
  );
}
