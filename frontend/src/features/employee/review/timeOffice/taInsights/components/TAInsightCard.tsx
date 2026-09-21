import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TAInsightCount } from "../types/taInsightsTypes";

interface TAInsightCardProps {
  card: TAInsightCount;
  onClick: (card: TAInsightCount) => void;
}

const TAInsightCard: React.FC<TAInsightCardProps> = ({
  card,
  onClick,
}) => {
  return (
    <div
      className="flex h-[182px] min-w-0 flex-col overflow-hidden rounded-[20px] border bg-white shadow-sm transition-all duration-200 hover:shadow-md"
      style={{
        borderColor: card.borderColor,
      }}
    >
      {/* Card Content */}
      <div className="flex flex-1 flex-col px-[18px] py-[15px]">
        <h3 className="text-[15px] font-semibold text-slate-800">
          {card.title}
        </h3>

        <div className="mt-auto flex items-baseline gap-1">
          <span
            className="text-[32px] font-bold leading-none"
            style={{
              color: card.textColor,
            }}
          >
            {card.count}
          </span>

          <span
            className="text-[15px]"
            style={{
              color: card.textColor,
            }}
          >
            -
          </span>

          <span
            className="text-[15px]"
            style={{
              color: card.textColor,
            }}
          >
            {card.employeeCount}
          </span>

          <span className="text-[14px] text-slate-500">
            {card.employeeText}
          </span>
        </div>
      </div>

      {/* Footer */}
      <Button
        type="button"
        variant="ghost"
        size="default"
        disabled={!card.enabled}
        onClick={() => onClick(card)}
        className={`flex h-[54px] items-center justify-center gap-2 border-t bg-white text-[15px] font-medium transition ${
          card.enabled
            ? "cursor-pointer text-[#1683ee] hover:bg-slate-50"
            : "cursor-not-allowed text-gray-300"
        }`}
        style={{
          borderTopColor: card.borderColor,
        }}
      >
        View Details

        {card.enabled && (
          <ChevronRight size={18} />
        )}
      </Button>
    </div>
  );
};

export default TAInsightCard;