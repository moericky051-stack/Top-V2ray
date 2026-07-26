import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroConnectCard } from './components/HeroConnectCard';
import { ServerList } from './components/ServerList';
import { QRCodeModal } from './components/QRCodeModal';
import { ConfigModal } from './components/ConfigModal';
import { CreateServerModal } from './components/CreateServerModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SNITesterModal } from './components/SNITesterModal';
import { SpeedTestModal } from './components/SpeedTestModal';
import { GithubWorkflowModal } from './components/GithubWorkflowModal';

import { V2RayServer, ConnectionState, TrafficStats, Language } from './types';
import { INITIAL_SERVERS } from './data/defaultServers';
import { generateBase64Subscription } from './utils/v2rayUtils';
import { Shield, Rss, Globe, Check, Copy, Github, Terminal } from 'lucide-react';
import { translations } from './data/translations';

export default function App() {
  const [lang, setLang] = useState<Language>('my'); // Default to Burmese as requested!
  const [servers, setServers] = useState<V2RayServer[]>(INITIAL_SERVERS);
  const [selectedServer, setSelectedServer] = useState<V2RayServer>(INITIAL_SERVERS[0]);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isPingingAll, setIsPingingAll] = useState(false);

  // Traffic Stats State
  const [trafficStats, setTrafficStats] = useState<TrafficStats>({
    uploadSpeed: 0,
    downloadSpeed: 0,
    totalUpload: 0,
    totalDownload: 0,
    connectedTimeSeconds: 0,
    ipAddress: '103.253.144.12',
    virtualLocation: 'Direct / Unprotected',
  });

  // Modal States
  const [qrModalServer, setQrModalServer] = useState<V2RayServer | null>(null);
  const [configModalServer, setConfigModalServer] = useState<V2RayServer | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showSniModal, setShowSniModal] = useState(false);
  const [showSpeedTestModal, setShowSpeedTestModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [quickCopiedSub, setQuickCopiedSub] = useState(false);

  const t = translations[lang];

  // Connection Simulation & Traffic Loop Effect
  useEffect(() => {
    let interval: any = null;

    if (connectionState === 'connected') {
      interval = setInterval(() => {
        setTrafficStats((prev) => {
          // Generate realistic speed fluctuations
          const rx = parseFloat((Math.random() * 450 + 120).toFixed(1));
          const tx = parseFloat((Math.random() * 80 + 15).toFixed(1));
          const addRxMB = rx / 1024 / 10;
          const addTxMB = tx / 1024 / 10;

          return {
            ...prev,
            downloadSpeed: rx,
            uploadSpeed: tx,
            totalDownload: prev.totalDownload + addRxMB,
            totalUpload: prev.totalUpload + addTxMB,
            connectedTimeSeconds: prev.connectedTimeSeconds + 1,
            virtualLocation: `${selectedServer.countryName} (${selectedServer.address})`,
            ipAddress: `104.28.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}`,
          };
        });
      }, 1000);
    } else {
      setTrafficStats((prev) => ({
        ...prev,
        downloadSpeed: 0,
        uploadSpeed: 0,
      }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionState, selectedServer]);

  // Master Connect Toggle Handler
  const handleToggleConnect = () => {
    if (connectionState === 'disconnected') {
      setConnectionState('connecting');
      setTimeout(() => {
        setConnectionState('connected');
      }, 1200);
    } else if (connectionState === 'connected') {
      setConnectionState('disconnecting');
      setTimeout(() => {
        setConnectionState('disconnected');
      }, 800);
    }
  };

  // Ping Single Server
  const handlePingServer = (id: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newPing = Math.floor(Math.random() * 60) + 20;
          return { ...s, ping: newPing, lastTested: 'Just now' };
        }
        return s;
      })
    );
  };

  // Ping All Servers
  const handlePingAll = () => {
    setIsPingingAll(true);
    let delay = 0;

    servers.forEach((server, idx) => {
      setTimeout(() => {
        const newPing = Math.floor(Math.random() * 80) + 25;
        setServers((prev) =>
          prev.map((s) => (s.id === server.id ? { ...s, ping: newPing, lastTested: 'Just now' } : s))
        );

        if (idx === servers.length - 1) {
          setIsPingingAll(false);
        }
      }, (delay += 120));
    });
  };

  // Favorite Toggle Handler
  const handleToggleFavorite = (id: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  // Add Custom Server Handler
  const handleAddServer = (newServer: V2RayServer) => {
    setServers([newServer, ...servers]);
    setSelectedServer(newServer);
  };

  // Bulk Import Handler
  const handleImportBulkServers = (newServers: V2RayServer[]) => {
    setServers((prev) => [...newServers, ...prev]);
    if (newServers.length > 0) {
      setSelectedServer(newServers[0]);
    }
  };

  // Copy Quick Subscription
  const handleQuickCopySub = () => {
    const subStr = generateBase64Subscription(servers);
    navigator.clipboard.writeText(subStr);
    setQuickCopiedSub(true);
    setTimeout(() => setQuickCopiedSub(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        serverCount={servers.length}
        onPingAll={handlePingAll}
        isPinging={isPingingAll}
        onOpenCreateModal={() => setShowCreateModal(true)}
        onOpenSubModal={() => setShowSubModal(true)}
        onOpenSniModal={() => setShowSniModal(true)}
        onOpenSpeedTestModal={() => setShowSpeedTestModal(true)}
        onOpenGithubModal={() => setShowGithubModal(true)}
        isConnected={connectionState === 'connected'}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Master Hero VPN Connection Dashboard */}
        <HeroConnectCard
          selectedServer={selectedServer}
          connectionState={connectionState}
          onToggleConnect={handleToggleConnect}
          trafficStats={trafficStats}
          lang={lang}
          onShowQr={(s) => setQrModalServer(s)}
          onShowConfig={(s) => setConfigModalServer(s)}
        />

        {/* Global Server List & Filters */}
        <ServerList
          servers={servers}
          selectedServer={selectedServer}
          onSelectServer={(s) => setSelectedServer(s)}
          onToggleFavorite={handleToggleFavorite}
          onShowQr={(s) => setQrModalServer(s)}
          onShowConfig={(s) => setConfigModalServer(s)}
          onPingServer={handlePingServer}
          lang={lang}
        />

        {/* V2Ray Quick Guide & GitHub Build Section */}
        <section className="bg-[#16161D] border border-[#2D2D39] rounded-[24px] p-6 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6 text-slate-300 text-xs">
          <div className="p-4 bg-[#1F1F29] rounded-2xl border border-[#2D2D39]">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
              <Shield className="w-4 h-4" />
              <span>1. VLESS & VMess Protocol</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              VLESS and VMess combined with gRPC or WebSocket + TLS bypass network blocks and SNI filters safely across ISPs.
            </p>
          </div>

          <div className="p-4 bg-[#1F1F29] rounded-2xl border border-[#2D2D39]">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
              <Rss className="w-4 h-4" />
              <span>2. Mobile & Desktop Support</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Scan QR code directly using v2rayNG or NekoBox on Android, or Shadowrocket & Streisand on iPhone/iPad.
            </p>
          </div>

          <div className="p-4 bg-[#1F1F29] rounded-2xl border border-[#2D2D39]">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
              <Globe className="w-4 h-4" />
              <span>3. Cloudflare CDN & SNI Bug Host</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Customize CDN SNI host or Cloudflare Clean IPs inside the Config Generator or SNI Tester tool.
            </p>
          </div>

          <div className="p-4 bg-[#1F1F29] rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
                <Github className="w-4 h-4" />
                <span>4. GitHub Actions APK Build</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-3">
                GitHub Repository သို့ push လုပ်ရုံဖြင့် Android APK ကို Automatic compile လုပ်ပေးနိုင်သော `.github/workflows/build-apk.yml` file ရယူပါ။
              </p>
            </div>
            <button
              onClick={() => setShowGithubModal(true)}
              className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{lang === 'my' ? 'GitHub .yml ရယူရန်' : 'Get GitHub .yml'}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2D2D39] bg-[#0A0A0C] py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Top V2Ray VPN Hub</span>
            <span>•</span>
            <span>Myanmar & Global Free Internet Tools</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGithubModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl transition font-semibold"
            >
              <Github className="w-3.5 h-3.5 text-purple-400" />
              <span>GitHub Actions .yml</span>
            </button>

            <button
              onClick={handleQuickCopySub}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16161D] hover:bg-[#1F1F29] text-slate-300 border border-[#2D2D39] rounded-xl transition font-semibold"
            >
              {quickCopiedSub ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.quickCopySub}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {qrModalServer && (
        <QRCodeModal
          server={qrModalServer}
          onClose={() => setQrModalServer(null)}
          lang={lang}
        />
      )}

      {configModalServer && (
        <ConfigModal
          server={configModalServer}
          onClose={() => setConfigModalServer(null)}
          lang={lang}
        />
      )}

      {showCreateModal && (
        <CreateServerModal
          onAddServer={handleAddServer}
          onClose={() => setShowCreateModal(false)}
          lang={lang}
        />
      )}

      {showSubModal && (
        <SubscriptionModal
          servers={servers}
          onImportBulkServers={handleImportBulkServers}
          onClose={() => setShowSubModal(false)}
          lang={lang}
        />
      )}

      {showSniModal && (
        <SNITesterModal
          onClose={() => setShowSniModal(false)}
          lang={lang}
        />
      )}

      {showSpeedTestModal && (
        <SpeedTestModal
          selectedServer={selectedServer}
          onClose={() => setShowSpeedTestModal(false)}
          lang={lang}
        />
      )}

      <GithubWorkflowModal
        isOpen={showGithubModal}
        onClose={() => setShowGithubModal(false)}
        lang={lang}
      />
    </div>
  );
}
