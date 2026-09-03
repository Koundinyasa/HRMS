import type { Designation } from "../types/classificationTypes";

// Shown only as a fallback when the backend returns zero designations, so
// the screen matches the reference design out of the box. Once real rows
// exist in the database, useGetDesignationsQuery's data takes over and this
// is ignored. IDs start at 9000 to stay out of the way of real DB ids.
export const SEED_DESIGNATIONS: Designation[] = [
  { Id: 9001, DesignationName: "HR Recruiter" },
  { Id: 9002, DesignationName: "HR Executive" },
  { Id: 9003, DesignationName: "Software Trainee" },
  { Id: 9004, DesignationName: "Software Intern" },
  { Id: 9005, DesignationName: "Associate Software Engineer" },
  { Id: 9006, DesignationName: "Project Manager" },
  { Id: 9007, DesignationName: "Business Development Manager" },
  { Id: 9008, DesignationName: "Business Development Executive" },
  { Id: 9009, DesignationName: "UI/UX Designer" },
  { Id: 9010, DesignationName: "Data Analyst" },
  { Id: 9011, DesignationName: "React Developer" },
  { Id: 9012, DesignationName: "Senior Software Engineer" },
  { Id: 9013, DesignationName: "HR Manager" },
  { Id: 9014, DesignationName: "Flutter Developer" },
  { Id: 9015, DesignationName: "DevOps Engineer" },
];
