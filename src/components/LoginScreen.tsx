import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('kali');
  const [password, setPassword] = useState('kali');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playEnter();
    if (username.trim().toLowerCase() === 'kali' && password === 'kali') {
      setError(false);
      setLoading(true);
      setTimeout(() => {
        sound.playNotification();
        onLogin();
      }, 600);
    } else {
      setError(true);
      sound.playError();
    }
  };

  const fillDefaultCredentials = () => {
    setUsername('kali');
    setPassword('kali');
    setError(false);
    sound.playKeypress();
  };

  const currentTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('ko-KR', { weekday: 'short', month: 'long', day: 'numeric' });

  return (
    <div 
      className="relative w-screen h-screen flex flex-col justify-between items-center text-white bg-cover bg-center select-none"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('/src/assets/images/tropical_island_desktop_1790586966168.jpg')`,
        backgroundColor: '#0f172a'
      }}
    >
      {/* Top GDM Status Bar */}
      <div className="w-full flex items-center justify-between px-6 py-2 bg-black/40 backdrop-blur-md border-b border-white/10 text-xs font-medium tracking-wide">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-300">칼리 리눅스 2026.1 / GNOME 46</span>
        </div>
        <div className="text-slate-200 font-mono">
          {currentDate} {currentTime}
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span className="text-emerald-400 font-mono">eth0: 192.168.1.2</span>
          <span>⚡ 100%</span>
        </div>
      </div>

      {/* Center Login Modal */}
      <div className="w-full max-w-sm px-6 py-8 my-auto bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl flex flex-col items-center">
        {/* Kali Avatar */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-1 shadow-lg ring-4 ring-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
              <span className="text-4xl">🐉</span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-slate-900" title="시스템 준비 완료">
            <UserCheck className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mb-1">Kali Linux</h1>
        <p className="text-xs text-slate-400 mb-6 font-sans">보안 및 버그 바운티 침투 테스트 환경</p>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              사용자 이름 (Username)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                sound.playKeypress();
              }}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              placeholder="kali"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              비밀번호 (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  sound.playKeypress();
                }}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                placeholder="kali"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>인증 실패! 기본 계정 정보는: <b>kali</b> / <b>kali</b> 입니다</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] text-white font-medium py-2.5 rounded-lg shadow-lg shadow-cyan-900/30 transition-all cursor-pointer text-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                키링 복호화 및 세션 로딩 중...
              </span>
            ) : (
              <>
                <span>BearOS 로그인</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 w-full flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={fillDefaultCredentials}
            type="button"
            className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Lock className="w-3 h-3" /> 기본 계정 자동 입력 (kali / kali)
          </button>
          <span>커널 6.8.0-kali</span>
        </div>
      </div>

      {/* Bottom hint info */}
      <div className="pb-6 text-center text-xs text-slate-400">
        기본 로그인 자격 증명: 사용자 이름 <code className="text-cyan-300 bg-slate-900/60 px-1.5 py-0.5 rounded">kali</code> · 비밀번호 <code className="text-cyan-300 bg-slate-900/60 px-1.5 py-0.5 rounded">kali</code>
      </div>
    </div>
  );
};
