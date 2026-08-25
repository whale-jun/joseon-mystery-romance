import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { InvestigationScene, InvestigationHotspot } from '../types/game';
import { CLUES } from '../data/clues';
import { soundEngine } from '../utils/soundEngine';

interface InvestigationViewProps {
  scene: InvestigationScene;
  onCompleteInvestigation: () => void;
  onGainClue: (clueId: string) => void;
  collectedClueIds: string[];
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  scene,
  onCompleteInvestigation,
  onGainClue,
  collectedClueIds,
}) => {
  const [inspectedSpotIds, setInspectedSpotIds] = useState<string[]>([]);
  const [currentSpotDialog, setCurrentSpotDialog] = useState<InvestigationHotspot | null>(null);

  const handleSpotClick = (spot: InvestigationHotspot) => {
    if (!inspectedSpotIds.includes(spot.id)) {
      setInspectedSpotIds((prev) => [...prev, spot.id]);
    }

    if (spot.discoveredClueId && !collectedClueIds.includes(spot.discoveredClueId)) {
      soundEngine.playSfx('chime');
      onGainClue(spot.discoveredClueId);
    } else {
      soundEngine.playSfx('item');
    }

    setCurrentSpotDialog(spot);
  };

  const minRequired = scene.minHotspotsRequired || scene.hotspots.length;
  const isReadyToComplete = inspectedSpotIds.length >= minRequired;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-6 select-none bg-black/50 backdrop-blur-[2px] pt-[max(env(safe-area-inset-top),1.2rem)] pb-[max(env(safe-area-inset-bottom),1.2rem)]">
      {/* Top Banner Guide */}
      <div className="w-full max-w-2xl mx-auto bg-gradient-to-r from-[#182238]/95 via-[#25324d]/95 to-[#182238]/95 border-2 border-amber-400/80 rounded-xl p-4 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
            <Search className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-traditional font-bold text-amber-200">
              {scene.title}
            </h2>
            <p className="text-xs font-batang text-slate-300">
              {scene.instructions}
            </p>
          </div>
        </div>

        {/* Progress Counter */}
        <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg border border-amber-500/30">
          <span className="text-xs font-traditional text-amber-300">수색 진척도:</span>
          <span className="text-sm font-mono font-bold text-emerald-400">
            {inspectedSpotIds.length} / {scene.hotspots.length}
          </span>
        </div>
      </div>

      {/* Interactive Crime Scene Hotspots Area */}
      <div className="relative flex-1 w-full max-w-5xl mx-auto my-4">
        {scene.hotspots.map((spot) => {
          const isInspected = inspectedSpotIds.includes(spot.id);

          return (
            <div
              key={spot.id}
              onClick={() => handleSpotClick(spot)}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.width}%`,
                height: `${spot.height}%`,
              }}
              className={`absolute cursor-pointer rounded-2xl transition-all duration-300 flex items-center justify-center group ${
                isInspected
                  ? 'border-2 border-emerald-400/60 bg-emerald-950/20 hover:bg-emerald-900/30'
                  : 'border-2 border-amber-400/80 bg-amber-500/15 hover:bg-amber-400/30 animate-pulse'
              }`}
            >
              {/* Hotspot Icon Badge */}
              <div className="px-3 py-1.5 bg-black/80 rounded-full border border-amber-400/70 shadow-lg flex items-center gap-1.5 transform group-hover:scale-110 transition-transform">
                <span className="text-sm">{spot.inspectIcon || '🔍'}</span>
                <span className="text-xs font-traditional font-bold text-amber-200 whitespace-nowrap">
                  {spot.label}
                </span>
                {isInspected && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Spot Inspection Dialogue Popup Modal */}
      {currentSpotDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#141a29] border-2 border-amber-400 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
              <span className="text-2xl">{currentSpotDialog.inspectIcon || '🔍'}</span>
              <div>
                <h3 className="text-lg font-traditional font-bold text-amber-300">
                  {currentSpotDialog.label} 조사 결과
                </h3>
                <span className="text-xs text-slate-400 font-batang">현장 정밀 감식</span>
              </div>
            </div>

            <p className="text-base font-batang text-[#f3ede0] leading-relaxed mb-6 whitespace-pre-line">
              {currentSpotDialog.dialogue}
            </p>

            {currentSpotDialog.discoveredClueId && (
              <div className="mb-6 p-3 bg-amber-950/40 border border-amber-500/50 rounded-lg flex items-center gap-3">
                <span className="text-xl">
                  {CLUES[currentSpotDialog.discoveredClueId]?.icon || '📜'}
                </span>
                <div>
                  <div className="text-xs text-amber-300 font-traditional font-bold">
                    새로운 단서 획득!
                  </div>
                  <div className="text-sm font-bold text-amber-100">
                    {CLUES[currentSpotDialog.discoveredClueId]?.title}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setCurrentSpotDialog(null)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-traditional font-bold rounded-lg shadow-lg cursor-pointer transition-all active:scale-[0.99]"
            >
              확인 및 계속 수색하기
            </button>
          </div>
        </div>
      )}

      {/* Bottom Complete Button */}
      <div className="w-full max-w-md mx-auto flex justify-center">
        {isReadyToComplete ? (
          <button
            onClick={() => {
              soundEngine.playSfx('reveal');
              onCompleteInvestigation();
            }}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-traditional font-bold text-base rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.5)] border-2 border-emerald-300 transition-all transform hover:scale-105 active:scale-95 cursor-pointer animate-bounce"
          >
            <span>현장 수색 완료 및 다음 단계로</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-lg border border-amber-500/30 text-xs font-traditional text-amber-300/80">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>남은 의심 지점을 모두 조사하십시오. ({inspectedSpotIds.length}/{minRequired})</span>
          </div>
        )}
      </div>
    </div>
  );
};
