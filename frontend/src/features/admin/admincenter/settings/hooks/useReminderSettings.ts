import { useState } from "react";
import {
  useGetReminderByTypeQuery,
  useUpdateReminderMutation,
  useUpdateReminderStatusMutation,
  getApiErrorMessage,
} from "../api/settingsapi";
import type { ReminderSettings } from "../types/settingstypes";

const EMPTY = (type: string): ReminderSettings => ({
  type,
  daysBefore: 0,
  subject: "",
  body: "",
  applicability: { ess: false, hrms: false, sendMail: false, active: false },
});

/** Case-insensitive pick of first defined key on API objects */
export function pick(raw: any, keys: string[]): any {
  if (!raw || typeof raw !== "object") return undefined;
  for (const k of keys) {
    const hit = Object.keys(raw).find((rk) => rk.toLowerCase() === k.toLowerCase());
    if (hit !== undefined && raw[hit] !== null && raw[hit] !== undefined) return raw[hit];
  }
  return undefined;
}

  const [formData, setFormData] = useState<ReminderSettings>(EMPTY_REMINDER);
  const [previousReminder, setPreviousReminder] = useState<typeof reminder>();
  const [previousSelectedType, setPreviousSelectedType] =
    useState<ReminderType>();

  if (reminder !== previousReminder || selectedType !== previousSelectedType) {
    setPreviousReminder(reminder);
    setPreviousSelectedType(selectedType);
    if (reminder) {
      setFormData(reminder);
    } else {
      setFormData({ ...EMPTY_REMINDER, type: selectedType });
    }
  }

  // Load form when THIS type's data arrives. While refetching, keep previous
  // fields on screen so sidebar switch does not blank / shiver.
  useEffect(() => {
    if (reminder) {
      setFormData(mapFromApi(reminder, selectedType));
      return;
    }
    if (!isFetching) {
      setFormData(EMPTY(selectedType));
    }
  }, [reminder, selectedType, reminderTypeId, isFetching]);

  const toggleOption = (key: keyof ReminderSettings["applicability"]) =>
    setFormData((prev) => ({
      ...prev,
      applicability: { ...prev.applicability, [key]: !prev.applicability[key] },
    }));

  const handleSave = async (bodyOverride?: string) => {
    setMessage(null);
    if (reminderTypeId == null) return;

    // Only THIS ReminderTypeID is updated — never bulk-update other types
    const payload = {
      ReminderTypeID: reminderTypeId,
      ReminderBefore: Number(formData.daysBefore) || 0,
      FromEmail: String(pick(reminder, ["FromEmail", "fromEmail"]) ?? "noreply@company.com"),
      ToRecipient: String(pick(reminder, ["ToRecipient", "toRecipient"]) ?? "Employee"),
      CCRecipient:
        (pick(reminder, ["CCRecipient", "ccRecipient"]) as string | null) || undefined,
      IsESS: Boolean(formData.applicability.ess),
      IsHRMS: Boolean(formData.applicability.hrms),
      IsSendMail: Boolean(formData.applicability.sendMail),
      IsActive: Boolean(formData.applicability.active),
      TemplateName: String(
        pick(reminder, ["TemplateName", "templateName"]) ?? formData.type ?? "Reminder",
      ),
      Subject: formData.subject ?? "",
      Body: bodyOverride ?? formData.body ?? "",
    };

    try {
      await updateReminder(payload).unwrap();
      setMessage({ type: "success", text: "Saved successfully" });
      // Refresh only this type
      void refetch();
    } catch (err: any) {
      // Optional fallback: status-only if full update route missing
      if (err?.status === 404 || err?.status === 405) {
        try {
          await saveStatus({
            reminderTypeId,
            isActive: payload.IsActive,
          }).unwrap();
          setMessage({
            type: "error",
            text: getApiErrorMessage(
              err,
              "Could not save full reminder (update route failed). Is Active may have been saved only.",
            ),
          });
          void refetch();
          return;
        } catch (e2) {
          setMessage({
            type: "error",
            text: getApiErrorMessage(e2, "Failed to save reminder settings"),
          });
          return;
        }
      }
      setMessage({
        type: "error",
        text: getApiErrorMessage(err, "Failed to save reminder settings"),
      });
    }
  };

  const handleCancel = () => {
    setFormData(mapFromApi(reminder, selectedType));
    setMessage(null);
  };

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    loadError,
    loadErrorMessage,
    noData,
    message,
    toggleOption,
    handleSave,
    handleCancel,
  };
}
