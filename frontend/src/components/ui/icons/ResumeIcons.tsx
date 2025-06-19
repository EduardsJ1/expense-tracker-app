const ResumeIcon = ({ size = 32, color = "#2563eb" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="12,8 24,16 12,24" fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export default ResumeIcon;
