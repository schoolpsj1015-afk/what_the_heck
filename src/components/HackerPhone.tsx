import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Wallet, Phone as PhoneIcon, PhoneCall, PhoneOff,
  X, ChevronLeft, Wifi, BatteryCharging, Send, Lock, Unlock,
  ShieldCheck, ArrowUpRight, ArrowDownLeft, Clock, Delete
} from 'lucide-react';
import { PhoneMessage } from '../types';
import { sound } from '../utils/audio';

interface HackerPhoneProps {
  isOpen: boolean;
  onClose: () => void;
  messages: PhoneMessage[];
  walletBalance: number;
  onSendMessage?: (content: string) => void;
  onExecuteCommand?: (cmd: string) => void;
}

type PhoneScreenMode = 'lock' | 'home' | 'messages' | 'phone' | 'wallet';

interface CallLogItem {
  id: string;
  name: string;
  number: string;
  time: string;
  type: 'incoming' | 'outgoing' | 'missed';
  avatar: string;
}

const MOCK_CALL_LOGS: CallLogItem[] = [
  { id: 'call-1', name: '보안팀 관리자', number: '010-8891-2041', time: '오전 09:30', type: 'incoming', avatar: '🛡️' },
  { id: 'call-2', name: '시스템 센터', number: '02-1588-0000', time: '어제 18:20', type: 'outgoing', avatar: '⚙️' },
  { id: 'call-3', name: '안드레아', number: '010-4492-9910', time: '3일 전', type: 'missed', avatar: '👤' },
];

export const HackerPhone: React.FC<HackerPhoneProps> = ({
  isOpen,
  onClose,
  messages,
  walletBalance,
  onSendMessage,
}) => {
  const [screenMode, setScreenMode] = useState<PhoneScreenMode>('lock');
  const [activeChat, setActiveChat] = useState<PhoneMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Phone App states
  const [dialNumber, setDialNumber] = useState('');
  const [phoneTab, setPhoneTab] = useState<'keypad' | 'recents'>('keypad');
  const [activeCall, setActiveCall] = useState<{ name: string; number: string; seconds: number } | null>(null);

  // Call timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeCall) {
      timer = setInterval(() => {
        setActiveCall((prev) => prev ? { ...prev, seconds: prev.seconds + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall]);

  if (!isOpen) return null;

  const currentTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const currentDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  const unreadCount = messages.filter((m) => m.unread).length;

  const handleUnlock = () => {
    sound.playNotification();
    setScreenMode('home');
  };

  const handleLockPhone = () => {
    sound.playKeypress();
    setScreenMode('lock');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sound.playEnter();
    if (onSendMessage) onSendMessage(replyText);
    setReplyText('');
  };

  const handleDialKeyPress = (key: string) => {
    sound.playKeypress();
    if (dialNumber.length < 15) {
      setDialNumber((prev) => prev + key);
    }
  };

  const handleDialDelete = () => {
    sound.playKeypress();
    setDialNumber((prev) => prev.slice(0, -1));
  };

  const handleStartCall = (targetName?: string, targetNumber?: string) => {
    const num = targetNumber || dialNumber || '010-0000-0000';
    const name = targetName || (num === dialNumber && dialNumber ? dialNumber : '보안 전화를 받는 중...');
    sound.playNotification();
    setActiveCall({
      name,
      number: num,
      seconds: 0,
    });
  };

  const handleEndCall = () => {
    sound.playKeypress();
    setActiveCall(null);
  };

  const formatCallTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-14 right-4 z-40 w-72 sm:w-80 h-[520px] bg-black/95 border-2 border-slate-700/80 rounded-[38px] p-2.5 shadow-2xl shadow-cyan-950/40 flex flex-col overflow-hidden select-none animate-in slide-in-from-bottom-6 font-sans">
      {/* 폰 외부 베젤 및 다이내믹 노치 */}
      <div className="relative w-full h-full bg-slate-950 rounded-[30px] border border-slate-800 flex flex-col overflow-hidden">
        {/* 상단 노치 */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-cyan-600"></div>
          </div>
          <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* 상단 상태 표시줄 */}
        <div className="h-9 px-5 pt-2 bg-slate-950/90 flex items-center justify-between text-[11px] text-slate-300 font-mono shrink-0 z-20">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <button
              onClick={onClose}
              className="ml-1 text-slate-400 hover:text-white cursor-pointer"
              title="닫기"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 폰 화면 영역 */}
        <div className="flex-1 overflow-hidden flex flex-col relative bg-slate-950">
          {/* ==================== 1. 잠금화면 (Lock Screen) ==================== */}
          {screenMode === 'lock' && (
            <div 
              className="flex-1 flex flex-col justify-between p-5 text-center bg-cover bg-center relative"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(2, 6, 23, 0.95)), url('/src/assets/images/tropical_island_desktop_1790586966168.jpg')`,
              }}
            >
              {/* 시계 & 날짜 */}
              <div className="pt-6 space-y-1">
                <div className="text-4xl font-extrabold text-white tracking-tight font-mono">{currentTime}</div>
                <div className="text-xs text-cyan-300 font-medium">{currentDate}</div>
              </div>

              {/* 알림 카운트 카드 */}
              <div className="space-y-2 my-auto">
                {unreadCount > 0 ? (
                  <div className="p-3 bg-slate-900/90 border border-cyan-500/50 rounded-2xl text-left space-y-1 shadow-lg backdrop-blur">
                    <div className="flex items-center justify-between text-xs text-cyan-400 font-bold">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> 새 메시지
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">방금 전</span>
                    </div>
                    <div className="text-xs text-white font-semibold truncate">
                      {messages[0]?.sender}: {messages[0]?.content}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center justify-center gap-2 backdrop-blur">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>새로운 알림이 없습니다</span>
                  </div>
                )}
              </div>

              {/* 잠금 해제 버튼 */}
              <div className="pb-2 space-y-2">
                <button
                  onClick={handleUnlock}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Unlock className="w-4 h-4" />
                  <span>터치하여 잠금 해제</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== 2. 스마트폰 홈화면 (Home Screen) ==================== */}
          {screenMode === 'home' && (
            <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950">
              <div className="space-y-4 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                  스마트폰 앱
                </div>

                {/* 그리드 앱 아이콘 (메시지, 전화, 지갑) */}
                <div className="grid grid-cols-3 gap-4 px-2">
                  {/* 앱 1: 메시지 */}
                  <button
                    onClick={() => {
                      sound.playKeypress();
                      setScreenMode('messages');
                    }}
                    className="relative flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-7 h-7" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-950 shadow">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-200">메시지</span>
                  </button>

                  {/* 앱 2: 전화 */}
                  <button
                    onClick={() => {
                      sound.playKeypress();
                      setScreenMode('phone');
                    }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                      <PhoneIcon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">전화</span>
                  </button>

                  {/* 앱 3: 지갑 */}
                  <button
                    onClick={() => {
                      sound.playKeypress();
                      setScreenMode('wallet');
                    }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                      <Wallet className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">지갑</span>
                  </button>
                </div>
              </div>

              {/* 홈화면 상단 위젯 정보 */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>스마트폰 보안 상태</span>
                  <span className="text-emerald-400 font-mono">정상 연결</span>
                </div>
                <div className="text-white font-bold">BearOS 가상 모바일 2026</div>
                <div className="text-[10px] text-slate-400">메시지, 전화 통화, 자산 관리가 연동되어 있습니다.</div>
              </div>
            </div>
          )}

          {/* ==================== 3. 메시지 앱 (Messages) ==================== */}
          {screenMode === 'messages' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              {/* 상단 툴바 */}
              <div className="h-10 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                <button
                  onClick={() => {
                    if (activeChat) setActiveChat(null);
                    else setScreenMode('home');
                    sound.playKeypress();
                  }}
                  className="text-xs text-cyan-400 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" /> {activeChat ? '목록' : '홈'}
                </button>
                <div className="text-xs font-bold text-white truncate max-w-[150px]">
                  {activeChat ? `${activeChat.avatar} ${activeChat.sender}` : '메시지함'}
                </div>
                <span className="w-8"></span>
              </div>

              {/* 메시지 상세 또는 목록 */}
              {activeChat ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm text-xs text-slate-200 leading-relaxed shadow">
                      {activeChat.content}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono text-right">{activeChat.time}</div>
                  </div>

                  <form onSubmit={handleSendReply} className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 shrink-0">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="답장 작성..."
                      className="flex-1 h-8 px-3 rounded-full bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setActiveChat(msg);
                        sound.playKeypress();
                      }}
                      className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex items-start gap-2.5 cursor-pointer transition-colors"
                    >
                      <span className="text-xl p-1.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
                        {msg.avatar}
                      </span>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{msg.sender}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                        </div>
                        <p className="text-xs text-slate-300 truncate mt-0.5">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== 4. 전화 앱 (Phone Dialer & Calls) ==================== */}
          {screenMode === 'phone' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              {/* 상단 툴바 */}
              <div className="h-10 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                <button
                  onClick={() => {
                    setScreenMode('home');
                    sound.playKeypress();
                  }}
                  className="text-xs text-cyan-400 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" /> 홈
                </button>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <button
                    onClick={() => setPhoneTab('keypad')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                      phoneTab === 'keypad' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    키패드
                  </button>
                  <button
                    onClick={() => setPhoneTab('recents')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                      phoneTab === 'recents' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    최근 기록
                  </button>
                </div>
                <span className="w-6"></span>
              </div>

              {/* 통화 진행 중 화면 오버레이 */}
              {activeCall ? (
                <div className="flex-1 flex flex-col items-center justify-between p-6 bg-slate-950 text-white text-center">
                  <div className="pt-6 space-y-2">
                    <div className="w-20 h-20 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-4xl mx-auto shadow-xl animate-pulse">
                      📞
                    </div>
                    <div className="text-base font-bold text-white">{activeCall.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{activeCall.number}</div>
                    <div className="text-xs text-emerald-400 font-mono font-semibold pt-2">
                      통화 중... {formatCallTime(activeCall.seconds)}
                    </div>
                  </div>

                  <button
                    onClick={handleEndCall}
                    className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center mx-auto shadow-lg cursor-pointer transition-colors"
                    title="통화 종료"
                  >
                    <PhoneOff className="w-8 h-8" />
                  </button>
                </div>
              ) : phoneTab === 'keypad' ? (
                /* 키패드 화면 */
                <div className="flex-1 flex flex-col justify-between p-4">
                  {/* 전화번호 표시창 */}
                  <div className="h-12 bg-slate-900 border border-slate-800 rounded-xl px-3 flex items-center justify-between font-mono text-lg font-bold text-emerald-400">
                    <span className="truncate">{dialNumber || '번호를 입력하세요'}</span>
                    {dialNumber && (
                      <button onClick={handleDialDelete} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                        <Delete className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* 3x4 다이얼 숫자 버튼 */}
                  <div className="grid grid-cols-3 gap-2.5 my-auto">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                      <button
                        key={key}
                        onClick={() => handleDialKeyPress(key)}
                        className="h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-emerald-950 border border-slate-800 text-white font-mono text-lg font-bold flex items-center justify-center cursor-pointer transition-colors"
                      >
                        {key}
                      </button>
                    ))}
                  </div>

                  {/* 걸기 버튼 */}
                  <button
                    onClick={() => handleStartCall()}
                    disabled={!dialNumber}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>전화 걸기</span>
                  </button>
                </div>
              ) : (
                /* 최근 통화 기록 목록 */
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">최근 통화 기록</div>
                  {MOCK_CALL_LOGS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleStartCall(item.name, item.number)}
                      className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl p-1.5 bg-slate-950 rounded-xl border border-slate-800">{item.avatar}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{item.number}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                        <div className="text-emerald-400">
                          <PhoneCall className="w-4 h-4 ml-auto" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== 5. 지갑 앱 (Wallet) ==================== */}
          {screenMode === 'wallet' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              <div className="h-10 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                <button
                  onClick={() => {
                    setScreenMode('home');
                    sound.playKeypress();
                  }}
                  className="text-xs text-cyan-400 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" /> 홈
                </button>
                <div className="text-xs font-bold text-white">보안 지갑</div>
                <span className="w-6"></span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-4 bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-700/60 rounded-2xl space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-emerald-400">
                    <span>보안 계좌 보유 잔액</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    ${walletBalance.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">계좌 상태: 활성화 (Active)</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">최근 입출금 내역</div>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="text-white font-medium">시스템 테스트 보상금</div>
                        <div className="text-[10px] text-slate-400">입금 완료</div>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">+$25,000</span>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="text-white font-medium">기본 지원금</div>
                        <div className="text-[10px] text-slate-400">입금 완료</div>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">+$9,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 폰 하단 홈 바 (클릭 시 홈화면 또는 잠금화면으로 이동) */}
        <div 
          onClick={() => {
            sound.playKeypress();
            if (screenMode === 'lock') {
              setScreenMode('home');
            } else if (screenMode === 'home') {
              setScreenMode('lock');
            } else {
              setScreenMode('home');
            }
          }}
          className="h-5 bg-slate-950 border-t border-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-900 transition-colors shrink-0 z-20"
          title="홈 버튼 (클릭 시 홈 화면 이동)"
        >
          <div className="w-24 h-1 bg-slate-600 hover:bg-cyan-400 rounded-full transition-colors"></div>
        </div>
      </div>
    </div>
  );
};
