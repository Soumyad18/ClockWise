import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { Calendar, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

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
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ logs, onClearHistory, onClose }) => {
  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[80vh] flex flex-col"
      >
        <GlassCard className="w-full h-full flex flex-col p-0 overflow-hidden bg-[#0a0f2c]/80">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-xl font-medium text-white/90 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              History
            </h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-[300px]">
            {sortedLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm italic min-h-[200px]">
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
                    <div className="text-xs text-white/40 mb-1 uppercase tracking-wider font-semibold">
                      {format(new Date(log.date), 'MMM do, yyyy')}
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <span className="text-white/90 font-mono">{log.loginTime}</span>
                      <span className="text-white/20">→</span>
                      <span className="text-indigo-300 font-mono font-medium">{log.logoutTime}</span>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <span className="text-emerald-400 text-xs font-bold">✓</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {logs.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-white/5">
              <button 
                onClick={onClearHistory}
                className="w-full py-3 rounded-xl border border-red-500/20 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear All History
              </button>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};