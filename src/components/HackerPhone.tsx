import React, { useState } from 'react';
import { 
  MessageSquare, Wallet, KeyRound, 
  X, ChevronDown, Wifi, BatteryCharging, Send, Copy, Check, ShieldCheck 
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

export const HackerPhone: React.FC<HackerPhoneProps> = ({
  isOpen,
  onClose,
  messages,
  walletBalance,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'wallet' | '2fa'>('messages');
  const [activeChat, setActiveChat] = useState<PhoneMessage | null>(messages[0] || null);
  const [replyText, setReplyText] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const currentTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sound.playEnter();
    if (onSendMessage) onSendMessage(replyText);
    setReplyText('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    sound.playNotification();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed bottom-14 right-4 z-40 w-72 sm:w-80 h-[520px] bg-black/95 border-2 border-slate-700/80 rounded-[38px] p-2.5 shadow-2xl shadow-cyan-950/40 flex flex-col overflow-hidden select-none animate-in slide-in-from-bottom-6">
      {/* 폰 외부 베젤 및 다이내믹 아일랜드 노치 */}
      <div className="relative w-full h-full bg-slate-950 rounded-[30px] border border-slate-800 flex flex-col overflow-hidden">
        {/* 상단 스피커 & 노치 */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-cyan-600"></div>
          </div>
          <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* 상태 표시줄 */}
        <div className="h-9 px-6 pt-2 bg-slate-950 flex items-center justify-between text-[11px] text-slate-300 font-mono shrink-0 z-20">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <button
              onClick={onClose}
              className="ml-1 text-slate-400 hover:text-white"
              title="폰 닫기"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 폰 내부 화면 콘텐츠 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 탭 1: 메시지함 */}
          {activeTab === 'messages' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {activeChat ? (
                // 1:1 대화 상세창
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="h-10 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                    <button
                      onClick={() => setActiveChat(null)}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" /> 목록
                    </button>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{activeChat.avatar}</span>
                      <span>{activeChat.sender}</span>
                    </div>
                    <span className="w-8"></span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    <div className="flex flex-col items-start gap-1">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm text-xs text-slate-200 max-w-[90%] leading-relaxed shadow">
                        {activeChat.content}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono ml-1">{activeChat.time}</span>
                    </div>

                    {/* 추가 메시지 목록 */}
                    {messages.filter(m => m.id !== activeChat.id).map(m => (
                      <div key={m.id} className="flex flex-col items-start gap-1">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 ml-1">
                          <span>{m.avatar}</span>
                          <span>{m.sender}</span>
                        </div>
                        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl rounded-tl-sm text-xs text-slate-200 max-w-[90%] leading-relaxed">
                          {m.content}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono ml-1">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* 답장 입력 폼 */}
                  <form onSubmit={handleSendReply} className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 shrink-0">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="메시지 입력..."
                      className="flex-1 h-8 px-3 rounded-full bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500 font-sans"
                    />
                    <button
                      type="submit"
                      className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center cursor-pointer shrink-0 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              ) : (
                // 메시지 목록 뷰
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    수신 메시지함
                  </div>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setActiveChat(msg);
                        sound.playKeypress();
                      }}
                      className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 flex items-start gap-2.5 cursor-pointer transition-colors"
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

          {/* 탭 2: 암호화폐 / 리워드 지갑 */}
          {activeTab === 'wallet' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div className="p-4 bg-gradient-to-br from-emerald-950/90 to-slate-900 border border-emerald-700/60 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span>보안 계좌 잔액</span>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  ${walletBalance.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  지갑 주소: 0x9fA2...e38B
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase">
                  최근 거래 내역
                </div>
                <div className="space-y-1.5">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-white font-medium">바운티 보상금 입금</div>
                      <div className="text-[10px] text-slate-400">에이펙스 클라우드</div>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">+$25,000</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-white font-medium">초기 보안 연구 지원금</div>
                      <div className="text-[10px] text-slate-400">시스템 시작 잔액</div>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">+$9,500</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 탭 3: 2단계 인증 (2FA Authenticator) */}
          {activeTab === '2fa' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase">
                일회용 OTP 보안 코드
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">인증 게이트웨이 OTP</span>
                  <span className="text-cyan-400 font-mono text-[10px]">23초 후 갱신</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black tracking-widest text-cyan-300 font-mono">
                    849 201
                  </span>
                  <button
                    onClick={() => copyToClipboard('849201')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    title="코드 복사"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">퍼스트 뱅크 마스터 인증키</span>
                  <span className="text-emerald-400 font-mono text-[10px]">상시 유효</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    ApexSec_Root_Master_Pass_2026!
                  </span>
                  <button
                    onClick={() => copyToClipboard('ApexSec_Root_Master_Pass_2026!')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    title="복사"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 내비게이션 바 */}
        <div className="h-12 bg-slate-950 border-t border-slate-800 flex items-center justify-around px-2 shrink-0 z-20">
          <button
            onClick={() => {
              setActiveTab('messages');
              sound.playKeypress();
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] cursor-pointer transition-colors ${
              activeTab === 'messages' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>메시지</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('wallet');
              sound.playKeypress();
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] cursor-pointer transition-colors ${
              activeTab === 'wallet' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>지갑</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('2fa');
              sound.playKeypress();
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] cursor-pointer transition-colors ${
              activeTab === '2fa' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>2FA OTP</span>
          </button>
        </div>

        {/* 홈 인디케이터 바 */}
        <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
          <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
