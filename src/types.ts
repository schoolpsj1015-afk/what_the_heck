export type WindowId = 
  | 'browser'
  | 'terminal'
  | 'handbook'
  | 'wireshark'
  | 'code-editor'
  | 'settings';

export interface AppWindow {
  id: WindowId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
}

export interface AptPackage {
  name: string;
  description: string;
  version: string;
  size: string;
  installed: boolean;
  executableName: string;
}

export interface BugBountyProgram {
  id: string;
  name: string;
  company: string;
  logo: string;
  scope: string[];
  outOfScope: string[];
  rewardRange: string;
  maxBounty: number;
  vulnerabilityTypes: string[];
  activeHunters: number;
  resolvedReports: number;
  description: string;
}

export interface VulnerabilityReport {
  id: string;
  programId: string;
  programName: string;
  title: string;
  category: 'RCE' | 'SQLi' | 'Auth Bypass' | 'JWT Manipulation' | 'IDOR' | 'XSS' | 'SSRF';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cvssScore: number;
  targetEndpoint: string;
  proofOfConcept: string;
  status: 'Under Review' | 'Triaged' | 'Resolved' | 'Rewarded';
  bountyEarned: number;
  submittedAt: string;
}

export interface MissionObjective {
  id: string;
  title: string;
  hint?: string;
  shortcutCommand?: string;
  completed: boolean;
  alwaysShow?: boolean; // '*' mark in story description: shown without needing previous step completed
  chapterId: number;
  stepNumber: number;
}

export interface MissionChapter {
  chapterId: number;
  title: string;
  subtitle?: string;
  objectives: MissionObjective[];
}

export interface PhoneMessage {
  id: string;
  sender: string;
  avatar: string;
  time: string;
  content: string;
  unread: boolean;
  isIncomingCall?: boolean;
}

export interface NetworkNode {
  id: string;
  label: string;
  role: 'Workstation' | 'Router' | 'Firewall' | 'Server';
  ip: string;
  hostname: string;
  ports: { port: number; service: string; state: 'open' | 'filtered' | 'closed' }[];
  compromised: boolean;
  x: number;
  y: number;
}
