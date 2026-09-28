import React, { useRef, useState, useEffect } from 'react';
import { Minus, Square, X, RotateCcw } from 'lucide-react';
import { AppWindow } from '../types';
import { sound } from '../utils/audio';

interface WindowFrameProps {
  window: AppWindow;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; winX: number; winY: number }>({
    mouseX: 0,
    mouseY: 0,
    winX: win.x,
    winY: win.y,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag from title bar, not window buttons
    if ((e.target as HTMLElement).closest('button')) return;
    if (win.isMaximized) return;

    onFocus();
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: win.x,
      winY: win.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || win.isMaximized) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    const newX = Math.max(10, Math.min(window.innerWidth - 100, dragStartRef.current.winX + dx));
    const newY = Math.max(20, Math.min(window.innerHeight - 100, dragStartRef.current.winY + dy));
    onUpdatePosition(newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  if (!win.isOpen || win.isMinimized) return null;

  return (
    <div
      onMouseDown={onFocus}
      onTouchStart={onFocus}
      style={{
        zIndex: win.zIndex,
        left: win.isMaximized ? 0 : `${win.x}px`,
        top: win.isMaximized ? 0 : `${win.y}px`,
        width: win.isMaximized ? '100vw' : `${win.width}px`,
        height: win.isMaximized ? 'calc(100vh - 48px)' : `${win.height}px`,
      }}
      className={`fixed flex flex-col rounded-t-xl rounded-b-lg border border-slate-700/80 shadow-2xl backdrop-blur-md overflow-hidden bg-slate-900 transition-[width,height,transform] duration-150 select-none ${
        win.isMaximized ? 'rounded-none border-x-0 border-t-0' : ''
      }`}
    >
      {/* GNOME / Ubuntu Header Bar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={onMaximize}
        className="h-9 px-3.5 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between cursor-move select-none shrink-0"
      >
        {/* Title & App Icon */}
        <div className="flex items-center gap-2 truncate">
          <span className="text-base select-none">{win.icon}</span>
          <span className="text-xs font-semibold text-slate-200 truncate font-mono">
            {win.title}
          </span>
        </div>

        {/* Window controls (Ubuntu/GNOME Style) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playKeypress();
              onMinimize();
            }}
            className="w-5 h-5 rounded-full bg-slate-800 hover:bg-amber-600/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playKeypress();
              onMaximize();
            }}
            className="w-5 h-5 rounded-full bg-slate-800 hover:bg-emerald-600/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title={win.isMaximized ? 'Restore' : 'Maximize'}
          >
            {win.isMaximized ? <RotateCcw className="w-2.5 h-2.5" /> : <Square className="w-2.5 h-2.5" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playKeypress();
              onClose();
            }}
            className="w-5 h-5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Body Container */}
      <div className="flex-1 w-full h-full overflow-hidden bg-slate-950/90 text-slate-100 flex flex-col">
        {children}
      </div>
    </div>
  );
};
