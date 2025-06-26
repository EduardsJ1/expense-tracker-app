interface HamburgerIconProps {
  size?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

function HamburgerIcon({ 
  size = 24, 
  className = '',
  strokeColor = 'currentColor',
  strokeWidth = 2
}: HamburgerIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
    >
      <path
        fill="none"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M5 8h22M5 16h22M5 24h22"
      />
    </svg>
  );
}

export default HamburgerIcon;