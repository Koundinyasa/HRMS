export default function EmptyStateIllustration({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="90" cy="128" rx="60" ry="8" fill="#EDE9FE" />

        {/* left chart card */}
        <rect x="14" y="60" width="46" height="34" rx="6" fill="#EDE9FE" />
        <path d="M22 84 L32 72 L40 78 L52 64" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* right chart card */}
        <rect x="120" y="52" width="46" height="34" rx="6" fill="#EDE9FE" />
        <circle cx="132" cy="76" r="5" fill="#C4B5FD" />
        <rect x="142" y="66" width="6" height="14" rx="1.5" fill="#A78BFA" />
        <rect x="152" y="70" width="6" height="10" rx="1.5" fill="#C4B5FD" />

        {/* clock */}
        <circle cx="150" cy="98" r="11" fill="#fff" stroke="#C4B5FD" strokeWidth="2" />
        <path d="M150 92 V98 L154 101" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />

        {/* sparkle */}
        <path d="M96 44 L98 50 L104 52 L98 54 L96 60 L94 54 L88 52 L94 50 Z" fill="#C4B5FD" />
        <circle cx="70" cy="46" r="3" fill="#A78BFA" />

        {/* person body */}
        <circle cx="90" cy="70" r="12" fill="#312E81" />
        <path
          d="M66 122 C66 100 76 88 90 88 C104 88 114 100 114 122 Z"
          fill="#F59E0B"
        />
        <path d="M90 88 C82 88 76 96 74 106 L74 122 L106 122 L106 106 C104 96 98 88 90 88 Z" fill="#4C1D95" />
        <rect x="74" y="106" width="32" height="4" fill="#4C1D95" />
      </svg>

      <p className="mt-4 text-sm text-gray-500">Did Not Find Any {label}</p>
    </div>
  );
}
