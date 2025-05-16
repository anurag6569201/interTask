import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, DotProps,
} from 'recharts';
import { MonthlyFinancial } from '../../types';
import { formatCurrency } from '../../data/mockData';

interface ExpenseIncomeChartProps {
  data: MonthlyFinancial[];
}

const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 md:p-3 bg-white rounded-lg shadow-lg dark:bg-gray-800 border dark:border-gray-700">
        <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-${index}`} className="flex items-center text-xs text-gray-700 dark:text-gray-200">
            <span className="inline-block w-2 h-2 mr-1.5 rounded-full" style={{backgroundColor: entry.color}}></span>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom dot for active points for better visibility
const CustomizedActiveDot: React.FC<DotProps & {payload?:any}> = (props) => {
  const { cx, cy, stroke, payload, value } = props;
  if (!cx || !cy) return null; // Ensure cx and cy are valid numbers

  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} fill={stroke} viewBox="0 0 1024 1024">
      <circle cx="10" cy="10" r="5" strokeWidth="2" fill={stroke} stroke="#fff"/>
    </svg>
  );
};


const ExpenseIncomeChart: React.FC<ExpenseIncomeChartProps> = ({ data }) => {
  return (
    <div className="p-4 md:p-5 bg-white rounded-lg shadow-md dark:bg-gray-800 h-full flex flex-col">
      <h3 className="mb-2 md:mb-4 text-lg font-medium text-gray-800 dark:text-white">Income vs. Expenses Trend</h3>
      <div className="flex-grow h-60 md:h-72"> {/* Ensure chart has space */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: -15, bottom: 5 }} // Adjusted margins
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} className="stroke-gray-300 dark:stroke-gray-700"/>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} className="fill-gray-600 dark:fill-gray-400" />
            <YAxis 
              tickFormatter={(value) => `$${value/1000}k`} // Format to K for thousands
              tick={{ fontSize: 10 }} 
              className="fill-gray-600 dark:fill-gray-400"
              width={45}
            />
            <Tooltip content={<CustomTooltipContent />} wrapperStyle={{ zIndex: 1000 }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}
              formatter={(value) => <span className="text-gray-700 dark:text-gray-300">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#incomeGradient)"
              activeDot={<CustomizedActiveDot />}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#EF4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#expenseGradient)"
              activeDot={<CustomizedActiveDot />}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseIncomeChart;