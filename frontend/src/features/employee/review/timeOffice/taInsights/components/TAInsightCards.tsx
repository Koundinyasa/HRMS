import React from "react";
import TAInsightCard from "./TAInsightCard";
import type { TAInsightCount } from "../types/taInsightsTypes";

interface TAInsightCardsProps {
  cards: TAInsightCount[];
  onCardClick: (card: TAInsightCount) => void;
}

const TAInsightCards: React.FC<TAInsightCardsProps> = ({
  cards,
  onCardClick,
}) => {
  return (
    <div className="rounded-[8px] bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <TAInsightCard
            key={card.key}
            card={card}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default TAInsightCards;