import { useEffect, useState } from "react";

// Loads the logged-in employee's enrollment photo from the guarded backend
// endpoint and hands back a temporary browser URL for an <img>. The photo
// is fetched with the same cookie session as every other API call, so only
// the signed-in employee can ever see their own photo.
//
// `version` is any value that changes when the registration changes (the
// page passes the status's lastUpdated), so the photo reloads after a
// re-registration.
export function useFacePhoto(enabled: boolean, version?: string | null) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setPhotoUrl(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;
    const baseUrl = String(import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

    setIsLoading(true);
    fetch(`${baseUrl}/employee/attendance/face-photo`, { credentials: "include" })
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(String(response.status)))))
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setPhotoUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setPhotoUrl(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [enabled, version]);

  return { photoUrl, isLoading };
}