import React from 'react';
import { BookOpen, Users, History, Settings, Heart, Shield } from 'lucide-react';

interface HeaderProps {
  chapterTitle: string;
  affection: number;
  trust: number;
  cluesCount: number;
  hasNewClue?: boolean;
  onOpenNotebook: () => void;
  onOpenRelationship: () => void;
  onOpenBacklog: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  chapterTitle,
  affection,
  trust,
  cluesCount,
  hasNewClue,
  onOpenNotebook,
  onOpenRelationship,
  onOpenBacklog,
  onOpenSettings,
}) => {
  // Extract clean compact title (e.g. "제1장", "제2장", "제3장", "프롤로그", "최종장")
  const shortTitle = chapterTitle.includes(':')
    ? chapterTitle.split(':')[0].trim()
    : chapterTitle;

  return (
    <header className="absolute top-0 inset-x-0 z-40 bg-gradient-to-b from-[#080a10]/98 via-[#0e121d]/90 to-transparent backdrop-blur-md border-b border-[#d4af37]/20 flex flex-col justify-center px-3 sm:px-6 select-none pt-[max(env(safe-area-inset-top),0.6rem)] pb-2 transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Compact Chapter Title & Mobile Gauges */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a233a]/90 border border-[#d4af37]/50 rounded-lg shadow-sm shrink-0">
            <span className="text-amber-400 text-xs shrink-0">🌙</span>
            <span className="text-xs sm:text-sm font-traditional font-bold text-[#f3e9d2] tracking-wider whitespace-nowrap">
              {shortTitle}
            </span>
          </div>

          {/* Compact Mobile Affection/Trust Pills */}
          <div className="flex items-center gap-1.5 lg:hidden shrink-0">
            <span className="flex items-center gap-0.5 text-[10px] font-mono text-pink-300 bg-pink-950/60 border border-pink-500/40 px-1.5 py-0.5 rounded-full">
              🌸{affection}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-1.5 py-0.5 rounded-full">
              🗡️{trust}
            </span>
          </div>
        </div>

        {/* Desktop Romance & Trust Stats Gauges */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Affection (연심) */}
          <div className="flex items-center gap-2 bg-[#2a131b]/70 border border-pink-500/30 px-3 py-1 rounded-full shadow-inner">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
            <span className="text-xs font-traditional text-pink-200">연심 (戀心)</span>
            <div className="w-20 h-2.5 bg-black/60 rounded-full overflow-hidden border border-pink-900/50">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, affection)}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono font-bold text-pink-300">{affection}</span>
          </div>

          {/* Trust (신뢰도) */}
          <div className="flex items-center gap-2 bg-[#12232c]/70 border border-cyan-500/30 px-3 py-1 rounded-full shadow-inner">
            <Shield className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span className="text-xs font-traditional text-cyan-200">신뢰 (信賴)</span>
            <div className="w-20 h-2.5 bg-black/60 rounded-full overflow-hidden border border-cyan-900/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, trust)}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300">{trust}</span>
          </div>
        </div>

        {/* Action Buttons (Aligned, compact & clean) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Clue Notebook Button */}
          <button
            onClick={onOpenNotebook}
            className="relative flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-[#1b2234] hover:bg-[#25304a] text-[#f7f3e8] border border-[#d4af37]/40 rounded-lg text-xs font-traditional transition-all shadow-md active:scale-95 cursor-pointer touch-manipulation min-h-[34px]"
            title="단서 수첩 열기"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">단서</span>
            <span className="px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded font-mono text-[10px] border border-amber-500/30">
              {cluesCount}
            </span>
            {hasNewClue && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            )}
          </button>

          {/* Relationship Map */}
          <button
            onClick={onOpenRelationship}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-[#1b2234] hover:bg-[#25304a] text-[#f7f3e8] border border-[#d4af37]/40 rounded-lg text-xs font-traditional transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1 touch-manipulation min-h-[34px]"
            title="인물 관계도"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">관계</span>
          </button>

          {/* Backlog Log */}
          <button
            onClick={onOpenBacklog}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-[#1b2234] hover:bg-[#25304a] text-[#f7f3e8] border border-[#d4af37]/40 rounded-lg text-xs font-traditional transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1 touch-manipulation min-h-[34px]"
            title="지난 대사 보기"
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">로그</span>
          </button>

          {/* Consolidated Settings (Gear ⚙️) Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-[#1b2234] hover:bg-[#25304a] text-amber-300 border border-[#d4af37]/50 rounded-lg text-xs font-traditional transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1 touch-manipulation min-h-[34px]"
            title="환경 설정 (소리, 저장, 텍스트 속도)"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span className="hidden sm:inline">설정</span>
          </button>
        </div>
      </div>
    </header>
  );
};
