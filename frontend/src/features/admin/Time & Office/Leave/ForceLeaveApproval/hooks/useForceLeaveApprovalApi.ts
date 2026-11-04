import {
  useApproveLeavesMutation as useApproveLeavesApiMutation,
  useGetForceLeaveApprovalDropdownsQuery as useGetForceLeaveApprovalDropdownsApiQuery,
  useGetForceLeaveApprovalsQuery as useGetForceLeaveApprovalsApiQuery,
  useRejectLeavesMutation as useRejectLeavesApiMutation,
} from "../api/forceleaveapprovalApi";
import type { LeaveApprovalQuery } from "../types/forceapproval.types";

export const useForceLeaveApprovalDropdowns = () =>
  useGetForceLeaveApprovalDropdownsApiQuery();

export const useForceLeaveApprovals = (query: LeaveApprovalQuery) =>
  useGetForceLeaveApprovalsApiQuery(query);

export const useApproveForceLeaveApprovals = () =>
  useApproveLeavesApiMutation();

export const useRejectForceLeaveApprovals = () =>
  useRejectLeavesApiMutation();
