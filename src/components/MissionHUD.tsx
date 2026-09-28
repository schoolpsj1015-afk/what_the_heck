import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Pin, HelpCircle, CheckCircle2, Circle, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { Mission, MissionObjective } from '../types';
import { sound } from '../utils/audio';

interface MissionHUDProps {
  mission: Mission;
  onExecuteCommand: (cmd: string) => void;
  onOpenHandbook: () => void;
  onToggleObjective: (id: string) => void;
}

export const MissionHUD: React.FC<MissionHUDProps> = ({
  mission,
  onExecuteCommand,
  onOpenHandbook,
  onToggleObjective,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [pinned, setPinned] = useState(true);

  const completedCount = mission.objectives.filter(o => o.completed).length;
  const totalCount = mission.objectives.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className={`fixed top-4 right-4 z-40 w-80 md:w-96 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl transition-all duration-200 select-none ${
      collapsed ? 'h-auto' : 'max-h-[82vh]'
    }`}>
      {/* HUD Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 rounded-t-xl">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <h2 className="text-xs font-bold text-slate-100 tracking-wide truncate">
            {mission.title}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sound.playKeypress();
              onOpenHandbook();
            }}
            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
            title="핸드북 가이드 열기"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playKeypress();
              setPinned(!pinned);
            }}
            className={`p-1 rounded transition-colors ${pinned ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-white'}`}
            title={pinned ? '상단 고정됨' : '고정 해제'}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playKeypress();
              setCollapsed(!collapsed);
            }}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title={collapsed ? '목표 펼치기' : '목표 접기'}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress mini bar */}
      <div className="w-full bg-slate-900 h-1 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {!collapsed && (
        <div className="p-3 overflow-y-auto max-h-[70vh] space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
            <span className="font-mono text-cyan-300">진행도: {completedCount}/{totalCount} 완료</span>
            <span className="text-slate-400 font-mono">{progressPercent}%</span>
          </div>

          <div className="space-y-2">
            {mission.objectives.map((obj: MissionObjective) => {
              return (
                <div
                  key={obj.id}
                  className={`p-2.5 rounded-lg border transition-all ${
                    obj.completed
                      ? 'bg-slate-900/60 border-emerald-900/40 text-slate-300'
                      : 'bg-slate-900/90 border-slate-800 text-slate-100 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => {
                        onToggleObjective(obj.id);
                        if (!obj.completed) sound.playObjectiveComplete();
                        else sound.playKeypress();
                      }}
                      className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-400 transition-colors"
                      title={obj.completed ? '미완료로 변경' : '완료로 표시'}
                    >
                      {obj.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1.5">
                      <p className={`leading-relaxed text-[11.5px] ${obj.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {obj.title}
                      </p>

                      {obj.hint && (
                        <p className="text-[10.5px] text-amber-300/90 italic">
                          힌트: {obj.hint}
                        </p>
                      )}

                      {obj.shortcutCommand && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <button
                            onClick={() => {
                              sound.playKeypress();
                              onExecuteCommand(obj.shortcutCommand!);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-950 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600/60 text-cyan-300 rounded font-mono text-[10.5px] transition-all group cursor-pointer"
                            title="클릭하여 터미널에서 즉시 실행"
                          >
                            <TerminalIcon className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                            <span className="truncate max-w-[200px]">{obj.shortcutCommand}</span>
                          </button>
                          <span className="text-[10px] text-slate-400">클릭 시 자동 실행</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <button
              onClick={() => {
                sound.playKeypress();
                onOpenHandbook();
              }}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" /> 핸드북 치트시트 열기
            </button>
            <span className="font-mono text-slate-400">단축키: Ctrl+Alt+T 터미널</span>
          </div>
        </div>
      )}
    </div>
  );
};
