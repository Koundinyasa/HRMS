export type CandidateFormValues = {
  name: string;
  email: string;
  mobile: string;
  joiningDate: string;
  designation: string;
  employeeId: string;
  reportingTo: string;
};

export type CandidateFormErrors = Partial<Record<keyof CandidateFormValues, string>>;

export const validateCandidateForm = (
  values: CandidateFormValues,
): CandidateFormErrors => {
  const errors: CandidateFormErrors = {};

  if (!values.name?.trim()) {
    errors.name = "Candidate name is required.";
  }

  if (!values.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.mobile?.trim()) {
    errors.mobile = "Mobile number is required.";
  } else if (!/^[0-9+\-\s()]{10,15}$/.test(values.mobile)) {
    errors.mobile = "Enter a valid mobile number.";
  }

  if (!values.joiningDate?.trim()) {
    errors.joiningDate = "Joining date is required.";
  }

  if (!values.designation?.trim()) {
    errors.designation = "Designation is required.";
  }

  if (!values.employeeId?.trim()) {
    errors.employeeId = "Employee ID is required.";
  }

  if (!values.reportingTo?.trim()) {
    errors.reportingTo = "Reporting manager is required.";
  }

  return errors;
};

