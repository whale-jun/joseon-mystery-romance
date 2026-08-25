import React, { useState } from 'react';
import { Scroll, Sparkles, CheckCircle, HelpCircle } from 'lucide-react';
import { CipherPuzzle } from '../types/game';
import { soundEngine } from '../utils/soundEngine';

interface CipherMinigameProps {
  puzzle: CipherPuzzle;
  onSuccess: () => void;
}

export const CipherMinigame: React.FC<CipherMinigameProps> = ({ puzzle, onSuccess }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleSelect = (idx: number) => {
    setSelectedOptionIndex(idx);
    const option = puzzle.options[idx];

    if (option.isCorrect) {
      soundEngine.playSfx('reveal');
      setFeedback({ isCorrect: true, message: option.explanation });
    } else {
      soundEngine.playSfx('fail');
      setFeedback({ isCorrect: false, message: option.explanation });
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-6 select-none bg-black/70 backdrop-blur-sm pt-[max(env(safe-area-inset-top),1.2rem)] pb-[max(env(safe-area-inset-bottom),5.5rem)] sm:pb-6 overflow-y-auto">
      {/* Top Banner */}
      <div className="w-full max-w-3xl mx-auto bg-gradient-to-r from-[#1a233a]/95 via-[#2b3a58]/95 to-[#1a233a]/95 border-2 border-amber-400/80 rounded-xl p-4 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
            <Scroll className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-traditional font-bold text-amber-200">
              {puzzle.title}
            </h2>
            <p className="text-xs font-batang text-slate-300">
              궁중 한시와 비밀 은어(隱語)를 해독하십시오.
            </p>
          </div>
        </div>
      </div>

      {/* Cipher Grid Table & Lore Text */}
      <div className="w-full max-w-3xl mx-auto my-4 bg-gradient-to-b from-[#181a24]/95 via-[#1e2333]/95 to-[#12141c]/95 border-2 border-[#d4af37]/60 rounded-2xl p-6 shadow-2xl">
        <p className="text-sm font-batang text-slate-300 mb-4 leading-relaxed">
          {puzzle.loreText}
        </p>

        {/* Decipher Reference Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {puzzle.cipherGrid.map((item, i) => (
            <div
              key={i}
              className="p-2.5 bg-black/40 rounded-lg border border-amber-500/30 flex flex-col items-center text-center"
            >
              <span className="text-base font-traditional font-bold text-amber-300">
                {item.hanja}
              </span>
              <span className="text-xs font-batang text-slate-300 mt-0.5">
                {item.korean}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 mt-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                {item.code}
              </span>
            </div>
          ))}
        </div>

        {/* Main Question */}
        <div className="p-4 bg-amber-950/30 border border-amber-500/50 rounded-xl mb-4 text-center">
          <p className="text-base md:text-lg font-traditional font-bold text-amber-200">
            {puzzle.question}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {puzzle.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`p-3.5 rounded-xl border text-left font-batang text-sm transition-all cursor-pointer ${
                selectedOptionIndex === idx
                  ? option.isCorrect
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-red-950/60 border-red-400 text-red-100'
                  : 'bg-slate-900/70 border-slate-700 hover:border-amber-500/60 hover:bg-slate-800/70 text-[#f7f3e8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-black/40 border border-amber-400/40 flex items-center justify-center text-xs font-bold text-amber-300">
                  {idx + 1}
                </span>
                <span>{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Hint button */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 font-traditional cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>해독 힌트 {showHint ? '숨기기' : '보기'}</span>
          </button>
          {showHint && (
            <span className="text-xs font-batang text-amber-200/90 bg-black/40 px-3 py-1 rounded-md border border-amber-500/30">
              💡 {puzzle.hint}
            </span>
          )}
        </div>
      </div>

      {/* Result Feedback Modal */}
      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#141a29] border-2 border-amber-400 rounded-2xl p-6 shadow-2xl text-center">
            {feedback.isCorrect ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-traditional font-bold text-emerald-300 mb-2">
                  암호 해독 성공!
                </h3>
                <p className="text-base font-batang text-[#f3ede0] leading-relaxed my-4 whitespace-pre-line">
                  {feedback.message}
                </p>
                <button
                  onClick={onSuccess}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-traditional font-bold rounded-xl shadow-lg cursor-pointer transition-all active:scale-[0.99]"
                >
                  현장으로 출동하기
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-traditional font-bold text-red-400 mb-2">
                  해독 실패
                </h3>
                <p className="text-base font-batang text-[#f3ede0] leading-relaxed my-4 whitespace-pre-line">
                  {feedback.message}
                </p>
                <button
                  onClick={() => setFeedback(null)}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-traditional font-bold rounded-xl shadow-lg cursor-pointer transition-all"
                >
                  다시 해독하기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
