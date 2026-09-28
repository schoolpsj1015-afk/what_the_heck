import React from 'react';
import { WindowId } from '../types';
import { sound } from '../utils/audio';

interface DesktopIconsProps {
  onOpenWindow: (id: WindowId) => void;
  onOpenFileNote: (fileName: string) => void;
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({ onOpenWindow, onOpenFileNote }) => {
  const desktopApps: { id: WindowId; label: string; icon: string }[] = [
    { id: 'browser', label: 'Finefox', icon: '🍍🦊' },
    { id: 'terminal', label: '터미널', icon: '💻' },
    { id: 'handbook', label: '시스템 가이드', icon: '📖' },
    { id: 'wireshark', label: '와이어샤크', icon: '🦈' },
    { id: 'network-map', label: '네트워크 맵', icon: '🌐' },
    { id: 'code-editor', label: 'Code++', icon: '📝' },
    { id: 'settings', label: '환경설정', icon: '⚙️' },
  ];

  const desktopFiles = [
    { name: 'readme.txt', icon: '📝', label: 'readme.txt' },
    { name: 'test.txt', icon: '📄', label: 'test.txt' },
  ];

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 select-none">
      {desktopApps.map((app) => (
        <button
          key={app.id}
          onDoubleClick={() => {
            sound.playKeypress();
            onOpenWindow(app.id);
          }}
          onClick={() => sound.playKeypress()}
          className="w-20 p-2 rounded-xl hover:bg-white/10 active:bg-white/20 flex flex-col items-center text-center gap-1 group transition-all cursor-pointer focus:bg-cyan-500/20 focus:ring-1 focus:ring-cyan-400"
        >
          <span className="text-3xl filter drop-shadow group-hover:scale-110 transition-transform">
            {app.icon}
          </span>
          <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate max-w-full font-sans">
            {app.label}
          </span>
        </button>
      ))}

      {/* 바탕화면 파일들 */}
      <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
        {desktopFiles.map((f) => (
          <button
            key={f.name}
            onDoubleClick={() => {
              sound.playKeypress();
              onOpenFileNote(f.name);
            }}
            onClick={() => sound.playKeypress()}
            className="w-20 p-2 rounded-xl hover:bg-white/10 active:bg-white/20 flex flex-col items-center text-center gap-1 group transition-all cursor-pointer focus:bg-amber-500/20 focus:ring-1 focus:ring-amber-400"
          >
            <span className="text-2xl filter drop-shadow group-hover:scale-110 transition-transform">
              {f.icon}
            </span>
            <span className="text-[10px] font-mono text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate max-w-full">
              {f.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
