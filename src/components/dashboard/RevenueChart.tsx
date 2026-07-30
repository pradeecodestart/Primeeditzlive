'use client';
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const sampleData = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5800 },
  { month: 'Mar', revenue: 7100 },
  { month: 'Apr', revenue: 6400 },
  { month: 'May', revenue: 8900 },
  { month: 'Jun', revenue: 10500 },
  { month: 'Jul', revenue: 12100 },
  { month: 'Aug', revenue: 11400 },
  { month: 'Sep', revenue: 13800 },
  { month: 'Oct', revenue: 15200 },
  { month: 'Nov', revenue: 17500 },
  { month: 'Dec', revenue: 19800 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="h-72 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
          <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(val) => `$${val / 1000}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
            formatter={(value: any) => [`$${value}`, 'Revenue']}
          />
          <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
