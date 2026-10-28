import { useEffect, useState } from "react";
import { useDashboard } from "../dashboard/hooks/useDashboard";
import {
  Palette,
  Sun,
} from "lucide-react";
import {
  applyTheme,
  loadTheme,
  type ThemeName,
} from "./theme";
const colors: {
  key: ThemeName;
  color: string;
}[] = [
    {
      key: "blue",
      color: "#3B82F6",
    },
    {
      key: "sky",
      color: "#38BDF8",
    },
    {
      key: "purple",
      color: "#8B5CF6",
    },
    {
      key: "teal",
      color: "#4F46E5",
    },
    {
      key: "pink",
      color: "#EC4899",
    },
    {
      key: "cyan",
      color: "#06B6D4",
    },
    {
      key: "indigo",
      color: "#6366F1",
    },
    {
      key: "slate",
      color: "#64748B",
    },
  ];

export default function ThemePreset() {
  const [open, setOpen] = useState(false);
  const { profileData } = useDashboard();

  const employeeId =
    profileData?.data?.profile.EmployeeID;

  useEffect(() => {
    if (employeeId) {
      loadTheme(employeeId);
    }
  }, [employeeId]);
  return (
    <div className="relative">
      {/* Theme Icon */}
      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="
  flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          p-2
          transition
          hover:bg-[#B8E0F5]/70
          sm:h-10
          sm:w-10
        "
      >
        <Palette
          size={18}
          strokeWidth={2}
          color="#1E3A5F"
        />
      </button>

      {/* Popup */}

      {open && (
        <div
          className="
            absolute right-0 top-12 z-50 w-64 rounded-2xl
            border border-slate-200 bg-white p-4 shadow-xl
          "
        >
          {/* Header */}

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-800">
              Presets
            </h3>
            <Sun
              size={18}
              className="text-slate-500"
            />
          </div>

          {/* Theme Colors */}

          <div className="grid grid-cols-4 gap-3">
            {colors.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  applyTheme(item.key, employeeId);
                  setOpen(false);
                }}
                className="
                  h-14 overflow-hidden rounded-lg border border-slate-200
                  transition hover:scale-105
                "
                style={{
                  background: `linear-gradient(
                    135deg,
                    ${item.color} 0%,
                    ${item.color} 94%,
                    white 94%,
                    white 96%,
                    ${item.color} 96%
                  )`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}