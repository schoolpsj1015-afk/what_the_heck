import { AptPackage, BugBountyProgram, Mission, NetworkNode, PhoneMessage, VulnerabilityReport } from '../types';

export const INITIAL_APT_PACKAGES: AptPackage[] = [
  {
    name: 'nmap',
    description: '네트워크 탐색 도구 및 포트/서비스 스캐너',
    version: '7.94',
    size: '14.2 MB',
    installed: true,
    executableName: 'nmap',
  },
  {
    name: 'wireshark',
    description: '네트워크 패킷 분석 및 트래픽 모니터링 유틸리티',
    version: '4.2.0',
    size: '48.5 MB',
    installed: true,
    executableName: 'wireshark',
  },
  {
    name: 'curl',
    description: 'URL을 통한 데이터 전송 CLI 도구 (HTTP/HTTPS/FTP)',
    version: '8.5.0',
    size: '2.1 MB',
    installed: true,
    executableName: 'curl',
  },
  {
    name: 'python3',
    description: 'Python 3 프로그래밍 언어 인터프리터 및 표준 라이브러리',
    version: '3.12.2',
    size: '25.6 MB',
    installed: true,
    executableName: 'python3',
  },
  {
    name: 'sqlmap',
    description: '자동화된 SQL 인젝션 감지 및 데이터베이스 분석 도구',
    version: '1.8.2',
    size: '18.9 MB',
    installed: false,
    executableName: 'sqlmap',
  },
  {
    name: 'nikto',
    description: '웹 서버 종합 취약점 스캐너',
    version: '2.5.0',
    size: '11.4 MB',
    installed: false,
    executableName: 'nikto',
  },
  {
    name: 'netcat',
    description: 'TCP/UDP 네트워크 연결 및 포트 읽기/쓰기 유틸리티',
    version: '1.10-47',
    size: '1.2 MB',
    installed: false,
    executableName: 'nc',
  },
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission-test',
    title: '시스템 기본 점검 테스트',
    subtitle: '새로운 테스트 환경 초기화 완료',
    objectives: [
      {
        id: 'obj-1',
        title: '터미널에서 네트워크 상태 확인 (ifconfig 또는 ping)',
        hint: '터미널 창을 열고 `ifconfig` 또는 `ping 192.168.1.1`을 입력하세요.',
        shortcutCommand: 'ifconfig',
        completed: false,
      },
      {
        id: 'obj-2',
        title: 'Finefox 웹 브라우저 실행 및 Geogle 검색',
        hint: '바탕화면의 Finefox(파인애플 여우) 아이콘을 눌러 웹 브라우저를 열어보세요.',
        completed: false,
      },
      {
        id: 'obj-3',
        title: 'BCC 뉴스 최신 기사 확인',
        hint: 'Finefox 브라우저 즐겨찾기에서 BCC 뉴스를 클릭하세요.',
        completed: false,
      },
      {
        id: 'obj-4',
        title: '패키지 관리자 테스트 (sudo apt install netcat)',
        hint: '터미널에 `sudo apt install netcat`을 입력해 패키지 설치를 테스트하세요.',
        shortcutCommand: 'sudo apt install netcat',
        completed: false,
      },
    ],
  },
];

export const INITIAL_PROGRAMS: BugBountyProgram[] = [
  {
    id: 'apex-cloud',
    name: '에이펙스 클라우드 (Apex Cloud Global)',
    company: 'Apex Technologies Inc.',
    logo: '☁️',
    scope: ['api.apex-cloud.io', 'auth.apex-cloud.io', '*.cdn.apexcloud.net'],
    outOfScope: ['corp-blog.apexcloud.net', '물리적 침투 시도', '서비스 거부 공격 (DoS/DDoS)'],
    rewardRange: '$500 ~ $25,000',
    maxBounty: 25000,
    vulnerabilityTypes: ['RCE (원격 코드 실행)', 'SQL 인젝션', '인증 우회', 'SSRF'],
    activeHunters: 428,
    resolvedReports: 124,
    description: '에이펙스 클라우드 분산 인프라 및 API 인증 시스템 대상 보안 취약점 포털입니다.',
  },
  {
    id: 'fincorp-bank',
    name: '퍼스트 파이낸셜 뱅크 (First FinCorp)',
    company: 'FinCorp Banking Group',
    logo: '🏦',
    scope: ['online.fincorp-bank.com', 'payment-gateway.fincorp.internal'],
    outOfScope: ['소셜 엔지니어링', '제3자 결제 벤더사'],
    rewardRange: '$1,000 ~ $50,000',
    maxBounty: 50000,
    vulnerabilityTypes: ['IDOR (인가 취약점)', '금융 트랜잭션 변조', 'JWT 조작', 'SQLi'],
    activeHunters: 312,
    resolvedReports: 89,
    description: '온라인 뱅킹 시스템 및 결제 게이트웨이 보안 취약점 제보 프로그램입니다.',
  },
  {
    id: 'grand-ocean',
    name: '그랜드 오션 리조트 & 호텔 (Grand Ocean)',
    company: 'Ocean Worldwide Hospitality',
    logo: '🏨',
    scope: ['booking.grandocean.com', 'guest-portal.hotel.net'],
    outOfScope: ['매장 내 POS 결제 단말기'],
    rewardRange: '$300 ~ $10,000',
    maxBounty: 10000,
    vulnerabilityTypes: ['고객 개인정보 노출', '예약 파라미터 변조', 'XSS'],
    activeHunters: 185,
    resolvedReports: 62,
    description: '글로벌 호텔 예약 플랫폼 및 고객 포털 취약점 분석 프로그램입니다.',
  },
];

export const INITIAL_REPORTS: VulnerabilityReport[] = [
  {
    id: 'REP-8821',
    programId: 'apex-cloud',
    programName: '에이펙스 클라우드',
    title: '경계 방화벽 인증 우회 및 관리자 세션 탈취 취약점',
    category: 'Auth Bypass',
    severity: 'Critical',
    cvssScore: 9.8,
    targetEndpoint: 'https://auth.apex-cloud.io/api/v1/override',
    proofOfConcept: '특수 조작된 인증 패킷을 방화벽 제어 포트로 전송하여 루트 관리자 JWT 세션 획득 성공',
    status: 'Rewarded',
    bountyEarned: 25000,
    submittedAt: '어제',
  },
  {
    id: 'REP-7419',
    programId: 'fincorp-bank',
    programName: '퍼스트 파이낸셜 뱅크',
    title: '계좌 조회 API 엔드포인트 내 BOLA/IDOR 취약점',
    category: 'IDOR',
    severity: 'High',
    cvssScore: 8.5,
    targetEndpoint: 'https://online.fincorp-bank.com/api/v2/accounts/{id}/summary',
    proofOfConcept: '사용자 식별 번호 변경 시 타 사용자의 계좌 잔액 및 거래 내역 무단 열람 가능 확인',
    status: 'Resolved',
    bountyEarned: 9500,
    submittedAt: '3일 전',
  },
];

export const INITIAL_MESSAGES: PhoneMessage[] = [
  {
    id: 'msg-1',
    sender: '보안팀 관리자',
    avatar: '🛡️',
    time: '오전 09:30',
    content: '테스트 환경이 새롭게 구축되었습니다. 터미널 기본 기능과 Finefox 웹 브라우저가 정상 작동하는지 확인해 주세요.',
    unread: true,
  },
  {
    id: 'msg-2',
    sender: '시스템 알림',
    avatar: '⚙️',
    time: '오전 09:15',
    content: '우분투 기반 데스크톱 및 Finefox 브라우저 설정이 완료되었습니다.',
    unread: false,
  },
];

export const INITIAL_NETWORK_NODES: NetworkNode[] = [
  {
    id: 'node-router',
    label: '게이트웨이 라우터',
    role: 'Router',
    ip: '192.168.1.1',
    hostname: 'gateway.lan',
    ports: [
      { port: 80, service: 'http', state: 'open' },
      { port: 53, service: 'dns', state: 'open' },
      { port: 22, service: 'ssh', state: 'open' },
    ],
    compromised: true,
    x: 200,
    y: 140,
  },
  {
    id: 'node-workstation',
    label: '테스트 워크스테이션',
    role: 'Workstation',
    ip: '192.168.1.2',
    hostname: 'bearos-kali.lan',
    ports: [
      { port: 22, service: 'ssh', state: 'open' },
      { port: 3000, service: 'http-dev', state: 'open' },
    ],
    compromised: true,
    x: 420,
    y: 140,
  },
  {
    id: 'node-server',
    label: '사내 웹 서버',
    role: 'Server',
    ip: '192.168.1.50',
    hostname: 'web-portal.lan',
    ports: [
      { port: 80, service: 'http', state: 'open' },
      { port: 443, service: 'https', state: 'open' },
    ],
    compromised: false,
    x: 640,
    y: 140,
  },
];

export const HANDBOOK_ARTICLES = [
  {
    id: 'intro',
    title: '시스템 기본 사용 가이드',
    category: '기본 사용법',
    content: `
### 시스템 테스트 환경 안내

본 환경은 **우분투 및 GNOME 데스크톱** 기반의 테스트 시스템입니다.

#### 기본 사용 팁
1. **터미널**: 하단 도크 또는 바탕화면의 터미널을 열어 기본 리눅스 명령어를 실행할 수 있습니다.
2. **Finefox 브라우저**: 파인애플 여우 아이콘의 브라우저를 통해 Geogle 검색, BCC 뉴스, 금융 및 호텔 웹사이트를 이용할 수 있습니다.
3. **패키지 관리**: \`sudo apt update\` 및 \`sudo apt install <패키지>\` 명령어로 필요한 도구를 설치할 수 있습니다.
    `,
  },
  {
    id: 'network',
    title: '네트워크 상태 확인 및 진단',
    category: '네트워크',
    content: `
### 네트워크 진단 명령어

네트워크 어댑터 및 IP 구성을 확인하는 표준 명령어입니다:

\`\`\`bash
ifconfig
\`\`\`

게이트웨이 라우터 통신 여부 확인:

\`\`\`bash
ping -c 4 192.168.1.1
\`\`\`
    `,
  },
];
