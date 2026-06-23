import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function NotificationCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        p-5
        min-h-[210px]
        shadow-sm
      "
      style={{
        backgroundColor: `${themeColor}15`,
      }}
    >
      <h3 className="text-sm font-medium text-slate-700">
        Notifications
      </h3>

      <div className="flex items-center gap-4 mt-6 text-sm">
        <span
          style={{
            color: themeColor,
            fontWeight: 500,
          }}
        >
          Action Required
        </span>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">
            Announcements
          </span>

          <span
            className="
              text-white
              text-[10px]
              px-2
              py-[2px]
              rounded-full
            "
            style={{
              backgroundColor: themeColor,
            }}
          >
            53
          </span>
        </div>
      </div>

      <div className="border-b border-slate-200 mt-3" />

      <div
        className="
          flex
          items-center
          justify-center
          h-[110px]
          text-slate-400
        "
      >
        No pending actions
      </div>
    </div>
  );
}