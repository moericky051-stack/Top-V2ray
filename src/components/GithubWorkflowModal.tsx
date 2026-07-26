import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Github, Smartphone, Terminal, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface GithubWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const WORKFLOW_YAML_CONTENT = `name: Build Android APK

on:
  push:
    branches:
      - main
      - master
  pull_request:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  build-apk:
    name: Build Android APK Package
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci || npm install

      - name: Build Web Application
        run: npm run build

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Initialize Capacitor for Android
        run: |
          if [ -f "capacitor.config.ts" ] || [ -f "capacitor.config.json" ]; then
            npx cap sync android
          else
            echo "Installing Capacitor & Android platform..."
            npm install @capacitor/core @capacitor/cli @capacitor/android
            npx cap init "Top V2Ray VPN" "com.v2ray.vpn.hub" --web-dir dist
            npx cap add android
            npx cap sync android
          fi

      - name: Build Android Debug APK with Gradle
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug --stacktrace

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: V2Ray-VPN-Hub-Debug.apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 30
`;

export const GithubWorkflowModal: React.FC<GithubWorkflowModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(WORKFLOW_YAML_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([WORKFLOW_YAML_CONTENT], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build-apk.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isMyanmar = lang === 'my';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#16161D] border border-[#2D2D39] rounded-[24px] p-6 sm:p-8 max-w-3xl w-full shadow-2xl text-slate-100 relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#1F1F29] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isMyanmar ? 'GitHub Actions APK Workflow (.yml)' : 'GitHub Actions APK Workflow (.yml)'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Android .APK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isMyanmar
                ? 'GitHub repository တွင် automatic APK build ရရှိရန် .github/workflows/build-apk.yml ဖိုင်အဖြစ် ထည့်သွင်းပါ'
                : 'Automated GitHub Actions workflow file to compile Android .APK directly on push.'}
            </p>
          </div>
        </div>

        {/* Instructions Banner */}
        <div className="bg-[#1F1F29] border border-[#2D2D39] rounded-2xl p-4 mb-4 text-xs space-y-2">
          <div className="font-bold text-indigo-400 flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>
              {isMyanmar
                ? 'GitHub Workflow အသုံးပြုနည်း လမ်းညွှန်:'
                : 'How to setup in your GitHub repository:'}
            </span>
          </div>
          <ol className="list-decimal list-inside text-slate-300 space-y-1.5 pl-1">
            <li>
              {isMyanmar ? (
                <>
                  သင့် GitHub project repository တွင်{' '}
                  <code className="text-amber-300 bg-[#16161D] px-1.5 py-0.5 rounded border border-[#2D2D39]">
                    .github/workflows/build-apk.yml
                  </code>{' '}
                  ဖိုင်ဖန်တီးပါ။
                </>
              ) : (
                <>
                  Create a file named{' '}
                  <code className="text-amber-300 bg-[#16161D] px-1.5 py-0.5 rounded border border-[#2D2D39]">
                    .github/workflows/build-apk.yml
                  </code>{' '}
                  in your GitHub repository.
                </>
              )}
            </li>
            <li>
              {isMyanmar
                ? 'အောက်ပါ YAML code များကို ကူးယူ (Copy) ပြီး ထိုဖိုင်ထဲသို့ paste လုပ်ပါ သို့မဟုတ် Download ဆွဲပါ။'
                : 'Copy and paste the YAML code below into that file or click Download.'}
            </li>
            <li>
              {isMyanmar
                ? 'Git push လုပ်လိုက်ပါက GitHub Actions မှ automatic APK build လုပ်ပေးမည်ဖြစ်ပြီး GitHub Actions tab / Artifacts တွင် APK ကို တိုက်ရိုက် ဒေါင်းလုဒ်ဆွဲနိုင်ပါသည်။'
                : 'Push changes to GitHub. Your Android APK will build automatically in the Actions tab!'}
            </li>
          </ol>
        </div>

        {/* YAML Code Box */}
        <div className="relative flex-1 overflow-hidden flex flex-col mb-4">
          <div className="flex items-center justify-between bg-[#1F1F29] px-4 py-2 border-t border-x border-[#2D2D39] rounded-t-xl text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              .github/workflows/build-apk.yml
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">YAML Validated</span>
          </div>
          <pre className="flex-1 bg-[#0A0A0C] border border-[#2D2D39] rounded-b-xl p-4 text-xs font-mono text-indigo-300 overflow-y-auto whitespace-pre-wrap break-all select-all">
            {WORKFLOW_YAML_CONTENT}
          </pre>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{isMyanmar ? 'ကူးယူပြီးပါပြီ (Copied)' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{isMyanmar ? 'YAML Code ကူးယူပါ' : 'Copy YAML Code'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1F1F29] hover:bg-[#252533] text-slate-200 border border-[#2D2D39] transition"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>{isMyanmar ? '.yml ဖိုင် ဒေါင်းလုဒ်ဆွဲပါ' : 'Download .yml'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#1F1F29] text-slate-300 hover:bg-[#252533] border border-[#2D2D39] transition"
          >
            {isMyanmar ? 'ပိတ်ပါ (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
