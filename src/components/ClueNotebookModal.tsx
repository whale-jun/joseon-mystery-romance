import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Key, HelpCircle } from 'lucide-react';
import { CLUES } from '../data/clues';
import { Clue } from '../types/game';
import { soundEngine } from '../utils/soundEngine';

interface ClueNotebookModalProps {
  collectedClueIds: string[];
  onClose: () => void;
}

export const ClueNotebookModal: React.FC<ClueNotebookModalProps> = ({
  collectedClueIds,
  onClose,
}) => {
  const [selectedChapterTab, setSelectedChapterTab] = useState<number | 'all'>('all');
  const [selectedClue, setSelectedClue] = useState<Clue | null>(() => {
    return collectedClueIds.length > 0 ? CLUES[collectedClueIds[0]] : null;
  });

  const collectedClues = collectedClueIds
    .map((id) => CLUES[id])
    .filter((clue): clue is Clue => !!clue);

  const filteredClues =
    selectedChapterTab === 'all'
      ? collectedClues
      : collectedClues.filter((c) => c.chapter === selectedChapterTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      <div className="relative w-full max-w-4xl max-h-[88dvh] h-[580px] bg-[#121622] border-2 border-amber-400/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="h-14 sm:h-16 bg-gradient-to-r from-[#182238] via-[#24314c] to-[#182238] border-b border-amber-500/40 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-traditional font-bold text-amber-200">
                연화의 추리 단서 수첩 (證據 記錄)
              </h2>
              <p className="hidden sm:block text-xs font-batang text-slate-400">
                사건 현장에서 수집한 모든 물증과 밀서, 증언의 기록
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-red-900/60 border border-slate-600 hover:border-red-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chapter Tabs */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2 bg-[#0d101a] border-b border-slate-800 shrink-0 overflow-x-auto">
          <button
            onClick={() => setSelectedChapterTab('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-traditional transition-colors cursor-pointer shrink-0 ${
              selectedChapterTab === 'all'
                ? 'bg-amber-500/20 border border-amber-400 text-amber-200 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            전체 ({collectedClues.length})
          </button>
          {[1, 2, 3].map((chap) => {
            const count = collectedClues.filter((c) => c.chapter === chap).length;
            return (
              <button
                key={chap}
                onClick={() => setSelectedChapterTab(chap)}
                className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-traditional transition-colors cursor-pointer shrink-0 ${
                  selectedChapterTab === chap
                    ? 'bg-amber-500/20 border border-amber-400 text-amber-200 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                제{chap}장 ({count})
              </button>
            );
          })}
        </div>

        {/* Content Area: Left List / Right Details */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Left Clue List */}
          <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-800 p-2 sm:p-3 overflow-y-auto max-h-[140px] sm:max-h-none flex flex-row sm:flex-col gap-2 shrink-0">
            {filteredClues.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 font-batang text-xs">
                <p>아직 수집된 단서가 없습니다.</p>
                <p className="mt-1">현장을 탐색하여 단서를 찾으십시오.</p>
              </div>
            ) : (
              filteredClues.map((clue) => {
                const isSelected = selectedClue?.id === clue.id;
                return (
                  <button
                    key={clue.id}
                    onClick={() => {
                      soundEngine.playSfx('item');
                      setSelectedClue(clue);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/40 text-amber-200 shadow-md'
                        : 'border-slate-800 bg-[#161a28]/60 hover:bg-[#1f2538] text-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{clue.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-traditional font-bold truncate">
                        {clue.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-batang truncate">
                        제{clue.chapter}장 · {clue.summary}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Clue Details View */}
          <div className="w-2/3 p-6 overflow-y-auto bg-[#0a0d14]/70 flex flex-col justify-between">
            {selectedClue ? (
              <div>
                {/* Clue Header */}
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl filter drop-shadow-md">{selectedClue.icon}</span>
                    <div>
                      <h3 className="text-xl font-traditional font-bold text-amber-200">
                        {selectedClue.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-traditional bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                          제{selectedClue.chapter}장 사건 증거
                        </span>
                        <span className="text-[11px] font-traditional bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                          {selectedClue.category === 'physical'
                            ? '물증(物證)'
                            : selectedClue.category === 'document'
                            ? '문서(文書)'
                            : selectedClue.category === 'secret'
                            ? '비밀 서찰(密書)'
                            : '증언(證言)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Info */}
                <div className="mb-6">
                  <h4 className="text-xs font-traditional font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    상세 감식 및 기록 내용
                  </h4>
                  <div className="p-4 bg-[#141926] border border-slate-700/80 rounded-xl text-sm font-batang text-[#f3ede0] leading-relaxed whitespace-pre-line">
                    {selectedClue.detailedInfo}
                  </div>
                </div>

                {/* Secret Deduction Hint */}
                {selectedClue.secretHint && (
                  <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-traditional font-bold text-amber-300 mb-1">
                        연화의 은밀한 추리 메모
                      </div>
                      <p className="text-xs font-batang text-amber-100/90 leading-relaxed">
                        {selectedClue.secretHint}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 font-batang text-sm">
                <HelpCircle className="w-12 h-12 text-slate-700 mb-2" />
                <p>단서를 선택하여 상세 내용을 확인하십시오.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
