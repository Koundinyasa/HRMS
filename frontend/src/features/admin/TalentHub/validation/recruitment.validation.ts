export interface JobOpeningFormValues {
  title: string;
  branchId: number;
  designationId: number;
  vacancies: number;
  salaryFrom: string;
  salaryTo: string;
  experienceRequired: string;
  priority: number | undefined;
}

export type JobOpeningValidationResult =
  | { valid: true; values: JobOpeningFormValues }
  | { valid: false; message: string };

export function validateJobOpening(
  formData: FormData,
): JobOpeningValidationResult {
  const values: JobOpeningFormValues = {
    title: String(formData.get("title") ?? "").trim(),
    branchId: Number(formData.get("branchId")),
    designationId: Number(formData.get("designationId")),
    vacancies: Number(formData.get("vacancies")),
    salaryFrom: String(formData.get("salaryFrom") ?? ""),
    salaryTo: String(formData.get("salaryTo") ?? ""),
    experienceRequired: String(
      formData.get("experienceRequired") ?? "",
    ).trim(),
    priority: formData.get("priority")
      ? Number(formData.get("priority"))
      : undefined,
  };

  if (
    !values.title ||
    !Number.isInteger(values.branchId) ||
    values.branchId <= 0 ||
    !Number.isInteger(values.designationId) ||
    values.designationId <= 0 ||
    !Number.isInteger(values.vacancies) ||
    values.vacancies < 1
  ) {
    return {
      valid: false,
      message: "Enter a job title, valid branch/designation IDs, and vacancies.",
    };
  }

  if (
    (values.salaryFrom &&
      (!Number.isFinite(Number(values.salaryFrom)) ||
        Number(values.salaryFrom) < 0)) ||
    (values.salaryTo &&
      (!Number.isFinite(Number(values.salaryTo)) ||
        Number(values.salaryTo) < 0)) ||
    (values.salaryFrom &&
      values.salaryTo &&
      Number(values.salaryTo) < Number(values.salaryFrom)) ||
    (values.priority !== undefined &&
      (!Number.isInteger(values.priority) || values.priority < 0))
  ) {
    return {
      valid: false,
      message: "Check salary range and priority values.",
    };
  }

  return { valid: true, values };
}
