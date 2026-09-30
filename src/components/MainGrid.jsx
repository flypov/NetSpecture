import React, { useState, useDeferredValue } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ShieldAlert } from 'lucide-react';
import { InterfaceCard } from './InterfaceCard';
import { useLanguage } from '../context/LanguageContext';

export const MainGrid = React.memo(
  ({ interfaces = [], onSelectInterface, activeFilter = 'all' }) => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('name');
    const deferredSearch = useDeferredValue(searchQuery);

    const filtered = interfaces.filter((iface) => {
      if (activeFilter === 'vpn' && !iface.virtual) return false;
      if (activeFilter === 'physical' && iface.virtual) return false;
      if (activeFilter === 'active' && iface.operstate !== 'up') return false;

      if (!deferredSearch.trim()) return true;
      const query = deferredSearch.toLowerCase();
      return (
        (iface.name && iface.name.toLowerCase().includes(query)) ||
        (iface.description && iface.description.toLowerCase().includes(query)) ||
        (iface.brand && iface.brand.toLowerCase().includes(query)) ||
        (iface.ip4 && iface.ip4.includes(query)) ||
        (iface.targetNodeIp && iface.targetNodeIp.includes(query))
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'rx') return (b.rx_sec || 0) - (a.rx_sec || 0);
      if (sortOption === 'tx') return (b.tx_sec || 0) - (a.tx_sec || 0);
      if (sortOption === 'status')
        return (b.operstate === 'up' ? 1 : 0) - (a.operstate === 'up' ? 1 : 0);
      return (a.name || '').localeCompare(b.name || '');
    });

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.04 } }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } }
    };

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden p-6 font-sans">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 flex-shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">
                {t('networkInfrastructure')}
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-300 font-mono uppercase tracking-wider">
                {sorted.length} {t('activeAdapters')}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="pl-9 pr-4 py-2 w-full md:w-64 rounded-2xl liquid-glass-subtle text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-all border border-white/[0.06]"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl liquid-glass-subtle text-xs border border-white/[0.06] flex-shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="name" className="bg-[#18181b] text-zinc-200">
                  {t('sortName')}
                </option>
                <option value="status" className="bg-[#18181b] text-zinc-200">
                  {t('sortStatus')}
                </option>
                <option value="rx" className="bg-[#18181b] text-zinc-200">
                  {t('sortRx')}
                </option>
                <option value="tx" className="bg-[#18181b] text-zinc-200">
                  {t('sortTx')}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {sorted.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-6"
            >
              {sorted.map((iface) => (
                <motion.div key={iface.id} variants={itemVariants}>
                  <InterfaceCard iface={iface} onSelect={onSelectInterface} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center rounded-[2.5rem] liquid-glass-subtle text-center p-6 border border-white/[0.06]">
              <ShieldAlert className="w-10 h-10 text-zinc-500 mb-3" />
              <h3 className="text-sm font-semibold text-zinc-200">{t('noInterfaces')}</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">{t('noInterfacesDesc')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);
