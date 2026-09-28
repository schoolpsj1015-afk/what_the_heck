import React, { useState } from 'react';
import { Play, Code2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface CodeEditorWindowProps {
  onExecuteCommand: (cmd: string) => void;
}

const FILES = [
  {
    name: 'kimai.py',
    lang: 'python',
    content: `#!/usr/bin/env python3
# Kimai 경계 방화벽 익스플로잇 (CVE-2026-9921)
import sys
import socket
import json

def exploit(target_ip):
    print(f"[*] Kimai: 대상 방화벽 감지됨 ({target_ip})")
    print("[*] Kimai: 구성 완료, 페이로드 전송 중...")
    print("[!] Kimai: 중요! 와이어샤크(Wireshark) 패킷 분석기로 데이터 교환을 모니터링하십시오.")
    
    # 비인가 구성 재정의 패킷 전송
    payload = {
        "command": "EXPOSE_AUTH_TOKEN",
        "scope": "ALL_TRAFFIC"
    }
    print("[*] Kimai: 패킷 수신됨! 내용 복호화 진행.")
    print("[*] Kimai: 페이로드 전송 완료.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python3 kimai.py [ip address]")
        sys.exit(1)
    exploit(sys.argv[1])`,
  },
  {
    name: 'jwt_decoder.py',
    lang: 'python',
    content: `#!/usr/bin/env python3
# BearOS JWT 토큰 디코더 및 키링 추출기
import sys
import json
import base64

def decode_token(token):
    try:
        parts = token.split('.')
        header = json.loads(base64.urlsafe_b64decode(parts[0] + '==').decode('utf-8'))
        payload = json.loads(base64.urlsafe_b64decode(parts[1] + '==').decode('utf-8'))
        
        print("=== 복호화된 BearOS JWT 클레임 ===")
        print(json.dumps(payload, indent=2))
        return payload
    except Exception as e:
        print(f"JWT 토큰 복호화 오류: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python3 ./jwt_decoder.py [token]")
        sys.exit(1)
    decode_token(sys.argv[1])`,
  },
  {
    name: 'credentials.txt',
    lang: 'text',
    content: `=== 안드레아(Andrea) 개인 자격증명 백업 ===
대상 게이트웨이 라우터: 192.168.1.1
라우터 자격증명: admin / francine

방화벽 어플라이언스 호스트: 165.61.40.95:8443
대상 방화벽 서비스: Kimai v1.2.0
토큰 추출법: kimai.py 실행 후 와이어샤크에서 #1001 패킷 확인

시스템 관리자: 프랑신 뒤푸아 (Francine Dupuis)
2단계 인증(2FA) 토큰: 해커 폰의 OTP 인증기 탭 확인`,
  },
];

export const CodeEditorWindow: React.FC<CodeEditorWindowProps> = ({ onExecuteCommand }) => {
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [fileContents, setFileContents] = useState(FILES.map(f => f.content));

  const currentFile = FILES[activeFileIdx];

  const handleRun = () => {
    sound.playEnter();
    if (currentFile.name === 'kimai.py') {
      onExecuteCommand('python3 /home/kali/downloads/kimai.py 165.61.40.95');
    } else if (currentFile.name === 'jwt_decoder.py') {
      onExecuteCommand('python3 ./jwt_decoder.py eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmaXJld2FsbC1tYXN0ZXItYWRtaW4iLCJuYW1lIjoiRnJhbmNpbmUgRHVwdWlzIiwicm9sZSI6IlNVUEVSQURNSU4iLCJhdXRoX2tleSI6IkFwZXhTZWNfUm9vdF9NYXN0ZXJfUGFzc18yMDI2ISJ9');
    } else {
      onExecuteCommand('cat credentials.txt');
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-mono select-none">
      {/* 상단 파일 탭 */}
      <div className="h-9 px-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          {FILES.map((f, idx) => (
            <button
              key={f.name}
              onClick={() => {
                setActiveFileIdx(idx);
                sound.playKeypress();
              }}
              className={`px-3 py-1 rounded-t text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                idx === activeFileIdx
                  ? 'bg-slate-950 text-cyan-300 font-semibold border-t-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{f.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs flex items-center gap-1 font-sans cursor-pointer transition-colors"
          >
            <Play className="w-3 h-3" /> 스크립트 실행
          </button>
        </div>
      </div>

      {/* 편집기 본문 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 줄 번호 */}
        <div className="w-10 bg-slate-900/80 border-r border-slate-800 py-3 text-right pr-2 text-slate-600 text-xs font-mono select-none">
          {fileContents[activeFileIdx].split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* 텍스트 편집 영역 */}
        <textarea
          value={fileContents[activeFileIdx]}
          onChange={(e) => {
            const updated = [...fileContents];
            updated[activeFileIdx] = e.target.value;
            setFileContents(updated);
          }}
          className="flex-1 p-3 bg-slate-950 text-slate-200 text-xs font-mono leading-relaxed outline-none border-none resize-none selection:bg-cyan-800"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
