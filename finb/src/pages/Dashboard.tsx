import React, { useState } from 'react';
import { CreditCard, TrendingUp, DollarSign, PiggyBank, Percent } from 'lucide-react'; // Added PiggyBank, Percent
import { TimeRange } from '../types';
import { 
  mockFinancialData, 
  getTotalBalance, 
  getTotalIncome, 
  getTotalExpenses 
} from '../data/mockData';
import FinancialCard from '../components/dashboard/FinancialCard';
import ExpenseIncomeChart from '../components/dashboard/ExpenseIncomeChart';
import SpendingPieChart from '../components/dashboard/SpendingPieChart';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import BudgetProgress from '../components/dashboard/BudgetProgress';
// import NotificationCard from '../components/dashboard/NotificationCard'; // If you plan to use it

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const totalBalance = getTotalBalance(mockFinancialData);
  const totalIncome = getTotalIncome(mockFinancialData, timeRange);
  const totalExpenses = getTotalExpenses(mockFinancialData, timeRange);
  const netSavings = totalIncome - totalExpenses;
  const savingsRatio = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;
  
  // Mock trends for the new card
  const netSavingsTrend = netSavings > 500 ? 1.5 : -0.5; // Example trend logic
  const savingsRatioTrend = savingsRatio > 20 ? 2.1 : -1.2; // Example trend logic for ratio

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          Financial Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
          Hi {mockFinancialData.user.name.split(' ')[0]}, here's an overview of your financial activity.
        </p>
      </div>
      
      {/* Financial Overview Cards - Now 4 cards */}
      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <FinancialCard
          title="Total Balance"
          value={totalBalance}
          icon={<CreditCard size={20} />}
          trend={3.2} 
          trendLabel="vs last month"
          timeRange={timeRange} 
          onTimeRangeChange={handleTimeRangeChange} 
        />
        <FinancialCard
          title="Income"
          value={totalIncome}
          icon={<TrendingUp size={20} />}
          trend={5.1} 
          trendLabel={`vs last ${timeRange.replace('ly', '').replace('ytd', 'year')}`}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          isCurrency={true}
        />
        <FinancialCard
          title="Expenses"
          value={totalExpenses}
          icon={<DollarSign size={20} />}
          trend={-2.3}
          trendLabel={`vs last ${timeRange.replace('ly', '').replace('ytd', 'year')}`}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          isCurrency={true}
        />
        <FinancialCard
          title="Savings Ratio"
          value={savingsRatio} // This is a percentage
          icon={<Percent size={20} />} // Using Percent icon
          trend={savingsRatioTrend} // Example trend
          trendLabel={`vs last ${timeRange.replace('ly', '').replace('ytd', 'year')}`}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          isPercentage={true} // Add a prop to format as percentage
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 mb-6 md:grid-cols-5 md:gap-6"> 
        <div className="md:col-span-3">
          <ExpenseIncomeChart data={mockFinancialData.monthlyFinancials} />
        </div>
        <div className="md:col-span-2">
          <SpendingPieChart data={mockFinancialData.categorySpending} />
        </div>
      </div>
      
      {/* Transactions and Budget Progress */}
      <div className=" gap-4 mb-6 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          {/* Ensure transactions table on dashboard shows limited items */}
          <TransactionsTable transactions={mockFinancialData.transactions} /> 
        </div>
      </div>
              <div>
          <BudgetProgress budgets={mockFinancialData.budgets} />
        </div>
    </div>
  );
};

export default Dashboard;