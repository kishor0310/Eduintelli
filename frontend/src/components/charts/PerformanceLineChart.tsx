import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export interface PerformanceTrendPoint {
  month: string;
  performance: number;
  attendance: number;
}

interface PerformanceLineChartProps {
  data: PerformanceTrendPoint[];
}

export const PerformanceLineChart: React.FC<PerformanceLineChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.7} />
          <XAxis
            dataKey="month"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={12}
            domain={[0, 100]}
            tickLine={false}
            tickFormatter={(val) => `${val}%`}
          />
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
              `${value}%`,
              name === 'performance' ? 'Academic Mastery' : 'Attendance Rate'
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            formatter={(value) => (value === 'performance' ? 'Academic Score' : 'Attendance %')}
          />
          <Line
            type="monotone"
            dataKey="performance"
            name="performance"
            stroke="#0284c7"
            strokeWidth={3}
            dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: isDark ? '#0f172a' : '#ffffff' }}
            activeDot={{ r: 6, fill: '#0284c7' }}
          />
          <Line
            type="monotone"
            dataKey="attendance"
            name="attendance"
            stroke="#9333ea"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#9333ea' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
