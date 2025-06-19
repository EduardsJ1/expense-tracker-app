
// Minimalist pie chart icon for analytics
const AnalyticsIcon = ({ size = 32, color = "#2563eb" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Pie chart circle */}
    <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="2" fill="none" />
    {/* Pie chart slice */}
    <path
      d="M16 16 L16 3 A13 13 0 0 1 29 16 Z"
      fill={color}
      opacity="0.3"
    />
    {/* Pie chart divider */}
    <line x1="16" y1="16" x2="29" y2="16" stroke={color} strokeWidth="2" />
  </svg>
);

export default AnalyticsIcon;
