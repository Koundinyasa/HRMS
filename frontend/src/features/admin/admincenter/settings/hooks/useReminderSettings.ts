import { useEffect, useState } from "react";
import {
  useGetReminderByTypeQuery,
  useUpdateReminderByTypeMutation,
} from "../api/settingsapi";
import type {
  ReminderType,
  ReminderSettings,
} from "../types/settingstypes";

const EMPTY_REMINDER: ReminderSettings = {
  type: "birthday",
  daysBefore: 7,
  subject: "Happy Birthday {{EmployeeName}}",
  body: "",
  applicability: {
    ess: true,
    hrms: true,
    sendMail: true,
    active: true,
  },
};

export function useReminderSettings(selectedType: ReminderType) {
  const { data: reminder, isLoading } =
    useGetReminderByTypeQuery(selectedType);
  const [updateReminderByType, { isLoading: isSaving }] =
    useUpdateReminderByTypeMutation();

  const [formData, setFormData] = useState<ReminderSettings>(EMPTY_REMINDER);

  useEffect(() => {
    if (reminder) {
      setFormData(reminder);
    } else {
      setFormData({ ...EMPTY_REMINDER, type: selectedType });
    }
  }, [reminder, selectedType]);

  const toggleOption = (key: keyof ReminderSettings["applicability"]) => {
    setFormData((prev) => ({
      ...prev,
      applicability: {
        ...prev.applicability,
        [key]: !prev.applicability[key],
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updateReminderByType({
        type: selectedType,
        body: formData,
      }).unwrap();
    } catch (err) {
      console.error("Failed to save reminder settings", err);
    }
  };

  const handleCancel = () => {
    if (reminder) setFormData(reminder);
  };

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    toggleOption,
    handleSave,
    handleCancel,
  };
}