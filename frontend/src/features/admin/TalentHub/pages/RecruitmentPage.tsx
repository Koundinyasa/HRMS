import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApprovalsPanel } from "../components/ApprovalsPanel";
import { InterviewsPanel } from "../components/InterviewsPanel";
import { JobOpeningsPanel } from "../components/JobOpeningsPanel";
import { NewRequisitionScreen } from "../components/NewRequisitionScreen";
import { RecruitmentDashboard } from "../components/RecruitmentDashboard";
import { RecruitmentHeader } from "../components/RecruitmentHeader";
import { ResumeUploadScreen } from "../components/ResumeUploadScreen";
import {
  AssessmentManagementPanel,
  ResumeScreeningPanel,
} from "../components/RecruitmentWorkflowPanels";
import { RecruitmentOperationalScreen } from "../components/RecruitmentOperationalScreens";
import { EmptyState } from "../components/RecruitmentShared";
import { RECRUITMENT_SUB_NAV } from "../constants/talenthub.constants";
import { useRecruitment } from "../hooks/useRecruitment";
import type { RecruitmentTab } from "../types/recruitment.types";

const VIEW_TABS: Record<string, RecruitmentTab> = {
  "job-openings": "openings",
  "interview-process": "interviews",
  "requisition-approval": "approvals",
};

const WORKFLOW_TITLES: Record<string, string> = {
  "upload-resume": "Upload Resume",
  "job-requisition": "Job Requisition",
  "candidate-applications": "Candidate Applications",
  "resume-screening": "Resume Screening",
  "assessment-test": "Assessment / Test",
  "final-interview-approval": "Final Interview Approval",
  "offer-management": "Offer Management",
  "verification-bgv": "Verification / BGV",
  onboarding: "Onboarding",
  induction: "Induction",
  joining: "Joining",
  "team-assignment": "Team Assignment",
  "asset-assignment": "Asset Assignment",
};

export default function RecruitmentPage() {
  const recruitment = useRecruitment();
  const navigate = useNavigate();
  const { domain, view, action } = useParams<{
    domain: string;
    view?: string;
    action?: string;
  }>();
  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    selectedRole,
    setSelectedRole,
    selectedDepartment,
    setSelectedDepartment,
    candidates,
    filteredCandidates,
    openings,
    filteredOpenings,
    approvals,
    recruitmentError,
    isRecruitmentLoading,
    selectedApprovalStatus,
    setSelectedApprovalStatus,
    approvalComments,
    setApprovalComments,
    completedFeedbackTasks,
    setCompletedFeedbackTasks,
    approveOpening,
    sendBackOpening,
    refreshRecruitment,
    updateCandidateStage,
  } = recruitment;
  const routeTab = view ? VIEW_TABS[view] : "pipeline";
  const isOperationalWorkflowView =
    view === "upload-resume" ||
    view === "job-requisition" ||
    view === "candidate-applications" ||
    view === "final-interview-approval" ||
    view === "offer-management" ||
    view === "verification-bgv" ||
    view === "joining" ||
    view === "onboarding" ||
    view === "induction" ||
    view === "team-assignment" ||
    view === "asset-assignment";
  const isDedicatedWorkflowView =
    view === "resume-screening" ||
    view === "assessment-test" ||
    isOperationalWorkflowView;
  const isWorkflowPlaceholder = Boolean(
    view && !routeTab && !isDedicatedWorkflowView
  );
  const selectedPageTitle =
    RECRUITMENT_SUB_NAV.find(
      (item) => item.path === (view ? `recruitment/${view}` : "recruitment")
    )?.label ?? "Recruitment";

  useEffect(() => {
    if (routeTab) setActiveTab(routeTab);
  }, [routeTab, setActiveTab]);

  return (
    <div className="-m-4 min-h-full bg-[#f5f7f5] text-[#202a26] sm:-m-6">
      {!isOperationalWorkflowView && (
        <RecruitmentHeader
          pageTitle={selectedPageTitle}
          search={search}
          setSearch={setSearch}
          showActions={!isDedicatedWorkflowView}
          onNewOpening={() =>
            navigate(
              `/${domain}/admin/talent-hub/recruitment/job-requisition/new`,
            )
          }
        />
      )}
      <main className="space-y-6 px-5 py-6 sm:px-8">
        {view === "job-requisition" ? (
          <RecruitmentOperationalScreen
            view={view}
            onCreateAction={() =>
              navigate(
                `/${domain}/admin/talent-hub/recruitment/job-requisition/new`,
              )
            }
          />
        ) : view === "upload-resume" ? (
          <ResumeUploadScreen
            openings={openings}
            isLoading={isRecruitmentLoading}
          />
        ) : view === "resume-screening" ? (
          <ResumeScreeningPanel
            candidates={candidates}
            updateCandidateStage={updateCandidateStage}
          />
        ) : view === "assessment-test" ? (
          <AssessmentManagementPanel candidates={candidates} />
        ) : isDedicatedWorkflowView && view ? (
          <RecruitmentOperationalScreen view={view} />
        ) : isWorkflowPlaceholder ? (
          <section>
            <h2 className="mb-4 text-xl font-bold">
              {view ? WORKFLOW_TITLES[view] ?? "Recruitment" : "Recruitment"}
            </h2>
            <EmptyState message="This recruitment workflow section is ready to be configured." />
          </section>
        ) : !view && activeTab === "pipeline" && (
          <RecruitmentDashboard
            filteredCandidates={filteredCandidates}
            openings={openings}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            updateCandidateStage={updateCandidateStage}
          />
        )}
        {(view === "job-openings" || (!view && activeTab === "openings")) && (
          <JobOpeningsPanel
            filteredOpenings={filteredOpenings}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />
        )}
        {(view === "interview-process" || (!view && activeTab === "interviews")) && (
          <InterviewsPanel
            search={search}
            completedFeedbackTasks={completedFeedbackTasks}
            setCompletedFeedbackTasks={setCompletedFeedbackTasks}
          />
        )}
        {(view === "requisition-approval" || (!view && activeTab === "approvals")) && (
          <ApprovalsPanel
            approvals={approvals}
            selectedApprovalStatus={selectedApprovalStatus}
            setSelectedApprovalStatus={setSelectedApprovalStatus}
            search={search}
            approvalComments={approvalComments}
            setApprovalComments={setApprovalComments}
            sendBackOpening={sendBackOpening}
            approveOpening={approveOpening}
          />
        )}
        {!isOperationalWorkflowView && (
          <p className="text-center text-xs text-[#87938c]">
            Candidate pipeline and interview workflows are currently using
            sample data.
          </p>
        )}
      </main>
      {view === "job-requisition" && action === "new" && (
        <NewRequisitionScreen
          onCreated={refreshRecruitment}
          onClose={() =>
            navigate(
              `/${domain}/admin/talent-hub/recruitment/job-requisition`,
            )
          }
        />
      )}
      {recruitmentError && (
        <div
          role="alert"
          className="mx-5 mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:mx-8"
        >
          {recruitmentError}
        </div>
      )}
      {isRecruitmentLoading && (
        <p role="status" className="px-5 pb-4 text-center text-sm text-[#78867e]">
          Loading recruitment data…
        </p>
      )}
    </div>
  );
}
