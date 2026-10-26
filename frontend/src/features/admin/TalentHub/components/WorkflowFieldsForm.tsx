import type { FormEvent } from "react";

export type WorkflowFormField = {
  key: string;
  label: string;
  type?: "text" | "date" | "email" | "number";
  options?: string[];
  placeholder?: string;
};

interface WorkflowFieldsFormProps {
  title: string;
  fields: WorkflowFormField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  error?: string;
  isSubmitting?: boolean;
  submittingLabel?: string;
}

export function WorkflowFieldsForm({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  submitLabel,
  error,
  isSubmitting = false,
  submittingLabel,
}: WorkflowFieldsFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)]"
    >
      <h3 className="text-base font-semibold text-[#354239]">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.key}
            className="space-y-1.5 text-sm font-medium text-[#46534a]"
          >
            {field.label}
            {field.options ? (
              <select
                required
                value={values[field.key] ?? ""}
                onChange={(event) => onChange(field.key, event.target.value)}
                className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
              >
                <option value="">Select {field.label.toLowerCase()}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type ?? "text"}
                min={field.type === "number" ? 1 : undefined}
                step={field.type === "number" ? 1 : undefined}
                required
                value={values[field.key] ?? ""}
                onChange={(event) => onChange(field.key, event.target.value)}
                placeholder={field.placeholder}
                className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
              />
            )}
          </label>
        ))}
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-10 items-center rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white transition hover:bg-[#2e533d] disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}
