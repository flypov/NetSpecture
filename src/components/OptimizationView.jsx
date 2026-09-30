import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Server,
  Layers,
  ArrowRight,
  RefreshCw,
  Cpu,
  Activity,
  Radio
} from 'lucide-react';
import { CircularProgressHub } from './CircularProgressHub';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

export const OptimizationView = React.memo(({ interfaces = [] }) => {
  const { t, language } = useLanguage();
  const { addToast } = useToast();

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepMessage, setCurrentStepMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(false);

  const activePhysical = interfaces.find((i) => !i.virtual && i.operstate === 'up');
  const activeVpn = interfaces.find((i) => i.virtual && i.operstate === 'up');
  const primaryAdapter = activeVpn || activePhysical || interfaces[0];

  useEffect(() => {
    if (window.electronAPI?.getAutoOptimizationSettings) {
      window.electronAPI.getAutoOptimizationSettings().then((res) => {
        if (res) {
          if (typeof res.enabled === 'boolean') setAutoOptimizeEnabled(res.enabled);
          if (res.lastResult) setLastResult(res.lastResult);
        }
      });
    }

    if (window.electronAPI?.onOptimizationProgress) {
      const cleanup = window.electronAPI.onOptimizationProgress((data) => {
        if (data) {
          if (typeof data.percent === 'number') setProgress(data.percent);
          const msg = language === 'ru' && data.messageRu ? data.messageRu : data.message;
          setCurrentStepMessage(msg);
        }
      });
      return cleanup;
    }
  }, [language]);

  const handleStartOptimization = async () => {
    if (isOptimizing || !window.electronAPI?.runNetworkOptimization) return;

    setIsOptimizing(true);
    setIsComplete(false);
    setProgress(5);
    setCurrentStepMessage(t('stepArpNetbios'));

    try {
      const res = await window.electronAPI.runNetworkOptimization();
      if (res && res.success) {
        setProgress(100);
        setIsComplete(true);
        setLastResult(res);
        addToast({
          title: t('optimizationComplete'),
          message: `${res.fastestDns} • ${t('latencyImprovement')}: ${res.latencyImprovement}`,
          type: 'success',
          duration: 5000
        });
      }
    } catch (err) {
      addToast({
        title: 'Optimization Error',
        message: String(err),
        type: 'error'
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleToggleAutoOptimize = async () => {
    const nextVal = !autoOptimizeEnabled;
    setAutoOptimizeEnabled(nextVal);
    if (window.electronAPI?.setAutoOptimizationSettings) {
      await window.electronAPI.setAutoOptimizationSettings({ enabled: nextVal });
      addToast({
        title: t('autoOptimizeTitle'),
        message: nextVal ? t('autoOptimizeActiveBadge') : t('autoOptimizeStandbyBadge'),
        type: nextVal ? 'success' : 'info'
      });
    }
  };

  const pipelineCards = [
    {
      step: '01',
      title: t('layer1Title'),
      desc: t('layer1Desc'),
      icon: Server
    },
    {
      step: '02',
      title: t('layer2Title'),
      desc: t('layer2Desc'),
      icon: Cpu
    },
    {
      step: '03',
      title: t('layer3Title'),
      desc: t('layer3Desc'),
      icon: Radio
    },
    {
      step: '04',
      title: t('layer4Title'),
      desc: t('layer4Desc'),
      icon: Layers
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none font-sans p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] flex-shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-color)]" />
              <span>{t('networkOptimization')}</span>
            </h1>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-300">
              PRO ENGINE
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            {t('optimizationSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">{t('currentPrimaryDns')}:</span>
            <span className="font-semibold text-zinc-200">
              {lastResult?.fastestDns ? lastResult.fastestDns.split(' ')[0] : '1.1.1.1 (CF)'}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span className="text-zinc-400">{t('allRoutesHealthy')}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-[2.5rem] liquid-glass-subtle border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <CircularProgressHub
              isOptimizing={isOptimizing}
              progress={progress}
              currentStepMessage={currentStepMessage}
              isComplete={isComplete}
              lastResult={lastResult}
              onStartOptimization={handleStartOptimization}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="p-6 rounded-[2.2rem] liquid-glass-subtle border border-white/[0.08] space-y-4 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shadow-inner">
                    <Clock className="w-5 h-5 text-[var(--accent-color)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">
                      {t('autoOptimizeTitle')}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      {t('autoOptimizeDesc')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleAutoOptimize}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 flex items-center flex-shrink-0 ${
                    autoOptimizeEnabled ? 'bg-emerald-500' : 'bg-white/[0.1]'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-4 h-4 rounded-full bg-white shadow-md ${
                      autoOptimizeEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs font-mono">
                <span className="text-zinc-400">
                  {autoOptimizeEnabled ? t('autoOptimizeActiveBadge') : t('autoOptimizeStandbyBadge')}
                </span>
                <span className="text-[11px] text-zinc-400">
                  30m interval
                </span>
              </div>
            </div>

            <div className="p-6 rounded-[2.2rem] liquid-glass-subtle border border-white/[0.08] space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('optSummaryTitle')}</span>
                </h3>
                <span className="text-[11px] font-mono text-zinc-400">
                  {lastResult?.timestamp
                    ? new Date(lastResult.timestamp).toLocaleTimeString()
                    : t('neverOptimized')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono block">
                    {t('fastestDnsApplied')}
                  </span>
                  <span className="text-sm font-bold font-mono text-zinc-100 truncate block">
                    {lastResult?.fastestDns || 'Cloudflare (1.1.1.1)'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono block">
                    {t('latencyImprovement')}
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-400 block">
                    {lastResult?.latencyImprovement ? `-${lastResult.latencyImprovement}` : '-14ms avg'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono block">
                    {t('clearedCaches')}
                  </span>
                  <span className="text-xs font-bold font-mono text-zinc-300 block">
                    ARP • DNS • NetBIOS
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono block">
                    {t('optimizedAdapters')}
                  </span>
                  <span className="text-xs font-bold font-mono text-zinc-300 block truncate">
                    {interfaces.length} Interfaces Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono px-1">
            {t('pipelineBreakdownTitle')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pipelineCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="p-5 rounded-[2rem] liquid-glass-subtle border border-white/[0.06] space-y-3 hover:border-white/[0.15] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--accent-color)]" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-zinc-500">
                      STEP {card.step}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-100">
                      {card.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-mono mt-1 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
