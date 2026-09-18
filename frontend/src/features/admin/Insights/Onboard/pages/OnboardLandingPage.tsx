



import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  ClipboardList,
  CalendarDays,
  CalendarClock,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";

const COLUMNS = [
  {
    title: "Confirmation Letter",
    icon: FileText,
    items: [
      {
        label: "Confirmation Letter",
        path: "document/confirmation-letter",
      },
    ],
  },
  {
    title: "On-Board Reports",
    icon: ClipboardList,
    items: [
      {
        label: "PF Declaration",
        path: "document/pf-declaration",
      },
      {
        label: "Payment of Gratuity Form",
        path: "document/payment-of-gratuity",
      },
      {
        label: "Form-11 Revised",
        path: "document/form-11",
      },
    ],
  },
  {
    title: "Month-Wise Onboard Reports",
    icon: CalendarDays,
    items: [
      {
        label: "Month-Wise Onboard (Summary)",
        path: "reports/month-wise-summary",
      },
      {
        label: "Month-Wise Onboard (Detailed)",
        path: "reports/month-wise-detailed",
      },
    ],
  },
  {
    title: "Date-Wise Onboard Reports",
    icon: CalendarClock,
    items: [
      {
        label: "Date-Wise Onboard (Summary)",
        path: "reports/date-wise-summary",
      },
      {
        label: "Date-Wise Onboard (Detailed)",
        path: "reports/date-wise-detailed",
      },
    ],
  },
];

export default function OnboardLandingPage() {
  const navigate = useNavigate();
  const { domain } = useParams<{ domain?: string }>();

  const basePath = domain
    ? `/${domain}/admin/insights/onboard`
    : "/insights/onboard";

  const handleNavigate = (path: string) => {
    navigate(`${basePath}/${path}`);
  };

  return (
    <div className="bg-[#F5F6F8] p-4">
      {/* Single unified panel — pill header + cards grid, no gap between */}
      <div className="overflow-hidden rounded-[10px] border border-[#E4E7EC] bg-white shadow-md">
        {/* Top tab bar */}
        <div className="border-b border-[#E4E7EC] bg-white p-4">
          <div className="inline-flex w-auto shrink-0 items-center gap-2 rounded-md border border-[#F3D9C9] bg-[#FDF1E9] px-4 py-2.5">
            <ClipboardCheck size={16} className="shrink-0 text-[#D97B3F]" />
            <span className="whitespace-nowrap text-[13px] font-semibold text-[#3F3F46]">
              Onboard Report
            </span>
          </div>
        </div>

        {/* Cards grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {COLUMNS.map((column) => {
              const Icon = column.icon;
              return (
                <div
                  key={column.title}
                  className="overflow-hidden rounded-[8px] border border-[#E4E7EC] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)] transition-shadow duration-200 hover:shadow-[0_4px_14px_rgba(15,23,42,0.12)]"
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 border-b border-[#F3D9C9] bg-[#FDF1E9] px-3.5 py-2.5">
                    <Icon size={15} className="shrink-0 text-[#D97B3F]" />
                    <h3 className="text-[13px] font-semibold text-[#3F3F46]">
                      {column.title}
                    </h3>
                  </div>

                  {/* Links */}
                  <div className="flex flex-col gap-1 bg-white px-3.5 py-3">
                    {column.items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleNavigate(item.path)}
                        className="flex items-center gap-1 rounded px-1 py-1.5 text-left text-[13px] text-[#3F3F46] transition-colors hover:bg-[#FDF1E9] hover:text-[#D97B3F]"
                      >
                        <ChevronRight
                          size={13}
                          className="shrink-0 text-[#D97B3F]"
                        />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}