import type { EmptyStateIllustrationsProps } from "../types/attendanceOverview.types";

export default function EmptyStateIllustrations({
  type = "empty",
}: EmptyStateIllustrationsProps) {
  if (type === "confused") {
    return (
      <svg
        width="140"
        height="120"
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse
          cx="70"
          cy="110"
          rx="60"
          ry="6"
          fill="#E2E8F0"
        />

        <rect
          x="20"
          y="70"
          width="100"
          height="10"
          rx="2"
          fill="#F59E0B"
        />

        <rect
          x="26"
          y="80"
          width="8"
          height="24"
          fill="#CBD5E1"
        />

        <rect
          x="106"
          y="80"
          width="8"
          height="24"
          fill="#CBD5E1"
        />

        <rect
          x="50"
          y="40"
          width="40"
          height="30"
          rx="3"
          fill="#94A3B8"
        />

        <rect
          x="54"
          y="44"
          width="32"
          height="20"
          rx="2"
          fill="#60A5FA"
        />

        <circle
          cx="70"
          cy="30"
          r="12"
          fill="#3B82F6"
        />

        <rect
          x="60"
          y="42"
          width="20"
          height="20"
          rx="4"
          fill="#2563EB"
        />
      </svg>
    );
  }

  return (
    <svg
      width="140"
      height="120"
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse
        cx="70"
        cy="110"
        rx="60"
        ry="6"
        fill="#E2E8F0"
      />

      <rect
        x="20"
        y="70"
        width="100"
        height="10"
        rx="2"
        fill="#F59E0B"
      />

      <rect
        x="26"
        y="80"
        width="8"
        height="24"
        fill="#CBD5E1"
      />

      <rect
        x="106"
        y="80"
        width="8"
        height="24"
        fill="#CBD5E1"
      />

      <rect
        x="50"
        y="40"
        width="40"
        height="30"
        rx="3"
        fill="#94A3B8"
      />

      <rect
        x="54"
        y="44"
        width="32"
        height="20"
        rx="2"
        fill="#60A5FA"
      />

      <circle
        cx="70"
        cy="30"
        r="12"
        fill="#3B82F6"
      />

      <rect
        x="60"
        y="42"
        width="20"
        height="20"
        rx="4"
        fill="#2563EB"
      />
    </svg>
  );
}
