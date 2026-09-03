import { useState } from "react";

import {
  useCreateSeparationMutation,
  useUpdateSeparationMutation,
} from "../api/separationApi";

import { validateSeparationForm } from "../validations/separationValidation";

import type {
  SeparationEmployee,
  SeparationFormData,
} from "../types/separationTypes";

const INITIAL_FORM: SeparationFormData = {
  employeeId: "",
  separationDate: "",
  separationType: "",
  reason: "",
  remarks: "",
};

export const useSeparationForm = (
  employee?: SeparationEmployee,
  onSuccess?: () => void
) => {
  const [formData, setFormData] =
    useState<SeparationFormData>(
      employee
        ? {
            employeeId: employee.id,
            separationDate: employee.separationDate ?? "",
            separationType: employee.separationType ?? "",
            reason: "",
            remarks: "",
          }
        : INITIAL_FORM
    );

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [createSeparation, createState] =
    useCreateSeparationMutation();

  const [updateSeparation, updateState] =
    useUpdateSeparationMutation();

  const handleChange = (
    field: keyof SeparationFormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const submit = async () => {
    const validationErrors =
      validateSeparationForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors as Record<string, string>);
      return false;
    }

    try {
      if (employee) {
        await updateSeparation({
          id: employee.id,
          data: formData,
        }).unwrap();
      } else {
        await createSeparation(formData).unwrap();
      }

      onSuccess?.();

      return true;
    } catch {
      return false;
    }
  };

  const reset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    submit,
    reset,

    isSubmitting:
      createState.isLoading || updateState.isLoading,

    isSuccess:
      createState.isSuccess || updateState.isSuccess,
  };
};