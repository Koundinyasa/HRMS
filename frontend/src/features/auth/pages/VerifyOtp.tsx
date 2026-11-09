import { useEffect } from "react";
import { BarChart2, Clock, Mail, TrendingUp, User } from "lucide-react";

import loginIllustration from "../../../assets/images/image(20261109-105952).png";
import { hidePageLoader } from "@/features/employee/employeeSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";

import VerifyOtpForm from "../components/VerifyOtpForm";

const U: React.CSSProperties = { fontFamily: "Urbanist, sans-serif" };

function VerifyOtp() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hidePageLoader());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <main className="grid min-h-screen grid-cols-1 lg:h-full lg:min-h-0 lg:grid-cols-2">
        <section className="flex flex-col px-6 py-6 sm:px-12 lg:min-h-0 lg:px-[clamp(48px,8vw,120px)] lg:py-6">
          <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col">
            <div className="flex items-center gap-2">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 to-blue-500 shadow-md shadow-blue-200">
                <User className="text-white" size={16} />
              </div>
              <span
                className="text-[11px] font-bold uppercase tracking-widest text-slate-800"
                style={U}
              >
                HRMS
              </span>
            </div>

            <div className="mt-12 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-[#3158db] lg:mt-[clamp(72px,15vh,120px)]">
              <Mail size={20} />
            </div>

            <div className="mt-5">
              <p
                className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#3158db]"
                style={U}
              >
                <span className="h-px w-5 bg-rose-400" />
                Account verification
              </p>
              <h1
                className="text-[clamp(40px,3.2vw,52px)] font-bold leading-[1] tracking-tight text-[#17244f]"
                style={{
                  fontFamily:
                    'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                }}
              >
                Check email
              </h1>
              <p
                className="mt-3 max-w-[390px] text-[13px] leading-relaxed text-slate-600"
                style={U}
              >
                Enter the OTP you received at your registered email address.
              </p>
            </div>

            <VerifyOtpForm />

            <p
              className="mt-6 text-left text-[10px] text-slate-500 lg:mt-auto"
              style={U}
            >
              Powered by{" "}
              <strong className="text-[#17244f]">KOUNDINYASA</strong> Technology
              Services
            </p>
          </div>
        </section>

        <aside className="relative flex min-h-[520px] flex-col overflow-hidden bg-[#eef1ff] px-8 pb-4 pt-12 sm:px-12 lg:min-h-0 lg:px-[clamp(36px,5vw,76px)] lg:pt-[clamp(36px,6vh,64px)]">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-[clamp(100px,9vw,140px)] lg:block"
            viewBox="0 0 140 1000"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0 H105 C135 120 140 210 115 310 C90 405 55 470 65 560 C75 660 125 720 115 820 C105 900 105 950 125 1000 H0 Z"
              fill="#FFFFFF"
            />
          </svg>

          <div className="relative z-10 mx-auto w-full max-w-[560px]">
            <h2
              className="text-[30px] font-bold leading-[1.08] tracking-tight text-[#17244f] sm:text-[36px]"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              People-first HR,
              <br />
              <span className="text-[#3158db]">all in one place.</span>
            </h2>
            <p
              className="mt-3 max-w-[460px] text-[12px] leading-relaxed text-slate-600 sm:text-[13px]"
              style={U}
            >
              Manage your workforce, payroll, attendance, and performance, all
              from one unified platform.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { icon: <BarChart2 size={12} />, label: "Payroll" },
                { icon: <Clock size={12} />, label: "Attendance" },
                { icon: <TrendingUp size={12} />, label: "Analytics" },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d8def4] bg-white/80 px-3 py-1.5 text-[10px] font-medium text-[#273b78] shadow-sm"
                  style={U}
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </div>

          <img
            src={loginIllustration}
            alt="HR dashboard illustration showing leave, attendance, and payroll"
            className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[64%] w-full -translate-x-1/2 object-contain object-bottom"
          />
        </aside>
      </main>
    </div>
  );
}

export default VerifyOtp;
