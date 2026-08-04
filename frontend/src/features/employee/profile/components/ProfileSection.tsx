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
        className="flex flex-col gap-2"
        style={{
          flex: "1 1 320px",
          minWidth: "260px",
          maxWidth: "550px",
        }}
      >
        <label className="text-sm font-medium text-slate-600">
          {field.label}
        </label>

        <Input
          readOnly
          value={String(field.value ?? "")}
          className="
            h-11
            bg-slate-50
            border-slate-300
            focus-visible:ring-0
            cursor-default
            text-[15px]
          "
        />
      </div>
    );
  };

  const content = (
    <CardContent className="p-8">

      {/* Header */}

      <div className="flex items-center gap-4 mb-8">

        {Icon && (
          <div className="rounded-xl bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}

        <h2 className="text-2xl font-semibold">
          {section.title}
        </h2>

      </div>

      {/* Single Section */}

      {section.fields && (
        <div className="flex flex-wrap gap-x-8 gap-y-7">
          {section.fields.map(renderField)}
        </div>
      )}

      {/* Multiple Records */}

      {section.records && (
        <div className="space-y-8">
          {section.records.map((record, index) => (
            <Card
              key={index}
              className="rounded-xl border border-slate-200 shadow-none"
            >
              <CardContent className="p-6">

                {record.heading && (
                  <h3 className="mb-6 text-lg font-semibold text-slate-800">
                    {record.heading}
                  </h3>
                )}

                <div className="flex flex-wrap gap-x-8 gap-y-7">
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
    return <div>{content}</div>;
  }

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm">
      {content}
    </Card>
  );
}