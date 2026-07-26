import React, { useState } from 'react';
import { X, Plus, Link, Sliders, Check, AlertCircle } from 'lucide-react';
import { V2RayServer, ProtocolType, TransportType, Language } from '../types';
import { parseV2RayURI } from '../utils/v2rayUtils';
import { translations } from '../data/translations';

interface CreateServerModalProps {
  onAddServer: (server: V2RayServer) => void;
  onClose: () => void;
  lang: Language;
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({
  onAddServer,
  onClose,
  lang,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'PASTE' | 'MANUAL'>('PASTE');

  // Paste URI State
  const [pastedUri, setPastedUri] = useState('');
  const [parseError, setParseError] = useState('');

  // Manual Form State
  const [name, setName] = useState('My Custom V2Ray');
  const [countryCode, setCountryCode] = useState('SG');
  const [countryName, setCountryName] = useState('Singapore');
  const [flag, setFlag] = useState('🇸🇬');
  const [protocol, setProtocol] = useState<ProtocolType>('VLESS');
  const [address, setAddress] = useState('');
  const [port, setPort] = useState(443);
  const [uuid, setUuid] = useState('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
  const [network, setNetwork] = useState<TransportType>('ws');
  const [path, setPath] = useState('/vless-ws');
  const [host, setHost] = useState('');
  const [sni, setSni] = useState('');
  const [tls, setTls] = useState(true);

  const handleImportUri = () => {
    setParseError('');
    if (!pastedUri.trim()) {
      setParseError('Please paste a valid V2Ray URI string.');
      return;
    }

    const parsed = parseV2RayURI(pastedUri);
    if (!parsed || !parsed.address || !parsed.uuid) {
      setParseError('Failed to parse URI. Please check formatting (vless://, vmess://, trojan://, ss://).');
      return;
    }

    const newServer: V2RayServer = {
      id: `custom-${Date.now()}`,
      name: parsed.name || 'Imported Server',
      countryCode: parsed.countryCode || 'SG',
      countryName: parsed.countryName || 'Custom Location',
      flag: parsed.flag || '🌐',
      protocol: (parsed.protocol as ProtocolType) || 'VLESS',
      address: parsed.address,
      port: parsed.port || 443,
      uuid: parsed.uuid,
      network: (parsed.network as TransportType) || 'ws',
      path: parsed.path || '',
      host: parsed.host || '',
      sni: parsed.sni || parsed.host || parsed.address,
      tls: parsed.tls ?? true,
      security: parsed.security || 'auto',
      ping: Math.floor(Math.random() * 60) + 30,
      status: 'online',
      speedRating: 'Fast',
      bandwidth: 'Custom Server',
      tags: ['Custom Import', 'User Config'],
      lastTested: 'Just now',
    };

    onAddServer(newServer);
    onClose();
  };

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    const newServer: V2RayServer = {
      id: `custom-${Date.now()}`,
      name: name || 'Custom Server',
      countryCode,
      countryName,
      flag,
      protocol,
      address: address.trim(),
      port: Number(port) || 443,
      uuid: uuid.trim(),
      network,
      path: path.trim(),
      host: host.trim() || address.trim(),
      sni: sni.trim() || address.trim(),
      tls,
      security: 'auto',
      ping: Math.floor(Math.random() * 50) + 25,
      status: 'online',
      speedRating: 'Ultra Fast',
      bandwidth: '10 Gbps',
      tags: ['Custom Created', protocol, network.toUpperCase()],
      lastTested: 'Just now',
    };

    onAddServer(newServer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" />
            <span>Add / Create V2Ray Server</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Import existing V2Ray config URI or build a custom VLESS / VMess / Trojan node
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('PASTE')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'PASTE'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Paste URI (vless:// / vmess://)</span>
          </button>

          <button
            onClick={() => setActiveTab('MANUAL')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'MANUAL'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manual Config Builder</span>
          </button>
        </div>

        {/* PASTE TAB */}
        {activeTab === 'PASTE' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                V2Ray / VLESS / VMess / Trojan URI Link:
              </label>
              <textarea
                value={pastedUri}
                onChange={(e) => setPastedUri(e.target.value)}
                placeholder="Paste vless://..., vmess://..., trojan://..., or ss://... here"
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {parseError && (
              <div className="flex items-center gap-2 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{parseError}</span>
              </div>
            )}

            <button
              onClick={handleImportUri}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-950/50 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Import Server Config</span>
            </button>
          </div>
        ) : (
          /* MANUAL BUILDER TAB */
          <form onSubmit={handleManualCreate} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Server Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Protocol</label>
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value as ProtocolType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="VLESS">VLESS</option>
                  <option value="VMess">VMess</option>
                  <option value="Trojan">Trojan</option>
                  <option value="Shadowsocks">Shadowsocks</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block font-semibold text-slate-300 mb-1">Server Address / IP</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="sg01.domain.com or 104.16.x.x"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Port</label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">UUID / User Password</label>
              <input
                type="text"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Network Transport</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as TransportType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="ws">WebSocket (ws)</option>
                  <option value="grpc">gRPC</option>
                  <option value="tcp">TCP</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Path / ServiceName</label>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/v2ray-ws"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">SNI (Server Name Indication)</label>
                <input
                  type="text"
                  value={sni}
                  onChange={(e) => setSni(e.target.value)}
                  placeholder="m.facebook.com or cdn.domain.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">CDN Host Header</label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="host.domain.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="tls"
                checked={tls}
                onChange={(e) => setTls(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor="tls" className="font-semibold text-slate-300">
                Enable TLS Encryption (Port 443 / 8443)
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-950/50 transition mt-4"
            >
              Add Custom Server
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
