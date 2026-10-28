export const formatDate = (date?: string): string => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) {
    return "₹0.00";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateGratuity = (
  lastDrawnSalary: number,
  yearsOfService: number
): number => {
  if (lastDrawnSalary <= 0 || yearsOfService <= 0) {
    return 0;
  }

  return (lastDrawnSalary * 15 * yearsOfService) / 26;
};

export const getStatusClass = (status?: string): string => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "bg-green-100 text-green-700";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    case "COMPLETED":
      return "bg-blue-100 text-blue-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};