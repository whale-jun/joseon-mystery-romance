import React, { useState } from 'react';
import { ShieldAlert, Sparkles, CheckCircle, XCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { DeductionBattle, DeductionContradiction } from '../types/game';
import { CLUES } from '../data/clues';
import { soundEngine } from '../utils/soundEngine';

interface DeductionBattleViewProps {
  battle: DeductionBattle;
  collectedClueIds: string[];
  onVictory: () => void;
  onDefeat: () => void;
}

export const DeductionBattleView: React.FC<DeductionBattleViewProps> = ({
  battle,
  collectedClueIds,
  onVictory,
  onDefeat,
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [battleFeedback, setBattleFeedback] = useState<{
    status: 'success' | 'fail' | null;
    message: string;
  }>({ status: null, message: '' });
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [showHint, setShowHint] = useState(false);

  const currentContradiction: DeductionContradiction =
    battle.contradictions[currentPhaseIndex];

  const handlePresentClue = () => {
    if (!selectedClueId) return;

    if (selectedClueId === currentContradiction.correctClueId) {
      // Success!
      soundEngine.playSfx('reveal');
      setBattleFeedback({
        status: 'success',
        message: currentContradiction.rebuttalDialogue,
      });
    } else {
      // Fail!
      soundEngine.playSfx('fail');
      const nextAttempts = attemptsLeft - 1;
      setAttemptsLeft(nextAttempts);

      if (nextAttempts <= 0) {
        setBattleFeedback({
          status: 'fail',
          message: '추리가 완전히 빗나갔습니다! 상대방의 억지에 휘말렸습니다.',
        });
      } else {
        setBattleFeedback({
          status: 'fail',
          message: currentContradiction.failDialogue,
        });
      }
    }
  };

  const handleNextPhase = () => {
    setBattleFeedback({ status: null, message: '' });
    setSelectedClueId(null);
    setShowHint(false);

    if (currentPhaseIndex + 1 < battle.contradictions.length) {
      setCurrentPhaseIndex((prev) => prev + 1);
    } else {
      // Complete victory
      soundEngine.playSfx('success');
      onVictory();
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-6 select-none bg-black/70 backdrop-blur-sm pt-[max(env(safe-area-inset-top),1.2rem)] pb-[max(env(safe-area-inset-bottom),1.2rem)] overflow-y-auto">
      {/* Top Confrontation Banner */}
      <div className="w-full max-w-3xl mx-auto bg-gradient-to-r from-[#3b0a0a]/95 via-[#5c1313]/95 to-[#3b0a0a]/95 border-2 border-red-500/80 rounded-xl p-4 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center text-red-300">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-traditional font-bold text-red-200">
              {battle.title}
            </h2>
            <p className="text-xs font-batang text-slate-300">
              상대방: {battle.opponentName} ({battle.opponentTitle})
            </p>
          </div>
        </div>

        {/* Life / Confidence Gauge */}
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-red-500/40">
          <span className="text-xs font-traditional text-red-300">남은 기회:</span>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < attemptsLeft ? 'text-red-400' : 'text-slate-600 opacity-40'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Opponent Statement Box */}
      <div className="w-full max-w-3xl mx-auto my-4 bg-gradient-to-b from-[#181111]/95 via-[#231515]/95 to-[#150d0d]/95 border-2 border-amber-500/70 rounded-2xl p-6 shadow-2xl relative">
        <div className="absolute -top-4 left-6 px-3 py-1 bg-red-800 text-amber-100 text-xs font-traditional font-bold rounded-md border border-amber-400">
          {battle.opponentAvatar} {battle.opponentName}의 진술
        </div>

        <div className="mt-2 text-base md:text-lg font-batang text-[#ffe8e8] leading-relaxed italic">
          {currentContradiction.suspectStatement}
        </div>

        {/* Hint button */}
        <div className="mt-4 flex items-center justify-between border-t border-red-950/60 pt-3">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 font-traditional cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>추리 힌트 {showHint ? '숨기기' : '보기'}</span>
          </button>
          {showHint && (
            <span className="text-xs font-batang text-amber-200/90 bg-black/40 px-3 py-1 rounded-md border border-amber-500/30">
              💡 {currentContradiction.hint}
            </span>
          )}
        </div>
      </div>

      {/* Clue Selection Shelf */}
      <div className="w-full max-w-4xl mx-auto bg-[#0e1320]/90 border-2 border-[#d4af37]/40 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-traditional font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            진술의 모순을 반박할 단서를 선택하여 제시하십시오:
          </span>
          <span className="text-[11px] text-slate-400 font-batang">
            보유 단서 {collectedClueIds.length}개
          </span>
        </div>

        {/* Clue Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-44 overflow-y-auto pr-1">
          {collectedClueIds.map((cid) => {
            const clue = CLUES[cid];
            if (!clue) return null;
            const isSelected = selectedClueId === cid;

            return (
              <button
                key={cid}
                onClick={() => {
                  soundEngine.playSfx('item');
                  setSelectedClueId(cid);
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/50 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-[1.02]'
                    : 'border-slate-700 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{clue.icon}</span>
                  <span className="text-xs font-traditional font-bold text-amber-200 truncate">
                    {clue.title}
                  </span>
                </div>
                <p className="text-[11px] font-batang text-slate-300 line-clamp-2 leading-tight">
                  {clue.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Present Clue Action Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handlePresentClue}
            disabled={!selectedClueId}
            className={`px-8 py-3 rounded-xl font-traditional font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2 ${
              selectedClueId
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white border border-rose-300 active:scale-95 shadow-[0_0_25px_rgba(225,29,72,0.5)]'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>이 증거를 보시오! (증거 제시)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Result Feedback Popup Modal */}
      {battleFeedback.status && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#141a29] border-2 border-amber-400 rounded-2xl p-6 shadow-2xl text-center">
            {battleFeedback.status === 'success' ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-traditional font-bold text-emerald-300 mb-2">
                  정곡을 찌르는 추리! (모순 논파)
                </h3>
                <p className="text-base font-batang text-[#f3ede0] leading-relaxed my-4 whitespace-pre-line">
                  {battleFeedback.message}
                </p>
                <button
                  onClick={handleNextPhase}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-traditional font-bold rounded-xl shadow-lg cursor-pointer transition-all active:scale-[0.99]"
                >
                  다음으로 진행
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center text-red-300 animate-pulse">
                  <XCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-traditional font-bold text-red-400 mb-2">
                  {attemptsLeft <= 0 ? '추리 실패' : '모순을 밝히지 못했습니다!'}
                </h3>
                <p className="text-base font-batang text-[#f3ede0] leading-relaxed my-4 whitespace-pre-line">
                  {battleFeedback.message}
                </p>
                {attemptsLeft <= 0 ? (
                  <button
                    onClick={onDefeat}
                    className="w-full py-3 bg-red-800 hover:bg-red-700 text-white font-traditional font-bold rounded-xl shadow-lg cursor-pointer transition-all"
                  >
                    패배 인정 및 다시 시도하기
                  </button>
                ) : (
                  <button
                    onClick={() => setBattleFeedback({ status: null, message: '' })}
                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-traditional font-bold rounded-xl shadow-lg cursor-pointer transition-all"
                  >
                    다시 단서 선택하기
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
