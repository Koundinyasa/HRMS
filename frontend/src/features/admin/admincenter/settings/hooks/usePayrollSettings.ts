import { useEffect, useState } from "react";
import {
  useGetPayrollDetailsQuery,
  useUpdatePayrollDetailsMutation,
} from "../api/settingsapi";
import type { PayrollSettings } from "../types/settingstypes";

const EMPTY_PAYROLL: PayrollSettings = {
  payCycleDate: "1",
  companyRoleCreation: false,
  effectiveFrom: "Feb/2026",
  holidayDefinedOn: "None",
  weeklyHoliday: "None",
  salaryRoundOff: "Nearest Amount",
  retirementAge: "58",
  customPayslip: false,
  modules: {
    attendance: true,
    loan: false,
    insurance: false,
    advance: false,
    arrear: false,
    bonus: false,
    reimbursement: false,
    disbursement: false,
    costCenter: false,
    additionalSalary: false,
    attendanceIntegration: true,
  },
};

export function usePayrollSettings() {
  const { data: payroll, isLoading } = useGetPayrollDetailsQuery();
  const [updatePayrollDetails, { isLoading: isSaving }] =
    useUpdatePayrollDetailsMutation();

  const [formData, setFormData] = useState<PayrollSettings>(EMPTY_PAYROLL);

  useEffect(() => {
    if (payroll) {
      setFormData(payroll);
    }
  }, [payroll]);

  const toggleModule = (name: keyof PayrollSettings["modules"]) => {
    setFormData((prev) => ({
      ...prev,
      modules: {
        ...prev.modules,
        [name]: !prev.modules[name],
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updatePayrollDetails(formData).unwrap();
    } catch (err) {
      console.error("Failed to save payroll settings", err);
    }
  };

  const handleCancel = () => {
    if (payroll) setFormData(payroll);
  };

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    toggleModule,
    handleSave,
    handleCancel,
  };
}