import React from 'react';
import { X, Users, Heart, Shield, Sparkles } from 'lucide-react';
import { CHARACTERS } from '../data/characters';

interface RelationshipModalProps {
  affection: number;
  trust: number;
  onClose: () => void;
}

export const RelationshipModal: React.FC<RelationshipModalProps> = ({
  affection,
  trust,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      <div className="relative w-full max-w-4xl max-h-[88dvh] bg-[#121622] border-2 border-amber-400/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 sm:h-16 bg-gradient-to-r from-[#182238] via-[#24314c] to-[#182238] border-b border-amber-500/40 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-traditional font-bold text-amber-200">
                궁중 인물 관계도 및 연심(戀心)
              </h2>
              <p className="text-xs font-batang text-slate-400">
                구중궁궐의 얽히고설킨 비밀과 두 사람의 유대
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

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#0a0d14]/70 flex flex-col justify-between">
          {/* Main Couple Romance Status Banner */}
          <div className="p-5 bg-gradient-to-r from-[#2b121e]/90 via-[#3a1a2b]/90 to-[#2b121e]/90 border-2 border-pink-500/60 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                <div className="w-14 h-14 rounded-full bg-[#e07a5f]/20 border-2 border-pink-400 flex items-center justify-center text-2xl shadow-md z-10">
                  🌸
                </div>
                <div className="w-14 h-14 rounded-full bg-[#3d405b]/30 border-2 border-blue-400 flex items-center justify-center text-2xl shadow-md">
                  🗡️
                </div>
              </div>
              <div>
                <h3 className="text-base font-traditional font-bold text-pink-200 flex items-center gap-2">
                  연화(궁녀) & 무진(내금위 무사)
                  <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                </h3>
                <p className="text-xs font-batang text-pink-100/80 mt-0.5">
                  {affection >= 70
                    ? '생사를 함께하며 서로를 목숨보다 아끼는 깊은 연인 관계'
                    : affection >= 40
                    ? '궐내 비밀을 공유하며 서로에게 설레는 특별한 관계'
                    : '서로를 깊이 신뢰하는 은밀한 공모 관계'}
                </p>
              </div>
            </div>

            {/* Gauges */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-[11px] font-traditional text-pink-300 mb-1 flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                  <span>연심</span>
                </div>
                <div className="text-lg font-mono font-bold text-pink-200">{affection} / 100</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-traditional text-cyan-300 mb-1 flex items-center justify-center gap-1">
                  <Shield className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                  <span>신뢰</span>
                </div>
                <div className="text-lg font-mono font-bold text-cyan-200">{trust} / 100</div>
              </div>
            </div>
          </div>

          {/* Character Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
            {Object.values(CHARACTERS).map((c) => (
              <div
                key={c.id}
                className="p-3 bg-[#131826] border border-slate-700/80 rounded-xl flex items-start gap-3 shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-black/40 border border-slate-600 flex items-center justify-center text-xl shrink-0">
                  {c.avatarIcon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-traditional font-bold text-amber-200">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-batang">
                      ({c.title})
                    </span>
                  </div>
                  <p className="text-[11px] font-batang text-slate-300 line-clamp-2 mt-1 leading-snug">
                    {c.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Palace Secrets Narrative Note */}
          <div className="p-3.5 bg-black/40 border border-amber-500/30 rounded-xl text-xs font-batang text-amber-200/90 flex items-center justify-between">
            <span>💡 제2장의 서 숙원과 윤 내관의 사랑은 두 사람의 운명과 거울처럼 닮아 있습니다.</span>
            <span className="font-traditional text-amber-400">진(眞)엔딩 조건: 연심 75+ & 신뢰 80+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
