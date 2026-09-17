// import ExitModuleNavbar from "../components/ExitModuleNavbar";
// import ExitModuleMenu from "../components/ExitModuleMenu";

// export default function ExitModuleHome() {
//   return (
//     // <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6">
//     //   <div className="mx-auto w-full max-w-[1600px]">
//     //  CHANGED

//     <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 p-3 sm:p-4 md:p-6">
//   <div className="mx-auto w-full max-w-[1600px]">
//         <ExitModuleNavbar />
//         <ExitModuleMenu />
//       </div>
//     </div>
//   );
// }


import ExitModuleNavbar from "../components/ExitModuleNavbar";
import ExitModuleMenu from "../components/ExitModuleMenu";

export default function ExitModuleHome() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <ExitModuleNavbar />
        <ExitModuleMenu />
      </div>
    </div>
  );
}