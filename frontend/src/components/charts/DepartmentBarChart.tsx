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
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey="avgAttendance" name="Avg Attendance %" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          <Bar
            dataKey="atRiskStudents"
            name="At-Risk Students"
            fill="#f43f5e"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
