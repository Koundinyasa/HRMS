import { KeyRound } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import FormCard from "../components/FormCard";
import FirstLoginResetPasswordForm from "../components/FirstLoginResetPasswordForm";
 
export default function FirstLoginResetPassword() {
  return (
    <AuthLayout>
      <FormCard
        icon={
          <KeyRound
            size={22}
            strokeWidth={2.5}
            className="text-[#1E293B]"
          />
        }
        title="Set new password"
        subtitle="For security, please change your temporary password before continuing."
      >
        <FirstLoginResetPasswordForm />
      </FormCard>
    </AuthLayout>
  );
}