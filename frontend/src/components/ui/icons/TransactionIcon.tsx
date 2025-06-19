import React from "react";

// Minimalist transaction icon: a simple wrapper (circle) with a $ sign in the center, all one color
const TransactionIcon = ({ size = 32, color = "#2563eb" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Wrapper: simple circle */}
    <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="2" fill="none" />
    {/* Dollar sign in the center */}
    <text x="16" y="21" textAnchor="middle" fontSize="16" fontWeight="bold" fill={color} fontFamily="Arial">$</text>
  </svg>
);

export default TransactionIcon;
