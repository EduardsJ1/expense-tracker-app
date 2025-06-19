const RecurringIcon = ({ size = 32, color = "#2563eb" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Calendar outer rectangle */}
    <rect x="4" y="7" width="24" height="20" rx="3" stroke={color} strokeWidth="2" fill="none" />
    {/* Calendar header */}
    <rect x="4" y="7" width="24" height="5" rx="2" fill={color} opacity="0.4" />
    {/* Calendar rings */}
    <line x1="10" y1="4" x2="10" y2="10" stroke={color} strokeWidth="2" />
    <line x1="22" y1="4" x2="22" y2="10" stroke={color} strokeWidth="2" />
    {/* Calendar dots (days) */}
    {/* <circle cx="10" cy="16" r="1.2" fill={color} />
    <circle cx="16" cy="16" r="1.2" fill={color} />
    <circle cx="22" cy="16" r="1.2" fill={color} />
    <circle cx="10" cy="22" r="1.2" fill={color} />
    <circle cx="16" cy="22" r="1.2" fill={color} />
    <circle cx="22" cy="22" r="1.2" fill={color} /> */}
  </svg>
);

export default RecurringIcon;
