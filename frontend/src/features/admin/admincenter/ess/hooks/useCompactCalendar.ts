import { useEffect } from "react";

// =====================================================
// useCompactCalendar
// -----------------------------------------------------
// Makes the calendar popup of "@/components/ui/datepicker"
// smaller on ESS pages WITHOUT changing datepicker.tsx.
//
// While a date picker is open, it finds the calendar popup
// (the positioned box that holds the 28+ day numbers and no
// input fields) and shrinks it with the CSS `scale` property.
// `scale` keeps text sharp, keeps clicks accurate, and does
// not override any transform/animation the popup already has.
//
// Shared across every ESS module (Circular, Notification,
// Poll, Policy, HelpDesk) that opens a date picker — keep
// this as the single source instead of copy-pasting it.
// =====================================================

const MARK = "data-ess-compact-calendar";
const DAY_TEXT = /^(?:[1-9]|[12]\d|3[01])$/;
const MIN_DAY_CELLS = 28;

const isPositioned = (el: Element) => {
  const position = window.getComputedStyle(el).position;
  return position === "absolute" || position === "fixed";
};

const findCalendarPopups = (): HTMLElement[] => {
  const counts = new Map<HTMLElement, number>();

  document.body
    .querySelectorAll<HTMLElement>("button, td, span, div, p")
    .forEach((el) => {
      if (el.childElementCount !== 0) return;
      if (!DAY_TEXT.test((el.textContent || "").trim())) return;

      // nearest absolutely/fixed positioned ancestor = the popup
      let node: HTMLElement | null = el.parentElement;
      while (node && node !== document.body && !isPositioned(node)) {
        node = node.parentElement;
      }
      if (!node || node === document.body) return;

      counts.set(node, (counts.get(node) || 0) + 1);
    });

  return [...counts.entries()]
    .filter(
      ([popup, count]) =>
        count >= MIN_DAY_CELLS &&
        // never touch a modal/form: the calendar has no inputs
        !popup.querySelector("input, textarea, select")
    )
    .map(([popup]) => popup);
};

export function useCompactCalendar(open: boolean, scale = 0.82) {
  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    const apply = () => {
      findCalendarPopups().forEach((popup) => {
        if (popup.getAttribute(MARK) === String(scale)) return;

        // shrink toward the input (top), and toward the right
        // edge if the popup is pushed against the screen edge
        const rect = popup.getBoundingClientRect();
        const alignedRight = rect.right > window.innerWidth - 16;

        popup.style.transformOrigin = `top ${alignedRight ? "right" : "left"}`;
        popup.style.setProperty("scale", String(scale));
        popup.setAttribute(MARK, String(scale));
      });
    };

    const frame = window.requestAnimationFrame(apply);

    // the popup can re-render (month change, re-mount)
    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [open, scale]);
}

export default useCompactCalendar;