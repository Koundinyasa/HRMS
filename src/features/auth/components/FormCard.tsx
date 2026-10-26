import type { ReactNode } from "react";

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

interface FormCardProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function FormCard({ icon, title, subtitle, children }: FormCardProps) {
  return (
    <div
      className="w-full flex flex-col bg-white"
      style={{
        borderRadius: "clamp(20px, 2vw, 28px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.11), 0 1px 3px rgba(0,0,0,0.05)",
        padding: "clamp(24px, 3vw, 36px) clamp(20px, 4vw, 40px) clamp(20px, 2.5vw, 28px)",
      }}
    >
      {/* Icon */}
      {icon && (
        <div className="flex justify-center mb-5">
          <div
            className="flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "#C8EEF3",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            }}
          >
            {icon}
          </div>
        </div>
      )}

      {/* Title + subtitle */}
      <div className={`${icon ? "text-center" : ""} mb-5`}>
        <h2
          style={{
            ...U,
            fontWeight: 500,
            fontSize: "clamp(20px, 2vw, 28px)",
            color: "#0F172A",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mt-2"
            style={{
              ...U,
              fontSize: "clamp(11px, 0.85vw, 13px)",
              color: "#6B7280",
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Form content */}
      <div className="flex flex-col flex-1">
        {children}
      </div>

      {/* Powered by — always at bottom */}
      <p
        className="text-center mt-6 pt-4 border-t border-slate-100"
        style={{ ...U, fontSize: 11, color: "#9CA3AF" }}
      >
        Powered by{" "}
        <span style={{ fontWeight: 700, color: "#067EF1" }}>KOUNDINYASA</span>{" "}
        Technology Services
      </p>
    </div>
  );
}