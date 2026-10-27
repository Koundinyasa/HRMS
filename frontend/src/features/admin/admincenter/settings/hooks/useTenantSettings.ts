









import { useEffect, useState } from "react";
import {
  useUpdateTenantSettingsMutation,
  getApiErrorMessage,
} from "../api/settingsapi";
import type { UpdateCompanyTenantInput } from "../types/settingstypes";

// Backend stores all IPs in ONE string column (ipAddress, VarChar 500).
// We join/split with a comma - confirm this delimiter with the backend team.
const IP_SEPARATOR = ",";

/** First defined value among possible backend key names (case-insensitive). */
function pick(raw: any, keys: string[]): any {
  if (!raw || typeof raw !== "object") return undefined;
  const wanted = keys.map((k) => k.toLowerCase());
  const hit = Object.keys(raw).find((k) => wanted.includes(k.toLowerCase()));
  return hit !== undefined && raw[hit] !== null ? raw[hit] : undefined;
}

/** Response may be an object, an array, or wrapped in data/result/recordset. */
function toTenantRow(res: any): any | null {
  if (!res || typeof res !== "object") return null;
  if (Array.isArray(res)) return res[0] ?? null;
  for (const k of ["data", "result", "recordset", "tenant"]) {
    if (res[k] !== undefined && res[k] !== null) {
      return Array.isArray(res[k]) ? res[k][0] ?? null : res[k];
    }
  }
  return Object.keys(res).length ? res : null;
}

function splitIps(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split(/[,;\s]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

// IPv4 (optional /CIDR) or a loose IPv6 check
const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}(\/(3[0-2]|[12]?\d))?$/;
const IPV6 = /^[0-9a-f:]+$/i;
const isValidIp = (ip: string) => IPV4.test(ip) || (ip.includes(":") && IPV6.test(ip));

/** Server path -> something an <img> can show. Absolute/data/blob URLs are used as-is. */
function toLogoSrc(path: string | null): string | null {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const base = String(import.meta.env.VITE_API_URL ?? "")
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");
  return base ? `${base}/${path.replace(/^\/+/, "")}` : path;
}

export function useTenantSettings() {
  const [updateTenantSettings, { isLoading: isSaving }] = useUpdateTenantSettingsMutation();
  const isUploadingLogo = false;

  // Backend has no GET for tenant settings - only PUT admin/setting/tenant.
  // The form starts empty and is refreshed from the PUT response after each save.
  const isLoading = false;
  const loadError = false;

  const [logoPath, setLogoPath] = useState<string | null>(null); // path stored on the server
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [ipAddress, setIpAddress] = useState("");
  const [ipList, setIpList] = useState<string[]>([]);
  const [ipsTouched, setIpsTouched] = useState(false);
  const [passwordExpiry, setPasswordExpiry] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // auto-hide the status message after 4 seconds
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  // Only overwrite a field when the server actually returned a value for it,
  // so a null/empty response can never wipe what the user typed.
  const applyRow = (row: any) => {
    if (!row) return;
    const path = pick(row, ["companyLogoPath", "companyLogoUrl", "logoPath"]);
    if (path) {
      setLogoPath(String(path));
      setLogoPreview(toLogoSrc(String(path)));
    }
    const ips = pick(row, ["ipAddress", "ipWhitelist", "ips"]);
    if (ips !== undefined) setIpList(splitIps(ips));
    const days = pick(row, ["passwordExpiryinDays", "passwordExpiryDays"]);
    if (days !== undefined) setPasswordExpiry(String(days));
    setIpsTouched(false);
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // IPs are saved together with the rest of the form (single PUT), so adding is local.
  const handleAddIp = () => {
    const ip = ipAddress.trim();
    if (!ip) return;
    if (!isValidIp(ip)) {
      setMessage({ type: "error", text: "Enter a valid IP address (e.g. 192.168.1.10)." });
      return;
    }
    if (ipList.includes(ip)) {
      setMessage({ type: "error", text: "That IP address is already in the list." });
      return;
    }
    if ([...ipList, ip].join(IP_SEPARATOR).length > 500) {
      setMessage({ type: "error", text: "IP list is too long (max 500 characters in total)." });
      return;
    }
    setIpList((prev) => [...prev, ip]);
    setIpsTouched(true);
    setIpAddress("");
  };

  const handleRemoveIp = (ip: string) => {
    setIpList((prev) => prev.filter((x) => x !== ip));
    setIpsTouched(true);
  };

  const handleSave = async () => {
    const expiryText = passwordExpiry.trim();
    const expiry = expiryText === "" ? undefined : Number(expiryText);
    if (expiry !== undefined && (!Number.isInteger(expiry) || expiry < 0)) {
      setMessage({ type: "error", text: "Password expiry must be a whole number, 0 or more." });
      return;
    }

    // An IP typed in the box but not yet added with "ADD IP" is included on Save.
    let ips = ipList;
    const pendingIp = ipAddress.trim();
    if (pendingIp) {
      if (!isValidIp(pendingIp)) {
        setMessage({ type: "error", text: "Enter a valid IP address (e.g. 192.168.1.10)." });
        return;
      }
      if (!ips.includes(pendingIp)) ips = [...ips, pendingIp];
    }
    if (ips.join(IP_SEPARATOR).length > 500) {
      setMessage({ type: "error", text: "IP list is too long (max 500 characters in total)." });
      return;
    }

    // Only send what we actually know, so an unloaded/blank form can't wipe saved values.
    const payload: UpdateCompanyTenantInput = {};
    if (logoPath) payload.companyLogoPath = logoPath;
    if (ips.length > 0 || ipsTouched) payload.ipAddress = ips.join(IP_SEPARATOR);
    if (expiry !== undefined) payload.passwordExpiryinDays = expiry;

    if (Object.keys(payload).length === 0 && !logoFile) {
      setMessage({
        type: "error",
        text: "Upload a logo, enter an IP address, or set password expiry before saving.",
      });
      return;
    }

    try {
      let res: any;

      // Backend: @Put('tenant') + FileInterceptor('companyLogo')
      // One request: fields + optional file (field name MUST be companyLogo)
      if (logoFile) {
        const fd = new FormData();
        fd.append("companyLogo", logoFile);
        if (payload.ipAddress !== undefined) {
          fd.append("ipAddress", payload.ipAddress);
        }
        if (payload.passwordExpiryinDays !== undefined) {
          fd.append("passwordExpiryinDays", String(payload.passwordExpiryinDays));
        }
        if (payload.companyLogoPath) {
          fd.append("companyLogoPath", payload.companyLogoPath);
        }
        res = await updateTenantSettings(fd as any).unwrap();
        setLogoFile(null);
      } else {
        res = await updateTenantSettings(payload).unwrap();
      }

      setIpList(ips);
      setIpAddress("");
      setIpsTouched(false);
      applyRow(toTenantRow(res));
      setMessage({ type: "success", text: "Tenant settings saved." });
    } catch (err) {
      console.error("Failed to save tenant settings", err);
      setMessage({ type: "error", text: getApiErrorMessage(err, "Failed to save tenant settings") });
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
    loadError,
    message,
    isUploadingLogo,
    handleFileChange,
    handleAddIp,
    handleRemoveIp,
    handleSave,
  };
}
