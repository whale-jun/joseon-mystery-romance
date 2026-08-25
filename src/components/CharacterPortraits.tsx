import React from 'react';
import { CHARACTERS } from '../data/characters';
import { EmotionType } from '../types/game';
import { AnimeAvatar } from './AnimeAvatars';

interface ActiveChar {
  id: string;
  position: 'left' | 'center' | 'right';
  emotion?: EmotionType;
  isSpeaking: boolean;
}

interface CharacterPortraitsProps {
  activeCharacters?: ActiveChar[];
}

export const CharacterPortraits: React.FC<CharacterPortraitsProps> = ({ activeCharacters }) => {
  if (!activeCharacters || activeCharacters.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-end justify-between px-4 sm:px-16 pb-36 sm:pb-48 z-10 select-none">
      {activeCharacters.map((char) => {
        const charData = CHARACTERS[char.id];
        if (!charData) return null;

        const isLeft = char.position === 'left';
        const isRight = char.position === 'right';
        const emotion = char.emotion || 'normal';

        const positionClass = isLeft
          ? 'self-end mr-auto'
          : isRight
          ? 'self-end ml-auto'
          : 'self-end mx-auto';

        return (
          <div
            key={char.id}
            className={`relative transition-all duration-700 transform ${positionClass} w-[210px] h-[330px] sm:w-[280px] sm:h-[420px] md:w-[320px] md:h-[460px] ${
              char.isSpeaking
                ? 'scale-105 filter drop-shadow-[0_0_35px_rgba(251,191,36,0.5)] brightness-110 z-20 animate-float'
                : 'scale-95 brightness-80 opacity-85 z-10'
            }`}
          >
            {/* Anime Expressive Overlays */}
            {emotion === 'blush' && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30 pointer-events-none animate-bounce">
                <span className="text-2xl filter drop-shadow-md">🌸</span>
                <span className="text-xl filter drop-shadow-md">✨</span>
              </div>
            )}
            {emotion === 'shock' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] z-30 animate-bounce">
                ⚡ !? ⚡
              </div>
            )}
            {emotion === 'nervous' && (
              <div className="absolute top-12 right-12 text-2xl text-cyan-300 drop-shadow-md z-30 animate-pulse">
                💧
              </div>
            )}
            {emotion === 'resolute' && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-2xl text-amber-400 drop-shadow-md z-30 animate-pulse">
                🔥
              </div>
            )}

            {/* Glowing Anime Character Portrait */}
            <div className="relative w-full h-full flex flex-col items-center justify-end">
              <AnimeAvatar
                characterId={char.id}
                emotion={emotion}
                className="w-full h-full object-contain"
              />

              {/* Character Name & Speaking Badge */}
              <div
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border shadow-xl flex items-center gap-2 transition-all duration-300 ${
                  char.isSpeaking
                    ? 'bg-gradient-to-r from-[#8b1e1e] via-[#c23b22] to-[#8b1e1e] border-amber-300 text-amber-100 scale-105 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
                    : 'bg-black/70 border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-xs">{charData.avatarIcon}</span>
                <span className="text-xs font-traditional font-bold tracking-wider">
                  {charData.name}
                </span>
                {char.isSpeaking && (
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
