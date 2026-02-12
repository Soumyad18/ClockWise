import React from 'react';
import { Bell, BellRing, BellOff, History, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  permission: NotificationPermission;
  onRequestPermission: () => void;
  onToggleHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  permission, 
  onRequestPermission, 
  onToggleHistory 
}) => {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex justify-between items-center shadow-lg shadow-black/20"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Clock className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-white/90">ClockWise</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRequestPermission}
          disabled={permission === 'granted' || permission === 'denied'}
          className={`relative p-2 rounded-full transition-all duration-300 ${
            permission === 'granted' 
              ? 'text-emerald-400 bg-emerald-500/10' 
              : permission === 'denied'
              ? 'text-red-400 bg-red-500/10'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          {permission === 'granted' && <BellRing className="w-4 h-4" />}
          {permission === 'denied' && <BellOff className="w-4 h-4" />}
          {permission === 'default' && (
            <>
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            </>
          )}
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        <button 
          onClick={onToggleHistory}
          className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <History className="w-4 h-4" />
        </button>
      </div>
    </motion.nav>
  );
};