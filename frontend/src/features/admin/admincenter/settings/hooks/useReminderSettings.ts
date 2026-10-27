




import { useEffect, useMemo, useState } from "react";

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

export const toBool = (v: any, fallback = false) =>
  v === undefined || v === null
    ? fallback
    : v === true || v === 1 || v === "1" || v === "true" || v === "Y";

function toReminder(res: any): any | null {
  if (res === null || res === undefined) return null;
  if (Array.isArray(res)) return res[0] ?? null;
  if (typeof res === "object") {
    for (const key of ["data", "reminders", "recordset", "result"]) {
      if (res[key] !== undefined && res[key] !== null) {
        return Array.isArray(res[key]) ? res[key][0] ?? null : res[key];
      }
    }
    // Bare number/string from inactive SP → not usable form data
    if (typeof res === "object" && Object.keys(res).length === 0) return null;
    // Prefer objects that look like a reminder row
    if (pick(res, ["ReminderTypeID", "reminderTypeId", "Subject", "subject", "IsActive", "isActive"]) !== undefined) {
      return res;
    }
    return Object.keys(res).length ? res : null;
  }
  return null;
}

function mapFromApi(raw: any, type: string): ReminderSettings {
  if (!raw) return EMPTY(type);
  return {
    type,
    daysBefore: Number(pick(raw, ["reminderBefore", "daysBefore", "ReminderBefore"]) ?? 0) || 0,
    subject: String(pick(raw, ["subject", "emailSubject", "Subject"]) ?? ""),
    body: String(pick(raw, ["body", "emailBody", "Body"]) ?? ""),
    applicability: {
      ess: toBool(pick(raw, ["isESS", "IsESS", "ess"])),
      hrms: toBool(pick(raw, ["isHRMS", "IsHRMS", "hrms"])),
      sendMail: toBool(pick(raw, ["isSendMail", "IsSendMail", "sendMail"])),
      active: toBool(pick(raw, ["isActive", "IsActive", "active"]), true),
    },
  };
}

/**
 * One reminder type at a time (selectedId from sidebar).
 * Save → PUT admin/setting/update with that ReminderTypeID only (not all types).
 */
export function useReminderSettings(reminderTypeId: number | null) {
  const selectedType = String(reminderTypeId ?? "");

  const { currentData, error, isFetching, isError, refetch } = useGetReminderByTypeQuery(
    reminderTypeId ?? 0,
    { skip: reminderTypeId == null },
  );

  const [updateReminder, { isLoading: isUpdating }] = useUpdateReminderMutation();
  const [saveStatus, { isLoading: isSavingStatus }] = useUpdateReminderStatusMutation();
  const isSaving = isUpdating || isSavingStatus;

  const reminder = useMemo(() => toReminder(currentData), [currentData]);
  const exists = !!reminder;

  const status = (error as any)?.status;
  const notFound = isError && status === 404;
  const realLoadError = isError && !notFound;
  const loadErrorMessage = realLoadError
    ? getApiErrorMessage(error, "Could not load this reminder from the server")
    : "";
  const loadError = realLoadError;

  // Soft loading: don't treat cache miss on switch as a full blank-screen load
  const isLoading = reminderTypeId != null && isFetching && !currentData && !reminder;
  const noData = !isFetching && !loadError && !exists;

  const [formData, setFormData] = useState<ReminderSettings>(EMPTY(selectedType));
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Clear toast when switching sidebar item
  useEffect(() => {
    setMessage(null);
  }, [reminderTypeId]);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), 4000);
    return () => window.clearTimeout(t);
  }, [message]);

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
