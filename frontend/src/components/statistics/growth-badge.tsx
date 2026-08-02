import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface GrowthBadgeProps {
    value: number;
    label?: string;
    size?: "sm" | "md";
}

export const GrowthBadge: React.FC<GrowthBadgeProps> = ({
    value,
    label,
    size = "sm",
}) => {
    const isPositive = value > 0;
    const isNegative = value < 0;
    const formattedValue = `${isPositive ? "+" : ""}${value.toLocaleString("id-ID")}%`;

    const sizeClasses =
        size === "sm"
        ? "px-2 py-0.5 text-md font-semibold gap-1"
        : "px-2.5 py-1 text-lg font-semibold gap-1.5";

    const iconSize = size === "sm" ? "w-4.5 h-4.5" : "w-5 h-5";

    let colorClasses = "";

    if (isPositive) {
        colorClasses = "bg-emerald-100 text-emerald-700 border border-emerald-200/60";
    } else if (isNegative) {
        colorClasses = "bg-rose-100 text-rose-700 border border-rose-200/60 ";
    } else {
        colorClasses = "bg-muted text-muted-foreground border border-border";
    }

    return (
        <div className="inline-flex items-center gap-1.5">
        <span
            className={`inline-flex items-center rounded-full tracking-wide transition-colors ${sizeClasses} ${colorClasses}`}
        >
            {isPositive && <TrendingUp className={iconSize} />}
            {isNegative && <TrendingDown className={iconSize} />}
            {!isPositive && !isNegative && <Minus className={iconSize} />}
            <span>{formattedValue}</span>
        </span>

        {label && (
            <span className="text-xs text-muted-foreground font-normal">
            {label}
            </span>
        )}
        </div>
    );
};