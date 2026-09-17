export default function EmptyState({
  message = "No data found in Exit Module reoort",
}: {
  message?: string;
}) {
  return (
    // <div className="flex flex-col items-center justify-center gap-4 py-16">
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 sm:gap-4 sm:py-16">
      <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* faint dots */}
        <circle cx="30" cy="60" r="3" fill="#E5E7EB" />
        <circle cx="95" cy="30" r="3" fill="#E5E7EB" />
        <circle cx="188" cy="70" r="3" fill="#E5E7EB" />
        <circle cx="150" cy="118" r="3" fill="#E5E7EB" />

        {/* left card: bar chart (dashed outer frame) */}
        <rect x="8" y="38" width="58" height="52" rx="8" stroke="#D8DCE6" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <rect x="16" y="46" width="42" height="36" rx="6" fill="#6366F1" />
        <rect x="23" y="52" width="18" height="3" rx="1.5" fill="#C7CBFB" />
        <rect x="24" y="60" width="6" height="14" rx="1.5" fill="#C7CBFB" />
        <rect x="33" y="65" width="6" height="9" rx="1.5" fill="#C7CBFB" />
        <rect x="42" y="58" width="6" height="16" rx="1.5" fill="#C7CBFB" />
        <rect x="51" y="68" width="4" height="6" rx="1.5" fill="#C7CBFB" />

        {/* right card: browser + trend line (dashed outer frame) */}
        <rect x="154" y="30" width="58" height="52" rx="8" stroke="#D8DCE6" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <rect x="162" y="38" width="42" height="36" rx="6" fill="#EEF0FE" stroke="#C7CBFB" />
        <rect x="167" y="43" width="18" height="3" rx="1.5" fill="#C7CBFB" />
        <path d="M167 66 L177 58 L184 62 L197 46" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M191 46 L197 46 L197 52" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* stress squiggle + bolts above head */}
        <path d="M104 24c2-2 5-2 6 0s-1 3 1 3 3-2 5 0" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M92 46l6 8-4 1 6 8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M128 46l-6 8 4 1-6 8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* person */}
        <circle cx="110" cy="58" r="15" fill="#F6C18C" />
        <path d="M84 140c0-28 10-46 26-46s26 18 26 46z" fill="#4338CA" />
        <path d="M96 118h28v10a14 14 0 0 1-28 0z" fill="#F6C18C" />

        {/* hand on chin */}
        <circle cx="99" cy="65" r="6" fill="#F6C18C" />

        {/* laptop */}
        <rect x="70" y="128" width="52" height="6" rx="2" fill="#E2E4EA" />
        <path d="M74 128l4-24h30l4 24z" fill="#F3F4F6" stroke="#D8DCE6" />

        {/* mug */}
        <rect x="140" y="122" width="14" height="12" rx="2" fill="#E5E7EB" />
        <path d="M154 124h4a3 3 0 0 1 0 6h-4" stroke="#D8DCE6" strokeWidth="1.5" fill="none" />

        {/* desk line */}
        <rect x="30" y="134" width="160" height="2.5" rx="1.25" fill="#D8DCE6" />
      </svg>

      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
}
