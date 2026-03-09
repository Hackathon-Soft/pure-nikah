import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

/**
 * Shows a usage bar: used / limit
 * type: "warning" if near limit, "error" if exceeded
 */
const LimitBanner = ({ label, used, limit, icon: Icon }) => {
  if (!limit || limit === 0) return null; // unlimited
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const exceeded = used >= limit;
  const nearLimit = pct >= 80;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${
      exceeded
        ? "bg-destructive/10 border-destructive/30 text-destructive"
        : nearLimit
        ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400"
        : "bg-muted border-border text-muted-foreground"
    }`}>
      {exceeded
        ? <FiAlertTriangle className="flex-shrink-0" />
        : <Icon className="flex-shrink-0 opacity-70" />}
      <span className="font-medium">{label}:</span>
      <span>{used} / {limit} today</span>
      {exceeded && <span className="ml-1 font-semibold">(Limit reached)</span>}
      <div className="ml-auto w-20 h-1.5 rounded-full bg-current/20 overflow-hidden flex-shrink-0">
        <div
          className="h-full rounded-full bg-current transition-all"
          style={{ width: `${pct}%`, opacity: exceeded ? 1 : 0.7 }}
        />
      </div>
    </div>
  );
};

export default LimitBanner;
