import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

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
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
            formatter={(value: any, name: string) => [
              `${value} Students (${Math.round((Number(value) / Math.max(1, total)) * 100)}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Label */}
      <div className="absolute top-[42%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="text-xl font-extrabold text-white">{total}</div>
        <div className="text-[10px] uppercase font-semibold text-slate-400">Enrolled</div>
      </div>
    </div>
  );
};
