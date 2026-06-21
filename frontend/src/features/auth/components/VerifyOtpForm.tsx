import { useState } from "react";

import { Button } from "../../../components/ui/button";

import { verifyOtpSchema } from "../validation/verifyOtpSchema";

import { useVerifyOtp } from "../hooks/useVerifyOtp";

export default function VerifyOtpForm() {
  const [otp, setOtp] =
    useState(["", "", "", "", "", ""]);

  const { handleVerifyOtp } =
    useVerifyOtp();

  const handleChange = (
    value: string,
    index: number
  ) => {
    const updatedOtp = [...otp];

    updatedOtp[index] = value;

    setOtp(updatedOtp);
  };

  const handleSubmit = () => {
    const finalOtp =
      otp.join("");

    const result =
      verifyOtpSchema.safeParse({
        otp: finalOtp,
      });

    if (!result.success) {
      return;
    }

    handleVerifyOtp(
      "empId",
      finalOtp
    );
  };

  return (
    <>
      <div className="flex justify-center gap-4 mt-8">
        {otp.map(
          (digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  index
                )
              }
              className="
                w-14
                h-16
                text-center
                text-3xl
                border
                rounded
              "
            />
          )
        )}
      </div>

      <Button
        onClick={handleSubmit}
        className="
          w-full
          mt-10
          h-[50px]
          bg-blue-600
        "
      >
        Verify
      </Button>

      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>
          OTP is valid for 3 mins
        </span>

        <span>03:00</span>
      </div>

      <div className="text-right mt-4">
        <button
          className="
            text-blue-600
            text-sm
          "
        >
          Resend OTP
        </button>
      </div>
    </>
  );
}