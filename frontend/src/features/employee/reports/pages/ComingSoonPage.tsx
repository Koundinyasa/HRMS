import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// export default function ComingSoonPage() {
//   return (
//     <div className="flex min-h-full w-full items-center justify-center bg-[#f5f7fb] p-6">
//       <div className="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#eee7ff] via-[#f8f4ff] to-[#e6ffff]">

//         {/* Background decoration */}
//         <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />

//         <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />

//         {/* Content */}
//         <div className="relative z-10 text-center">

//           {/* Launching Soon */}
//           <div className="mb-8 inline-flex rounded-full border border-cyan-400 px-5 py-2">
//             <span className="text-xs font-medium uppercase tracking-[2px] text-cyan-500">
//               Launching Soon
//             </span>
//           </div>

//           {/* Heading */}
//           <h1 className="bg-gradient-to-r from-[#d9d5ff] via-[#7bded8] to-[#3ccbc3] bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl">
//             Something Great
//             <br />
//             Is On Its Way
//           </h1>

//         </div>
//       </div>
//     </div>
//   );
// }

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#f5f7fb] p-6">
      <div className="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#eee7ff] via-[#f8f4ff] to-[#e6ffff]">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="mb-8 inline-flex rounded-full border border-cyan-400 px-5 py-2">
            <span className="text-xs font-medium uppercase tracking-[2px] text-cyan-500">
              Launching Soon
            </span>
          </div>

          <h1 className="bg-gradient-to-r from-[#d9d5ff] via-[#7bded8] to-[#3ccbc3] bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl">
            Something Great
            <br />
            Is On Its Way
          </h1>
        </div>
      </div>
    </div>
  );
}