interface ActivityIconProps {
  size?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

function ActivityIcon({ 
  size = 24, 
  className = '',
  strokeColor = 'currentColor',
  strokeWidth = 2
}: ActivityIconProps) {
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
        d="M3 16h6l4-11l6 22l4-11h6"
      />
    </svg>
  );
}

export default ActivityIcon;