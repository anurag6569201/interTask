import React, { useState } from 'react';
import { Target, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { mockFinancialData, formatCurrency } from '../data/mockData'; // mockFinancialData is not used here, but formatCurrency is.

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string; // Consider using a more specific type if available
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([ // Added setGoals for future CRUD
    {
      id: 'goal1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2024-12-31',
      category: 'Savings'
    },
    {
      id: 'goal2',
      name: 'New Car Downpayment',
      targetAmount: 25000,
      currentAmount: 8000,
      deadline: '2025-06-30',
      category: 'Purchase'
    },
    {
      id: 'goal3',
      name: 'Dream Vacation to Japan',
      targetAmount: 5000,
      currentAmount: 3500,
      deadline: '2024-08-15',
      category: 'Travel'
    },
    {
      id: 'goal4',
      name: 'Home Renovation',
      targetAmount: 15000,
      currentAmount: 1250,
      deadline: '2025-12-31',
      category: 'Housing'
    }
  ]);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + (goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0), 0) / goals.length)
    : 0;

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          Financial Goals
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
          Track and manage your savings goals to achieve your dreams.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 mb-6 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider md:text-sm">Total Goals</h3>
            <div className="p-1.5 md:p-2 text-primary-600 bg-primary-100 rounded-lg dark:bg-primary-900/20">
              <Target size={20} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:text-sm">Active financial goals</p>
        </div>

        <div className="p-4 md:p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider md:text-sm">Total Saved</h3>
            <div className="p-1.5 md:p-2 text-success-600 bg-success-100 rounded-lg dark:bg-success-900/20">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalSaved)}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:text-sm">Across all goals</p>
        </div>

        <div className="p-4 md:p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider md:text-sm">Average Progress</h3>
            <div className="p-1.5 md:p-2 text-warning-600 bg-warning-100 rounded-lg dark:bg-warning-900/20">
              <Target size={20} /> {/* Could use a different icon like TrendingUp */}
            </div>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {averageProgress}%
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:text-sm">Overall completion rate</p>
        </div>
      </div>

      {/* Goals List */}
      <div className="p-4 md:p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-0">Your Goals</h2>
          <button className="flex items-center px-3 py-2 text-xs text-white bg-primary-500 rounded-md hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 md:text-sm md:px-4">
            <Plus size={16} className="mr-2" />
            <span>Add New Goal</span>
          </button>
        </div>

        {goals.length > 0 ? (
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {goals.map((goal) => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const deadlineDate = new Date(goal.deadline);
              const today = new Date();
              // Ensure deadline is in the future and time part is normalized for correct day diff
              deadlineDate.setHours(0,0,0,0);
              today.setHours(0,0,0,0);
              const daysLeft = Math.max(0, Math.ceil( (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

              return (
                <div key={goal.id} className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-md md:text-lg font-medium text-gray-900 dark:text-white">{goal.name}</h3>
                      <span className="px-2 py-0.5 text-xs font-medium text-primary-700 bg-primary-100 rounded-full dark:bg-primary-900/30 dark:text-primary-300">
                        {goal.category}
                      </span>
                    </div>
                    <div className="flex space-x-1 md:space-x-2">
                      <button className="p-1.5 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-500">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 rounded-full hover:text-error-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1 text-xs md:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className="h-2.5 rounded-full bg-primary-500 transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }} // Cap at 100% for visual
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Current</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {formatCurrency(goal.currentAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Target</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Deadline</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {new Date(goal.deadline + 'T00:00:00').toLocaleDateString()} {/* Ensure date is treated as local */}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Remaining</p>
                      <p className={`font-medium ${daysLeft <= 30 && daysLeft > 0 ? 'text-warning-600 dark:text-warning-400' : 'text-gray-800 dark:text-white'}`}>
                        {daysLeft > 0 ? `${daysLeft} day${daysLeft === 1 ? '' : 's'}` : (progress >= 100 ? 'Achieved!' : 'Past Due')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            No goals set up yet. Click "Add New Goal" to start!
          </p>
        )}
      </div>
    </div>
  );
};

export default Goals;