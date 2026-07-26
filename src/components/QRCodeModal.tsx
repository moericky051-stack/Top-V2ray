import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Smartphone, ShieldCheck, Download } from 'lucide-react';
import { V2RayServer, Language } from '../types';
import { generateServerURI } from '../utils/v2rayUtils';
import { translations } from '../data/translations';

interface QRCodeModalProps {
  server: V2RayServer | null;
  onClose: () => void;
  lang: Language;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ server, onClose, lang }) => {
  if (!server) return null;

  const t = translations[lang];
  const uri = generateServerURI(server);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#16161D] border border-[#2D2D39] rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-2xl text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#1F1F29] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>V2Ray QR Code Configuration</span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <span>{server.flag}</span>
            <span>{server.name}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.scanQrNotice}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center bg-white p-5 rounded-2xl shadow-inner my-4">
          <QRCodeSVG
            value={uri}
            size={220}
            level="M"
            includeMargin={true}
          />
        </div>

        {/* URI Box */}
        <div className="bg-[#1F1F29] rounded-xl p-3 border border-[#2D2D39] my-4 text-xs font-mono text-slate-300 break-all max-h-24 overflow-y-auto">
          {uri}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.copyUri}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-sm font-semibold bg-[#1F1F29] hover:bg-[#252533] text-slate-300 border border-[#2D2D39] transition"
          >
            Close
          </button>
        </div>

        {/* Mobile Guide */}
        <div className="mt-6 pt-4 border-t border-[#2D2D39] text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300">Supported Mobile Apps:</div>
          <p>• <span className="text-indigo-400">Android:</span> v2rayNG, NekoBox, Surfboard, Clash Meta</p>
          <p>• <span className="text-amber-400">iOS / iPhone:</span> Shadowrocket, Streisand, Quantumult X</p>
          <p>• <span className="text-emerald-400">Windows / Mac:</span> v2rayN, Clash Verge, Sing-box</p>
        </div>
      </div>
    </div>
  );
};
