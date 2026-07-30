import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
}) => {
  return (
    <Card className="hover:border-indigo-500/50 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {value}
            </h3>
            {change && (
              <div className="flex items-center text-xs mt-2 font-medium">
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500 mr-1" />
                )}
                <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {change}
                </span>
                <span className="text-slate-400 ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
