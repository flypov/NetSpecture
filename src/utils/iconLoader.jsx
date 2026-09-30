import React from 'react';
import amneziaSvg from '../assets/icons/amnezia.svg';
import radminSvg from '../assets/icons/radmin.svg';
import tailscaleSvg from '../assets/icons/tailscale.svg';
import zerotierSvg from '../assets/icons/zerotier.svg';
import wireguardSvg from '../assets/icons/wireguard.svg';
import openvpnSvg from '../assets/icons/openvpn.svg';
import ethernetSvg from '../assets/icons/ethernet.svg';
import wifiSvg from '../assets/icons/wifi.svg';
import tunnelSvg from '../assets/icons/tunnel.svg';


import cloudflareSvg from '../assets/icons/cloudflare.svg';
import googleSvg from '../assets/icons/google.svg';
import quad9Svg from '../assets/icons/quad9.svg';
import adguardSvg from '../assets/icons/adguard.svg';
import opendnsSvg from '../assets/icons/opendns.svg';

const brandIconMap = {
  amnezia: amneziaSvg,
  radmin: radminSvg,
  tailscale: tailscaleSvg,
  zerotier: zerotierSvg,
  wireguard: wireguardSvg,
  openvpn: openvpnSvg,
  ethernet: ethernetSvg,
  wifi: wifiSvg,
  vpn: tunnelSvg,
  cloudflare: cloudflareSvg,
  google: googleSvg,
  quad9: quad9Svg,
  adguard: adguardSvg,
  opendns: opendnsSvg,
  cisco: opendnsSvg
};

export const getBrandSvgUrl = (key) => {
  if (!key) return tunnelSvg;
  const lower = String(key).toLowerCase();
  for (const [k, src] of Object.entries(brandIconMap)) {
    if (lower.includes(k)) return src;
  }
  return tunnelSvg;
};

export const InterfaceIcon = React.memo(({ iface, className = "w-8 h-8", alt = "Adapter Icon" }) => {
  if (iface?.iconDataUrl) {
    return (
      <img
        src={iface.iconDataUrl}
        alt={alt}
        className={`${className} object-contain rounded-xl`}
        loading="lazy"
      />
    );
  }

  const svgSrc = getBrandSvgUrl(iface?.adapterType || iface?.brand || iface?.name);
  return (
    <img
      src={svgSrc}
      alt={alt}
      className={`${className} object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.08)]`}
      loading="lazy"
    />
  );
});

export const BrandIcon = React.memo(({ brand, className = "w-8 h-8", alt = "Brand Icon" }) => {
  const svgSrc = getBrandSvgUrl(brand);
  return (
    <img
      src={svgSrc}
      alt={alt}
      className={`${className} object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.08)]`}
      loading="lazy"
    />
  );
});
