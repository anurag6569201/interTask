import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { TimeRange } from '../../types';
import { formatCurrency } from '../../data/mockData';

interface FinancialCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isCurrency?: boolean; // To explicitly format as currency
  isPercentage?: boolean; // To explicitly format as percentage
}

const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  timeRange,
  onTimeRangeChange,
  isCurrency = true, // Default to true if not specified, except for ratio
  isPercentage = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const timeRangeOptions: { label: string; value: TimeRange }[] = [
    { label: 'Month', value: 'monthly' },
    { label: 'Quarter', value: 'quarterly' },
    { label: 'YTD', value: 'ytd' },
  ];

  const displayValue = isPercentage ? `${value}%` : (isCurrency ? formatCurrency(value) : value.toLocaleString());

  return (
    <div 
      className="relative overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg dark:bg-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
          <div className={`p-1.5 md:p-2 text-white rounded-lg shadow-sm ${
            title === "Savings Ratio" ? "bg-emerald-500 dark:bg-emerald-600" 
            : title === "Expenses" ? "bg-red-500 dark:bg-red-600" 
            : title === "Income" ? "bg-green-500 dark:bg-green-600" 
            : "bg-primary-500 dark:bg-primary-600" 
          }`}>
            {icon}
          </div>
        </div>
        
        <div className="mb-2 md:mb-3">
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {displayValue}
          </p>
          
          {trend !== undefined && (
            <div className="flex items-center mt-1">
              <span className={`flex items-center text-xs md:text-sm font-medium ${trend >= 0 ? 'text-success-500' : 'text-error-500'}`}>
                {trend >= 0 ? <ArrowUp size={14} className="mr-0.5" /> : <ArrowDown size={14} className="mr-0.5" />}
                {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span className="ml-1.5 text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex space-x-1 text-xs border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          {timeRangeOptions.map(opt => (
            <button
              key={opt.value}
              className={`px-2 py-1 rounded-md flex-1 sm:flex-none transition-colors duration-150 ${
                timeRange === opt.value
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-800/60 dark:text-primary-300 font-medium'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              onClick={() => onTimeRangeChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      <div 
        className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      ></div>
    </div>
  );
};

export default FinancialCard;