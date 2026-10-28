import { useParams, NavLink } from "react-router-dom";
import { useState } from "react";
import BgvSettingsPanel from "../components/BgvSettingsPanel";
import { BGV_TABS, BGV_SECTION_PATH } from "../constants/backgroundverification.constants";
import { useBackgroundVerification } from "../hooks/useBackgroundVerification";
import type { BgvMailTemplateType, BgvSettings } from "../types/backgroundverification.types";

export default function BgvSettingsPage() {
  const { domain } = useParams();
  const { settings, updateBgvSettings, updateBgvSettingsState } = useBackgroundVerification();
  const [draft, setDraft] = useState<BgvSettings | null>(null);

  const basePath = `/${domain}/admin/${BGV_SECTION_PATH}`;
  const current = draft ?? settings.data;

  const handleToggleVerificationType = (name: string, enabled: boolean) => {
    if (!current) return;
    setDraft({
      ...current,
      verificationTypes: current.verificationTypes.map((t) => (t.name === name ? { ...t, enabled } : t)),
    });
  };

  const handleCreateVerificationType = () => {
    if (!current) return;
    const name = window.prompt("Verification type name");
    if (!name) return;
    setDraft({
      ...current,
      verificationTypes: [...current.verificationTypes, { name, enabled: true }],
    });
  };

  const handleToggleRequireExternalVerifier = (checked: boolean) => {
    if (!current) return;
    setDraft({ ...current, requireExternalVerifier: checked });
  };

  const handleOpenMailTemplate = (type: BgvMailTemplateType) => {
    window.alert(`Open mail template editor for ${type}`);
  };

  const handleSave = async () => {
    if (!current) return;
    await updateBgvSettings(current).unwrap();
    setDraft(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-500 rounded-xl p-2 w-max min-w-full sm:w-fit">
          {BGV_TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={`${basePath}/${tab.path}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors ${
                  isActive
                    ? "bg-white border-orange-500 text-orange-600 shadow-sm"
                    : "bg-white/70 border-transparent text-slate-600 hover:bg-white"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
      {!current ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          Loading settings...
        </div>
      ) : (
        <BgvSettingsPanel
          settings={current}
          onToggleVerificationType={handleToggleVerificationType}
          onCreateVerificationType={handleCreateVerificationType}
          onToggleRequireExternalVerifier={handleToggleRequireExternalVerifier}
          onOpenMailTemplate={handleOpenMailTemplate}
          onSave={handleSave}
          isSaving={updateBgvSettingsState.isLoading}
        />
      )}
    </div>
  );
}