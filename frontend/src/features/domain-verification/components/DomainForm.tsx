import { useState } from "react";
import { ArrowRight, Globe2, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useDomainVerification } from "../hooks/useDomainVerification";
import { domainSchema } from "../validation/domainSchema";

export default function DomainForm() {
    const [domain, setDomain] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { verifyDomain, isVerifying } = useDomainVerification();

    const validateDomain = (value: string) => {
        const result = domainSchema.safeParse({ domain: value });

        if (!result.success) {
            setError(result.error.issues[0].message);
            setSuccess("");
            return false;
        }

        setError("");
        return true;
    };

    const handleSubmit = async () => {
        if (isVerifying) {
            return;
        }
        if (!validateDomain(domain)) {
            return;
        }

        setError("");
        setSuccess("");

        const isValid = await verifyDomain(domain);

        if (isValid) {
            setSuccess("Valid domain name");
        } else {
            setError("Invalid domain name");
        }
    };

    return (
        <div className="mt-8">
            <label htmlFor="domain" className="mb-2 block text-[16px] font-bold text-[#1d2852]">
                Domain <span className="text-[#e5485d]">*</span>
            </label>
            <div
                className={`flex h-[60px] items-center gap-2 rounded-full border bg-white p-1.5 pl-4 shadow-[0_12px_30px_rgba(47,76,165,0.12)] transition-colors ${
                    error
                        ? "border-red-400"
                        : "border-[#e0e7f2] focus-within:border-[#8299f1]"
                }`}
            >
                <Globe2 className="h-[18px] w-[18px] shrink-0 text-slate-400" aria-hidden="true" />
                <input
                    id="domain"
                    type="text"
                    spellCheck={false}
                    autoComplete="off"
                    value={domain}
                    onChange={(e) => {
                        const value = e.target.value;

                        setDomain(value);

                        if (value.trim() === "") {
                            setError("");
                            setSuccess("");
                            return;
                        }
                        validateDomain(value);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="https://hrms/"
                    className="min-w-0 flex-1 bg-transparent text-[16px] text-slate-700 outline-none placeholder:text-slate-500 [&:-webkit-autofill]:[-webkit-text-fill-color:#334155] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#ffffff_inset]"
                />
                <Button
                    onClick={handleSubmit}
                    disabled={isVerifying}
                    aria-busy={isVerifying}
                    className="h-[46px] shrink-0 rounded-full bg-[#3156e4] px-4 text-[16px] font-semibold text-white shadow-sm hover:bg-[#2647c7] sm:px-5"
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                            Checking
                        </>
                    ) : (
                        <>
                            Proceed
                            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                        </>
                    )}
                </Button>
            </div>
            <div className="mt-2 min-h-[18px]" aria-live="polite">
                {error && <p className="text-[16px] text-red-500">{error}</p>}
                {success && <p className="text-[16px] text-green-600">{success}</p>}
                </div>
        </div>
    );
}
