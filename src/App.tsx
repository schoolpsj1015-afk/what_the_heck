import React, { useState, useEffect } from 'react';
import { 
  AppWindow, WindowId, AptPackage, BugBountyProgram, 
  VulnerabilityReport, Mission, PhoneMessage, NetworkNode 
} from './types';
import { 
  INITIAL_APT_PACKAGES, INITIAL_MISSIONS, INITIAL_PROGRAMS, 
  INITIAL_REPORTS, INITIAL_NETWORK_NODES, INITIAL_MESSAGES 
} from './data/mockData';
import { sound } from './utils/audio';

// Components
import { LoginScreen } from './components/LoginScreen';
import { Taskbar } from './components/Taskbar';
import { WindowFrame } from './components/WindowFrame';
import { BrowserWindow } from './components/BrowserWindow';
import { TerminalWindow } from './components/TerminalWindow';
import { HackhubPortalWindow } from './components/HackhubPortalWindow';
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
    isOpen: true,
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
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    x: 50,
    y: 110,
    width: 680,
    height: 460,
  },
  {
    id: 'hackhub',
    title: 'HackHub - 버그바운티 관리 및 실시간 분석 포털',
    icon: '🔥',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    x: 120,
    y: 50,
    width: 860,
    height: 540,
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
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('browser');
  const [topZIndex, setTopZIndex] = useState(20);

  // System & Game States
  const [packages, setPackages] = useState<AptPackage[]>(INITIAL_APT_PACKAGES);
  const [mission, setMission] = useState<Mission>(INITIAL_MISSIONS[0]);
  const [programs] = useState<BugBountyProgram[]>(INITIAL_PROGRAMS);
  const [reports, setReports] = useState<VulnerabilityReport[]>(INITIAL_REPORTS);
  const [networkNodes] = useState<NetworkNode[]>(INITIAL_NETWORK_NODES);
  const [phoneMessages, setPhoneMessages] = useState<PhoneMessage[]>(INITIAL_MESSAGES);
  const [walletBalance, setWalletBalance] = useState(34500);

  // Floating Overlays
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wallpaper, setWallpaper] = useState('/src/assets/images/tropical_island_desktop_1790586966168.jpg');

  // Terminal & Virtual Keyboard Interop
  const [externalCommand, setExternalCommand] = useState<string | null>(null);
  const [virtualKeyInput, setVirtualKeyInput] = useState<string | null>(null);

  // 모바일 환경 자동 감지하여 가상 키보드 활성화
  useEffect(() => {
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    if (isMobile) {
      setIsKeyboardOpen(true);
    }
  }, []);

  // 사운드 동기화
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

  // 터미널로 명령어 실행 연동
  const handleExecuteInTerminal = (cmd: string) => {
    openWindow('terminal');
    setExternalCommand(cmd);
    sound.playEnter();
  };

  // 미션 목표 토글
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

  // sudo apt install 패키지 설치
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

  // 버그바운티 취약점 보고서 제출 처리
  const handleSubmitReport = (
    newRep: Omit<VulnerabilityReport, 'id' | 'submittedAt' | 'status' | 'bountyEarned'>
  ) => {
    const bountyPayout = newRep.severity === 'Critical' 
      ? 25000 
      : newRep.severity === 'High' 
      ? 12000 
      : 5000;

    const createdReport: VulnerabilityReport = {
      ...newRep,
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Rewarded',
      bountyEarned: bountyPayout,
      submittedAt: '방금 전',
    };

    setReports((prev) => [createdReport, ...prev]);
    setWalletBalance((prev) => prev + bountyPayout);

    // 폰 알림 메시지 추가
    const alertMsg: PhoneMessage = {
      id: `msg-${Date.now()}`,
      sender: 'HackHub 보상금 지급 알림',
      avatar: '💰',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `[바운티 지급 완료] 보고서 ${createdReport.id} (${createdReport.title}) 검증이 완료되어 상금 $${bountyPayout.toLocaleString()}이 지갑으로 즉시 입금되었습니다!`,
      unread: true,
    };
    setPhoneMessages((prev) => [alertMsg, ...prev]);
  };

  // 바탕화면 파일 더블클릭 핸들러
  const handleOpenFileNote = (_fileName: string) => {
    openWindow('code-editor');
  };

  // 로그인 전이면 Kali/GNOME Display Manager 로그인 화면 렌더링
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
      {/* 바탕화면 가독성 조절용 오버레이 */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* 바탕화면 바로가기 아이콘 (Finefox, 터미널, 와이어샤크, HackHub, 가이드 등) */}
      <DesktopIcons
        onOpenWindow={openWindow}
        onOpenFileNote={handleOpenFileNote}
      />

      {/* 우측 상단 도움말 HUD (요청 사항: "오른쪽 상단 창에 도움말 표시하는것도 그대로 만들어주고") */}
      <MissionHUD
        mission={mission}
        onExecuteCommand={handleExecuteInTerminal}
        onOpenHandbook={() => openWindow('handbook')}
        onToggleObjective={handleToggleObjective}
      />

      {/* 창 0: Finefox 웹 브라우저 (요청: 파인애플 여우 아이콘, Geogle, BCC 뉴스, 은행, 호텔) */}
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

      {/* 창 3: HackHub 버그바운티 관리 및 실시간 분석 포털 */}
      {windows.find((w) => w.id === 'hackhub')?.isOpen && (
        <WindowFrame
          window={windows.find((w) => w.id === 'hackhub')!}
          onClose={() => closeWindow('hackhub')}
          onMinimize={() => minimizeWindow('hackhub')}
          onMaximize={() => maximizeWindow('hackhub')}
          onFocus={() => focusWindow('hackhub')}
          onUpdatePosition={(x, y) => updateWindowPosition('hackhub', x, y)}
        >
          <HackhubPortalWindow
            programs={programs}
            reports={reports}
            walletBalance={walletBalance}
            onSubmitReport={handleSubmitReport}
          />
        </WindowFrame>
      )}

      {/* 창 4: 와이어샤크 패킷 스니퍼 창 */}
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

      {/* 창 5: 네트워크 맵 토폴로지 창 */}
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

      {/* 창 6: Code++ 스크립트 및 메모 편집기 */}
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

      {/* 창 7: 시스템 설정 및 테마 */}
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

      {/* 오른쪽 하단 스마트폰 (요청 사항: "Phone도 오른쪽 아래에 추가") */}
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

      {/* 가상 쿼티(QWERTY) 키보드 (모바일 대응 및 숫자키 열 탑재) */}
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
        onLockScreen={() => setIsLoggedIn(false)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />
    </div>
  );
}
