export interface CircularFormData {
  circularName: string;
  description: string;
  filter: string;
  date: string;
  acknowledgementType: string;
  file: File | null;
}

export interface CircularValidationErrors {
  circularName?: string;
}

export const validateCircular = (
  formData: CircularFormData
): CircularValidationErrors => {
  const errors: CircularValidationErrors = {};

  if (!formData.circularName.trim()) {
    errors.circularName = "Field Required";
  }

  return errors;
};