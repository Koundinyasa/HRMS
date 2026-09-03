interface BulkUpdateComingSoonProps {
  label: string;
}

export default function BulkUpdateComingSoon({ label }: BulkUpdateComingSoonProps) {
  return (
    <div className="flex items-center justify-center h-40 rounded-xl border border-dashed text-muted-foreground text-sm">
      {label} bulk update is not built yet.
    </div>
  );
}