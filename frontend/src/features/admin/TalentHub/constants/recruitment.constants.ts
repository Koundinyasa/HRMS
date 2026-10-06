import type {
  Approval,
  ApprovalStatus,
  Candidate,
  CandidateStage,
  JobOpening,
} from "../types/recruitment.types";

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Rohan Das",
    role: "Sales Executive",
    stage: "Applied",
    rating: 3,
    daysInStage: 0,
  },
  {
    id: 2,
    name: "Aisha Khan",
    role: "Product Designer",
    stage: "Applied",
    rating: 4,
    daysInStage: 1,
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "HR Business Partner",
    stage: "Applied",
    rating: 3,
    daysInStage: 0,
  },
  {
    id: 4,
    name: "Karthik Iyer",
    role: "Senior Backend Engineer",
    stage: "Applied",
    rating: 4,
    daysInStage: 0,
  },
  {
    id: 5,
    name: "Meera Nair",
    role: "Senior Backend Engineer",
    stage: "Screening",
    rating: 4,
    daysInStage: 4,
  },
  {
    id: 6,
    name: "Vikram Singh",
    role: "Sales Executive",
    stage: "Screening",
    rating: 3,
    daysInStage: 2,
  },
  {
    id: 7,
    name: "Divya Menon",
    role: "Product Designer",
    stage: "Screening",
    rating: 4,
    daysInStage: 3,
  },
  {
    id: 8,
    name: "Arjun Mehta",
    role: "Senior Backend Engineer",
    stage: "Interview",
    rating: 4,
    daysInStage: 3,
  },
  {
    id: 9,
    name: "Sana Iqbal",
    role: "Product Designer",
    stage: "Interview",
    rating: 5,
    daysInStage: 1,
  },
  {
    id: 10,
    name: "Kavya Reddy",
    role: "HR Business Partner",
    stage: "Offer",
    rating: 5,
    daysInStage: 2,
  },
  {
    id: 11,
    name: "Farhan Ali",
    role: "Sales Executive",
    stage: "Offer",
    rating: 4,
    daysInStage: 1,
  },
  {
    id: 12,
    name: "Nisha Rao",
    role: "Product Designer",
    stage: "Hired",
    rating: 5,
    daysInStage: 0,
  },
];

export const INITIAL_OPENINGS: JobOpening[] = [
  {
    id: 1,
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Hyderabad",
    type: "Full-time",
    applicants: 84,
    positions: 3,
    positionsFilled: 1,
    status: "Open",
    posted: "12 Sep",
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "Bengaluru / Remote",
    type: "Full-time",
    applicants: 52,
    positions: 2,
    positionsFilled: 0,
    status: "Open",
    posted: "18 Sep",
  },
  {
    id: 3,
    title: "HR Business Partner",
    department: "People",
    location: "Hyderabad",
    type: "Full-time",
    applicants: 31,
    positions: 1,
    positionsFilled: 0,
    status: "Open",
    posted: "05 Sep",
  },
  {
    id: 4,
    title: "Sales Executive",
    department: "Sales",
    location: "Pune",
    type: "Full-time",
    applicants: 67,
    positions: 5,
    positionsFilled: 2,
    status: "Open",
    posted: "28 Aug",
  },
  {
    id: 5,
    title: "Data Analyst",
    department: "Finance",
    location: "Hyderabad",
    type: "Full-time",
    applicants: null,
    positions: 2,
    positionsFilled: 0,
    status: "Pending approval",
    posted: "—",
  },
  {
    id: 6,
    title: "Customer Success Manager",
    department: "Sales",
    location: "Bengaluru",
    type: "Full-time",
    applicants: null,
    positions: 1,
    positionsFilled: 0,
    status: "Pending approval",
    posted: "—",
  },
  {
    id: 7,
    title: "UX Researcher",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    applicants: null,
    positions: 1,
    positionsFilled: 0,
    status: "Sent back",
    posted: "—",
  },
  {
    id: 8,
    title: "Payroll Specialist",
    department: "Finance",
    location: "Hyderabad",
    type: "Full-time",
    applicants: null,
    positions: 1,
    positionsFilled: 0,
    status: "Draft",
    posted: "—",
  },
  {
    id: 9,
    title: "QA Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    applicants: 23,
    positions: 1,
    positionsFilled: 0,
    status: "On hold",
    posted: "20 Aug",
  },
];

export const OPENING_DEPARTMENTS = [
  "All",
  "Engineering",
  "Design",
  "People",
  "Sales",
  "Finance",
] as const;

export const STAGES: {
  name: CandidateStage;
  color: string;
  dot: string;
}[] = [
  { name: "Applied", color: "#91a09a", dot: "bg-[#91a09a]" },
  { name: "Screening", color: "#3b6cae", dot: "bg-[#3b6cae]" },
  { name: "Interview", color: "#805cb6", dot: "bg-[#805cb6]" },
  { name: "Offer", color: "#e8a537", dot: "bg-[#e8a537]" },
  { name: "Hired", color: "#318365", dot: "bg-[#318365]" },
];

export const INTERVIEWS = [
  {
    name: "Arjun Mehta",
    round: "System design",
    duration: "60 min",
    time: "10:00",
    interviewers: ["Rakesh Kumar", "Sana Verma"],
  },
  {
    name: "Divya Menon",
    round: "Screening call",
    duration: "30 min",
    time: "11:30",
    interviewers: ["Rakesh Kumar"],
  },
  {
    name: "Sana Iqbal",
    round: "Portfolio review",
    duration: "45 min",
    time: "14:00",
    interviewers: ["Ananya Patel", "Rakesh Kumar", "Jay Mehta"],
  },
  {
    name: "Vikram Singh",
    round: "Manager round",
    duration: "45 min",
    time: "16:30",
    interviewers: ["Neha Bansal"],
  },
];

export const FEEDBACK_TASKS = [
  "Submit scorecard for Arjun Mehta, system design round",
  "Review portfolio from Sana Iqbal before panel",
  "Approve offer draft for Kavya Reddy",
  "Share rejection note with 4 screened-out applicants",
];

export const INITIAL_APPROVALS: Approval[] = [
  {
    id: 1,
    openingId: 5,
    title: "Data Analyst",
    department: "Finance",
    location: "Hyderabad",
    requestedBy: "Riya Kapoor",
    requestedDate: "26 Sep",
    positions: 2,
    reason: "New headcount",
    salaryBand: "₹10–16 LPA",
    targetJoining: "15 Dec 2026",
    justification:
      "Month-end reporting takes six working days. Two analysts would bring it under two.",
    jobDescription: "",
    status: "waiting",
    chain: [
      {
        name: "Riya Kapoor",
        role: "Submitted for approval",
        status: "submitted",
        date: "26 Sep",
      },
      {
        name: "Lakshmi Iyer",
        role: "Hiring manager",
        status: "approved",
        date: "27 Sep",
        note: "Needed before FY27 planning starts.",
      },
      { name: "Nandini Bose", role: "HR head", status: "reviewing" },
      { name: "Jatin Malhotra", role: "Finance controller", status: "waiting" },
    ],
  },
  {
    id: 2,
    openingId: 6,
    title: "Customer Success Manager",
    department: "Sales",
    location: "Bengaluru",
    requestedBy: "Rahul Bhatt",
    requestedDate: "29 Sep",
    positions: 1,
    reason: "Replacement",
    salaryBand: "₹14–20 LPA",
    targetJoining: "20 Nov 2026",
    justification:
      "Backfill for Shreya M, who moved to the partnerships team. Six enterprise accounts are without an owner.",
    jobDescription: "",
    status: "waiting",
    chain: [
      {
        name: "Rahul Bhatt",
        role: "Submitted for approval",
        status: "submitted",
        date: "29 Sep",
      },
      { name: "Rahul Bhatt", role: "Hiring manager", status: "reviewing" },
      { name: "Nandini Bose", role: "HR head", status: "waiting" },
      { name: "Jatin Malhotra", role: "Finance controller", status: "waiting" },
    ],
  },
  {
    id: 3,
    openingId: 7,
    title: "UX Researcher",
    department: "Design",
    location: "Remote",
    requestedBy: "Anjali Pillai",
    requestedDate: "22 Sep",
    positions: 1,
    reason: "New headcount",
    salaryBand: "₹16–22 LPA",
    targetJoining: "1 Dec 2026",
    justification:
      "We run studies through an agency today. Bringing research in-house costs less from month five.",
    jobDescription: "",
    status: "sent-back",
    chain: [
      {
        name: "Anjali Pillai",
        role: "Submitted for approval",
        status: "submitted",
        date: "22 Sep",
      },
      {
        name: "Anjali Pillai",
        role: "Hiring manager",
        status: "approved",
        date: "23 Sep",
      },
      {
        name: "Nandini Bose",
        role: "HR head",
        status: "sent-back",
        date: "24 Sep",
        note: "The band is above the Design grid for this level. Revise to 14–19 and resubmit.",
      },
      { name: "Jatin Malhotra", role: "Finance controller", status: "waiting" },
    ],
  },
];

export const APPROVAL_TABS: { status: ApprovalStatus; label: string }[] = [
  { status: "waiting", label: "Waiting on approvers" },
  { status: "ready", label: "Ready to publish" },
  { status: "sent-back", label: "Sent back" },
];

export const APPROVAL_CHAIN_BY_DEPARTMENT: Record<string, string> = {
  Engineering: "Suresh Varma",
  Design: "Anjali Pillai",
  People: "Lakshmi Iyer",
  Sales: "Rahul Bhatt",
  Finance: "Lakshmi Iyer",
};

export const JOB_DEPARTMENTS = [
  "Engineering",
  "Design",
  "People",
  "Sales",
  "Finance",
];
export const JOB_LOCATIONS = ["Hyderabad", "Bengaluru", "Pune", "Remote"];

export const avatarColors = [
  "#a8782e",
  "#8060b8",
  "#bd4b3d",
  "#3b6cae",
  "#4d8792",
  "#318365",
];

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const formInputClass =
  "h-10 w-full rounded-lg border border-[#dce4de] bg-[#f8faf8] px-3 text-sm outline-none focus:border-[#537b65] focus:ring-2 focus:ring-[#537b65]/15";
