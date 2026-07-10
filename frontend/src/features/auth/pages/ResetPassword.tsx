import backgroundImg from "@/assets/images/background-bg.png";
import logoImg from "@/assets/images/koundinyasa-logo.png";
import peopleImg from "@/assets/images/people.png";
import {BarChart3,Clock3,TrendingUp,KeyRound} from "lucide-react";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useEffect } from "react";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { hidePageLoader } from "../../employee/employeeSlice";

function ResetPassword() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hidePageLoader());
  }, [dispatch]);
  return (
    <div
      className="h-screen flex flex-col bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImg})`,
      }}
    >
      <div className="flex-1 flex justify-center items-center px-8 py-4">
        <div
          className="
            w-full
            max-w-[1350px]
            flex
            flex-col
            lg:flex-row
            items-center
            justify-center
            gap-15
          "
        >
          {/* LEFT SIDE */}

          <div className="w-full lg:w-[46%] flex flex-col items-center justify-center">
            <div
              className="
                w-full
                max-w-[700px]
                h-[430px]
                bg-[#000033]/40
                border
                border-white/10
                rounded-[28px]
                backdrop-blur-sm
                px-10
                py-10
                text-center
                flex
                flex-col
                items-center
                justify-center
              "
            >
              <h1 className="text-white text-4xl lg:text-5xl font-semibold leading-tight">
                People-first HR,
              </h1>

              <p className="text-white text-lg mt-6 max-w-[540px]">
                Manage your workforce, payroll,
                attendance and performance —
                all from one unified platform.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="flex items-center gap-2 px-5 py-2 border border-cyan-400 rounded-full text-white">
                  <BarChart3 size={16} />
                  Payroll
                </div>

                <div className="flex items-center gap-2 px-5 py-2 border border-cyan-400 rounded-full text-white">
                  <Clock3 size={16} />
                  Attendance
                </div>

                <div className="flex items-center gap-2 px-5 py-2 border border-cyan-400 rounded-full text-white">
                  <TrendingUp size={16} />
                  Analytics
                </div>
              </div>

              <p className="text-white text-2xl mt-10">
                Powered By
              </p>

              <img
                src={logoImg}
                alt="logo"
                className="w-[320px] mt-4 object-contain"
              />
            </div>

            <img
              src={peopleImg}
              alt="people"
              className="
                w-[260px]
                sm:w-[320px]
                lg:w-[420px]
                mt-4
                object-contain
              "
            />
          </div>

          {/* RIGHT SIDE */}

          <div
            className="
              w-full
              max-w-[500px]
              h-[720px]
              bg-white
              rounded-[32px]
              px-8
              py-10
              shadow-xl
              flex
              flex-col
            "
          >
            <div className="flex justify-center">
              <div
                className="
                  w-[58px]
                  h-[58px]
                  rounded-full
                  bg-[#C8EEF3]
                  flex
                  items-center
                  justify-center
                  shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                "
              >
                <KeyRound
                  size={22}
                  strokeWidth={2.5}
                  className="text-[#1E293B]"
                />
              </div>
            </div>

            <div className="text-center mt-8">
              <h2 className="text-4xl font-normal">
                Set new password
              </h2>

              <p className="text-gray-600 mt-4">
                Your new password must be
                different from previously used
                passwords
              </p>
            </div>

            <div className="mt-10">
              <ResetPasswordForm />
            </div>

            <div className="mt-auto text-center text-sm text-gray-500">
              Powered by
              <span className="text-blue-600 ml-1 font-semibold">
                KOUNDINYASA
              </span>
              <span className="ml-1">
                Technology Services
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer className="h-[32px] bg-sky-300 flex items-center justify-center text-[10px] sm:text-xs text-black">
        © 2026 Koundinyasa Technology Services Pvt. Ltd. All rights reserved. Unauthorized access is strictly prohibited.
      </footer>
    </div>
  );
}

export default ResetPassword;