import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CircularProgressHub = React.memo(({
  isOptimizing,
  progress = 0,
  currentStepMessage = '',
  isComplete,
  lastResult,
  onStartOptimization
}) => {
  const { t, language } = useLanguage();

  const radius = 120;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 select-none font-sans">
      <div className="relative flex items-center justify-center w-[360px] h-[360px]">
        <motion.div
          animate={{
            scale: isOptimizing ? [1, 1.08, 1] : [1, 1.03, 1],
            opacity: isOptimizing ? [0.25, 0.45, 0.25] : [0.15, 0.25, 0.15]
          }}
          transition={{
            repeat: Infinity,
            duration: isOptimizing ? 2 : 4,
            ease: 'easeInOut'
          }}
          className="absolute inset-4 rounded-full bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)] blur-2xl pointer-events-none"
        />

        {isOptimizing && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="w-3 h-3 rounded-full bg-[var(--accent-color)] shadow-[0_0_15px_var(--accent-color)] absolute top-2 left-1/2 -translate-x-1/2" />
          </motion.div>
        )}

        <svg
          className="w-full h-full -rotate-90 transform drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          viewBox="0 0 300 300"
        >
          <circle
            cx="150"
            cy="150"
            r={radius + 16}
            className="stroke-white/[0.04]"
            strokeWidth="1"
            fill="none"
          />

          <circle
            cx="150"
            cy="150"
            r={radius}
            className="stroke-white/[0.06]"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <motion.circle
            cx="150"
            cy="150"
            r={radius}
            stroke={isComplete ? '#10b981' : 'var(--accent-color)'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            strokeLinecap="round"
            fill="none"
            style={{
              filter: isComplete
                ? 'drop-shadow(0 0 10px rgba(16,185,129,0.7))'
                : 'drop-shadow(0 0 12px var(--accent-color))'
            }}
          />

          <circle
            cx="150"
            cy="150"
            r={radius - 18}
            className="stroke-white/[0.04]"
            strokeWidth="1"
            strokeDasharray="4 8"
            fill="none"
          />
        </svg>

        <div className="absolute inset-16 rounded-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_20px_rgba(255,255,255,0.08),0_20px_40px_rgba(0,0,0,0.6)]">
          <AnimatePresence mode="wait">
            {isOptimizing ? (
              <motion.div
                key="running"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="flex flex-col items-center justify-center text-center space-y-2 pointer-events-none"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shadow-lg"
                >
                  <RefreshCw className="w-5 h-5 text-[var(--accent-color)]" />
                </motion.div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-mono tracking-tight text-white">
                    {Math.round(progress)}
                  </span>
                  <span className="text-sm font-bold font-mono text-[var(--accent-color)]">%</span>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  {t('optimizing')}
                </span>
              </motion.div>
            ) : isComplete ? (
              <motion.button
                key="completed"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                onClick={onStartOptimization}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center justify-center text-center space-y-2 cursor-pointer w-full h-full"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
                  {t('runAgain')}
                </span>
                {lastResult?.latencyImprovement && (
                  <div className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-semibold">
                    -{lastResult.latencyImprovement}
                  </div>
                )}
              </motion.button>
            ) : (
              <motion.button
                key="idle"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                onClick={onStartOptimization}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center justify-center text-center space-y-2.5 cursor-pointer w-full h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center shadow-lg group-hover:bg-[var(--accent-color)]/20 group-hover:border-[var(--accent-color)]/50 group-hover:shadow-[0_0_25px_var(--accent-glow)] transition-all">
                  <Zap className="w-6 h-6 text-zinc-200 group-hover:text-[var(--accent-color)] transition-colors" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black tracking-widest text-zinc-100 group-hover:text-[var(--accent-color)] transition-colors uppercase font-mono">
                    {t('startOptimization')}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    {t('coreEngine')}
                  </span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 max-w-md w-full text-center min-h-[3.5rem] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {isOptimizing ? (
            <motion.div
              key={currentStepMessage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-md"
            >
              <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-ping" />
              <span className="text-xs text-zinc-200 font-medium font-mono truncate">
                {currentStepMessage || t('optimizing')}
              </span>
            </motion.div>
          ) : isComplete ? (
            <motion.div
              key="complete-badge"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 shadow-md text-emerald-300"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold font-mono">
                {t('optimizationComplete')}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="idle-desc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-zinc-400 font-mono max-w-sm"
            >
              {t('optimizationSubtitle')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
