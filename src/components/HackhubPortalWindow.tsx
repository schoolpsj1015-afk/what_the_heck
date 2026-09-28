import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, TrendingUp, DollarSign, Award, 
  Send, CheckCircle2, Clock, Filter, Sparkles, ExternalLink, Flame 
} from 'lucide-react';
import { BugBountyProgram, VulnerabilityReport } from '../types';
import { sound } from '../utils/audio';

interface HackhubPortalProps {
  programs: BugBountyProgram[];
  reports: VulnerabilityReport[];
  walletBalance: number;
  onSubmitReport: (newReport: Omit<VulnerabilityReport, 'id' | 'submittedAt' | 'status' | 'bountyEarned'>) => void;
  onSelectProgram?: (program: BugBountyProgram) => void;
}

export const HackhubPortalWindow: React.FC<HackhubPortalProps> = ({
  programs,
  reports,
  walletBalance,
  onSubmitReport,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'programs' | 'submit' | 'reports'>('analytics');
  
  // Submit Form State
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0]?.id || '');
  const [reportTitle, setReportTitle] = useState('원격 미인증 경계 방화벽 설정 주입 및 최고관리자 권한 상승');
  const [category, setCategory] = useState<VulnerabilityReport['category']>('Auth Bypass');
  const [severity, setSeverity] = useState<VulnerabilityReport['severity']>('Critical');
  const [targetEndpoint, setTargetEndpoint] = useState('165.61.40.95:8443 (Kimai Appliance)');
  const [cvssScore, setCvssScore] = useState(9.8);
  const [pocText, setPocText] = useState(`1. 165.61.40.95:8443 경계 방화벽 포트 스캔 (nmap).
2. kimai.py 익스플로잇으로 미인증 구성 주입 페이로드 전송.
3. Wireshark 패킷 분석기를 통해 패킷 #1001에서 인증 Bearer 토큰 캡처.
4. jwt_decoder.py로 JWT 토큰 페이로드를 복호화하여 'francine' 최고관리자(SUPERADMIN) 자격 증명 추출.
5. 스마트폰 2FA OTP 토큰(942108)과 결합하여 완전한 방화벽 관리자 권한 탈취 성공.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const selectedProg = programs.find(p => p.id === selectedProgramId) || programs[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    sound.playEnter();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitReport({
        programId: selectedProgramId,
        programName: selectedProg.name,
        title: reportTitle,
        category,
        severity,
        cvssScore,
        targetEndpoint,
        proofOfConcept: pocText,
      });

      sound.playBountyReward();
      setSuccessBanner(`보고서가 성공적으로 접수되었습니다! [${severity} 등급 승인] - 포상금이 지갑에 입금되었습니다!`);
      setActiveTab('reports');

      setTimeout(() => setSuccessBanner(null), 5000);
    }, 1200);
  };

  const totalRewardedBounty = reports.reduce((acc, r) => acc + (r.bountyEarned || 0), 0);

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Navbar */}
      <div className="h-12 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white">HackHub</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 font-mono px-1.5 py-0.2 rounded border border-cyan-800">
                버그 바운티
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">실시간 위협 인텔리전스 및 보안 취약점 포상 플랫폼</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              setActiveTab('analytics');
              sound.playKeypress();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            실시간 애널리틱스
          </button>
          <button
            onClick={() => {
              setActiveTab('programs');
              sound.playKeypress();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'programs'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            바운티 프로그램 목록
          </button>
          <button
            onClick={() => {
              setActiveTab('submit');
              sound.playKeypress();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'submit'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <Send className="w-3 h-3" /> 취약점 보고서 제출
          </button>
          <button
            onClick={() => {
              setActiveTab('reports');
              sound.playKeypress();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            내 제출 내역 ({reports.length})
          </button>
        </div>

        {/* Payout balance pill */}
        <div className="hidden md:flex items-center gap-2 pl-2">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-sans">바운티 지갑 잔액</div>
            <div className="text-xs font-bold text-emerald-400 font-mono">
              ${(walletBalance || totalRewardedBounty).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-emerald-950/90 border-b border-emerald-700/60 px-4 py-2 flex items-center justify-between text-xs text-emerald-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* TAB 1: REAL-TIME ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Real-time Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>총 누적 수령 포상금</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  ${(walletBalance || totalRewardedBounty).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">현재 세션 +$25,000</div>
              </div>

              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>글로벌 해커 순위</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400">#14위</div>
                <div className="text-[11px] text-slate-500 font-sans">등급: 엘리트 인필트레이터</div>
              </div>

              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>승인 완료된 취약점</span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-cyan-400">{reports.length} 건</div>
                <div className="text-[11px] text-slate-500 font-sans">보고서 채택률 100%</div>
              </div>

              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>활성 침투 타겟 프로그램</span>
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-indigo-400">{programs.length} 개사</div>
                <div className="text-[11px] text-slate-500 font-sans">최대 포상금: $30,000</div>
              </div>
            </div>

            {/* Severity Distribution & Activity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Severity Breakdown */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  발견된 취약점 심각도별 분포
                </h3>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span className="text-rose-400 font-semibold">치명적 (Critical · CVSS 9.0–10.0)</span>
                      <span className="font-mono">4건 · $65,000</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span className="text-amber-400 font-semibold">높음 (High · CVSS 7.0–8.9)</span>
                      <span className="font-mono">7건 · $42,500</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span className="text-blue-400 font-semibold">보통 (Medium · CVSS 4.0–6.9)</span>
                      <span className="font-mono">5건 · $12,800</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span className="text-emerald-400 font-semibold">낮음 (Low · CVSS 0.1–3.9)</span>
                      <span className="font-mono">2건 · $1,500</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Triage Activity Stream */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    실시간 보안 검증 및 트리아지 피드
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono animate-pulse">● 실시간 스트림</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-start gap-2.5">
                    <span className="text-lg">🛡️</span>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">에이펙스 클라우드: 경계 방화벽 설정 주입 취약점</span>
                        <span className="text-[10px] text-slate-500 font-mono">방금 전</span>
                      </div>
                      <p className="text-[11px] text-slate-400">보안 엔지니어 트리아지 검증 완료. 최고 등급 Critical 포상금 승인.</p>
                      <span className="inline-block text-[10px] text-emerald-400 font-mono font-bold">포상금: $25,000 USD 즉시 지급</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-start gap-2.5">
                    <span className="text-lg">🏦</span>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">핀코프 뱅킹: 금융 원장 SQL 인젝션</span>
                        <span className="text-[10px] text-slate-500 font-mono">3일 전</span>
                      </div>
                      <p className="text-[11px] text-slate-400">패치 릴리즈 완료. 취약점 해결 확인 후 보상금 송금.</p>
                      <span className="inline-block text-[10px] text-emerald-400 font-mono font-bold">포상금: $9,500 USD 지급 완료</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="p-4 bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-800/50 rounded-xl flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">방화벽 공격 페이로드나 해독된 토큰을 확보하셨나요?</h4>
                <p className="text-xs text-slate-400">지금 바로 보안 보고서를 제출하면 자동 검증 및 실시간 포상금이 지급됩니다.</p>
              </div>
              <button
                onClick={() => {
                  sound.playKeypress();
                  setActiveTab('submit');
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
              >
                <Send className="w-3.5 h-3.5" /> 취약점 보고서 제출하기
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE BOUNTY PROGRAMS */}
        {activeTab === 'programs' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">진행 중인 버그 바운티 프로그램</h3>
                <p className="text-xs text-slate-400">합법적인 모의 침투 및 취약점 제보가 인가된 공식 타겟 범위 목록입니다.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.map((prog) => (
                <div
                  key={prog.id}
                  className="p-4 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{prog.logo}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{prog.name}</h4>
                        <span className="text-xs text-slate-400">{prog.company}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      최대 {prog.rewardRange}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">공격 인가 대상 범위 (In-Scope):</div>
                    <div className="flex flex-wrap gap-1">
                      {prog.scope.map((s, idx) => (
                        <span key={idx} className="bg-slate-950 text-cyan-300 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      참여 화이트해커 {prog.activeHunters}명 · 조치 완료된 보고서 {prog.resolvedReports}건
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProgramId(prog.id);
                        setActiveTab('submit');
                        sound.playKeypress();
                      }}
                      className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded-lg text-xs font-medium border border-cyan-700/50 transition-all cursor-pointer"
                    >
                      보고서 작성 →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SECURE SUBMISSION PORTAL */}
        {activeTab === 'submit' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">보안 취약점 제출 포털</h3>
              <p className="text-xs text-slate-400">검증 가능한 개념 증명(PoC)과 공격 단계를 제출하면 심사 후 지갑으로 즉시 포상금이 지급됩니다.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
              {/* Program Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  대상 바운티 프로그램 선택
                </label>
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (최대 보상: ${p.maxBounty.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Report Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  취약점 보고서 제목
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="예: 경계 방화벽 게이트웨이 원격 코드 실행 및 관리자 권한 탈취"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* Category & Severity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    취약점 분류 (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Auth Bypass">인증 우회 (Auth Bypass)</option>
                    <option value="RCE">원격 코드 실행 (RCE)</option>
                    <option value="JWT Manipulation">JWT 토큰 조작/탈취</option>
                    <option value="SQLi">SQL 인젝션</option>
                    <option value="IDOR">안전하지 않은 직접 객체 참조 (IDOR)</option>
                    <option value="XSS">크로스 사이트 스크립팅 (XSS)</option>
                    <option value="SSRF">서버 측 요청 위조 (SSRF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    심각도 등급 (Severity)
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setSeverity(val);
                      if (val === 'Critical') setCvssScore(9.8);
                      else if (val === 'High') setCvssScore(8.2);
                      else if (val === 'Medium') setCvssScore(5.6);
                      else setCvssScore(3.1);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Critical">치명적 (Critical · CVSS 9.0–10.0)</option>
                    <option value="High">높음 (High · CVSS 7.0–8.9)</option>
                    <option value="Medium">보통 (Medium · CVSS 4.0–6.9)</option>
                    <option value="Low">낮음 (Low · CVSS 0.1–3.9)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CVSS 3.1 점수
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={cvssScore}
                    onChange={(e) => setCvssScore(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Target Endpoint */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  공격 대상 엔드포인트 / 호스트 IP
                </label>
                <input
                  type="text"
                  value={targetEndpoint}
                  onChange={(e) => setTargetEndpoint(e.target.value)}
                  placeholder="예: 165.61.40.95:8443 또는 https://api.target.com/v1"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* PoC Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  재현 절차 및 개념 증명(PoC) 페이로드
                </label>
                <textarea
                  rows={5}
                  value={pocText}
                  onChange={(e) => setPocText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  placeholder="상세 재현 단계, 공격 명령 및 토큰 값을 기술하세요..."
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg text-xs shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      <span>보고서 자동 트리아지 및 포상금 정산 중...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{selectedProg.name}에 취약점 보고서 제출 (최대 ${selectedProg.maxBounty.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: MY SUBMISSIONS / REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">제출된 보안 취약점 내역</h3>
                <p className="text-xs text-slate-400">제보 완료된 취약점 리포트와 정산된 바운티 포상금 이력입니다.</p>
              </div>
            </div>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2.5"
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400">{rep.id}</span>
                        <span className="font-bold text-sm text-white">{rep.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{rep.programName}</span>
                        <span>·</span>
                        <span className="font-mono text-cyan-300">{rep.targetEndpoint}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                        rep.severity === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : rep.severity === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {rep.severity} (CVSS {rep.cvssScore})
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        포상금 지급 완료: +${rep.bountyEarned.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-line">
                    {rep.proofOfConcept}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
