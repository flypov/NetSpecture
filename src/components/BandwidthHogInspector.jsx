import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  Layers,
  Activity
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const BandwidthHogInspector = React.memo(({ iface }) => {
  const { t } = useLanguage();
  const [hogs, setHogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHogs = useCallback(async () => {
    if (!window.electronAPI?.getBandwidthHogs) return;
    try {
      const data = await window.electronAPI.getBandwidthHogs(iface.name, iface.ip4);
      if (Array.isArray(data)) {
        setHogs(data.slice(0, 5));
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [iface.name, iface.ip4]);

  useEffect(() => {
    setIsLoading(true);
    fetchHogs();
    const interval = setInterval(fetchHogs, 2500);
    return () => clearInterval(interval);
  }, [fetchHogs]);

  const formatRate = (bytes) => {
    if (!bytes || bytes <= 0) return '0 B/s';
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB/s`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB/s`;
    return `${Math.round(bytes)} B/s`;
  };

  const totalIfaceRate = (iface.rx_sec || 0) + (iface.tx_sec || 0);

  return (
    <div className="p-5 rounded-[2rem] liquid-glass-subtle border border-white/[0.08] space-y-4 font-sans select-none shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              <span>{t('bandwidthHogsTitle')}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono">
                TOP 3
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-mono">
              {t('bandwidthHogsSubtitle')} &bull; Total: {formatRate(totalIfaceRate)}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsLoading(true);
            fetchHogs();
          }}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-300 hover:text-white transition-all text-xs flex items-center gap-1.5 font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? t('scanning') : t('refreshBtn')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {hogs.length > 0 ? (
          hogs.slice(0, 3).map((proc, index) => {
            const rank = index + 1;
            const rankColors = [
              'border-amber-500/40 bg-amber-500/10 text-amber-300',
              'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
              'border-purple-500/40 bg-purple-500/10 text-purple-300'
            ];

            const barGradients = [
              'bg-gradient-to-r from-amber-500 to-orange-400',
              'bg-gradient-to-r from-cyan-500 to-blue-400',
              'bg-gradient-to-r from-purple-500 to-pink-400'
            ];

            const percent = Math.min(100, Math.max(proc.percent || 0, proc.total_sec > 0 ? 5 : 2));

            return (
              <motion.div
                key={proc.pid || `${proc.name}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg border text-[11px] font-mono font-bold flex items-center justify-center flex-shrink-0 ${
                        rankColors[index] || 'border-zinc-700 bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      #{rank}
                    </span>

                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {proc.iconDataUrl ? (
                        <img src={proc.iconDataUrl} alt={proc.name} className="w-5 h-5 object-contain" />
                      ) : (
                        <Layers className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-100 font-mono truncate">
                          {proc.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400">
                          PID {proc.pid || '-'}
                        </span>
                        {proc.connectionsCount > 0 && (
                          <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                            &bull; {proc.connectionsCount} {t('socketsCount')}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono truncate max-w-sm mt-0.5">
                        {proc.path || 'System Kernel / Background Thread'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-xs font-bold font-mono text-zinc-100">
                      {formatRate(proc.total_sec)}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-zinc-400">
                      <span className="flex items-center gap-0.5 text-emerald-400">
                        <ArrowDown className="w-2.5 h-2.5" />
                        {formatRate(proc.rx_sec)}
                      </span>
                      <span className="flex items-center gap-0.5 text-cyan-400">
                        <ArrowUp className="w-2.5 h-2.5" />
                        {formatRate(proc.tx_sec)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span>{t('bandwidthAllocation')}</span>
                    <span className="text-zinc-200 font-semibold">{proc.percent || 0}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ ease: 'easeOut', duration: 0.5 }}
                      className={`h-full rounded-full ${barGradients[index] || 'bg-white'}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-8 text-center rounded-2xl bg-white/[0.01] border border-white/[0.04]">
            <Activity className="w-6 h-6 text-zinc-500 mx-auto mb-2 animate-pulse" />
            <p className="text-xs text-zinc-400 font-mono">
              {t('noBandwidthHogs')}
            </p>
            <p className="text-[11px] text-zinc-600 font-mono mt-1">
              {t('bandwidthIdleDesc')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
