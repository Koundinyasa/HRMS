export default function ClassificationStatus({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-9 h-5 rounded-full relative transition-colors ${
        active ? "bg-green-500" : "bg-gray-300"
      }`}
      aria-label={active ? "Deactivate" : "Activate"}
    >
      <span
        className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
          active ? "right-0.5" : "left-0.5"
        }`}
      />
    </button>
  );
}
