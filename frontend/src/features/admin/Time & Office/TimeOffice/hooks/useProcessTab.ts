import { useState } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import { PUNCH_REQUESTS_SUMMARY } from "../constants/punch.mock";
import {
  useGetAllReprocessQuery,
  useGetMissedPunchQuery,
  useGetProcessedQuery,
  useGetProcessHistoryQuery,
  useGetProcessSummaryQuery,
  useGetPunchRequestsSummaryQuery,
  useGetReprocessEffectiveDateQuery,
  useGetShiftUnassignedQuery,
  useGetYetToProcessQuery,
  useProcessAttendanceMutation,
} from "../api/timeofficeApi";
import { formatRangeLabel } from "./processHistory";
import type { ProcessDrilldownTile } from "../types/timeoffice.types";

/** One query hook per drill-down tile, gated by `skip` so only the open tile fetches. */
const useDrilldownQuery = (tile: ProcessDrilldownTile | null, range: { fromDate: string; tillDate: string }) => {
  const missedPunch = useGetMissedPunchQuery(range, {
    skip: tile !== "missedPunch",
    refetchOnMountOrArgChange: true,
  });
  const shiftUnassigned = useGetShiftUnassignedQuery(range, { skip: tile !== "shiftUnassigned" });
  const yetToProcess = useGetYetToProcessQuery(range, { skip: tile !== "yetToProcess" });
  const processed = useGetProcessedQuery(range, { skip: tile !== "processed" });
  const reProcessEffectiveDate = useGetReprocessEffectiveDateQuery(range, { skip: tile !== "reProcessEffectiveDate" });
  const allReProcess = useGetAllReprocessQuery(range, { skip: tile !== "allReProcess" });

  switch (tile) {
    case "missedPunch":
      return missedPunch;
    case "shiftUnassigned":
      return shiftUnassigned;
    case "yetToProcess":
      return yetToProcess;
    case "processed":
      return processed;
    case "reProcessEffectiveDate":
      return reProcessEffectiveDate;
    case "allReProcess":
      return allReProcess;
    default:
      return { data: undefined, isFetching: false };
  }
};

export const useProcessTab = () => {
  const [dateFrom, setDateFrom] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [dateTo, setDateTo] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [openTile, setOpenTile] = useState<ProcessDrilldownTile | null>(null);

  const range = { fromDate: dateFrom, tillDate: dateTo };

  const summaryQuery = useGetProcessSummaryQuery(range);
  const historyQuery = useGetProcessHistoryQuery(range);
  const punchRequestsQuery = useGetPunchRequestsSummaryQuery();
  const drilldownQuery = useDrilldownQuery(openTile, range);
  const [processAttendance, processState] = useProcessAttendanceMutation();

  const summary = summaryQuery.currentData ?? {
    timeAttendance: 0,
    nonTimeAttendance: 0,
    missedPunch: 0,
    shiftUnassigned: 0,
    processed: 0,
    yetToProcess: 0,
    reProcessEffectiveDate: 0,
    allReProcess: 0,
  };
  const history = historyQuery.currentData ?? [];
  const punchRequests = punchRequestsQuery.data ?? PUNCH_REQUESTS_SUMMARY;

  const handleProcess = async () => {
    try {
      await processAttendance(range).unwrap();
      toast.success(`Processed ${formatRangeLabel(parseISO(dateFrom), parseISO(dateTo))}`);
    } catch {
      toast.error("Processing failed. Please try again.");
    }
  };

  return {
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    summary,
    // Keep date changes from inserting/removing a loading line and shifting
    // the Process page while the summary refetches in the background.
    isSummaryLoading: summaryQuery.isLoading,
    isSummaryError: summaryQuery.isError,
    history,
    isHistoryError: historyQuery.isError,
    punchRequests,
    handleProcess,
    isProcessing: processState.isLoading,
    openTile,
    openProcessTile: (tile: ProcessDrilldownTile) => setOpenTile(tile),
    closeProcessTile: () => setOpenTile(null),
    drilldownRows: drilldownQuery.data ?? [],
    isDrilldownLoading: drilldownQuery.isFetching,
  };
};
