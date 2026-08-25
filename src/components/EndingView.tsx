import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Sparkles, Heart, Shield, BookOpen } from 'lucide-react';
import { ENDINGS } from '../data/endings';
import { unlockEnding } from '../utils/storage';
import { soundEngine } from '../utils/soundEngine';

interface EndingViewProps {
  endingId: string;
  affection: number;
  trust: number;
  cluesCount: number;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export const EndingView: React.FC<EndingViewProps> = ({
  endingId,
  affection,
  trust,
  cluesCount,
  onRestart,
  onReturnTitle,
}) => {
  const ending = ENDINGS[endingId] || ENDINGS['ending_true_romance'];

  useEffect(() => {
    unlockEnding(ending.id);

    if (ending.type === 'true' || ending.type === 'good') {
      soundEngine.playSfx('success');
      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#e07a5f', '#f4a261', '#e76f51', '#2a9d8f'],
      });
    } else {
      soundEngine.playSfx('fail');
    }
  }, [ending]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8 bg-black/90 backdrop-blur-md animate-fadeIn select-none overflow-y-auto pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      <div className="relative w-full max-w-3xl max-h-[88dvh] overflow-y-auto bg-gradient-to-b from-[#141a2c] via-[#101524] to-[#0a0d18] border-2 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.4)] p-5 sm:p-10 flex flex-col items-center text-center my-auto">
        
        {/* Decorative Moon / Blossom */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400/30 via-pink-400/20 to-transparent border border-amber-300 flex items-center justify-center text-4xl shadow-xl mb-4 animate-float">
          {ending.type === 'true' ? '🌸' : ending.type === 'good' ? '🗡️' : '📜'}
        </div>

        {/* Badge */}
        <span className="px-4 py-1 bg-amber-500/20 text-amber-300 font-traditional text-xs font-bold rounded-full border border-amber-400/50 mb-2">
          {ending.badge}
        </span>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-traditional font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 mb-4 tracking-wider">
          {ending.title}
        </h1>

        {/* Quote */}
        <p className="text-sm font-traditional italic text-amber-200/90 mb-6 bg-black/40 px-6 py-2 rounded-xl border border-amber-500/20 max-w-xl">
          {ending.quote}
        </p>

        {/* Epilogue Scroll Story Text */}
        <div className="w-full bg-[#0a0d16]/90 border border-slate-700/80 rounded-2xl p-6 mb-6 text-left shadow-inner">
          <p className="text-sm md:text-base font-batang text-[#f7f2e7] leading-relaxed whitespace-pre-line">
            {ending.epilogue}
          </p>
        </div>

        {/* Final Player Stats */}
        <div className="w-full grid grid-cols-3 gap-3 mb-8">
          <div className="p-3 bg-[#161c2d] border border-pink-500/30 rounded-xl flex flex-col items-center">
            <span className="text-xs font-traditional text-pink-300 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-pink-400" />
              최종 연심
            </span>
            <span className="text-lg font-mono font-bold text-pink-200 mt-1">{affection}</span>
          </div>

          <div className="p-3 bg-[#161c2d] border border-cyan-500/30 rounded-xl flex flex-col items-center">
            <span className="text-xs font-traditional text-cyan-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 fill-cyan-400" />
              최종 신뢰
            </span>
            <span className="text-lg font-mono font-bold text-cyan-200 mt-1">{trust}</span>
          </div>

          <div className="p-3 bg-[#161c2d] border border-amber-500/30 rounded-xl flex flex-col items-center">
            <span className="text-xs font-traditional text-amber-300 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              수집 단서
            </span>
            <span className="text-lg font-mono font-bold text-amber-200 mt-1">{cluesCount}개</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-traditional font-bold text-sm rounded-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>처음부터 다시 플레이</span>
          </button>

          <button
            onClick={onReturnTitle}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#1f273c] hover:bg-[#2c3650] text-[#f7f3e8] border border-[#d4af37]/50 font-traditional font-bold text-sm rounded-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>타이틀 화면으로</span>
          </button>
        </div>
      </div>
    </div>
  );
};
