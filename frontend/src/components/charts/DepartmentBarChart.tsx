import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export interface DepartmentAnalyticsItem {
  department: string;
  students: number;
  avgGpa: number;
  avgAttendance: number;
  atRiskStudents: number;
  satisfaction: number;
}

interface DepartmentBarChartProps {
  data: DepartmentAnalyticsItem[];
}

export const DepartmentBarChart: React.FC<DepartmentBarChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.7} />
          <XAxis dataKey="department" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} tickLine={false} />
          <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} domain={[0, 100]} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              borderRadius: '0.75rem',
              color: isDark ? '#f8fafc' : '#0f172a',
              fontSize: '12px',
              boxShadow: isDark ? '0 10px 25px -5px rgba(0,0,0,0.5)' : '0 10px 25px -5px rgba(0,0,0,0.08)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey="avgAttendance" name="Avg Attendance %" fill="#0284c7" radius={[6, 6, 0, 0]} />
          <Bar
            dataKey="atRiskStudents"
            name="At-Risk Students"
            fill="#e11d48"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
