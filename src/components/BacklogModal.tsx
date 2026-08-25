import React from 'react';
import { X, History, MessageSquare } from 'lucide-react';

interface BacklogItem {
  speaker: string;
  text: string;
  chapter: number;
}

interface BacklogModalProps {
  history: BacklogItem[];
  onClose: () => void;
}

export const BacklogModal: React.FC<BacklogModalProps> = ({ history, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      <div className="relative w-full max-w-3xl max-h-[88dvh] bg-[#121622] border-2 border-amber-400/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 sm:h-16 bg-gradient-to-r from-[#182238] via-[#24314c] to-[#182238] border-b border-amber-500/40 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-traditional font-bold text-amber-200">
                대사 기록 (言辭 記錄)
              </h2>
              <p className="text-xs font-batang text-slate-400">
                지금까지 진행된 대사와 사건의 흐름을 다시 읽습니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-red-900/60 border border-slate-600 hover:border-red-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Backlog List */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#0a0d14]/70 flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 font-batang text-sm">
              기록된 대사가 없습니다.
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#141926] border border-slate-800 rounded-xl shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5 border-b border-slate-800/80 pb-1">
                  <span className="text-xs font-traditional font-bold text-amber-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3 text-amber-400" />
                    {item.speaker}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    제{item.chapter}장
                  </span>
                </div>
                <p className="text-sm font-batang text-[#eae4d3] leading-relaxed whitespace-pre-line">
                  {item.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
