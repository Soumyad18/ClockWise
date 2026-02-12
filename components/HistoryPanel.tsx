import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export interface WorkLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  loginTime: string;
  logoutTime: string;
  timestamp: number;
}

interface HistoryPanelProps {
  logs: WorkLog[];
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ logs, onClearHistory }) => {
  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <GlassCard delay={0.2} className="w-full h-full p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-white/90 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Recent Activity
        </h3>
        {logs.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="text-xs text-white/40 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {sortedLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-white/30 text-sm italic">
            <p>No records yet.</p>
            <p>Start tracking your time!</p>
          </div>
        ) : (
          sortedLogs.map((log) => (
            <div 
              key={log.id} 
              className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
            >
              <div>
                <div className="text-sm text-white/50 mb-1">
                  {format(new Date(log.date), 'EEE, MMM do')}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-white/80">{log.loginTime}</span>
                  <span className="text-white/20">→</span>
                  <span className="text-indigo-300">{log.logoutTime}</span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <span className="text-emerald-400 text-xs font-bold">✓</span>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
};