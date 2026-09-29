import React, { useState, useEffect } from 'react';
import { Power, AlertTriangle } from 'lucide-react';
import { 
  AppWindow, WindowId, AptPackage, 
  Mission, PhoneMessage, NetworkNode 
} from './types';
import { 
  INITIAL_APT_PACKAGES, INITIAL_MISSIONS, 
  INITIAL_NETWORK_NODES, INITIAL_MESSAGES 
} from './data/mockData';
import { sound } from './utils/audio';

// Components
import { LoginScreen } from './components/LoginScreen';
import { Taskbar } from './components/Taskbar';
import { WindowFrame } from './components/WindowFrame';
import { BrowserWindow } from './components/BrowserWindow';
import { TerminalWindow } from './components/TerminalWindow';
import { HandbookWindow } from './components/HandbookWindow';
import { WiresharkWindow } from './components/WiresharkWindow';
import { NetworkMapWindow } from './components/NetworkMapWindow';
import { CodeEditorWindow } from './components/CodeEditorWindow';
import { SettingsWindow } from './components/SettingsWindow';
import { MissionHUD } from './components/MissionHUD';
import { HackerPhone } from './components/HackerPhone';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { DesktopIcons } from './components/DesktopIcons';

const DEFAULT_WINDOWS: AppWindow[] = [
  {
    id: 'browser',
    title: 'Finefox - 웹 브라우저',
    icon: '🍍🦊',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    x: 140,
    y: 35,
    width: 840,
    height: 540,
  },
  {
    id: 'terminal',
    title: '터미널 - BearOS / Kali Linux',
    icon: '💻',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    x: 50,
    y: 110,
    width: 680,
    height: 460,
  },
  {
    id: 'handbook',
    title: '시스템 가이드 - BearOS 사용 안내',
    icon: '📖',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    x: 240,
    y: 60,
    width: 720,
    height: 440,
  },
  {
    id: 'wireshark',
    title: '와이어샤크 - 네트워크 패킷 분석기',
    icon: '🦈',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    x: 80,
    y: 90,
    width: 760,
    height: 460,
  },
  {
    id: 'network-map',
    title: '네트워크 맵 - 서브넷 토폴로지',
    icon: '🌐',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    x: 100,
    y: 70,
    width: 800,
    height: 480,
  },
  {
    id: 'code-editor',
    title: 'Code++ - 스크립트 편집기',
    icon: '📝',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 4,
    x: 160,
    y: 80,
    width: 700,
    height: 460,
  },
  {
    id: 'settings',
    title: '환경설정 - 데스크톱 및 패키지 관리',
    icon: '⚙️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 3,
    x: 200,
    y: 100,
    width: 650,
    height: 450,
  },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [windows, setWindows] = useState<AppWindow[]>(DEFAULT_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>(null);
  const [topZIndex, setTopZIndex] = useState(20);

  // System & Game States
  const [packages, setPackages] = useState<AptPackage[]>(INITIAL_APT_PACKAGES);
  const [mission, setMission] = useState<Mission>(INITIAL_MISSIONS[0]);
  const [networkNodes] = useState<NetworkNode[]>(INITIAL_NETWORK_NODES);
  const [phoneMessages, setPhoneMessages] = useState<PhoneMessage[]>(INITIAL_MESSAGES);
  const [walletBalance] = useState(34500);

  // Floating Overlays
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wallpaper, setWallpaper] = useState('/src/assets/images/tropical_island_desktop_1790586966168.jpg');

  // Logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Terminal & Virtual Keyboard Interop
  const [externalCommand, setExternalCommand] = useState<string | null>(null);
  const [virtualKeyInput, setVirtualKeyInput] = useState<string | null>(null);

  // Auto detect mobile to toggle virtual keyboard
  useEffect(() => {
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    if (isMobile) {
      setIsKeyboardOpen(true);
    }
  }, []);

  // Sound sync
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  // Window Management
  const focusWindow = (id: WindowId) => {
    setTopZIndex((prev) => prev + 1);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, zIndex: topZIndex + 1, isMinimized: false }
          : w
      )
    );
  };

  const openWindow = (id: WindowId) => {
    setTopZIndex((prev) => prev + 1);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isOpen: true, isMinimized: false, zIndex: topZIndex + 1 }
          : w
      )
    );
  };

  const closeWindow = (id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  };

  const toggleWindow = (id: WindowId) => {
    const target = windows.find((w) => w.id === id);
    if (!target || !target.isOpen) {
      openWindow(id);
    } else if (target.isMinimized) {
      focusWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const updateWindowPosition = (id: WindowId, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  };

  // Execute terminal command
  const handleExecuteInTerminal = (cmd: string) => {
    openWindow('terminal');
    setExternalCommand(cmd);
    sound.playEnter();
  };

  // Toggle mission objective
  const handleToggleObjective = (objId: string) => {
    setMission((prev) => ({
      ...prev,
      objectives: prev.objectives.map((o) =>
        o.id === objId ? { ...o, completed: !o.completed } : o
      ),
    }));
  };

  const handleObjectiveComplete = (objId: string) => {
    setMission((prev) => ({
      ...prev,
      objectives: prev.objectives.map((o) =>
        o.id === objId && !o.completed ? { ...o, completed: true } : o
      ),
    }));
  };

  // sudo apt install package
  const handleInstallPackage = (name: string): boolean => {
    const normalized = name.toLowerCase().trim();
    const pkg = packages.find(
      (p) =>
        p.name.toLowerCase() === normalized ||
        p.executableName.toLowerCase() === normalized
    );

    if (pkg) {
      setPackages((prev) =>
        prev.map((p) => (p.name === pkg.name ? { ...p, installed: true } : p))
      );
      sound.playNotification();
      return true;
    }
    return false;
  };

  // Handle Logout Confirmation
  const handleConfirmLogout = () => {
    sound.playNotification();
    setShowLogoutModal(false);
    setWindows(DEFAULT_WINDOWS);
    setIsPhoneOpen(false);
    setIsLoggedIn(false);
  };

  // Desktop File double click
  const handleOpenFileNote = (_fileName: string) => {
    openWindow('code-editor');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const isGradientWallpaper = wallpaper.startsWith('linear-gradient');

  return (
    <div
      className="relative w-screen h-screen overflow-hidden text-slate-100 select-none bg-cover bg-center font-sans"
      style={{
        backgroundImage: isGradientWallpaper ? wallpaper : `url('${wallpaper}')`,
        backgroundColor: '#0f172a',
      }}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* 바탕화면 아이콘 */}
      <DesktopIcons
        onOpenWindow={openWindow}
        onOpenFileNote={handleOpenFileNote}
      />

      {/* 우측 상단 도움말 HUD */}
      <MissionHUD
        mission={mission}
        onExecuteCommand={handleExecuteInTerminal}
        onOpenHandbook={() => openWindow('handbook')}
        onToggleObjective={handleToggleObjective}
      />

      {/* 창 0: Finefox 웹 브라우저 */}
      {windows.find((w) => w.id === 'browser')?.isOpen && (
        <WindowFrame
          window={windows.find((w) => w.id === 'browser')!}
          onClose={() => closeWindow('browser')}
          onMinimize={() => minimizeWindow('browser')}
          onMaximize={() => maximizeWindow('browser')}
          onFocus={() => focusWindow('browser')}
          onUpdatePosition={(x, y) => updateWindowPosition('browser', x, y)}
        >
          <BrowserWindow />
        </WindowFrame>
      )}

      {/* 창 1: BearOS / Kali 기본 터미널 */}
      {windows.find((w) => w.id === 'terminal')?.isOpen && (
        <WindowFrame
          window={windows.find((w) => w.id === 'terminal')!}
          onClose={() => closeWindow('terminal')}
          onMinimize={() => minimizeWindow('terminal')}
          onMaximize={() => maximizeWindow('terminal')}
          onFocus={() => focusWindow('terminal')}
          onUpdatePosition={(x, y) => updateWindowPosition('terminal', x, y)}
        >
          <TerminalWindow
            installedPackages={packages}
            onInstallPackage={handleInstallPackage}
            onObjectiveComplete={handleObjectiveComplete}
            externalCommand={externalCommand}
            onClearExternalCommand={() => setExternalCommand(null)}
            virtualKeyInput={virtualKeyInput}
            onClearVirtualKey={() => setVirtualKeyInput(null)}
          />
        </WindowFrame>
      )}

      {/* 창 2: 시스템 가이드 창 */}
      {windows.find((w) => w.id === 'handbook')?.isOpen && (
        <WindowFrame
          window={windows.find((w) => w.id === 'handbook')!}
          onClose={() => closeWindow('handbook')}
          onMinimize={() => minimizeWindow('handbook')}
          onMaximize={() => maximizeWindow('handbook')}
          onFocus={() => focusWindow('handbook')}
          onUpdatePosition={(x, y) => updateWindowPosition('handbook', x, y)}
        >
          <HandbookWindow onExecuteCommand={handleExecuteInTerminal} />
        </WindowFrame>
      )}

      {/* 창 3: 와이어샤크 패킷 스니퍼 창 */}
      {windows.find((w) => w.id === 'wireshark')?.isOpen && (
        <WindowFrame
          window={windows.find((w) => w.id === 'wireshark')!}
          onClose={() => closeWindow('wireshark')}
          onMinimize={() => minimizeWindow('wireshark')}
          onMaximize={() => maximizeWindow('wireshark')}
          onFocus={() => focusWindow('wireshark')}
          onUpdatePosition={(x, y) => updateWindowPosition('wireshark', x, y)}
        >
          <WiresharkWindow onExecuteCommand={handleExecuteInTerminal} />
        </WindowFrame>
      )}

      {/* 창 4: 네트워크 맵 토폴로지 창 */}
      {windows.find((w) => w.id === 'network-map')?.isOpen && (
        <WindowFrame
          window={windows.find((w) => w.id === 'network-map')!}
          onClose={() => closeWindow('network-map')}
          onMinimize={() => minimizeWindow('network-map')}
          onMaximize={() => maximizeWindow('network-map')}
          onFocus={() => focusWindow('network-map')}
          onUpdatePosition={(x, y) => updateWindowPosition('network-map', x, y)}
        >
          <NetworkMapWindow
            nodes={networkNodes}
            onExecuteCommand={handleExecuteInTerminal}
          />
        </WindowFrame>
      )}

      {/* 창 5: Code++ 스크립트 및 메모 편집기 */}
      {windows.find((w) => w.id === 'code-editor')?.isOpen && (
        <WindowFrame
          window={windows.find((w) => w.id === 'code-editor')!}
          onClose={() => closeWindow('code-editor')}
          onMinimize={() => minimizeWindow('code-editor')}
          onMaximize={() => maximizeWindow('code-editor')}
          onFocus={() => focusWindow('code-editor')}
          onUpdatePosition={(x, y) => updateWindowPosition('code-editor', x, y)}
        >
          <CodeEditorWindow onExecuteCommand={handleExecuteInTerminal} />
        </WindowFrame>
      )}

      {/* 창 6: 시스템 설정 및 테마 */}
      {windows.find((w) => w.id === 'settings')?.isOpen && (
        <WindowFrame
          window={windows.find((w) => w.id === 'settings')!}
          onClose={() => closeWindow('settings')}
          onMinimize={() => minimizeWindow('settings')}
          onMaximize={() => maximizeWindow('settings')}
          onFocus={() => focusWindow('settings')}
          onUpdatePosition={(x, y) => updateWindowPosition('settings', x, y)}
        >
          <SettingsWindow
            currentWallpaper={wallpaper}
            onChangeWallpaper={setWallpaper}
            packages={packages}
            onInstallPackage={handleInstallPackage}
          />
        </WindowFrame>
      )}

      {/* 오른쪽 하단 스마트폰 */}
      <HackerPhone
        isOpen={isPhoneOpen}
        onClose={() => setIsPhoneOpen(false)}
        messages={phoneMessages}
        walletBalance={walletBalance}
        onExecuteCommand={handleExecuteInTerminal}
        onSendMessage={(txt) => {
          const newMsg: PhoneMessage = {
            id: `msg-${Date.now()}`,
            sender: '나 (kali)',
            avatar: '🐉',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content: txt,
            unread: false,
          };
          setPhoneMessages((prev) => [...prev, newMsg]);
        }}
      />

      {/* 가상 쿼티(QWERTY) 키보드 */}
      <VirtualKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onKeyPress={(char) => setVirtualKeyInput(char)}
        onBackspace={() => setVirtualKeyInput('\b')}
        onEnter={() => setVirtualKeyInput('\n')}
        onTab={() => setVirtualKeyInput('\t')}
        onClear={() => setVirtualKeyInput('')}
      />

      {/* 우분투 기반 하단 작업표시줄 */}
      <Taskbar
        windows={windows}
        onToggleWindow={toggleWindow}
        onOpenWindow={openWindow}
        activeWindowId={activeWindowId}
        isKeyboardOpen={isKeyboardOpen}
        onToggleKeyboard={() => setIsKeyboardOpen(!isKeyboardOpen)}
        isPhoneOpen={isPhoneOpen}
        onTogglePhone={() => setIsPhoneOpen(!isPhoneOpen)}
        unreadMessageCount={phoneMessages.filter((m) => m.unread).length}
        onRequestLogout={() => setShowLogoutModal(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* 전원 버튼 로그아웃 확인 팝업 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-rose-600/80 rounded-2xl p-6 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-950 border border-rose-600/60 flex items-center justify-center mx-auto text-rose-400">
              <Power className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">로그아웃 하시겠습니까?</h3>
              <p className="text-xs font-semibold text-rose-300 leading-relaxed bg-rose-950/70 border border-rose-900/60 p-3 rounded-xl">
                로그아웃 하시겠습니까? 모든 데이터가 날아갑니다!
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg transition-colors cursor-pointer"
              >
                예
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
