import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {}
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4500 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, title, message, type, duration };

    setToasts((prev) => {
      const updated = [newToast, ...prev];
      return updated.slice(0, 5);
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  useEffect(() => {
    if (!window.electronAPI) return;

    const cleanups = [];

    if (window.electronAPI.onGatewayPingSpike) {
      cleanups.push(
        window.electronAPI.onGatewayPingSpike((data) => {
          addToast({
            title: 'Gateway Latency Spike',
            message: `Gateway ping reached ${Math.round(data.latency)}ms (Threshold: >250ms). Possible routing congestion.`,
            type: 'warning',
            duration: 6000
          });
        })
      );
    }

    if (window.electronAPI.onPublicIpChanged) {
      cleanups.push(
        window.electronAPI.onPublicIpChanged((data) => {
          addToast({
            title: 'Public Egress IP Rotated',
            message: `New Public IP: ${data.newIp} via ${data.isp || 'Provider'}`,
            type: 'info',
            duration: 5000
          });
        })
      );
    }

    if (window.electronAPI.onAdapterStatusChange) {
      cleanups.push(
        window.electronAPI.onAdapterStatusChange((data) => {
          addToast({
            title: data.isNew ? 'New Network Adapter Detected' : 'Adapter Link Event',
            message: `${data.name} (${data.brand || 'Adapter'}) is now ${data.state.toUpperCase()}`,
            type: data.state === 'up' ? 'success' : 'warning',
            duration: 4500
          });
        })
      );
    }

    if (window.electronAPI.onKillSwitchAlert) {
      cleanups.push(
        window.electronAPI.onKillSwitchAlert((data) => {
          addToast({
            title: 'VPN Kill Switch: LEAK PROTECTION ENGAGED',
            message: `Virtual VPN interface [${data.adapter || 'Tunnel'}] dropped unexpectedly. Physical outbound traffic has been blocked.`,
            type: 'killswitch',
            duration: 9000
          });
        })
      );
    }

    return () => {
      cleanups.forEach((c) => typeof c === 'function' && c());
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
