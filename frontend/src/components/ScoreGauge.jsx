export default function ScoreGauge({ score = 0 }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeGradient = "url(#gaugeGradientEmerald)";
  let badgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  let label = "Excellent ATS Match";

  if (score < 50) {
    strokeGradient = "url(#gaugeGradientRose)";
    badgeColor = "text-rose-400 bg-rose-500/10 border-rose-500/30";
    label = "Needs Optimization";
  } else if (score < 75) {
    strokeGradient = "url(#gaugeGradientAmber)";
    badgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";
    label = "Good Potential";
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg width="208" height="208" viewBox="0 0 208 208" className="-rotate-90 transform">
          <defs>
            <linearGradient id="gaugeGradientEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="gaugeGradientAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="gaugeGradientRose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Background circle track */}
          <circle
            cx="104"
            cy="104"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="16"
          />

          {/* Animated score circle fill */}
          <circle
            cx="104"
            cy="104"
            r={radius}
            fill="none"
            stroke={strokeGradient}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            {score}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">
            ATS Score
          </span>
        </div>
      </div>

      <div className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${badgeColor}`}>
        {label}
      </div>
    </div>
  );
}
