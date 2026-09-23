// import DateRangePicker from "../components/DateRangePicker";
// import CandidateStats from "../components/CandidateStats";
// import StatisticsChart from "../components/StatisticsChart";
// import PreOnboardPageShell from "../components/PreOnboardPageShell";

// export default function Dashboard() {
//   return (
//     <PreOnboardPageShell>
//       <div className="w-full min-w-0 px-4 pb-8 pt-4 sm:px-5 md:px-6">

//         {/* Analytics Header */}
//         <div className="flex w-full items-center justify-between gap-4">
//           <h1 className="whitespace-nowrap text-xl font-semibold text-slate-800">
//             Onboarding Analytics
//           </h1>

//           <DateRangePicker />
//         </div>

//         {/* Statistics Cards */}
//         <CandidateStats />

//         {/* Onboarding Trends */}
//         <StatisticsChart />

//       </div>
//     </PreOnboardPageShell>
//   );
// }
import DateRangePicker from "../components/DateRangePicker";
import CandidateStats from "../components/CandidateStats";
import StatisticsChart from "../components/StatisticsChart";
import PreOnboardPageShell from "../components/PreEnrollmentPageShell";

export default function Dashboard() {
  return (
    <PreOnboardPageShell>
      <div
        className="
          w-full
          min-w-0
          px-3
          pb-6
          pt-2
          font-urbanist
          sm:px-4
          sm:pb-8
          sm:pt-3
          md:px-5
          md:pt-4
          lg:px-6
          lg:pt-5
          xl:px-7
        "
      >
        {/* ================================================== */}
        {/* ANALYTICS HEADER */}
        {/* ================================================== */}

        <div
          className="
            flex
            w-full
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:gap-4
          "
        >
          {/* Page Title - Display / Heading */}

          <h1
            className="
              whitespace-nowrap
              font-urbanist
              text-2xl
              font-bold
              leading-8
              tracking-tight
              text-slate-800
            "
          >
            Onboarding Analytics
          </h1>

          {/* Date Picker */}

          <div
            className="
              w-full
              font-urbanist
              sm:w-auto
              sm:shrink-0
            "
          >
            <DateRangePicker />
          </div>
        </div>

        {/* ================================================== */}
        {/* STATISTICS CARDS */}
        {/* ================================================== */}

        <div
          className="
            mt-4
            w-full
            min-w-0
            font-urbanist
            sm:mt-5
            md:mt-6
          "
        >
          <CandidateStats />
        </div>

        {/* ================================================== */}
        {/* ONBOARDING TRENDS */}
        {/* ================================================== */}

        <div
          className="
            mt-4
            w-full
            min-w-0
            font-urbanist
            sm:mt-5
            md:mt-6
          "
        >
          <StatisticsChart />
        </div>
      </div>
    </PreOnboardPageShell>
  );
}