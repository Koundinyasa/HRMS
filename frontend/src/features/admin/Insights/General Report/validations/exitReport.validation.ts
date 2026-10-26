export const validateEmployeeId = (employeeId: string) => {
  if (!employeeId.trim()) {
    return "Employee ID is required";
  }

  return "";
};

export const validateEmployeeName = (employeeName: string) => {
  if (!employeeName.trim()) {
    return "Employee name is required";
  }

  return "";
};

export const validateDateRange = (
  fromDate: string,
  toDate: string
) => {
  if (!fromDate || !toDate) {
    return "";
  }

  if (new Date(fromDate) > new Date(toDate)) {
    return "From date cannot be greater than To date";
  }

  return "";
};