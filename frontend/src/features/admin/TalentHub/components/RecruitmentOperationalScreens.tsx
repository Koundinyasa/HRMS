import { Plus, X } from "lucide-react";
import {
  recruitmentFileName,
  recruitmentFileUrl,
} from "../api/recruitment.api";
import { OperationalWorkflowTable } from "./OperationalWorkflowTable";
import { useRecruitmentOperationalScreen } from "../hooks/useRecruitmentOperationalScreen";
import { CandidateApplicationForm } from "./CandidateApplicationForm";
import {
  WorkflowFieldsForm,
} from "./WorkflowFieldsForm";
import {
  WORKFLOW_SCREENS,
} from "./recruitmentOperationalConfig";

export function RecruitmentOperationalScreen({
  view,
  onCreateAction,
}: {
  view: string;
  onCreateAction?: () => void;
}) {
  const config = WORKFLOW_SCREENS[view];
  const {
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    selectedRow,
    setSelectedRow,
    requisitionDetails,
    requisitionDetailsLoading,
    requisitionDetailsError,
    requisitionReviewRemarks,
    setRequisitionReviewRemarks,
    requisitionActionError,
    canManageRequisitionApprovals,
    isSubmittingRequisitionAction,
    submitRequisitionAction,
    actionMessage,
    setActionMessage,
    finalApprovalApplicationId,
    setFinalApprovalApplicationId,
    finalApprovalSelected,
    setFinalApprovalSelected,
    finalApprovalRemarks,
    setFinalApprovalRemarks,
    finalApprovalError,
    setFinalApprovalError,
    isSubmittingFinalApproval,
    showPostJoiningForm,
    setShowPostJoiningForm,
    postJoiningFormValues,
    setPostJoiningFormValues,
    welcomeEmailDrafts,
    setWelcomeEmailDrafts,
    sendingWelcomeEmail,
    welcomeEmailError,
    setWelcomeEmailError,
    showJoiningForm,
    setShowJoiningForm,
    joiningFormValues,
    setJoiningFormValues,
    joiningFormError,
    setJoiningFormError,
    isSubmittingJoining,
    joiningEmailDrafts,
    setJoiningEmailDrafts,
    sendingJoiningEmail,
    showTeamAssignmentForm,
    setShowTeamAssignmentForm,
    teamAssignmentValues,
    setTeamAssignmentValues,
    teamAssignmentEmailDrafts,
    setTeamAssignmentEmailDrafts,
    sendingTeamAssignmentEmail,
    teamAssignmentError,
    setTeamAssignmentError,
    setCandidateApplicationSubmitError,
    showCandidateApplicationForm,
    setShowCandidateApplicationForm,
    isSubmittingCandidateApplication,
    candidateApplicationSource,
    setCandidateApplicationSource,
    candidateApplicationReferrer,
    setCandidateApplicationReferrer,
    jobOpeningOptions,
    sourceOptions,
    candidateApplicationDropdownsLoading,
    candidateApplicationDropdownsError,
    candidateApplicationsError,
    candidateApplicationsLoading,
    jobRequisitionsError,
    jobRequisitionsLoading,
    submitCandidateApplication,
    statuses,
    filteredRows,
    postJoiningFormFields,
    submitPostJoiningForm,
    joiningFormFields,
    submitJoiningForm,
    sendJoiningEmail,
    teamAssignmentFields,
    submitTeamAssignment,
    sendTeamAssignmentEmail,
    sendWelcomeEmail,
    isPostJoiningPreview,
    submitFinalInterviewApproval,
  } = useRecruitmentOperationalScreen(view, config);

  if (!config) return null;

  return (
    <>
      <section className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
              Recruitment workflow
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
              {config.title}
            </h2>
            <p className="mt-1.5 text-sm text-[#7b8981]">{config.description}</p>
          </div>
          {view !== "final-interview-approval" && (
            <button
              type="button"
              aria-label={
                view === "candidate-applications" &&
                showCandidateApplicationForm
                  ? "Close application form"
                  : config.createAction
              }
              onClick={() => {
                if (view === "candidate-applications") {
                  setShowCandidateApplicationForm((isOpen) => !isOpen);
                  setCandidateApplicationSubmitError("");
                  setActionMessage("");
                  return;
                }
                if (view === "onboarding" || view === "induction") {
                  setShowPostJoiningForm((isOpen) => !isOpen);
                  setPostJoiningFormValues({});
                  setActionMessage("");
                  return;
                }
                if (view === "joining") {
                  setShowJoiningForm((isOpen) => !isOpen);
                  setJoiningFormValues({});
                  setJoiningFormError("");
                  setActionMessage("");
                  return;
                }
                if (view === "team-assignment") {
                  setShowTeamAssignmentForm((isOpen) => !isOpen);
                  setTeamAssignmentValues({});
                  setTeamAssignmentError("");
                  setActionMessage("");
                  return;
                }
                if (onCreateAction) {
                  onCreateAction();
                  return;
                }
                setActionMessage(
                  `${config.createAction} is a sample action and is not connected to a live service yet.`
                );
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#e5a538] px-4 text-sm font-semibold text-[#342712] shadow-sm transition hover:bg-[#d99a2b] focus:outline-none focus:ring-2 focus:ring-[#e5a538]/35"
            >
              {(view === "candidate-applications" &&
                showCandidateApplicationForm) ||
              (view === "onboarding" || view === "induction") &&
                showPostJoiningForm ? (
                <X className="h-4 w-4" />
              ) : view === "joining" && showJoiningForm ? (
                <X className="h-4 w-4" />
              ) : view === "team-assignment" && showTeamAssignmentForm ? (
                <X className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {view === "candidate-applications" &&
              showCandidateApplicationForm
                ? null
                : (view === "onboarding" || view === "induction") &&
                    showPostJoiningForm
                  ? "Cancel"
                : view === "joining" && showJoiningForm
                  ? "Cancel"
                : view === "team-assignment" && showTeamAssignmentForm
                  ? "Cancel"
                : config.createAction}
            </button>
            )}
        </div>
        {isPostJoiningPreview && (
          <p
            role="note"
            className="rounded-lg border border-[#eee4c9] bg-[#fffaf0] px-4 py-2.5 text-sm text-[#78643c]"
          >
            Preview screen: sample rows only. These post-joining workflows are
            not connected to a live backend yet.
          </p>
        )}
        {actionMessage && (
          <p
            role="status"
            className="rounded-lg border border-[#eee4c9] bg-[#fffaf0] px-4 py-2.5 text-sm text-[#78643c]"
          >
            {actionMessage}
          </p>
        )}
        {view === "candidate-applications" &&
          showCandidateApplicationForm && (
            <CandidateApplicationForm
              jobOpeningOptions={jobOpeningOptions}
              sourceOptions={sourceOptions}
              dropdownsLoading={candidateApplicationDropdownsLoading}
              dropdownsError={candidateApplicationDropdownsError}
              isSubmitting={isSubmittingCandidateApplication}
              source={candidateApplicationSource}
              referrer={candidateApplicationReferrer}
              onSourceChange={(source) => {
                setCandidateApplicationSource(source);
                if (source.toLowerCase() !== "employee referral") {
                  setCandidateApplicationReferrer("");
                }
              }}
              onReferrerChange={setCandidateApplicationReferrer}
              onSubmit={(event) => void submitCandidateApplication(event)}
            />
          )}
        {(view === "onboarding" || view === "joining") &&
          welcomeEmailError && (
          <p
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {welcomeEmailError}
          </p>
        )}
        {view === "team-assignment" && teamAssignmentError && (
          <p
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {teamAssignmentError}
          </p>
        )}
        {view === "team-assignment" && showTeamAssignmentForm && (
          <WorkflowFieldsForm
            title="Assign Employee to Team"
            fields={teamAssignmentFields}
            values={teamAssignmentValues}
            onChange={(key, value) =>
              setTeamAssignmentValues((previous) => ({
                ...previous,
                [key]: value,
              }))
            }
            onSubmit={submitTeamAssignment}
            submitLabel="Assign Team"
          />
        )}
        {view === "joining" && showJoiningForm && (
          <WorkflowFieldsForm
            title="Prepare Candidate Joining"
            fields={joiningFormFields}
            values={joiningFormValues}
            onChange={(key, value) =>
              setJoiningFormValues((previous) => ({
                ...previous,
                [key]: value,
              }))
            }
            onSubmit={(event) => void submitJoiningForm(event)}
            submitLabel="Prepare Joining"
            error={joiningFormError}
            isSubmitting={isSubmittingJoining}
            submittingLabel="Preparing..."
          />
        )}
        {(view === "onboarding" || view === "induction") &&
          showPostJoiningForm && (
            <WorkflowFieldsForm
              title={
                view === "onboarding"
                  ? "Start Candidate Onboarding"
                  : "Schedule Candidate Induction"
              }
              fields={postJoiningFormFields}
              values={postJoiningFormValues}
              onChange={(key, value) =>
                setPostJoiningFormValues((previous) => ({
                  ...previous,
                  [key]: value,
                }))
              }
              onSubmit={submitPostJoiningForm}
              submitLabel={
                view === "onboarding" ? "Save Onboarding" : "Schedule Induction"
              }
            />
          )}
        {view === "candidate-applications" &&
          (candidateApplicationsError ||
            candidateApplicationDropdownsError) && (
          <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {candidateApplicationsError || candidateApplicationDropdownsError}
          </p>
        )}
        {view === "job-requisition" && jobRequisitionsError && (
          <p
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {jobRequisitionsError}
          </p>
        )}

        <OperationalWorkflowTable
          key={view}
          view={view}
          config={config}
          filteredRows={filteredRows}
          statuses={statuses}
          search={search}
          onSearchChange={setSearch}
          selectedStatus={selectedStatus}
          onSelectedStatusChange={setSelectedStatus}
          isLoading={candidateApplicationsLoading || jobRequisitionsLoading}
          welcomeEmailDrafts={welcomeEmailDrafts}
          onWelcomeEmailChange={(rowKey, email) => {
            setWelcomeEmailDrafts((previous) => ({ ...previous, [rowKey]: email }));
            setWelcomeEmailError("");
          }}
          sendingWelcomeEmail={sendingWelcomeEmail}
          onSendWelcomeEmail={(row, rowKey) => void sendWelcomeEmail(row, rowKey)}
          joiningEmailDrafts={joiningEmailDrafts}
          onJoiningEmailChange={(rowKey, email) => {
            setJoiningEmailDrafts((previous) => ({ ...previous, [rowKey]: email }));
            setWelcomeEmailError("");
          }}
          sendingJoiningEmail={sendingJoiningEmail}
          onSendJoiningEmail={(row, rowKey) => void sendJoiningEmail(row, rowKey)}
          teamAssignmentEmailDrafts={teamAssignmentEmailDrafts}
          onTeamAssignmentEmailChange={(rowKey, email) => {
            setTeamAssignmentEmailDrafts((previous) => ({ ...previous, [rowKey]: email }));
            setTeamAssignmentError("");
          }}
          sendingTeamAssignmentEmail={sendingTeamAssignmentEmail}
          onSendTeamAssignmentEmail={(row, rowKey) => void sendTeamAssignmentEmail(row, rowKey)}
          onViewAction={(row) => {
            setSelectedRow(row);
            setRequisitionReviewRemarks("");
            setFinalApprovalApplicationId(/^\d+$/.test(row.applicationId ?? "") ? row.applicationId : "");
            setFinalApprovalSelected("true");
            setFinalApprovalRemarks("");
            setFinalApprovalError("");
          }}
        />
      </section>

      {selectedRow && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#202a26]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedRow(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="workflow-record-title"
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#efeee9] px-5 py-4">
              <h3 id="workflow-record-title" className="font-bold text-[#26332c]">
                {selectedRow[config.columns[0].key]}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                aria-label="Close record details"
                className="rounded-lg p-1.5 text-[#7e8981] transition hover:bg-[#f5f4ef]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {view === "job-requisition" ? (
              <>
                {requisitionDetailsLoading && (
                  <p role="status" className="px-5 py-3 text-sm text-[#78867e]">
                    Loading requisition details...
                  </p>
                )}
                {requisitionDetailsError && (
                  <p role="alert" className="px-5 py-3 text-sm text-rose-700">
                    {requisitionDetailsError}
                  </p>
                )}
                <dl className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
                  {requisitionDetails.map((field) => (
                    <div
                      key={field.label}
                      className="border-b border-[#f0f0eb] py-3"
                    >
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                        {field.label}
                      </dt>
                      <dd className="mt-1 break-words text-sm font-medium text-[#354239] [overflow-wrap:anywhere]">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <dl className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
                {config.columns.map((column) => (
                  <div
                    key={column.key}
                    className="border-b border-[#f0f0eb] py-3"
                  >
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                      {column.label}
                    </dt>
                    <dd className="mt-1 break-words text-sm font-medium text-[#354239] [overflow-wrap:anywhere]">
                      {view === "candidate-applications" &&
                      column.key === "resume" &&
                      selectedRow.resume !== "—" ? (
                        <a
                          href={recruitmentFileUrl(selectedRow.resume)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#000000] hover:text-[#000000]"
                        >
                          {selectedRow.resumeFileName ||
                            recruitmentFileName(selectedRow.resume)}
                        </a>
                      ) : (
                        selectedRow[column.key]
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {view === "job-requisition" ? (
              <div className="space-y-4 border-t border-[#efeee9] px-5 py-4">
                {canManageRequisitionApprovals && (
                  <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
                    Review remarks
                    <textarea
                      value={requisitionReviewRemarks}
                      onChange={(event) =>
                        setRequisitionReviewRemarks(event.target.value)
                      }
                      maxLength={500}
                      rows={3}
                      placeholder="Enter review remarks"
                      className="w-full rounded-lg border border-[#dfe4df] px-3 py-2 text-sm font-normal outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                    />
                  </label>
                )}
                {requisitionActionError && (
                  <p role="alert" className="text-xs text-rose-700">
                    {requisitionActionError}
                  </p>
                )}
                {!canManageRequisitionApprovals ? (
                  <p className="text-right text-xs text-[#78867e]">
                    Only an authorized hiring manager can approve or reject requisitions.
                  </p>
                ) : (
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(null)}
                      disabled={isSubmittingRequisitionAction}
                      className="h-9 rounded-lg border border-[#e8e6de] px-4 text-xs font-semibold text-[#566258] transition hover:bg-[#f8f7f2] disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void submitRequisitionAction(
                          "REJECT",
                          requisitionReviewRemarks,
                        )
                      }
                      disabled={isSubmittingRequisitionAction}
                      className="h-9 rounded-lg border border-rose-200 px-4 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60"
                    >
                      {isSubmittingRequisitionAction
                        ? "Submitting..."
                        : "Reject"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void submitRequisitionAction(
                          "APPROVE",
                          requisitionReviewRemarks,
                        )
                      }
                      disabled={isSubmittingRequisitionAction}
                      className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] transition hover:bg-[#d99a2b] disabled:cursor-wait disabled:opacity-60"
                    >
                      {isSubmittingRequisitionAction
                        ? "Submitting..."
                        : "Approve"}
                    </button>
                  </div>
                )}
              </div>
            ) : view === "final-interview-approval" ? (
              <form
                onSubmit={submitFinalInterviewApproval}
                className="space-y-4 border-t border-[#efeee9] px-5 py-4"
              >
                <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
                  Application ID
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={finalApprovalApplicationId}
                    onChange={(event) =>
                      setFinalApprovalApplicationId(event.target.value)
                    }
                    placeholder="Enter numeric application ID"
                    className="h-10 w-full rounded-lg border border-[#dfe4df] px-3 text-sm font-normal outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                  />
                </label>
                <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
                  Final decision
                  <select
                    value={finalApprovalSelected}
                    onChange={(event) =>
                      setFinalApprovalSelected(event.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm font-normal outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                  >
                    <option value="true">Approve / Select candidate</option>
                    <option value="false">Reject candidate</option>
                  </select>
                </label>
                <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
                  Remarks
                  <textarea
                    value={finalApprovalRemarks}
                    onChange={(event) =>
                      setFinalApprovalRemarks(event.target.value)
                    }
                    maxLength={500}
                    rows={3}
                    placeholder="Enter final interview remarks"
                    className="w-full rounded-lg border border-[#dfe4df] px-3 py-2 text-sm font-normal outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                  />
                </label>
                {finalApprovalError && (
                  <p role="alert" className="text-xs text-rose-700">
                    {finalApprovalError}
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRow(null)}
                    disabled={isSubmittingFinalApproval}
                    className="h-9 rounded-lg border border-[#e8e6de] px-4 text-xs font-semibold text-[#566258] transition hover:bg-[#f8f7f2] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingFinalApproval}
                    className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] transition hover:bg-[#d99a2b] disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSubmittingFinalApproval
                      ? "Submitting..."
                      : "Submit Decision"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-end border-t border-[#efeee9] px-5 py-3">
                <button
                  type="button"
                  onClick={() => setSelectedRow(null)}
                  className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] transition hover:bg-[#d99a2b]"
                >
                  Close
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
