import React from 'react';
import {
  ShieldCheck,
  Globe2,
  RefreshCw,
  Plus,
  Rss,
  Activity,
  Zap,
  Github,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  serverCount: number;
  onPingAll: () => void;
  isPinging: boolean;
  onOpenCreateModal: () => void;
  onOpenSubModal: () => void;
  onOpenSniModal: () => void;
  onOpenSpeedTestModal: () => void;
  onOpenGithubModal?: () => void;
  isConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  serverCount,
  onPingAll,
  isPinging,
  onOpenCreateModal,
  onOpenSubModal,
  onOpenSniModal,
  onOpenSpeedTestModal,
  onOpenGithubModal,
  isConnected,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-[#2D2D39] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span
              className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0A0A0C] ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                {t.appTitle}
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                V2Ray / VLESS Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub APK Workflow Button */}
          {onOpenGithubModal && (
            <button
              onClick={onOpenGithubModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition"
              title="GitHub APK Workflow"
            >
              <Github className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden xl:inline">Build APK (.yml)</span>
            </button>
          )}

          {/* Ping All Button */}
          <button
            onClick={onPingAll}
            disabled={isPinging}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#16161D] hover:bg-[#1F1F29] text-slate-200 border border-[#2D2D39] transition duration-150 disabled:opacity-50"
            title={t.pingAllServers}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-indigo-400 ${
                isPinging ? 'animate-spin' : ''
              }`}
            />
            <span className="hidden md:inline">{t.pingAllServers}</span>
          </button>

          {/* Speed Test Button */}
          <button
            onClick={onOpenSpeedTestModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#16161D] hover:bg-[#1F1F29] text-amber-300 border border-[#2D2D39] transition"
            title={t.speedTest}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.speedTest}</span>
          </button>

          {/* SNI / Bug Host Scanner Button */}
          <button
            onClick={onOpenSniModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#16161D] hover:bg-[#1F1F29] text-emerald-300 border border-[#2D2D39] transition"
            title={t.sniTester}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">{t.sniTester}</span>
          </button>

          {/* Subscription Button */}
          <button
            onClick={onOpenSubModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition"
          >
            <Rss className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{t.importSubscription}</span>
          </button>

          {/* Add Custom Server */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.addCustomServer}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'my' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#16161D] hover:bg-[#1F1F29] text-indigo-300 border border-[#2D2D39] transition ml-1"
            title="Switch Language"
          >
            <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'en' ? '🇲🇲 မြန်မာ' : '🇺🇸 EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
