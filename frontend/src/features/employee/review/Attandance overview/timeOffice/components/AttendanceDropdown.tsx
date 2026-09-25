import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";

import type {
  AttendanceDropdownProps,
  AttendanceDropdownItemProps,
} from "../types/attendanceOverview.types";

const widthClassToPx: Record<string, number> = {
  "w-36": 144,
  "w-56": 224,
  "w-64": 256,
  "w-72": 288,
};

export function AttendanceDropdownItem({
  active,
  onClick,
  children,
}: AttendanceDropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50 ${
        active
          ? "font-semibold text-sky-700"
          : "text-slate-600"
      }`}
    >
      {children}

      {active && (
        <Check className="h-3.5 w-3.5 font-[Urbanist]" />
      )}
    </button>
  );
}

export default function AttendanceDropdown({
  trigger,
  children,
  align = "left",
  widthClass = "w-56",
}: AttendanceDropdownProps) {
  const [open, setOpen] =
    useState(false);

  const triggerRef =
    useRef<HTMLDivElement>(null);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const [position, setPosition] =
    useState<{
      top: number;
      left: number;
    } | null>(null);

  const width =
    widthClassToPx[widthClass] ??
    224;

  const updatePosition =
    () => {
      if (!triggerRef.current)
        return;

      const rect =
        triggerRef.current.getBoundingClientRect();

      const margin = 8;

      let left =
        align === "right"
          ? rect.right - width
          : rect.left;

      left = Math.min(
        Math.max(left, margin),
        window.innerWidth -
          width -
          margin,
      );

      const top = Math.min(
        rect.bottom + 8,
        window.innerHeight - 40,
      );

      setPosition({
        top,
        left,
      });
    };

  useEffect(() => {
    if (!open) return;

    const handleMouseDown =
      (event: MouseEvent) => {
        const target =
          event.target as Node;

        if (
          !triggerRef.current?.contains(
            target,
          ) &&
          !menuRef.current?.contains(
            target,
          )
        ) {
          setOpen(false);
        }
      };

    const handleKeyDown =
      (event: KeyboardEvent) => {
        if (
          event.key === "Escape"
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleMouseDown,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleMouseDown,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    updatePosition();

    window.addEventListener(
      "resize",
      updatePosition,
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePosition,
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true,
      );
    };
  }, [open]);

  return (
    <div
      ref={triggerRef}
      className="relative shrink-0 font-[Urbanist]"
    >
      {trigger(
        open,
        () => setOpen((value) => !value),
      )}

      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            className={`fixed z-[100] ${widthClass} max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl`}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  );
}
