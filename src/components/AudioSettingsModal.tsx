import React from 'react';
import { X, Volume2, VolumeX, Sliders, Eye } from 'lucide-react';
import { GameSettings } from '../utils/storage';

interface AudioSettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      <div className="relative w-full max-w-lg max-h-[88dvh] bg-[#121622] border-2 border-amber-400/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 sm:h-16 bg-gradient-to-r from-[#182238] via-[#24314c] to-[#182238] border-b border-amber-500/40 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-traditional font-bold text-amber-200">
                환경 설정 (環境 設定)
              </h2>
              <p className="text-xs font-batang text-slate-400">
                배경음악, 효과음 및 텍스트 출력 속도 조절
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

        {/* Settings Controls */}
        <div className="p-6 bg-[#0a0d14]/70 flex flex-col gap-6">
          {/* Mute Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#141926] border border-slate-700/80 rounded-xl">
            <div className="flex items-center gap-3">
              {settings.isMuted ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-amber-400" />
              )}
              <span className="text-sm font-traditional text-[#f3ede0]">
                전체 음소거 (Mute)
              </span>
            </div>
            <button
              onClick={() => onUpdateSettings({ isMuted: !settings.isMuted })}
              className={`px-4 py-1.5 rounded-lg text-xs font-traditional font-bold transition-colors cursor-pointer ${
                settings.isMuted
                  ? 'bg-red-700 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {settings.isMuted ? '음소거 됨' : '소리 켬'}
            </button>
          </div>

          {/* BGM Volume */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-traditional text-amber-200">
                국악 배경음(BGM) 음량
              </span>
              <span className="text-xs font-mono text-slate-400">
                {Math.round(settings.bgmVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.bgmVolume}
              onChange={(e) => onUpdateSettings({ bgmVolume: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-traditional text-amber-200">
                효과음(SFX) 음량
              </span>
              <span className="text-xs font-mono text-slate-400">
                {Math.round(settings.sfxVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => onUpdateSettings({ sfxVolume: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Text Output Speed */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-traditional text-amber-200 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                텍스트 출력 속도
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '빠르게 (15ms)', val: 15 },
                { label: '보통 (25ms)', val: 25 },
                { label: '느리게 (40ms)', val: 40 },
              ].map((sp) => (
                <button
                  key={sp.val}
                  onClick={() => onUpdateSettings({ textSpeed: sp.val })}
                  className={`py-2 rounded-lg text-xs font-traditional border transition-all cursor-pointer ${
                    settings.textSpeed === sp.val
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-bold'
                      : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Special Personalized Custom Names for Girlfriend */}
          <div className="p-3.5 bg-pink-950/30 border border-pink-500/40 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-traditional font-bold text-pink-300">
              <span>🌸 여주인공 이름 변경 (선물 커스텀)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-traditional block mb-1">
                  여주인공 (궁녀)
                </label>
                <input
                  type="text"
                  value={settings.heroineName || '연화'}
                  onChange={(e) => onUpdateSettings({ heroineName: e.target.value })}
                  placeholder="예: 연화, 지우, 수진"
                  className="w-full px-2.5 py-1.5 bg-black/60 border border-pink-500/40 rounded-lg text-xs text-pink-100 focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-traditional block mb-1">
                  남주인공 (무사)
                </label>
                <input
                  type="text"
                  value={settings.heroName || '무진'}
                  onChange={(e) => onUpdateSettings({ heroName: e.target.value })}
                  placeholder="예: 무진, 민수, 준호"
                  className="w-full px-2.5 py-1.5 bg-black/60 border border-cyan-500/40 rounded-lg text-xs text-cyan-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0d101a] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-traditional font-bold text-xs rounded-lg cursor-pointer transition-all"
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
};
