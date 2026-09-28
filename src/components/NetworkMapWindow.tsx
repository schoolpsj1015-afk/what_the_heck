import React, { useState } from 'react';
import { NetworkNode } from '../types';
import { sound } from '../utils/audio';
import { Shield, Server, Laptop, Router, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

interface NetworkMapWindowProps {
  nodes: NetworkNode[];
  onExecuteCommand: (cmd: string) => void;
}

export const NetworkMapWindow: React.FC<NetworkMapWindowProps> = ({ nodes, onExecuteCommand }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-firewall');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[3];

  const getNodeIcon = (role: NetworkNode['role']) => {
    switch (role) {
      case 'Workstation': return <Laptop className="w-5 h-5" />;
      case 'Router': return <Router className="w-5 h-5" />;
      case 'Firewall': return <Shield className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide">타겟 네트워크 인프라 토폴로지 맵</h3>
          <p className="text-[11px] text-slate-400">BearOS 서브넷 및 라우팅 경로 탐색기</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 장악 완료 (거점 확보)
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> 취약한 공격 대상 타겟
          </span>
        </div>
      </div>

      {/* Main Split: Topology Graph + Inspector */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Visual Graph Canvas Area */}
        <div className="flex-1 relative bg-slate-950 p-6 flex items-center justify-around flex-wrap gap-6 overflow-y-auto">
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isTarget = node.ip === '165.61.40.95';
            return (
              <div
                key={node.id}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  sound.playKeypress();
                }}
                className={`relative z-10 w-44 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 flex flex-col items-center text-center space-y-2 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/20 shadow-xl shadow-cyan-950/50 scale-105'
                    : node.compromised
                    ? 'bg-slate-900/80 border-emerald-800/60 hover:border-emerald-500'
                    : isTarget
                    ? 'bg-slate-900/80 border-amber-800/60 hover:border-amber-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`p-3 rounded-full ${
                  node.compromised 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' 
                    : isTarget
                    ? 'bg-amber-950 text-amber-400 border border-amber-700'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {getNodeIcon(node.role)}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{node.label}</h4>
                  <div className="text-[11px] font-mono text-cyan-300 font-semibold">{node.ip}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{node.hostname}</div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono">
                  {node.compromised ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> 장악됨 (Pwned)
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" /> 타겟 (Target)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Details Sidebar */}
        <div className="w-full md:w-80 bg-slate-900/90 border-t md:border-t-0 md:border-l border-slate-800 p-4 overflow-y-auto space-y-4 shrink-0 font-sans text-xs">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">{selectedNode.role} 노드 정보</span>
            <h4 className="text-sm font-bold text-white mt-0.5">{selectedNode.label}</h4>
            <div className="font-mono text-xs text-slate-300 mt-1">IP 주소: <span className="text-emerald-400 font-bold">{selectedNode.ip}</span></div>
          </div>

          <div>
            <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-sans">개방된 포트 및 구동 서비스</h5>
            <div className="space-y-1.5 font-mono text-[11px]">
              {selectedNode.ports.map((p, idx) => (
                <div key={idx} className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-cyan-300 font-bold">포트 {p.port}/tcp</span>
                  <span className="text-slate-300">{p.service}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                    {p.state === 'open' ? '열림' : p.state === 'filtered' ? '필터링됨' : '닫힘'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                sound.playKeypress();
                onExecuteCommand(`nmap ${selectedNode.ip}`);
              }}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" /> 터미널에서 {selectedNode.ip} nmap 스캔
            </button>

            {selectedNode.ip === '165.61.40.95' && (
              <button
                onClick={() => {
                  sound.playKeypress();
                  onExecuteCommand(`python3 /home/kali/downloads/kimai.py 165.61.40.95`);
                }}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Kimai 익스플로잇 페이로드 전송
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
