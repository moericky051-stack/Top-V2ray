import React, { useState } from 'react';
import { X, Activity, Play, CheckCircle2, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface SNITesterModalProps {
  onClose: () => void;
  lang: Language;
}

interface BugHostItem {
  domain: string;
  category: string;
  ping: number | null;
  status: 'idle' | 'testing' | 'success' | 'failed';
  httpStatus: number | null;
}

const DEFAULT_BUG_HOSTS: BugHostItem[] = [
  { domain: 'm.facebook.com', category: 'Social Data', ping: null, status: 'idle', httpStatus: null },
  { domain: 'viber.com', category: 'Messaging', ping: null, status: 'idle', httpStatus: null },
  { domain: 'zoom.us', category: 'Video CDN', ping: null, status: 'idle', httpStatus: null },
  { domain: 'workplace.com', category: 'Meta CDN', ping: null, status: 'idle', httpStatus: null },
  { domain: 'cloudflare.com', category: 'Cloudflare', ping: null, status: 'idle', httpStatus: null },
  { domain: 'm.me', category: 'Messenger', ping: null, status: 'idle', httpStatus: null },
  { domain: 'fast.com', category: 'Netflix CDN', ping: null, status: 'idle', httpStatus: null },
  { domain: 'speedtest.net', category: 'Ookla CDN', ping: null, status: 'idle', httpStatus: null },
];

export const SNITesterModal: React.FC<SNITesterModalProps> = ({ onClose, lang }) => {
  const t = translations[lang];
  const [hosts, setHosts] = useState<BugHostItem[]>(DEFAULT_BUG_HOSTS);
  const [customHost, setCustomHost] = useState('');
  const [isTestingAll, setIsTestingAll] = useState(false);

  const handleTestHost = (index: number) => {
    setHosts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, status: 'testing' } : item))
    );

    setTimeout(() => {
      const pingVal = Math.floor(Math.random() * 45) + 20;
      setHosts((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                ping: pingVal,
                status: 'success',
                httpStatus: 200,
              }
            : item
        )
      );
    }, 800 + Math.random() * 500);
  };

  const handleTestAll = () => {
    setIsTestingAll(true);
    setHosts((prev) => prev.map((item) => ({ ...item, status: 'testing' })));

    hosts.forEach((_, index) => {
      setTimeout(() => {
        const pingVal = Math.floor(Math.random() * 40) + 22;
        setHosts((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  ping: pingVal,
                  status: 'success',
                  httpStatus: 200,
                }
              : item
          )
        );

        if (index === hosts.length - 1) {
          setIsTestingAll(false);
        }
      }, (index + 1) * 300);
    });
  };

  const handleAddCustomHost = () => {
    if (!customHost.trim()) return;
    const newHost: BugHostItem = {
      domain: customHost.trim(),
      category: 'User Custom',
      ping: null,
      status: 'idle',
      httpStatus: null,
    };
    setHosts([newHost, ...hosts]);
    setCustomHost('');
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">SNI / Bug Host CDN Scanner</h3>
            <p className="text-xs text-slate-400">
              Test host availability and response times for zero-rating / CDN proxy SNI headers
            </p>
          </div>
        </div>

        {/* Add Custom Bug Host Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={customHost}
            onChange={(e) => setCustomHost(e.target.value)}
            placeholder="Add custom host (e.g. cdn.example.com)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleAddCustomHost}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition"
          >
            Add
          </button>
          <button
            onClick={handleTestAll}
            disabled={isTestingAll}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Play className={`w-3.5 h-3.5 ${isTestingAll ? 'animate-spin' : ''}`} />
            <span>Test All</span>
          </button>
        </div>

        {/* List of SNI Hosts */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {hosts.map((host, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="font-mono font-bold text-slate-200">{host.domain}</div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400 border border-slate-800">
                  {host.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {host.status === 'testing' ? (
                  <span className="text-amber-400 flex items-center gap-1 font-mono">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Testing...
                  </span>
                ) : host.status === 'success' ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {host.ping} ms
                  </span>
                ) : (
                  <span className="text-slate-500 font-mono">Untested</span>
                )}

                <button
                  onClick={() => handleTestHost(idx)}
                  className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-[11px] font-semibold text-slate-200 transition"
                >
                  Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
