import { FinancialData, Category, Transaction, MonthlyFinancial, CategorySpending, CategoryBudget, Notification } from '../types';

// Helper function to generate random transactions
const generateTransactions = (count: number): Transaction[] => {
  const categories: Category[] = [
    'food', 'transportation', 'housing', 'utilities', 
    'entertainment', 'healthcare', 'shopping', 'travel', 
    'education', 'salary', 'investment', 'other'
  ];

  const descriptions: Record<Category, string[]> = {
    food: ['Grocery Store', 'Restaurant Visit', 'Coffee Shop', 'Food Delivery Service'],
    transportation: ['Gas Station Fill-up', 'Uber Ride', 'Public Transport Pass', 'Car Maintenance'],
    housing: ['Monthly Rent', 'Mortgage Payment', 'Home Insurance Premium', 'Property Tax'],
    utilities: ['Electricity Bill', 'Water Bill', 'Internet Subscription', 'Phone Bill'],
    entertainment: ['Movie Theater Tickets', 'Streaming Subscription', 'Concert Tickets', 'Video Game Purchase'],
    healthcare: ['Doctor Visit Co-pay', 'Pharmacy Prescription', 'Health Insurance', 'Gym Membership Dues'],
    shopping: ['Clothing Store Purchase', 'Electronics Store', 'Online Shopping Order', 'Department Store Haul'],
    travel: ['Flight Tickets Booking', 'Hotel Booking Confirmation', 'Car Rental Fee', 'Travel Insurance Policy'],
    education: ['Tuition Fee Payment', 'Textbooks Purchase', 'Online Course Subscription', 'School Supplies'],
    salary: ['Monthly Salary Deposit', 'Freelance Project Payment', 'Bonus Payment', 'Commission Earned'],
    investment: ['Stock Purchase - AAPL', 'Mutual Fund Dividend', 'Investment Account Deposit', 'Cryptocurrency Buy'],
    other: ['Miscellaneous Expense', 'Gift for Friend', 'Charitable Donation', 'Received Refund']
  };

  const transactions: Transaction[] = [];
  const today = new Date();
  const accountIds = ['acc-1', 'acc-2', 'acc-3'];

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const type = (category === 'salary' || (category === 'investment' && Math.random() > 0.7)) ? 'income' : 'expense'; // Make investment mostly expense (buy)
    const descriptionList = descriptions[category];
    const description = descriptionList[Math.floor(Math.random() * descriptionList.length)];
    
    const date = new Date(today);
    date.setDate(today.getDate() - Math.floor(Math.random() * 60)); // Transactions from last 60 days
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    
    transactions.push({
      id: `tx-${Date.now()}-${i}`, // More unique ID
      date: date.toISOString(),
      description,
      amount: parseFloat((Math.random() * (type === 'income' ? 3000 : 150) + (type === 'income' ? 500 : 5)).toFixed(2)),
      type,
      category,
      accountId: accountIds[Math.floor(Math.random() * accountIds.length)]
    });
  }
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateMonthlyFinancials = (): MonthlyFinancial[] => {
  const months: MonthlyFinancial[] = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      month: monthDate.toLocaleString('default', { month: 'short' }),
      income: parseFloat((Math.random() * 2500 + 3500).toFixed(2)),
      expenses: parseFloat((Math.random() * 1800 + 1800).toFixed(2))
    });
  }
  return months;
};

const generateCategorySpending = (): CategorySpending[] => {
  const categories: Category[] = ['food', 'transportation', 'housing', 'utilities', 'entertainment', 'healthcare', 'shopping'];
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];
  const spending: CategorySpending[] = [];
  let totalAmount = 0;
  const amounts: number[] = categories.map(() => parseFloat((Math.random() * 800 + 100).toFixed(2)));
  amounts.forEach(amount => totalAmount += amount);
  
  categories.forEach((category, index) => {
    spending.push({
      category,
      amount: amounts[index],
      percentage: totalAmount > 0 ? Math.round((amounts[index] / totalAmount) * 100) : 0,
      color: colors[index]
    });
  });
  return spending.sort((a, b) => b.amount - a.amount);
};

const generateBudgets = (): CategoryBudget[] => {
  const categories: Category[] = ['food', 'transportation', 'housing', 'utilities', 'entertainment', 'shopping'];
  return categories.map(category => {
    const budgeted = parseFloat((Math.random() * 800 + 200).toFixed(2));
    const spent = parseFloat((Math.random() * budgeted * 1.1).toFixed(2)); // Can overspend slightly
    return { category, budgeted, spent };
  });
};

const generateNotifications = (): Notification[] => [
  {
    id: 'notif-1', type: 'alert', message: 'You\'ve spent 85% of your food budget this month.',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), read: false, priority: 'medium'
  },
  {
    id: 'notif-2', type: 'tip', message: 'Consider reviewing your entertainment subscriptions to save more.',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), read: true, priority: 'low'
  },
  {
    id: 'notif-3', type: 'alert', message: 'Your "Utilities" bill payment seems higher than usual.',
    date: new Date(new Date().setDate(new Date().getDate() - 0)).toISOString(), read: false, priority: 'high' // Today
  },
  {
    id: 'notif-4', type: 'tip', message: 'Set up a recurring transfer to your savings account to build it faster!',
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), read: true, priority: 'low'
  }
];

export const mockFinancialData: FinancialData = {
  user: {
    id: 'user-123', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'alex.johnson@example.com', savingsGoal: 15000, currentSavings: 7850.20
  },
  accounts: [
    { id: 'acc-1', name: 'Main Checking', balance: 4280.42, type: 'checking', lastUpdate: new Date(new Date().setDate(new Date().getDate()-1)).toISOString() },
    { id: 'acc-2', name: 'High-Yield Savings', balance: 12750.83, type: 'savings', lastUpdate: new Date().toISOString() },
    { id: 'acc-3', name: 'Investment Portfolio', balance: 43250.65, type: 'investment', lastUpdate: new Date(new Date().setDate(new Date().getDate()-2)).toISOString() },
    { id: 'acc-4', name: 'Travel Credit Card', balance: -750.30, type: 'credit', lastUpdate: new Date(new Date().setDate(new Date().getDate()-1)).toISOString() }
  ],
  transactions: generateTransactions(50),
  monthlyFinancials: generateMonthlyFinancials(),
  categorySpending: generateCategorySpending(),
  budgets: generateBudgets(),
  notifications: generateNotifications()
};

export const getTotalBalance = (data: FinancialData): number => data.accounts.reduce((sum, account) => sum + account.balance, 0);

const filterTransactionsByTimeRange = (transactions: Transaction[], type: 'income' | 'expense', timeRange: TimeRange): Transaction[] => {
  const today = new Date();
  let startDate: Date;

  switch (timeRange) {
    case 'monthly':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'quarterly':
      const currentQuarter = Math.floor(today.getMonth() / 3);
      startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
      break;
    case 'ytd':
    default:
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
  }
  startDate.setHours(0,0,0,0);
  return transactions.filter(t => t.type === type && new Date(t.date) >= startDate);
};

export const getTotalIncome = (data: FinancialData, timeRange: TimeRange): number => {
  return filterTransactionsByTimeRange(data.transactions, 'income', timeRange)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getTotalExpenses = (data: FinancialData, timeRange: TimeRange): number => {
  return filterTransactionsByTimeRange(data.transactions, 'expense', timeRange)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
};

export const getCategoryColor = (category: Category): string => {
  const colorMap: Record<Category, string> = {
    food: '#3B82F6', transportation: '#10B981', housing: '#F59E0B',
    utilities: '#EF4444', entertainment: '#8B5CF6', healthcare: '#EC4899',
    shopping: '#6366F1', travel: '#06B6D4', education: '#84CC16',
    salary: '#22C55E', investment: '#14B8A6', other: '#6B7280'
  };
  return colorMap[category] || '#A0AEC0'; // Default color
};

export const getCategoryIcon = (category: Category): string => { // Lucide icon names
  const iconMap: Record<Category, string> = {
    food: 'Utensils', transportation: 'Car', housing: 'Home', utilities: 'Zap',
    entertainment: 'Film', healthcare: 'HeartPulse', shopping: 'ShoppingBag',
    travel: 'Plane', education: 'BookOpen', salary: 'Landmark', // Landmark for salary/income
    investment: 'TrendingUp', other: 'MoreHorizontal'
  };
  return iconMap[category] || 'Circle'; // Default icon
};