import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
 
import { useLeave } from "../hooks/useLeave";
 
export default function LeaveBalance() {
  const { leaveBalance, balanceLoading } = useLeave();
 
  // Loading state
  if (balanceLoading) {
    return (
      <div className="flex justify-center py-12">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200"
          style={{
            borderTopColor: "var(--primary-color)",
          }}
        />
      </div>
    );
  }
 
  const records = leaveBalance?.records ?? [];
 
  // Fields that should not be displayed
  const hiddenFields = ["Leave Year", "Last Updated"];
 
  // Get table headers
  const headers =
    records.length > 0
      ? records[0].fields
          .filter((field) => !hiddenFields.includes(field.label))
          .map((field) => field.label)
      : [];
 
  // Get a particular field value
  const getFieldValue = (
    fields: {
      label: string;
      value: string | number | null;
    }[],
    label: string
  ) => {
    return fields.find((field) => field.label === label)?.value ?? 0;
  };
 
  // Total Opening Balance
  const totalOpening = records.reduce((sum, record) => {
    return (
      sum +
      Number(
        getFieldValue(record.fields, "Opening Balance")
      )
    );
  }, 0);
 
  // Total Accrued
  const totalAccrued = records.reduce((sum, record) => {
    return (
      sum +
      Number(
        getFieldValue(record.fields, "Accrued")
      )
    );
  }, 0);
 
  // Total Availed
  const totalAvailed = records.reduce((sum, record) => {
    return (
      sum +
      Number(
        getFieldValue(record.fields, "Availed")
      )
    );
  }, 0);
 
  // Total Closing Balance
  const totalClosing = records.reduce((sum, record) => {
    return (
      sum +
      Number(
        getFieldValue(record.fields, "Closing Balance")
      )
    );
  }, 0);
 
  return (
    <div className="space-y-6">
 
      {/* ============================= */}
      {/* SUMMARY CARDS */}
      {/* ============================= */}
 
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
 
        {/* Total Opening */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Total Opening
            </p>
 
            <h2 className="mt-2 text-3xl font-bold">
              {totalOpening}
            </h2>
          </CardContent>
        </Card>
 
        {/* Total Accrued */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Total Accrued
            </p>
 
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {totalAccrued}
            </h2>
          </CardContent>
        </Card>
 
        {/* Total Availed */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Total Availed
            </p>
 
            <h2 className="mt-2 text-3xl font-bold text-red-500">
              {totalAvailed}
            </h2>
          </CardContent>
        </Card>
 
        {/* Total Closing */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Total Closing
            </p>
 
            <h2
              className="mt-2 text-3xl font-bold"
              style={{
                color: "var(--primary-color)",
              }}
            >
              {totalClosing}
            </h2>
          </CardContent>
        </Card>
 
      </div>
 
      {/* ============================= */}
      {/* LEAVE BALANCE TABLE */}
      {/* ============================= */}
 
      <Card className="border shadow-md">
 
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            Leave Balance
          </CardTitle>
 
          <p className="text-sm text-slate-500">
            Overview of your available leave balances.
          </p>
        </CardHeader>
 
        <CardContent>
 
          {/* No Records */}
          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No leave balance available.
            </div>
          ) : (
 
            <div className="overflow-x-auto rounded-lg border">
 
              <table className="min-w-full text-sm">
 
                {/* ============================= */}
                {/* TABLE HEADER */}
                {/* ============================= */}
 
                <thead
                  className="text-white"
                  style={{
                    background: "var(--primary-color)",
                  }}
                >
                  <tr>
 
                    {headers.map((header) => (
                      <th
                        key={header}
                        className={`px-5 py-4 font-semibold ${
                          header === "Leave Type"
                            ? "text-left"
                            : "text-center"
                        }`}
                      >
                        {header}
                      </th>
                    ))}
 
                  </tr>
                </thead>
 
                {/* ============================= */}
                {/* TABLE BODY */}
                {/* ============================= */}
 
                <tbody>
 
                  {records.map((record, index) => (
 
                    <tr
                      key={index}
                      className={`border-b transition hover:bg-slate-50 ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/40"
                      }`}
                    >
 
                      {record.fields
                        .filter(
                          (field) =>
                            !hiddenFields.includes(field.label)
                        )
                        .map((field) => (
 
                          <td
                            key={field.label}
                            className={`px-5 py-4 ${
                              field.label === "Leave Type"
                                ? "text-left"
                                : "text-center"
                            }`}
                          >
 
                            {/* Leave Type */}
                            {field.label === "Leave Type" ? (
 
                              <span
                                className="
                                  inline-flex
                                  rounded-full
                                  bg-blue-100
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold
                                  text-blue-700
                                "
                              >
                                {field.value}
                              </span>
 
                            ) : field.label === "Accrued" ? (
 
                              /* Accrued */
                              <span className="font-medium text-green-600">
                                +{field.value}
                              </span>
 
                            ) : field.label === "Availed" ? (
 
                              /* Availed */
                              <span className="font-medium text-red-500">
                                {field.value}
                              </span>
 
                            ) : field.label === "Closing Balance" ? (
 
                              /* Closing Balance */
                              <span
                                className="font-bold"
                                style={{
                                  color:
                                    "var(--primary-color)",
                                }}
                              >
                                {field.value}
                              </span>
 
                            ) : (
 
                              /* Other Fields */
                              field.value
 
                            )}
 
                          </td>
 
                        ))}
 
                    </tr>
 
                  ))}
 
                </tbody>
 
              </table>
 
            </div>
 
          )}
 
        </CardContent>
 
      </Card>
 
    </div>
  );
}
 