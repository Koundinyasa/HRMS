import { useMemo, useState } from "react";

import { useGetInterviewerFeedbackWorklistQuery } from "../apis/recruitmentApi";
import type { InterviewerFeedbackWorklistItem } from "../types/recruitment.types";

const EMPTY_INTERVIEWS: InterviewerFeedbackWorklistItem[] = [];

export function useInterviewerFeedbackWorkspace(defaultPageSize: number) {
  const query = useGetInterviewerFeedbackWorklistQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const interviews = query.data?.interviews ?? EMPTY_INTERVIEWS;
  const normalizedSearch = search.trim().toLowerCase();
  const filteredInterviews = useMemo(
    () =>
      interviews.filter((interview) =>
        [
          interview.code,
          interview.candidateCode,
          interview.candidateName,
          interview.position,
          interview.roundName,
        ].some((value) => value.toLowerCase().includes(normalizedSearch)),
      ),
    [interviews, normalizedSearch],
  );
  const totalPages = Math.max(1, Math.ceil(filteredInterviews.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageInterviews = filteredInterviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const selectedInterview =
    filteredInterviews.find((interview) => interview.id === selectedId) ?? null;

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setSelectedId(null);
  };

  const updatePageSize = (value: number) => {
    setPageSize(value);
    setPage(1);
    setSelectedId(null);
  };

  return {
    ...query,
    search,
    setSearch: updateSearch,
    interviews,
    filteredInterviews,
    currentPage,
    pageSize,
    setPage,
    setPageSize: updatePageSize,
    totalPages,
    pageInterviews,
    selectedInterview,
    setSelectedId,
  };
}
