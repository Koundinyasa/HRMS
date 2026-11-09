import { Check, IndianRupee, UserRound } from "lucide-react";
import DomainForm from "../components/DomainForm";
 
function DashboardIllustration() {
    return (
        <div
            aria-hidden="true"
            className="relative flex min-h-[420px] min-w-0 items-center justify-center overflow-hidden px-3 py-10 sm:min-h-[520px] lg:-ml-[2.5vw] lg:min-h-screen lg:pl-[2.5vw]"
            style={{
                background:
                    "radial-gradient(ellipse at 42% 100%, rgba(255, 222, 239, 0.8), transparent 34%), linear-gradient(135deg, #eef2ff 0%, #f1f3ff 100%)",
            }}
        >
            {/* wavy white edge traced from the design; anchored to the big circle so it lines up at any width */}
            <div
                className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden lg:flex"
                style={{ width: "max(77px, calc(50% + 1.25vw - 350px))" }}
            >
                <div className="flex-1 bg-white" />
                <svg
                    className="h-full w-[77px] shrink-0"
                    viewBox="0 0 90 830"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,0 L38,0 L38,0 C38.5,3.3 39.5,13.3 41,20 C42.5,26.7 45.3,33.3 47,40 C48.7,46.7 50.2,53.3 51,60 C51.8,66.7 52.0,71.7 52,80 C52.0,88.3 51.5,101.7 51,110 C50.5,118.3 49.8,123.3 49,130 C48.2,136.7 47.2,143.3 46,150 C44.8,156.7 43.3,163.3 42,170 C40.7,176.7 39.5,183.3 38,190 C36.5,196.7 34.3,203.3 33,210 C31.7,216.7 31.2,223.3 30,230 C28.8,236.7 27.0,243.3 26,250 C25.0,256.7 24.7,263.3 24,270 C23.3,276.7 22.2,283.3 22,290 C21.8,296.7 22.5,303.3 23,310 C23.5,316.7 24.0,323.3 25,330 C26.0,336.7 27.2,343.3 29,350 C30.8,356.7 33.3,363.3 36,370 C38.7,376.7 41.5,383.3 45,390 C48.5,396.7 54.3,404.7 57,410 C59.7,415.3 60.0,413.3 61,422 C62.0,430.7 62.8,447.0 63,462 C63.2,477.0 62.7,493.7 62,512 C61.3,530.3 60.0,552.0 59,572 C58.0,592.0 56.8,612.3 56,632 C55.2,651.7 54.8,675.3 54,690 C53.2,704.7 51.7,710.0 51,720 C50.3,730.0 50.0,740.0 50,750 C50.0,760.0 50.3,771.7 51,780 C51.7,788.3 52.8,793.3 54,800 C55.2,806.7 56.8,815.0 58,820 C59.2,825.0 60.5,828.3 61,830 L0,830 Z"
                        fill="#ffffff"
                    />
                </svg>
            </div>
 
            <div className="absolute right-[7%] top-[9%] text-4xl text-white">✦</div>
            <div className="absolute top-[38%] z-[2] hidden text-lg text-white/80 lg:left-[calc(50%+1.25vw-411px)] lg:block">✦</div>
 
            {/* paper sheets */}
            <div className="absolute bottom-[18%] left-[3%] z-[2] hidden h-[70px] lg:left-[calc(50%+1.25vw-414px)] w-[56px] rotate-[8deg] rounded-md bg-white/90 p-2 shadow-md sm:block">
                <div className="mb-1.5 h-1.5 w-full -rotate-12 rounded-full bg-[#c8d4fb]" />
                <div className="mb-1.5 h-1.5 w-full -rotate-12 rounded-full bg-[#c8d4fb]" />
                <div className="h-1.5 w-2/3 -rotate-12 rounded-full bg-[#c8d4fb]" />
            </div>
            <div className="absolute bottom-[7%] right-[4%] hidden h-[70px] w-[56px] -rotate-[8deg] rounded-md bg-white/90 p-2 shadow-md sm:block">
                <div className="mb-1.5 h-1.5 w-full rotate-12 rounded-full bg-[#c8d4fb]" />
                <div className="mb-1.5 h-1.5 w-full rotate-12 rounded-full bg-[#c8d4fb]" />
                <div className="h-1.5 w-2/3 rotate-12 rounded-full bg-[#c8d4fb]" />
            </div>
 
            <div className="relative z-[2] h-[360px] w-full max-w-[650px] sm:h-[560px] lg:-translate-x-[100px]">
                <div className="absolute left-1/2 top-[calc(50%+22px)] h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#3156df] via-[#5478ef] to-[#7795f7] shadow-[0_35px_80px_rgba(55,83,205,0.22)] sm:h-[540px] sm:w-[540px]" />
                <div className="absolute right-[7%] top-[49%] h-2.5 w-2.5 rounded-full bg-[#ff6b7e]" />
                <div className="absolute hidden h-14 w-14 rounded-full border-[6px] border-[#5f82f2] sm:left-[calc(50%-270px)] sm:top-[250px] sm:block" />
 
                <div className="absolute left-[46%] top-[43%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-white p-3 shadow-[0_24px_50px_rgba(25,42,99,0.2)] sm:w-[60%] sm:p-5">
                    <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ff8c9a]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ffd36e]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#70d0b1]" />
                        </div>
                        <div className="h-2 w-20 rounded-full bg-slate-100" />
                    </div>
                    <div className="flex gap-3">
                        <div className="hidden w-[22%] shrink-0 space-y-3 rounded-xl bg-[#f1f4ff] p-3 sm:block">
                            <div className="h-3 rounded-full bg-[#365ce4]" />
                            <div className="h-2 rounded-full bg-[#c8d4fb]" />
                            <div className="h-2 rounded-full bg-[#c8d4fb]" />
                            <div className="h-2 w-3/4 rounded-full bg-[#c8d4fb]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="h-3 w-1/2 rounded-full bg-[#1d2852]" />
                                <div className="h-2 w-1/4 rounded-full bg-[#c8d4fb]" />
                            </div>
                            <div className="space-y-2">
                                {[
                                    ["bg-[#ff9aa5]", "bg-[#d9f5eb]"],
                                    ["bg-[#8eaafa]", "bg-[#fff0d0]"],
                                    ["bg-[#ff9aa5]", "bg-[#d9f5eb]"],
                                    ["bg-[#8eaafa]", "bg-[#e6eaff]"],
                                ].map(([avatar, status], index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 rounded-lg bg-[#f3f5ff] px-2 py-2 sm:gap-3 sm:px-3"
                                    >
                                        <span className={`h-5 w-5 shrink-0 rounded-full ${avatar}`} />
                                        <span className="h-2 w-1/3 rounded-full bg-[#37436d]" />
                                        <span className="h-2 w-1/5 rounded-full bg-[#ccd6f8]" />
                                        <span className={`ml-auto h-3 w-9 rounded-full ${status}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
 
                <div className="absolute left-0 top-[14%] flex items-center gap-2 rounded-full bg-white px-3 py-2.5 text-xs font-semibold text-[#1d2852] shadow-[0_12px_30px_rgba(25,42,99,0.18)] sm:left-[5%] sm:px-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18845e] text-white">
                        <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    Leave approved
                </div>
 
                <div className="absolute right-[5%] top-[10.5%] flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-[0_15px_35px_rgba(25,42,99,0.18)] sm:right-[10%] sm:min-w-[210px] sm:px-4 sm:py-4">
                    <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#ff8f9c]">
                        <svg viewBox="0 0 48 48" className="h-12 w-12">
                            <circle cx="24" cy="19" r="8" fill="#ffffff" />
                            <path d="M8 46c0-9 7-15 16-15s16 6 16 15z" fill="#ffffff" />
                        </svg>
                    </span>
                    <span className="space-y-1.5">
                        <span className="block h-2.5 w-16 rounded-full bg-[#1d2852] sm:w-24" />
                        <span className="block h-2 w-12 rounded-full bg-[#c8d4fb] sm:w-16" />
                        <span className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-[#d9f5eb] px-2.5 py-1 text-[9px] font-semibold text-[#18845e]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#18845e]" />
                            Active
                        </span>
                    </span>
                </div>
 
                <div className="absolute bottom-[31%] left-0 flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-[0_15px_35px_rgba(25,42,99,0.18)] sm:left-[calc(50%-281px)] sm:gap-4 sm:px-5 sm:py-4">
                    <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0">
                        <defs>
                            <linearGradient id="attRing" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#ff9aa5" />
                                <stop offset="100%" stopColor="#ff6b7e" />
                            </linearGradient>
                        </defs>
                        <circle cx="24" cy="24" r="20" fill="none" stroke="#ffe1e5" strokeWidth="4" />
                        <circle
                            cx="24" cy="24" r="20" fill="none" stroke="url(#attRing)" strokeWidth="4"
                            strokeLinecap="round" strokeDasharray="100 26" transform="rotate(-70 24 24)"
                        />
                        <path d="M16 25l6 6 11-12" fill="none" stroke="#ff6b7e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>
                        <span className="block text-xs font-bold text-[#1d2852] sm:text-sm">Attendance</span>
                        <span className="text-[10px] text-slate-500 sm:text-xs">Checked in</span>
                    </span>
                </div>
 
                <div className="absolute bottom-[13%] right-[4%] w-[42%] rounded-2xl bg-white p-3 shadow-[0_15px_35px_rgba(25,42,99,0.2)] sm:right-[14%] sm:w-[32%] sm:min-w-[220px] sm:p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8edff] text-[#365ce4]">
                            <IndianRupee className="h-4 w-4" strokeWidth={2.5} />
                        </span>
                        <span className="text-xs font-bold text-[#1d2852] sm:text-sm">Payroll</span>
                        <span className="ml-auto rounded-full bg-[#d9f5eb] px-2 py-1 text-[9px] font-semibold text-[#18845e]">Paid</span>
                    </div>
                    <div className="flex h-12 items-end gap-1.5 sm:h-14 sm:gap-2">
                        {[35, 52, 42, 72, 58, 88].map((height, index) => (
                            <span
                                key={index}
                                className={`flex-1 rounded-t-md ${index === 5 ? "bg-[#ff7787]" : "bg-gradient-to-t from-[#3156df] to-[#7da0ff]"}`}
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                </div>
 
                <div className="absolute right-[1%] top-[48%] flex h-16 w-16 rotate-[-10deg] items-center justify-center rounded-2xl bg-[#182968] text-[#ff8290] shadow-xl sm:right-[11%] sm:h-[76px] sm:w-[76px]">
                    <svg viewBox="0 0 48 48" className="h-9 w-9 sm:h-11 sm:w-11">
                        <path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z" fill="#ff7787" />
                        <path d="M16 24l6 6 11-12" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
 
function DomainVerification() {
    return (
        <div className="grid min-h-screen w-full max-w-none overflow-x-hidden bg-white font-sans text-[#172554] lg:grid-cols-2">
            <section className="flex min-h-[100svh] flex-col px-7 py-8 sm:px-12 lg:pb-2 lg:pt-10 lg:pl-[clamp(12rem,16.7vw,17rem)] lg:pr-8">
                <header className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#3156e4] text-white shadow-[0_8px_20px_rgba(49,86,228,0.25)]">
                        <UserRound className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-extrabold tracking-[0.16em] text-[#1d2852]">HRMS</span>
                </header>
 
                <main className="my-auto w-full max-w-[430px] py-14 lg:translate-y-10">
                    <div className="mb-4 flex items-center gap-2 text-[10px] font-extrabold tracking-[0.18em] text-[#3156e4]">
                        <span className="h-0.5 w-6 rounded-full bg-[#ff7787]" />
                        WELCOME
                    </div>
                    <h1
                        className="text-[54px] leading-[1.03] tracking-[-0.035em] text-[#172554] sm:text-[60px]"
                        style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontWeight: 700,
                        }}
                    >
                        Welcome
                        <br />
                        to <span className="text-[#3156e4]" style={{ fontFamily: "inherit", fontWeight: 700 }}>HRMS</span>
                    </h1>
                    <p className="mt-5 text-[14px] text-slate-500">
                        Enter your domain to access HRMS.
                    </p>
                    <DomainForm />
                </main>
 
                <footer className="mt-auto max-w-[430px] space-y-4 text-[10px] leading-relaxed text-slate-400 sm:text-[10px]">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span>Powered by</span>
                        <span
                            className="flex h-7 w-7 items-center justify-center rounded-md bg-[#172554] text-lg italic text-white"
                            style={{
                                fontFamily: 'Georgia, "Times New Roman", serif',
                                fontWeight: 700,
                            }}
                        >
                            K
                        </span>
                        <span className="leading-tight">
                            <span className="block font-extrabold tracking-wide text-[#172554]">
                                KOUNDINYASA
                            </span>
                            <span className="block text-[8px] font-semibold tracking-[0.12em] text-slate-500">
                                TECHNOLOGY SERVICES PVT. LTD.
                            </span>
                        </span>
                    </div>
                    <p>
                        © 2026 Koundinyasa Technology Services Pvt. Ltd. All rights reserved.
                        Unauthorized access is strictly prohibited.
                    </p>
                </footer>
            </section>
 
            <DashboardIllustration />
        </div>
    );
}
 
export default DomainVerification;
