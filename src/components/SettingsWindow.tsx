import React, { useState } from 'react';
import { AptPackage } from '../types';
import { sound } from '../utils/audio';
import { Check, Download } from 'lucide-react';

interface SettingsWindowProps {
  currentWallpaper: string;
  onChangeWallpaper: (url: string) => void;
  packages: AptPackage[];
  onInstallPackage: (name: string) => boolean;
}

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  currentWallpaper,
  onChangeWallpaper,
  packages,
  onInstallPackage,
}) => {
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'packages' | 'about'>('wallpaper');

  const wallpapers = [
    {
      name: '열대 섬 (BearOS 기본 배경)',
      url: '/src/assets/images/tropical_island_desktop_1790586966168.jpg',
    },
    {
      name: '다크 사이버 슬레이트 (다크 테마)',
      url: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
    },
    {
      name: '우분투 레디언트 오버진',
      url: 'linear-gradient(135deg, #2c001e 0%, #77216f 50%, #5e2750 100%)',
    },
    {
      name: '칼리 미드나잇 블루',
      url: 'linear-gradient(135deg, #090d16 0%, #0f2b48 50%, #141c2b 100%)',
    },
  ];

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* 탭 헤더 */}
      <div className="h-10 px-4 bg-slate-900 border-b border-slate-800 flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            setActiveTab('wallpaper');
            sound.playKeypress();
          }}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'wallpaper' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          바탕화면 배경
        </button>
        <button
          onClick={() => {
            setActiveTab('packages');
            sound.playKeypress();
          }}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'packages' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          APT 패키지 관리자 ({packages.filter(p => p.installed).length}/{packages.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('about');
            sound.playKeypress();
          }}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'about' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          시스템 정보
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {activeTab === 'wallpaper' && (
          <div className="space-y-4 max-w-xl">
            <div>
              <h3 className="text-sm font-bold text-white">바탕화면 배경 선택</h3>
              <p className="text-xs text-slate-400">GNOME 데스크톱 환경의 배경 테마를 선택하세요.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {wallpapers.map((wp) => {
                const isSelected = currentWallpaper === wp.url;
                const isGradient = wp.url.startsWith('linear-gradient');
                return (
                  <div
                    key={wp.name}
                    onClick={() => {
                      onChangeWallpaper(wp.url);
                      sound.playKeypress();
                    }}
                    className={`relative p-2 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div 
                      className="w-full h-24 rounded-lg bg-cover bg-center mb-2 flex items-center justify-center"
                      style={{
                        backgroundImage: isGradient ? wp.url : `url('${wp.url}')`,
                        backgroundColor: '#0f172a'
                      }}
                    >
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-cyan-500 text-black flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-200 truncate">{wp.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-sm font-bold text-white">APT 패키지 목록</h3>
              <p className="text-xs text-slate-400">터미널 명령어 <code className="text-cyan-300 font-mono">sudo apt install &lt;패키지명&gt;</code> 또는 아래 버튼으로 설치할 수 있습니다.</p>
            </div>

            <div className="space-y-2">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{pkg.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">v{pkg.version} ({pkg.size})</span>
                    </div>
                    <p className="text-xs text-slate-400">{pkg.description}</p>
                    <div className="text-[10px] font-mono text-cyan-400">실행 바이너리: {pkg.executableName}</div>
                  </div>

                  <div>
                    {pkg.installed ? (
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-mono font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 설치됨
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onInstallPackage(pkg.name);
                          sound.playKeypress();
                        }}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Download className="w-3 h-3" /> 설치
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 max-w-lg text-xs">
            <h3 className="text-sm font-bold text-white">BearOS / Kali Linux 보안 제품군</h3>
            <p className="text-slate-300">HackHub: Bug Bounty 게임 및 BearOS 보안 분석 모의 침투 테스트 시뮬레이션 기반 시스템입니다.</p>
            <div className="space-y-1 font-mono text-[11px] text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>배포판: Kali GNU/Linux Rolling 2026.1</div>
              <div>데스크톱: GNOME 46 (우분투 하단 도크 레이아웃)</div>
              <div>커널: Linux 6.8.0-kali-amd64</div>
              <div>터미널 셸: /bin/bash (BearOS 커맨드 터미널 v1.0.93)</div>
              <div>메모리: 16.0 GB / 64.0 GB 사용 가능</div>
              <div>내부 IP: 192.168.1.2 (공인 IP: 34.216.0.124)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
