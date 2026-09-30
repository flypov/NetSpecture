# NetSpecture

Advanced enterprise-grade network interface, VPN tunnel manager, and real-time telemetry suite for Windows, built with modern desktop technologies.

## Core Features

- **Smart Interface & Tunnel Management:** Real-time monitoring and classification of physical adapters and virtual VPN overlays (Happ Proxy, AmneziaVPN, Radmin VPN, Tailscale, ZeroTier, WireGuard).
- **Deep Process Intelligence:** Inspect running daemon paths (`happd.exe`, `amnezia-service.exe`), PIDs, memory footprint, and CPU load.
- **Advanced Network Optimization Engine:** One-click DNS optimizer with automated interface-specific latency benchmarking, Windows networking stack flush (`/flushdns`, `winsock reset`), and smart route optimization.
- **Active Sockets & Connections:** Deep inspection of TCP/UDP endpoints bound to specific network interfaces.
- **Integrated Diagnostics Suite:** Custom UTF-8 encoded traceroute path visualizer and multi-node DNS benchmarks.
- **VPN Kill Switch:** Built-in safety switch to prevent IP leaks if tunnels drop unexpectedly.
- **System Tray Background Mode:** Option to run silently in the background and close to the system tray.
- **GitHub Auto-Updater:** Seamless self-updating mechanism powered by `electron-updater`.
- **Bilingual Interface:** Instant switching between English and Russian localization.
- **High Performance & Low RAM:** Aggressive V8 memory tuning and optimized React rendering.

## Tech Stack

- **Desktop Framework:** Electron, Node.js
- **Frontend UI:** React, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons
- **System Telemetry:** `systeminformation`, `node-netstat`, `ping`

## Installation & Build

Clone the repository and install dependencies:

```bash
git clone https://github.com/flypov/netspecture.git
cd netspecture
npm install
```

### Run in Development Mode:

```bash
npm run dev
```

### Build Portable Executable / Installer:

```bash
npm run build
```

*(The compiled binaries will be generated in the `dist_electron` directory).*

## Creator

- **Developer:** [Flypov](https://github.com/flypov)