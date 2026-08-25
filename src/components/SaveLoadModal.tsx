import React, { useState } from 'react';
import { X, Save, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { SaveSlot } from '../types/game';
import { getSaveSlots, saveToSlot, loadFromSlot, deleteSlot } from '../utils/storage';
import { soundEngine } from '../utils/soundEngine';

interface SaveLoadModalProps {
  currentChapter: number;
  chapterTitle: string;
  currentNodeId: string;
  currentPreviewText: string;
  affection: number;
  trust: number;
  collectedClueIds: string[];
  solvedPuzzles: string[];
  onLoadGame: (slot: SaveSlot) => void;
  onClose: () => void;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  currentChapter,
  chapterTitle,
  currentNodeId,
  currentPreviewText,
  affection,
  trust,
  collectedClueIds,
  solvedPuzzles,
  onLoadGame,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [slots, setSlots] = useState<(SaveSlot | null)[]>(() => getSaveSlots());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleSave = (index: number) => {
    soundEngine.playSfx('paper');
    const ok = saveToSlot(index, {
      chapter: currentChapter,
      chapterTitle,
      currentNodeId,
      previewText: currentPreviewText,
      affection,
      trust,
      collectedClueIds,
      solvedPuzzles,
    });
    if (ok) {
      setSlots(getSaveSlots());
      showToast(`${index + 1}번 슬롯에 진행 상황을 기록하였습니다.`);
    }
  };

  const handleLoad = (index: number) => {
    const slot = loadFromSlot(index);
    if (slot) {
      soundEngine.playSfx('reveal');
      onLoadGame(slot);
      onClose();
    }
  };

  const handleDelete = (index: number) => {
    soundEngine.playSfx('fail');
    deleteSlot(index);
    setSlots(getSaveSlots());
    showToast(`${index + 1}번 기록을 삭제하였습니다.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      <div className="relative w-full max-w-2xl max-h-[88dvh] bg-[#121622] border-2 border-amber-400/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 sm:h-16 bg-gradient-to-r from-[#182238] via-[#24314c] to-[#182238] border-b border-amber-500/40 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-traditional font-bold text-amber-200">
                기록 및 불러오기 (儲存 · 讀取)
              </h2>
              <p className="text-xs font-batang text-slate-400">
                총 4개의 슬롯에 진행 상태를 영구 보관할 수 있습니다.
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

        {/* Tab switch */}
        <div className="flex items-center bg-[#0d101a] border-b border-slate-800">
          <button
            onClick={() => setActiveTab('save')}
            className={`flex-1 py-3 text-xs font-traditional font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'save'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>현재 위치 저장 (Save)</span>
          </button>
          <button
            onClick={() => setActiveTab('load')}
            className={`flex-1 py-3 text-xs font-traditional font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'load'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>기록 불러오기 (Load)</span>
          </button>
        </div>

        {/* Slots List */}
        <div className="p-6 flex flex-col gap-3 bg-[#0a0d14]/70 max-h-[400px] overflow-y-auto">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#141926] border border-slate-700/80 rounded-xl flex items-center justify-between gap-4 shadow-md hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-full bg-black/60 border border-amber-400/40 flex items-center justify-center text-xs font-bold text-amber-300">
                  {idx + 1}
                </span>

                {slot ? (
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-traditional font-bold text-amber-200 truncate">
                        {slot.chapterTitle}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {slot.savedAt}
                      </span>
                    </div>
                    <p className="text-xs font-batang text-slate-300 line-clamp-1 mt-0.5">
                      {slot.previewText}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-400">
                      <span className="text-pink-400">🌸 연심 {slot.affection}</span>
                      <span className="text-cyan-400">🗡️ 신뢰 {slot.trust}</span>
                      <span className="text-amber-400">📜 단서 {slot.collectedClueIds.length}개</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-batang text-slate-500">
                    [빈 슬롯 - 저장된 기록이 없습니다]
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {activeTab === 'save' ? (
                  <button
                    onClick={() => handleSave(idx)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black text-xs font-traditional font-bold rounded-lg shadow cursor-pointer transition-transform active:scale-95"
                  >
                    {slot ? '덮어쓰기' : '저장하기'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleLoad(idx)}
                    disabled={!slot}
                    className={`px-4 py-2 text-xs font-traditional font-bold rounded-lg shadow transition-transform active:scale-95 ${
                      slot
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    불러오기
                  </button>
                )}

                {slot && (
                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-2 bg-red-950/40 hover:bg-red-900 border border-red-800/60 text-red-300 rounded-lg transition-colors cursor-pointer"
                    title="슬롯 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-900 text-emerald-100 text-xs font-traditional rounded-full shadow-lg border border-emerald-400 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
