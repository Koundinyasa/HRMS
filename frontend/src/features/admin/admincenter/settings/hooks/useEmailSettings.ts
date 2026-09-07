import { useEffect, useState } from "react";
import {
  useGetEmailTypesQuery,
  useGetEmailPayslipSettingsQuery,
  useUpdateEmailPayslipSettingsMutation,
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
  const { data: payslipSettings, isLoading } =
    useGetEmailPayslipSettingsQuery();
  const [updateEmailPayslipSettings, { isLoading: isSaving }] =
    useUpdateEmailPayslipSettingsMutation();

  const [type, setType] = useState("Pay Slip");
  const [subject, setSubject] = useState("Pay Slip for {monthyear}");
  const [body, setBody] = useState(DEFAULT_PAYSLIP_BODY);

  useEffect(() => {
    if (payslipSettings) {
      setSubject(payslipSettings.subject || "Pay Slip for {monthyear}");
      setBody(payslipSettings.body || DEFAULT_PAYSLIP_BODY);
    }
  }, [payslipSettings]);

  const handleSave = async () => {
    if (type !== "Pay Slip") {
      console.warn(`No save endpoint exists yet for email type "${type}"`);
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
    } catch (err) {
      console.error("Failed to save email settings", err);
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
    handleSave,
    handleReset,
    DEFAULT_PAYSLIP_BODY,
  };
}