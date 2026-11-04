import { Loader2 } from "lucide-react";

// Small inline loading spinner. Show it in place of content while data loads.
export default function Loader() {
  return (
    <div className="flex flex-col items-center gap-3 py-4" role="status">
      <Loader2
        className="h-10 w-10 animate-spin"
        style={{ color: "var(--primary-color)" }}
      />
      <p
        className="text-sm font-medium"
        style={{ color: "var(--primary-color)" }}
      >
        Loading...
      </p>
    </div>
  );
}
