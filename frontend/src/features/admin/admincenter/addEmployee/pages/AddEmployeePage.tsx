import { useEffect, useState } from "react";
import AddEmployee from "./AddEmployee";
import {
  fetchMasterData,
  saveEmployee,
  validateEmployeeId,
} from "../api/api";
import type { MasterData } from "../types/types";

export default function AddEmployeePage() {
  const [masterData, setMasterData] = useState<MasterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMasterData();
        if (!cancelled) setMasterData(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Could not load dropdown data from the server.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Loading company data…
      </div>
    );
  }

  if (error || !masterData) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        <p className="font-semibold">Dropdown data failed to load</p>
        <p className="mt-1">{error ?? "Unknown error"}</p>
        <button
          type="button"
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <AddEmployee
      masterData={masterData}
      onSave={(payload, photo) => saveEmployee(payload, photo)}
      checkEmployeeIdExists={async (employeeId) => {
        const result = await validateEmployeeId(employeeId);
        // true = already exists (block save) — matches existing form logic
        if (!result.ok) {
          // Throw or return message: your form may expect boolean only.
          // Prefer returning via a richer callback if form supports it.
        }
        return !result.ok; // true → exists → show error
      }}
    />
  );
}