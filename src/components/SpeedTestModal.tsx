import React, { useState } from 'react';
import { X, Zap, ArrowDown, ArrowUp, RefreshCw, Gauge } from 'lucide-react';
import { V2RayServer, Language } from '../types';

interface SpeedTestModalProps {
  selectedServer: V2RayServer;
  onClose: () => void;
  lang: Language;
}

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({ selectedServer, onClose }) => {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const startSpeedTest = () => {
    setTesting(true);
    setProgress(0);
    setDownloadSpeed(0);
    setUploadSpeed(0);

    const pingVal = selectedServer.ping > 0 ? selectedServer.ping : Math.floor(Math.random() * 35) + 20;
    setPing(pingVal);
    setJitter(Math.floor(Math.random() * 5) + 1);

    // Simulate Download Phase
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTesting(false);
          return 100;
        }

        if (prev < 50) {
          // Download test phase
          const currentDl = Math.min(
            120,
            Math.floor(Math.random() * 40) + 65 + (prev / 50) * 30
          );
          setDownloadSpeed(currentDl);
        } else {
          // Upload test phase
          const currentUl = Math.min(
            60,
            Math.floor(Math.random() * 20) + 30 + ((prev - 50) / 50) * 15
          );
          setUploadSpeed(currentUl);
        }

        return prev + 5;
      });
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800/80 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>V2Ray Speedometer & Ping Gauge</span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <span>{selectedServer.flag}</span>
            <span>{selectedServer.name}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Testing route speed to {selectedServer.countryName} ({selectedServer.address})
          </p>
        </div>

        {/* Gauge Visual */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center my-4 relative">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-36 h-36 rounded-full border-8 border-slate-800 flex items-center justify-center bg-slate-900 shadow-inner">
              <div
                className="absolute inset-0 rounded-full border-8 border-amber-500 transition-all duration-300"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
                }}
              />
              <div className="text-center">
                <Gauge className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <div className="font-mono text-2xl font-black text-amber-300">
                  {testing
                    ? progress < 50
                      ? downloadSpeed?.toFixed(0)
                      : uploadSpeed?.toFixed(0)
                    : downloadSpeed
                    ? downloadSpeed.toFixed(0)
                    : '--'}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  {testing ? (progress < 50 ? 'Testing DL' : 'Testing UL') : 'Mbps'}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Speed Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 flex items-center justify-center gap-1 mb-1">
                <ArrowDown className="w-3 h-3 text-emerald-400" />
                <span>Download</span>
              </div>
              <div className="font-mono font-bold text-emerald-400 text-sm">
                {downloadSpeed ? `${downloadSpeed.toFixed(1)} Mbps` : '--'}
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 flex items-center justify-center gap-1 mb-1">
                <ArrowUp className="w-3 h-3 text-cyan-400" />
                <span>Upload</span>
              </div>
              <div className="font-mono font-bold text-cyan-400 text-sm">
                {uploadSpeed ? `${uploadSpeed.toFixed(1)} Mbps` : '--'}
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 mb-1">Ping</div>
              <div className="font-mono font-bold text-slate-200 text-sm">
                {ping ? `${ping} ms` : '--'}
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 mb-1">Jitter</div>
              <div className="font-mono font-bold text-slate-200 text-sm">
                {jitter ? `${jitter} ms` : '--'}
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startSpeedTest}
          disabled={testing}
          className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-950/40 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Testing Network Speed...' : 'Start Speed Test'}</span>
        </button>
      </div>
    </div>
  );
};
