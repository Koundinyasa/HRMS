


import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, Loader2, X } from "lucide-react";

import { useAddReminderMutation, getApiErrorMessage } from "../api/settingsapi";

export interface AddReminderInputValues {
  code: string;
  displayName: string;
  shortLabel: string;
  sortOrder: number;
}











import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddReminderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (result: AddReminderResult) => void;
  /** Reminders already in the list - used to block duplicates before sending. */
  existing?: { code: string; label: string }[];
  /**
   * Called after a failed save: reloads the list and tells whether this reminder
   * is now there (the server sometimes saves the row but returns no confirmation).
   */
  checkExists?: (code: string, name: string) => Promise<boolean>;
}

export default function AddReminderModal({ open, onClose }: AddReminderModalProps) {
  const [reminderName, setReminderName] = useState("");
  const [reminderType, setReminderType] = useState("Birthday");
  const [days, setDays] = useState("7");
  const [previousOpen, setPreviousOpen] = useState<boolean | undefined>();

  if (open !== previousOpen) {
    setPreviousOpen(open);
    if (!open) {
      setReminderName("");
      setReminderType("Birthday");
      setDays("7");
    }
  }

  function handleSave() {
    if (!reminderName.trim()) {
      alert("Please enter reminder name");
      return;
    }
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  // Lock page scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, isLoading]);

  const previewName = useMemo(() => form.displayName.trim() || "New reminder", [form.displayName]);

  const update = (key: FormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    setServerError("");
  };

  const onDisplayName = (value: string) => {
    setForm((prev) => ({
      ...prev,
      displayName: value,
      code: codeTouched ? prev.code : toCode(value),
      shortLabel: labelTouched ? prev.shortLabel : value.trim().slice(0, SHORT_LABEL_MAX),
    }));
    setErrors((prev) => ({ ...prev, displayName: undefined, code: undefined, shortLabel: undefined }));
    setServerError("");
  };

  function validate(): Errors {
    const e: Errors = {};
    if (!form.displayName.trim()) e.displayName = "Enter a name for this reminder.";
    if (!form.code.trim()) e.code = "Enter a code, e.g. work_from_home_expiry.";
    if (!form.shortLabel.trim()) e.shortLabel = "Enter a short label.";
    const code = form.code.trim().toLowerCase();
    const name = form.displayName.trim().toLowerCase();
    if (code && existing.some((x) => x.code && x.code.toLowerCase() === code)) {
      e.code = "A reminder with this code already exists.";
    }
    if (name && existing.some((x) => x.label.toLowerCase() === name)) {
      e.displayName = "A reminder with this name already exists.";
    }
    const days = Number(form.reminderBefore);
    if (form.reminderBefore.trim() === "" || !Number.isInteger(days) || days < 0 || days > 365) {
      e.reminderBefore = "Enter a whole number of days from 0 to 365.";
    }
    const from = form.fromEmail.trim();
    if (!from) e.fromEmail = "Enter the sender email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) e.fromEmail = "Enter a valid email address.";
    else if (from.length > 100) e.fromEmail = "Use 100 characters or fewer.";
    const to = form.toRecipient.trim();
    if (!to) e.toRecipient = "Enter who receives this email.";
    else if (to.length > 100) e.toRecipient = "Use 100 characters or fewer.";
    if (!form.subject.trim()) e.subject = "Enter the email subject.";
    if (!form.body.trim()) e.body = "Enter the email body.";
    return e;
  }

  async function handleSave() {
    setServerError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    const input: AddReminderInputValues = {
      code: form.code.trim(),
      displayName: form.displayName.trim(),
      shortLabel: form.shortLabel.trim(),
      sortOrder: Number(form.sortOrder) || 0,
    };

    // Payload for POST admin/setting/reminder.
    // templateName is optional in AddReminderInput but the reminder table stores one
    // per type (the update route sends it too), so send it instead of leaving it empty.
    const payload = {
      ...input,
      templateName: input.displayName,
      // The insert writes a NOT NULL ReminderBefore column, so it must be sent
      reminderBefore: Number(form.reminderBefore) || 0,
      // Required by the backend validation (AddReminderDto)
      fromEmail: form.fromEmail.trim(),
      toRecipient: form.toRecipient.trim(),
      subject: form.subject.trim(),
      body: form.body.trim(),
    };

    let response: any;
    try {
      response = await addReminder(payload).unwrap();
    } catch (err) {
      // Full detail in the browser console: Network tab -> admin/setting/reminder -> Response
      console.error("[AddReminder] request failed", { payload, err });
      const e = err as { status?: number | string; data?: any };
      const base = getApiErrorMessage(err, "Could not add the reminder. Please try again.");
      const raw =
        e?.data && typeof e.data === "object" ? JSON.stringify(e.data) : typeof e?.data === "string" ? e.data : "";
      // Show the server's raw reply when it is more specific than the headline message
      // The server may have saved the row and only failed to confirm it. Reload the list:
      // if the reminder is there now, treat it as added.
      let savedAnyway = false;
      try {
        savedAnyway = checkExists ? await checkExists(input.code, input.displayName) : false;
      } catch {
        savedAnyway = false;
      }
      if (savedAnyway) {
        onSuccess?.({ response: null, input });
        onClose();
        return;
      }
      setServerError(raw && !base.includes(raw) && raw.length < 300 ? `${base} Server said: ${raw}` : base);
      return;
    }

    // Success - a problem in the parent's handler must never look like a failed save
    try {
      onSuccess?.({ response, input });
    } catch (e) {
      console.error("[AddReminder] onSuccess handler threw", e);
    }
    onClose();
  }

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-reminder-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
      className="fixed inset-0 flex items-end justify-center bg-[#131313]/55 backdrop-blur-[2px] sm:items-center sm:p-6"
      style={{ zIndex: 2147483647, fontFamily: "'Urbanist', sans-serif" }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="flex max-h-[94dvh] w-full max-w-[640px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_30px_80px_-20px_rgba(30,15,90,0.45)] sm:max-h-[calc(100dvh-48px)] sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-[#EEEAFB] px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ECE7FF] text-[#5932E9]">
            <Bell className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="add-reminder-title" className="text-lg font-bold leading-6 text-[#131313] sm:text-xl">
              Add reminder
            </h2>
            <p className="mt-0.5 text-[13px] leading-5 text-[#6B6B6B]">
              Create a new reminder type with its email template. It appears in the Reminders list right away.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
            className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#626262] transition hover:bg-[#F3F0FF] hover:text-[#5932E9] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ECE7FF] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
          {serverError && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-[#FAD5D1] bg-[#FEF2F2] px-3.5 py-3 text-[13px] font-medium text-[#DD3232]"
            >
              {serverError}
            </div>
          )}

          <section className="space-y-4">
            <Field label="Display name" htmlFor="rem-name" error={errors.displayName}>
              <input
                id="rem-name"
                ref={firstFieldRef}
                value={form.displayName}
                onChange={(e) => onDisplayName(e.target.value)}
                placeholder="e.g. Work From Home Expiry"
                autoComplete="off"
                className={`${fieldBase} h-12 sm:h-11 ${errors.displayName ? fieldBad : fieldOk}`}
              />
            </Field>

            {/* Live preview of the sidebar entry */}
            <div className="flex items-center gap-2 rounded-xl bg-[#F9F7FF] px-3 py-2.5">
              <span className="text-xs text-[#7A7A7A]">Shown in the list as</span>
              <span className="flex min-w-0 items-center gap-2 rounded-lg bg-[#ECE7FF] px-2.5 py-1.5 text-sm font-semibold text-[#5932E9]">
                <Bell className="h-4 w-4 shrink-0" />
                <span className="truncate">{previewName}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Code"
                htmlFor="rem-code"
                error={errors.code}
                hint="Filled in from the name. Lowercase letters, numbers and _ only."
              >
                <input
                  id="rem-code"
                  value={form.code}
                  onChange={(e) => {
                    setCodeTouched(true);
                    update("code", toCode(e.target.value));
                  }}
                  placeholder="work_from_home_expiry"
                  autoComplete="off"
                  spellCheck={false}
                  className={`${fieldBase} h-12 font-mono text-[14px] sm:h-11 sm:text-[13px] ${errors.code ? fieldBad : fieldOk}`}
                />
              </Field>

              <Field
                label="Short label"
                htmlFor="rem-short"
                error={errors.shortLabel}
                counter={`${form.shortLabel.length}/${SHORT_LABEL_MAX}`}
                hint="Used where space is tight, like mobile."
              >
                <input
                  id="rem-short"
                  value={form.shortLabel}
                  onChange={(e) => {
                    setLabelTouched(true);
                    update("shortLabel", e.target.value.slice(0, SHORT_LABEL_MAX));
                  }}
                  maxLength={SHORT_LABEL_MAX}
                  placeholder="WFH Expiry"
                  autoComplete="off"
                  className={`${fieldBase} h-12 sm:h-11 ${errors.shortLabel ? fieldBad : fieldOk}`}
                />
              </Field>

              <Field
                label="Sort order"
                htmlFor="rem-sort"
                hint="Lower numbers appear higher in the list."
              >
                <input
                  id="rem-sort"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => update("sortOrder", e.target.value)}
                  className={`${fieldBase} h-12 sm:h-11 ${fieldOk}`}
                />
              </Field>
            </div>
          </section>

          <div className="my-6 h-px bg-[#EEEAFB]" />

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#131313]">Email template</h3>
              <p className="mt-0.5 text-xs text-[#7A7A7A]">
                Default message for this reminder. You can format it later from the Reminders screen.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Remind before (days)"
                htmlFor="rem-before"
                error={errors.reminderBefore}
                hint="How many days ahead the email is sent. Use 0 for the same day."
              >
                <input
                  id="rem-before"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={365}
                  value={form.reminderBefore}
                  onChange={(e) => update("reminderBefore", e.target.value)}
                  className={`${fieldBase} h-12 sm:h-11 ${errors.reminderBefore ? fieldBad : fieldOk}`}
                />
              </Field>
              <div className="hidden sm:block" />

              <Field
                label="From email"
                htmlFor="rem-from"
                error={errors.fromEmail}
                hint="Sender address shown on the email."
              >
                <input
                  id="rem-from"
                  type="email"
                  inputMode="email"
                  value={form.fromEmail}
                  onChange={(e) => update("fromEmail", e.target.value)}
                  placeholder="hr@yourcompany.com"
                  autoComplete="off"
                  maxLength={100}
                  className={`${fieldBase} h-12 sm:h-11 ${errors.fromEmail ? fieldBad : fieldOk}`}
                />
              </Field>

              <Field
                label="To recipient"
                htmlFor="rem-to"
                error={errors.toRecipient}
                hint="Who receives it, e.g. Employee."
              >
                <input
                  id="rem-to"
                  value={form.toRecipient}
                  onChange={(e) => update("toRecipient", e.target.value)}
                  placeholder="Employee"
                  autoComplete="off"
                  maxLength={100}
                  className={`${fieldBase} h-12 sm:h-11 ${errors.toRecipient ? fieldBad : fieldOk}`}
                />
              </Field>
            </div>

            <Field label="Subject" htmlFor="rem-subject" error={errors.subject}>
              <input
                id="rem-subject"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="e.g. Your work from home approval expires soon"
                autoComplete="off"
                className={`${fieldBase} h-12 sm:h-11 ${errors.subject ? fieldBad : fieldOk}`}
              />
            </Field>

            <Field label="Body" htmlFor="rem-body" error={errors.body}>
              <textarea
                id="rem-body"
                value={form.body}
                onChange={(e) => update("body", e.target.value)}
                rows={6}
                placeholder="Write the message employees will receive."
                className={`${fieldBase} min-h-[140px] resize-y py-3 leading-relaxed ${errors.body ? fieldBad : fieldOk}`}
              />
            </Field>
          </section>
        </div>

        {/* Footer */}
        <div
          className="flex flex-col-reverse gap-3 border-t border-[#EEEAFB] bg-[#FBFAFF] px-5 py-4 sm:flex-row sm:justify-end sm:px-7"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-12 w-full rounded-xl border border-[#131313] bg-white px-5 text-sm font-semibold text-[#131313] transition hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ECE7FF] disabled:opacity-50 sm:h-11 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5932E9] px-6 text-sm font-semibold text-white transition hover:bg-[#4726BA] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ECE7FF] disabled:cursor-not-allowed disabled:opacity-70 sm:h-11 sm:w-auto"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Adding..." : "Add reminder"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}