import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BgvDashboardStats as BgvDashboardStatsType } from "../types/backgroundverification.types";

interface BgvDashboardStatsProps {
  stats: BgvDashboardStatsType;
}

export default function BgvDashboardStats({ stats }: BgvDashboardStatsProps) {
  const cards = [
    { key: "completedVerifications", label: "Completed Verifications", value: stats.completedVerifications, icon: CheckCircle2, iconBg: "#10B981" },
    { key: "pendingVerifications", label: "Pending Verifications", value: stats.pendingVerifications, icon: Clock, iconBg: "#F59E0B" },
    { key: "discrepancies", label: "Discrepancies", value: stats.discrepancies, icon: AlertTriangle, iconBg: "#EF4444" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.key}>
          <CardContent className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-xl shrink-0 w-11 h-11" style={{ background: card.iconBg }}>
              <card.icon className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{card.label}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}