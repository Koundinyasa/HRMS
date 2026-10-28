// import { Outlet } from "react-router-dom";
// import SettingsTabs from "../components/SettingsTabs";

// export default function SettingsPage() {
//   return (
//     <div className="space-y-6 p-6">
//       <SettingsTabs />
//       <Outlet />
//     </div>
//   );
// }



// import { Outlet } from "react-router-dom";
// import SettingsTabs from "../components/SettingsTabs";

// export default function SettingsPage() {
//   return (
//     <div className="space-y-4 p-3 sm:space-y-6 sm:p-6">
//       <SettingsTabs />
//       <Outlet />
//     </div>
//   );
// }\




// import { Outlet } from "react-router-dom";
// import SettingsTabs from "../components/SettingsTabs";

// export default function SettingsPage() {
//   return (
//     <div className="space-y-4 p-3 sm:space-y-6 sm:p-6">
//       <SettingsTabs />
//       <Outlet />
//     </div>
//   );
// }



import { Outlet } from "react-router-dom";
import SettingsTabs from "../components/SettingsTabs";

export default function SettingsPage() {
  return (
    <div
      className="
        w-full
        min-w-0
        space-y-4
        p-2
        sm:space-y-5
        sm:p-4
        lg:space-y-6
        lg:p-6
      "
    >
      <SettingsTabs />

      <div className="min-w-0 w-full">
        <Outlet />
      </div>
    </div>
  );
}