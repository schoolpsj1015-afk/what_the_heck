import React, { useState } from 'react';
import { Play, Square, Filter, Copy, Check, Terminal, Search, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface PacketItem {
  no: number;
  time: number;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  payload?: string;
  token?: string;
}

const INITIAL_PACKETS: PacketItem[] = [
  {
    no: 1000,
    time: 25,
    source: '34.216.0.124',
    destination: '165.61.40.95',
    protocol: 'HTTP',
    length: 512,
    info: 'POST /api/v1/firewall/config/sync HTTP/1.1 (익스플로잇 페이로드 주입)',
    payload: `POST /api/v1/firewall/config/sync HTTP/1.1\nHost: 165.61.40.95:8443\nUser-Agent: Kimai-Exploit/1.2.0\nContent-Type: application/json\n\n{"exploit": "CVE-2026-9921", "action": "DUMP_KEYRING"}`,
  },
  {
    no: 1001,
    time: 25,
    source: '165.61.40.95',
    destination: '34.216.0.124',
    protocol: 'HTTP/JSON',
    length: 1042,
    info: 'HTTP/1.1 200 OK (Kimai 관리자 인증 토큰 브로드캐스트 핸드셰이크)',
    payload: `HTTP/1.1 200 OK\nDate: Sun, 25 Jan 2026 15:16:04 GMT\nServer: Kimai-Perimeter-FW/1.2\nSet-Cookie: session=Kimai_Root_Session_9921\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmaXJld2FsbC1tYXN0ZXItYWRtaW4iLCJuYW1lIjoiRnJhbmNpbmUgRHVwdWlzIiwicm9sZSI6IlNVUEVSQURNSU4iLCJhdXRoX2tleSI6IkFwZXhTZWNfUm9vdF9NYXN0ZXJfUGFzc18yMDI2ISJ9\n\n{"status": "CONF_EXPOSED", "admin_user": "francine"}`,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmaXJld2FsbC1tYXN0ZXItYWRtaW4iLCJuYW1lIjoiRnJhbmNpbmUgRHVwdWlzIiwicm9sZSI6IlNVUEVSQURNSU4iLCJhdXRoX2tleSI6IkFwZXhTZWNfUm9vdF9NYXN0ZXJfUGFzc18yMDI2ISJ9',
  },
  {
    no: 1002,
    time: 25,
    source: '34.216.0.124',
    destination: '165.61.40.95',
    protocol: 'TCP',
    length: 66,
    info: '4444 → 8443 [ACK] Seq=513 Ack=1043 Win=64240 Len=0',
  },
  {
    no: 1003,
    time: 26,
    source: '34.216.0.124',
    destination: '165.61.40.95',
    protocol: 'HTTP',
    length: 320,
    info: 'GET /admin/dashboard HTTP/1.1 (최고관리자 권한 인증됨)',
    payload: `GET /admin/dashboard HTTP/1.1\nHost: 165.61.40.95:8443\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
  },
  {
    no: 1004,
    time: 27,
    source: '192.168.1.10',
    destination: '34.216.0.124',
    protocol: 'TCP',
    length: 128,
    info: '리버스 쉘 하트비트 신호 C2 [PSH, ACK] (안드레아 워크스테이션)',
  },
];

interface WiresharkWindowProps {
  onExecuteCommand: (cmd: string) => void;
}

export const WiresharkWindow: React.FC<WiresharkWindowProps> = ({ onExecuteCommand }) => {
  const [packets] = useState<PacketItem[]>(INITIAL_PACKETS);
  const [selectedNo, setSelectedNo] = useState<number>(1001);
  const [filterQuery, setFilterQuery] = useState('');
  const [isCapturing, setIsCapturing] = useState(true);
  const [copiedToken, setCopiedToken] = useState(false);

  const selectedPacket = packets.find(p => p.no === selectedNo) || packets[1];

  const filteredPackets = packets.filter(p => 
    p.protocol.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.source.includes(filterQuery) ||
    p.destination.includes(filterQuery) ||
    p.info.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const copyToken = (tok: string) => {
    navigator.clipboard.writeText(tok);
    setCopiedToken(true);
    sound.playNotification();
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* Wireshark Toolbar */}
      <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsCapturing(!isCapturing);
              sound.playKeypress();
            }}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
              isCapturing ? 'bg-rose-900/60 text-rose-300 border border-rose-700' : 'bg-emerald-700 text-white'
            }`}
          >
            {isCapturing ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isCapturing ? '패킷 캡처 중지' : '패킷 캡처 시작'}
          </button>
          <span className="text-[11px] font-mono text-cyan-400 hidden sm:inline">네트워크 인터페이스: eth0 (무차별 모드)</span>
        </div>

        {/* Display Filter */}
        <div className="flex-1 max-w-md flex items-center gap-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="패킷 필터 표현식 입력 (예: http 또는 165.61.40.95)..."
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={() => setFilterQuery('')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 border border-slate-700 cursor-pointer"
          >
            초기화
          </button>
        </div>
      </div>

      {/* Packet Table */}
      <div className="h-44 sm:h-52 overflow-y-auto border-b border-slate-800 shrink-0 font-mono text-[11px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 sticky top-0 border-b border-slate-800 text-slate-400 select-none">
            <tr>
              <th className="py-1 px-2.5 w-14">번호</th>
              <th className="py-1 px-2.5 w-14">시간</th>
              <th className="py-1 px-2.5 w-28">출발지 (Source)</th>
              <th className="py-1 px-2.5 w-28">도착지 (Dest)</th>
              <th className="py-1 px-2.5 w-24">프로토콜</th>
              <th className="py-1 px-2.5">패킷 정보 (Info)</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackets.map((pkt) => {
              const isSelected = pkt.no === selectedNo;
              const isHandshake = pkt.no === 1001;
              return (
                <tr
                  key={pkt.no}
                  onClick={() => {
                    setSelectedNo(pkt.no);
                    sound.playKeypress();
                  }}
                  className={`cursor-pointer transition-colors border-b border-slate-800/40 ${
                    isSelected
                      ? 'bg-cyan-950 text-cyan-200 font-semibold'
                      : isHandshake
                      ? 'bg-amber-950/40 text-amber-200 hover:bg-slate-850'
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <td className="py-1 px-2.5">{pkt.no}</td>
                  <td className="py-1 px-2.5">{pkt.time}</td>
                  <td className="py-1 px-2.5">{pkt.source}</td>
                  <td className="py-1 px-2.5">{pkt.destination}</td>
                  <td className="py-1 px-2.5">
                    <span className={isHandshake ? 'text-amber-400 font-bold' : ''}>
                      {pkt.protocol}
                    </span>
                  </td>
                  <td className="py-1 px-2.5 truncate max-w-xs">{pkt.info}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Packet Inspector Pane */}
      <div className="flex-1 p-3.5 overflow-y-auto bg-slate-950 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">패킷 #{selectedPacket.no} 상세 분석</span>
            <span className="text-[11px] text-slate-400">({selectedPacket.protocol} · {selectedPacket.length} 바이트)</span>
          </div>
          {selectedPacket.token && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToken(selectedPacket.token!)}
                className="px-2.5 py-1 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 rounded border border-amber-500/50 text-[11px] flex items-center gap-1 cursor-pointer font-sans"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                JWT 토큰 복사
              </button>
              <button
                onClick={() => {
                  sound.playKeypress();
                  onExecuteCommand(`python3 ./jwt_decoder.py ${selectedPacket.token}`);
                }}
                className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] flex items-center gap-1 cursor-pointer font-sans"
              >
                <Terminal className="w-3.5 h-3.5" /> 터미널에서 토큰 디코딩
              </button>
            </div>
          )}
        </div>

        {selectedPacket.payload ? (
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400">캡처된 HTTP 헤더 및 페이로드 데이터:</div>
            <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {selectedPacket.payload}
            </pre>
          </div>
        ) : (
          <div className="text-slate-400 text-xs italic">
            Transmission Control Protocol (TCP), 출발지 포트: 4444, 목적지 포트: 8443, 플래그: [ACK], 윈도우 크기: 64240
          </div>
        )}
      </div>
    </div>
  );
};
