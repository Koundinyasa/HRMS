
import LoginForm from "../components/LoginForm";
import bgImage from "@/assets/images/background-bg.png";
import peopleImage from "@/assets/images/people.png";
import logoImage from "@/assets/images/koundinyasa-logo.png";
import { BarChart2, Clock, TrendingUp } from "lucide-react";
import { useEffect } from "react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { hidePageLoader } from "@/features/employee/employeeSlice";

const urbanist: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

export default function Login() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hidePageLoader());
  }, [dispatch]);
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* ── Main content ── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-6">
        <div
          className="w-full flex flex-col lg:flex-row items-center justify-center"
          style={{ maxWidth: 1320, gap: "clamp(24px, 4vw, 56px)" }}
        >

          {/* ════ LEFT PANEL — hidden on mobile, visible lg+ ════ */}
          <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] flex-col items-center">

            {/* Glassmorphism info card */}
            <div
              className="w-full flex flex-col items-center text-center"
              style={{
                background: "rgba(0, 0, 51, 0.45)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "clamp(18px, 2vw, 28px)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                padding: "clamp(32px, 4vw, 52px) clamp(28px, 4vw, 48px)",
              }}
            >
              <h1
                style={{
                  ...urbanist,
                  fontWeight: 600,
                  fontSize: "clamp(28px, 3.2vw, 46px)",
                  lineHeight: 1.15,
                  color: "#FFFFFF",
                }}
              >
                People-first HR,
              </h1>

              <p
                style={{
                  ...urbanist,
                  fontWeight: 400,
                  fontSize: "clamp(13px, 1.1vw, 17px)",
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1.6,
                  marginTop: "clamp(16px, 2vw, 24px)",
                  maxWidth: 460,
                }}
              >
                Manage your workforce, payroll, attendance, and
                performance — all from one unified platform.
              </p>

              {/* Feature pills */}
              <div
                className="flex flex-wrap justify-center"
                style={{ gap: "clamp(8px, 1vw, 12px)", marginTop: "clamp(20px, 2.5vw, 32px)" }}
              >
                {[
                  { icon: <BarChart2 size={14} />, label: "Payroll" },
                  { icon: <Clock size={14} />, label: "Attendance" },
                  { icon: <TrendingUp size={14} />, label: "Analytics" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2"
                    style={{
                      padding: "6px 18px",
                      border: "1px solid rgba(34,211,238,0.70)",
                      borderRadius: 9999,
                      color: "#FFFFFF",
                      ...urbanist,
                      fontSize: "clamp(11px, 0.85vw, 14px)",
                      fontWeight: 400,
                    }}
                  >
                    {icon}
                    {label}
                  </div>
                ))}
              </div>

              {/* Powered By + logo */}
              <p
                style={{
                  ...urbanist,
                  fontWeight: 400,
                  fontSize: "clamp(14px, 1.1vw, 18px)",
                  color: "#FFFFFF",
                  marginTop: "clamp(24px, 3vw, 36px)",
                }}
              >
                Powered By
              </p>
              <img
                src={logoImage}
                alt="Koundinyasa Technology Services"
                style={{
                  width: "clamp(200px, 22vw, 300px)",
                  marginTop: "clamp(10px, 1.2vw, 16px)",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* People illustration — sits below the card, slightly overlapping visually */}
            <img
              src={peopleImage}
              alt="HR team illustration"
              style={{
                width: "clamp(260px, 28vw, 400px)",
                marginTop: "clamp(12px, 1.5vw, 20px)",
                objectFit: "contain",
              }}
            />
          </div>

          {/* ════ RIGHT PANEL — full width on mobile, 54% on desktop ════ */}
          <div className="w-full lg:w-[54%] xl:w-[56%] flex items-center justify-center py-2 lg:py-6">
            <div
              className="w-full"
              style={{ maxWidth: "clamp(320px, 90vw, 540px)" }}
            >
              <LoginForm />
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer bar ── */}
      <footer
        className="flex items-center justify-center text-center"
        style={{
          background: "#7DD3F0",
          padding: "8px 16px",
          ...urbanist,
          fontSize: "clamp(9px, 0.75vw, 11px)",
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
