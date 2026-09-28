import React, { useState } from 'react';
import { Delete, CornerDownLeft, ChevronDown, Keyboard as KeyboardIcon, Space } from 'lucide-react';
import { sound } from '../utils/audio';

interface VirtualKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onClear?: () => void;
  onTab?: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  isOpen,
  onClose,
  onKeyPress,
  onBackspace,
  onEnter,
  onClear,
  onTab,
}) => {
  const [shift, setShift] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  if (!isOpen) return null;

  const isUppercase = shift || capsLock;

  const numberRow = [
    { normal: '1', shift: '!' },
    { normal: '2', shift: '@' },
    { normal: '3', shift: '#' },
    { normal: '4', shift: '$' },
    { normal: '5', shift: '%' },
    { normal: '6', shift: '^' },
    { normal: '7', shift: '&' },
    { normal: '8', shift: '*' },
    { normal: '9', shift: '(' },
    { normal: '0', shift: ')' },
    { normal: '-', shift: '_' },
    { normal: '=', shift: '+' },
  ];

  const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '/'];
  const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"];
  const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-'];

  const handleKeyClick = (val: string) => {
    sound.playKeypress();
    onKeyPress(val);
    if (shift && !capsLock) {
      setShift(false);
    }
  };

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[9999] w-[98vw] max-w-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl transition-all animate-in slide-in-from-bottom-5">
      {/* Keyboard Header bar */}
      <div className="flex items-center justify-between px-3 py-1 mb-2 border-b border-slate-800 text-xs text-slate-300 font-mono">
        <div className="flex items-center gap-2">
          <KeyboardIcon className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white">BearOS 가상 터미널 키보드</span>
          <span className="text-[10px] bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-700">영문 쿼티 (QWERTY)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCapsLock(!capsLock);
              sound.playKeypress();
            }}
            className={`px-2 py-0.5 text-[11px] rounded transition-colors ${capsLock ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            CAPS
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="키보드 닫기"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1.5 select-none touch-manipulation">
        {/* Number row (Top row as requested) */}
        <div className="flex gap-1 justify-center">
          <button
            onClick={() => handleKeyClick('`')}
            className="flex-1 h-9 max-w-[42px] bg-slate-800/90 active:bg-cyan-600 active:text-white text-slate-200 text-xs font-mono font-semibold rounded hover:bg-slate-700 flex items-center justify-center border border-slate-700/60 shadow-sm"
          >
            {shift ? '~' : '`'}
          </button>
          {numberRow.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleKeyClick(shift ? item.shift : item.normal)}
              className="flex-1 h-9 max-w-[48px] bg-slate-800/90 active:bg-cyan-600 active:text-white text-slate-200 text-xs font-mono font-semibold rounded hover:bg-slate-700 flex flex-col items-center justify-center border border-slate-700/60 shadow-sm transition-transform active:scale-95"
            >
              <span className="text-[9px] text-slate-400 leading-none">{item.shift}</span>
              <span className="leading-none text-white">{item.normal}</span>
            </button>
          ))}
          <button
            onClick={() => {
              sound.playKeypress();
              onBackspace();
            }}
            className="px-2.5 h-9 bg-slate-800/90 active:bg-rose-600 text-slate-200 text-xs font-mono rounded hover:bg-slate-700 flex items-center justify-center gap-1 border border-slate-700/60 shadow-sm"
            title="백스페이스"
          >
            <Delete className="w-4 h-4 text-rose-400" />
          </button>
        </div>

        {/* Row 1: QWERTY */}
        <div className="flex gap-1 justify-center">
          <button
            onClick={() => {
              sound.playKeypress();
              if (onTab) onTab();
              else handleKeyClick('\t');
            }}
            className="px-2.5 h-9 bg-slate-800/90 active:bg-cyan-600 text-slate-300 text-xs font-mono rounded hover:bg-slate-700 flex items-center justify-center border border-slate-700/60 shadow-sm"
          >
            Tab
          </button>
          {row1.map((char) => {
            const display = isUppercase ? char.toUpperCase() : char;
            return (
              <button
                key={char}
                onClick={() => handleKeyClick(display)}
                className="flex-1 h-9 max-w-[50px] bg-slate-800/90 active:bg-cyan-600 active:text-white text-slate-100 text-sm font-mono font-medium rounded hover:bg-slate-700 flex items-center justify-center border border-slate-700/60 shadow-sm transition-transform active:scale-95"
              >
                {display}
              </button>
            );
          })}
        </div>

        {/* Row 2: ASDFGHJKL */}
        <div className="flex gap-1 justify-center">
          {row2.map((char) => {
            const display = isUppercase ? char.toUpperCase() : char;
            return (
              <button
                key={char}
                onClick={() => handleKeyClick(display)}
                className="flex-1 h-9 max-w-[54px] bg-slate-800/90 active:bg-cyan-600 active:text-white text-slate-100 text-sm font-mono font-medium rounded hover:bg-slate-700 flex items-center justify-center border border-slate-700/60 shadow-sm transition-transform active:scale-95"
              >
                {display}
              </button>
            );
          })}
          <button
            onClick={() => {
              sound.playEnter();
              onEnter();
            }}
            className="flex-1 px-3 h-9 bg-emerald-700 active:bg-emerald-600 text-white text-xs font-mono font-semibold rounded hover:bg-emerald-600 flex items-center justify-center gap-1 border border-emerald-500/50 shadow-sm"
          >
            <CornerDownLeft className="w-3.5 h-3.5" /> Enter
          </button>
        </div>

        {/* Row 3: ZXCVBNM */}
        <div className="flex gap-1 justify-center">
          <button
            onClick={() => {
              setShift(!shift);
              sound.playKeypress();
            }}
            className={`px-3 h-9 text-xs font-mono rounded flex items-center justify-center border transition-all ${
              shift ? 'bg-cyan-500 text-black font-bold border-cyan-400' : 'bg-slate-800/90 text-slate-200 border-slate-700/60 hover:bg-slate-700'
            }`}
          >
            ⇧ Shift
          </button>
          {row3.map((char) => {
            const display = isUppercase ? char.toUpperCase() : char;
            return (
              <button
                key={char}
                onClick={() => handleKeyClick(display)}
                className="flex-1 h-9 max-w-[54px] bg-slate-800/90 active:bg-cyan-600 active:text-white text-slate-100 text-sm font-mono font-medium rounded hover:bg-slate-700 flex items-center justify-center border border-slate-700/60 shadow-sm transition-transform active:scale-95"
              >
                {display}
              </button>
            );
          })}
          <button
            onClick={() => handleKeyClick(':')}
            className="w-8 h-9 bg-slate-800/90 text-slate-200 text-xs font-mono rounded hover:bg-slate-700 flex items-center justify-center border border-slate-700/60"
          >
            :
          </button>
          <button
            onClick={() => handleKeyClick('_')}
            className="w-8 h-9 bg-slate-800/90 text-slate-200 text-xs font-mono rounded hover:bg-slate-700 flex items-center justify-center border border-slate-700/60"
          >
            _
          </button>
        </div>

        {/* Row 4: Controls & Spacebar */}
        <div className="flex gap-1.5 justify-center mt-0.5">
          <button
            onClick={() => handleKeyClick('sudo ')}
            className="px-2.5 h-9 bg-amber-600/30 text-amber-300 hover:bg-amber-600/50 text-xs font-mono rounded border border-amber-500/40"
          >
            sudo
          </button>
          <button
            onClick={() => handleKeyClick('apt ')}
            className="px-2 h-9 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-mono rounded border border-slate-700"
          >
            apt
          </button>
          <button
            onClick={() => handleKeyClick('python3 ')}
            className="px-2 h-9 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-mono rounded border border-slate-700"
          >
            python3
          </button>
          <button
            onClick={() => handleKeyClick(' ')}
            className="flex-1 max-w-sm h-9 bg-slate-700/80 active:bg-cyan-600 text-slate-200 text-xs font-mono rounded hover:bg-slate-600 flex items-center justify-center gap-1 border border-slate-600 shadow-sm transition-all"
          >
            <Space className="w-4 h-4 opacity-50" /> 스페이스
          </button>
          {onClear && (
            <button
              onClick={() => {
                sound.playKeypress();
                onClear();
              }}
              className="px-2.5 h-9 bg-slate-800 text-rose-300 hover:bg-rose-900/30 text-xs font-mono rounded border border-slate-700"
            >
              초기화
            </button>
          )}
          <button
            onClick={() => handleKeyClick('165.61.40.95')}
            className="px-2 h-9 bg-cyan-950/80 text-cyan-300 hover:bg-cyan-900 text-[11px] font-mono rounded border border-cyan-800/60"
            title="타겟 방화벽 IP 붙여넣기"
          >
            [타겟 IP]
          </button>
        </div>
      </div>
    </div>
  );
};
