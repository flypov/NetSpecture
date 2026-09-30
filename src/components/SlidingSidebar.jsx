import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  ShieldCheck,
  Cpu,
  Activity,
  ChevronLeft,
  ChevronRight,
  ActivitySquare,
  Shield,
  Settings,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';
import { GithubIcon } from '../icons/CustomIcons';

export const SlidingSidebar = React.memo(
  ({
    isOpen,
    setIsOpen,
    activeFilter,
    setActiveFilter,
    interfaces = [],
    onOpenSettings,
    currentView = 'dashboard',
    onSelectView
  }) => {
    const { t } = useLanguage();

    const totalCount = interfaces.length;
    const virtualCount = interfaces.filter((i) => i.virtual).length;
    const activeCount = interfaces.filter((i) => i.operstate === 'up').length;
    const totalRx = interfaces.reduce((acc, curr) => acc + (curr.rx_sec || 0), 0);
    const totalTx = interfaces.reduce((acc, curr) => acc + (curr.tx_sec || 0), 0);

    const formatSpeed = (bytes) => {
      if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB/s`;
      if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB/s`;
      return `${Math.round(bytes)} B/s`;
    };

    const navItems = [
      { id: 'all', label: t('allControllers'), icon: Layers, badge: totalCount },
      { id: 'vpn', label: t('virtualVpn'), icon: ShieldCheck, badge: virtualCount },
      { id: 'physical', label: t('physicalAdapters'), icon: Cpu, badge: totalCount - virtualCount },
      { id: 'active', label: t('activeLinkUp'), icon: Activity, badge: activeCount }
    ];

    const openCreatorUrl = () => {
      if (window.electronAPI?.openExternal) {
        window.electronAPI.openExternal('https://github.com/flypov');
      } else {
        window.open('https://github.com/flypov', '_blank');
      }
    };

    return (
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 250 : 72, transition: { type: 'spring', stiffness: 320, damping: 32 } }}
        className="relative z-30 flex flex-col h-full rounded-[2.2rem] liquid-glass-panel select-none overflow-hidden font-sans border border-white/[0.08]"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center flex-shrink-0 shadow-inner">
              <img src={logo} alt="Logo" className="w-5 h-5 object-contain" />
            </div>
            {isOpen && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col whitespace-nowrap">
                <span className="font-semibold text-zinc-100 text-sm tracking-wide">{t('appName')}</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">{t('workspace')}</span>
              </motion.div>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-xl hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 py-3 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === 'dashboard' && activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView?.('dashboard');
                  setActiveFilter(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all relative ${
                  isActive
                    ? 'bg-white/[0.1] border border-white/[0.15] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                    : 'hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[var(--accent-color)]' : 'text-zinc-400'}`} />
                {isOpen && (
                  <div className="flex items-center justify-between w-full overflow-hidden">
                    <span className="text-xs font-medium whitespace-nowrap truncate">{item.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isActive ? 'bg-white/20 text-zinc-100' : 'bg-white/[0.05] text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}

          <button
            onClick={() => onSelectView?.('optimization')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all relative ${
              currentView === 'optimization'
                ? 'bg-white/[0.1] border border-white/[0.15] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                : 'hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <Sparkles
              className={`w-4 h-4 flex-shrink-0 ${
                currentView === 'optimization' ? 'text-[var(--accent-color)] animate-pulse' : 'text-zinc-400'
              }`}
            />
            {isOpen && (
              <div className="flex items-center justify-between w-full overflow-hidden">
                <span className="text-xs font-medium whitespace-nowrap truncate">
                  {t('networkOptimization')}
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    currentView === 'optimization'
                      ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30'
                      : 'bg-white/[0.05] text-zinc-400'
                  }`}
                >
                  PRO
                </span>
              </div>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all border border-transparent hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-100"
          >
            <Settings className="w-4 h-4 flex-shrink-0 text-zinc-400 hover:text-[var(--accent-color)]" />
            {isOpen && (
              <span className="text-xs font-semibold whitespace-nowrap truncate">
                {t('settings')}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="pt-5 space-y-2.5 px-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 px-2">
                <ActivitySquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t('aggregateTelemetry')}</span>
              </div>
              <div className="p-3.5 rounded-2xl liquid-glass-subtle space-y-2 border border-white/[0.05]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">{t('totalRxSpeed')}</span>
                  <span className="font-mono text-zinc-200 font-semibold">{formatSpeed(totalRx)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">{t('totalTxSpeed')}</span>
                  <span className="font-mono text-zinc-200 font-semibold">{formatSpeed(totalTx)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">{t('onlineAdapters')}</span>
                  <span className="font-mono text-emerald-400 font-medium">
                    {totalCount > 0 ? `${Math.round((activeCount / totalCount) * 100)}%` : '0%'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3.5 border-t border-white/[0.08] bg-white/[0.01]">
          {isOpen ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{t('coreEngine')}</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-300 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
                  v2.1.0 Liquid
                </span>
              </div>

              <button
                onClick={openCreatorUrl}
                className="flex items-center justify-between w-full p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-zinc-400 hover:text-zinc-100 transition-all text-[11px] font-mono"
              >
                <div className="flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Creator: <strong className="text-[var(--accent-color)]">Flypov</strong></span>
                </div>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>
      </motion.aside>
    );
  }
);
