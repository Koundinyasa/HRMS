import Card from "./Card";

const cards = [
  {
    title: "Total",
    value: 60,
    icon: "UsersRound" as const,

    iconBg: "#EFF6FF",
    iconColor: "#2563EB",

    badgeText: "Candidates",
    badgeBg: "#EFF6FF",
    badgeColor: "#2563EB",
  },

 {
  title: "Progress",
  value: 3,
  icon: "Sun" as const,
  iconBg: "#FFF8E8",
  iconColor: "#FF8A00",
  badgeText: "Active",
  badgeBg: "#FFF8E8",
  badgeColor: "#FF8A00",
},

  {
    title: "Completed",
    value: 57,
    icon: "CircleCheckBig" as const,

    iconBg: "#ECFDF5",
    iconColor: "#10B981",

    badgeText: "Archived",
    badgeBg: "#ECFDF5",
    badgeColor: "#10B981",
  },
];

export default function CandidateStats() {
  return (
    <div className="mt-5 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card
          key={card.title}
          {...card}
        />
      ))}
    </div>
  );
}