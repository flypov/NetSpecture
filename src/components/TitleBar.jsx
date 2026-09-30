import React from 'react';
import { Minus, Square, X, Languages, Settings, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';

export const TitleBar = React.memo(({ onOpenSettings, killSwitchStatus = { enabled: false, triggered: false }, onToggleKillSwitch }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleMinimize = () => {
    if (window.electronAPI?.minimize) window.electronAPI.minimize();
  };

  const handleMaximize = () => {
    if (window.electronAPI?.maximize) window.electronAPI.maximize();
  };

  const handleClose = () => {
    if (window.electronAPI?.close) window.electronAPI.close();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <header className="h-12 w-full flex items-center justify-between px-5 select-none app-drag z-40 flex-shrink-0 bg-transparent">
      <div className="flex items-center gap-2.5 app-no-drag">
        <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-white/5 shadow-inner">
          <img src={logo} alt="Logo" className="w-4 h-4 object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-zinc-100 font-sans">
            {t('appName')}
          </span>
          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/[0.08] font-mono">
            {t('enterpriseEdition')}
          </span>
        </div>
      </div>

      <div className="flex-1 h-full app-drag" />

      <div className="flex items-center gap-2.5 app-no-drag">
        <button
          onClick={onToggleKillSwitch}
          className={`flex items-center gap-2 px-3 py-1 rounded-xl border transition-all text-xs font-mono shadow-sm ${
            killSwitchStatus?.triggered
              ? 'bg-rose-950/50 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
              : killSwitchStatus?.enabled
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-400 hover:text-zinc-200'
          }`}
          title={t('vpnKillSwitchDesc')}
        >
          {killSwitchStatus?.triggered ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          ) : killSwitchStatus?.enabled ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span className="hidden sm:inline font-semibold">Kill Switch:</span>
          <span
            className={`font-bold text-[10px] uppercase ${
              killSwitchStatus?.triggered
                ? 'text-rose-300'
                : killSwitchStatus?.enabled
                ? 'text-emerald-400'
                : 'text-zinc-500'
            }`}
          >
            {killSwitchStatus?.triggered ? 'BLOCKED' : killSwitchStatus?.enabled ? 'ACTIVE' : 'STANDBY'}
          </span>
        </button>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-300 hover:text-white transition-all text-xs font-mono"
          title={t('languageSwitch')}
        >
          <Languages className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-bold text-[11px]">{language.toUpperCase()}</span>
        </button>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-300 hover:text-white transition-all text-xs font-mono"
            title={t('settings')}
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400 hover:text-[var(--accent-color)] transition-colors" />
            <span className="hidden sm:inline text-[11px] font-medium">{t('settings')}</span>
          </button>
        )}

        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={handleMinimize}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/80 hover:text-white text-zinc-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
});
