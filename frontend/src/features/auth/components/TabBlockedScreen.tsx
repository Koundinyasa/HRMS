interface TabBlockedScreenProps {
  onUseHere: () => void;
}

/** Shown in a second tab: the app can only be used in one tab at a time. */
export default function TabBlockedScreen({ onUseHere }: TabBlockedScreenProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 px-6 text-center text-sm text-slate-600">
      <p className="text-base font-medium text-slate-800">
        HRMS is already open in another tab or window.
      </p>
      <p>Only one tab can be used at a time.</p>
      <button
        type="button"
        onClick={onUseHere}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Use HRMS in this tab
      </button>
    </div>
  );
}
