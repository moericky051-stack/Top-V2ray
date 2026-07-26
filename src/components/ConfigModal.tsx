import React, { useState } from 'react';
import { X, Copy, Download, Check, FileCode, Layers } from 'lucide-react';
import { V2RayServer, Language } from '../types';
import {
  generateServerURI,
  generateV2RayJSONConfig,
  generateClashYAML,
} from '../utils/v2rayUtils';
import { translations } from '../data/translations';

interface ConfigModalProps {
  server: V2RayServer | null;
  onClose: () => void;
  lang: Language;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ server, onClose, lang }) => {
  if (!server) return null;

  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'URI' | 'JSON' | 'CLASH'>('URI');
  const [copied, setCopied] = useState(false);

  const rawUri = generateServerURI(server);
  const jsonConfig = generateV2RayJSONConfig(server);
  const clashConfig = generateClashYAML([server]);

  const getContent = () => {
    switch (activeTab) {
      case 'URI':
        return rawUri;
      case 'JSON':
        return jsonConfig;
      case 'CLASH':
        return clashConfig;
      default:
        return rawUri;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getContent();
    const ext = activeTab === 'JSON' ? 'json' : activeTab === 'CLASH' ? 'yaml' : 'txt';
    const filename = `${server.countryCode}_${server.protocol}_${server.name.replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#16161D] border border-[#2D2D39] rounded-[24px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#1F1F29] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{server.flag}</span>
              <span>{server.name}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Protocol: {server.protocol} | Transport: {server.network.toUpperCase()} | TLS: {server.tls ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>

        {/* Format Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-[#2D2D39] pb-3 mb-4">
          {(['URI', 'JSON', 'CLASH'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-[#1F1F29] text-slate-400 hover:text-white hover:bg-[#252533] border border-[#2D2D39]'
              }`}
            >
              {tab === 'URI' ? 'Standard URI' : tab === 'JSON' ? 'V2Ray JSON' : 'Clash YAML'}
            </button>
          ))}
        </div>

        {/* Config Code Display Box */}
        <div className="relative">
          <pre className="bg-[#0A0A0C] border border-[#2D2D39] rounded-2xl p-4 text-xs font-mono text-indigo-300 max-h-80 overflow-y-auto whitespace-pre-wrap break-all select-all">
            {getContent()}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.copied : 'Copy Configuration'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1F1F29] hover:bg-[#252533] text-slate-200 border border-[#2D2D39] transition"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Download File</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#1F1F29] text-slate-300 hover:bg-[#252533] border border-[#2D2D39] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
