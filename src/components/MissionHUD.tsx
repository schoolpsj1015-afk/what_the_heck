import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Pin, HelpCircle, CheckCircle2, 
  Circle, Lock, Terminal as TerminalIcon, Sparkles, BookOpen 
} from 'lucide-react';
import { MissionChapter, MissionObjective } from '../types';
import { sound } from '../utils/audio';

interface MissionHUDProps {
  chapters: MissionChapter[];
  onExecuteCommand: (cmd: string) => void;
  onOpenHandbook: () => void;
}

export const MissionHUD: React.FC<MissionHUDProps> = ({
  chapters,
  onExecuteCommand,
  onOpenHandbook,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [pinned, setPinned] = useState(true);

  // Compute total objectives & completed count
  const allObjectives = chapters.flatMap((c) => c.objectives);
  const completedCount = allObjectives.filter((o) => o.completed).length;
  const totalCount = allObjectives.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={`fixed top-4 right-4 z-40 w-80 md:w-96 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl transition-all duration-200 select-none ${
      collapsed ? 'h-auto' : 'max-h-[82vh]'
    }`}>
      {/* HUD Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/95 border-b border-slate-800 rounded-t-2xl">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <h2 className="text-xs font-bold text-slate-100 tracking-wide truncate flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>스토리 퀘스트 & 팁</span>
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sound.playKeypress();
              onOpenHandbook();
            }}
            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="가이드 치트시트 열기"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playKeypress();
              setPinned(!pinned);
            }}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${pinned ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-white'}`}
            title={pinned ? '고정됨' : '고정 해제'}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playKeypress();
              setCollapsed(!collapsed);
            }}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={collapsed ? '펼치기' : '접기'}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress mini bar */}
      <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {!collapsed && (
        <div className="p-3 overflow-y-auto max-h-[70vh] space-y-4 text-xs font-sans">
          {/* 진행률 숫치 정보 */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <span className="font-mono text-cyan-300 font-bold">퀘스트 완료도: {completedCount}/{totalCount}</span>
            <span className="text-emerald-400 font-mono font-bold">{progressPercent}%</span>
          </div>

          {/* 챕터별 스토리 퀘스트 목록 */}
          <div className="space-y-4">
            {chapters.map((chapter) => {
              const chapterObjectives = chapter.objectives;

              return (
                <div key={chapter.chapterId} className="space-y-2">
                  {/* 1. 2. 3.... 대제목 */}
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-mono font-bold text-[11px] border border-cyan-800/60">
                      {chapter.chapterId}.
                    </span>
                    <h3 className="text-xs font-bold text-white tracking-wide">
                      {chapter.title}
                    </h3>
                  </div>

                  {/* -1. -2. -3... 소제목 목록 */}
                  <div className="space-y-1.5 pl-1">
                    {chapterObjectives.map((obj, idx) => {
                      // 순차적 잠금 해제 체크 logic:
                      // If obj.alwaysShow is true (* mark in request), always show!
                      // If it's the 1st step of the chapter, show!
                      // Otherwise, show if previous step in same chapter is completed!
                      const prevObj = idx > 0 ? chapterObjectives[idx - 1] : null;
                      const isUnlocked = obj.alwaysShow || idx === 0 || (prevObj && prevObj.completed);

                      if (!isUnlocked) {
                        return null; // Locked/hidden step
                      }

                      return (
                        <div
                          key={obj.id}
                          className={`p-2.5 rounded-xl border transition-all ${
                            obj.completed
                              ? 'bg-emerald-950/30 border-emerald-800/50 text-slate-300'
                              : 'bg-slate-900/90 border-slate-800 text-slate-100 hover:border-cyan-800/60'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {/* 자동 업데이트 상태 아이콘 (수동 클릭 O 아이콘 삭제됨!) */}
                            <div className="mt-0.5 shrink-0">
                              {obj.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                              ) : (
                                <Circle className="w-4 h-4 text-cyan-400 animate-pulse" />
                              )}
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] text-slate-400 font-bold">
                                  -{obj.stepNumber}.
                                </span>
                                <span className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded ${
                                  obj.completed 
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                    : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                }`}>
                                  {obj.completed ? '완료' : '진행 중'}
                                </span>
                              </div>

                              <p className={`leading-relaxed text-[11px] font-medium ${
                                obj.completed ? 'line-through text-slate-400' : 'text-slate-100'
                              }`}>
                                {obj.title}
                              </p>

                              {obj.shortcutCommand && !obj.completed && (
                                <div className="pt-1">
                                  <button
                                    onClick={() => {
                                      sound.playKeypress();
                                      onExecuteCommand(obj.shortcutCommand!);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-950 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600 text-cyan-300 rounded-lg font-mono text-[10.5px] transition-all cursor-pointer group"
                                    title="클릭하여 터미널 명령어 입력"
                                  >
                                    <TerminalIcon className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <span>{obj.shortcutCommand}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <button
              onClick={() => {
                sound.playKeypress();
                onOpenHandbook();
              }}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> 가이드 상세 보기
            </button>
            <span className="font-mono text-slate-500">자동 진행 퀘스트</span>
          </div>
        </div>
      )}
    </div>
  );
};
