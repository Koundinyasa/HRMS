import backgroundImg from "@/assets/images/background-bg.png";
import logoImg from "@/assets/images/koundinyasa-logo.png";
import peopleImg from "@/assets/images/people.png";
import { BarChart2, Clock, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

const PILLS = [
  { icon: <BarChart2 size={13} />, label: "Payroll" },
  { icon: <Clock size={13} />, label: "Attendance" },
  { icon: <TrendingUp size={13} />, label: "Analytics" },
];

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* ── Main content ── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-6 lg:py-10">
        <div className="w-full max-w-[1320px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

          {/* ════ LEFT PANEL — hidden on mobile ════ */}
          <div className="hidden lg:flex lg:w-[50%] flex-col items-center">

            {/* Glass card */}
            <div
              className="w-full max-w-[600px] rounded-[28px] overflow-hidden"
              style={{
                border: "1.5px solid rgba(255,255,255,0.40)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 8px 40px rgba(0,0,20,0.55)",
              }}
            >
              <div
                className="px-10 xl:px-14 py-10 flex flex-col items-center text-center"
                style={{
                  background: "rgba(0, 0, 40, 0.55)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
                <h1
                  className="text-white font-semibold leading-tight"
                  style={{ ...U, fontSize: "clamp(26px, 2.8vw, 44px)" }}
                >
                  People-first HR,
                </h1>

                <p
                  className="text-white/80 mt-4 max-w-[420px] leading-relaxed"
                  style={{ ...U, fontSize: "clamp(12px, 0.95vw, 15px)" }}
                >
                  Manage your workforce, payroll, attendance, and
                  performance — all from one unified platform.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center gap-2.5 mt-6">
                  {PILLS.map(({ icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 text-white"
                      style={{
                        ...U,
                        padding: "5px 16px",
                        border: "1px solid rgba(34,211,238,0.65)",
                        borderRadius: 9999,
                        fontSize: "clamp(10px, 0.8vw, 13px)",
                      }}
                    >
                      {icon}
                      {label}
                    </div>
                  ))}
                </div>

                <p
                  className="text-white/85 mt-8"
                  style={{ ...U, fontSize: "clamp(13px, 1vw, 17px)" }}
                >
                  Powered By
                </p>
                <img
                  src={logoImg}
                  alt="Koundinyasa Technology Services"
                  className="mt-3 object-contain"
                  style={{ width: "clamp(180px, 19vw, 260px)" }}
                />
              </div>
            </div>

            {/* People image — outside glass */}
            <img
              src={peopleImg}
              alt="HR team illustration"
              className="object-contain mt-5"
              style={{ width: "clamp(220px, 24vw, 380px)" }}
            />
          </div>

          {/* ════ RIGHT PANEL — form slot ════ */}
          <div className="w-full lg:w-[50%] flex items-center justify-center">
            <div className="w-full" style={{ maxWidth: "clamp(300px, 88vw, 490px)" }}>
              {children}
            </div>
          </div>

        </div>
      </div>

      {/* ── Cyan footer bar ── */}
      <footer
        className="flex items-center justify-center text-center px-4 py-2 shrink-0"
        style={{
          ...U,
          background: "#7DD3F0",
          fontSize: "clamp(9px, 0.7vw, 11px)",
          color: "#0F172A",
          fontWeight: 400,
        }}
      >
        © 2026 Koundinyasa Technology Services Pvt. Ltd. All rights reserved.
        &nbsp;·&nbsp; Unauthorized access is strictly prohibited.
      </footer>
    </div>
  );
}