import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Circle,
  GripVertical,
  Info,
  Plus,
  Save,
  Settings2,
  Trash2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Undo2,
  Redo2,
  Superscript,
  Subscript,
  Quote,
} from "lucide-react";

import PreOnboardPageShell from "../components/PreEnrollmentPageShell";

type PageMode =
  | "activities"
  | "welcome-mail"
  | "joining-details"
  | "portal-design";

type PortalItem =
  | "introduction"
  | "welcome-message"
  | "more-about-company"
  | "company-policy"
  | "general-details"
  | "address-contact"
  | "upload-photo"
  | "previous-employer"
  | "statutory"
  | "employee-document"
  | "hr-category";

const activities = [
  "Welcome Mail",
  "Candidate Portal",
  "Asset Issue",
  "Training Request",
  "Intimation Mail",
];

const portalItems = [
  {
    title: "Getting to know about us",
    items: [
      { id: "introduction" as PortalItem, label: "An Introduction" },
      { id: "welcome-message" as PortalItem, label: "Welcome Message" },
      { id: "more-about-company" as PortalItem, label: "More About Company" },
      { id: "company-policy" as PortalItem, label: "Company Policy" },
    ],
  },
  {
    title: "About you",
    items: [
      { id: "general-details" as PortalItem, label: "General Details" },
      { id: "address-contact" as PortalItem, label: "Address / Contact" },
      { id: "upload-photo" as PortalItem, label: "Upload your photo" },
      {
        id: "previous-employer" as PortalItem,
        label: "Previous Employer Details",
      },
      { id: "statutory" as PortalItem, label: "Statutory" },
      {
        id: "employee-document" as PortalItem,
        label: "Employee Document",
      },
      { id: "hr-category" as PortalItem, label: "HR category" },
    ],
  },
];

function InputField({
  label,
  placeholder = "",
  value,
}: {
  label: string;
  placeholder?: string;
  value?: string;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="block text-[12px] font-medium text-slate-600">
        {label}
      </label>

      <input
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        className="
          h-10
          w-full
          min-w-0
          rounded
          border
          border-slate-300
          bg-white
          px-3
          text-[12px]
          text-slate-700
          outline-none
          placeholder:text-slate-300
          focus:border-orange-400
        "
      />
    </div>
  );
}

function SmallButton({
  children,
  onClick,
  orange = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  orange?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded px-4 text-[12px] font-semibold transition ${
        orange
          ? "bg-orange-500 text-white hover:bg-orange-600"
          : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function PageHeader({
  title,
  onBack,
  onSave,
}: {
  title: string;
  onBack?: () => void;
  onSave?: () => void;
}) {
  return (
    <div className="mb-3 flex min-h-[48px] flex-col items-stretch justify-between gap-3 border border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:px-4">
      <h2 className="text-[15px] font-semibold text-slate-700">
        {title}
      </h2>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="text-[12px] font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
        >
          Mandatory Setting
        </button>

        {onSave && (
          <SmallButton orange onClick={onSave}>
            <Save size={14} />
            Save
          </SmallButton>
        )}

        {onBack && (
          <SmallButton onClick={onBack}>
            <ArrowLeft size={14} />
            Back
          </SmallButton>
        )}
      </div>
    </div>
  );
}

function ActivitiesPage({
  onOpen,
}: {
  onOpen: (activity: string) => void;
}) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded border border-slate-200 bg-white">
      {/* Desktop / Laptop */}
      <div className="hidden overflow-x-auto lg:block">
        <div className="min-w-[750px]">
          <div className="grid grid-cols-[250px_minmax(0,1fr)]">
            <div className="flex h-12 items-center justify-between border-b border-r border-slate-200 bg-orange-50 px-4">
              <span className="text-[14px] font-semibold text-slate-700">
                Policy
              </span>

              <button
                type="button"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded
                  border
                  border-orange-400
                  text-orange-500
                  hover:bg-orange-100
                "
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="grid h-12 grid-cols-[1fr_210px_70px] items-center bg-orange-50 px-4 text-[13px] font-semibold text-slate-700">
              <span>Activities</span>
              <span>Action</span>
              <span className="text-right">Sorting</span>
            </div>
          </div>

          <div className="grid grid-cols-[250px_minmax(0,1fr)]">
            <div className="border-r border-slate-200 bg-white">
              <button
                type="button"
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  gap-2
                  border-r-[3px]
                  border-orange-500
                  bg-orange-100
                  px-4
                  text-left
                  text-[13px]
                  font-semibold
                  text-orange-600
                "
              >
                <Circle
                  size={10}
                  className="fill-orange-500 text-orange-500"
                />
                Onboarding policy
              </button>
            </div>

            <div>
              {activities.map((activity, index) => (
                <div
                  key={activity}
                  className="grid min-h-[58px] grid-cols-[1fr_210px_70px] items-center border-b border-slate-100 px-4 hover:bg-slate-50"
                >
                  <button
                    type="button"
                    onClick={() => onOpen(activity)}
                    className="text-left text-[13px] font-medium text-slate-700"
                  >
                    {activity}
                  </button>

                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      className="text-orange-500 hover:text-orange-600"
                    >
                      <Info size={17} />
                    </button>

                    <button
                      type="button"
                      className="text-slate-500 hover:text-slate-800"
                    >
                      <Settings2 size={17} />
                    </button>

                    <button
                      type="button"
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>

                    {index === activities.length - 1 && (
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded bg-orange-100 text-orange-500"
                      >
                        <Plus size={15} />
                      </button>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-slate-600 hover:text-slate-900"
                    >
                      <GripVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet */}
      <div className="block lg:hidden">
        <div className="flex items-center justify-between bg-orange-50 px-3 py-3">
          <div>
            <p className="text-[12px] font-semibold text-slate-700">
              Policy
            </p>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Onboarding policy
            </p>
          </div>

          <button
            type="button"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded
              border
              border-orange-400
              text-orange-500
              hover:bg-orange-100
            "
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {activities.map((activity, index) => (
            <div
              key={activity}
              className="flex min-w-0 flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <button
                type="button"
                onClick={() => onOpen(activity)}
                className="min-w-0 text-left text-[13px] font-medium text-slate-700"
              >
                {activity}
              </button>

              <div className="flex shrink-0 items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <Info size={17} />
                  </button>

                  <button
                    type="button"
                    className="text-slate-500 hover:text-slate-800"
                  >
                    <Settings2 size={17} />
                  </button>

                  <button
                    type="button"
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>

                  {index === activities.length - 1 && (
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded bg-orange-100 text-orange-500"
                    >
                      <Plus size={15} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="text-slate-600 hover:text-slate-900"
                >
                  <GripVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WelcomeMailPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full min-w-0">
      <PageHeader
        title="Welcome Mail"
        onBack={onBack}
        onSave={() => {}}
      />

      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[315px_minmax(0,1fr)]">
        <div className="min-w-0 rounded border border-slate-200 bg-white p-3 sm:p-4">
          <InputField label="Time" value="10:30 AM" />

          <div className="mt-5 space-y-1.5">
            <label className="block text-[12px] font-medium text-slate-600">
              Reporting Address
            </label>

            <textarea
              rows={5}
              defaultValue="609, Vasavi Sky city, 6th floor, Gachibowli Cir, Telecom Nagar, Hyderabad, Telangana - 500032"
              className="
                w-full
                resize-none
                rounded
                border
                border-slate-300
                px-3
                py-2.5
                text-[12px]
                leading-5
                text-slate-700
                outline-none
                focus:border-orange-400
              "
            />
          </div>

          <div className="mt-5">
            <InputField
              label="Location Link"
              value="https://share.google/eif85DQQVo2OhYiu7f"
            />
          </div>

          <button
            type="button"
            className="mt-4 text-[12px] font-semibold text-orange-500 hover:text-orange-600"
          >
            Add Custom Fields
          </button>
        </div>

        <div className="min-w-0 rounded border border-slate-200 bg-white p-3 sm:p-4">
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[12px] font-medium text-slate-700">
              Subject
            </span>

            <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-orange-500">
              <button type="button">Edit Body</button>
              <button type="button">Placeholder</button>
            </div>
          </div>

          <input
            type="text"
            defaultValue="Welcome to {companyname}! Important Details for Your First Day"
            className="
              mb-4
              h-10
              w-full
              min-w-0
              rounded
              border
              border-slate-300
              px-3
              text-[12px]
              text-slate-700
              outline-none
              focus:border-orange-400
            "
          />

          <div className="mb-2 text-[12px] font-medium text-slate-700">
            Message
          </div>

          <div className="relative min-h-[390px] overflow-auto rounded border border-slate-300 bg-white p-3 text-[12px] leading-6 text-slate-700 sm:p-4">
            <div className="mb-3 text-right text-[10px] text-slate-400 sm:text-[11px]">
              Mail Preview — click "Edit Body" to edit text directly
            </div>

            <div>
              <p className="font-semibold">
                We are thrilled to have you join our team. Your skills and
                experiences will be a valuable addition to our organization,
                and we look forward to working with you.
              </p>

              <p className="mt-6 font-semibold">
                Here are a few details to help you get started:
              </p>

              <ul className="mt-3 list-disc space-y-1 pl-5 sm:pl-6">
                <li>Joining Date: {"{joiningdate}"}</li>
                <li>
                  Office Location: 609, Vasavi Sky city, 6th floor,
                  Gachibowli Cir, Telecom Nagar, Hyderabad, Telangana -
                  500032
                </li>
                <li className="break-all">
                  Google Map Link:
                  <span className="ml-1 text-orange-500 underline">
                    https://share.google/eif85DQQVo2OhYiu7f
                  </span>
                </li>
              </ul>

              <p className="mt-6 font-semibold">What to Bring:</p>

              <ul className="mt-3 list-disc space-y-1 pl-5 sm:pl-6">
                <li>Valid ID for security</li>
                <li>
                  Any necessary paperwork such as signed offer letter and
                  identification documents for HR
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JoiningDetailsPage({
  onPortal,
}: {
  onPortal: () => void;
}) {
  return (
    <div className="w-full min-w-0">
      <PageHeader title="Joining Details" onSave={() => {}} />

      <div className="mb-3 flex h-auto min-h-10 flex-wrap items-center gap-1 border border-slate-200 bg-white px-2 py-1">
        <button
          type="button"
          className="
            h-8
            rounded
            bg-orange-100
            px-4
            text-[12px]
            font-semibold
            text-orange-600
            sm:px-5
          "
        >
          Joining Details
        </button>

        <button
          type="button"
          onClick={onPortal}
          className="h-8 rounded px-4 text-[12px] text-slate-600 hover:bg-orange-50 sm:px-5"
        >
          Portal Design
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[315px_minmax(0,1fr)]">
        <div className="min-w-0 rounded border border-slate-200 bg-white p-3 sm:p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_55px] gap-3">
            <InputField label="Link Available" value="2" />

            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-slate-600">
                Days
              </label>

              <div className="flex h-10 items-center text-[12px] text-slate-600">
                Days
              </div>
            </div>
          </div>

          <div className="mt-4">
            <InputField label="Time" placeholder="Enter time hh:mm" />
          </div>

          <div className="mt-4">
            <InputField
              label="Google Link"
              placeholder="Enter Information"
            />
          </div>

          <div className="mt-4 space-y-1.5">
            <label className="block text-[12px] font-medium text-slate-600">
              Reporting Address
            </label>

            <textarea
              rows={4}
              placeholder="Enter Information"
              className="
                w-full
                resize-none
                rounded
                border
                border-slate-300
                px-3
                py-2.5
                text-[12px]
                outline-none
                focus:border-orange-400
              "
            />
          </div>

          <button
            type="button"
            className="mt-4 text-[12px] font-semibold text-orange-500 hover:text-orange-600"
          >
            Add Custom Fields
          </button>
        </div>

        <div className="min-w-0 rounded border border-slate-200 bg-white p-3 sm:p-4">
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[12px] font-medium text-slate-700">
              Subject
            </span>

            <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-orange-500">
              <button type="button">Edit Body</button>
              <button type="button">Placeholder</button>
            </div>
          </div>

          <input
            type="text"
            defaultValue="Joining Details and Onboarding Portal Form Submission"
            className="
              mb-4
              h-10
              w-full
              min-w-0
              rounded
              border
              border-slate-300
              px-3
              text-[12px]
              outline-none
              focus:border-orange-400
            "
          />

          <div className="mb-2 text-[12px] font-medium text-slate-700">
            Message
          </div>

          <div className="min-h-[390px] overflow-auto rounded border border-slate-300 p-3 text-[12px] leading-6 text-slate-700 sm:p-4">
            <p>
              <strong>Onboarding Portal Form:</strong> To ensure a smooth
              transition and to prepare for your arrival, please complete
              the Onboarding Portal Form by {"{linkavailabledays}"}.
            </p>

            <p className="mt-6">
              You can access the Onboarding Portal Form using the following
              link: {"{portallink}"}.
            </p>

            <p className="mt-6 break-words">
              {"{copylink}"}
            </p>

            <p className="mt-6">
              Should you have any questions or encounter any difficulties
              while filling out the form, please feel free to reach out to
              me directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalDesignPage({
  activeItem,
  setActiveItem,
  onJoiningDetails,
}: {
  activeItem: PortalItem;
  setActiveItem: (item: PortalItem) => void;
  onJoiningDetails: () => void;
}) {
  return (
    <div className="w-full min-w-0">
      <PageHeader title="Joining Details" onSave={() => {}} />

      <div className="mb-3 flex h-auto min-h-10 flex-wrap items-center gap-1 border border-slate-200 bg-white px-2 py-1">
        <button
          type="button"
          onClick={onJoiningDetails}
          className="h-8 rounded px-4 text-[12px] text-slate-500 hover:bg-orange-50 sm:px-5"
        >
          Joining Details
        </button>

        <button
          type="button"
          className="
            h-8
            rounded
            bg-orange-100
            px-4
            text-[12px]
            font-semibold
            text-orange-600
            sm:px-5
          "
        >
          Portal Design
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[265px_minmax(0,1fr)]">
        {/* Portal Navigation */}
        <div className="min-w-0 overflow-hidden rounded border border-slate-200 bg-white">
          <div className="flex h-10 items-center gap-2 border-b border-slate-200 bg-emerald-50 px-3 text-[12px] font-semibold text-slate-600">
            <GripVertical size={16} />
            Drag reorder
          </div>

          <div className="flex h-11 items-center gap-2 border-b border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-600">
            <Check size={14} className="text-slate-400" />
            Welcome To Company
          </div>

          <div className="flex h-9 items-center border-b border-slate-200 bg-slate-100 px-3 text-[11px] font-semibold text-slate-500">
            <Circle
              size={7}
              className="mr-2 fill-slate-500 text-slate-500"
            />
            Getting to know about us
          </div>

          {portalItems[0].items.map((item) => (
            <PortalRow
              key={item.id}
              item={item}
              activeItem={activeItem}
              onClick={setActiveItem}
            />
          ))}

          <div className="flex h-9 items-center border-b border-slate-200 bg-slate-100 px-3 text-[11px] font-semibold text-slate-500">
            <Circle
              size={7}
              className="mr-2 fill-slate-500 text-slate-500"
            />
            About you
          </div>

          {portalItems[1].items.map((item) => (
            <PortalRow
              key={item.id}
              item={item}
              activeItem={activeItem}
              onClick={setActiveItem}
            />
          ))}
        </div>

        {/* Portal Content */}
        <div className="min-h-[500px] min-w-0 overflow-hidden rounded border border-slate-200 bg-white p-3 sm:p-4">
          <PortalContent activeItem={activeItem} />
        </div>
      </div>
    </div>
  );
}

function PortalRow({
  item,
  activeItem,
  onClick,
}: {
  item: { id: PortalItem; label: string };
  activeItem: PortalItem;
  onClick: (item: PortalItem) => void;
}) {
  const selected = activeItem === item.id;

  return (
    <button
      type="button"
      onClick={() => onClick(item.id)}
      className={`flex min-h-10 w-full items-center justify-between gap-2 border-b border-slate-100 px-3 text-left text-[12px] transition ${
        selected
          ? "bg-orange-100 font-semibold text-orange-600"
          : "bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Check
          size={13}
          className={
            selected
              ? "shrink-0 text-orange-500"
              : "shrink-0 text-slate-400"
          }
        />

        <span className="truncate">{item.label}</span>
      </span>

      <GripVertical
        size={15}
        className="shrink-0 text-slate-500"
      />
    </button>
  );
}

function EditorToolbar() {
  return (
    <div className="flex h-10 max-w-full items-center gap-3 overflow-x-auto border border-slate-300 bg-slate-50 px-3 text-slate-600">
      <span className="whitespace-nowrap text-[12px]">Arial</span>
      <ChevronDown size={12} className="shrink-0" />

      <span className="whitespace-nowrap text-[12px]">Size 3</span>
      <ChevronDown size={12} className="shrink-0" />

      <span className="whitespace-nowrap text-[12px]">Normal</span>
      <ChevronDown size={12} className="shrink-0" />

      <Bold size={14} className="shrink-0" />
      <Italic size={14} className="shrink-0" />
      <Underline size={14} className="shrink-0" />
      <Strikethrough size={14} className="shrink-0" />
      <List size={15} className="shrink-0" />
      <ListOrdered size={15} className="shrink-0" />
      <AlignLeft size={15} className="shrink-0" />
      <AlignCenter size={15} className="shrink-0" />
      <AlignRight size={15} className="shrink-0" />
      <Superscript size={13} className="shrink-0" />
      <Subscript size={13} className="shrink-0" />
      <Quote size={14} className="shrink-0" />
      <Link size={14} className="shrink-0" />
      <Undo2 size={14} className="shrink-0" />
      <Redo2 size={14} className="shrink-0" />
    </div>
  );
}

function PortalContent({
  activeItem,
}: {
  activeItem: PortalItem;
}) {
  if (
    activeItem === "introduction" ||
    activeItem === "welcome-message"
  ) {
    return (
      <div className="min-w-0">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[13px] font-semibold text-slate-700">
            Message
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="text-[12px] font-semibold text-orange-500 hover:text-orange-600"
            >
              Placeholder
            </button>

            <button
              type="button"
              className="
                inline-flex
                h-8
                items-center
                gap-1
                rounded
                bg-orange-500
                px-3
                text-[11px]
                font-semibold
                text-white
                hover:bg-orange-600
              "
            >
              ✨ Generate
            </button>
          </div>
        </div>

        <EditorToolbar />

        <div className="min-h-[390px] max-w-full overflow-auto rounded-b border border-t-0 border-slate-300 bg-white p-3 text-[13px] leading-5 text-slate-700 sm:p-4">
          <p className="font-bold text-slate-700">
            Welcome to {"{companyname}"} Onboarding Portal!
          </p>

          <p className="mt-1 text-orange-500">
            Dear {"{candidatename}"},
          </p>

          <p className="mt-1">
            Welcome to {"{companyname}"}! We are thrilled to have you join
            our team. This portal is designed to guide you through your
            onboarding journey and help you get acquainted with our company.
          </p>

          <p className="mt-1">
            As you embark on this exciting journey with us, there are a few
            important steps to complete for your onboarding. Please ensure
            you fill out your personal information forms, familiarize
            yourself with our company policies, and attend our orientation
            session.
          </p>

          <p className="mt-1 font-bold">About Us</p>

          <p>
            {"{companyname}"} was founded in {"{Year}"} with a vision to{" "}
            {"{insert company mission or vision statement}"}. Over the years,
            we have grown to become a leader in {"{industry/field}"}, known
            for our commitment to excellence, integrity, and customer
            satisfaction.
          </p>

          <p className="mt-1 font-bold">Our Vision</p>

          <p>
            To be the Leader in the space of Taxation, Payroll and accounting
            domains.
          </p>

          <p className="mt-1 font-bold">Our Values</p>

          <p>
            At {"{company name}"}, we follow some basic principles which
            guide us throughout our business. These principles collectively
            form our value system and guide us towards a successful business.
          </p>

          <p className="mt-1 font-bold">Key Contacts</p>

          <ul className="list-disc space-y-1 pl-5 sm:pl-6">
            <li>
              HR Team: For any questions related to your employment,
              benefits, or policies.
            </li>
            <li>
              IT Support: For assistance with technical issues or access to
              company systems.
            </li>
            <li>
              Your Manager: For guidance related to your role,
              responsibilities, and performance.
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (activeItem === "more-about-company") {
    return (
      <div className="pt-2 sm:pt-4">
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_40px]">
          <InputField label="Url" />
          <InputField label="Description" />

          <div className="flex items-end justify-start pb-1 sm:justify-center">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded text-orange-500 hover:bg-orange-50"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeItem === "company-policy") {
    return (
      <div>
        <div className="flex justify-start sm:justify-end">
          <SmallButton orange>
            <Plus size={14} />
            Add Document
          </SmallButton>
        </div>

        <div className="min-h-[390px]" />
      </div>
    );
  }

  if (activeItem === "general-details") {
    return (
      <div className="min-w-0">
        <h3 className="mb-5 border-b border-slate-300 pb-2 text-center text-[15px] font-semibold text-slate-700">
          General Details
        </h3>

        <div className="grid min-w-0 grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div className="grid min-w-0 grid-cols-[45px_minmax(0,1fr)] gap-3">
            <InputField label="Title" />
            <InputField label="First Name" />
          </div>

          <InputField label="Father Name" />
          <InputField label="Middle Name" />
          <InputField label="Marital Status" />
          <InputField label="Last Name" />
          <InputField label="Spouse Name" />
          <InputField label="Full Name" />
          <InputField label="Date Of Birth" />
          <InputField label="Gender" />

          <div className="flex min-w-0 items-end gap-2 pb-2">
            <input
              type="checkbox"
              className="h-4 w-4 shrink-0 accent-orange-500"
            />

            <span className="text-[12px] text-slate-600">
              Physically Challenged
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (activeItem === "address-contact") {
    return (
      <div className="min-w-0">
        <h3 className="mb-5 border-b border-slate-300 pb-2 text-center text-[15px] font-semibold text-slate-700">
          Address / Contact
        </h3>

        <div className="grid min-w-0 grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <InputField label="Residential No." />
          <InputField label="Residential Name" />
          <InputField label="Street" />
          <InputField label="Locality" />
          <InputField label="City" />
          <InputField label="State" />
          <InputField label="PinCode" />
        </div>

        <div className="mt-7 border-t border-slate-200 pt-3 text-[13px] font-semibold text-slate-700">
          Permanent add
        </div>

        <div className="mt-4 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField label="Residential No." />
          <InputField label="Residential Name" />
          <InputField label="Street" />
          <InputField label="Locality" />
          <InputField label="City" />
          <InputField label="State" />
        </div>
      </div>
    );
  }

  if (activeItem === "upload-photo") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-start px-2 pt-3 text-center">
        <p className="text-[13px] font-semibold text-slate-700">
          Please upload a professional headshot or portrait for your employee
          profile.
        </p>

        <div className="mt-8 h-32 w-full max-w-[208px] rounded-lg bg-orange-100 sm:h-40" />
      </div>
    );
  }

  if (activeItem === "previous-employer") {
    return (
      <div className="min-w-0">
        <h3 className="mb-5 text-[13px] font-semibold text-orange-500">
          Previous details
        </h3>

        <div className="grid min-w-0 grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <InputField label="Company Name" />
          <InputField label="Designation" />
          <InputField
            label="From Date"
            placeholder="DD-MM-YYYY"
          />
          <InputField
            label="To Date"
            placeholder="DD-MM-YYYY"
          />
        </div>
      </div>
    );
  }

  if (activeItem === "statutory") {
    return (
      <div className="min-w-0">
        <h3 className="mb-5 border-b border-slate-300 pb-2 text-center text-[15px] font-semibold text-slate-700">
          Statutory
        </h3>

        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField label="PAN Number" />
          <InputField label="Aadhaar Number" />
          <InputField label="UAN Number" />
          <InputField label="PF Number" />
          <InputField label="ESI Number" />
          <InputField label="Tax Regime" />
        </div>
      </div>
    );
  }

  if (activeItem === "employee-document") {
    return (
      <div className="min-w-0">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[14px] font-semibold text-slate-700">
            Employee Document
          </h3>

          <div className="flex justify-start sm:justify-end">
            <SmallButton orange>
              <Plus size={14} />
              Add Document
            </SmallButton>
          </div>
        </div>

        <div className="min-h-[350px]" />
      </div>
    );
  }

  if (activeItem === "hr-category") {
    return (
      <div className="min-w-0">
        <h3 className="mb-5 border-b border-slate-300 pb-2 text-center text-[15px] font-semibold text-slate-700">
          HR Category
        </h3>

        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField label="Employee Category" />
          <InputField label="Employee Type" />
          <InputField label="Business Unit" />
          <InputField label="Department" />
          <InputField label="Location" />
          <InputField label="Grade" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[350px] items-center justify-center text-center text-[13px] text-slate-500">
      Configuration section
    </div>
  );
}

export default function Settings() {
  const [mode, setMode] =
    useState<PageMode>("activities");

  const [activePortalItem, setActivePortalItem] =
    useState<PortalItem>("introduction");

  const [showActivityMenu, setShowActivityMenu] =
    useState(false);

  const openActivity = (activity: string) => {
    if (activity === "Welcome Mail") {
      setMode("welcome-mail");
      return;
    }

    setMode("joining-details");
  };

  const openPortal = () => {
    setMode("portal-design");
  };

  return (
    <PreOnboardPageShell>
      <div className="w-full min-w-0 bg-slate-50 p-2 sm:p-3">
        {mode === "activities" && (
          <div className="mb-3 flex justify-start sm:justify-end">
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() =>
                  setShowActivityMenu((value) => !value)
                }
                className="
                  inline-flex
                  h-9
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded
                  bg-orange-500
                  px-4
                  text-[12px]
                  font-semibold
                  text-white
                  hover:bg-orange-600
                  sm:w-auto
                "
              >
                Select Activity
                <ChevronDown size={14} />
              </button>

              {showActivityMenu && (
                <div className="absolute left-0 right-0 z-20 mt-1 w-full rounded border border-slate-200 bg-white p-1 shadow-lg sm:left-auto sm:right-0 sm:w-48">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("joining-details");
                      setShowActivityMenu(false);
                    }}
                    className="block w-full rounded px-3 py-2.5 text-left text-[12px] text-slate-600 hover:bg-orange-50"
                  >
                    Joining Details
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActivePortalItem("introduction");
                      setMode("portal-design");
                      setShowActivityMenu(false);
                    }}
                    className="block w-full rounded px-3 py-2.5 text-left text-[12px] text-slate-600 hover:bg-orange-50"
                  >
                    Portal Design
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {mode === "activities" && (
          <ActivitiesPage onOpen={openActivity} />
        )}

        {mode === "welcome-mail" && (
          <WelcomeMailPage
            onBack={() => setMode("activities")}
          />
        )}

        {mode === "joining-details" && (
          <JoiningDetailsPage onPortal={openPortal} />
        )}

        {mode === "portal-design" && (
          <PortalDesignPage
            activeItem={activePortalItem}
            setActiveItem={setActivePortalItem}
            onJoiningDetails={() =>
              setMode("joining-details")
            }
          />
        )}
      </div>
    </PreOnboardPageShell>
  );
}