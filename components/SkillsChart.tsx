
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SKILLS } from '../constants';

const SkillsChart: React.FC = () => {
  const data = SKILLS.map(s => ({
    subject: s.name,
    A: s.level,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-full flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#f0f0f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0a0a0', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Capability Index"
            dataKey="A"
            stroke="#dfb23c"
            fill="#dfb23c"
            fillOpacity={0.15}
          />
          <Tooltip contentStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', borderRadius: '0px', border: '1px solid #f0f0f0' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;
