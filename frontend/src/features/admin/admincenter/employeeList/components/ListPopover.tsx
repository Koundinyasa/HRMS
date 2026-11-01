import { useEffect, useRef, useState, type ReactNode } from "react";

interface ListPopoverProps {
  /** The button that opened it; the popover sits just below. */
  anchor: HTMLElement | null;
  width?: number;
  onClose: () => void;
  children: ReactNode;
}

/** A small floating panel under a button. Closes on outside click or Escape. */
export default function ListPopover({ anchor, width = 240, onClose, children }: ListPopoverProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchor) return;

    const place = () => {
      const rect = anchor.getBoundingClientRect();
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
      setPosition({ top: rect.bottom + 6, left });
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);

    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [anchor, width]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      // A click on the opening button is handled by the button itself.
      if (ref.current?.contains(target) || anchor?.contains(target)) return;
      onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [anchor, onClose]);

  if (!anchor) return null;

  return (
    <div
      ref={ref}
      className="fixed z-[9999] overflow-hidden rounded-lg border border-[#E2E2E2] bg-white shadow-[0_10px_30px_rgba(19,19,19,0.14)]"
      style={{ top: position.top, left: position.left, width }}
    >
      {children}
    </div>
  );
}
