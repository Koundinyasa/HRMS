// import { useState, type ChangeEvent, type FormEvent } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { ChevronDown, ChevronLeft } from "lucide-react";

// import PreOnboardPageShell from "../components/PreEnrollmentPageShell";
// import { saveAddedCandidate } from "../constants/add-candidate.constants";
// import type { CandidateForm } from "../types/preEnrollment.types";

// const initialFormData: CandidateForm = {
//   candidateName: "",
//   email: "",
//   mobile: "",
//   joiningDate: "",
// };

// export default function AddCandidateForm() {
//   const navigate = useNavigate();
//   const { domain } = useParams();
//   const [formData, setFormData] = useState<CandidateForm>(initialFormData);

//   const basePath = domain
//     ? `/${domain}/admin/enrollment/pre-enrollment`
//     : "/admin/enrollment/pre-enrollment";

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFormData((current) => ({ ...current, [name]: value }));
//   };

//   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     saveAddedCandidate({
//       id: Date.now(),
//       name: formData.candidateName.trim(),
//       email: formData.email.trim(),
//       mobile: formData.mobile.trim(),
//       joining: formatJoiningDate(formData.joiningDate),
//       status: "0/5",
//       verification: "Unverified",
//       progress: 0,
//     });

//     navigate(`${basePath}/add-candidate`);
//   };

//   return (
//     <PreOnboardPageShell>
//       <div className="w-full min-w-0 px-3 pb-8 pt-2 sm:px-4 md:px-5 lg:px-6">
//         <div className="mb-4 flex items-center gap-2">
//           <button
//             type="button"
//             onClick={() => navigate(`${basePath}/add-candidate`)}
//             className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-orange-500"
//             aria-label="Back to candidates"
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <div>
//             <h1 className="text-lg font-semibold text-slate-800 sm:text-xl">Add Candidate</h1>
//             <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
//               Add a new candidate to the pre-enrollment process.
//             </p>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="w-full overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.12)]"
//         >
//           <div className="flex min-h-[58px] items-center border-b border-slate-200 px-4 py-3 sm:px-6">
//             <div>
//               <h2 className="text-[15px] font-semibold text-slate-800">Candidate Details</h2>
//               <p className="mt-0.5 text-[11px] text-slate-500">Enter the candidate information below.</p>
//             </div>
//           </div>

//           <div className="p-4 sm:p-6">
//             <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
//               <FormField label="Candidate Name" name="candidateName" value={formData.candidateName} onChange={handleChange} placeholder="Enter candidate name" />
//               <FormField label="Email ID" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
//               <FormField label="Mobile Number" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} placeholder="Enter mobile number" />
//               <FormField label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} />
//             </div>

//             <div className="mt-5 w-full">
//               <label htmlFor="onboardingPolicy" className="mb-1.5 block text-xs font-semibold text-slate-700">Onboarding Policy</label>
//               <div className="relative w-full md:max-w-[50%]">
//                 <select id="onboardingPolicy" defaultValue="standard" className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-xs text-slate-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100">
//                   <option value="standard">Standard Policy</option>
//                   <option value="custom">Custom Policy</option>
//                 </select>
//                 <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
//               </div>
//             </div>

//           </div>

//           <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
//             <button type="button" onClick={() => navigate(`${basePath}/add-candidate`)} className="w-full rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto">Cancel</button>
//             <button type="submit" className="w-full rounded-lg bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 sm:w-auto">Add Candidate</button>
//           </div>
//         </form>
//       </div>
//     </PreOnboardPageShell>
//   );
// }

// function formatJoiningDate(date: string) {
//   const [year, , day] = date.split("-");
//   const monthName = new Date(`${date}T00:00:00`).toLocaleString("en-US", {
//     month: "short",
//   });
//   return `${day}/${monthName}/${year}`;
// }

// function FormField({
//   label,
//   name,
//   value,
//   onChange,
//   type = "text",
//   placeholder,
// }: {
//   label: string;
//   name: keyof CandidateForm;
//   value: string;
//   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
//   type?: "text" | "email" | "tel" | "date";
//   placeholder?: string;
// }) {
//   return (
//     <div className="min-w-0">
//       <label htmlFor={name} className="mb-1.5 block text-xs font-semibold text-slate-700">
//         {label}<span className="ml-1 text-red-500">*</span>
//       </label>
//       <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-100" />
//     </div>
//   );
// }

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronLeft } from "lucide-react";

import PreOnboardPageShell from "../components/PreEnrollmentPageShell";
import { saveAddedCandidate } from "../constants/add-candidate.constants";
import type { CandidateForm } from "../types/preEnrollment.types";

const initialFormData: CandidateForm = {
  candidateName: "",
  email: "",
  mobile: "",
  joiningDate: "",
};

export default function AddCandidateForm() {
  const navigate = useNavigate();
  const { domain } = useParams();

  const [formData, setFormData] =
    useState<CandidateForm>(initialFormData);

  const basePath = domain
    ? `/${domain}/admin/enrollment/pre-enrollment`
    : "/admin/enrollment/pre-enrollment";

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    saveAddedCandidate({
      id: Date.now(),
      name: formData.candidateName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      joining: formatJoiningDate(formData.joiningDate),
      status: "0/5",
      verification: "Unverified",
      progress: 0,
    });

    navigate(`${basePath}/add-candidate`);
  };

  return (
    <PreOnboardPageShell>
      <div
        className="
          w-full
          min-w-0
          px-3
          pb-8
          pt-2
          font-urbanist
          sm:px-4
          md:px-5
          lg:px-6
        "
      >
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div
          className="
            mb-5
            flex
            items-center
            gap-2
            font-urbanist
          "
        >
          {/* Back Button - Utility/UI */}

          <button
            type="button"
            onClick={() =>
              navigate(`${basePath}/add-candidate`)
            }
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              font-urbanist
              text-slate-600
              transition
              hover:bg-white
              hover:text-orange-500
            "
            aria-label="Back to candidates"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="font-urbanist">
            {/* Display */}

            <h1
              className="
                font-urbanist
                text-2xl
                font-bold
                leading-8
                tracking-tight
                text-slate-800
              "
            >
              Add Candidate
            </h1>

            {/* Subheading */}

            <p
              className="
                mt-1
                font-urbanist
                text-sm
                font-medium
                leading-5
                text-slate-500
              "
            >
              Add a new candidate to the pre-enrollment
              process.
            </p>
          </div>
        </div>

        {/* =====================================================
            FORM CARD
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            w-full
            overflow-hidden
            rounded-[16px]
            border
            border-slate-200
            bg-white
            font-urbanist
            shadow-[0_6px_20px_rgba(15,23,42,0.12)]
          "
        >
          {/* ===================================================
              CARD HEADER
          =================================================== */}

          <div
            className="
              flex
              min-h-[64px]
              items-center
              border-b
              border-slate-200
              px-4
              py-3
              font-urbanist
              sm:px-6
            "
          >
            <div className="font-urbanist">
              {/* Heading */}

              <h2
                className="
                  font-urbanist
                  text-lg
                  font-semibold
                  leading-6
                  tracking-normal
                  text-slate-800
                "
              >
                Candidate Details
              </h2>

              {/* Subheading */}

              <p
                className="
                  mt-1
                  font-urbanist
                  text-sm
                  font-medium
                  leading-5
                  text-slate-500
                "
              >
                Enter the candidate information below.
              </p>
            </div>
          </div>

          {/* ===================================================
              FORM CONTENT
          =================================================== */}

          <div
            className="
              p-4
              font-urbanist
              sm:p-6
            "
          >
            <div
              className="
                grid
                w-full
                grid-cols-1
                gap-4
                font-urbanist
                md:grid-cols-2
                md:gap-5
              "
            >
              <FormField
                label="Candidate Name"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                placeholder="Enter candidate name"
              />

              <FormField
                label="Email ID"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />

              <FormField
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
              />

              <FormField
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>

            {/* =================================================
                ONBOARDING POLICY
            ================================================= */}

            <div
              className="
                mt-5
                w-full
                font-urbanist
              "
            >
              {/* Label */}

              <label
                htmlFor="onboardingPolicy"
                className="
                  mb-1.5
                  block
                  font-urbanist
                  text-[13px]
                  font-semibold
                  leading-[18px]
                  text-slate-700
                "
              >
                Onboarding Policy
              </label>

              <div
                className="
                  relative
                  w-full
                  font-urbanist
                  md:max-w-[50%]
                "
              >
                {/* Body */}

                <select
                  id="onboardingPolicy"
                  defaultValue="standard"
                  className="
                    h-10
                    w-full
                    appearance-none
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    pr-9
                    font-urbanist
                    text-sm
                    font-medium
                    leading-5
                    text-slate-700
                    outline-none
                    transition
                    focus:border-orange-400
                    focus:ring-1
                    focus:ring-orange-100
                  "
                >
                  <option value="standard">
                    Standard Policy
                  </option>

                  <option value="custom">
                    Custom Policy
                  </option>
                </select>

                <ChevronDown
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />
              </div>
            </div>
          </div>

          {/* ===================================================
              FORM FOOTER
          =================================================== */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-slate-200
              px-4
              py-4
              font-urbanist
              sm:flex-row
              sm:items-center
              sm:justify-end
              sm:px-6
            "
          >
            {/* Cancel - Utility/UI */}

            <button
              type="button"
              onClick={() =>
                navigate(`${basePath}/add-candidate`)
              }
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                px-5
                py-2.5
                font-urbanist
                text-xs
                font-semibold
                leading-4
                text-slate-700
                transition
                hover:bg-slate-50
                sm:w-auto
              "
            >
              Cancel
            </button>

            {/* Add Candidate - Utility/UI */}

            <button
              type="submit"
              className="
                w-full
                rounded-lg
                bg-orange-500
                px-5
                py-2.5
                font-urbanist
                text-xs
                font-semibold
                leading-4
                text-white
                shadow-sm
                transition
                hover:bg-orange-600
                sm:w-auto
              "
            >
              Add Candidate
            </button>
          </div>
        </form>
      </div>
    </PreOnboardPageShell>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  name: keyof CandidateForm;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
}) {
  return (
    <div
      className="
        min-w-0
        font-urbanist
      "
    >
      {/* Label */}

      <label
        htmlFor={name}
        className="
          mb-1.5
          block
          font-urbanist
          text-[13px]
          font-semibold
          leading-[18px]
          text-slate-700
        "
      >
        {label}

        {/* Utility/UI */}
        <span
          className="
            ml-1
            font-urbanist
            text-xs
            font-semibold
            leading-4
            text-red-500
          "
        >
          *
        </span>
      </label>

      {/* Body */}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="
          h-10
          w-full
          rounded-lg
          border
          border-slate-200
          bg-white
          px-3
          font-urbanist
          text-sm
          font-medium
          leading-5
          text-slate-800
          outline-none
          transition
          placeholder:font-urbanist
          placeholder:text-sm
          placeholder:font-medium
          placeholder:leading-5
          placeholder:text-slate-400
          focus:border-orange-400
          focus:ring-1
          focus:ring-orange-100
        "
      />
    </div>
  );
}

/* =========================================================
   DATE FORMAT
========================================================= */

function formatJoiningDate(date: string) {
  const [year, , day] = date.split("-");

  const monthName = new Date(
    `${date}T00:00:00`,
  ).toLocaleString("en-US", {
    month: "short",
  });

  return `${day}/${monthName}/${year}`;
}