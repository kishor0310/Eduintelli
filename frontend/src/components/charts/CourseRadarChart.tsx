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
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" opacity={0.6} />
          <PolarAngleAxis
            dataKey="subject"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="#64748b"
            fontSize={10}
            tickFormatter={(val) => `${val}%`}
          />
          <Radar
            name="My Performance"
            dataKey="studentScore"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.4}
          />
          <Radar
            name="Cohort Average"
            dataKey="classAverage"
            stroke="#a855f7"
            fill="#a855f7"
            fillOpacity={0.15}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
            formatter={(value: any) => [`${value}%`]}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
