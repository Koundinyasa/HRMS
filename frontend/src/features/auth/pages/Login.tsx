import LoginForm from "../components/LoginForm";
import loginIllustration from "../../../assets/images/image(20261109-105952).png";
import { BarChart2, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { hidePageLoader } from "@/features/employee/employeeSlice";

function LoginFormSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading login page"
      aria-live="polite"
      aria-busy="true"
      className="w-full animate-pulse space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-slate-200" />
        <div className="h-4 w-16 rounded bg-slate-200" />
      </div>

      <div className="space-y-2">
        <div className="h-8 w-56 max-w-full rounded bg-slate-200" />
        <div className="h-4 w-48 rounded bg-slate-200" />
      </div>

      {[0, 1, 2].map((field) => (
        <div key={field} className="space-y-2">
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-11 w-full rounded-lg bg-slate-100" />
        </div>
      ))}

      <div className="h-11 w-full rounded-lg bg-slate-200" />
    </div>
  );
}

export default function Login() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [showLoginSkeleton, setShowLoginSkeleton] = useState(
    Boolean(
      (location.state as { showLoginSkeleton?: boolean } | null)
        ?.showLoginSkeleton,
    ),
  );

  useEffect(() => {
    dispatch(hidePageLoader());
  }, [dispatch]);

  useEffect(() => {
    if (!showLoginSkeleton) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowLoginSkeleton(false);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [showLoginSkeleton]);

  return (
    <div className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <main className="grid min-h-screen grid-cols-1 lg:h-full lg:min-h-0 lg:grid-cols-2">

        {/* LEFT SIDE - LOGIN FORM */}
        <section className="flex flex-col justify-center px-6 py-6 sm:px-12 lg:min-h-0 lg:justify-start lg:px-[clamp(48px,8vw,120px)] lg:py-6">
          <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center lg:justify-start">
            {showLoginSkeleton ? (
              <LoginFormSkeleton />
            ) : (
              <LoginForm />
            )}
          </div>
        </section>

        {/* RIGHT SIDE - ILLUSTRATION */}
        <aside className="relative flex min-h-[520px] flex-col overflow-hidden bg-[#eef1ff] px-8 pb-4 pt-12 sm:px-12 lg:min-h-0 lg:px-[clamp(36px,5vw,76px)] lg:pt-[clamp(36px,6vh,64px)]">

          {/* MIDDLE CURVED SHAPE */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-[clamp(100px,9vw,140px)] lg:block"
            viewBox="0 0 140 1000"
            preserveAspectRatio="none"
          >
            <path
              d="
                M 0 0
                H 105
                C 135 120, 140 210, 115 310
                C 90 405, 55 470, 65 560
                C 75 660, 125 720, 115 820
                C 105 900, 105 950, 125 1000
                H 0
                Z
              "
              fill="#FFFFFF"
            />
          </svg>

          {/* RIGHT SIDE HEADING */}
          <div className="relative z-10 mx-auto w-full max-w-[560px]">
            <h2
              className="text-[30px] font-bold leading-[1.08] tracking-tight text-[#17244f] sm:text-[36px]"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              People-first HR,
              <br />
              <span className="text-[#3158db]">
                all in one place.
              </span>
            </h2>

            <p className="mt-3 max-w-[460px] text-[16px] leading-relaxed text-slate-600">
              Manage your workforce, payroll, attendance, and performance, all
              from one unified platform.
            </p>

            {/* FEATURE BADGES */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { icon: <BarChart2 size={12} />, label: "Payroll" },
                { icon: <Clock size={12} />, label: "Attendance" },
                { icon: <TrendingUp size={12} />, label: "Analytics" },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d8def4] bg-white/80 px-3 py-1.5 text-[16px] font-medium text-[#273b78] shadow-sm"
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* HRMS ILLUSTRATION */}
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
