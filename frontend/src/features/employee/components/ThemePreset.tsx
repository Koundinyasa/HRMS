import { useState } from "react";

import {
  Palette,
  Sun,
} from "lucide-react";

import {
  applyTheme,
  type ThemeName,
} from "./theme";

const colors: {
  key: ThemeName;
  color: string;
}[] = [
    {
      key: "blue",
      color: "#2563EB",
    },
    {
      key: "sky",
      color: "#0EA5E9",
    },
    {
      key: "purple",
      color: "#6D28D9",
    },
    {
      key: "teal",
      color: "#14B8A6",
    },
    {
      key: "pink",
      color: "#C026D3",
    },
    {
      key: "orange",
      color: "#F59E0B",
    },
    {
      key: "red",
      color: "#E11D48",
    },
    {
      key: "slate",
      color: "#607D8B",
    },
  ];

export default function ThemePreset() {
  const [open, setOpen] =
    useState(false);

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
                  applyTheme(item.key);
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