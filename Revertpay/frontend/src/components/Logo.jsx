// Two variants of the same idea:
// "mark"    -> the Buyer/Escrow/Seller graph — use anywhere with room (sidebar, login page)
// "compact" -> the reversible ledger cycle — use at tiny sizes (favicon, mobile top bar)

function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" role="img" aria-label="RevertPay">
      <rect width="100" height="100" rx="22" fill="#10131b" />

      {/* Revert path — dashed arc over the top */}
      <path
        d="M 70 23 Q 50 2 30 23"
        stroke="#caff4a"
        strokeWidth="2.2"
        strokeDasharray="4 4"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      <polygon points="30,23 36,20 34.5,27" fill="#caff4a" opacity="0.75" />

      {/* Buyer -> Escrow */}
      <line x1="27.9" y1="35" x2="44.1" y2="63.5" stroke="#caff4a" strokeWidth="3" strokeLinecap="round" />
      <polygon points="44.1,63.5 39,60.7 44.3,57.7" fill="#caff4a" />

      {/* Escrow -> Seller */}
      <line x1="55.9" y1="63.5" x2="72.1" y2="35" stroke="#caff4a" strokeWidth="3" strokeLinecap="round" />
      <polygon points="72.1,35 72.2,40.8 67,37.9" fill="#caff4a" />

      <circle cx="24" cy="28" r="8" fill="#f5f5f0" />
      <circle cx="76" cy="28" r="8" fill="#f5f5f0" />
      <circle cx="50" cy="74" r="12" fill="#caff4a" />
      <circle cx="50" cy="74" r="4" fill="#10131b" />
    </svg>
  );
}

function LogoMarkCompact({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" role="img" aria-label="RevertPay">
      <rect width="100" height="100" rx="22" fill="#10131b" />

      <circle
        cx="50" cy="50" r="32"
        stroke="#caff4a" strokeWidth="7" fill="none"
        strokeDasharray="75 126" strokeLinecap="round"
        transform="rotate(-30 50 50)"
      />
      <polygon points="50,15 58,22 46,24" fill="#caff4a" />

      <circle
        cx="50" cy="50" r="32"
        stroke="#f5f5f0" strokeWidth="7" fill="none"
        strokeDasharray="75 126" strokeLinecap="round"
        opacity="0.55"
        transform="rotate(150 50 50)"
      />
      <polygon points="50,85 42,78 54,76" fill="#f5f5f0" opacity="0.55" />

      <circle cx="50" cy="50" r="9" fill="#caff4a" />
      <circle cx="50" cy="50" r="3" fill="#10131b" />
    </svg>
  );
}

function Logo({ size = 40, variant = "mark", withWordmark = false, light = false }) {
  const Mark = variant === "compact" ? LogoMarkCompact : LogoMark;

  if (!withWordmark) {
    return <Mark size={size} />;
  }

  return (
    <div className="logo-lockup">
      <Mark size={size} />
      <span className="logo-wordmark" style={{ color: light ? "#ffffff" : "#10131b" }}>
        RevertPay
      </span>
    </div>
  );
}

export default Logo;
export { LogoMark, LogoMarkCompact };