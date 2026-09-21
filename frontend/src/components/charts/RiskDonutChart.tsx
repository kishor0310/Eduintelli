import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export interface RiskDistributionItem {
  name: string;
  value: number;
  color: string;
}

interface RiskDonutChartProps {
  data: RiskDistributionItem[];
}

export const RiskDonutChart: React.FC<RiskDonutChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-64 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? '#0f172a' : '#ffffff'} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              borderRadius: '0.75rem',
              color: isDark ? '#f8fafc' : '#0f172a',
              fontSize: '12px',
              boxShadow: isDark ? '0 10px 25px -5px rgba(0,0,0,0.5)' : '0 10px 25px -5px rgba(0,0,0,0.08)',
            }}
            formatter={(value: any, name: string) => [
              `${value} Students (${Math.round((Number(value) / Math.max(1, total)) * 100)}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Label */}
      <div className="absolute top-[42%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="text-xl font-extrabold text-slate-900 dark:text-white">{total}</div>
        <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">Enrolled</div>
      </div>
    </div>
  );
};
