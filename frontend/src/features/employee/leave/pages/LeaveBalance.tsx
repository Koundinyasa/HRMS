import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import Loader from "@/components/ui/loader";

import { useLeave } from "../hooks/useLeave";

export default function LeaveBalance() {
  const { leaveBalance, balanceLoading } = useLeave();

  if (balanceLoading) {
    return (
      <div className="flex justify-center py-12">
        {/* <Loader /> */}
      </div>
    );
  }

  const records = leaveBalance?.records ?? [];

  const hiddenFields = ["Leave Year", "Last Updated"];

  const headers =
    records.length > 0
      ? records[0].fields
        .filter((field) => !hiddenFields.includes(field.label))
        .map((field) => field.label)
      : [];

  const getFieldValue = (
    fields: { label: string; value: string | number | null }[],
    label: string
  ) => {
    return fields.find((field) => field.label === label)?.value ?? 0;
  };

  const totalOpening = records.reduce(
    (sum, record) =>
      sum +
      Number(getFieldValue(record.fields, "Opening Balance")),
    0
  );

  const totalAccrued = records.reduce(
    (sum, record) =>
      sum +
      Number(getFieldValue(record.fields, "Accrued")),
    0
  );

  const totalAvailed = records.reduce(
    (sum, record) =>
      sum +
      Number(getFieldValue(record.fields, "Availed")),
    0
  );

  const totalClosing = records.reduce(
    (sum, record) =>
      sum +
      Number(getFieldValue(record.fields, "Closing Balance")),
    0
  );

  return (
    <div className="space-y-6">

      {/* Summary Cards */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

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

      <Card className="shadow-md border">

        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            Leave Balance
          </CardTitle>

          <p className="text-sm text-slate-500">
            Overview of your available leave balances.
          </p>
        </CardHeader>

        <CardContent>

          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No leave balance available.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">

              <table className="min-w-full text-sm">

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
                        className={`px-5 py-4 ${header === "Leave Type"
                            ? "text-left"
                            : "text-center"
                          }`}
                      >
                        {header}
                      </th>
                    ))}

                  </tr>
                </thead>

                <tbody>                  {records.map((record, index) => (
                  <tr
                    key={index}
                    className={`border-b transition hover:bg-slate-50 ${index % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50/40"
                      }`}
                  >
                    {record.fields
                      .filter((field) => !hiddenFields.includes(field.label))
                      .map((field) => (
                        <td
                          key={field.label}
                          className={`px-5 py-4 ${field.label === "Leave Type"
                              ? ""
                              : "text-center"
                            }`}
                        >
                          {field.label === "Leave Type" ? (
                            <span
                              className="
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
                            <span className="font-medium text-green-600">
                              +{field.value}
                            </span>
                          ) : field.label === "Availed" ? (
                            <span className="font-medium text-red-500">
                              {field.value}
                            </span>
                          ) : field.label === "Closing Balance" ? (
                            <span
                              className="font-bold"
                              style={{
                                color: "var(--primary-color)",
                              }}
                            >
                              {field.value}
                            </span>
                          ) : (
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
