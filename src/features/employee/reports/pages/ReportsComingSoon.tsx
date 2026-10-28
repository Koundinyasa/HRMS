import ReportsNavbar from "../components/ReportsNavbar";

export default function ReportsComingSoon() {
  return (
    <div className="space-y-4">
      <ReportsNavbar />

      <div className="bg-[#f7f9fc] p-4 sm:p-[22px]">
        <section className="flex min-h-[460px] items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-[#eee4ff] via-[#f5f5ff] to-[#d9fbfa] px-6 py-16 text-center">
          <div>
            <span className="mb-8 inline-flex rounded-full border border-[#35c9e9] px-5 py-2 text-[11px] font-medium uppercase tracking-[2px] text-[#25bfe0]">
              Launching Soon
            </span>

            <h1 className="bg-gradient-to-r from-[#c6c7ff] via-[#7bd9d5] to-[#35cfc2] bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-[42px]">
              Something Great
              <br />
              Is On Its Way
            </h1>
          </div>
        </section>
      </div>
    </div>
  );
}
