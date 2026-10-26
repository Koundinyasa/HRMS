import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  User,
  Building2,
  CalendarDays,
  Briefcase,
  UserCircle,
  Phone,
  Mail,
  type LucideIcon,
} from "lucide-react";

import {
  PROFILE_ICONS,
  HIDDEN_FIELDS,
} from "../constants/profile.constants";

import type {
  ProfileField,
  ProfileSectionProps,
} from "../types/profile.types";

const FIELD_ICONS: Record<string, LucideIcon> = {
  "Full Name": User,
  "Company Name": Building2,
  "Date Of Joining": CalendarDays,
  "Date of Joining": CalendarDays,
  "Date Of Birth": CalendarDays,
  "Date of Birth": CalendarDays,
  Designation: Briefcase,
  "Reporting Manager Name": UserCircle,
  Mobileno: Phone,
  "Mobile No": Phone,
  Mobile: Phone,
  Email: Mail,
};

export default function ProfileSection({
  section,
}: ProfileSectionProps) {
  const Icon = PROFILE_ICONS[section.icon];

  const renderField = (field: ProfileField) => {
    if (HIDDEN_FIELDS.includes(field.label)) {
      return null;
    }

    const FieldIcon = FIELD_ICONS[field.label];

    return (
      <div
        key={field.label}
        className="
          w-full
          min-w-0
          flex
          flex-col
          gap-1.5
        "
      >
        <label className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] sm:text-[13px]">
          {FieldIcon && (
            <FieldIcon size={13} className="shrink-0 text-[#94A3B8]" />
          )}
          {field.label}
        </label>

        <Input
          readOnly
          value={String(field.value ?? "")}
          className="
            h-10 w-full min-w-0 cursor-default rounded-xl
            border border-[#E2E8F0] bg-[#F1F5F9]
            text-sm text-[#334155]
            focus-visible:ring-0 focus-visible:ring-offset-0
            sm:h-11 sm:text-[15px]
          "
        />
      </div>
    );
  };

  const content = (
    <CardContent className="p-4 sm:p-6 lg:p-8">

      {/* Header */}

      <div className="mb-5 flex min-w-0 items-center gap-3 sm:mb-8 sm:gap-4">

        {Icon && (
          <div className="shrink-0 rounded-xl  p-2.5 sm:p-3"
            style={{ backgroundColor: "#DBEAFE" }}
          >
            <Icon className="h-5 w-5 text-[#2563EB] sm:h-6 sm:w-6" />
          </div>
        )}

        <h2 className="min-w-0 truncate text-lg font-semibold text-[#0F172A] sm:text-2xl">
          {section.title}
        </h2>

      </div>

      {/* Single Section */}

      {section.fields && (
        <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 lg:gap-x-8 lg:gap-y-7">
          {section.fields.map(renderField)}
        </div>
      )}

      {/* Multiple Records */}

      {section.records && (
        <div className="w-full min-w-0 space-y-5 sm:space-y-6 lg:space-y-8">
          {section.records.map((record, index) => (
            <Card
              key={index}
              className="w-full min-w-0 rounded-xl border border-[#E2E8F0] shadow-none"
            >
              <CardContent className="p-4 sm:p-5 lg:p-6">

                {record.heading && (
                  <h3 className="mb-4 text-base font-semibold text-[#0F172A] sm:mb-6 sm:text-lg">
                    {record.heading}
                  </h3>
                )}

                <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 lg:gap-x-8 lg:gap-y-7">
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
      className={`w-full min-w-0 max-w-full rounded-xl bg-white shadow-sm ring-0 sm:rounded-2xl ${
        section.title === "Personal Information"
          ? "border border-[#1F2937]"
          : "border border-[#E2E8F0]"
      }`}
    >
      {content}
    </Card>
  );
}