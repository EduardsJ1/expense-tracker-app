interface DropdownIconProps {
    className?: string;
    size?: number;
    color?: string;
    isOpen?: boolean;
}

function DropdownIcon({ className = "", size = 16, color = "currentColor", isOpen = false }: DropdownIconProps) {
    return (
        <svg
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${className}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7 10L12 15L17 10"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default DropdownIcon;