interface DataCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'|'none';
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

function DataCard({ 
  children, 
  variant = 'default',
  className = '',
  header,
  footer 
}: DataCardProps) {
  const variantClasses = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    none: ''
  };

  return(
    <div className={`border rounded-lg shadow-sm p-4 ${variantClasses[variant]} ${className}`}>
      {header && (
        <div className="mb-3 border-b border-gray-100 pb-2">
          {header}
        </div>
      )}
      
      <div>
        {children}
      </div>
      
      {footer && (
        <div className="mt-3 border-t border-gray-100 pt-2">
          {footer}
        </div>
      )}
    </div>
  );
}

// Compound components for better structure
DataCard.Title = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-800 mb-1 ${className}`}>{children}</h3>
);

DataCard.Value = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`text-2xl font-bold text-gray-900 mb-2 ${className}`}>{children}</div>
);

DataCard.Description = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-gray-600 text-sm ${className}`}>{children}</p>
);

export default DataCard;