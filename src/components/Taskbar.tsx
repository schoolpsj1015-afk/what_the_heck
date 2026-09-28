import React, { useState } from 'react';
import { 
  Keyboard as KeyboardIcon, Smartphone, Volume2, VolumeX, Wifi, 
  Power
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
  onLockScreen: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

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
  onLockScreen,
  soundEnabled,
  onToggleSound,
}) => {
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('ko-KR', { weekday: 'short', month: 'short', day: 'numeric' });

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
                onClick={onLockScreen}
                className="px-3 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Power className="w-3.5 h-3.5" /> 화면 잠금
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
          <div className="text-[10px] text-slate-500">BearOS 보안 시간 동기화: 활성화됨</div>
        </div>
      )}

      {/* 우분투 하단 도크 / 작업표시줄 (요청 사항) */}
      <footer className="fixed bottom-0 left-0 right-0 h-11 bg-black/85 backdrop-blur-md border-t border-slate-800/90 z-50 flex items-center justify-between px-2 sm:px-3 text-slate-200 select-none">
        {/* 좌측: 앱 런처 및 실행 중인 창 아이콘 */}
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

          {/* 실행 중 및 고정된 창 버튼 */}
          {windows.map((win) => {
            const isRunning = win.isOpen;
            const isActive = win.isOpen && !win.isMinimized && activeWindowId === win.id;

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
                    : isRunning
                    ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    : 'hover:bg-slate-900/80 text-slate-400 opacity-70 hover:opacity-100'
                }`}
                title={win.title}
              >
                <span className="text-sm">{win.icon}</span>
                <span className="text-xs font-medium hidden lg:inline max-w-[120px] truncate font-mono">
                  {win.title}
                </span>

                {/* 실행 표시 점 */}
                {isRunning && (
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-slate-400'
                  }`} />
                )}
              </button>
            );
          })}
        </div>

        {/* 우측 섹션: 가상 키보드 토글, 해커폰 토글, 사운드, 네트워크, 시계 */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 가상 쿼티 키보드 토글 (모바일 & 터치 환경 필수) */}
          <button
            onClick={() => {
              onToggleKeyboard();
              sound.playKeypress();
            }}
            className={`h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer border ${
              isKeyboardOpen
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="숫자키 포함 가상 쿼티(QWERTY) 키보드 토글"
          >
            <KeyboardIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">가상 키보드</span>
          </button>

          {/* 우하단 스마트폰 토글 */}
          <button
            onClick={() => {
              onTogglePhone();
              sound.playKeypress();
            }}
            className={`relative h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer border ${
              isPhoneOpen
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="스마트폰 열기"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">스마트폰</span>
            {unreadMessageCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          {/* 사운드 토글 */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playKeypress();
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
            title={soundEnabled ? '음소거' : '소리 켜기'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* 네트워크 eth0 정보 */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
            <Wifi className="w-3 h-3" />
            <span>192.168.1.2</span>
          </div>

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

          {/* 화면 잠금 버튼 */}
          <button
            onClick={onLockScreen}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 border border-slate-800 transition-colors cursor-pointer"
            title="Kali Linux 화면 잠금"
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </>
  );
};
