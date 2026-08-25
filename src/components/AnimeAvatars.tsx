import React, { useState } from 'react';
import { EmotionType } from '../types/game';

import yeonhwaImg from '../../public/characters/yeonhwa.jpg';
import mujinImg from '../../public/characters/mujin.jpg';
import courtLadyParkImg from '../../public/characters/court_lady_park.jpg';
import physicianImg from '../../public/characters/physician.jpg';
import shamanHeukwolImg from '../../public/characters/shaman_heukwol.jpg';

interface AnimeAvatarProps {
  characterId: string;
  emotion?: EmotionType;
  className?: string;
}

const CHARACTER_IMAGE_MAP: Record<string, string> = {
  yeonhwa: yeonhwaImg,
  mujin: mujinImg,
  court_lady_park: courtLadyParkImg,
  physician: physicianImg,
  shaman_heukwol: shamanHeukwolImg,
  concubine_seo: yeonhwaImg,
  eunuch_yoon: physicianImg,
};

export const AnimeAvatar: React.FC<AnimeAvatarProps> = ({
  characterId,
  emotion = 'normal',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = CHARACTER_IMAGE_MAP[characterId];

  return (
    <div className={`relative w-full h-full flex items-end justify-center select-none ${className}`}>
      {/* High-Resolution Makoto Shinkai Style Anime Illustration Card */}
      {!imageError && imageSrc ? (
        <div className="relative w-full h-full max-w-[280px] max-h-[400px] sm:max-w-[320px] sm:max-h-[450px] rounded-2xl overflow-hidden border-2 border-amber-300/60 shadow-[0_15px_35px_rgba(0,0,0,0.85)] bg-black/40">
          <img
            src={imageSrc}
            alt={characterId}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
          />

          {/* Luminous Shinkai Twilight Lighting Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/15 pointer-events-none"></div>

          {/* Subtle Golden / Moonlight Rim Light */}
          <div className="absolute inset-0 rounded-2xl border border-amber-200/30 pointer-events-none shadow-[inset_0_0_20px_rgba(251,191,36,0.2)]"></div>

          {/* Dynamic Emotion Sparkles & Lighting Effects */}
          {(emotion === 'blush' || emotion === 'happy') && (
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-amber-300/10 pointer-events-none animate-pulse"></div>
          )}
          {(emotion === 'resolute' || emotion === 'serious') && (
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 via-transparent to-transparent pointer-events-none"></div>
          )}
        </div>
      ) : (
        /* Fallback Vector Card */
        <div className="relative w-full h-full rounded-2xl bg-slate-900 border border-amber-400 p-4 flex items-center justify-center text-amber-200">
          <span>{characterId}</span>
        </div>
      )}
    </div>
  );
};
