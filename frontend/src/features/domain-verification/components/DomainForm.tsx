import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { useDomainVerification } from "../hooks/useDomainVerification";
import { domainSchema } from "../validation/domainSchema";

export default function DomainForm() {
    const [domain, setDomain] = useState("");
    const [error, setError] = useState("");

    const { verifyDomain } = useDomainVerification();

    const handleSubmit = () => {
        const result = domainSchema.safeParse({
            domain,
        });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setError("");
        verifyDomain(domain);
    };

    return (
        <>
            <div>
                <label className="block text-[15px] font-medium text-gray-700 mb-3">
                    Domain*
                </label>

                <div
                    className="flex items-center h-[42px] sm:h-[46px] bg-[#EEF5FB] border border-[#D8E2EC] rounded-lg px-3">
    
                
                    <span className="text-gray-400 text-sm mr-3">
                        👤
                    </span>

                    <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="https://hrms/"
                        className=" w-full bg-transparent outline-none border-none text-gray-600 text-xs sm:text-sm placeholder:text-gray-400"/>
      
                    
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-2">
                        {error}
                    </p>
                )}
            </div>

            <Button
                onClick={handleSubmit}
                className=" w-full mt-10 h-[46px] sm:h-[50px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-base sm:text-lg font-medium rounded-xl shadow-lg">
  
        
                Proceed →
            </Button>
        </>
    );
}