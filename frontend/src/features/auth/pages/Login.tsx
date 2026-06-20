import LoginForm from "../components/LoginForm";

import bgImage from "@/assets/images/background-bg.png";
import peopleImage from "@/assets/images/people.png";
import logoImage from "@/assets/images/koundinyasa-logo.png";

import { BarChart2, Clock, TrendingUp } from "lucide-react";

export default function Login() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-[1500px] mx-auto grid lg:grid-cols-[55%_45%] min-h-screen">

        {/* ── LEFT SIDE ── */}
        <div className="relative min-h-screen">

          {/* Glass card — compact size, top-anchored */}
          <div
            className="absolute border border-white/20 bg-white/10 backdrop-blur-sm shadow-xl text-white"
            style={{
              width: "500px",
              top: "60px",
              left: "40px",
              borderRadius: "20px",
              padding: "32px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "28px",
            }}
          >
            {/* Heading + subtitle + pills */}
            <div className="flex flex-col items-center" style={{ gap: "14px" }}>
              <h1
                style={{
                  fontFamily: "Urbanist, sans-serif",
                  fontWeight: 600,
                  fontSize: "40px",
                  lineHeight: "65px",
                  textAlign: "center",
                  color: "#FFFFFF",
                  margin: 0,
                }}
              >
                People-first HR,
              </h1>

              <p
                style={{
                  fontFamily: "Urbanist, sans-serif",
                  fontWeight: 600,
                  fontSize: "17px",
                  lineHeight: "28px",
                  textAlign: "center",
                  color: "#DDDDDD",
                  margin: 0,
                }}
              >
                Manage your workforce, payroll, attendance, and performance —
                all from one unified platform.
              </p>

              {/* Feature pills */}
              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                {[
                  { label: "Payroll", Icon: BarChart2 },
                  { label: "Attendance", Icon: Clock },
                  { label: "Analytics", Icon: TrendingUp },
                ].map(({ label, Icon }) => (
                  <div
                    key={label}
                    className="flex items-center text-white/90"
                    style={{
                      height: "30px",
                      borderRadius: "9999px",
                      padding: "5px 14px 5px 10px",
                      gap: "5px",
                      border: "0.75px solid rgba(255,255,255,0.45)",
                      fontSize: "12px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Icon size={12} strokeWidth={1.8} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Powered By + logo */}
            <div className="flex flex-col items-center" style={{ gap: "10px" }}>
              <p
                style={{
                  fontFamily: "Urbanist, sans-serif",
                  fontWeight: 400,
                  fontSize: "18px",
                  lineHeight: "24px",
                  color: "#FFFFFF",
                  margin: 0,
                }}
              >
                Powered By
              </p>
              <img
                src={logoImage}
                alt="Koundinyasa logo"
                style={{ width: "280px", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* People silhouette — pinned to bottom-left */}
          <img
            src={peopleImage}
            alt="Team silhouette"
            className="absolute bottom-10 left-4"
            style={{ width: "520px", maxWidth: "90%" }}
          />
        </div>

        {/* ── RIGHT SIDE ── */}
        <div className="flex items-center justify-center py-10">
          <LoginForm />
        </div>

      </div>

      {/* Footer bar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-sky-400 flex items-center justify-center text-white text-xs font-medium">
        © 2026 Koundinyasa Technology Services Pvt. Ltd. All rights reserved · Unauthorized access is strictly prohibited.
      </div>
    </div>
  );
}