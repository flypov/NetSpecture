import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldX,
  Activity,
  X
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'killswitch':
        return <ShieldX className="w-4 h-4 text-rose-500 animate-pulse" />;
      default:
        return <Activity className="w-4 h-4 text-[var(--accent-color)]" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-950/20';
      case 'warning':
        return 'border-amber-500/30 bg-amber-950/20';
      case 'error':
        return 'border-rose-500/30 bg-rose-950/30';
      case 'killswitch':
        return 'border-rose-500/60 bg-rose-950/40 shadow-[0_0_25px_rgba(244,63,94,0.3)]';
      default:
        return 'border-white/[0.08] bg-[#121217]/85';
    }
  };

  return (
    <div className="fixed top-14 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none font-sans">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.94, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={`pointer-events-auto p-4 rounded-2xl backdrop-blur-2xl border ${getBorderColor(
              toast.type
            )} shadow-2xl flex items-start gap-3 transition-all`}
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
              {getToastIcon(toast.type)}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-bold text-zinc-100 tracking-wide truncate">
                {toast.title}
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed break-words font-mono">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.08] transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
