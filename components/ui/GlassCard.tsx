import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 ${className}`}
    >
      {/* Glossy highlight at the top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};