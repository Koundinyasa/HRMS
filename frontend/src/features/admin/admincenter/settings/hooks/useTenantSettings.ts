import { useEffect, useState } from "react";
import {
  useGetTenantSettingsQuery,
  useUpdateTenantSettingsMutation,
  useAddTenantIpMutation,
  useUploadTenantLogoMutation,
} from "../api/settingsapi";

export function useTenantSettings() {
  const { data: tenant, isLoading } = useGetTenantSettingsQuery();
  const [updateTenantSettings, { isLoading: isSaving }] =
    useUpdateTenantSettingsMutation();
  const [addTenantIp, { isLoading: isAddingIp }] = useAddTenantIpMutation();
  const [uploadTenantLogo, { isLoading: isUploadingLogo }] =
    useUploadTenantLogoMutation();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [ipAddress, setIpAddress] = useState("");
  const [ipList, setIpList] = useState<string[]>([]);
  const [passwordExpiry, setPasswordExpiry] = useState("90");

  useEffect(() => {
    if (tenant) {
      setLogoPreview(tenant.companyLogoUrl || null);
      setIpList(tenant.ipWhitelist || []);
      setPasswordExpiry(String(tenant.passwordExpiryDays ?? 90));
    }
  }, [tenant]);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setLogoFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;

    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
      await uploadTenantLogo(formData).unwrap();
    } catch (err) {
      console.error("Failed to upload logo", err);
    }
  };

  const handleAddIp = async () => {
    if (!ipAddress.trim()) return;

    try {
      await addTenantIp({ ip: ipAddress.trim() }).unwrap();
      setIpList((prev) => [...prev, ipAddress.trim()]);
      setIpAddress("");
    } catch (err) {
      console.error("Failed to add IP address", err);
    }
  };

  const handleSave = async () => {
    try {
      await updateTenantSettings({
        companyLogoUrl: logoPreview ?? "",
        ipWhitelist: ipList,
        passwordExpiryDays: Number(passwordExpiry),
      }).unwrap();

      if (logoFile) {
        await handleUploadLogo();
      }
    } catch (err) {
      console.error("Failed to save tenant settings", err);
    }
  };

  return {
    logoPreview,
    logoFile,
    ipAddress,
    setIpAddress,
    ipList,
    passwordExpiry,
    setPasswordExpiry,
    isLoading,
    isSaving,
    isAddingIp,
    isUploadingLogo,
    handleFileChange,
    handleAddIp,
    handleSave,
  };
}