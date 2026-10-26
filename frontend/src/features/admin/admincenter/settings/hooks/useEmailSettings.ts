import { useState } from "react";
import {
  useGetEmailTypesQuery,
  useGetEmailPayslipSettingsQuery,
  useUpdateEmailPayslipSettingsMutation,
  getApiErrorMessage,
} from "../api/settingsapi";

const DEFAULT_PAYSLIP_BODY = `
  <p>Dear {empname},</p>
  <p><strong>Greetings!!</strong></p>
  <p>
  Please find the attached Payslip for the month of
  <strong>{monthyear}</strong>
  </p>
  <p>
  Salary has been credited to your account.
  </p>
  <p>Regards,</p>
  <p><strong>{companyname}</strong></p>
`;

export function useEmailSettings() {
  const { data: emailTypes } = useGetEmailTypesQuery();
  const {
    data: payslipSettings,
    isLoading,
    isError: loadError,
  } = useGetEmailPayslipSettingsQuery();
  const [updateEmailPayslipSettings, { isLoading: isSaving }] =
    useUpdateEmailPayslipSettingsMutation();

  const [type, setType] = useState("Pay Slip");
  const [subject, setSubject] = useState("Pay Slip for {monthyear}");
  const [body, setBody] = useState(DEFAULT_PAYSLIP_BODY);
  const [previousPayslipSettings, setPreviousPayslipSettings] = useState<
    typeof payslipSettings
  >();

  if (payslipSettings && payslipSettings !== previousPayslipSettings) {
    setPreviousPayslipSettings(payslipSettings);
    setSubject(payslipSettings.subject || "Pay Slip for {monthyear}");
    setBody(payslipSettings.body || DEFAULT_PAYSLIP_BODY);
  }

  const handleSave = async () => {
    if (type !== "Pay Slip") {
      setMessage({
        type: "error",
        text: `Saving is not available yet for "${type}".`,
      });
      return;
    }

    try {
      await updateEmailPayslipSettings({
        enabled: payslipSettings?.enabled ?? true,
        sendOnDay: payslipSettings?.sendOnDay ?? 1,
        ccHr: payslipSettings?.ccHr ?? false,
        templateId: payslipSettings?.templateId ?? "default",
        subject,
        body,
      }).unwrap();
      setMessage({ type: "success", text: "Email settings saved." });
    } catch (err) {
      console.error("Failed to save email settings", err);
      setMessage({
        type: "error",
        text: getApiErrorMessage(err, "Failed to save email settings"),
      });
    }
  };

  const handleReset = () => {
    setSubject("Pay Slip for {monthyear}");
    setBody(DEFAULT_PAYSLIP_BODY);
  };

  return {
    emailTypes,
    type,
    setType,
    subject,
    setSubject,
    body,
    setBody,
    isLoading,
    isSaving,
    loadError,
    message,
    handleSave,
    handleReset,
    DEFAULT_PAYSLIP_BODY,
  };
}