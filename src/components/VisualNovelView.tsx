import React, { useState, useEffect, useRef } from 'react';
import { Play, FastForward, ChevronRight, Sparkles } from 'lucide-react';
import { Choice } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { soundEngine } from '../utils/soundEngine';

interface VisualNovelViewProps {
  speakerId: string | null;
  speakerName?: string;
  dialogue: string;
  choices?: Choice[];
  onSelectChoice: (choice: Choice) => void;
  onAdvance: () => void;
  textSpeed: number; // ms per char
  autoSpeed: number;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
  heroineName?: string;
  heroName?: string;
}

export const VisualNovelView: React.FC<VisualNovelViewProps> = ({
  speakerId,
  speakerName,
  dialogue: rawDialogue,
  choices: rawChoices,
  onSelectChoice,
  onAdvance,
  textSpeed,
  autoSpeed,
  isAutoPlay,
  onToggleAutoPlay,
  heroineName = '연화',
  heroName = '무진',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isSkipping, setIsSkipping] = useState(false);
  const typingTimerRef = useRef<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);

  // Substitute personalized names
  const formatCustomText = (text: string) => {
    let result = text;
    if (heroineName && heroineName !== '연화') {
      result = result.replace(/연화/g, heroineName);
    }
    if (heroName && heroName !== '무진') {
      result = result.replace(/무진/g, heroName);
    }
    return result;
  };

  const dialogue = formatCustomText(rawDialogue);
  const choices = rawChoices?.map((c) => ({
    ...c,
    text: formatCustomText(c.text),
    hint: c.hint ? formatCustomText(c.hint) : undefined,
  }));

  const speakerChar = speakerId ? CHARACTERS[speakerId] : null;
  let rawDisplayName = speakerName || (speakerChar ? speakerChar.name : '나레이션');
  if (speakerId === 'yeonhwa' && heroineName) {
    rawDisplayName = heroineName;
  } else if (speakerId === 'mujin' && heroName) {
    rawDisplayName = heroName;
  }
  const displayName = formatCustomText(rawDisplayName);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);

    if (isSkipping) {
      setDisplayedText(dialogue);
      setIsTyping(false);
      return;
    }

    let charIndex = 0;
    typingTimerRef.current = window.setInterval(() => {
      charIndex++;
      if (charIndex <= dialogue.length) {
        setDisplayedText(dialogue.slice(0, charIndex));
      } else {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, textSpeed);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [dialogue, textSpeed, isSkipping]);

  // Handle Auto Play
  useEffect(() => {
    if (!isTyping && isAutoPlay && (!choices || choices.length === 0)) {
      autoTimerRef.current = window.setTimeout(() => {
        onAdvance();
      }, autoSpeed);
    }
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [isTyping, isAutoPlay, choices, autoSpeed, onAdvance]);

  const handleBoxClick = () => {
    if (isTyping) {
      // Finish typing instantly
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText(dialogue);
      setIsTyping(false);
    } else if (!choices || choices.length === 0) {
      soundEngine.playSfx('footsteps');
      onAdvance();
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 px-3 sm:px-8 md:px-16 z-30 flex flex-col items-center select-none pb-[max(env(safe-area-inset-bottom),5.5rem)] sm:pb-6">
      {/* Choice Buttons (If any choices present & typing finished or skipped) */}
      {choices && choices.length > 0 && !isTyping && (
        <div className="w-full max-w-3xl mb-3 flex flex-col gap-2 max-h-[42dvh] overflow-y-auto pr-1 animate-fadeIn">
          {choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playSfx('chime');
                onSelectChoice(choice);
              }}
              className="group relative w-full text-left p-3.5 sm:p-4 bg-gradient-to-r from-[#181f33]/98 via-[#232c44]/98 to-[#181f33]/98 hover:from-[#32201e]/98 hover:via-[#4a2e2a]/98 hover:to-[#32201e]/98 border-2 border-[#d4af37]/60 hover:border-amber-400 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer touch-manipulation min-h-[48px]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-xs font-traditional text-amber-300 font-bold group-hover:bg-amber-400 group-hover:text-black transition-colors shrink-0 mt-0.5 sm:mt-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm md:text-base font-batang font-medium text-[#fbf7ee] group-hover:text-amber-200 leading-relaxed">
                    {choice.text}
                  </p>
                </div>
                {choice.hint && (
                  <span className="hidden md:flex items-center gap-1 text-[11px] font-traditional text-amber-300/80 bg-black/40 px-2.5 py-1 rounded-full border border-amber-500/20 whitespace-nowrap self-center shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {choice.hint}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Dialogue Box */}
      <div
        onClick={handleBoxClick}
        className="relative w-full max-w-4xl min-h-[135px] sm:min-h-[160px] md:min-h-[180px] max-h-[36dvh] bg-gradient-to-b from-[#111624]/98 via-[#0e1320]/98 to-[#080b13]/99 border-2 border-[#d4af37]/60 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-lg p-4 sm:p-6 md:p-7 flex flex-col justify-between cursor-pointer transition-all hover:border-[#d4af37]/90 touch-manipulation"
      >
        {/* Decorative Dancheong Traditional Corners */}
        <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400/70 pointer-events-none"></div>
        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400/70 pointer-events-none"></div>
        <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400/70 pointer-events-none"></div>
        <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400/70 pointer-events-none"></div>

        {/* Speaker Badge */}
        <div className="absolute -top-4 sm:-top-5 left-5 sm:left-8 flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-[#7a1818] via-[#a82f1b] to-[#7a1818] border-2 border-amber-400/90 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.6)] z-20">
          {speakerChar && (
            <span className="text-base sm:text-lg filter drop-shadow">{speakerChar.avatarIcon}</span>
          )}
          <span className="text-xs sm:text-sm md:text-base font-traditional font-bold text-amber-100 tracking-wider">
            {displayName}
          </span>
          {speakerChar && (
            <span className="hidden sm:inline text-[11px] font-batang text-amber-200/80 ml-0.5">
              [{speakerChar.title}]
            </span>
          )}
        </div>

        {/* Quick Controls Bar (Top Right of dialogue box) */}
        <div className="absolute top-2.5 right-3 sm:right-5 flex items-center gap-1.5 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleAutoPlay();
            }}
            className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-traditional flex items-center gap-1 border transition-colors cursor-pointer touch-manipulation min-h-[28px] ${
              isAutoPlay
                ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                : 'bg-black/50 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className={`w-3 h-3 ${isAutoPlay ? 'animate-spin' : ''}`} />
            <span>자동</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSkipping(!isSkipping);
            }}
            className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-traditional flex items-center gap-1 border transition-colors cursor-pointer touch-manipulation min-h-[28px] ${
              isSkipping
                ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                : 'bg-black/50 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FastForward className="w-3 h-3" />
            <span>스킵</span>
          </button>
        </div>

        {/* Dialogue Text Content */}
        <div className="mt-2.5 sm:mt-2 text-sm sm:text-base md:text-lg font-batang text-[#f3ede0] leading-relaxed whitespace-pre-line tracking-wide pr-4 overflow-y-auto max-h-[22dvh]">
          {displayedText}
          {isTyping && <span className="typewriter-cursor"></span>}
        </div>

        {/* Next Page / Click Arrow Indicator */}
        {!isTyping && (!choices || choices.length === 0) && (
          <div className="self-end flex items-center gap-1 text-[11px] sm:text-xs font-traditional text-amber-300 animate-bounce mt-1">
            <span>다음 터치</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );
};
