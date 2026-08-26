import {
  CheckCircle2,
  Circle,
  Clock3,
} from "lucide-react";

import type {
  TicketTimelineProps,
} from "../types/helpDesk.types";

export default function TicketTimeline({
  ticket,
}: TicketTimelineProps) {

  const formatDateTime = (
    value: string | null
  ) => {

    if (!value) {
      return null;
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleString(
      "en-IN"
    );
  };

  const activities = [
    {
      title: "Ticket Created",
      date: ticket.CreatedDateTime,
      completed: true,
    },

    {
      title: "Last Modified",
      date: ticket.ModifiedDateTime,
      completed: true,
    },

    {
      title: "Resolved",
      date: ticket.ResolvedDateTime,
      completed:
        Boolean(
          ticket.ResolvedDateTime
        ),
    },

    {
      title: "Closed",
      date: ticket.ClosedDateTime,
      completed:
        Boolean(
          ticket.ClosedDateTime
        ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">

      <h3
        className="
          mb-5
          text-base
          font-semibold
          sm:text-lg
        "
      >
        Ticket Activity
      </h3>

      <div className="space-y-5 sm:space-y-6">

        {activities.map(
          (activity, index) => {

            const date =
              formatDateTime(
                activity.date
              );

            const isLast =
              index ===
              activities.length - 1;

            return (
              <div
                key={activity.title}
                className="flex
                  min-w-0
                  gap-3
                  sm:gap-4"
              >

                <div className="flex shrink-0 flex-col items-center">

                  {activity.completed ? (
                    <CheckCircle2 className="
                        h-5
                        w-5
                        text-green-600
                        sm:h-6
                        sm:w-6
                      " />
                  ) : (
                    <Circle className="
                        h-5
                        w-5
                        text-slate-300
                        sm:h-6
                        sm:w-6
                      " />
                  )}

                  {!isLast && (
                    <div className="mt-1 h-8 w-px bg-slate-200" />
                  )}

                </div>

                  <div className="min-w-0 pb-2">

                  <p className="text-sm font-medium sm:text-base">
                    {activity.title}
                  </p>

                  {date ? (
                    <p className="mt-1 break-words text-xs text-slate-500 sm:text-sm">
                      {date}
                    </p>
                  ) : (
                    <p
                      className="
                        mt-1
                        flex
                        items-center
                        gap-1
                        text-xs
                        text-slate-400
                        sm:text-sm
                      "
                    >
                      <Clock3 className="h-3.5 w-3.5" />
                      Not available
                    </p>
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* Assignment */}

      <div
        className="
          mt-5
          rounded-lg
          bg-slate-50
          p-3
          sm:mt-6
          sm:p-4
        "
      >

        <p className="text-xs text-slate-500">
          Assigned To
        </p>

        <p className="mt-1 break-words text-sm font-medium sm:text-base">
          {ticket.AssignedTo ||
            "Not Assigned"}
        </p>

      </div>

    </div>
  );
}