import React from 'react';
import { ClockCard } from './components/ClockCard';
import { HistoryPanel, WorkLog } from './components/HistoryPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Github, Info } from 'lucide-react';

const App: React.FC = () => {
  const [logs, setLogs] = useLocalStorage<WorkLog[]>('clockwise_logs', []);

  const handleLogComplete = (newLog: WorkLog) => {
    // Check if a log for today already exists to prevent duplicates (optional logic)
    const today = new Date().toDateString();
    const isDuplicate = logs.some(log => new Date(log.date).toDateString() === today);

    if (isDuplicate) {
        if(!window.confirm("You already have a log for today. Do you want to overwrite it?")) {
            return;
        }
        // Remove old today log
        setLogs((prev) => [newLog, ...prev.filter(l => new Date(l.date).toDateString() !== today)]);
    } else {
        setLogs((prev) => [newLog, ...prev]);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire history?")) {
      setLogs([]);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 relative selection:bg-indigo-500/30">
      
      {/* Navbar / Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12 animate-fade-in-down">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <div className="w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ClockWise</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <Info className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input and Calculator (7 cols) */}
        <div className="lg:col-span-7 w-full flex flex-col gap-6">
          <ClockCard onLogComplete={handleLogComplete} />
          
          {/* Quick Stats or Tips Card */}
          <div className="hidden md:block p-6 rounded-2xl bg-white/5 border border-white/5 text-white/40 text-sm leading-relaxed">
            <strong className="text-white/60 block mb-1">Tip:</strong>
            Standard work hours are calculated as 8 hours and 35 minutes to account for a standard 35-minute lunch break, ensuring you hit exactly 8 hours of productivity.
          </div>
        </div>

        {/* Right Column: History (5 cols) */}
        <div className="lg:col-span-5 w-full h-[500px] lg:h-[600px] sticky top-8">
          <HistoryPanel logs={logs} onClearHistory={handleClearHistory} />
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-20 pb-6 text-center text-white/20 text-xs">
        <p>© {new Date().getFullYear()} ClockWise. Local data storage only.</p>
      </footer>

    </div>
  );
};

export default App;