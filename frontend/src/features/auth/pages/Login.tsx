// import LoginForm from "../components/LoginForm";

// import bgImage from "@/assets/images/background-bg.png";
// import peopleImage from "@/assets/images/people.png";
// import logoImage from "@/assets/images/koundinyasa-logo.png";

// import { BarChart2, Clock, TrendingUp } from "lucide-react";

// export default function Login() {
//   return (
//     <div
//       className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >

//       <div className="flex-1 flex justify-center items-center px-8 py-4">
//         <div className="w-full max-w-[1350px] flex flex-col lg:flex-row items-center justify-center gap-15">
//           {/* LEFT SIDE */}

//           <div className="w-full lg:w-[46%] flex flex-col items-center justify-center">
//             <div className="w-full max-w-[700px] h-[430px] bg-[#000033]/40 border border-white/10 rounded-[28px] backdrop-blur-sm px-10 py-10 text-center flex flex-col items-center justify-center">
//               <h1 className="text-white text-4xl lg:text-5xl font-semibold leading-tight">
//                 People-first HR,
//               </h1>

//               <p className="text-white text-lg mt-6 max-w-[540px]">
//                 Manage your workforce, payroll, attendance and
//                 performance — all from one unified platform.
//               </p>

//               {/* FEATURES */}

//               <div className="flex flex-wrap justify-center gap-4 mt-8">
//                 <div
//                   className="flex items-center gap-2 px-5 py-2 border border-cyan-400 rounded-full text-white">
//                   <BarChart2 size={16} />
//                   Payroll
//                 </div>
//                 <div className="flex items-center gap-2 px-5 py-2 border border-cyan-400 rounded-full text-white">
//                   <Clock size={16} />
//                   Attendance
//                 </div>

//                 <div className="flex items-center gap-2 px-5 py-2 border border-cyan-400 rounded-full text-white">
//                   <TrendingUp size={16} />
//                   Analytics
//                 </div>
//               </div>

//               <p className="text-white text-2xl mt-10">
//                 Powered By
//               </p>

//               <img
//                 src={logoImage}
//                 alt="logo"
//                 className="w-[320px] mt-4 object-contain"
//               />
//             </div>

//             <img
//               src={peopleImage}
//               alt="people"
//               className="w-[260px] sm:w-[320px] lg:w-[420px] mt-4 object-contain"
//             />
//           </div>

//           {/* ── RIGHT SIDE ── */}
//           <div className="w-full lg:w-[54%] flex items-center justify-center py-10">
//             <LoginForm />
//           </div>

//         </div>
//         </div>

//         {/* Footer bar */}
//         <footer className="h-[32px] h-[32px] bg-sky-300 flex items-center justify-center text-[10px] sm:text-xs text-black">
//           © 2026 Koundinyasa Technology Services Pvt. Ltd. All rights reserved. Unauthorized access is strictly prohibited.
//         </footer>
//     </div>
// );
// }

import LoginForm from "../components/LoginForm";

import bgImage from "@/assets/images/background-bg.png";
import peopleImage from "@/assets/images/people.png";
import logoImage from "@/assets/images/koundinyasa-logo.png";

import { BarChart2, Clock, TrendingUp } from "lucide-react";

export default function Login() {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex-1 flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-[1350px] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

          {/* LEFT SIDE — hidden on mobile, visible from lg up */}
          <div className="hidden lg:flex w-full lg:w-[46%] flex-col items-center justify-center">
            <div className="w-full max-w-[600px] bg-[#000033]/40 border border-white/10 rounded-[28px] backdrop-blur-sm px-8 xl:px-10 py-10 text-center flex flex-col items-center justify-center">
              <h1 className="text-white text-4xl xl:text-5xl font-semibold leading-tight">
                People-first HR,
              </h1>
              <p className="text-white text-base xl:text-lg mt-6 max-w-[500px]">
                Manage your workforce, payroll, attendance and
                performance — all from one unified platform.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <div className="flex items-center gap-2 px-4 py-2 border border-cyan-400 rounded-full text-white text-sm">
                  <BarChart2 size={15} /> Payroll
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-cyan-400 rounded-full text-white text-sm">
                  <Clock size={15} /> Attendance
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-cyan-400 rounded-full text-white text-sm">
                  <TrendingUp size={15} /> Analytics
                </div>
              </div>
              <p className="text-white text-xl mt-8">Powered By</p>
              <img
                src={logoImage}
                alt="logo"
                className="w-[260px] xl:w-[320px] mt-4 object-contain"
              />
            </div>
            <img
              src={peopleImage}
              alt="people"
              className="w-[320px] xl:w-[420px] mt-4 object-contain"
            />
          </div>

          {/* RIGHT SIDE — full width on mobile, 54% on desktop */}
          <div className="w-full lg:w-[54%] flex items-center justify-center py-4 lg:py-10">
            {/* On mobile: constrain card width; on desktop: fill the column */}
            <div className="w-full max-w-[500px] sm:max-w-[560px] lg:max-w-full">
              <LoginForm />
            </div>
          </div>

        </div>
      </div>

      <footer className="bg-sky-300 flex items-center justify-center py-2 px-4 text-[10px] sm:text-xs text-black text-center">
        © 2026 Koundinyasa Technology Services Pvt. Ltd. All rights reserved. Unauthorized access is strictly prohibited.
      </footer>
    </div>
  );
}