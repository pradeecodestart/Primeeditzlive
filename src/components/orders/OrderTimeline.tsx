import React from 'react';
import { OrderTimeline as OrderTimelineType } from '@/types/order';
import { formatDateTime } from '@/lib/utils';
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export const OrderTimeline: React.FC<{ timeline?: OrderTimelineType[] }> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return <p className="text-sm text-slate-500 py-4">No timeline events logged yet.</p>;
  }

  return (
    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-6 py-2">
      {timeline.map((event) => (
        <div key={event.id} className="relative pl-6">
          <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-md">
            <Clock className="h-3 w-3" />
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
              <span className="text-indigo-600 dark:text-indigo-400 uppercase font-mono">{event.status}</span>
              <span>{formatDateTime(event.createdAt)}</span>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{event.description}</p>
            {event.createdBy && <span className="text-[11px] text-slate-400 mt-1 block">Logged by: {event.createdBy}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
