import type { SubNavItem } from "../../components/sidebar.types";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  FileSearch,
  Handshake,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

export const RECRUITMENT_SUB_NAV: SubNavItem[] = [
  { label: "Dashboard", path: "recruitment", icon: LayoutDashboard },
  { label: "Job Requisition", path: "recruitment/job-requisition", number: "01", icon: BriefcaseBusiness },
  {
    label: "Requisition Approval",
    path: "recruitment/requisition-approval",
    number: "02",
    icon: ClipboardCheck,
  },
  { label: "Job Openings", path: "recruitment/job-openings", number: "03", icon: BriefcaseBusiness },
  { label: "Candidate Applications", path: "recruitment/candidate-applications", number: "04", icon: UsersRound },
  { label: "Resume Screening", path: "recruitment/resume-screening", number: "05", icon: FileSearch },
  { label: "Assessment / Test", path: "recruitment/assessment-test", number: "06", icon: ClipboardCheck },
  { label: "Interview Schedule", path: "recruitment/interview-schedule", number: "07", icon: CalendarDays },
  { label: "Interview Process", path: "recruitment/interview-process", number: "08", icon: CalendarDays },
  { label: "Interviewer Feedback", path: "recruitment/interviewer-feedback", number: "09", icon: MessageSquareText },
  { label: "Final Interview Approval", path: "recruitment/final-interview-approval", number: "10", icon: BadgeCheck },
  { label: "Offer Management", path: "recruitment/offer-management", number: "11", icon: Handshake },
  { label: "Verification / BGV", path: "recruitment/verification-bgv", number: "12", icon: ShieldCheck },
  { label: "Joining", path: "recruitment/joining", number: "13", icon: UserRoundPlus },
];
