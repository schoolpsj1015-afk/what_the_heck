import React, { useState, useEffect, useRef } from 'react';
import { AptPackage } from '../types';
import { sound } from '../utils/audio';
import { Terminal as TerminalIcon, Play, RefreshCw, Sparkles } from 'lucide-react';

interface TerminalWindowProps {
  installedPackages: AptPackage[];
  onInstallPackage: (name: string) => boolean;
  onObjectiveComplete?: (objId: string) => void;
  externalCommand?: string | null;
  onClearExternalCommand?: () => void;
  onTriggerPacket?: (targetIp: string) => void;
  virtualKeyInput?: string | null;
  onClearVirtualKey?: () => void;
}

interface CommandHistoryItem {
  id: string;
  command: string;
  output: string;
  isError?: boolean;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  installedPackages,
  onInstallPackage,
  onObjectiveComplete,
  externalCommand,
  onClearExternalCommand,
  virtualKeyInput,
  onClearVirtualKey,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      id: 'init-1',
      command: '',
      output: `Kali GNU/Linux Rolling 2026.1 (x86_64) - Ubuntu/GNOME 테스트 셸
* 시스템 테스트 환경이 준비되었습니다.
* 사용 가능한 명령어를 보려면 'help'를 입력하십시오.`,
    },
  ]);

  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandList, setCommandList] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Handle external command execution (from UI buttons or HUD)
  useEffect(() => {
    if (externalCommand) {
      executeCommand(externalCommand);
      onClearExternalCommand?.();
    }
  }, [externalCommand]);

  // Handle virtual keyboard character inputs
  useEffect(() => {
    if (virtualKeyInput !== null && virtualKeyInput !== undefined) {
      if (virtualKeyInput === '\b') {
        setInputVal((prev) => prev.slice(0, -1));
      } else if (virtualKeyInput === '\n') {
        if (inputVal.trim()) {
          executeCommand(inputVal);
        }
      } else if (virtualKeyInput === '\t') {
        // Tab autocomplete basic
        handleTabAutocomplete();
      } else if (virtualKeyInput === '') {
        setInputVal('');
      } else {
        setInputVal((prev) => prev + virtualKeyInput);
      }
      onClearVirtualKey?.();
    }
  }, [virtualKeyInput]);

  const handleTabAutocomplete = () => {
    const common = ['help', 'clear', 'ifconfig', 'ping 192.168.1.1', 'sudo apt update', 'sudo apt install', 'ls', 'whoami', 'pwd', 'cat readme.txt'];
    const matched = common.find((c) => c.startsWith(inputVal.trim()));
    if (matched) {
      setInputVal(matched);
      sound.playKeypress();
    }
  };

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    sound.playEnter();
    setCommandList((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const parts = cmd.split(/\s+/);
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';
    let isError = false;

    switch (mainCmd) {
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'help':
        output = `[기본 지원 명령어 목록]
  help                  - 현재 도움말 출력
  clear                 - 터미널 화면 지우기
  ls [-l, -a]           - 디렉터리 내 파일 및 폴더 목록 확인
  pwd                   - 현재 작업 디렉터리 경로 출력
  whoami                - 현재 로그인된 사용자 계정명 확인
  date                  - 시스템 현재 날짜 및 시각 출력
  uname [-a]            - 시스템 커널 및 운영체제 정보 출력
  echo [text]           - 입력한 텍스트 화면에 출력
  cat [file]            - 파일 내용 확인 (예: cat readme.txt)
  ifconfig / ip a       - 네트워크 인터페이스 및 IP 주소 확인
  ping [host]           - 네트워크 연결 상태 진단
  curl [url]            - 웹 URL 요청 시뮬레이션
  sudo apt update       - 패키지 저장소 목록 업데이트
  sudo apt install [pkg]- 패키지 설치 (예: sudo apt install netcat)
  python3 [file]        - 파이썬 스크립트 실행`;
        break;

      case 'whoami':
        output = 'kali';
        break;

      case 'pwd':
        output = '/home/kali';
        break;

      case 'date':
        output = new Date().toString();
        break;

      case 'uname':
        if (args.includes('-a')) {
          output = 'Linux kali-station 6.8.0-kali-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
        } else {
          output = 'Linux';
        }
        break;

      case 'ls':
      case 'dir':
        if (args.includes('-la') || args.includes('-l')) {
          output = `total 28
drwxr-xr-x 4 kali kali 4096 Sep 28 09:15 .
drwxr-xr-x 3 root root 4096 Sep 28 09:00 ..
-rw-r--r-- 1 kali kali  342 Sep 28 09:12 readme.txt
-rw-r--r-- 1 kali kali  188 Sep 28 09:14 test.txt
drwxr-xr-x 2 kali kali 4096 Sep 28 09:10 Downloads
drwxr-xr-x 2 kali kali 4096 Sep 28 09:10 Documents
drwxr-xr-x 2 kali kali 4096 Sep 28 09:10 Desktop`;
        } else {
          output = `readme.txt  test.txt  Downloads  Documents  Desktop`;
        }
        break;

      case 'cat':
        if (!args[0]) {
          output = '사용법: cat <파일명>';
          isError = true;
        } else {
          const fname = args[0].toLowerCase();
          if (fname.includes('readme')) {
            output = `=== BearOS / Ubuntu 테스트 시스템 안내 ===
시스템: Ubuntu & GNOME 데스크톱 환경
기본 웹 브라우저: Finefox (파인애플 여우)
접속 가능한 포털:
- Geogle 검색: https://geogle.com
- BCC 뉴스: https://bcc.co.uk/news
- 퍼스트 온라인 뱅크: https://fincorp-bank.com
- 그랜드 호텔: https://grandocean.com`;
          } else if (fname.includes('test')) {
            output = `[시스템 상태 점검 완료]
- 가상 키보드: 정상 동작
- 터미널 기본 명령어: 정상 동작
- 네트워크 연결: 192.168.1.2 (Active)`;
          } else {
            output = `cat: ${args[0]}: 해당 파일 또는 디렉터리가 없습니다.`;
            isError = true;
          }
        }
        break;

      case 'echo':
        output = args.join(' ');
        break;

      case 'ifconfig':
      case 'ip':
        output = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.2  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:660a  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:0a  txqueuelen 1000  (Ethernet)
        RX packets 14209  bytes 12894100 (12.8 MB)
        TX packets 9831   bytes 8920112 (8.9 MB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)`;
        onObjectiveComplete?.('obj-1');
        break;

      case 'ping': {
        const target = args[0] || '192.168.1.1';
        output = `PING ${target} (${target}) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.412 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.389 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=0.405 ms
64 bytes from ${target}: icmp_seq=4 ttl=64 time=0.395 ms

--- ${target} ping 통계 ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 0.389/0.400/0.412/0.009 ms`;
        onObjectiveComplete?.('obj-1');
        break;
      }

      case 'curl': {
        const url = args[0] || 'https://geogle.com';
        output = `HTTP/1.1 200 OK
Date: ${new Date().toUTCString()}
Server: Finefox-Gateway/2.4
Content-Type: text/html; charset=UTF-8
Content-Length: 1024

<!doctype html><html><head><title>${url}</title></head><body><h1>연결 성공: ${url}</h1></body></html>`;
        break;
      }

      case 'sudo':
        if (args[0] === 'apt' || args[0] === 'apt-get') {
          const sub = args[1];
          if (sub === 'update') {
            output = `기본 저장소 목록 갱신 중...
받기:1 http://http.kali.org/kali kali-rolling InRelease [41.5 kB]
받기:2 http://http.kali.org/kali kali-rolling/main amd64 Packages [19.8 MB]
패키지 목록을 읽는 중입니다... 완료
의존성 트리를 만드는 중입니다... 완료`;
          } else if (sub === 'install' || sub === 'install-package') {
            const pkgName = args[2];
            if (!pkgName) {
              output = '사용법: sudo apt install <패키지명>';
              isError = true;
            } else {
              const success = onInstallPackage(pkgName);
              if (success) {
                output = `패키지 목록을 읽는 중입니다... 완료
의존성 트리를 만드는 중입니다... 완료
다음 새 패키지를 설치할 것입니다: ${pkgName}
0개 업그레이드, 1개 새로 설치, 0개 제거.
14.2 MB 아카이브를 받아야 합니다.
패키지 [${pkgName}] 설치가 완료되었습니다.`;
                onObjectiveComplete?.('obj-4');
              } else {
                output = `오류: '${pkgName}' 패키지를 찾을 수 없습니다.\n사용 가능한 패키지: netcat, nikto, sqlmap, nmap, wireshark, curl, python3`;
                isError = true;
              }
            }
          } else {
            output = `지원 옵션: update, install <패키지명>`;
          }
        } else {
          output = `sudo: ${args[0]}: 명령어를 찾을 수 없습니다.`;
          isError = true;
        }
        break;

      case 'bettercap':
        output = `[bettercap v2.32.0 - interactive session started]
Type 'help' or 'net.probe on' to start network discovery.
(bettercap) >`;
        onObjectiveComplete?.('2-2');
        break;

      case 'net.probe':
        if (args[0] === 'on') {
          output = `[sys.log] [INF] net.probe worker started.
[sys.log] [INF] discovered 12 hosts on local subnet.
(bettercap) >`;
          onObjectiveComplete?.('2-3');
        } else {
          output = `Usage: net.probe on`;
        }
        break;

      case 'wifi.recon':
        output = `[wifi] wifi.recon worker started (monitoring 2.4GHz / 5GHz channels)...
[wifi] 8 Wi-Fi access points detected in range.
(bettercap) >`;
        onObjectiveComplete?.('2-4');
        break;

      case 'wifi.show':
        output = `+-------------------+-----------------+----------+--------+
| BSSID             | SSID            | CH | RSSI |
+-------------------+-----------------+----------+--------+
| 00:11:22:33:44:55 | Secure-Mesh-AP  | 6  | -42dBm |
| 88:99:AA:BB:CC:DD | Home-WiFi-5G    | 36 | -65dBm |
| 11:22:33:44:55:66 | Smartphone-Hotspot| 1| -30dBm |
+-------------------+-----------------+----------+--------+
(bettercap) >`;
        onObjectiveComplete?.('2-5');
        break;

      case 'set':
        if (args[0] === 'wifi.ap') {
          output = `[wifi] AP target set to: ${args[1] || '192.168.1.100'} (Secure-Mesh-AP)
(bettercap) >`;
          onObjectiveComplete?.('2-6');
        } else {
          output = `Usage: set wifi.ap <ip_or_bssid>`;
        }
        break;

      case 'wifi.deauth':
        output = `[wifi] sending deauth packets to target AP...
[wifi] WPA2 handshake captured! Saved packet log to 'wpa.pcap'.
(bettercap) >`;
        onObjectiveComplete?.('2-7');
        break;

      case 'exit':
      case 'quit':
        output = `[bettercap] session terminated. Returning to bash.`;
        onObjectiveComplete?.('2-8');
        break;

      case 'hashcat':
        if (args.includes('wpa.pcap') || args.includes('-m')) {
          output = `hashcat (v6.2.6) starting in WPA/WPA2 PMKID/EAPOL cracking mode...
Dictionary attack on wpa.pcap: 100% complete.
[SUCCESS] Key cracked: Secure-Mesh-AP -> 'security2026'`;
          onObjectiveComplete?.('2-10');
        } else {
          output = `hashcat -m 22000 wpa.pcap (WPA/WPA2 Handshake Cracker)`;
        }
        break;

      default:
        output = `bash: ${mainCmd}: 명령어를 찾을 수 없습니다. 'help'를 입력하여 사용 가능한 명령어를 확인하세요.`;
        isError = true;
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}-${Math.random()}`,
        command: rawCmd,
        output,
        isError,
      },
    ]);

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandList.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandList.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandList[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandList.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandList[nextIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabAutocomplete();
    } else {
      sound.playKeypress();
    }
  };

  const quickCommands = [
    { label: 'help', cmd: 'help' },
    { label: 'ifconfig', cmd: 'ifconfig' },
    { label: 'ping 라우터', cmd: 'ping 192.168.1.1' },
    { label: 'ls -l', cmd: 'ls -l' },
    { label: 'cat readme', cmd: 'cat readme.txt' },
    { label: 'apt update', cmd: 'sudo apt update' },
    { label: 'netcat 설치', cmd: 'sudo apt install netcat' },
    { label: 'clear', cmd: 'clear' },
  ];

  return (
    <div 
      className="flex-1 w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-mono text-xs select-text cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* 빠른 명령어 실행 바 (모바일 및 초보자 편의성) */}
      <div className="h-8 px-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0 select-none">
        <span className="text-[10px] text-slate-400 font-sans shrink-0 flex items-center gap-1">
          <TerminalIcon className="w-3 h-3 text-cyan-400" />
          단축:
        </span>
        {quickCommands.map((q) => (
          <button
            key={q.label}
            onClick={(e) => {
              e.stopPropagation();
              executeCommand(q.cmd);
            }}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 text-[11px] font-mono border border-slate-700/60 shrink-0 cursor-pointer transition-colors"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* 터미널 출력 영역 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 leading-relaxed selection:bg-cyan-800">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <span className="text-emerald-400">kali@bearos</span>
                <span className="text-slate-500">:</span>
                <span className="text-cyan-400">~</span>
                <span className="text-slate-400">$</span>
                <span className="text-white">{item.command}</span>
              </div>
            )}
            <pre className={`whitespace-pre-wrap font-mono text-xs ${item.isError ? 'text-rose-400' : 'text-slate-300'}`}>
              {item.output}
            </pre>
          </div>
        ))}

        {/* 현재 입력 프롬프트 */}
        <div className="flex items-center gap-2 text-slate-300 pt-1">
          <span className="text-emerald-400">kali@bearos</span>
          <span className="text-slate-500">:</span>
          <span className="text-cyan-400">~</span>
          <span className="text-slate-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-white font-mono text-xs caret-cyan-400"
            autoFocus
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
