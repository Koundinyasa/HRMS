import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Icons;
  iconBg?: string;
  iconColor?: string;
  badgeText?: string;
  badgeBg?: string;
  badgeColor?: string;
}

export default function Card({
  title,
  value,
  icon,
  iconBg = "#EFF6FF",
  iconColor = "#2563EB",
  badgeText,
  badgeBg = "#EFF6FF",
  badgeColor = "#2563EB",
}: CardProps) {
  const Icon = Icons[icon] as LucideIcon;

  return (
    <div
      className="
        flex
        min-h-[104px]
        w-full
        items-center
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-5
        py-4
        shadow-[0_5px_16px_rgba(15,23,42,0.10)]
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:shadow-[0_7px_20px_rgba(15,23,42,0.12)]
      "
    >

      {/* =====================================================
          ICON
      ===================================================== */}
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
        "
        style={{
          backgroundColor: iconBg,
        }}
      >
        <Icon
          size={24}
          strokeWidth={2}
          color={iconColor}
        />
      </div>

      {/* =====================================================
          TITLE + VALUE
      ===================================================== */}
      <div className="ml-4 flex min-w-0 flex-col justify-center">

        <span
          className="
            text-[13px]
            font-medium
            leading-4
            text-slate-500
          "
        >
          {title}
        </span>

        <span
          className="
            mt-1
            text-[28px]
            font-bold
            leading-8
            text-slate-900
          "
        >
          {value}
        </span>

      </div>

      {/* =====================================================
          STATUS BADGE
      ===================================================== */}
      {badgeText && (
        <span
          className="
            ml-auto
            shrink-0
            rounded-md
            px-2.5
            py-1
            text-[10px]
            font-semibold
          "
          style={{
            backgroundColor: badgeBg,
            color: badgeColor,
          }}
        >
          {badgeText}
        </span>
      )}

    </div>
  );
}