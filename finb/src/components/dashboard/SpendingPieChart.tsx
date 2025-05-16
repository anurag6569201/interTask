import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategorySpending } from '../../types';
import { formatCurrency } from '../../data/mockData';

interface SpendingPieChartProps {
  data: CategorySpending[];
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null; // Don't render label for small slices
  const radius = innerRadius + (outerRadius - innerRadius) * 0.3; // Adjusted for better placement
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-[10px] md:text-xs font-medium pointer-events-none" // Added pointer-events-none
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltipContent = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 md:p-3 bg-white rounded-lg shadow-lg dark:bg-gray-800 border dark:border-gray-700">
        <p className="mb-1 text-sm font-medium capitalize text-gray-900 dark:text-white">{data.category}</p>
        <p className="text-xs text-gray-700 dark:text-gray-200">{formatCurrency(data.amount)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{data.percentage}% of total spending</p>
      </div>
    );
  }
  return null;
};

const CustomLegendContent = ({ payload, onMouseEnter, onMouseLeave }: any) => (
  <ul className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 md:mt-4 text-xs">
    {payload.map((entry: any, index: number) => (
      <li 
        key={`legend-${index}`} 
        className="flex items-center cursor-pointer truncate"
        onMouseEnter={() => onMouseEnter(entry, index)}
        onMouseLeave={onMouseLeave}
      >
        <div 
          className="w-2.5 h-2.5 mr-1.5 rounded-full flex-shrink-0" 
          style={{ backgroundColor: entry.color }}
        />
        <span className="capitalize text-gray-700 dark:text-gray-300 truncate">
          {entry.value} ({entry.payload.percentage}%)
        </span>
      </li>
    ))}
  </ul>
);


const SpendingPieChart: React.FC<SpendingPieChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  return (
    <div className="p-4 md:p-5 bg-white rounded-lg shadow-md dark:bg-gray-800 h-full flex flex-col">
      <h3 className="mb-2 md:mb-4 text-lg font-medium text-gray-800 dark:text-white">Spending by Category</h3>
      <div className="flex-grow h-60 md:h-72"> {/* Ensure chart has space */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex !== null ? activeIndex : undefined} // Allow no active index
              activeShape={(props: any) => { // Custom active shape
                const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
                return (
                  <g>
                    <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-sm font-semibold capitalize">
                      {payload.category}
                    </text>
                     <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#666" className="text-xs">
                      ({payload.percentage}%)
                    </text>
                    <Sector
                      cx={cx}
                      cy={cy}
                      innerRadius={innerRadius}
                      outerRadius={outerRadius + 5} // Make active sector pop
                      startAngle={startAngle}
                      endAngle={endAngle}
                      fill={fill}
                      stroke={fill} 
                      strokeWidth={2}
                    />
                  </g>
                );
              }}
              data={data}
              cx="50%"
              cy="50%" // Adjust vertical position if legend is below
              labelLine={false}
              label={renderCustomizedLabel}
              innerRadius="40%" // Donut chart
              outerRadius="100%"
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={300}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={darkModeActive ? '#374151' : '#fff'} // Border color based on dark mode
                  strokeWidth={activeIndex === index ? 2 : 1}
                  style={{ filter: activeIndex === index ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' : 'none' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltipContent />} wrapperStyle={{ zIndex: 1000 }}/>
            <Legend 
              content={(props) => <CustomLegendContent {...props} onMouseEnter={onPieEnter} onMouseLeave={onPieLeave} />} 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{paddingTop: '10px'}}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Helper for activeShape rendering (Sector component from recharts examples)
const Sector = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  // This is a simplified version. A full Sector component would handle path generation.
  // For this example, we rely on the default activeShape or a simple effect.
  // The activeShape prop of <Pie> is powerful for full customization.
  // Here, we just modify the Cell for simplicity.
  return null; 
};

// A simple check for dark mode if not passed as prop, for styling cell border
const darkModeActive = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;


export default SpendingPieChart;