import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Settings,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Palette,
  Power,
  FileArchive,
  RefreshCw,
  ExternalLink,
  Download,
  CheckCircle2,
  Sparkles,
  Laptop,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAccent } from '../context/AccentContext';
import { useToast } from '../context/ToastContext';
import { GithubIcon } from '../icons/CustomIcons';
import logo from '../assets/logo.png';

export const SettingsModal = React.memo(({
  isOpen,
  onClose,
  killSwitchStatus = { enabled: false, triggered: false },
  onToggleKillSwitch,
  onDisengageKillSwitch
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentTheme, setAccentTheme, themes } = useAccent();
  const { addToast } = useToast();

  const [activeSection, setActiveSection] = useState('general');
  const [autostartEnabled, setAutostartEnabled] = useState(false);
  const [runInBackground, setRunInBackground] = useState(true);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [isExportingBundle, setIsExportingBundle] = useState(false);

  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateCheckResult, setUpdateCheckResult] = useState(null);

  useEffect(() => {
    if (window.electronAPI?.getAutostart) {
      window.electronAPI.getAutostart().then((res) => {
        if (res && typeof res.openAtLogin === 'boolean') {
          setAutostartEnabled(res.openAtLogin);
        }
      });
    }

    if (window.electronAPI?.getTraySettings) {
      window.electronAPI.getTraySettings().then((res) => {
        if (res && typeof res.minimizeToTrayOnClose === 'boolean') {
          setRunInBackground(res.minimizeToTrayOnClose);
        }
      });
    }

    try {
      const savedAutoUpdate = localStorage.getItem('netspecture_auto_update');
      if (savedAutoUpdate !== null) {
        setAutoUpdateEnabled(savedAutoUpdate === 'true');
      }
    } catch {}
  }, []);

  const handleToggleRunInBackground = async () => {
    const nextVal = !runInBackground;
    setRunInBackground(nextVal);
    if (window.electronAPI?.setTraySettings) {
      await window.electronAPI.setTraySettings({ enabled: nextVal });
    }
  };

  const handleToggleAutostart = async () => {
    const nextVal = !autostartEnabled;
    setAutostartEnabled(nextVal);
    if (window.electronAPI?.setAutostart) {
      await window.electronAPI.setAutostart(nextVal);
    }
  };

  const handleToggleAutoUpdate = (val) => {
    setAutoUpdateEnabled(val);
    try {
      localStorage.setItem('netspecture_auto_update', String(val));
    } catch {}
    if (window.electronAPI?.setAutoUpdateSettings) {
      window.electronAPI.setAutoUpdateSettings({ enabled: val });
    }
  };

  const handleExportBundle = async () => {
    if (!window.electronAPI?.exportDiagnosticBundle) return;
    setIsExportingBundle(true);
    try {
      const res = await window.electronAPI.exportDiagnosticBundle();
      if (res.success) {
        addToast({
          title: t('exportBundleTitle'),
          message: `${res.filePath}`,
          type: 'success',
          duration: 6000
        });
      } else if (!res.cancelled) {
        addToast({
          title: 'Export Failed',
          message: res.error || 'Failed to generate diagnostic bundle archive.',
          type: 'error'
        });
      }
    } catch (err) {
      addToast({
        title: 'Export Error',
        message: String(err),
        type: 'error'
      });
    } finally {
      setIsExportingBundle(false);
    }
  };

  const handleCheckForUpdates = async () => {
    if (!window.electronAPI?.checkForUpdates) return;
    setIsCheckingUpdate(true);
    setUpdateCheckResult(null);
    try {
      const res = await window.electronAPI.checkForUpdates();
      if (res.success && res.updateInfo?.version) {
        setUpdateCheckResult({
          type: 'success',
          message: `${t('updateAvailable')}: v${res.updateInfo.version}`
        });
      } else {
        setUpdateCheckResult({
          type: 'info',
          message: t('upToDate')
        });
      }
    } catch (err) {
      setUpdateCheckResult({
        type: 'info',
        message: t('upToDate')
      });
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const openUrl = (url) => {
    if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  if (!isOpen) return null;

  const sections = [
    { id: 'general', label: t('settingsGeneral'), icon: Settings },
    { id: 'security', label: t('settingsSecurity'), icon: ShieldCheck },
    { id: 'diagnostics', label: t('settingsDiagnostics'), icon: FileArchive },
    { id: 'about', label: t('settingsAbout'), icon: Sparkles }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md select-none font-sans"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-full max-w-4xl h-[640px] rounded-[2.5rem] liquid-glass-panel border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden relative"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shadow-inner">
              <img src={logo} alt="Logo" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                <span>{t('settingsTitle')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 font-mono">
                  v2.1.0
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {t('settingsSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-60 border-r border-white/[0.08] p-4 space-y-1.5 bg-white/[0.01]">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-white/[0.1] text-zinc-100 border border-white/[0.15] shadow-lg'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-[var(--accent-color)]' : 'text-zinc-400'
                    }`}
                  />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-1">
                    {t('generalPreferences')}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {t('generalPrefSubtitle')}
                  </p>
                </div>

                <div className="p-5 rounded-2xl liquid-glass-subtle border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                      <Globe className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100">
                        {t('language')}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {t('langSubtitle')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.06] border border-white/[0.08]">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        language === 'en'
                          ? 'bg-white text-zinc-950 shadow-md'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('ru')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        language === 'ru'
                          ? 'bg-white text-zinc-950 shadow-md'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      RU
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl liquid-glass-subtle border border-white/[0.06] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                      <Palette className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100">
                        {t('accentColor')}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {t('accentSubtitle')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {themes.map((theme) => {
                      const isSelected = currentTheme.id === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => setAccentTheme(theme.id)}
                          className={`p-3 rounded-2xl border transition-all flex items-center gap-3 relative ${
                            isSelected
                              ? 'bg-white/[0.08] border-white/[0.3] shadow-lg'
                              : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15]'
                          }`}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex-shrink-0 shadow-lg"
                            style={{
                              backgroundColor: theme.hex,
                              boxShadow: `0 0 12px ${theme.glow}`
                            }}
                          />
                          <span className="text-xs font-medium text-zinc-200 font-mono truncate">
                            {theme.name}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-zinc-100 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 rounded-2xl liquid-glass-subtle border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                      <Laptop className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100">
                        {t('startWithWindows')}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {t('autostartSubtitle')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleAutostart}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 flex items-center ${
                      autostartEnabled ? 'bg-emerald-500' : 'bg-white/[0.1]'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-4 h-4 rounded-full bg-white shadow-md ${
                        autostartEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-5 rounded-2xl liquid-glass-subtle border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                      <Power className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100">
                        {t('runInBackgroundOnClose')}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5 max-w-sm">
                        {t('runInBackgroundDesc')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleRunInBackground}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 flex items-center flex-shrink-0 ${
                      runInBackground ? 'bg-emerald-500' : 'bg-white/[0.1]'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-4 h-4 rounded-full bg-white shadow-md ${
                        runInBackground ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-1">
                    {t('securityAndSafety')}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {t('securitySubtitle')}
                  </p>
                </div>

                <div
                  className={`p-6 rounded-[2rem] border transition-all space-y-4 ${
                    killSwitchStatus.triggered
                      ? 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.25)]'
                      : killSwitchStatus.enabled
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : 'liquid-glass-subtle border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
                          killSwitchStatus.triggered
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                            : killSwitchStatus.enabled
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-white/[0.05] border-white/[0.08] text-zinc-400'
                        }`}
                      >
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-zinc-100">
                            {t('vpnKillSwitch')}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                              killSwitchStatus.triggered
                                ? 'bg-rose-500/30 text-rose-200 border border-rose-500/40'
                                : killSwitchStatus.enabled
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-white/[0.08] text-zinc-400 border border-white/[0.1]'
                            }`}
                          >
                            {killSwitchStatus.triggered
                              ? t('killSwitchBlocked')
                              : killSwitchStatus.enabled
                              ? t('killSwitchArmed')
                              : t('killSwitchStandbyStatus')}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono mt-1 max-w-lg">
                          {t('vpnKillSwitchDesc')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={onToggleKillSwitch}
                      className={`w-14 h-7 rounded-full transition-colors relative p-1 flex items-center flex-shrink-0 ${
                        killSwitchStatus.enabled ? 'bg-emerald-500' : 'bg-white/[0.1]'
                      }`}
                    >
                      <motion.div
                        layout
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`w-5 h-5 rounded-full bg-white shadow-md ${
                          killSwitchStatus.enabled ? 'translate-x-7' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {killSwitchStatus.triggered && (
                    <div className="pt-2 border-t border-rose-500/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-rose-300 text-xs font-mono">
                        <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse flex-shrink-0" />
                        <span>{t('trafficHaltedWarning')}</span>
                      </div>
                      <button
                        onClick={onDisengageKillSwitch}
                        className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs font-mono transition-colors shadow-lg flex items-center gap-2"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{t('disengageRestoreBtn')}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-2xl liquid-glass-subtle border border-white/[0.06] space-y-3">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    {t('howKillSwitchWorks')}
                  </h4>
                  <ul className="text-xs text-zinc-400 space-y-2 font-mono list-disc pl-5">
                    <li>Watches active virtual adapters (WireGuard, OpenVPN, Tailscale, ZeroTier, Amnezia, Radmin, Happ Proxy).</li>
                    <li>If the virtual tunnel drops its link while Armed, Windows Defender Firewall automatically drops all outbound packets on physical adapters.</li>
                    <li>Rules are temporary and automatically cleaned up on manual disengage or application termination.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'diagnostics' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-1">
                    {t('networkDiagnosticsTitle')}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {t('diagnosticsSubtitle')}
                  </p>
                </div>

                <div className="p-6 rounded-[2rem] liquid-glass-subtle border border-white/[0.08] space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-zinc-300">
                        <FileArchive className="w-5 h-5 text-[var(--accent-color)]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100">
                          {t('exportBundleTitle')}
                        </h4>
                        <p className="text-xs text-zinc-400 font-mono mt-1 max-w-lg">
                          {t('exportBundleDesc')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleExportBundle}
                      disabled={isExportingBundle}
                      className="px-4 py-2.5 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 flex-shrink-0"
                    >
                      <Download className={`w-3.5 h-3.5 ${isExportingBundle ? 'animate-bounce' : ''}`} />
                      <span>{isExportingBundle ? t('exportingBundle') : t('exportBundleBtn')}</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl liquid-glass-subtle border border-white/[0.06] space-y-3">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    {t('archiveContents')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-zinc-400">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-zinc-200 font-bold block mb-0.5">&bull; DIAGNOSTIC_REPORT.md</span>
                      High-level markdown summary for technical support.
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-zinc-200 font-bold block mb-0.5">&bull; routes.txt & sockets.json</span>
                      Full IPv4/IPv6 routing table and socket sessions.
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-zinc-200 font-bold block mb-0.5">&bull; network_interfaces.json</span>
                      Controller states, MAC, MTU, and driver types.
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-zinc-200 font-bold block mb-0.5">&bull; system_info.json</span>
                      OS kernel version, CPU, and RAM allocation.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-1">
                    {t('aboutAndUpdates')}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {t('aboutSubtitle')}
                  </p>
                </div>

                <div className="p-6 rounded-[2rem] liquid-glass-subtle border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center p-2.5 shadow-inner flex-shrink-0">
                      <img src={logo} alt="NetSpecture" className="w-9 h-9 object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-zinc-100">NetSpecture</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/[0.08] text-[var(--accent-color)] border border-white/[0.1]">
                          v2.1.0 Enterprise Liquid Edition
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono mt-1">
                        {t('appTagline')}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-zinc-300 font-mono">Creator:</span>
                        <button
                          onClick={() => openUrl('https://github.com/flypov')}
                          className="text-xs font-mono font-bold text-[var(--accent-color)] hover:underline flex items-center gap-1"
                        >
                          <GithubIcon className="w-3.5 h-3.5 inline" />
                          <span>Flypov</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openUrl('https://github.com/flypov/netspecture')}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-zinc-200 text-xs font-mono flex items-center gap-2 transition-all flex-shrink-0"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub Repo</span>
                  </button>
                </div>

                <div className="p-6 rounded-[2rem] liquid-glass-subtle border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-zinc-300" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100">
                          {t('githubUpdateEngine')}
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          {t('githubUpdateDesc')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckForUpdates}
                      disabled={isCheckingUpdate}
                      className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.12] text-zinc-100 text-xs font-mono font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                      <span>{isCheckingUpdate ? t('checkingUpdates') : t('checkForUpdatesBtn')}</span>
                    </button>
                  </div>

                  {updateCheckResult && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-zinc-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{updateCheckResult.message}</span>
                    </motion.div>
                  )}

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-zinc-300 font-semibold block">
                        {t('periodicUpdates')}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {t('periodicUpdatesDesc')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleAutoUpdate(!autoUpdateEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors relative p-1 flex items-center ${
                        autoUpdateEnabled ? 'bg-emerald-500' : 'bg-white/[0.1]'
                      }`}
                    >
                      <motion.div
                        layout
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`w-4 h-4 rounded-full bg-white shadow-md ${
                          autoUpdateEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
