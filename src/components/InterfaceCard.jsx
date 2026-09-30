import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Globe, Shield, Cpu, Layers, Ban } from 'lucide-react';
import { InterfaceIcon } from '../utils/iconLoader';
import { useLanguage } from '../context/LanguageContext';

export const InterfaceCard = React.memo(({ iface, onSelect }) => {
  const { t } = useLanguage();
  const isUp = iface.operstate === 'up';
  const isDisabled = iface.adminState === 'Disabled';

  const formatRate = (rate) => {
    if (rate >= 1048576) return `${(rate / 1048576).toFixed(1)} MB/s`;
    if (rate >= 1024) return `${(rate / 1024).toFixed(1)} KB/s`;
    return `${Math.round(rate || 0)} B/s`;
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.008 }}
      whileTap={{ scale: 0.992 }}
      onClick={() => onSelect(iface)}
      className="cursor-pointer group relative p-5 rounded-[2.2rem] liquid-glass-card hover:border-white/20 transition-all flex flex-col justify-between overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-bl-full pointer-events-none group-hover:bg-white/[0.04] transition-colors" />

      <div>
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center p-2 group-hover:scale-105 transition-transform shadow-inner flex-shrink-0">
              <InterfaceIcon iface={iface} className="w-8 h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-semibold text-zinc-100 text-sm tracking-wide group-hover:text-white transition-colors truncate">
                  {iface.name}
                </h3>
                {iface.isDefault && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                    {t('default')}
                  </span>
                )}
                {isDisabled && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono flex items-center gap-1">
                    <Ban className="w-2.5 h-2.5" />
                    {t('statusDisabledShort')}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-mono truncate max-w-full mt-0.5">
                {iface.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] flex-shrink-0">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isUp
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'
              }`}
            />
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider font-mono ${
                isUp ? 'text-emerald-300' : 'text-red-300'
              }`}
            >
              {isUp ? t('online') : t('offline')}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl liquid-glass-subtle space-y-2 mb-4 border border-white/[0.05]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t('ipv4Address')}</span>
            </span>
            <span className="font-mono font-medium text-zinc-200">
              {iface.ip4 || 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/[0.05]">
            <span className="text-zinc-400 flex items-center gap-1.5">
              {iface.virtual ? (
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{t('type')}</span>
            </span>
            <span className="font-mono text-[11px] text-zinc-300">
              {iface.virtual ? t('virtualOverlay') : t('physicalController')}
            </span>
          </div>

          {iface.boundProcess && (
            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/[0.05]">
              <span className="text-zinc-400 flex items-center gap-1.5 truncate">
                <Layers className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{t('daemonPid')}</span>
              </span>
              <span className="font-mono text-[11px] text-cyan-300 truncate max-w-[120px]">
                {iface.boundProcess.name} ({iface.boundProcess.pid || 'Active'})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span className="font-mono font-semibold">{formatRate(iface.rx_sec)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sky-400">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span className="font-mono font-semibold">{formatRate(iface.tx_sec)}</span>
        </div>
      </div>
    </motion.div>
  );
});
