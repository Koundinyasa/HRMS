// ReportIcons.tsx
// Shared PDF / Excel / History icons — used by ReportHeader AND the custom
// date-picker pages (LeaveHistoryDateWise, AttendanceIntegrationReport) so
// every report page shows the exact same icons.

export function PdfIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="#E53935" />
      <path d="M14 2v6h6" fill="#FFCDD2" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="6" fontWeight="700" fontFamily="Arial, sans-serif" fill="white">
        PDF
      </text>
    </svg>
  );
}

export function ExcelIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#217346" />
      <path d="M3 8h18M3 13h18M3 18h18M9 8v12" stroke="white" strokeWidth="1.2" opacity="0.5" />
      <text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif" fill="white">
        X
      </text>
    </svg>
  );
}

export function ClockIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.8" fill="none" />
      <path d="M12 7v5l3.5 2" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}