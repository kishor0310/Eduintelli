import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export interface CourseRadarPoint {
  subject: string;
  studentScore: number;
  classAverage: number;
  attendance: number;
  fullSubjectName?: string;
}

interface CourseRadarChartProps {
  data: CourseRadarPoint[];
}

export const CourseRadarChart: React.FC<CourseRadarChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.8} />
          <PolarAngleAxis
            dataKey="subject"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={11}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke={isDark ? '#64748b' : '#94a3b8'}
            fontSize={10}
            tickFormatter={(val) => `${val}%`}
          />
          <Radar
            name="My Performance"
            dataKey="studentScore"
            stroke="#0284c7"
            fill="#0284c7"
            fillOpacity={0.4}
          />
          <Radar
            name="Cohort Average"
            dataKey="classAverage"
            stroke="#9333ea"
            fill="#9333ea"
            fillOpacity={0.2}
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
            formatter={(value: any) => [`${value}%`]}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
