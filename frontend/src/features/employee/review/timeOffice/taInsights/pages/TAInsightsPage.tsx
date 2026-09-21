import React from "react";

import TAInsightsHeader from "../components/TAInsightsHeader";
import TAInsightsFilters from "../components/TAInsightsFilters";
import TAInsightCards from "../components/TAInsightCards";
import TAInsightsDetails from "../components/TAInsightsDetails";

import { useTAInsights } from "../hooks/useTAInsights";
import { TA_INSIGHTS_LOADING_MESSAGE } from "../constants/taInsights.constants";

const TAInsightsPage: React.FC = () => {
  const {
    cards,
    employees,
    selectedCard,
    filters,
    showFilters,
    countsLoading,
    detailsLoading,
    error,

    setFilters,
    setShowFilters,
    refetch,
    closeDetails,

    handleCardClick,
  } = useTAInsights();

  return (
    <div className="min-h-screen bg-[#f4f5fa] p-3 md:p-5">
      <TAInsightsHeader
        onAddFilter={() => setShowFilters((prev) => !prev)}
        filters={filters}
        onFromDateChange={(fromDate) =>
          setFilters((previous) => ({ ...previous, fromDate }))
        }
        onToDateChange={(toDate) =>
          setFilters((previous) => ({ ...previous, toDate }))
        }
        onRefresh={() => void refetch()}
        onClear={() => setFilters({})}
      />

      {showFilters && (
        <TAInsightsFilters
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {countsLoading ? (
        <div className="rounded-lg bg-white p-10 text-center text-slate-500 shadow-sm">
          {TA_INSIGHTS_LOADING_MESSAGE}
        </div>
      ) : (
        <TAInsightCards
          cards={cards}
          onCardClick={handleCardClick}
        />
      )}

      <TAInsightsDetails
        selectedCard={selectedCard}
        employees={employees}
        loading={detailsLoading}
        onClose={closeDetails}
      />
    </div>
  );
};

export default TAInsightsPage;