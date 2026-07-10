import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { useDomainVerification } from "../hooks/useDomainVerification";
import { domainSchema } from "../validation/domainSchema";
 
export default function DomainForm() {
    const [domain, setDomain] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
 
    const { verifyDomain } = useDomainVerification();
 
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
        <div className="flex flex-col gap-0">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain*
                </label>
 
                <div className="flex items-start gap-3">
                    <div
                        className={`flex flex-1 items-center h-[48px] bg-[#EEF5FB] border rounded-lg px-3 gap-2 transition-colors ${
                            error
                                ? "border-red-400"
                                : "border-[#D8E2EC] focus-within:border-blue-400"
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-gray-400 shrink-0"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                clipRule="evenodd"
                            />
                        </svg>
 
                        <input
                            type="text"
                            spellCheck={false}
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
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSubmit()
                            }
                            placeholder="https://hrms/"
                            className="w-full bg-transparent outline-none border-none text-gray-700 text-sm placeholder:text-gray-400"
                        />
                    </div>
 
                    <Button
                        onClick={handleSubmit}
                        className="h-[44px] w-[100px] text-sm rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8]"
                    >
                        Proceed→
                    </Button>
                </div>
 
                {error && (
                    <p className="text-red-500 text-xs mt-1.5">
                        {error}
                    </p>
                )}
 
                {success && (
                    <p className="text-green-500 text-xs mt-1.5">
                        {success}
                    </p>
                )}
            </div>
        </div>
    );
}
 