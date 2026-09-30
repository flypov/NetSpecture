import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TitleBar } from './components/TitleBar';
import { SlidingSidebar } from './components/SlidingSidebar';
import { MainGrid } from './components/MainGrid';
import { OptimizationView } from './components/OptimizationView';
import { InterfaceDetailsModal } from './components/InterfaceDetailsModal';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/ToastContainer';
import { UpdateNotification } from './components/UpdateNotification';
import { LanguageProvider } from './context/LanguageContext';
import { AccentProvider } from './context/AccentContext';
import { ToastProvider, useToast } from './context/ToastContext';
import ambientMesh from './assets/ambient_mesh.jpg';

function NetSpectreApp() {
  const { addToast } = useToast();
  const [currentView, setCurrentView] = useState('dashboard');
  const [interfaces, setInterfaces] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedInterface, setSelectedInterface] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [killSwitchStatus, setKillSwitchStatus] = useState({ enabled: false, triggered: false });
  const [updateStatus, setUpdateStatus] = useState({
    isAvailable: false,
    progress: 0,
    isReady: false
  });

  useEffect(() => {
    if (window.electronAPI?.onInterfaceMetrics) {
      const cleanup = window.electronAPI.onInterfaceMetrics((metrics) => {
        if (Array.isArray(metrics)) {
          setInterfaces(metrics);
          setSelectedInterface((prev) => {
            if (!prev) return null;
            const updated = metrics.find((m) => m.id === prev.id);
            return updated || prev;
          });
        }
      });
      return cleanup;
    }
  }, []);

  useEffect(() => {
    if (window.electronAPI?.getKillSwitchStatus) {
      window.electronAPI.getKillSwitchStatus().then((res) => {
        if (res) setKillSwitchStatus(res);
      });
    }
    if (window.electronAPI?.onKillSwitchStatusChanged) {
      const cleanup = window.electronAPI.onKillSwitchStatusChanged((status) => {
        if (status) setKillSwitchStatus(status);
      });
      return cleanup;
    }
  }, []);

  const handleToggleKillSwitch = async () => {
    if (!window.electronAPI?.setKillSwitch) return;
    const nextVal = !killSwitchStatus.enabled;
    const res = await window.electronAPI.setKillSwitch(nextVal);
    if (res && typeof res.enabled === 'boolean') {
      setKillSwitchStatus(res);
    }
  };

  const handleDisengageKillSwitch = async () => {
    if (!window.electronAPI?.disengageKillSwitch) return;
    const res = await window.electronAPI.disengageKillSwitch();
    if (res) setKillSwitchStatus(res);
  };

  useEffect(() => {
    if (window.electronAPI) {
      let cleanupProgress = () => {};
      let cleanupReady = () => {};
      let cleanupNavigate = () => {};
      let cleanupAutoOpt = () => {};

      if (window.electronAPI.onUpdateProgress) {
        cleanupProgress = window.electronAPI.onUpdateProgress((pct) => {
          setUpdateStatus((prev) => ({
            ...prev,
            isAvailable: true,
            progress: pct
          }));
        });
      }

      if (window.electronAPI.onUpdateReady) {
        cleanupReady = window.electronAPI.onUpdateReady(() => {
          setUpdateStatus((prev) => ({
            ...prev,
            isAvailable: true,
            isReady: true,
            progress: 100
          }));
        });
      }

      if (window.electronAPI.onNavigateToView) {
        cleanupNavigate = window.electronAPI.onNavigateToView((view) => {
          if (view) setCurrentView(view);
        });
      }

      if (window.electronAPI.onAutoOptimizationComplete) {
        cleanupAutoOpt = window.electronAPI.onAutoOptimizationComplete((res) => {
          if (res) {
            addToast({
              title: 'Auto-Optimization Complete',
              message: res.message || 'Background network optimization completed.',
              type: 'success',
              duration: 5000
            });
          }
        });
      }

      return () => {
        cleanupProgress();
        cleanupReady();
        cleanupNavigate();
        cleanupAutoOpt();
      };
    }
  }, []);

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-[#09090b] text-[#fafafa] select-none font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-screen scale-105"
        style={{ backgroundImage: `url(${ambientMesh})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent pointer-events-none" />

      <TitleBar
        onOpenSettings={() => setIsSettingsOpen(true)}
        killSwitchStatus={killSwitchStatus}
        onToggleKillSwitch={handleToggleKillSwitch}
      />

      <div className="relative z-10 flex flex-1 overflow-hidden p-3 gap-3">
        <SlidingSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          interfaces={interfaces}
          onOpenSettings={() => setIsSettingsOpen(true)}
          currentView={currentView}
          onSelectView={setCurrentView}
        />

        <main className="flex-1 flex flex-col h-full overflow-hidden relative rounded-[2.5rem] liquid-glass-panel border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {currentView === 'dashboard' ? (
            <MainGrid
              interfaces={interfaces}
              activeFilter={activeFilter}
              onSelectInterface={(iface) => setSelectedInterface(iface)}
            />
          ) : (
            <OptimizationView interfaces={interfaces} />
          )}
        </main>
      </div>

      <AnimatePresence>
        {selectedInterface && (
          <InterfaceDetailsModal
            iface={selectedInterface}
            onClose={() => setSelectedInterface(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            killSwitchStatus={killSwitchStatus}
            onToggleKillSwitch={handleToggleKillSwitch}
            onDisengageKillSwitch={handleDisengageKillSwitch}
          />
        )}
      </AnimatePresence>

      <ToastContainer />
      <UpdateNotification updateStatus={updateStatus} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AccentProvider>
        <ToastProvider>
          <NetSpectreApp />
        </ToastProvider>
      </AccentProvider>
    </LanguageProvider>
  );
}
