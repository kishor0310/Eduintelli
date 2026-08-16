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

export interface PerformanceTrendPoint {
  month: string;
  performance: number;
  attendance: number;
}

interface PerformanceLineChartProps {
  data: PerformanceTrendPoint[];
}

export const PerformanceLineChart: React.FC<PerformanceLineChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            domain={[0, 100]}
            tickLine={false}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
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
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#0f172a' }}
            activeDot={{ r: 6, fill: '#38bdf8' }}
          />
          <Line
            type="monotone"
            dataKey="attendance"
            name="attendance"
            stroke="#a855f7"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#a855f7' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
