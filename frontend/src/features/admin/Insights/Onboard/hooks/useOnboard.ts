


import { useMemo, useState } from "react";

import type {
  OnboardEmployee,
  OnboardFilters,
} from "../types/onboard.types";

const BASE_EMPLOYEES: OnboardEmployee[] = [
  {
    id: 1,
    employeeId: "294769",
    employeeName: "Pavankumar Reddy",
    dateOfJoining: "01-07-2026",
    designation: "Software Engineer",
    branch: "Hyderabad",
    status: "Current",
  },
  {
    id: 2,
    employeeId: "294725",
    employeeName: "Kavya Devada",
    dateOfJoining: "03-07-2026",
    designation: "HR Executive",
    branch: "Hyderabad",
    status: "Current",
  },
  {
    id: 3,
    employeeId: "294711",
    employeeName: "PAVAN KUMAR RAMIREDDYGARI",
    dateOfJoining: "07-07-2026",
    designation: "Software Engineer",
    branch: "Bengaluru",
    status: "Current",
  },
  {
    id: 4,
    employeeId: "294625",
    employeeName: "Naveen Penaganti",
    dateOfJoining: "08-07-2026",
    designation: "Associate Software Engineer",
    branch: "Hyderabad",
    status: "Current",
  },
  {
    id: 5,
    employeeId: "294644",
    employeeName: "Karicheti Venkata Suresh Babu",
    dateOfJoining: "10-07-2026",
    designation: "QA Engineer",
    branch: "Hyderabad",
    status: "Current",
  },
  {
    id: 6,
    employeeId: "294701",
    employeeName: "Rahul Kumar",
    dateOfJoining: "12-07-2026",
    designation: "Software Engineer",
    branch: "Hyderabad",
    status: "Current",
  },
  {
    id: 7,
    employeeId: "294712",
    employeeName: "Anusha Reddy",
    dateOfJoining: "15-07-2026",
    designation: "UI Developer",
    branch: "Bengaluru",
    status: "Current",
  },
  {
    id: 8,
    employeeId: "294733",
    employeeName: "Sandeep Kumar",
    dateOfJoining: "18-07-2026",
    designation: "QA Engineer",
    branch: "Hyderabad",
    status: "Current",
  },
];

const GENERATED_NAMES = [
  "Ravi Kumar",
  "Srinivas Reddy",
  "Anil Kumar",
  "Priya Sharma",
  "Sneha Reddy",
  "Vamsi Krishna",
  "Harish Kumar",
  "Deepika Reddy",
  "Kiran Kumar",
  "Swathi Rao",
];

const DESIGNATIONS = [
  "Software Engineer",
  "HR Executive",
  "Associate Software Engineer",
  "QA Engineer",
  "UI Developer",
];

const BRANCHES = [
  "Hyderabad",
  "Bengaluru",
];

function createEmployees(): OnboardEmployee[] {
  const employees = [...BASE_EMPLOYEES];

  for (
    let index = BASE_EMPLOYEES.length + 1;
    index <= 359;
    index++
  ) {
    employees.push({
      id: index,
      employeeId: String(
        294700 + index,
      ),
      employeeName: `${
        GENERATED_NAMES[
          index % GENERATED_NAMES.length
        ]
      } ${index}`,
      dateOfJoining: "01-08-2026",
      designation:
        DESIGNATIONS[
          index % DESIGNATIONS.length
        ],
      branch:
        BRANCHES[index % BRANCHES.length],
      status: "Current",
    });
  }

  return employees;
}

const MOCK_EMPLOYEES = createEmployees();

const INITIAL_FILTERS: OnboardFilters = {
  search: "",
  branch: "",
  designation: "",
  employeeStatus: "",
};

export function useOnboard() {
  const [filters, setFilters] =
    useState<OnboardFilters>(
      INITIAL_FILTERS,
    );

  const filteredEmployees = useMemo(() => {
    const search =
      filters.search
        .trim()
        .toLowerCase();

    return MOCK_EMPLOYEES.filter(
      (employee) => {
        const matchesSearch =
          !search ||
          employee.employeeId
            .toLowerCase()
            .includes(search) ||
          employee.employeeName
            .toLowerCase()
            .includes(search);

        const matchesBranch =
          !filters.branch ||
          employee.branch ===
            filters.branch;

        const matchesDesignation =
          !filters.designation ||
          employee.designation ===
            filters.designation;

        const matchesStatus =
          !filters.employeeStatus ||
          employee.status ===
            filters.employeeStatus;

        return (
          matchesSearch &&
          matchesBranch &&
          matchesDesignation &&
          matchesStatus
        );
      },
    );
  }, [filters]);

  const updateFilter = (
    key: keyof OnboardFilters,
    value: string,
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return {
    employees: filteredEmployees,
    totalEmployees:
      MOCK_EMPLOYEES.length,
    filters,
    updateFilter,
    resetFilters,
  };
}