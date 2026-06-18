import DomainForm from "../components/DomainForm";
import backgroundImg from "../../../assets/background.png";
import logoImg from "../../../assets/logo.png";
import peopleImg from "../../../assets/people.png";

function DomainVerification() {
    return (
        <div
            className="h-screen overflow-hidden flex flex-col bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${backgroundImg})`,
            }}
        >
            <div className="flex-1 flex justify-center px-8 pt-8">
                <div className="w-full max-w-[1350px] flex items-center justify-between gap-10">

                    {/* LEFT SIDE */}
                    <div className="w-[46%] flex flex-col items-center justify-center mt-2">

                        <div
                            className="
    w-full
    h-[260px]
    bg-[#000033]/40
    border
    border-white/10
    backdrop-blur-sm
    shadow-[0_0_30px_rgba(255,255,255,0.05)]
    rounded-[28px]
    px-12
    py-10
    flex
    flex-col
    items-center
    justify-center
  "
                        >
                            <h1
                                className="
                  text-white
                  text-[46px]
                  font-semibold
                  text-center
                  leading-tight
                "
                            >
                                Welcome To HRMS
                            </h1>

                            <p
                                className="
                  text-white
                  text-[20px]
                  mt-10
                "
                            >
                                Powered By
                            </p>

                            <img
                                src={logoImg}
                                alt="logo"
                                className="
                  w-[260px]
                  mt-4
                  object-contain
                "
                            />
                        </div>

                        <div className="w-full flex justify-center mt-0">
                            <img
                                src={peopleImg}
                                alt="people"
                                className="
                  w-[420px]
                  h-auto
                  object-contain
                "
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div
                        className="
              w-[550px]
              h-[720px]
              bg-white
              rounded-[30px]
              px-12
              py-8
              shadow-xl
              flex
              flex-col
             -mt-12
            "
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-blue-600
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  text-sm
                "
                            >
                                H
                            </div>

                            <span className="text-sm font-semibold text-gray-700">
                                HRMS
                            </span>
                        </div>

                        <p
                            className="
                text-blue-600
                text-xl
                font-semibold
                mt-6
                tracking-wide
              "
                        >
                            WELCOME!
                        </p>

                        <h2
                            className="
                text-[25px]
                leading-tight
                font-normal
                mt-2
                mb-4
                text-gray-800
              "
                        >
                            Enter your domain to access HRMS
                            
                            
                        </h2>

                        <DomainForm />

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

            <footer
                className="
          h-[32px]
          bg-sky-300
          flex
          items-center
          justify-center
          text-sm
          text-black/70
          px-4
        "
            >
                © 2026 Koundinyasa Technology Services Pvt. Ltd. All rights reserved · Unauthorized access is strictly prohibited.
            </footer>
        </div>
    );
}

export default DomainVerification;