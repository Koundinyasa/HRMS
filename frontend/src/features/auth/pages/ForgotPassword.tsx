import { KeyRound } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import FormCard from "../components/FormCard";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <FormCard
        icon={<KeyRound size={22} strokeWidth={2.5} className="text-[#1E293B] -rotate-12" />}
        title="Forgot Password?"
        subtitle="Enter your email and mobile number and we will send you an OTP to reset your password."
      >
        <ForgotPasswordForm />
      </FormCard>
    </AuthLayout>
  );
}