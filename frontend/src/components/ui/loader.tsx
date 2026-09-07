import { Loader2 } from "lucide-react";

import { useAppSelector } from "@/hooks/useAppSelector";

export default function Loader() {
  const isLoading = useAppSelector(
    (state) => state.employee?.isPageLoading
  );

  if (!isLoading) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-white/70
        backdrop-blur-sm
      "
    >
      <div
        className="
    flex
    flex-col
    items-center
    gap-4
    rounded-2xl
    bg-white
    px-8
    py-6
    shadow-xl
    border
  "
        style={{
          borderColor: "var(--primary-border)",
        }}
      >
        <Loader2
          className="
            h-12
            w-12
            animate-spin
          "
          style={{
            color: "var(--primary-color)",
          }}
        />

        <p
          className="text-sm font-medium"
          style={{
            color: "var(--primary-color)",
          }}
        >
          Loading...
        </p>
      </div>
    </div>
  );
}
