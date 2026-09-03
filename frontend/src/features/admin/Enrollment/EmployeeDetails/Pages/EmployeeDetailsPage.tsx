import React, { useState } from "react";
import { Save, ChevronLeft, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import GeneralTab from "../components/EmployeeForm/GeneralTab";
import ClassificationTab from "../components/EmployeeForm/ClassificationTab";
import StatutoryTab from "../components/EmployeeForm/StatutoryTab";

import AddressTab from "../components/EmployeeForm/AddressTab";
import HRCategoryTab, {
  HR_ACTIONS_SLOT_ID,
  HR_EXPORT_SLOT_ID,
} from "../components/EmployeeForm/HRCategoryTab";

import DocumentsTab from "../components/EmployeeForm/DocumentsTab";
import SeparationTab from "../components/EmployeeForm/SeparationTab";
import WorkFlowDetailsTab from "../components/EmployeeForm/WorkFlowDetailsTab";

import DiscardChangesModal from "../components/EmployeeForm/DiscardChangesModal";

import type { GeneralForm } from "../components/EmployeeForm/GeneralTab";

import type { ClassificationForm } from "../components/EmployeeForm/ClassificationTab";

import type {
  StatutoryForm,
  StatutoryCheckboxes,
} from "../components/EmployeeForm/StatutoryTab";

import type { NewClassificationData } from "../components/EmployeeForm/AddClassificationModal";

import type { EmployeeSummary } from "../components/EmployeeForm/EmployeeSummaryCard";

/* ============================================================
   DETAIL TABS
============================================================ */

const DETAIL_TABS = [
  "General",
  "Classification",
  "Statutory",
  "Address",
  "HR Category",
  "Documents",
  "Separation",
  "WorkFlow Details",
] as const;

type DetailTab = (typeof DETAIL_TABS)[number];

/* ============================================================
   DEMO EMPLOYEE DATA
============================================================ */

interface EmployeeData {
  empId: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  gender: string;
  fatherName: string;
  maritalStatus: string;
  spouseName: string;
  dateOfJoining: string;
  dateOfSalary: string;
  probationPeriod: string;
  confirmationDate: string;
  reportingAuthority: string;
  designation: string;
  email: string;
  mobile: string;
  branch: string;
}

/*
 * This is the employee shown in your first screenshot.
 */
const DEMO_EMPLOYEE: Record<string, EmployeeData> = {
  "294640": {
    empId: "294640",

    title: "Mr.",

    firstName: "BHAGYARAJA",

    middleName: "",

    lastName: "AVURAPALLI",

    fullName: "BHAGYARAJA AVURAPALLI",

    gender: "Male",

    fatherName: "AVURAPALLI CHANTI",

    maritalStatus: "Married",

    spouseName: "AVURAPALLI NAGINI",

    dateOfJoining: "31-03-2026",

    dateOfSalary: "31-03-2026",

    probationPeriod: "",

    confirmationDate: "",

    reportingAuthority: "Daniel Raju Ravi (324912)",

    designation: "Senior Software Engineer",

    email: "bhagyaraja.a@koundinyasatech.com",

    mobile: "9401594135",

    branch: "Koundinyasa Technology Services Pvt. Ltd.",
  },
};

/* ============================================================
   PAGE
============================================================ */

export default function EmployeeDetailsPage() {
  const { empId } = useParams<{ empId: string }>();

  const navigate = useNavigate();

  /*
   * If URL contains /294640, this employee is loaded.
   * If no empId is available, 294640 is used.
   */
  const currentEmpId = empId || "294640";

  /* ==========================================================
     EMPLOYEE
  ========================================================== */

  const employee: EmployeeData =
    DEMO_EMPLOYEE[currentEmpId] || DEMO_EMPLOYEE["294640"];

  /* ==========================================================
     ACTIVE TAB
  ========================================================== */

  const [activeTab, setActiveTab] =
    useState<DetailTab>("General");

  /* ==========================================================
     GENERAL FORM
  ========================================================== */

  const [generalForm, setGeneralForm] =
    useState<GeneralForm>({
      empId: employee.empId,

      title: employee.title,

      firstName: employee.firstName,

      middleName: employee.middleName,

      lastName: employee.lastName,

      fullName: employee.fullName,

      gender: employee.gender,

      fatherName: employee.fatherName,

      maritalStatus: employee.maritalStatus,

      spouseName: employee.spouseName,

      dateOfJoining: employee.dateOfJoining,

      dateOfSalary: employee.dateOfSalary,

      probationPeriod: employee.probationPeriod,

      confirmationDate: employee.confirmationDate,

      reportingAuthority: employee.reportingAuthority,
    });

  /* ==========================================================
     GENERAL ERRORS
  ========================================================== */

  const [generalErrors, setGeneralErrors] =
    useState<Record<string, string>>({});

  const setGeneral = (
    key: keyof GeneralForm,
    value: string
  ) => {
    setGeneralForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setGeneralErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  /* ==========================================================
     CLASSIFICATION FORM
  ========================================================== */

  const [classificationForm, setClassificationForm] =
    useState<ClassificationForm>({
      /*
       * IMPORTANT:
       * DateField uses DD-MM-YYYY.
       */
      effectiveFrom: "03-06-2026",

      branch:
        "Koundinyasa Technology Services Pvt. Ltd.",

      salaryStructure:
        "CTC Salary Structure",

      leavePolicy:
        "Employee Leave Policy",

      attendanceStructure:
        "Daily",

      costCenter: "",

      tnaPolicy:
        "General Policy",

      designation:
        employee.designation,

      bank:
        "IDBI Bank",

      accountNo:
        "0002104000755757",

      ifscCode:
        "IBKL0000002",

      department: "",

      team: "",
    });

  /* ==========================================================
     CLASSIFICATION ERRORS
  ========================================================== */

  const [
    classificationErrors,
    setClassificationErrors,
  ] = useState<Record<string, string>>({});

  const setClassification = (
    key: keyof ClassificationForm,
    value: string
  ) => {
    setClassificationForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setClassificationErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  /* ==========================================================
     STATUTORY FORM
  ========================================================== */

  const [statutoryForm, setStatutoryForm] =
    useState<StatutoryForm>({
      aadharNo: "",

      tdsApplicable: false,

      financialYear: "2026-2027",

      pan: "",

      pfNumber: "",

      departmentFileNo: "",

      uan: "",

      effectiveFrom: "Mar/2026",

      checkboxes: {
        pfApplicable: false,

        pfVoluntary: false,

        zeroPension: false,

        restrictEmployeePfContribution: false,

        restrictEmployerPfContribution: false,

        zeroPt: false,

        esiApplicable: false,

        internationalWorker: false,

        lwfApplicable: false,
      },
    });

  /* ==========================================================
     STATUTORY ERRORS
  ========================================================== */

  const [statutoryErrors, setStatutoryErrors] =
    useState<Record<string, string>>({});

  const setStatutory = <
    K extends keyof StatutoryForm
  >(
    key: K,
    value: StatutoryForm[K]
  ) => {
    setStatutoryForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setStatutoryErrors((prev) => ({
      ...prev,
      [key as string]: "",
    }));
  };

  /* ==========================================================
     STATUTORY CHECKBOX
  ========================================================== */

  const setStatutoryCheckbox = (
    key: keyof StatutoryCheckboxes,
    value: boolean
  ) => {
    setStatutoryForm((prev) => ({
      ...prev,

      checkboxes: {
        ...prev.checkboxes,

        [key]: value,
      },
    }));
  };

  /* ==========================================================
     EMPLOYEE SUMMARY
  ========================================================== */

  const employeeSummary: EmployeeSummary = {
    empId: employee.empId,

    fullName: employee.fullName,

    designation:
      classificationForm.designation ||
      employee.designation,

    branch: employee.branch,

    dateOfJoining:
      generalForm.dateOfJoining,

    mobile: employee.mobile,

    email: employee.email,
  };

  /* ==========================================================
     ADD CLASSIFICATION
  ========================================================== */

  const handleAddClassification = (
    data: NewClassificationData
  ) => {
    console.log(
      "New Classification:",
      data
    );

    /*
     * Do not blindly spread data into ClassificationForm.
     * Add API mapping here later.
     */
  };

  /* ==========================================================
     VERIFY E-TRACES
  ========================================================== */

  const handleVerifyETraces = () => {
    console.log(
      "Verify E-Traces clicked",
      statutoryForm
    );

    alert("Verify-Traces clicked");
  };

  /* ==========================================================
     BACK
  ========================================================== */

  const handleBack = () => {
    navigate(
      "/KOUNDINYASATECH/admin/enrollment"
    );
  };

  /* ==========================================================
     SAVE
  ========================================================== */

  const handleSave = () => {
    const completeData = {
      employee: employeeSummary,

      general: generalForm,

      classification:
        classificationForm,

      statutory:
        statutoryForm,
    };

    console.log(
      "SAVE EMPLOYEE",
      completeData
    );

    alert(
      "Employee details saved successfully"
    );
  };

  /* ==========================================================
     DISCARD
  ========================================================== */

  const [
    showDiscardModal,
    setShowDiscardModal,
  ] = useState(false);

  const handleDiscard = () => {
    setShowDiscardModal(true);
  };

  const confirmDiscard = () => {
    setShowDiscardModal(false);

    setGeneralForm({
      empId: employee.empId,

      title: employee.title,

      firstName: employee.firstName,

      middleName: employee.middleName,

      lastName: employee.lastName,

      fullName: employee.fullName,

      gender: employee.gender,

      fatherName: employee.fatherName,

      maritalStatus: employee.maritalStatus,

      spouseName: employee.spouseName,

      dateOfJoining: employee.dateOfJoining,

      dateOfSalary: employee.dateOfSalary,

      probationPeriod: employee.probationPeriod,

      confirmationDate: employee.confirmationDate,

      reportingAuthority:
        employee.reportingAuthority,
    });

    setGeneralErrors({});
  };

  /* ==========================================================
     ADD DOCUMENT
  ========================================================== */

  const handleAddDocumentClick = () => {
    window.dispatchEvent(
      new Event("open-add-document")
    );
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="min-h-[calc(100vh-48px)] bg-white font-sans text-gray-800 text-[13px]">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="px-4 pt-2.5 bg-white border-b border-gray-200">

        {/* COMPANY + BACK */}

        <div className="flex items-center justify-between">

          <span className="text-[14px] font-semibold text-gray-800">
            {employee.branch}
          </span>

          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 h-[30px] px-2 text-[12.5px] text-[#5B6672] hover:text-[#2196F3]"
          >
            <ChevronLeft size={14} />

            Back
          </button>

        </div>

        {/* TABS + ACTIONS */}

        <div className="flex items-end justify-between gap-4 mt-1">

          {/* TABS */}

          <div className="flex items-center gap-1 overflow-x-auto">

            {DETAIL_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`relative px-3 pb-2.5 pt-1 text-[13px] font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-[#2196F3]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}

                {activeTab === tab && (
                  <span className="absolute inset-x-1 bottom-0 h-[2px] rounded-t bg-[#2196F3]" />
                )}
              </button>
            ))}

          </div>

          {/* ACTIONS */}

          <div className="flex items-center gap-2 pb-2 shrink-0">

            {/* EMPLOYEE SEARCH */}

            <div className="relative">

              <select
                className="appearance-none h-[30px] w-[150px] pl-2.5 pr-7 text-[12px] text-[#7B8794] bg-white border border-[#E3E7EC] rounded-[6px] focus:outline-none focus:border-[#2196F3]"
                value={employee.empId}
                onChange={(e) => {
                  const selectedId =
                    e.target.value;

                  if (selectedId) {
                    navigate(
                      `/KOUNDINYASATECH/admin/enrollment/employee-details/${selectedId}`
                    );
                  }
                }}
              >

                <option value="294640">
                  294640 - BHAGYARAJA
                </option>

              </select>

              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8A95A1]"
              />

            </div>

            {/* HR ACTION SLOT */}

            <div
              id={HR_ACTIONS_SLOT_ID}
              className="flex items-center"
            />

            {/* DOCUMENT ADD */}

            {activeTab === "Documents" && (
              <button
                type="button"
                onClick={
                  handleAddDocumentClick
                }
                className="h-[30px] px-3.5 text-[12.5px] font-medium rounded-[6px] inline-flex items-center gap-1.5 bg-[#2196F3] text-white hover:bg-[#1E88E5]"
              >
                Add
              </button>
            )}

            {/* SAVE */}

            <button
              type="button"
              onClick={handleSave}
              className="h-[30px] px-3.5 text-[12.5px] font-medium text-white bg-[#2196F3] rounded-[6px] hover:bg-[#1E88E5] inline-flex items-center gap-1.5"
            >
              <Save size={13} />

              Save
            </button>

            {/* DISCARD */}

            <button
              type="button"
              onClick={handleDiscard}
              className="h-[30px] px-3 text-[12px] font-medium text-[#B08900] bg-[#FFF7DE] border border-[#F0D77B] rounded-[6px]"
            >
              Discard
            </button>

            {/* HR EXPORT */}

            <div
              id={HR_EXPORT_SLOT_ID}
              className="flex items-center"
            />

          </div>
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="p-5">

        {/* ====================================================
            GENERAL
        ==================================================== */}

        {activeTab === "General" && (
          <GeneralTab
            form={generalForm}
            set={setGeneral}
            errors={generalErrors}
          />
        )}

        {/* ====================================================
            CLASSIFICATION
        ==================================================== */}

        {activeTab === "Classification" && (
          <ClassificationTab
            employee={employeeSummary}
            form={classificationForm}
            set={setClassification}
            errors={classificationErrors}
            onAddClassification={
              handleAddClassification
            }
          />
        )}

        {/* ====================================================
            STATUTORY
        ==================================================== */}

        {activeTab === "Statutory" && (
          <StatutoryTab
            employee={employeeSummary}
            form={statutoryForm}
            set={setStatutory}
            setCheckbox={
              setStatutoryCheckbox
            }
            errors={statutoryErrors}
            onVerifyETraces={
              handleVerifyETraces
            }
          />
        )}

        {/* ====================================================
            ADDRESS
        ==================================================== */}

        {activeTab === "Address" && (
          <AddressTab
            form={generalForm as any}
            set={setGeneral as any}
          />
        )}

        {/* ====================================================
            HR CATEGORY
        ==================================================== */}

        {activeTab === "HR Category" && (
          <HRCategoryTab
            form={generalForm as any}
            set={setGeneral as any}
          />
        )}

        {/* ====================================================
            DOCUMENTS
        ==================================================== */}

        {activeTab === "Documents" && (
          <DocumentsTab
            form={generalForm as any}
            set={setGeneral as any}
          />
        )}

        {/* ====================================================
            SEPARATION
        ==================================================== */}

        {activeTab === "Separation" && (
          <SeparationTab
            form={generalForm as any}
            set={setGeneral as any}
          />
        )}

        {/* ====================================================
            WORKFLOW DETAILS
        ==================================================== */}

        {activeTab === "WorkFlow Details" && (
          <WorkFlowDetailsTab
            form={generalForm as any}
            set={setGeneral as any}
          />
        )}

      </div>

      {/* ======================================================
          DISCARD MODAL
      ====================================================== */}

      <DiscardChangesModal
        open={showDiscardModal}
        onConfirm={confirmDiscard}
        onCancel={() =>
          setShowDiscardModal(false)
        }
      />

    </div>
  );
}