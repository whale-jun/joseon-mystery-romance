import React, { useState } from 'react';
import { Play, Upload, Book, Trophy, Sliders, Sparkles, ChevronRight, Moon, Shield, Heart } from 'lucide-react';
import { getUnlockedEndings } from '../utils/storage';
import { ENDINGS } from '../data/endings';
import { soundEngine } from '../utils/soundEngine';

interface TitleScreenProps {
  onStartNewGame: (startingChapter?: number) => void;
  onOpenSaveLoad: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartNewGame,
  onOpenSaveLoad,
  onOpenSettings,
}) => {
  const [showSynopsis, setShowSynopsis] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showChapterSelect, setShowChapterSelect] = useState(false);
  const unlockedEndings = getUnlockedEndings();

  return (
    <div className="relative w-full h-full min-h-[100dvh] bg-gradient-to-b from-[#080b14] via-[#10172a] to-[#070910] flex flex-col justify-between p-4 sm:p-8 md:p-12 select-none overflow-hidden pt-[max(env(safe-area-inset-top),1.2rem)] pb-[max(env(safe-area-inset-bottom),5.5rem)] sm:pb-8">
      {/* Radiant Glowing Moon in Background */}
      <div className="absolute top-10 right-16 sm:right-28 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#fffae0] shadow-[0_0_100px_rgba(255,245,180,0.6)] opacity-90 pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ede4ba] to-transparent opacity-50"></div>
      </div>

      {/* Floating lanterns */}
      <div className="absolute top-1/4 left-16 animate-lantern pointer-events-none">
        <div className="w-10 h-16 bg-[#e67e22]/30 rounded-md border border-[#f39c12] flex items-center justify-center">
          <div className="w-3 h-6 bg-[#f1c40f] rounded-full blur-[1px]"></div>
        </div>
      </div>
      <div className="absolute top-1/3 right-20 animate-lantern pointer-events-none" style={{ animationDelay: '1.5s' }}>
        <div className="w-8 h-12 bg-[#e67e22]/30 rounded-md border border-[#f39c12] flex items-center justify-center">
          <div className="w-2 h-4 bg-[#f1c40f] rounded-full blur-[1px]"></div>
        </div>
      </div>

      {/* Top Header info */}
      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#141b2c]/80 border border-amber-500/30 rounded-full backdrop-blur-sm">
          <Moon className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-traditional text-amber-200">
            조선 궁중 로맨스 추리 비주얼 노벨
          </span>
        </div>
      </div>

      {/* Center Title & Slogan */}
      <div className="z-10 my-auto flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-red-950/60 via-amber-950/60 to-red-950/60 border border-amber-500/40 rounded-full mb-3 shadow-md">
          <span className="text-xs font-traditional text-amber-300">
            구중궁궐의 어둠 속에서 피어난 단 하나의 진실
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-traditional font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#fff8dc] to-amber-300 tracking-widest drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] mb-2">
          달빛 아래의 비밀
        </h1>
        <h2 className="text-lg sm:text-2xl font-traditional text-amber-300/90 tracking-wider mb-8">
          ~ 붉은 다과와 금지된 연심 ~
        </h2>

        {/* Main Menu Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={() => {
              soundEngine.playSfx('reveal');
              onStartNewGame(1);
            }}
            className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-black font-traditional font-bold text-base rounded-2xl shadow-[0_10px_25px_rgba(217,119,6,0.5)] border border-amber-300 transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>새로운 이야기 시작</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playSfx('item');
              onOpenSaveLoad();
            }}
            className="w-full py-3 bg-[#172033]/90 hover:bg-[#232f4b] text-[#f7f3e8] border border-[#d4af37]/50 font-traditional font-bold text-sm rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>기록 불러오기 (이어 하기)</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playSfx('item');
              setShowChapterSelect(true);
            }}
            className="w-full py-3 bg-[#172033]/90 hover:bg-[#232f4b] text-[#f7f3e8] border border-[#d4af37]/50 font-traditional font-bold text-sm rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>사건 장(Chapter) 선택</span>
          </button>

          <div className="grid grid-cols-3 gap-2 mt-1">
            <button
              onClick={() => {
                soundEngine.playSfx('item');
                setShowSynopsis(true);
              }}
              className="py-2.5 bg-[#121826]/80 hover:bg-[#1a2337] text-slate-300 hover:text-amber-200 border border-slate-700/80 rounded-xl text-xs font-traditional transition-all flex flex-col items-center gap-1 cursor-pointer"
            >
              <Book className="w-4 h-4 text-amber-400" />
              <span>사건 개요</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playSfx('item');
                setShowGallery(true);
              }}
              className="py-2.5 bg-[#121826]/80 hover:bg-[#1a2337] text-slate-300 hover:text-amber-200 border border-slate-700/80 rounded-xl text-xs font-traditional transition-all flex flex-col items-center gap-1 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>엔딩 도감 ({unlockedEndings.length}/4)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playSfx('item');
                onOpenSettings();
              }}
              className="py-2.5 bg-[#121826]/80 hover:bg-[#1a2337] text-slate-300 hover:text-amber-200 border border-slate-700/80 rounded-xl text-xs font-traditional transition-all flex flex-col items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>환경 설정</span>
            </button>
          </div>

          {/* Quick Share Link Button for Girlfriend */}
          <button
            onClick={() => {
              soundEngine.playSfx('chime');
              const url = window.location.href;
              navigator.clipboard?.writeText(url);
              alert(`💌 게임 링크가 클립보드에 복사되었습니다!\n여자친구에게 카카오톡이나 메시지로 전달해보세요.\n\n링크: ${url}`);
            }}
            className="w-full py-2.5 bg-gradient-to-r from-pink-950/60 via-[#2d1222]/80 to-pink-950/60 hover:from-pink-900/80 hover:to-pink-900/80 text-pink-200 border border-pink-500/40 rounded-xl text-xs font-traditional transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 mt-1"
          >
            <span>💌</span>
            <span>게임 링크 복사하여 여자친구에게 보내기</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-batang text-slate-500 border-t border-slate-800/80 pt-4">
        <span>주요 등장인물: 연화(총명한 궁녀), 무진(내금위 무사)</span>
        <span className="mt-1 sm:mt-0">조선시대 궁중 미스터리 어드벤처 · 250장 분량 시나리오 완편</span>
      </div>

      {/* Chapter Select Modal */}
      {showChapterSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#141a29] border-2 border-amber-400 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-traditional font-bold text-amber-200 mb-4 pb-2 border-b border-slate-700 flex items-center justify-between">
              <span>사건 장(Chapter) 바로가기</span>
              <button
                onClick={() => setShowChapterSelect(false)}
                className="text-sm text-slate-400 hover:text-white cursor-pointer"
              >
                닫기
              </button>
            </h3>

            <div className="flex flex-col gap-3">
              {[
                {
                  chap: 1,
                  title: '제1장: 붉은 다과의 비밀',
                  desc: '경회루 밀회와 동궁전 내시 독살 사건 수사',
                  icon: '🍵',
                },
                {
                  chap: 2,
                  title: '제2장: 달빛 아래 흩어진 연심',
                  desc: '후궁과 내시의 비밀 암호 해독 및 금지된 도피',
                  icon: '💌',
                },
                {
                  chap: 3,
                  title: '제3장: 검은 그림자의 저주',
                  desc: '도성 역병 조사와 사교 무녀 흑월과의 결전',
                  icon: '🔮',
                },
              ].map((item) => (
                <button
                  key={item.chap}
                  onClick={() => {
                    soundEngine.playSfx('reveal');
                    setShowChapterSelect(false);
                    onStartNewGame(item.chap);
                  }}
                  className="p-4 bg-[#1b2234] hover:bg-[#283450] border border-amber-500/40 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-sm font-traditional font-bold text-amber-200 group-hover:text-amber-100">
                        {item.title}
                      </div>
                      <div className="text-xs font-batang text-slate-300 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-400 transform group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Synopsis Modal */}
      {showSynopsis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#141a29] border-2 border-amber-400 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-traditional font-bold text-amber-200 mb-4 pb-2 border-b border-slate-700 flex items-center justify-between">
              <span>사건 개요 및 스토리 마스터플랜</span>
              <button
                onClick={() => setShowSynopsis(false)}
                className="text-sm text-slate-400 hover:text-white cursor-pointer"
              >
                닫기
              </button>
            </h3>

            <div className="flex flex-col gap-4 text-xs md:text-sm font-batang text-slate-200 leading-relaxed">
              <div className="p-3 bg-black/40 rounded-xl border border-pink-500/30">
                <span className="font-traditional font-bold text-pink-300 block mb-1">
                  🌸 주요 인물
                </span>
                <p>• <strong>연화 (궁녀):</strong> 명석한 두뇌와 뛰어난 눈썰미를 지녔으며, 구중궁궐 내전의 소문과 물건의 흐름을 꿰뚫고 있습니다.</p>
                <p className="mt-1">• <strong>무진 (무사):</strong> 과묵하지만 연화에게만은 다정한 내금위 소속 무사로, 궐 밖 정보망과 뛰어난 무술 실력을 자랑합니다.</p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-amber-500/30">
                <span className="font-traditional font-bold text-amber-300 block mb-1">
                  📜 3대 사건 요약
                </span>
                <p><strong>제1장: 붉은 다과의 비밀 (내시 독살 사건)</strong><br />동궁전 내시가 의문의 독살을 당하고, 찻잔과 붉은 다식에 숨겨진 맹독 비상의 출처를 밝혀냅니다.</p>
                <p className="mt-2"><strong>제2장: 달빛 아래 흩어진 연심 (후궁과 내시의 도피)</strong><br />후궁과 내시의 비밀 암호를 풀어내며, 자신들의 처지와 겹쳐지는 절절한 사랑 앞에서 선택의 기로에 섭니다.</p>
                <p className="mt-2"><strong>제3장: 검은 그림자의 저주 (도성의 역병과 악한 무녀)</strong><br />도성에 번진 기괴한 역병의 배후인 사교 무녀 흑월의 신경(구리거울)과 독초를 무너뜨리고 궁궐과 도성을 구합니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Endings Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#141a29] border-2 border-amber-400 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-traditional font-bold text-amber-200 mb-4 pb-2 border-b border-slate-700 flex items-center justify-between">
              <span>달성한 엔딩 도감 ({unlockedEndings.length} / 4)</span>
              <button
                onClick={() => setShowGallery(false)}
                className="text-sm text-slate-400 hover:text-white cursor-pointer"
              >
                닫기
              </button>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(ENDINGS).map((ed) => {
                const isUnlocked = unlockedEndings.includes(ed.id);

                return (
                  <div
                    key={ed.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-[#1b2234] border-amber-400/80 shadow-md'
                        : 'bg-black/40 border-slate-800 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{isUnlocked ? '🏆' : '🔒'}</span>
                      <span className="text-xs font-traditional font-bold text-amber-200">
                        {isUnlocked ? ed.title : '??? (미해금)'}
                      </span>
                    </div>
                    <p className="text-xs font-batang text-slate-300 line-clamp-2">
                      {isUnlocked ? ed.summary : '게임을 플레이하여 이 엔딩을 해금하십시오.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
