import React, { useState } from 'react';
import { Leaf, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { HerbPuzzle } from '../types/game';
import { soundEngine } from '../utils/soundEngine';

interface HerbMinigameProps {
  puzzle: HerbPuzzle;
  onSuccess: () => void;
}

export const HerbMinigame: React.FC<HerbMinigameProps> = ({ puzzle, onSuccess }) => {
  const [selectedHerbIds, setSelectedHerbIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const toggleHerb = (id: string) => {
    soundEngine.playSfx('item');
    setSelectedHerbIds((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const handleVerify = () => {
    const isCorrect =
      puzzle.targetHerbIds.length === selectedHerbIds.length &&
      puzzle.targetHerbIds.every((id) => selectedHerbIds.includes(id));

    if (isCorrect) {
      soundEngine.playSfx('reveal');
      setFeedback({ isCorrect: true, message: puzzle.explanation });
    } else {
      soundEngine.playSfx('fail');
      setFeedback({
        isCorrect: false,
        message: '선택한 약재/독물이 피해자의 증상 또는 해독 공식과 일치하지 않습니다. 다시 감별하십시오.',
      });
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-6 select-none bg-black/70 backdrop-blur-sm pt-[max(env(safe-area-inset-top),1.2rem)] pb-[max(env(safe-area-inset-bottom),1.2rem)] overflow-y-auto">
      {/* Top Banner */}
      <div className="w-full max-w-3xl mx-auto bg-gradient-to-r from-[#14261f]/95 via-[#1e3b30]/95 to-[#14261f]/95 border-2 border-emerald-400/80 rounded-xl p-4 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
            <Leaf className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-traditional font-bold text-emerald-200">
              {puzzle.title}
            </h2>
            <p className="text-xs font-batang text-slate-300">
              {puzzle.patientStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Herbs Identification Grid */}
      <div className="w-full max-w-4xl mx-auto my-4 bg-gradient-to-b from-[#0f1a16]/95 via-[#152520]/95 to-[#0b1411]/95 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {puzzle.herbs.map((herb) => {
            const isSelected = selectedHerbIds.includes(herb.id);

            return (
              <div
                key={herb.id}
                onClick={() => toggleHerb(herb.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-950/60 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.01]'
                    : 'border-slate-700 bg-slate-900/60 hover:border-emerald-600/60 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌿</span>
                    <span className="text-base font-traditional font-bold text-amber-200">
                      {herb.name}
                    </span>
                    <span className="text-xs text-slate-400 font-traditional">
                      ({herb.hanja})
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-traditional px-2 py-0.5 rounded border ${
                      herb.category === 'poison'
                        ? 'bg-red-950/60 border-red-500/40 text-red-300'
                        : herb.category === 'cure'
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 border-slate-600 text-slate-300'
                    }`}
                  >
                    {herb.category === 'poison'
                      ? '맹독물'
                      : herb.category === 'cure'
                      ? '해독/보혈'
                      : '중화제'}
                  </span>
                </div>

                <p className="text-xs font-batang text-slate-200 mb-2 leading-relaxed">
                  {herb.description}
                </p>

                <div className="text-[11px] font-batang text-emerald-300/80 bg-black/40 px-2.5 py-1 rounded border border-emerald-500/20">
                  특징: {herb.smellOrColor}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit verification button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleVerify}
            disabled={selectedHerbIds.length === 0}
            className={`px-8 py-3 rounded-xl font-traditional font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2 ${
              selectedHerbIds.length > 0
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-300 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>약재 성분 확정 및 감별</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#141a29] border-2 border-amber-400 rounded-2xl p-6 shadow-2xl text-center">
            {feedback.isCorrect ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-traditional font-bold text-emerald-300 mb-2">
                  독물 감별 완결!
                </h3>
                <p className="text-base font-batang text-[#f3ede0] leading-relaxed my-4 whitespace-pre-line">
                  {feedback.message}
                </p>
                <button
                  onClick={onSuccess}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-traditional font-bold rounded-xl shadow-lg cursor-pointer transition-all active:scale-[0.99]"
                >
                  결과를 토대로 배후 추궁하기
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-traditional font-bold text-red-400 mb-2">
                  감별 실패
                </h3>
                <p className="text-base font-batang text-[#f3ede0] leading-relaxed my-4 whitespace-pre-line">
                  {feedback.message}
                </p>
                <button
                  onClick={() => setFeedback(null)}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-traditional font-bold rounded-xl shadow-lg cursor-pointer transition-all"
                >
                  다시 확인하기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
