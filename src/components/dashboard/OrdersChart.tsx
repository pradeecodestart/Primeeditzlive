'use client';
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const sampleOrdersData = [
  { month: 'Jul', completed: 45, pending: 12 },
  { month: 'Aug', completed: 52, pending: 8 },
  { month: 'Sep', completed: 61, pending: 15 },
  { month: 'Oct', completed: 78, pending: 10 },
  { month: 'Nov', completed: 85, pending: 18 },
  { month: 'Dec', completed: 94, pending: 14 },
];

export const OrdersChart: React.FC = () => {
  return (
    <div className="h-72 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sampleOrdersData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
          <YAxis stroke="#94A3B8" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
          />
          <Bar dataKey="completed" fill="#6366F1" radius={[4, 4, 0, 0]} name="Completed" />
          <Bar dataKey="pending" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Pending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
