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
      <Card className="w-full min-w-0 shadow-none border-0">
       <CardContent className="flex flex-col items-center justify-center py-10 sm:py-16">
          {Icon && (
            <div className="mb-4 rounded-full bg-blue-100 p-3">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
          )}

          <h3 className="text-base font-semibold text-slate-700 sm:text-lg">
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
   <Card className="w-full min-w-0 border-0 shadow-none bg-transparent">
      <CardContent className="p-0">

        {/* Section Header */}

        <div className="mb-4 flex min-w-0 items-center gap-3 sm:mb-5">

          {Icon && (
            <div className="shrink-0 rounded-full bg-blue-100 p-2">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-800 sm:text-xl">
              {section.title}
            </h2>

            <p className="text-sm text-slate-500">
              {section.records.length} Record
              {section.records.length > 1 ? "s" : ""}
            </p>
          </div>

        </div>

        {/* Table */}

        <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-lg border border-slate-300 sm:border-2">

          <table className="w-full min-w-[600px] border-collapse">

            <thead className="bg-slate-100">

              <tr>

                {headers.map((header) => (
                  <th
                    key={header.label}
                    className="border border-slate-300 px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800 sm:px-5 sm:py-4 sm:text-sm"
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
                       className="border border-slate-300 px-3 py-3 text-xs font-medium text-slate-700 sm:px-5 sm:py-4 sm:text-sm"
                      >
                        {field.label === "Actions" &&
                          typeof field.value === "object" &&
                          field.value ? (
                          <div className="flex items-center justify-center gap-3 sm:gap-4">
                           {(field.value as any).view && (
                              <button
                                type="button"
                                className="text-slate-600 hover:text-blue-600"
                              >
                                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>
                            )}

                            {(field.value as any).download && (
                              <button
                                type="button"
                                className="text-slate-600 hover:text-green-600"
                              >
                                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
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