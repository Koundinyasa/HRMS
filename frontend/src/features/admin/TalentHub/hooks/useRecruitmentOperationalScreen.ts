import { useMemo, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  useApproveCandidateJoiningMutation,
  useCreateCandidateApplicationMutation,
  useGetCandidateApplicationsQuery,
  useGetJobOpeningMasterQuery,
  useGetAllRequisitionsForHRQuery,
  useGetPendingRequisitionsQuery,
  useGetJobRequisitionDetailsQuery,
  useGetRecruitmentSourcesQuery,
  useSendJoiningEmailMutation,
  useSendTeamAssignmentEmailMutation,
  useSendWelcomeEmailMutation,
  useUpdateRequisitionMutation,
  useUpdateFinalInterviewApprovalMutation,
} from "../api/recruitment.api";
import { getApiErrorMessage } from "../utils/recruitmentErrors";
import {
  EMPTY_DROPDOWN_OPTIONS,
  EMPTY_WORKFLOW_ROWS,
  type WorkflowRow,
  type WorkflowScreenConfig,
  mapCandidateApplication,
  mapJobRequisition,
  mapJobRequisitionDetails,
  mapLookupRows,
} from "../components/recruitmentOperationalConfig";
import type { WorkflowFormField } from "../components/WorkflowFieldsForm";

export function useRecruitmentOperationalScreen(
  view: string,
  config: WorkflowScreenConfig | undefined,
) {
  const roleId = useAppSelector((state) => state.auth.roleId);
  const isHrRole = roleId === "1" || roleId === "2";
  const canManageRequisitionApprovals = roleId === "3";
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedRow, setSelectedRow] = useState<WorkflowRow | null>(null);
  const [requisitionReviewRemarks, setRequisitionReviewRemarks] = useState("");
  const [requisitionActionError, setRequisitionActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [finalApprovalApplicationId, setFinalApprovalApplicationId] =
    useState("");
  const [finalApprovalSelected, setFinalApprovalSelected] = useState("true");
  const [finalApprovalRemarks, setFinalApprovalRemarks] = useState("");
  const [finalApprovalError, setFinalApprovalError] = useState("");
  const [isSubmittingFinalApproval, setIsSubmittingFinalApproval] =
    useState(false);
  const [showPostJoiningForm, setShowPostJoiningForm] = useState(false);
  const [postJoiningFormValues, setPostJoiningFormValues] = useState<
    Record<string, string>
  >({});
  const [postJoiningRows, setPostJoiningRows] = useState<
    Record<string, WorkflowRow[]>
  >({});
  const [welcomeEmailDrafts, setWelcomeEmailDrafts] = useState<
    Record<string, string>
  >({});
  const [sendingWelcomeEmail, setSendingWelcomeEmail] = useState<string | null>(
    null,
  );
  const [welcomeEmailError, setWelcomeEmailError] = useState("");
  const [showJoiningForm, setShowJoiningForm] = useState(false);
  const [joiningFormValues, setJoiningFormValues] = useState<
    Record<string, string>
  >({});
  const [joiningFormError, setJoiningFormError] = useState("");
  const [isSubmittingJoining, setIsSubmittingJoining] = useState(false);
  const [joiningEmailDrafts, setJoiningEmailDrafts] = useState<
    Record<string, string>
  >({});
  const [sendingJoiningEmail, setSendingJoiningEmail] = useState<string | null>(
    null,
  );
  const [showTeamAssignmentForm, setShowTeamAssignmentForm] = useState(false);
  const [teamAssignmentValues, setTeamAssignmentValues] = useState<
    Record<string, string>
  >({});
  const [teamAssignmentEmailDrafts, setTeamAssignmentEmailDrafts] = useState<
    Record<string, string>
  >({});
  const [sendingTeamAssignmentEmail, setSendingTeamAssignmentEmail] = useState<
    string | null
  >(null);
  const [teamAssignmentError, setTeamAssignmentError] = useState("");
  const [candidateApplicationSubmitError, setCandidateApplicationSubmitError] =
    useState("");
  const [showCandidateApplicationForm, setShowCandidateApplicationForm] =
    useState(false);
  const [isSubmittingCandidateApplication, setIsSubmittingCandidateApplication] =
    useState(false);
  const [candidateApplicationSource, setCandidateApplicationSource] =
    useState("");
  const [candidateApplicationReferrer, setCandidateApplicationReferrer] =
    useState("");
  const isEmployeeReferral =
    candidateApplicationSource.toLowerCase() === "employee referral";

  const [createCandidateApplication] = useCreateCandidateApplicationMutation();
  const [approveCandidateJoining] = useApproveCandidateJoiningMutation();
  const [triggerSendJoiningEmail] = useSendJoiningEmailMutation();
  const [triggerSendTeamAssignmentEmail] = useSendTeamAssignmentEmailMutation();
  const [triggerSendWelcomeEmail] = useSendWelcomeEmailMutation();
  const [updateFinalInterviewApproval] =
    useUpdateFinalInterviewApprovalMutation();
  const [updateRequisition, { isLoading: isSubmittingRequisitionAction }] =
    useUpdateRequisitionMutation();

  // Candidate applications / dropdown lookups are only needed on this view.
  // Mutations invalidate the "Recruitment" tag, so the list refetches itself.
  const isCandidateApplicationsView = view === "candidate-applications";
  const isJobRequisitionView = view === "job-requisition";

  const {
    data: candidateApplicationsResponse,
    error: candidateApplicationsQueryError,
    isFetching: candidateApplicationsLoading,
  } = useGetCandidateApplicationsQuery(undefined, {
    skip: !isCandidateApplicationsView,
  });

  const {
    data: jobOpeningMasterResponse,
    error: jobOpeningMasterQueryError,
    isFetching: jobOpeningMasterLoading,
  } = useGetJobOpeningMasterQuery(undefined, {
    skip: !isCandidateApplicationsView,
  });

  const {
    data: recruitmentSourcesResponse,
    error: recruitmentSourcesQueryError,
    isFetching: recruitmentSourcesLoading,
  } = useGetRecruitmentSourcesQuery(undefined, {
    skip: !isCandidateApplicationsView,
  });

  const hrRequisitionsQuery = useGetAllRequisitionsForHRQuery(undefined, {
    skip: !isJobRequisitionView || !isHrRole,
    refetchOnMountOrArgChange: true,
    pollingInterval: isJobRequisitionView ? 15000 : 0,
  });
  const managerRequisitionsQuery = useGetPendingRequisitionsQuery(undefined, {
    skip: !isJobRequisitionView || !canManageRequisitionApprovals,
    refetchOnMountOrArgChange: true,
    pollingInterval: isJobRequisitionView ? 15000 : 0,
  });
  const jobRequisitionsResponse = isHrRole
    ? hrRequisitionsQuery.data
    : managerRequisitionsQuery.data;
  const jobRequisitionsQueryError = isHrRole
    ? hrRequisitionsQuery.error
    : managerRequisitionsQuery.error;
  const jobRequisitionsLoading = isHrRole
    ? hrRequisitionsQuery.isFetching
    : managerRequisitionsQuery.isFetching;

  const selectedRequisitionId = Number(selectedRow?.requisitionId);
  const hasSelectedRequisitionId =
    Number.isInteger(selectedRequisitionId) && selectedRequisitionId > 0;
  const {
    currentData: requisitionDetailsResponse,
    error: requisitionDetailsQueryError,
    isFetching: requisitionDetailsLoading,
  } = useGetJobRequisitionDetailsQuery(selectedRequisitionId, {
    skip: !isJobRequisitionView || !selectedRow || !hasSelectedRequisitionId,
  });
  const requisitionDetailsResult = useMemo(() => {
    if (requisitionDetailsResponse === undefined) return undefined;
    try {
      return {
        fields: mapJobRequisitionDetails(requisitionDetailsResponse),
        error: "",
      };
    } catch (error) {
      return {
        fields: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to load requisition details.",
      };
    }
  }, [requisitionDetailsResponse]);
  const requisitionDetailsError = !selectedRow
    ? ""
    : !hasSelectedRequisitionId
      ? "This requisition does not have a valid requisition ID."
      : requisitionDetailsQueryError
        ? getApiErrorMessage(
            requisitionDetailsQueryError,
            "Unable to load requisition details.",
          )
        : (requisitionDetailsResult?.error ?? "");

  const jobRequisitionsResult = useMemo(() => {
    if (jobRequisitionsResponse === undefined) return undefined;
    try {
      if (Array.isArray(jobRequisitionsResponse)) {
        return {
          rows: jobRequisitionsResponse.map(mapJobRequisition),
          error: "",
        };
      }
      if (
        !jobRequisitionsResponse ||
        typeof jobRequisitionsResponse !== "object" ||
        !("success" in jobRequisitionsResponse) ||
        !jobRequisitionsResponse.success ||
        !("data" in jobRequisitionsResponse) ||
        !Array.isArray(jobRequisitionsResponse.data)
      ) {
        const message =
          jobRequisitionsResponse &&
          typeof jobRequisitionsResponse === "object" &&
          "message" in jobRequisitionsResponse
            ? jobRequisitionsResponse.message
            : undefined;
        throw new Error(
          typeof message === "string"
            ? message
            : "Recruitment API returned an invalid requisition list.",
        );
      }
      return {
        rows: jobRequisitionsResponse.data.map(mapJobRequisition),
        error: "",
      };
    } catch (error) {
      return {
        rows: EMPTY_WORKFLOW_ROWS,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load requisitions.",
      };
    }
  }, [jobRequisitionsResponse]);

  const candidateApplicationsResult = useMemo(() => {
    if (!candidateApplicationsResponse) return undefined;
    try {
      if (!Array.isArray(candidateApplicationsResponse)) {
        throw new Error("Recruitment API returned an invalid application list.");
      }
      return {
        rows: candidateApplicationsResponse.map(mapCandidateApplication),
        error: "",
      };
    } catch (error) {
      return {
        rows: EMPTY_WORKFLOW_ROWS,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load candidate applications.",
      };
    }
  }, [candidateApplicationsResponse]);

  const dropdownsResult = useMemo(() => {
    if (!jobOpeningMasterResponse || !recruitmentSourcesResponse) {
      return undefined;
    }
    try {
      return {
        jobOpenings: mapLookupRows(
          jobOpeningMasterResponse,
          {
            value: ["JobOpeningID", "OpeningID", "JobID", "ID"],
            label: ["JobTitle", "OpeningTitle", "Title", "JobOpeningName"],
          },
          "job opening",
        ),
        sources: mapLookupRows(
          recruitmentSourcesResponse,
          {
            value: [
              "SourceName",
              "RecruitmentSource",
              "Source",
              "Name",
              "SourceID",
              "ID",
            ],
            label: [
              "SourceName",
              "RecruitmentSource",
              "Source",
              "Name",
              "SourceID",
              "ID",
            ],
          },
          "recruitment source",
        ),
        error: "",
      };
    } catch (error) {
      return {
        jobOpenings: EMPTY_DROPDOWN_OPTIONS,
        sources: EMPTY_DROPDOWN_OPTIONS,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load candidate application dropdowns.",
      };
    }
  }, [jobOpeningMasterResponse, recruitmentSourcesResponse]);

  const candidateApplicationRows =
    candidateApplicationsResult?.rows ?? EMPTY_WORKFLOW_ROWS;
  const jobOpeningOptions =
    dropdownsResult?.jobOpenings ?? EMPTY_DROPDOWN_OPTIONS;
  const sourceOptions = dropdownsResult?.sources ?? EMPTY_DROPDOWN_OPTIONS;
  const candidateApplicationDropdownsLoading =
    jobOpeningMasterLoading || recruitmentSourcesLoading;

  const candidateApplicationsLoadError = candidateApplicationsLoading
    ? ""
    : candidateApplicationsQueryError
      ? getApiErrorMessage(
          candidateApplicationsQueryError,
          "Unable to load candidate applications.",
        )
      : (candidateApplicationsResult?.error ?? "");
  const candidateApplicationsError =
    candidateApplicationSubmitError || candidateApplicationsLoadError;

  const dropdownsQueryError =
    jobOpeningMasterQueryError ?? recruitmentSourcesQueryError;
  const candidateApplicationDropdownsError = candidateApplicationDropdownsLoading
    ? ""
    : dropdownsQueryError
      ? getApiErrorMessage(
          dropdownsQueryError,
          "Unable to load candidate application dropdowns.",
        )
      : (dropdownsResult?.error ?? "");

  const rows =
    view === "candidate-applications"
      ? candidateApplicationRows
      : view === "job-requisition"
        ? jobRequisitionsResult?.rows ?? EMPTY_WORKFLOW_ROWS
        : postJoiningRows[view] ?? config?.rows ?? EMPTY_WORKFLOW_ROWS;
  const jobRequisitionsError = jobRequisitionsLoading
    ? ""
    : jobRequisitionsQueryError
      ? getApiErrorMessage(
          jobRequisitionsQueryError,
          "Unable to load requisitions.",
        )
      : (jobRequisitionsResult?.error ?? "");
  const statusKey = config?.statusKey ?? "";

  const submitCandidateApplication = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const resume = formData.get("resume");
    setCandidateApplicationSubmitError("");
    setIsSubmittingCandidateApplication(true);

    try {
      await createCandidateApplication({
        jobOpeningId: Number(formData.get("jobOpeningId")),
        fullName: String(formData.get("fullName") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim() || undefined,
        source: candidateApplicationSource || undefined,
        referredBy:
          isEmployeeReferral && candidateApplicationReferrer.trim()
            ? candidateApplicationReferrer.trim()
            : undefined,
        resume: resume instanceof File && resume.size > 0 ? resume : undefined,
      }).unwrap();
      form.reset();
      setCandidateApplicationSource("");
      setCandidateApplicationReferrer("");
      setShowCandidateApplicationForm(false);
      setActionMessage("Candidate application submitted successfully.");
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to submit the candidate application.");
      setCandidateApplicationSubmitError(message);
    } finally {
      setIsSubmittingCandidateApplication(false);
    }
  };

  const statuses = useMemo(
    () => Array.from(new Set(rows.map((row) => row[statusKey]))),
    [rows, statusKey]
  );
  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !normalizedSearch ||
        Object.values(row).some((value) =>
          value.toLowerCase().includes(normalizedSearch)
        );
      const matchesStatus =
        selectedStatus === "All Statuses" ||
        row[statusKey] === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, selectedStatus, statusKey]);

  const submitRequisitionAction = async (
    action: "APPROVE" | "REJECT",
    reviewRemarks: string,
  ) => {
    if (!canManageRequisitionApprovals) {
      setRequisitionActionError(
        "Only an authorized hiring manager can approve or reject requisitions.",
      );
      return;
    }

    const requisitionId = Number(selectedRow?.requisitionId);
    if (!Number.isInteger(requisitionId) || requisitionId <= 0) {
      setRequisitionActionError(
        "This requisition does not have a valid requisition ID.",
      );
      return;
    }

    setRequisitionActionError("");
    try {
      await updateRequisition({
        requisitionId,
        action,
        reviewRemarks:
          reviewRemarks.trim() ||
          (action === "APPROVE"
            ? "Requisition approved."
            : "Requisition rejected."),
      }).unwrap();
      setSelectedRow(null);
      setActionMessage(
        action === "APPROVE"
          ? "Requisition approved successfully."
          : "Requisition rejected successfully.",
      );
    } catch (error) {
      setRequisitionActionError(
        getApiErrorMessage(
          error,
          action === "APPROVE"
            ? "Unable to approve this requisition."
            : "Unable to reject this requisition.",
        ),
      );
    }
  };
  const postJoiningFormFields: WorkflowFormField[] =
    view === "onboarding"
      ? [
          { key: "candidate", label: "Candidate name", placeholder: "Enter candidate name" },
          {
            key: "email",
            label: "Candidate email",
            type: "email",
            placeholder: "Enter candidate email",
          },
          { key: "position", label: "Position", placeholder: "Enter position" },
          {
            key: "offerStatus",
            label: "Offer status",
            options: ["Accepted", "Pending"],
          },
          {
            key: "welcomeEmail",
            label: "Welcome email",
            options: ["Sent", "Pending"],
          },
          {
            key: "status",
            label: "Onboarding status",
            options: ["In Progress", "Complete", "Pending"],
          },
        ]
      : [
          { key: "candidate", label: "Candidate name", placeholder: "Enter candidate name" },
          { key: "position", label: "Position", placeholder: "Enter position" },
          { key: "inductionDate", label: "Induction date", type: "date" },
          { key: "program", label: "Program", placeholder: "Enter induction program" },
          {
            key: "status",
            label: "Status",
            options: ["Scheduled", "In Progress", "Complete"],
          },
        ];
  const submitPostJoiningForm = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!config || (view !== "onboarding" && view !== "induction")) return;

    const row: WorkflowRow = {};
    postJoiningFormFields.forEach(({ key }) => {
      row[key] = postJoiningFormValues[key]?.trim() ?? "";
    });
    setPostJoiningRows((previous) => ({
      ...previous,
      [view]: [...(previous[view] ?? config.rows), row],
    }));
    setPostJoiningFormValues({});
    setShowPostJoiningForm(false);
    setActionMessage(
      `${config.createAction} added to this session. This preview is not connected to a backend.`,
    );
  };
  const submitJoiningForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!config) return;
    setJoiningFormError("");
    const applicationId = Number(joiningFormValues.application);
    const joiningDate = joiningFormValues.joiningDate;
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      setJoiningFormError("Enter a valid candidate application ID.");
      return;
    }
    if (!joiningDate) {
      setJoiningFormError("Select a joining date.");
      return;
    }

    setIsSubmittingJoining(true);
    try {
      await approveCandidateJoining({
        applicationId,
        joiningDate,
      }).unwrap();
      const row: WorkflowRow = {
        application: String(applicationId),
        candidateId: joiningFormValues.candidateId.trim(),
        candidate: joiningFormValues.candidate.trim(),
        position: joiningFormValues.position.trim(),
        joiningDate,
        employeeCode: joiningFormValues.employeeCode.trim(),
        eligibility: joiningFormValues.eligibility,
        email: joiningFormValues.email.trim(),
      };
      setPostJoiningRows((previous) => ({
        ...previous,
        joining: [...(previous.joining ?? config.rows), row],
      }));
      setJoiningFormValues({});
      setShowJoiningForm(false);
      setActionMessage("Joining preparation submitted successfully.");
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to prepare candidate joining.");
      setJoiningFormError(message);
    } finally {
      setIsSubmittingJoining(false);
    }
  };
  const sendJoiningEmail = async (row: WorkflowRow, rowKey: string) => {
    const email = (joiningEmailDrafts[rowKey] ?? row.email ?? "").trim();
    setWelcomeEmailError("");
    setActionMessage("");
    if (!email) {
      setWelcomeEmailError("Enter the candidate's email address first.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setWelcomeEmailError("Enter a valid candidate email address.");
      return;
    }
    setSendingJoiningEmail(rowKey);
    try {
      await triggerSendJoiningEmail({
        email,
        candidateName: row.candidate,
        position: row.position ?? "your role",
        joiningDate: row.joiningDate,
      }).unwrap();
      setActionMessage(`Joining email sent to ${email}.`);
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to send the joining email.");
      setWelcomeEmailError(message);
    } finally {
      setSendingJoiningEmail(null);
    }
  };
  const submitTeamAssignment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!config) return;
    setTeamAssignmentError("");
    const row: WorkflowRow = {
      employee: teamAssignmentValues.employee.trim(),
      employeeCode: teamAssignmentValues.employeeCode.trim(),
      department: teamAssignmentValues.department.trim(),
      team: teamAssignmentValues.team.trim(),
      manager: teamAssignmentValues.manager.trim(),
      notification: "Pending",
      status: "Assigned",
      email: teamAssignmentValues.email.trim(),
    };
    setPostJoiningRows((previous) => ({
      ...previous,
      "team-assignment": [
        ...(previous["team-assignment"] ?? config.rows),
        row,
      ],
    }));
    setTeamAssignmentValues({});
    setShowTeamAssignmentForm(false);
    setActionMessage(
      "Team assignment added to this session. This preview is not connected to a backend.",
    );
  };
  const sendTeamAssignmentEmail = async (row: WorkflowRow, rowKey: string) => {
    const email = (teamAssignmentEmailDrafts[rowKey] ?? row.email ?? "").trim();
    setTeamAssignmentError("");
    setActionMessage("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setTeamAssignmentError("Enter a valid employee email address.");
      return;
    }
    if (!row.employee || !row.department || !row.team || !row.manager) {
      setTeamAssignmentError(
        "Employee, department, team, and manager details are required to send this email.",
      );
      return;
    }

    setSendingTeamAssignmentEmail(rowKey);
    try {
      await triggerSendTeamAssignmentEmail({
        email,
        employeeName: row.employee,
        department: row.department,
        team: row.team,
        manager: row.manager,
      }).unwrap();
      setActionMessage(`Team assignment email sent to ${email}.`);
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to send the team assignment email.");
      setTeamAssignmentError(message);
    } finally {
      setSendingTeamAssignmentEmail(null);
    }
  };
  const sendWelcomeEmail = async (row: WorkflowRow, rowKey: string) => {
    if (!config) return;
    const email = (welcomeEmailDrafts[rowKey] ?? row.email ?? "").trim();
    setWelcomeEmailError("");
    setActionMessage("");
    if (!email) {
      setWelcomeEmailError("Enter the candidate's email address first.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setWelcomeEmailError("Enter a valid candidate email address.");
      return;
    }
    if (!row.candidate || !row.position) {
      setWelcomeEmailError(
        "Candidate name and position are required to send the welcome email.",
      );
      return;
    }

    setSendingWelcomeEmail(rowKey);
    try {
      await triggerSendWelcomeEmail({
        email,
        candidateName: row.candidate,
        position: row.position,
      }).unwrap();
      setPostJoiningRows((previous) => {
        const onboardingRows = previous.onboarding ?? config.rows;
        const rowIndex = onboardingRows.findIndex(
          (candidateRow, index) =>
            `${candidateRow.candidate}-${candidateRow.position}-${index}` ===
            rowKey,
        );
        if (rowIndex < 0) return previous;
        const updatedRows = [...onboardingRows];
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          email,
          welcomeEmail: "Sent",
        };
        return { ...previous, onboarding: updatedRows };
      });
      setActionMessage(`Welcome email sent to ${email}.`);
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to send the welcome email.");
      setWelcomeEmailError(message);
    } finally {
      setSendingWelcomeEmail(null);
    }
  };
  const isPostJoiningPreview = [
    "onboarding",
    "induction",
    "team-assignment",
    "asset-assignment",
  ].includes(view);
  const joiningFormFields: WorkflowFormField[] = [
    {
      key: "application",
      label: "Candidate application ID",
      type: "number",
      placeholder: "Enter application ID",
    },
    {
      key: "candidateId",
      label: "Candidate ID",
      placeholder: "Enter candidate ID",
    },
    { key: "candidate", label: "Candidate name", placeholder: "Enter candidate name" },
    { key: "position", label: "Position", placeholder: "Enter position" },
    { key: "joiningDate", label: "Joining date", type: "date" },
    { key: "employeeCode", label: "Employee code", placeholder: "Enter employee code" },
    {
      key: "eligibility",
      label: "Eligibility",
      options: ["Eligible", "Not Eligible"],
    },
    {
      key: "email",
      label: "Candidate email",
      type: "email",
      placeholder: "Enter candidate email",
    },
  ];
  const teamAssignmentFields: WorkflowFormField[] = [
    { key: "employee", label: "Employee name", placeholder: "Enter employee name" },
    { key: "employeeCode", label: "Employee code", placeholder: "Enter employee code" },
    { key: "department", label: "Department", placeholder: "Enter department" },
    { key: "team", label: "Team", placeholder: "Enter team" },
    { key: "manager", label: "Reporting manager", placeholder: "Enter manager name" },
    {
      key: "email",
      label: "Employee email",
      type: "email",
      placeholder: "Enter employee email",
    },
  ];

  const submitFinalInterviewApproval = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFinalApprovalError("");

    const applicationId = Number(finalApprovalApplicationId);
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      setFinalApprovalError("Enter a valid candidate application ID.");
      return;
    }

    setIsSubmittingFinalApproval(true);
    try {
      await updateFinalInterviewApproval({
        applicationId,
        isSelected: finalApprovalSelected === "true",
        remarks: finalApprovalRemarks.trim(),
      }).unwrap();
      setActionMessage("Final interview approval submitted successfully.");
      setSelectedRow(null);
    } catch (error) {
      setFinalApprovalError(
        getApiErrorMessage(error, "Unable to submit the final interview decision."),
      );
    } finally {
      setIsSubmittingFinalApproval(false);
    }
  };


  return {
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    selectedRow,
    setSelectedRow,
    requisitionDetails: requisitionDetailsResult?.fields ?? EMPTY_WORKFLOW_ROWS,
    requisitionDetailsLoading,
    requisitionDetailsError,
    requisitionReviewRemarks,
    setRequisitionReviewRemarks,
    requisitionActionError,
    setRequisitionActionError,
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
    postJoiningRows,
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
    candidateApplicationSubmitError,
    setCandidateApplicationSubmitError,
    showCandidateApplicationForm,
    setShowCandidateApplicationForm,
    isSubmittingCandidateApplication,
    candidateApplicationSource,
    setCandidateApplicationSource,
    candidateApplicationReferrer,
    setCandidateApplicationReferrer,
    isEmployeeReferral,
    jobOpeningOptions,
    sourceOptions,
    candidateApplicationDropdownsLoading,
    candidateApplicationDropdownsError,
    candidateApplicationsError,
    candidateApplicationsLoading,
    jobRequisitionsError,
    jobRequisitionsLoading,
    rows,
    statusKey,
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
  };
}
