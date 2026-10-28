// import { Bell, Search } from "lucide-react";

// export default function DashboardHeader() {
//   return (
//     <div className="flex flex-col gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-4 sm:gap-4 sm:p-4 md:flex-row md:items-center md:justify-between md:p-5 md:mb-5">
//       {/* Title Section */}
//       <div className="min-w-0 flex-shrink-0">
//         <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
//           Pre Onboard
//         </h1>

//         <p className="text-xs text-gray-500 mt-1 sm:text-sm">
//           Manage candidates before employee onboarding.
//         </p>
//       </div>

//       {/* Right Section */}
//       <div className="flex flex-col gap-2 items-stretch sm:flex-row sm:items-center sm:gap-3 md:gap-4 md:ml-auto">
//         {/* Search Input */}
//         <div className="relative flex-1 sm:flex-none">
//           <Search
//             size={16}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:size-4"
//           />

//           <input
//             type="text"
//             placeholder="Search Candidate..."
//             className="w-full pl-9 pr-3 py-2 sm:pl-10 sm:pr-4 sm:w-48 md:w-64 lg:w-72 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Bell Icon */}
//         <button className="relative p-2 rounded-lg border border-gray-300 hover:bg-gray-100 flex-shrink-0">
//           <Bell size={18} className="sm:size-5" />

//           <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
//         </button>

//         {/* Profile Section */}
//         <div className="hidden sm:flex items-center gap-2 md:gap-3 flex-shrink-0">
//           <img
//             src="https://i.pravatar.cc/40"
//             alt="Profile"
//             className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
//           />

//           <div className="min-w-0">
//             <h4 className="text-xs font-semibold text-gray-800 sm:text-sm">
//               Admin User
//             </h4>

//             <p className="text-xs text-gray-500">
//               HR Administrator
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Bell, Search } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-4 sm:gap-4 sm:p-4 md:flex-row md:items-center md:justify-between md:p-5 md:mb-5">
      {/* Title Section */}
      <div className="min-w-0 flex-shrink-0">
        {/* Display */}
        <h1 className="font-urbanist text-2xl font-bold leading-tight tracking-tight text-gray-800 sm:text-[28px]">
          Pre Onboard
        </h1>

        {/* Subheading */}
        <p className="font-urbanist text-sm font-medium leading-5 text-gray-500 mt-1">
          Manage candidates before employee onboarding.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-col gap-2 items-stretch sm:flex-row sm:items-center sm:gap-3 md:gap-4 md:ml-auto">
        {/* Search Input */}
        <div className="relative flex-1 sm:flex-none">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:size-4"
          />

          {/* Utility / UI */}
          <input
            type="text"
            placeholder="Search Candidate..."
            className="font-urbanist w-full pl-9 pr-3 py-2 sm:pl-10 sm:pr-4 sm:w-48 md:w-64 lg:w-72 rounded-lg border border-gray-300 text-sm font-medium leading-5 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bell Icon */}
        <button className="relative p-2 rounded-lg border border-gray-300 hover:bg-gray-100 flex-shrink-0">
          <Bell size={18} className="sm:size-5" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>

        {/* Profile Section */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3 flex-shrink-0">
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />

          <div className="min-w-0">
            {/* Label */}
            <h4 className="font-urbanist text-sm font-semibold leading-5 text-gray-800">
              Admin User
            </h4>

            {/* Utility / UI */}
            <p className="font-urbanist text-xs font-medium leading-4 text-gray-500">
              HR Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}