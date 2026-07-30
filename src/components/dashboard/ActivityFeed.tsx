import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShoppingBag, FileText, CheckCircle2, UserPlus, Clock } from 'lucide-react';

const sampleActivities = [
  {
    icon: ShoppingBag,
    color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-950',
    title: 'New Order Created',
    desc: 'Bob Martinez submitted ORD-2024-005 (Wedding Package)',
    time: '10 mins ago',
  },
  {
    icon: CheckCircle2,
    color: 'text-green-500 bg-green-100 dark:bg-green-950',
    title: 'Order Completed',
    desc: 'Mike Chen completed ORD-2024-003',
    time: '45 mins ago',
  },
  {
    icon: FileText,
    color: 'text-purple-500 bg-purple-100 dark:bg-purple-950',
    title: 'Invoice Paid',
    desc: 'Invoice INV-2024-001 ($110.00) marked as PAID',
    time: '2 hours ago',
  },
  {
    icon: UserPlus,
    color: 'text-blue-500 bg-blue-100 dark:bg-blue-950',
    title: 'New Client Registered',
    desc: 'Alice Cooper created an account',
    time: '5 hours ago',
  },
];

export const ActivityFeed: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Recent Activity</span>
          <Clock className="h-4 w-4 text-slate-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sampleActivities.map((act, idx) => {
          const Icon = act.icon;
          return (
            <div key={idx} className="flex items-start space-x-3 text-sm">
              <div className={`p-2 rounded-lg ${act.color} shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{act.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{act.desc}</p>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{act.time}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
