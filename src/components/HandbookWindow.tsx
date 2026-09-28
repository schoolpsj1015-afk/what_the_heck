import React, { useState } from 'react';
import { Search, ArrowLeft, BookOpen, Copy, Check, Play, Terminal } from 'lucide-react';
import { HANDBOOK_ARTICLES } from '../data/mockData';
import { sound } from '../utils/audio';

interface HandbookWindowProps {
  onExecuteCommand: (command: string) => void;
}

export const HandbookWindow: React.FC<HandbookWindowProps> = ({ onExecuteCommand }) => {
  const [selectedArticleId, setSelectedArticleId] = useState('decoding-token');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const selectedArticle = HANDBOOK_ARTICLES.find(a => a.id === selectedArticleId) || HANDBOOK_ARTICLES[0];

  const filteredArticles = HANDBOOK_ARTICLES.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    sound.playNotification();
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Search & Navigation Bar */}
      <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            sound.playKeypress();
            setSelectedArticleId('finding-passwords');
          }}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> 뒤로가기
        </button>

        <div className="flex-1 max-w-md relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="핸드북 가이드 및 공격 기법 검색..."
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          <button
            onClick={() => sound.playKeypress()}
            className="ml-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs transition-colors cursor-pointer"
          >
            검색
          </button>
        </div>
      </div>

      {/* Main Split Layout: Sidebar list + Detail view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Topics List */}
        <div className="w-56 md:w-64 bg-slate-900/60 border-r border-slate-800 p-2 overflow-y-auto space-y-1 shrink-0">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 font-sans">
            침투 작전 공략 가이드
          </div>

          {filteredArticles.map((article) => {
            const isSelected = article.id === selectedArticleId;
            return (
              <button
                key={article.id}
                onClick={() => {
                  setSelectedArticleId(article.id);
                  sound.playKeypress();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col gap-0.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-cyan-300 font-semibold border-l-2 border-cyan-400'
                    : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <span>{article.title}</span>
                <span className="text-[10px] text-slate-500 font-normal">{article.category}</span>
              </button>
            );
          })}
        </div>

        {/* Right Article Content */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto bg-slate-950/80 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              {selectedArticle.category}
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {selectedArticle.title}
            </h2>
          </div>

          <div className="space-y-4 text-xs text-slate-200 leading-relaxed font-sans">
            <div className="whitespace-pre-line text-slate-300">
              {selectedArticle.content}
            </div>

            {/* Quick interactive action triggers */}
            {selectedArticle.id === 'decoding-token' && (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 mt-4">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase font-sans">터미널 즉시 실행 명령어:</span>
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                  <span className="truncate mr-2">python3 ./jwt_decoder.py eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy('python3 ./jwt_decoder.py eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 'jwt-cmd')}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                      title="명령어 복사"
                    >
                      {copiedIndex === 'jwt-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        sound.playKeypress();
                        onExecuteCommand('python3 ./jwt_decoder.py eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
                      }}
                      className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] flex items-center gap-1 font-sans cursor-pointer"
                    >
                      <Play className="w-3 h-3" /> 터미널에서 실행
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedArticle.id === 'hijack-firewall' && (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 mt-4">
                <span className="text-[11px] font-semibold text-amber-400 uppercase font-sans">방화벽 공격 페이로드 실행:</span>
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                  <span>python3 /home/kali/downloads/kimai.py 165.61.40.95</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy('python3 /home/kali/downloads/kimai.py 165.61.40.95', 'kimai-cmd')}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                      title="명령어 복사"
                    >
                      {copiedIndex === 'kimai-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        sound.playKeypress();
                        onExecuteCommand('python3 /home/kali/downloads/kimai.py 165.61.40.95');
                      }}
                      className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] flex items-center gap-1 font-sans cursor-pointer"
                    >
                      <Play className="w-3 h-3" /> 터미널에서 실행
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
