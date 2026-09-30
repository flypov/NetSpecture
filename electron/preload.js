const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  openExternal: (url) => ipcRenderer.send('open-external', url),

  onInterfaceMetrics: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('interface-metrics', subscription);
    return () => ipcRenderer.removeListener('interface-metrics', subscription);
  },

  fetchIspInfo: (localIp) => ipcRenderer.invoke('fetch-isp-info', localIp),
  runTraceroute: (opts) => ipcRenderer.invoke('run-advanced-traceroute', opts),
  tracerouteTest: (opts) => ipcRenderer.invoke('run-advanced-traceroute', opts),
  benchmarkDns: (opts) => ipcRenderer.invoke('benchmark-dns', opts),
  applyAdapterDns: (interfaceName, primaryDns, secondaryDns) =>
    ipcRenderer.invoke('apply-adapter-dns', { interfaceName, primaryDns, secondaryDns }),
  resetAdapterDns: (interfaceName) =>
    ipcRenderer.invoke('reset-adapter-dns', interfaceName),
  getAdapterDns: (interfaceName) =>
    ipcRenderer.invoke('get-adapter-dns', interfaceName),
  getInterfaceSockets: (ip4) =>
    ipcRenderer.invoke('get-interface-sockets', ip4),
  disableAdapter: (interfaceName) =>
    ipcRenderer.invoke('disable-adapter', interfaceName),
  enableAdapter: (interfaceName) =>
    ipcRenderer.invoke('enable-adapter', interfaceName),
  getAdapterAdminStatus: (interfaceName) =>
    ipcRenderer.invoke('get-adapter-admin-status', interfaceName),
  pingTest: (opts) => ipcRenderer.invoke('ping-test', opts),
  dnsResolveTest: (target) => ipcRenderer.invoke('dns-resolve-test', target),

  
  getKillSwitchStatus: () => ipcRenderer.invoke('get-kill-switch-status'),
  setKillSwitch: (enabled) => ipcRenderer.invoke('set-kill-switch', enabled),
  disengageKillSwitch: () => ipcRenderer.invoke('disengage-kill-switch'),
  onKillSwitchAlert: (callback) => {
    const sub = (_event, val) => callback(val);
    ipcRenderer.on('kill-switch-alert', sub);
    return () => ipcRenderer.removeListener('kill-switch-alert', sub);
  },
  onKillSwitchStatusChanged: (callback) => {
    const sub = (_event, val) => callback(val);
    ipcRenderer.on('kill-switch-status-changed', sub);
    return () => ipcRenderer.removeListener('kill-switch-status-changed', sub);
  },

  
  getTraySettings: () => ipcRenderer.invoke('get-tray-settings'),
  setTraySettings: (settings) => ipcRenderer.invoke('set-tray-settings', settings),
  onNavigateToView: (callback) => {
    const sub = (_event, view) => callback(view);
    ipcRenderer.on('navigate-to-view', sub);
    return () => ipcRenderer.removeListener('navigate-to-view', sub);
  },

  
  runNetworkOptimization: (opts) => ipcRenderer.invoke('run-network-optimization', opts),
  getAutoOptimizationSettings: () => ipcRenderer.invoke('get-auto-optimization-settings'),
  setAutoOptimizationSettings: (settings) => ipcRenderer.invoke('set-auto-optimization-settings', settings),
  onOptimizationProgress: (callback) => {
    const sub = (_event, progress) => callback(progress);
    ipcRenderer.on('optimization-progress', sub);
    return () => ipcRenderer.removeListener('optimization-progress', sub);
  },
  onAutoOptimizationComplete: (callback) => {
    const sub = (_event, res) => callback(res);
    ipcRenderer.on('auto-optimization-complete', sub);
    return () => ipcRenderer.removeListener('auto-optimization-complete', sub);
  },

  
  exportDiagnosticBundle: () => ipcRenderer.invoke('export-diagnostic-bundle'),
  getBandwidthHogs: (interfaceName, ip4) =>
    ipcRenderer.invoke('get-bandwidth-hogs', { interfaceName, ip4 }),

  
  getAutostart: () => ipcRenderer.invoke('get-autostart'),
  setAutostart: (enabled) => ipcRenderer.invoke('set-autostart', enabled),

  
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  setAutoUpdateSettings: (settings) => ipcRenderer.invoke('set-auto-update-settings', settings),
  onUpdateProgress: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('download-progress', subscription);
    return () => ipcRenderer.removeListener('download-progress', subscription);
  },
  onUpdateReady: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('update-downloaded', subscription);
    return () => ipcRenderer.removeListener('update-downloaded', subscription);
  },
  installUpdate: () => ipcRenderer.send('install-update'),

  
  onGatewayPingSpike: (callback) => {
    const sub = (_event, val) => callback(val);
    ipcRenderer.on('gateway-ping-spike', sub);
    return () => ipcRenderer.removeListener('gateway-ping-spike', sub);
  },
  onPublicIpChanged: (callback) => {
    const sub = (_event, val) => callback(val);
    ipcRenderer.on('public-ip-changed', sub);
    return () => ipcRenderer.removeListener('public-ip-changed', sub);
  },
  onAdapterStatusChange: (callback) => {
    const sub = (_event, val) => callback(val);
    ipcRenderer.on('adapter-status-change', sub);
    return () => ipcRenderer.removeListener('adapter-status-change', sub);
  }
});
