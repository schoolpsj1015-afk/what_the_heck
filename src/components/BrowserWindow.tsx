import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, RotateCw, Home, Search, Lock, 
  ExternalLink, Bookmark, CheckCircle2, Send, Building2, 
  Globe, Newspaper, CreditCard, Sparkles, Star, Calendar, Users
} from 'lucide-react';
import { sound } from '../utils/audio';

interface BrowserWindowProps {
  onOpenWindow?: (id: any) => void;
  onExecuteCommand?: (cmd: string) => void;
}

type WebSiteId = 'geogle' | 'bcc' | 'bank' | 'hotel' | 'results';

export const BrowserWindow: React.FC<BrowserWindowProps> = () => {
  const [currentUrl, setCurrentUrl] = useState('https://www.geogle.com');
  const [inputUrl, setInputUrl] = useState('https://www.geogle.com');
  const [activeSite, setActiveSite] = useState<WebSiteId>('geogle');
  const [history, setHistory] = useState<WebSiteId[]>(['geogle']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Geogle Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  // Bank Transfer state
  const [transferTarget, setTransferTarget] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  // Hotel Booking state
  const [bookedRoom, setBookedRoom] = useState<string | null>(null);

  const navigateTo = (site: WebSiteId, url: string) => {
    sound.playKeypress();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(site);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setActiveSite(site);
    setCurrentUrl(url);
    setInputUrl(url);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      sound.playKeypress();
      const prevIdx = historyIndex - 1;
      const prevSite = history[prevIdx];
      setHistoryIndex(prevIdx);
      setActiveSite(prevSite);
      const urlMap: Record<WebSiteId, string> = {
        geogle: 'https://www.geogle.com',
        bcc: 'https://www.bcc.co.uk/news',
        bank: 'https://online.fincorp-bank.com',
        hotel: 'https://booking.grandocean.com',
        results: `https://www.geogle.com/search?q=${encodeURIComponent(submittedQuery)}`,
      };
      setCurrentUrl(urlMap[prevSite]);
      setInputUrl(urlMap[prevSite]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      sound.playKeypress();
      const nextIdx = historyIndex + 1;
      const nextSite = history[nextIdx];
      setHistoryIndex(nextIdx);
      setActiveSite(nextSite);
      const urlMap: Record<WebSiteId, string> = {
        geogle: 'https://www.geogle.com',
        bcc: 'https://www.bcc.co.uk/news',
        bank: 'https://online.fincorp-bank.com',
        hotel: 'https://booking.grandocean.com',
        results: `https://www.geogle.com/search?q=${encodeURIComponent(submittedQuery)}`,
      };
      setCurrentUrl(urlMap[nextSite]);
      setInputUrl(urlMap[nextSite]);
    }
  };

  const handleRefresh = () => {
    sound.playNotification();
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playEnter();
    const clean = inputUrl.toLowerCase().trim();
    if (clean.includes('geogle') || clean.includes('google')) {
      navigateTo('geogle', 'https://www.geogle.com');
    } else if (clean.includes('bcc') || clean.includes('news')) {
      navigateTo('bcc', 'https://www.bcc.co.uk/news');
    } else if (clean.includes('bank') || clean.includes('fincorp')) {
      navigateTo('bank', 'https://online.fincorp-bank.com');
    } else if (clean.includes('hotel') || clean.includes('grandocean') || clean.includes('ocean')) {
      navigateTo('hotel', 'https://booking.grandocean.com');
    } else {
      // Default to geogle search
      setSubmittedQuery(inputUrl);
      navigateTo('results', `https://www.geogle.com/search?q=${encodeURIComponent(inputUrl)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    sound.playEnter();
    setSubmittedQuery(searchQuery);
    navigateTo('results', `https://www.geogle.com/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTarget || !transferAmount) return;
    sound.playNotification();
    setTransferSuccess(`${transferTarget} 계좌로 $${Number(transferAmount).toLocaleString()} 송금이 완료되었습니다.`);
    setTransferTarget('');
    setTransferAmount('');
    setTimeout(() => setTransferSuccess(null), 4000);
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* 브라우저 상단 탭 바 */}
      <div className="h-9 px-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 shrink-0 select-none">
        <div className="h-7 px-3 rounded-t-lg bg-slate-950 border-t-2 border-amber-500 text-xs font-semibold text-amber-300 flex items-center gap-2 max-w-[200px] truncate shadow-sm">
          <span className="text-sm">🍍🦊</span>
          <span className="truncate">
            {activeSite === 'geogle' && 'Geogle 검색'}
            {activeSite === 'bcc' && 'BCC 뉴스 속보'}
            {activeSite === 'bank' && '퍼스트 온라인 뱅킹'}
            {activeSite === 'hotel' && '그랜드 오션 리조트 & 호텔'}
            {activeSite === 'results' && `${submittedQuery} - Geogle 검색`}
          </span>
        </div>
      </div>

      {/* 브라우저 컨트롤 & 주소창 */}
      <div className="h-10 px-3 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 cursor-pointer"
            title="뒤로 가기"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 cursor-pointer"
            title="앞으로 가기"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
            title="새로고침"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigateTo('geogle', 'https://www.geogle.com')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
            title="홈으로 이동"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* URL 입력창 */}
        <form onSubmit={handleUrlSubmit} className="flex-1">
          <div className="h-7 px-3 bg-slate-950 border border-slate-700/80 rounded-full flex items-center gap-2 text-xs focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-500/20">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-slate-200 font-mono text-xs"
              placeholder="URL을 입력하거나 검색어를 입력하세요"
            />
          </div>
        </form>
      </div>

      {/* 브라우저 즐겨찾기 북마크 바 */}
      <div className="h-7 px-3 bg-slate-900 border-b border-slate-800 flex items-center gap-3 text-[11px] overflow-x-auto shrink-0 select-none">
        <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
          <Bookmark className="w-3 h-3 text-amber-400" /> 북마크:
        </span>
        <button
          onClick={() => navigateTo('geogle', 'https://www.geogle.com')}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors shrink-0 ${
            activeSite === 'geogle' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Search className="w-3 h-3 text-blue-400" /> Geogle
        </button>
        <button
          onClick={() => navigateTo('bcc', 'https://www.bcc.co.uk/news')}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors shrink-0 ${
            activeSite === 'bcc' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Newspaper className="w-3 h-3 text-rose-500" /> BCC 뉴스
        </button>
        <button
          onClick={() => navigateTo('bank', 'https://online.fincorp-bank.com')}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors shrink-0 ${
            activeSite === 'bank' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <CreditCard className="w-3 h-3 text-emerald-400" /> 온라인 뱅크
        </button>
        <button
          onClick={() => navigateTo('hotel', 'https://booking.grandocean.com')}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors shrink-0 ${
            activeSite === 'hotel' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Building2 className="w-3 h-3 text-amber-400" /> 그랜드 호텔
        </button>
      </div>

      {/* 웹 페이지 뷰어 영역 */}
      <div className="flex-1 overflow-y-auto bg-slate-900 select-text">
        {/* ==================== 1. GEOGLE 검색엔진 ==================== */}
        {activeSite === 'geogle' && (
          <div className="min-h-full flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100">
            <div className="w-full max-w-xl flex flex-col items-center space-y-6">
              {/* Geogle 로고 */}
              <div className="text-5xl sm:text-6xl font-black tracking-tight select-none flex items-center font-sans">
                <span className="text-blue-500">G</span>
                <span className="text-rose-500">e</span>
                <span className="text-amber-400">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-emerald-500">l</span>
                <span className="text-rose-500">e</span>
              </div>

              {/* 검색창 */}
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Geogle 검색 또는 URL 입력"
                    className="w-full h-11 pl-11 pr-4 bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-cyan-400 rounded-full text-sm text-white outline-none shadow-lg transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-center gap-3 mt-5">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-sm"
                  >
                    Geogle 검색
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigateTo('bcc', 'https://www.bcc.co.uk/news');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-sm"
                  >
                    운 좋은 예감 (I'm Feeling Lucky)
                  </button>
                </div>
              </form>

              {/* 추천 바로가기 키워드 */}
              <div className="w-full pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
                <span>인기 검색어:</span>
                {[
                  { text: 'BCC 뉴스 최신 속보', site: 'bcc', url: 'https://www.bcc.co.uk/news' },
                  { text: '퍼스트 뱅크 계좌 송금', site: 'bank', url: 'https://online.fincorp-bank.com' },
                  { text: '그랜드 오션 호텔 객실 예약', site: 'hotel', url: 'https://booking.grandocean.com' },
                  { text: '우분투 기본 명령어 가이드', site: 'results', url: 'https://www.geogle.com/search?q=ubuntu' },
                ].map((item) => (
                  <button
                    key={item.text}
                    onClick={() => {
                      if (item.site === 'results') {
                        setSubmittedQuery(item.text);
                        navigateTo('results', item.url);
                      } else {
                        navigateTo(item.site as WebSiteId, item.url);
                      }
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 rounded-full border border-slate-800 text-[11px] cursor-pointer"
                  >
                    {item.text}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 text-center">
                Geogle 서비스 제공 언어: <span className="text-cyan-400 hover:underline cursor-pointer">한국어</span>, <span className="text-cyan-400 hover:underline cursor-pointer">English</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 1-1. GEOGLE 검색 결과 페이지 ==================== */}
        {activeSite === 'results' && (
          <div className="min-h-full p-4 sm:p-6 max-w-4xl mx-auto space-y-5 bg-slate-950 text-slate-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div 
                onClick={() => navigateTo('geogle', 'https://www.geogle.com')}
                className="text-2xl font-black tracking-tight cursor-pointer"
              >
                <span className="text-blue-500">G</span>
                <span className="text-rose-500">e</span>
                <span className="text-amber-400">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-emerald-500">l</span>
                <span className="text-rose-500">e</span>
              </div>
              <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg">
                <input
                  type="text"
                  value={searchQuery || submittedQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 px-4 bg-slate-900 border border-slate-700 rounded-full text-xs text-white outline-none"
                />
              </form>
            </div>

            <div className="text-xs text-slate-400">
              "{submittedQuery}" 검색 결과 약 842,000개 (0.28초)
            </div>

            <div className="space-y-6">
              {/* 결과 1 */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-mono">https://www.bcc.co.uk/news</div>
                <h3 
                  onClick={() => navigateTo('bcc', 'https://www.bcc.co.uk/news')}
                  className="text-base font-semibold text-cyan-400 hover:underline cursor-pointer"
                >
                  BCC 뉴스 - 실시간 글로벌 뉴스 및 기술 트렌드 보도
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  BCC 뉴스에서 전 세계 주요 소식, 기술 및 보안 소식, 글로벌 경제 분석, 기상 및 스포츠 소식을 신속하고 정확하게 확인하세요.
                </p>
              </div>

              {/* 결과 2 */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-mono">https://online.fincorp-bank.com</div>
                <h3 
                  onClick={() => navigateTo('bank', 'https://online.fincorp-bank.com')}
                  className="text-base font-semibold text-cyan-400 hover:underline cursor-pointer"
                >
                  퍼스트 파이낸셜 뱅크 - 간편 온라인 뱅킹 & 자산 관리
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  24시간 언제 어디서나 안전한 실시간 계좌 조회, 간편 송금, 금융 자산 현황을 편리하게 이용하세요.
                </p>
              </div>

              {/* 결과 3 */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-mono">https://booking.grandocean.com</div>
                <h3 
                  onClick={() => navigateTo('hotel', 'https://booking.grandocean.com')}
                  className="text-base font-semibold text-cyan-400 hover:underline cursor-pointer"
                >
                  그랜드 오션 리조트 & 호텔 공식 예약 센터
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  에메랄드빛 해변 전망의 최고급 객실과 프라이빗 인피니티 풀, 미슐랭 다이닝을 특별 회원가로 예약할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. BCC 뉴스 (BBC 스타일) ==================== */}
        {activeSite === 'bcc' && (
          <div className="min-h-full bg-slate-950 text-slate-100">
            {/* BCC 헤더 */}
            <div className="bg-rose-900 border-b border-rose-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 font-black text-lg tracking-widest text-white">
                  <span className="px-1.5 py-0.5 bg-black">B</span>
                  <span className="px-1.5 py-0.5 bg-black">C</span>
                  <span className="px-1.5 py-0.5 bg-black">C</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-200">NEWS</span>
              </div>
              <div className="text-xs text-rose-200 font-medium">
                실시간 세계 뉴스 및 기술 분석
              </div>
            </div>

            {/* BCC 내비게이션 */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-4 text-xs font-medium text-slate-300 overflow-x-auto">
              <span className="text-white font-bold border-b-2 border-rose-500 pb-0.5">홈</span>
              <span className="hover:text-white cursor-pointer">테크/보안</span>
              <span className="hover:text-white cursor-pointer">비즈니스</span>
              <span className="hover:text-white cursor-pointer">과학/환경</span>
              <span className="hover:text-white cursor-pointer">글로벌</span>
            </div>

            {/* 속보 티커 */}
            <div className="bg-rose-950/80 border-b border-rose-900/60 px-4 py-1.5 flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold text-[10px] uppercase">속보</span>
              <span className="text-rose-200 truncate">글로벌 IT 기업들, 새로운 보안 테스트 및 취약점 제보 보상 시스템 일제히 도입 발표</span>
            </div>

            {/* 메인 뉴스 그리드 */}
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
              {/* 헤드라인 주요 기사 */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-rose-400 uppercase tracking-wide">사이버 보안 & 테크 심층 분석</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    디지털 인프라 안전성 검증: 모의 테스트와 사전 진단이 핵심 경쟁력으로 부상
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    전 세계 금융기관과 클라우드 서비스 기업들이 시스템 런칭 전 선제적인 취약점 점검 체계를 의무화하고 있습니다. 보안 전문가들은 자동화된 정밀 진단 시스템의 중요성을 강조하고 있습니다.
                  </p>
                  <div className="text-[11px] text-slate-500">22분 전 • 기술부 정민우 기자</div>
                </div>
                <div className="h-48 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-800 to-rose-950/60 border border-slate-800 flex flex-col items-center justify-center p-4 text-center">
                  <Globe className="w-12 h-12 text-rose-400 mb-2 opacity-80" />
                  <div className="text-xs font-semibold text-white">글로벌 네트워크 보안 인프라 현황</div>
                  <div className="text-[10px] text-slate-400 mt-1">2026 차세대 인터넷 표준 기술 채택 동향</div>
                </div>
              </div>

              {/* 하위 기사 3열 */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase">금융 경제</div>
                  <h4 className="text-sm font-semibold text-white">퍼스트 뱅크, 차세대 암호화 전송 시스템 전면 가동</h4>
                  <p className="text-xs text-slate-400">모든 온라인 송금과 데이터 조회 시 종단간 암호화 기술을 적용하여 금융 안전성을 극대화합니다.</p>
                </div>
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold text-amber-400 uppercase">호스피탈리티</div>
                  <h4 className="text-sm font-semibold text-white">그랜드 오션 호텔, 친환경 스마트 리조트 인증 획득</h4>
                  <p className="text-xs text-slate-400">전 객실 IoT 자동 절전 시스템과 탄소 제로 비치를 운영하며 글로벌 관광객들의 호응을 얻고 있습니다.</p>
                </div>
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">오픈소스</div>
                  <h4 className="text-sm font-semibold text-white">Finefox 웹 브라우저, 보안 강화 업데이트 발표</h4>
                  <p className="text-xs text-slate-400">파인애플 여우 심볼의 경량 브라우저 Finefox가 개인정보 보호 기능을 한층 업그레이드했습니다.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. 은행 홈페이지 (First FinCorp Bank) ==================== */}
        {activeSite === 'bank' && (
          <div className="min-h-full bg-slate-950 text-slate-100">
            {/* 은행 헤더 */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">퍼스트 파이낸셜 뱅크</h2>
                  <p className="text-[10px] text-emerald-400 font-mono">FIRST FINCORP GLOBAL BANKING</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-300">보안 세션 연결됨 (SSL 256-bit)</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
              {/* 계좌 잔액 요약 카드 */}
              <div className="p-6 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-slate-400">프리미엄 보안 자유입출금 통장</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">$128,450.00</div>
                  <div className="text-xs text-slate-400 font-mono">계좌번호: 102-882-991024 (예금주: KALI)</div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setTransferTarget('702-441-289901 (안드레아)');
                      setTransferAmount('500');
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> 빠른 이체
                  </button>
                </div>
              </div>

              {/* 간편 송금 시뮬레이션 양식 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-400" /> 실시간 계좌 이체
                  </h3>

                  {transferSuccess && (
                    <div className="p-3 bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{transferSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleTransfer} className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">입금 계좌 번호 또는 수취인</label>
                      <input
                        type="text"
                        value={transferTarget}
                        onChange={(e) => setTransferTarget(e.target.value)}
                        placeholder="예: 702-441-289901 또는 안드레아"
                        className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">송금 금액 (USD)</label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="예: 1000"
                        className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-400 font-mono"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold cursor-pointer transition-colors shadow"
                    >
                      안전 송금 실행
                    </button>
                  </form>
                </div>

                {/* 최근 거래 내역 */}
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" /> 최근 금융 거래 내역
                  </h3>
                  <div className="space-y-2">
                    {[
                      { title: '취약점 제보 바운티 포상금 입금', amount: '+$25,000.00', date: '어제 17:40', isPlus: true },
                      { title: '그랜드 오션 리조트 객실 결제', amount: '-$420.00', date: '어제 11:20', isPlus: false },
                      { title: '사내 클라우드 인프라 유지비', amount: '-$125.00', date: '3일 전', isPlus: false },
                      { title: '정기 급여 입금', amount: '+$8,500.00', date: '5일 전', isPlus: true },
                    ].map((item, i) => (
                      <div key={i} className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="text-white font-medium">{item.title}</div>
                          <div className="text-[10px] text-slate-500">{item.date}</div>
                        </div>
                        <span className={`font-mono font-bold ${item.isPlus ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. 호텔 홈페이지 (Grand Ocean Hotel & Resort) ==================== */}
        {activeSite === 'hotel' && (
          <div className="min-h-full bg-slate-950 text-slate-100">
            {/* 호텔 상단 내비게이션 */}
            <div className="bg-slate-900/95 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏨</span>
                <div>
                  <h2 className="text-sm font-bold text-amber-300 tracking-wider">GRAND OCEAN RESORT & HOTEL</h2>
                  <p className="text-[10px] text-slate-400">최고급 오션뷰 럭셔리 휴양지</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="hover:text-amber-300 cursor-pointer">객실 안내</span>
                <span className="hover:text-amber-300 cursor-pointer">다이닝</span>
                <span className="hover:text-amber-300 cursor-pointer">스파 & 부대시설</span>
              </div>
            </div>

            {/* 히어로 배너 */}
            <div 
              className="relative h-64 bg-cover bg-center flex flex-col justify-end p-6 border-b border-slate-800"
              style={{
                backgroundImage: `url('/src/assets/images/tropical_island_desktop_1790586966168.jpg')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="relative z-10 space-y-2 max-w-lg">
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="ml-1 text-slate-300 text-[11px]">5성급 럭셔리 리조트</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  푸른 에메랄드빛 바다와 함께하는 여유
                </h1>
                <p className="text-xs text-slate-200">
                  전 객실 오션뷰 발코니와 루프탑 인피니티 풀에서 완벽한 휴식을 경험하세요.
                </p>
              </div>
            </div>

            {/* 객실 예약 알림 모달/메시지 */}
            {bookedRoom && (
              <div className="m-4 p-4 bg-amber-950/90 border border-amber-600 rounded-xl text-xs text-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span><b>[{bookedRoom}]</b> 객실 가예약이 완료되었습니다! 안내 메일이 발송되었습니다.</span>
                </div>
                <button
                  onClick={() => setBookedRoom(null)}
                  className="px-2 py-1 bg-amber-800 hover:bg-amber-700 text-white rounded text-[11px] cursor-pointer"
                >
                  확인
                </button>
              </div>
            )}

            {/* 객실 목록 */}
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" /> 추천 객실 & 스위트
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    name: '디럭스 파노라마 오션뷰',
                    price: '$320 / 1박',
                    desc: '킹사이즈 베드, 파노라마 해변 조망 테라스, 무료 미니바',
                    capacity: '최대 성인 2인',
                  },
                  {
                    name: '그랜드 이그제큐티브 스위트',
                    price: '$580 / 1박',
                    desc: '독립 거실 및 프라이빗 자쿠지 스파, 라운지 조식 포함',
                    capacity: '최대 성인 4인',
                  },
                  {
                    name: '로열 프레지덴셜 빌라',
                    price: '$1,200 / 1박',
                    desc: '전용 인피니티 풀, 전담 버틀러 서비스, 최고급 다이닝',
                    capacity: '최대 성인 6인',
                  },
                ].map((room) => (
                  <div key={room.name} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="text-sm font-bold text-white">{room.name}</div>
                      <div className="text-xs text-amber-400 font-mono font-semibold">{room.price}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{room.desc}</p>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {room.capacity}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        sound.playNotification();
                        setBookedRoom(room.name);
                      }}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow"
                    >
                      실시간 예약하기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
