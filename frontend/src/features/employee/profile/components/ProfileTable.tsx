import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download } from "lucide-react";
import {
  PROFILE_ICONS,
  HIDDEN_FIELDS,
} from "../constants/profile.constants";

import type { ProfileSectionProps } from "../types/profile.types";

export default function ProfileTable({
  section,
}: ProfileSectionProps) {
  const Icon = PROFILE_ICONS[section.icon];

  if (!section.records?.length) {
    return (
      <Card className="shadow-none border-0">
        <CardContent className="flex flex-col items-center justify-center py-16">
          {Icon && (
            <div className="mb-4 rounded-full bg-blue-100 p-3">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
          )}

          <h3 className="text-lg font-semibold text-slate-700">
            No Data Available
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            There are no records to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  const headers = section.records[0].fields.filter(
    (field) => !HIDDEN_FIELDS.includes(field.label)
  );

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">

        {/* Section Header */}

        <div className="mb-5 flex items-center gap-3">

          {Icon && (
            <div className="rounded-full bg-blue-100 p-2">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {section.title}
            </h2>

            <p className="text-sm text-slate-500">
              {section.records.length} Record
              {section.records.length > 1 ? "s" : ""}
            </p>
          </div>

        </div>

        {/* Table */}

        <div className="overflow-x-auto rounded-lg border-2 border-slate-300">

          <table className="min-w-full border-collapse">

            <thead className="bg-slate-100">

              <tr>

                {headers.map((header) => (
                  <th
                    key={header.label}
                    className="border border-slate-300 px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-slate-800"
                  >
                    {header.label}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {section.records.map((record, rowIndex) => (

                <tr
                  key={rowIndex}
                  className={`transition-colors hover:bg-blue-50 ${rowIndex % 2 === 0
                      ? "bg-white"
                      : "bg-slate-50"
                    }`}
                >

                  {record.fields
                    .filter(
                      (field) =>
                        !HIDDEN_FIELDS.includes(field.label)
                    )
                    .map((field) => (

                      <td
                        key={field.label}
                        className="border border-slate-300 px-5 py-4 text-sm font-medium text-slate-700"
                      >
                        {field.label === "Actions" &&
                          typeof field.value === "object" &&
                          field.value ? (
                          <div className="flex items-center justify-center gap-4">
                            {field.value.view && (
                              <button
                                type="button"
                                className="text-slate-600 hover:text-blue-600"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                            )}

                            {field.value.download && (
                              <button
                                type="button"
                                className="text-slate-600 hover:text-green-600"
                              >
                                <Download className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        ) : field.value !== null &&
                          field.value !== undefined &&
                          field.value !== "" ? (
                          String(field.value)
                        ) : (
                          "-"
                        )}
                      </td>

                    ))}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </CardContent>
    </Card>
  );
}