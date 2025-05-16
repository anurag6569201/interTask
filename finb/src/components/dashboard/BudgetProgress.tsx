import React from 'react';
import { CategoryBudget } from '../../types';
import { formatCurrency, getCategoryColor, getCategoryIcon } from '../../data/mockData';
import * as LucideIcons from 'lucide-react';

interface BudgetProgressProps {
  budgets: CategoryBudget[];
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgets }) => {
  const getIconByName = (name: string) => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent ? <IconComponent size={16} /> : <LucideIcons.Circle size={16} />;
  };

  return (
    <div className="p-4 md:p-5 bg-white rounded-lg shadow-md dark:bg-gray-800 h-full">
      <h3 className="mb-3 md:mb-4 text-lg font-medium text-gray-800 dark:text-white">Budget Progress</h3>
      
      <div className="space-y-4 max-h-[400px] md:max-h-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {budgets.sort((a,b) => (b.spent / b.budgeted) - (a.spent / a.budgeted)).map((budget) => { // Sort by % spent
          const percentage = budget.budgeted > 0 ? Math.min(Math.round((budget.spent / budget.budgeted) * 100), 100) : 0;
          const remaining = budget.budgeted - budget.spent;
          const isOverBudget = budget.spent > budget.budgeted;
          
          let progressColor = 'bg-success-500 dark:bg-success-400';
          let textColor = 'text-success-700 dark:text-success-300';

          if (percentage > 75 && percentage <= 100 && !isOverBudget) { // Changed from 80 to 75
            progressColor = 'bg-warning-500 dark:bg-warning-400';
            textColor = 'text-warning-700 dark:text-warning-300';
          }
          if (isOverBudget) {
            progressColor = 'bg-error-500 dark:bg-error-400';
            textColor = 'text-error-700 dark:text-error-300';
          }
          
          return (
            <div key={budget.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs md:text-sm">
                <div className="flex items-center">
                  <div 
                    className="flex-shrink-0 flex items-center justify-center w-7 h-7 mr-2 text-white rounded-full"
                    style={{ backgroundColor: getCategoryColor(budget.category) }}
                  >
                    {getIconByName(getCategoryIcon(budget.category))}
                  </div>
                  <span className="font-medium capitalize text-gray-700 dark:text-gray-300 truncate">
                    {budget.category}
                  </span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="font-medium text-gray-800 dark:text-white">
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    /{formatCurrency(budget.budgeted)}
                  </span>
                </div>
              </div>
              
              <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ease-in-out ${progressColor}`}
                  style={{ width: `${isOverBudget ? 100 : percentage}%` }} // Full bar if overbudget
                  title={`${percentage}% spent`}
                />
              </div>
              <div className="text-xs text-right">
                {isOverBudget ? (
                  <span className={textColor}>
                    Over by {formatCurrency(Math.abs(remaining))}
                  </span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatCurrency(remaining)} remaining
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;