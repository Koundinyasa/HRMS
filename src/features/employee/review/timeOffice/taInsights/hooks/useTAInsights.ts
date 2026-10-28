import { useMemo, useState } from "react";

import {
  useGetTAInsightsCountsQuery,
  useGetTAInsightsDetailsQuery,
} from "../api/taInsightsApi";

import type {
  TAInsightCount,
  TAInsightFilters,
  TAInsightsDetailsParams,
} from "../types/taInsightsTypes";
import { TA_INSIGHT_CARD_DEFINITIONS } from "../constants/taInsights.constants";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialFilters(): TAInsightFilters {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    fromDate: formatDate(monthStart),
    toDate: formatDate(today),
  };
}

export const useTAInsights = () => {
  const [filters, setFilters] = useState< TAInsightFilters>(getInitialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TAInsightCount | null>(null);
  const [detailsParams, setDetailsParams] = useState<TAInsightsDetailsParams | null>(null);

  const countsQuery = useGetTAInsightsCountsQuery({
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  });

  const detailsQuery = useGetTAInsightsDetailsQuery(
    detailsParams ?? { insightId: 0 },
    { skip: !detailsParams },
  );

  const cards = useMemo<TAInsightCount[]>(() => {
    return TA_INSIGHT_CARD_DEFINITIONS.map((definition) => {
      const count = countsQuery.data?.[definition.key] ?? 0;

      return {
        key: definition.key,
        title: definition.title,
        count,
        employeeCount: count,
        employeeText: count === 1 ? "Employee" : "Employee(s)",
        borderColor: definition.color,
        textColor: definition.color,
        insightId: definition.insightId,
        enabled: count > 0,
      };
    });
  }, [countsQuery.data]);

  const employees = useMemo(() => {
    const search = filters.search?.trim().toLowerCase();
    const details = detailsQuery.data ?? [];

    if (!search) {
      return details;
    }

    return details.filter(
      (employee) =>
        employee.empId.toLowerCase().includes(search) ||
        employee.empName.toLowerCase().includes(search),
    );
  }, [detailsQuery.data, filters.search]);

  const handleCardClick = (card: TAInsightCount) => {
    if (!card.enabled) {
      return;
    }

    if (selectedCard?.key === card.key) {
      setSelectedCard(null);
      setDetailsParams(null);
      return;
    }

    setSelectedCard(card);
    setDetailsParams({
      insightId: card.insightId,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    });
  };

  return {
    cards,
    employees,
    selectedCard,
    filters,
    showFilters,
    countsLoading: countsQuery.isLoading || countsQuery.isFetching,
    detailsLoading: detailsQuery.isLoading || detailsQuery.isFetching,
    refetch: async () => {
      await countsQuery.refetch();
      if (detailsParams) {
        await detailsQuery.refetch();
      }
    },
    error: countsQuery.error || detailsQuery.error
      ? "Unable to load TA Insights data."
      : null,
    setFilters,
    setShowFilters,
    closeDetails: () => {
      setSelectedCard(null);
      setDetailsParams(null);
    },
    handleCardClick,
  };
};
