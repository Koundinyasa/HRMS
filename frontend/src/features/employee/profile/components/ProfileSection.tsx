import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  PROFILE_ICONS,
  HIDDEN_FIELDS,
} from "../constants/profile.constants";

import type {
  ProfileField,
  ProfileSectionProps,
} from "../types/profile.types";

export default function ProfileSection({
  section,
}: ProfileSectionProps) {
  const Icon = PROFILE_ICONS[section.icon];

  const renderField = (field: ProfileField) => {
    if (HIDDEN_FIELDS.includes(field.label)) {
      return null;
    }

    return (
      <div
        key={field.label}
        className="
          w-full
          min-w-0
          flex
          flex-col
          gap-2
        "
      >
        <label className="text-xs font-medium text-slate-600 sm:text-sm">
          {field.label}
        </label>

        <Input
          readOnly
          value={String(field.value ?? "")}
          className="
            h-10
            w-full
            min-w-0
            bg-slate-50
            border-slate-300
            focus-visible:ring-0
            cursor-default
            text-sm
            sm:h-11
            sm:text-[15px]
          "
        />
      </div>
    );
  };

  const content = (
    <CardContent className="p-4 sm:p-6 lg:p-8">

      {/* Header */}

      <div className="flex min-w-0 items-center gap-3 mb-5 sm:gap-4 sm:mb-8">

        {Icon && (
          <div className="shrink-0 rounded-lg bg-primary/10 p-2 sm:rounded-xl sm:p-3">
            <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          </div>
        )}

        <h2 className="min-w-0 truncate text-lg font-semibold sm:text-2xl">
          {section.title}
        </h2>

      </div>

      {/* Single Section */}

      {section.fields && (
        <div className="
            grid
            w-full
            min-w-0
            grid-cols-1
            gap-5
            sm:grid-cols-2
            sm:gap-x-6
            sm:gap-y-6
            lg:grid-cols-2
            lg:gap-x-8
            lg:gap-y-7
          "
        >
          {section.fields.map(renderField)}
        </div>
      )}

      {/* Multiple Records */}

      {section.records && (
        <div className="w-full min-w-0 space-y-5 sm:space-y-6 lg:space-y-8">
          {section.records.map((record, index) => (
            <Card
              key={index}
              className="
                w-full
                min-w-0
                rounded-xl
                border
                border-slate-200
                shadow-none
              "
            >
              <CardContent className="p-4 sm:p-5 lg:p-6">

                {record.heading && (
                  <h3
                    className="
                      mb-4
                      text-base
                      font-semibold
                      text-slate-800
                      sm:mb-6
                      sm:text-lg
                    "
                  >
                    {record.heading}
                  </h3>
                )}

                <div
                  className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    sm:gap-x-6
                    sm:gap-y-6
                    lg:grid-cols-2
                    lg:gap-x-8
                    lg:gap-y-7
                  "
                >
                  {record.fields.map(renderField)}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </CardContent>
  );

  if (section.title === "Address") {
    return <div className="w-full min-w-0 max-w-full">
        {content}
      </div>
  }

  return (
    <Card
      className="
        w-full
        min-w-0
        max-w-full
        rounded-xl
        border
        border-slate-200
        shadow-sm
        sm:rounded-2xl
      "
    >
      {content}
    </Card>
  );
}