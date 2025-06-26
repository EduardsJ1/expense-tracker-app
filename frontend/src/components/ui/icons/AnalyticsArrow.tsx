interface AnalyticsArrowProps {
  direction: 'up' | 'down';
  size?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

function AnalyticsArrow({ 
  direction, 
  size = 36, 
  className = '',
  strokeColor = '#fff',
  strokeWidth = 2.5
}: AnalyticsArrowProps) {
  const isUp = direction === 'up';
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 36 36" 
      fill="none"
      className={className}
      style={{ shapeRendering: 'geometricPrecision' }}
    >
      <polyline
        points={isUp ? "8,26 14,18 18,22 28,10" : "8,10 14,18 18,14 28,26"}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={isUp ? "24,10 28,10 28,14" : "24,26 28,26 28,22"}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default AnalyticsArrow;