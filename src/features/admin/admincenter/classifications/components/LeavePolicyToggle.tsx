export default function LeavePolicyToggle({
  checked,
  onChange,
  label,
  labelClassName = "text-gray-600",
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  labelClassName?: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full relative transition-colors ${
          checked ? "bg-emerald-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
            checked ? "right-0.5" : "left-0.5"
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${labelClassName}`}>{label}</span>
    </label>
  );
}
