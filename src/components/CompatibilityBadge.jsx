import { getScoreTier, getCompatibilityBreakdown, CRITERION_LABELS } from "@/lib/compatibility";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FiInfo } from "react-icons/fi";

/**
 * Circular compatibility badge — shows score % with tier color.
 * Click to see a breakdown popover.
 */
export function CompatibilityBadge({ score, preferences, candidate, size = "md" }) {
  const tier = getScoreTier(score);
  const sizeMap = {
    sm: { ring: "w-10 h-10", text: "text-token-xs", label: false },
    md: { ring: "w-14 h-14", text: "text-token-sm", label: true },
    lg: { ring: "w-20 h-20", text: "text-token-lg", label: true },
  };
  const s = sizeMap[size] || sizeMap.md;

  const badge = (
    <div className={`${s.ring} rounded-full ${tier.bg} flex flex-col items-center justify-center flex-shrink-0 cursor-pointer transition-transform hover:scale-105`}>
      <span className={`${s.text} font-bold ${tier.color}`}>{score}%</span>
      {s.label && <span className="text-[9px] text-muted-foreground leading-none">match</span>}
    </div>
  );

  // If no breakdown data, just show the badge
  if (!preferences || !candidate) return badge;

  const breakdown = getCompatibilityBreakdown(preferences, candidate);

  return (
    <Popover>
      <PopoverTrigger asChild>{badge}</PopoverTrigger>
      <PopoverContent className="w-72 p-token-4" align="end">
        <div className="flex items-center justify-between mb-token-3">
          <h4 className="font-display text-token-sm font-semibold text-foreground">Compatibility Breakdown</h4>
          <span className={`text-token-lg font-bold ${tier.color}`}>{score}%</span>
        </div>
        <p className={`text-token-xs font-medium ${tier.color} mb-token-3`}>{tier.label}</p>
        <div className="space-y-2.5">
          {Object.entries(breakdown).map(([key, { score: s, weight }]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-token-xs text-muted-foreground">{CRITERION_LABELS[key]}</span>
                <span className="text-token-xs font-medium text-foreground">{s}%</span>
              </div>
              <Progress value={s} className="h-1.5" />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-token-3 flex items-center gap-token-1">
          <FiInfo style={{ fontSize: "10px" }} /> Based on your preferences. Update them in Settings.
        </p>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Inline score pill — lighter weight, no popover.
 */
export function CompatibilityPill({ score }) {
  const tier = getScoreTier(score);
  return (
    <span className={`inline-flex items-center gap-token-1 ${tier.bg} ${tier.color} text-token-xs font-semibold px-token-2 py-0.5 rounded-full`}>
      {score}% match
    </span>
  );
}
