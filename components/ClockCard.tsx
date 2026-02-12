import React, { useState, useEffect } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Clock, ArrowRight, Sun, Moon, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  calculateLogoutTime, 
  formatTimeDisplay, 
  getCurrentTimeInput, 
  getTimeRemaining, 
  calculateProgress 
} from '../utils/timeUtils';
import { WorkLog } from './HistoryPanel';

interface ClockCardProps {
  onLogComplete: (log: WorkLog) => void;
}

export const ClockCard: React.FC<ClockCardProps> = ({ onLogComplete }) => {
  const [loginTime, setLoginTime] = useState<string>('');
  const [logoutDate, setLogoutDate] = useState<Date | null>(null);
  const [remainingText, setRemainingText] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  // Initialize with current time if empty
  useEffect(() => {
    if (!loginTime) {
      setLoginTime(getCurrentTimeInput());
    }
  }, []);

  // Recalculate everything when loginTime changes
  useEffect(() => {
    if (loginTime) {
      const calculatedLogout = calculateLogoutTime(loginTime);
      setLogoutDate(calculatedLogout);
    } else {
      setLogoutDate(null);
    }
  }, [loginTime]);

  // Update countdown timer and progress bar every minute
  useEffect(() => {
    if (!logoutDate || !loginTime) return;

    const updateTimer = () => {
      setRemainingText(getTimeRemaining(logoutDate));
      setProgress(calculateProgress(loginTime, logoutDate));
    };

    updateTimer(); // Run immediately
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [logoutDate, loginTime]);

  const handleSetCurrentTime = () => {
    setLoginTime(getCurrentTimeInput());
  };

  const handleSaveLog = () => {
    if (loginTime && logoutDate) {
      const today = new Date();
      const newLog: WorkLog = {
        id: crypto.randomUUID(),
        date: today.toISOString(),
        loginTime: formatTimeDisplay(new Date().setHours(parseInt(loginTime.split(':')[0]), parseInt(loginTime.split(':')[1])) as unknown as Date), // Rough formatting for display, better to parse accurately but this works for display string "09:00" -> Date -> "9:00 AM"
        logoutTime: formatTimeDisplay(logoutDate),
        timestamp: Date.now(),
      };
      
      // We refine the formatting for the log visually
      // Re-parse loginTime to get proper AM/PM format
      const [hours, mins] = loginTime.split(':').map(Number);
      const tempDate = new Date();
      tempDate.setHours(hours, mins);
      newLog.loginTime = formatTimeDisplay(tempDate);

      onLogComplete(newLog);
    }
  };

  return (
    <GlassCard className="w-full p-8 flex flex-col items-center text-center">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-indigo-500 blur-[60px] opacity-20 rounded-full animate-pulse-slow"></div>
        <Clock className="w-16 h-16 text-indigo-400 relative z-10" />
      </div>

      <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
        Work Schedule
      </h1>
      <p className="text-white/40 text-sm mb-8 font-light">
        8 hours 35 minutes standard shift
      </p>

      {/* Input Area */}
      <div className="w-full max-w-xs space-y-4">
        <label className="block text-left text-xs font-semibold text-white/50 uppercase tracking-wider pl-1">
          Start Time
        </label>
        
        <div className="relative group">
          <input
            type="time"
            value={loginTime}
            onChange={(e) => setLoginTime(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-2xl font-mono text-center text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all hover:bg-white/10 cursor-pointer"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <Timer className="w-5 h-5 text-white/20" />
          </div>
        </div>

        <button
          onClick={handleSetCurrentTime}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium flex items-center justify-center gap-1 w-full py-2"
        >
          Set to Now
        </button>
      </div>

      {/* Results Area */}
      <AnimatePresence mode="wait">
        {logoutDate && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-10 w-full"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

            <div className="grid grid-cols-1 gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">
                    Clock Out At
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 tracking-tight">
                      {formatTimeDisplay(logoutDate)}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      />
                    </div>
                    <p className={`text-sm font-medium ${progress >= 100 ? 'text-emerald-400' : 'text-indigo-300'}`}>
                      {remainingText}
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveLog}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <span>Log this day</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};