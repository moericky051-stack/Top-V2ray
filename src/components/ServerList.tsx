import React, { useState } from 'react';
import {
  Search,
  Star,
  Zap,
  Copy,
  QrCode,
  FileCode,
  Check,
  Globe,
  Radio,
  SlidersHorizontal,
  Wifi,
} from 'lucide-react';
import { V2RayServer, ProtocolType, Language } from '../types';
import { translations } from '../data/translations';
import { generateServerURI } from '../utils/v2rayUtils';

interface ServerListProps {
  servers: V2RayServer[];
  selectedServer: V2RayServer;
  onSelectServer: (server: V2RayServer) => void;
  onToggleFavorite: (id: string) => void;
  onShowQr: (server: V2RayServer) => void;
  onShowConfig: (server: V2RayServer) => void;
  onPingServer: (id: string) => void;
  lang: Language;
}

export const ServerList: React.FC<ServerListProps> = ({
  servers,
  selectedServer,
  onSelectServer,
  onToggleFavorite,
  onShowQr,
  onShowConfig,
  onPingServer,
  lang,
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType | 'ALL'>('ALL');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUri = (server: V2RayServer, e: React.MouseEvent) => {
    e.stopPropagation();
    const uri = generateServerURI(server);
    navigator.clipboard.writeText(uri);
    setCopiedId(server.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredServers = servers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.network.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProtocol = selectedProtocol === 'ALL' || s.protocol === selectedProtocol;
    const matchesFavorite = !showOnlyFavorites || s.isFavorite;

    return matchesSearch && matchesProtocol && matchesFavorite;
  });

  return (
    <div className="bg-[#16161D] border border-[#2D2D39] rounded-[24px] p-6 shadow-xl text-slate-100">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span>{t.serverList}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1F1F29] text-indigo-400 border border-[#2D2D39]">
              {filteredServers.length} / {servers.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a server to connect or export V2Ray / VLESS / VMess URI links
          </p>
        </div>

        {/* Protocol Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {(['ALL', 'VLESS', 'VMess', 'Trojan', 'Shadowsocks'] as const).map((proto) => (
            <button
              key={proto}
              onClick={() => setSelectedProtocol(proto)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedProtocol === proto
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-[#1F1F29] hover:bg-[#252533] text-slate-300 border border-[#2D2D39]'
              }`}
            >
              {proto === 'ALL' ? t.allProtocols : proto}
            </button>
          ))}

          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`p-2 rounded-xl transition border text-xs font-semibold flex items-center gap-1 ${
              showOnlyFavorites
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-[#1F1F29] text-slate-400 border-[#2D2D39] hover:bg-[#252533]'
            }`}
            title={t.favoriteServers}
          >
            <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-[#1F1F29] border border-[#2D2D39] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-[#1F1F29] rounded-2xl border border-[#2D2D39]">
            <Radio className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm">No servers match your search criteria.</p>
          </div>
        ) : (
          filteredServers.map((server) => {
            const isSelected = selectedServer.id === server.id;

            return (
              <div
                key={server.id}
                onClick={() => onSelectServer(server)}
                className={`group relative rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1F1F29] border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-950/40'
                    : 'bg-[#1F1F29]/70 hover:bg-[#1F1F29] border-[#2D2D39] hover:border-slate-600'
                }`}
              >
                {/* Top Row: Country Flag, Name & Favorite Star */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{server.flag}</span>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition line-clamp-1">
                          {server.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <span>{server.countryName}</span>
                          <span>•</span>
                          <span className="font-mono">{server.port}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(server.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-400 transition"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          server.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Badges: Protocol, Transport, Speed */}
                  <div className="flex flex-wrap items-center gap-1.5 my-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${
                        server.protocol === 'VLESS'
                          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                          : server.protocol === 'VMess'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : server.protocol === 'Trojan'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {server.protocol}
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-[#16161D] text-slate-300 border border-[#2D2D39]">
                      {server.network}
                    </span>

                    {server.tls && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        TLS
                      </span>
                    )}

                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium text-slate-400 bg-[#16161D] border border-[#2D2D39] ml-auto">
                      {server.bandwidth}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Ping & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#2D2D39] mt-1">
                  {/* Ping Status */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPingServer(server.id);
                    }}
                    className={`flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl border transition ${
                      server.ping > 0 && server.ping < 70
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        : server.ping < 160
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                    }`}
                    title="Click to test ping"
                  >
                    <Zap className="w-3 h-3" />
                    <span>{server.ping > 0 ? `${server.ping} ms` : 'Ping'}</span>
                  </button>

                  {/* Action Icons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleCopyUri(server, e)}
                      className="p-1.5 rounded-lg bg-[#16161D] hover:bg-[#252533] text-slate-300 hover:text-indigo-300 border border-[#2D2D39] transition"
                      title={t.copyUri}
                    >
                      {copiedId === server.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowQr(server);
                      }}
                      className="p-1.5 rounded-lg bg-[#16161D] hover:bg-[#252533] text-slate-300 hover:text-amber-300 border border-[#2D2D39] transition"
                      title={t.qrCode}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowConfig(server);
                      }}
                      className="p-1.5 rounded-lg bg-[#16161D] hover:bg-[#252533] text-slate-300 hover:text-indigo-300 border border-[#2D2D39] transition"
                      title={t.viewConfig}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
