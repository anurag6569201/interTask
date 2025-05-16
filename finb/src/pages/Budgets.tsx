import React, { useState } from 'react';
import { Edit2, Plus, Trash2, Save, X } from 'lucide-react';
import { mockFinancialData, formatCurrency, getCategoryColor, getCategoryIcon } from '../data/mockData';
import { CategoryBudget, Category } from '../types';
import * as LucideIcons from 'lucide-react';
import BudgetingAssistant from '../components/budgets/BudgetingAssistant'; // Import the assistant

const Budgets: React.FC = () => {
  const [budgets, setBudgetsState] = useState<CategoryBudget[]>(mockFinancialData.budgets); // Renamed state setter
  const [editingId, setEditingId] = useState<Category | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  
  const getIconByName = (name: string) => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent ? <IconComponent size={20} /> : <LucideIcons.Circle size={20} />;
  };
  
  const handleEdit = (category: Category, amount: number) => {
    setEditingId(category);
    setEditValue(amount);
  };
  
  const handleSave = () => {
    if (editingId) {
      setBudgetsState(prevBudgets => 
        prevBudgets.map(budget => 
          budget.category === editingId 
            ? { ...budget, budgeted: editValue } 
            : budget
        )
      );
      setEditingId(null);
    }
  };
  
  const handleCancel = () => {
    setEditingId(null);
  };

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          Budget Management
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
          Set and track spending limits for each category.
        </p>
      </div>
      
      {/* Budget Summary Card */}
      <div className="p-4 md:p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-lg md:text-xl font-bold text-gray-800 dark:text-white">Monthly Budget Summary</h2>
        
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="p-3 md:p-4 bg-primary-50 rounded-lg dark:bg-primary-900/20">
            <h3 className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider md:text-sm">Total Budgeted</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalBudgeted)}
            </p>
          </div>
          
          <div className="p-3 md:p-4 bg-success-50 rounded-lg dark:bg-success-900/20">
            <h3 className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider md:text-sm">Total Spent</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          
          <div className={`p-3 md:p-4 rounded-lg ${totalRemaining >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-error-50 dark:bg-error-900/20'}`}>
            <h3 className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider md:text-sm">Remaining</h3>
            <p className={`text-xl md:text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-700 dark:text-green-300' : 'text-error-700 dark:text-error-300'}`}>
              {formatCurrency(totalRemaining)}
            </p>
          </div>
        </div>
      </div>
        
      {/* Budget Details Table and Budgeting Assistant (Side by side on larger screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4 md:p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">Category Budgets</h2>
            <button className="flex items-center px-3 py-2 text-xs text-white bg-primary-500 rounded-md hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 md:text-sm md:px-4">
              <Plus size={16} className="mr-2" />
              <span>Add Budget</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 min-w-[150px]">Category</th>
                  <th className="px-4 py-3">Budgeted</th>
                  <th className="px-4 py-3">Spent</th>
                  <th className="px-4 py-3">Remaining</th>
                  <th className="px-4 py-3 min-w-[120px]">Progress</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {budgets.map((budget) => {
                  const percentage = budget.budgeted > 0 ? Math.min(Math.round((budget.spent / budget.budgeted) * 100), 100) : 0;
                  const remaining = budget.budgeted - budget.spent;
                  const isOverBudget = budget.spent > budget.budgeted;
                  
                  let progressColor = 'bg-success-500 dark:bg-success-400';
                  if (percentage > 80 && percentage <= 100) {
                    progressColor = 'bg-warning-500 dark:bg-warning-400';
                  }
                  if (isOverBudget) {
                    progressColor = 'bg-error-500 dark:bg-error-400';
                  }
                  
                  return (
                    <tr key={budget.category} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div 
                            className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-3 text-white rounded-full"
                            style={{ backgroundColor: getCategoryColor(budget.category) }}
                          >
                            {getIconByName(getCategoryIcon(budget.category))}
                          </div>
                          <span className="font-medium capitalize text-gray-800 dark:text-white">
                            {budget.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {editingId === budget.category ? (
                          <input
                            type="number"
                            className="w-24 px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={editValue}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-gray-800 dark:text-white">
                            {formatCurrency(budget.budgeted)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatCurrency(budget.spent)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`font-medium ${isOverBudget ? 'text-error-500 dark:text-error-400' : 'text-success-600 dark:text-success-400'}`}>
                          {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(remaining))}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-full h-2.5 mr-2 bg-gray-200 rounded-full dark:bg-gray-600">
                            <div
                              className={`h-2.5 rounded-full ${progressColor}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {editingId === budget.category ? (
                          <div className="flex justify-end space-x-2">
                            <button 
                              className="p-1 text-success-500 hover:text-success-600"
                              onClick={handleSave} title="Save"
                            >
                              <Save size={18} />
                            </button>
                            <button 
                              className="p-1 text-gray-500 hover:text-gray-600"
                              onClick={handleCancel} title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <button 
                              className="p-1 text-gray-500 hover:text-gray-600"
                              onClick={() => handleEdit(budget.category, budget.budgeted)}
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button className="p-1 text-error-500 hover:text-error-600" title="Delete (mock)">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-1"> {/* Budgeting Assistant takes 1 column on large screens */}
            <BudgetingAssistant budgets={budgets} userName={mockFinancialData.user.name} />
        </div>
      </div>
    </div>
  );
};

export default Budgets;