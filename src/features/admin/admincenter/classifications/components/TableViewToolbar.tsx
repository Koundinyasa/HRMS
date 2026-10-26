import { Star } from "lucide-react";
import { useState } from "react";

const VIEWS = ["Table", "Pivot", "Ask Me", "Column"] as const;
type View = (typeof VIEWS)[number];

export default function TableViewToolbar({ onSelect }: { onSelect?: (view: View) => void }) {
  const [active, setActive] = useState<View>("Table");

  return (
    <div className="flex justify-end px-6 py-2">
      <div className="inline-flex items-center gap-1 bg-[#F5F3FF] rounded-lg p-1">
        {VIEWS.map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => {
              setActive(view);
              onSelect?.(view);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              active === view ? "bg-white text-violet-700 shadow-sm" : "text-violet-400 hover:text-violet-600"
            }`}
          >
            {view === "Ask Me" && <Star size={11} className="fill-current" />}
            {view}
          </button>
        ))}
      </div>
    </div>
  );
}
