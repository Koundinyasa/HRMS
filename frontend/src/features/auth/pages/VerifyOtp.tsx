import { Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import FormCard from "../components/FormCard";
import VerifyOtpForm from "../components/VerifyOtpForm";

export default function VerifyOtp() {
  return (
    <AuthLayout>
      <FormCard
        icon={<Mail size={22} strokeWidth={2.5} className="text-[#1E293B]" />}
        title="Check your email"
        subtitle="Enter the OTP you just received on your registered email address."
      >
        <VerifyOtpForm />
      </FormCard>
    </AuthLayout>
  );
}