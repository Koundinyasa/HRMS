import { useState } from "react";

export function useTimeOffice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    setLoading,
    setError,
    clearError,
  };
}