import React, { useState } from 'react';
import { X, Rss, Copy, Check, Download, Layers, ArrowDownToLine } from 'lucide-react';
import { V2RayServer, Language } from '../types';
import { generateBase64Subscription, generateServerURI, parseV2RayURI } from '../utils/v2rayUtils';
import { translations } from '../data/translations';

interface SubscriptionModalProps {
  servers: V2RayServer[];
  onImportBulkServers: (servers: V2RayServer[]) => void;
  onClose: () => void;
  lang: Language;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  servers,
  onImportBulkServers,
  onClose,
  lang,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'EXPORT' | 'IMPORT'>('EXPORT');
  const [copied, setCopied] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [importedCount, setImportedCount] = useState<number | null>(null);

  const base64Sub = generateBase64Subscription(servers);
  const rawUris = servers.map(generateServerURI).join('\n');

  const handleCopySub = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBulkImport = () => {
    if (!bulkInput.trim()) return;

    let lines = bulkInput.split('\n').map((l) => l.trim()).filter(Boolean);

    // If it's a base64 string, try decoding first
    if (!lines[0].includes('://')) {
      try {
        const decoded = atob(lines[0]);
        lines = decoded.split('\n').map((l) => l.trim()).filter(Boolean);
      } catch (e) {
        // Not base64
      }
    }

    const newServers: V2RayServer[] = [];
    lines.forEach((line, index) => {
      const parsed = parseV2RayURI(line);
      if (parsed && parsed.address && parsed.uuid) {
        newServers.push({
          id: `imported-sub-${Date.now()}-${index}`,
          name: parsed.name || `Sub Node ${index + 1}`,
          countryCode: parsed.countryCode || 'SG',
          countryName: parsed.countryName || 'Global',
          flag: parsed.flag || '🌐',
          protocol: parsed.protocol || 'VLESS',
          address: parsed.address,
          port: parsed.port || 443,
          uuid: parsed.uuid,
          network: parsed.network || 'ws',
          path: parsed.path || '',
          host: parsed.host || '',
          sni: parsed.sni || parsed.host || parsed.address,
          tls: parsed.tls ?? true,
          security: parsed.security || 'auto',
          ping: Math.floor(Math.random() * 50) + 30,
          status: 'online',
          speedRating: 'Fast',
          bandwidth: '10 Gbps',
          tags: ['Subscription Import'],
          lastTested: 'Just now',
        });
      }
    });

    if (newServers.length > 0) {
      onImportBulkServers(newServers);
      setImportedCount(newServers.length);
      setTimeout(() => {
        setImportedCount(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center">
            <Rss className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">V2Ray Subscription Hub</h3>
            <p className="text-xs text-slate-400">
              Export Base64 subscription link or import bulk server URIs for v2rayNG / Shadowrocket
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('EXPORT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'EXPORT'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Export Subscription ({servers.length} Nodes)
          </button>

          <button
            onClick={() => setActiveTab('IMPORT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'IMPORT'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Bulk Import Servers / Base64
          </button>
        </div>

        {activeTab === 'EXPORT' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Base64 Subscription Link String (For v2rayNG / NekoBox / Shadowrocket):
              </label>
              <textarea
                value={base64Sub}
                readOnly
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-mono text-cyan-300 break-all select-all focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Plain Text Server List (All URIs):
              </label>
              <textarea
                value={rawUris}
                readOnly
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-mono text-slate-400 break-all select-all focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleCopySub(base64Sub)}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50 transition flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t.copied : 'Copy Base64 Subscription'}</span>
              </button>

              <button
                onClick={() => handleCopySub(rawUris)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition"
              >
                Copy Plain URIs
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Paste Subscription Text or Multiple Server URIs (vless://, vmess://, trojan://):
              </label>
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Paste base64 encoded subscription or multiple vless:// / vmess:// lines"
                rows={8}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {importedCount !== null && (
              <div className="flex items-center gap-2 p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Successfully imported {importedCount} new V2Ray servers!</span>
              </div>
            )}

            <button
              onClick={handleBulkImport}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-950/50 transition flex items-center justify-center gap-2"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Process & Add All Servers</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
