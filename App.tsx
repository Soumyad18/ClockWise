import React, { useState, useEffect } from 'react';
import { ClockCard } from './components/ClockCard';
import { HistoryPanel, WorkLog } from './components/HistoryPanel';
import { Navbar } from './components/Navbar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [logs, setLogs] = useLocalStorage<WorkLog[]>('clockwise_logs', []);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      new Notification("ClockWise", { body: "Notifications enabled! We'll alert you when it's time to leave." });
    }
  };

  const handleLogComplete = (newLog: WorkLog) => {
    const today = new Date().toDateString();
    const isDuplicate = logs.some(log => new Date(log.date).toDateString() === today);

    if (isDuplicate) {
        if(!window.confirm("You already have a log for today. Do you want to overwrite it?")) {
            return;
        }
        setLogs((prev) => [newLog, ...prev.filter(l => new Date(l.date).toDateString() !== today)]);
    } else {
        setLogs((prev) => [newLog, ...prev]);
    }
    setIsHistoryOpen(true);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire history?")) {
      setLogs([]);
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center relative overflow-hidden bg-[#020617] text-white font-sans selection:bg-indigo-500/30">
      
      {/* Ambient Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      {/* Navbar Container */}
      <div className="flex-none w-full flex justify-center pt-6 px-4 z-50">
        <Navbar 
          permission={permission} 
          onRequestPermission={requestPermission}
          onToggleHistory={() => setIsHistoryOpen(true)}
        />
      </div>

      {/* Main Content - Flex Grow to center vertically */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-4 min-h-0 z-10">
        <ClockCard 
          onLogComplete={handleLogComplete} 
          notificationPermission={permission} 
        />
      </main>

      {/* Minimal Footer */}
      <footer className="flex-none w-full text-center text-white/10 text-[10px] py-4 z-10 uppercase tracking-widest">
        ClockWise
      </footer>

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryOpen && (
          <HistoryPanel 
            logs={logs} 
            onClearHistory={handleClearHistory} 
            onClose={() => setIsHistoryOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;