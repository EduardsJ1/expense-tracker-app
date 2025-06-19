
const PausedIcon = ({ size = 20, color = "#9ca3af" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="5" width="3" height="14" stroke={color} strokeWidth="2" fill="none" rx="1.5" />
    <rect x="15" y="5" width="3" height="14" stroke={color} strokeWidth="2" fill="none" rx="1.5" />
  </svg>
);

export default PausedIcon;
