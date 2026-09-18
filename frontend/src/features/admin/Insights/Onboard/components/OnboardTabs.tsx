



import {
  FileText,
  BarChart3,
} from "lucide-react";

import {
  NavLink,
  useLocation,
  useParams,
} from "react-router-dom";

export default function OnboardTabs() {
  const location =
    useLocation();

  const {
    domain,
  } = useParams<{
    domain?: string;
  }>();

  const basePath = domain
    ? `/${domain}/admin/insights/onboard`
    : "/insights/onboard";

  const tabs = [
    {
      label:
        "Confirmation Letter",
      to: `${basePath}/document/confirmation-letter`,
      icon: FileText,
    },
    {
      label:
        "On-Board Reports",
      to: `${basePath}`,
      icon: BarChart3,
    },
  ];

  return (
    <div className="overflow-x-auto border-b border-slate-200 bg-white">

      <div className="flex min-w-max px-4 sm:px-6">

        {tabs.map(
          (tab) => {
            const Icon =
              tab.icon;

            const isConfirmation =
              location.pathname.includes(
                "/document/confirmation-letter",
              );

            const isActive =
              tab.label ===
              "Confirmation Letter"
                ? isConfirmation
                : !isConfirmation;

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={[
                  "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800",
                ].join(" ")}
              >

                <Icon
                  size={16}
                />

                {tab.label}

              </NavLink>
            );
          },
        )}

      </div>

    </div>
  );
}