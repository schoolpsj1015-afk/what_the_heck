import React, { useState } from 'react';
import { 
  Keyboard as KeyboardIcon, Smartphone, Volume2, VolumeX, Wifi, 
  Power, Check, Lock, ShieldCheck
} from 'lucide-react';
import { AppWindow, WindowId } from '../types';
import { sound } from '../utils/audio';

interface TaskbarProps {
  windows: AppWindow[];
  onToggleWindow: (id: WindowId) => void;
  onOpenWindow: (id: WindowId) => void;
  activeWindowId: WindowId | null;
  isKeyboardOpen: boolean;
  onToggleKeyboard: () => void;
  isPhoneOpen: boolean;
  onTogglePhone: () => void;
  unreadMessageCount: number;
  onRequestLogout: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  hotspotEnabled?: boolean;
  onConnectNetwork?: (ssid: string) => void;
}

interface WifiNetwork {
  id: string;
  ssid: string;
  signal: string;
  secured: boolean;
  connected: boolean;
}

const INITIAL_WIFI_NETWORKS: WifiNetwork[] = [
  { id: 'wifi-1', ssid: 'BearOS-WiFi-5G', signal: '100%', secured: true, connected: true },
  { id: 'wifi-2', ssid: 'KT_GiGA_Mesh_9A2', signal: '90%', secured: true, connected: false },
  { id: 'wifi-3', ssid: 'SK_WiFi_GIGA_Secure', signal: '85%', secured: true, connected: false },
  { id: 'wifi-4', ssid: 'Free_Public_WiFi', signal: '70%', secured: false, connected: false },
  { id: 'wifi-5', ssid: 'AndroidHotspot_981', signal: '50%', secured: true, connected: false },
];

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  onToggleWindow,
  onOpenWindow,
  activeWindowId,
  isKeyboardOpen,
  onToggleKeyboard,
  isPhoneOpen,
  onTogglePhone,
  unreadMessageCount,
  onRequestLogout,
  soundEnabled,
  onToggleSound,
  hotspotEnabled = false,
  onConnectNetwork,
}) => {
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWifiMenuOpen, setIsWifiMenuOpen] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [wifiNetworks, setWifiNetworks] = useState<WifiNetwork[]>(INITIAL_WIFI_NETWORKS);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('ko-KR', { weekday: 'short', month: 'short', day: 'numeric' });

  // Only show windows that are currently OPEN
  const openWindows = windows.filter((win) => win.isOpen);

  const handleConnectWifi = (id: string, ssid?: string) => {
    sound.playNotification();
    setWifiNetworks((prev) =>
      prev.map((net) => ({
        ...net,
        connected: net.id === id,
      }))
    );
    if (onConnectNetwork && ssid) {
      onConnectNetwork(ssid);
    }
  };

  const displayNetworks = [...wifiNetworks];
  if (hotspotEnabled && !displayNetworks.some((n) => n.id === 'hotspot')) {
    displayNetworks.unshift({
      id: 'hotspot',
      ssid: 'Smartphone-Hotspot',
      signal: '100%',
      secured: false,
      connected: false,
    });
  }

  return (
    <>
      {/* GNOME 애플리케이션 런처 오버레이 모달 */}
      {isAppMenuOpen && (
        <div 
          onClick={() => setIsAppMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-6 mb-12 sm:mb-0"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-lg">
                  🐉
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Kali Linux & BearOS 응용프로그램</h3>
                  <p className="text-[11px] text-slate-400">GNOME 46 시스템 테스트 및 바운티 운영체제</p>
                </div>
              </div>
              <button
                onClick={() => setIsAppMenuOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                ✕ 닫기
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {windows.map((win) => (
                <button
                  key={win.id}
                  onClick={() => {
                    onOpenWindow(win.id);
                    setIsAppMenuOpen(false);
                    sound.playKeypress();
                  }}
                  className="p-3.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 rounded-xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{win.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300">{win.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {win.isOpen ? (win.isMinimized ? '최소화됨' : '실행 중') : '앱 실행'}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>사용자: <b className="text-white">kali</b></span>
              </div>
              <button
                onClick={() => {
                  setIsAppMenuOpen(false);
                  onRequestLogout();
                }}
                className="px-3 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Power className="w-3.5 h-3.5" /> 로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 날짜 및 시간 팝오버 */}
      {isCalendarOpen && (
        <div 
          onClick={() => setIsCalendarOpen(false)}
          className="fixed bottom-12 right-20 z-50 bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-2xl text-xs space-y-2 font-mono"
        >
          <div className="text-cyan-400 font-bold">{currentDate}</div>
          <div className="text-slate-300">{currentTime} KST</div>
          <div className="text-[10px] text-slate-500">BearOS 시간 동기화 완료</div>
        </div>
      )}

      {/* Wi-Fi 설정 우측 하단 팝오버 */}
      {isWifiMenuOpen && (
        <div 
          className="fixed bottom-12 right-12 z-50 w-72 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl space-y-3 text-xs select-none animate-in slide-in-from-bottom-2"
        >
          {/* 헤더 & 토글 */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Wifi className={`w-4 h-4 ${wifiEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="font-bold text-white">Wi-Fi 설정</span>
            </div>
            <button
              onClick={() => {
                setWifiEnabled(!wifiEnabled);
                sound.playKeypress();
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                wifiEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {wifiEnabled ? '켜짐' : '꺼짐'}
            </button>
          </div>

          {/* Wi-Fi 목록 */}
          {wifiEnabled ? (
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">사용 가능한 네트워크</div>
              {displayNetworks.map((net) => (
                <button
                  key={net.id}
                  onClick={() => handleConnectWifi(net.id, net.ssid)}
                  className={`w-full p-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer text-left ${
                    net.connected
                      ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                      : 'bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Wifi className={`w-3.5 h-3.5 ${net.connected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1">
                        <span>{net.ssid}</span>
                        {net.secured && <Lock className="w-3 h-3 text-slate-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400">신호 {net.signal}</span>
                    </div>
                  </div>
                  {net.connected && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-950 rounded-xl text-center text-slate-400 text-xs">
              Wi-Fi가 비활성화되어 있습니다.
            </div>
          )}
        </div>
      )}

      {/* 우분투 하단 작업표시줄 */}
      <footer className="fixed bottom-0 left-0 right-0 h-11 bg-black/85 backdrop-blur-md border-t border-slate-800/90 z-50 flex items-center justify-between px-2 sm:px-3 text-slate-200 select-none">
        {/* 좌측: 앱 런처 및 실행 중인 창(isOpen인 창만) 아이콘 표기 */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {/* 우분투/Kali 메인 앱 런처 버튼 */}
          <button
            onClick={() => {
              setIsAppMenuOpen(!isAppMenuOpen);
              sound.playKeypress();
            }}
            className="h-8 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-800 shrink-0"
            title="응용프로그램 메뉴"
          >
            <span className="text-sm">🐉</span>
            <span className="text-xs font-semibold hidden md:inline">앱</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 mx-1 shrink-0"></div>

          {/* 떠있는(isOpen: true) 창만 표기 */}
          {openWindows.map((win) => {
            const isActive = !win.isMinimized && activeWindowId === win.id;

            return (
              <button
                key={win.id}
                onClick={() => {
                  onToggleWindow(win.id);
                  sound.playKeypress();
                }}
                className={`relative h-8 px-2.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-800/60'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
                title={win.title}
              >
                <span className="text-sm">{win.icon}</span>
                <span className="text-xs font-medium hidden lg:inline max-w-[120px] truncate font-mono">
                  {win.title}
                </span>

                {/* 실행 표시 점 */}
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-slate-400'
                }`} />
              </button>
            );
          })}
        </div>

        {/* 우측 섹션: 가상 키보드(아이콘만), 스마트폰(아이콘만), 사운드, Wi-Fi(아이콘만), 시계, 로그아웃 */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 가상 키보드 토글 버튼 (아이콘 전용) */}
          <button
            onClick={() => {
              onToggleKeyboard();
              sound.playKeypress();
            }}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
              isKeyboardOpen
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="가상 키보드 토글"
          >
            <KeyboardIcon className="w-4 h-4" />
          </button>

          {/* 스마트폰 토글 버튼 (아이콘 전용) */}
          <button
            onClick={() => {
              onTogglePhone();
              sound.playKeypress();
            }}
            className={`relative h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
              isPhoneOpen
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="스마트폰 토글"
          >
            <Smartphone className="w-4 h-4" />
            {unreadMessageCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          {/* 사운드 토글 */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playKeypress();
            }}
            className="h-8 w-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center cursor-pointer"
            title={soundEnabled ? '음소거' : '소리 켜기'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Wi-Fi 설정 버튼 (아이콘만) */}
          <button
            onClick={() => {
              setIsWifiMenuOpen(!isWifiMenuOpen);
              sound.playKeypress();
            }}
            className={`h-8 w-8 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
              isWifiMenuOpen
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Wi-Fi 네트워크 설정"
          >
            <Wifi className="w-4 h-4 text-emerald-400" />
          </button>

          {/* 시계 & 캘린더 팝오버 토글 */}
          <button
            onClick={() => {
              setIsCalendarOpen(!isCalendarOpen);
              sound.playKeypress();
            }}
            className="h-8 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-800 cursor-pointer"
          >
            <span className="hidden sm:inline">{currentDate}</span>
            <span className="text-white font-bold">{currentTime}</span>
          </button>

          {/* 전원 버튼 (클릭 시 로그아웃 확인 팝업) */}
          <button
            onClick={() => {
              sound.playKeypress();
              onRequestLogout();
            }}
            className="h-8 w-8 rounded-lg bg-slate-900 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="전원 / 로그아웃"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </>
  );
};
