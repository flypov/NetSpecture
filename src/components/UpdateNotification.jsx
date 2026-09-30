import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RotateCw, CheckCircle, ArrowRight } from 'lucide-react';

export const UpdateNotification = React.memo(({ updateStatus = {} }) => {
  const { isAvailable, progress = 0, isReady } = updateStatus;

  if (!isAvailable && !isReady) return null;

  const handleInstall = () => {
    if (window.electronAPI && window.electronAPI.installUpdate) {
      window.electronAPI.installUpdate();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 w-80 p-5 rounded-[2rem] liquid-glass-panel flex flex-col gap-4 font-sans shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
            {isReady ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-zinc-200" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">
              {isReady ? 'Update Ready' : 'Downloading Update'}
            </h4>
            <p className="text-xs text-zinc-400 font-mono">
              {isReady ? 'Release packaged & verified' : `Fetching core update (${Math.round(progress)}%)`}
            </p>
          </div>
        </div>
        {!isReady ? (
          <div className="space-y-1.5">
            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
                className="h-full rounded-full bg-white"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Restart & Install</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
});
