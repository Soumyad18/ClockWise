import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
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
  notificationPermission: NotificationPermission;
}

export const ClockCard: React.FC<ClockCardProps> = ({ onLogComplete, notificationPermission }) => {
  const [loginTime, setLoginTime] = useState<string>('');
  const [logoutDate, setLogoutDate] = useState<Date | null>(null);
  const [remainingText, setRemainingText] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  
  const [notifiedFiveMin, setNotifiedFiveMin] = useState(false);
  const [notifiedFinal, setNotifiedFinal] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loginTime) {
      setLoginTime(getCurrentTimeInput());
    }
  }, []);

  useEffect(() => {
    if (loginTime) {
      const calculatedLogout = calculateLogoutTime(loginTime);
      setLogoutDate(calculatedLogout);
      setNotifiedFiveMin(false);
      setNotifiedFinal(false);
    } else {
      setLogoutDate(null);
    }
  }, [loginTime]);

  useEffect(() => {
    if (!logoutDate || !loginTime) return;

    const tick = () => {
      const now = new Date();
      setRemainingText(getTimeRemaining(logoutDate));
      setProgress(calculateProgress(loginTime, logoutDate));

      if (notificationPermission === 'granted') {
        const diffInMs = logoutDate.getTime() - now.getTime();
        const diffInSeconds = diffInMs / 1000;
        
        if (diffInSeconds <= 300 && diffInSeconds > 0 && !notifiedFiveMin) {
          new Notification("ClockWise ⏳", { 
            body: "5 minutes remaining! Wrap up your tasks.",
            icon: "/vite.svg" 
          });
          setNotifiedFiveMin(true);
        }

        if (diffInSeconds <= 0 && !notifiedFinal) {
          new Notification("ClockWise 🎉", { 
            body: "Time to log out! You've completed your 8h 35m shift.",
            icon: "/vite.svg"
          });
          setNotifiedFinal(true);
        }
      }
    };

    tick(); 
    const interval = setInterval(tick, 10000); 

    return () => clearInterval(interval);
  }, [logoutDate, loginTime, notificationPermission, notifiedFiveMin, notifiedFinal]);

  const handleSetCurrentTime = () => {
    setLoginTime(getCurrentTimeInput());
  };

  const handleInputClick = () => {
    if (inputRef.current && 'showPicker' in inputRef.current) {
        try {
            (inputRef.current as any).showPicker();
        } catch (e) {
            // Fallback
        }
    }
  };

  const handleSaveLog = () => {
    if (loginTime && logoutDate) {
      const today = new Date();
      const newLog: WorkLog = {
        id: crypto.randomUUID(),
        date: today.toISOString(),
        loginTime: formatTimeDisplay(new Date().setHours(parseInt(loginTime.split(':')[0]), parseInt(loginTime.split(':')[1])) as unknown as Date), 
        logoutTime: formatTimeDisplay(logoutDate),
        timestamp: Date.now(),
      };
      
      const [hours, mins] = loginTime.split(':').map(Number);
      const tempDate = new Date();
      tempDate.setHours(hours, mins);
      newLog.loginTime = formatTimeDisplay(tempDate);

      onLogComplete(newLog);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      
      {/* Input Section - Blends into background more */}
      <div className="mb-10 w-full flex flex-col items-center">
        <label className="text-indigo-300/60 text-xs font-bold tracking-[0.2em] uppercase mb-4">
          Start Time
        </label>
        
        <div className="relative group flex items-center justify-center">
           <input
            ref={inputRef}
            type="time"
            value={loginTime}
            onChange={(e) => setLoginTime(e.target.value)}
            onClick={handleInputClick}
            className="bg-transparent border-none text-6xl md:text-7xl font-thin text-white text-center focus:ring-0 cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:hidden w-full max-w-[300px] outline-none transition-all group-hover:scale-105 group-hover:text-indigo-100"
          />
          <button 
            onClick={handleSetCurrentTime}
            className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-full text-white/20 hover:text-indigo-400 hover:bg-white/5 transition-all"
            title="Set to now"
          >
            <Clock className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <AnimatePresence mode="wait">
        {logoutDate && (
          <GlassCard className="w-full p-8 md:p-10 flex flex-col items-center text-center relative overflow-visible">
             {/* Glow Effect behind the card */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-3xl -z-10 rounded-full" />

            <div className="w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase">
                  Target Reached At
                </p>
              </div>

              {/* Big Time Display */}
              <div className="py-2">
                <span className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tighter drop-shadow-2xl">
                  {formatTimeDisplay(logoutDate)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-8 mb-4 w-full relative">
                <div className="flex justify-between text-xs text-white/30 font-medium mb-2 uppercase tracking-wider">
                    <span>Progress</span>
                    <span className={progress >= 100 ? "text-emerald-400" : "text-white/50"}>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full relative ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  >
                     {/* Shimmer effect on bar */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
                <p className="mt-3 text-sm text-indigo-200/60 font-medium">
                  {remainingText}
                </p>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveLog}
                className="mt-6 w-full py-4 rounded-xl border border-white/10 text-white/80 font-medium transition-all flex items-center justify-center gap-3 group bg-white/5"
              >
                <span>Save to History</span>
                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </GlassCard>
        )}
      </AnimatePresence>
      
      {!logoutDate && (
        <div className="text-white/20 text-sm mt-10 animate-pulse">
            Set a time to calculate your logout
        </div>
      )}
    </div>
  );
};