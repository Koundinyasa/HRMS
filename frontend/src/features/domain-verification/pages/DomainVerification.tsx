import DomainForm from "../components/DomainForm";
import backgroundImg from "@/assets/images/background-bg.png";
import logoImg from "@/assets/images/koundinyasa-logo.png";
import peopleImg from "@/assets/images/people.png";

function DomainVerification() {
    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            {/* Main content area */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
                <div className="w-full max-w-[1300px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

                    {/* ── LEFT SIDE ── */}
                    <div className="w-full lg:w-[52%] flex flex-col items-center">

                        {/* Welcome card */}
                        <div className="w-full max-w-[600px] bg-[#000033]/40 border border-white/10 backdrop-blur-sm rounded-[24px] px-6 sm:px-10 lg:px-14 py-8 lg:py-10 flex flex-col items-center justify-center">
                            <h1 className="text-white text-4xl sm:text-5xl lg:text-[52px] font-semibold italic text-center leading-tight tracking-tight">
                                Welcome To HRMS
                            </h1>
                            <p className="text-white/90 text-base lg:text-lg font-light mt-6 tracking-wide">
                                Powered By
                            </p>
                            <img
                                src={logoImg}
                                alt="Koundinyasa Technology Services"
                                className="w-[180px] sm:w-[220px] lg:w-[256px] mt-4 object-contain"
                            />
                        </div>

                        {/* People silhouette image */}
                        <div className="w-full flex justify-center mt-10">
                            <img
                                src={peopleImg}
                                alt="Team silhouettes"
                                className="w-[240px] sm:w-[340px] lg:w-[460px] h-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* ── RIGHT SIDE – White card ── */}
                    <div className="w-full max-w-[520px] lg:max-w-[500px] min-h-[520px] lg:min-h-[600px] bg-white rounded-[28px] shadow-2xl px-6 sm:px-8 lg:px-10 py-8 lg:py-10 flex flex-col">

                        {/* HRMS icon + label */}
                        <div className="flex items-center gap-3">
                            <div className="w-[38px] h-[38px] rounded-[10px] bg-blue-600 flex items-center justify-center text-white">
                                {/* Person icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-700 tracking-wide">
                                HRMS
                            </span>
                        </div>

                        {/* Welcome label */}
                        <p className="text-blue-600 text-sm font-bold mt-7 tracking-[0.12em] uppercase">
                            WELCOME !
                        </p>

                        {/* Heading */}
                        <h2 className="text-gray-800 text-2xl sm:text-[26px] font-normal leading-snug mt-2 mb-8">
                            Enter your domain to access HRMS
                        </h2>

                        {/* Domain form */}
                        <DomainForm />

                        {/* Footer attribution */}
                        <div className="mt-auto pt-10 text-center text-sm text-gray-400">
                            Powered by{" "}
                            <span className="text-blue-600 font-semibold">
                                KOUNDINYASA
                            </span>{" "}
                            Technology Services
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Footer bar ── */}
            <footer className="bg-sky-300 py-2 px-4 flex items-center justify-center text-[11px] sm:text-xs text-center text-slate-700/80">
                © 2026 Koundinyasa Technology Services Pvt. Ltd. All rights reserved · Unauthorized access is strictly prohibited.
            </footer>
        </div>
    );
}

export default DomainVerification;