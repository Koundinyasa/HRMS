interface BulkUpdateEmptyStateProps {
  label: string; // e.g. "Classification" -> "Did Not Find Any Classification"
}

export default function BulkUpdateEmptyState({ label }: BulkUpdateEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="90" cy="70" r="68" fill="#EEF3FC" />
        <circle cx="34" cy="30" r="6" fill="#E3EAF8" />
        <circle cx="150" cy="26" r="4" fill="#E3EAF8" />
        <circle cx="24" cy="96" r="4" fill="#E3EAF8" />
        <rect x="56" y="28" width="68" height="52" rx="6" fill="#FFFFFF" stroke="#C9D6EE" strokeWidth="2" />
        <rect x="56" y="28" width="68" height="14" rx="6" fill="#6C8EEA" />
        <circle cx="64" cy="35" r="2" fill="#FFFFFF" />
        <circle cx="70" cy="35" r="2" fill="#FFFFFF" />
        <circle cx="76" cy="35" r="2" fill="#FFFFFF" />
        <circle cx="90" cy="60" r="12" fill="#EEF3FC" stroke="#C9D6EE" strokeWidth="1.5" />
        <path d="M85 63c1.5 1.5 6.5 1.5 8 0" stroke="#8FA3C8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="86" cy="57" r="1.4" fill="#8FA3C8" />
        <circle cx="94" cy="57" r="1.4" fill="#8FA3C8" />
        <text x="90" y="74" textAnchor="middle" fontSize="7" fontWeight="700" fill="#8FA3C8">
          NO DATA
        </text>
        <circle cx="128" cy="98" r="13" fill="#2A3B66" />
        <circle cx="128" cy="93" r="5" fill="#F4C7A1" />
        <path d="M120 108c0-5 4-9 8-9s8 4 8 9" fill="#F4C7A1" />
        <rect x="112" y="104" width="14" height="18" rx="3" fill="#3B4E85" />
        <rect x="118" y="102" width="20" height="12" rx="2" fill="#6C8EEA" opacity="0.85" />
      </svg>
      <p className="text-sm font-medium text-slate-700">Did Not Find Any {label}</p>
    </div>
  );
}