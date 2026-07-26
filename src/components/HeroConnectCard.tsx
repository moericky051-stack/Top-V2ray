import React, { useEffect, useState } from 'react';
import {
  Power,
  Shield,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Wifi,
  Clock,
  Globe,
  Copy,
  QrCode,
  Check,
  Zap,
} from 'lucide-react';
import { V2RayServer, ConnectionState, TrafficStats, Language } from '../types';
import { translations } from '../data/translations';
import { generateServerURI } from '../utils/v2rayUtils';

interface HeroConnectCardProps {
  selectedServer: V2RayServer;
  connectionState: ConnectionState;
  onToggleConnect: () => void;
  trafficStats: TrafficStats;
  lang: Language;
  onShowQr: (server: V2RayServer) => void;
  onShowConfig: (server: V2RayServer) => void;
}

export const HeroConnectCard: React.FC<HeroConnectCardProps> = ({
  selectedServer,
  connectionState,
  onToggleConnect,
  trafficStats,
  lang,
  onShowQr,
  onShowConfig,
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const handleCopyUri = () => {
    const uri = generateServerURI(selectedServer);
    navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : ''}${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting' || connectionState === 'disconnecting';

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#16161D] border border-[#2D2D39] shadow-2xl p-6 md:p-8 text-white">
      {/* Background Subtle Glowing Gradients */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${
          isConnected ? 'bg-emerald-500' : isConnecting ? 'bg-amber-500' : 'bg-indigo-600'
        }`}
      />
      <div
        className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${
          isConnected ? 'bg-indigo-500' : 'bg-indigo-700'
        }`}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Section: Connection Status & Master Button */}
        <div className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border mb-6 transition-all duration-300 ${
              isConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : isConnecting
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}
          >
            {isConnected ? (
              <Shield className="w-4 h-4 text-emerald-400" />
            ) : isConnecting ? (
              <Wifi className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
            )}
            <span>
              {isConnected
                ? t.connected
                : connectionState === 'connecting'
                ? t.connecting
                : connectionState === 'disconnecting'
                ? t.disconnecting
                : t.disconnected}
            </span>
          </div>

          {/* Master Power Connect Button */}
          <div className="my-2 relative group">
            <button
              onClick={onToggleConnect}
              disabled={isConnecting}
              className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
                isConnected
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/40 border-8 border-white/10 scale-105 hover:scale-110 ring-4 ring-emerald-500/20'
                  : isConnecting
                  ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-2xl shadow-amber-500/40 border-8 border-white/10 ring-4 ring-amber-500/20'
                  : 'bg-gradient-to-br from-[#4F46E5] to-[#3730A3] text-white shadow-2xl shadow-indigo-600/40 border-8 border-white/5 hover:scale-105 active:scale-95'
              }`}
            >
              <Power
                className={`w-11 h-11 sm:w-14 sm:h-14 mb-1 transition-transform duration-300 ${
                  isConnected ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'
                }`}
              />
              <span className="text-xs font-bold tracking-wider uppercase">
                {isConnected
                  ? t.disconnect
                  : isConnecting
                  ? t.connecting
                  : t.connect}
              </span>
            </button>
          </div>

          {/* Security Notice */}
          <p className="text-xs text-slate-400 mt-5 max-w-sm">
            {isConnected ? (
              <span className="text-emerald-400 font-semibold flex items-center justify-center lg:justify-start gap-1">
                <Shield className="w-3.5 h-3.5" />
                {t.protected} • AES-256 / TLS Encrypted
              </span>
            ) : (
              <span className="text-slate-400">{t.unprotected}</span>
            )}
          </p>

          <p className="text-xs text-indigo-300 mt-1 font-medium">
            {t.myanmarHelp}
          </p>
        </div>

        {/* Right Section: Active Server Details & Realtime Traffic Gauges */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Server Card Info */}
          <div className="bg-[#1F1F29] rounded-2xl p-5 border border-[#2D2D39] shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t.selectedServer}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                {selectedServer.protocol} ({selectedServer.network.toUpperCase()})
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedServer.flag}</span>
                <div>
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                    {selectedServer.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{selectedServer.countryName}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-300">
                      {selectedServer.address}:{selectedServer.port}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ping Badge */}
              <div className="text-right">
                <div
                  className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 rounded-xl border ${
                    selectedServer.ping < 60
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : selectedServer.ping < 150
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  {selectedServer.ping > 0 ? `${selectedServer.ping} ms` : 'Timeout'}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons for Selected Server */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#2D2D39] text-xs">
              <button
                onClick={handleCopyUri}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#16161D] hover:bg-[#252533] rounded-xl text-slate-200 transition font-semibold border border-[#2D2D39]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.copyUri}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onShowQr(selectedServer)}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#16161D] hover:bg-[#252533] rounded-xl text-slate-200 transition font-semibold border border-[#2D2D39]"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.qrCode}</span>
              </button>

              <button
                onClick={() => onShowConfig(selectedServer)}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#16161D] hover:bg-[#252533] rounded-xl text-slate-200 transition font-semibold border border-[#2D2D39]"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.viewConfig}</span>
              </button>
            </div>
          </div>

          {/* Traffic Speed Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Download Speed */}
            <div className="bg-[#1F1F29] rounded-2xl p-3.5 border border-[#2D2D39]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.download}</span>
              </div>
              <div className="font-mono text-base font-bold text-emerald-400">
                {isConnected ? `${trafficStats.downloadSpeed.toFixed(1)} KB/s` : '0.0 KB/s'}
              </div>
            </div>

            {/* Upload Speed */}
            <div className="bg-[#1F1F29] rounded-2xl p-3.5 border border-[#2D2D39]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.upload}</span>
              </div>
              <div className="font-mono text-base font-bold text-indigo-400">
                {isConnected ? `${trafficStats.uploadSpeed.toFixed(1)} KB/s` : '0.0 KB/s'}
              </div>
            </div>

            {/* Total Traffic */}
            <div className="bg-[#1F1F29] rounded-2xl p-3.5 border border-[#2D2D39]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.totalTraffic}</span>
              </div>
              <div className="font-mono text-base font-bold text-purple-300">
                {isConnected
                  ? `${(trafficStats.totalDownload + trafficStats.totalUpload).toFixed(1)} MB`
                  : '0.0 MB'}
              </div>
            </div>

            {/* Duration */}
            <div className="bg-[#1F1F29] rounded-2xl p-3.5 border border-[#2D2D39]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Duration</span>
              </div>
              <div className="font-mono text-base font-bold text-amber-300">
                {isConnected ? formatTimer(trafficStats.connectedTimeSeconds) : '00:00'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
