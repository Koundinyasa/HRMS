import { useState } from "react";

function currentMonthLabel() {
  const now = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[now.getMonth()]}/${now.getFullYear()}`;
}

function monthStartEndIso(now = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const start = `${y}-${m}-01`;
  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
  const end = `${y}-${m}-${pad(lastDay)}`;
  return { start, end };
}

export function useOnboardReports() {
  const [month, setMonth] = useState(currentMonthLabel());

  const { start, end } = monthStartEndIso();
  const [fromDate, setFromDate] = useState(start);
  const [toDate, setToDate] = useState(end);

  // Report data will come from API later
  const rows: unknown[] = [];

  return {
    month,
    setMonth,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    rows,
  };
}