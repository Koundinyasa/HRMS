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
          p-2
          rounded-full
          hover:bg-white/10
          transition
        "
      >
        <Palette
          size={18}
          color="white"
        />
      </button>

      {/* Popup */}

      {open && (
        <div
          className="
            absolute
            right-0
            top-12
            w-64
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-xl
            p-4
            z-50
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
                  h-14
                  rounded-lg
                  border
                  border-slate-200
                  hover:scale-105
                  transition
                  overflow-hidden
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