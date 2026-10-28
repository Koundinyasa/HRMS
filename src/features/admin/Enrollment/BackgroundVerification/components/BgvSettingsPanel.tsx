import { Users, UserPlus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BGV_MAIL_TEMPLATE_TYPES } from "../constants/backgroundverification.constants";
import type { BgvSettings, BgvVerificationTypeSetting, BgvMailTemplateType } from "../types/backgroundverification.types";

const MAIL_TEMPLATE_ICONS: Record<BgvMailTemplateType, typeof Users> = {
  consent: Users,
  external_verification: UserPlus,
  employment_verification: Briefcase,
};

interface BgvSettingsPanelProps {
  settings: BgvSettings;
  onToggleVerificationType: (name: string, enabled: boolean) => void;
  onCreateVerificationType: () => void;
  onToggleRequireExternalVerifier: (checked: boolean) => void;
  onOpenMailTemplate: (type: BgvMailTemplateType) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function BgvSettingsPanel({
  settings,
  onToggleVerificationType,
  onCreateVerificationType,
  onToggleRequireExternalVerifier,
  onOpenMailTemplate,
  onSave,
  isSaving,
}: BgvSettingsPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={onCreateVerificationType}>Create Verification Type</Button>
        <Button variant="outline" onClick={onSave} disabled={isSaving}>Save</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border overflow-x-auto">
          <table className="w-full text-sm min-w-[320px]">
            <thead className="bg-muted/60">
              <tr className="text-left">
                <th className="font-semibold px-4 py-3">Verification Type</th>
                <th className="font-semibold px-4 py-3 text-right">Enable</th>
              </tr>
            </thead>
            <tbody>
              {settings.verificationTypes.map((type: BgvVerificationTypeSetting) => (
                <tr key={type.id ?? type.name} className="border-t">
                  <td className="px-4 py-3">{type.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={type.enabled}
                        onClick={() => onToggleVerificationType(type.name, !type.enabled)}
                        className={`relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full transition-colors ${type.enabled ? "bg-emerald-500" : "bg-input"}`}
                      >
                        <span className={`h-3.5 w-3.5 rounded-full bg-background transition-transform ${type.enabled ? "translate-x-[15px]" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Checkbox checked={settings.requireExternalVerifier} onCheckedChange={(checked) => onToggleRequireExternalVerifier(!!checked)} />
            <Label>Require External Verifier</Label>
          </div>

          <div>
            <p className="text-sm font-medium text-blue-600 mb-2">Mail Templates</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {BGV_MAIL_TEMPLATE_TYPES.map((template) => {
                const Icon = MAIL_TEMPLATE_ICONS[template.value];
                return (
                  <button key={template.value} type="button" onClick={() => onOpenMailTemplate(template.value)} className="flex flex-col items-center gap-2 rounded-xl border p-4 hover:bg-muted/50 transition-colors">
                    <Icon size={20} />
                    <span className="text-sm font-medium text-center">{template.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}