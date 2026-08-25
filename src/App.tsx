import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BackgroundView } from './components/BackgroundView';
import { CharacterPortraits } from './components/CharacterPortraits';
import { Header } from './components/Header';
import { VisualNovelView } from './components/VisualNovelView';
import { InvestigationView } from './components/InvestigationView';
import { DeductionBattleView } from './components/DeductionBattleView';
import { CipherMinigame } from './components/CipherMinigame';
import { HerbMinigame } from './components/HerbMinigame';
import { ClueNotebookModal } from './components/ClueNotebookModal';
import { RelationshipModal } from './components/RelationshipModal';
import { SaveLoadModal } from './components/SaveLoadModal';
import { BacklogModal } from './components/BacklogModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { EndingView } from './components/EndingView';
import { TitleScreen } from './components/TitleScreen';

import { STORY_NODES } from './data/storyData';
import { INVESTIGATION_SCENES, DEDUCTION_BATTLES, CIPHER_PUZZLES, HERB_PUZZLES } from './data/minigames';
import { CHARACTERS } from './data/characters';
import { Choice, SaveSlot } from './types/game';
import { soundEngine } from './utils/soundEngine';
import { ParticleRenderer } from './utils/particleCanvas';
import { loadSettings, saveSettings, GameSettings } from './utils/storage';

export const App: React.FC = () => {
  const [isInGame, setIsInGame] = useState<boolean>(false);
  const [currentNodeId, setCurrentNodeId] = useState<string>('prologue_start');
  const [affection, setAffection] = useState<number>(20);
  const [trust, setTrust] = useState<number>(30);
  const [collectedClueIds, setCollectedClueIds] = useState<string[]>([]);
  const [visitedNodeIds, setVisitedNodeIds] = useState<string[]>(['prologue_start']);
  const [dialogueHistory, setDialogueHistory] = useState<{ speaker: string; text: string; chapter: number }[]>([]);
  const [activeMinigame, setActiveMinigame] = useState<{
    type: 'investigation' | 'deduction' | 'cipher' | 'herb';
    dataId: string;
  } | null>(null);
  const [currentEnding, setCurrentEnding] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<
    'notebook' | 'relationship' | 'saveload' | 'backlog' | 'settings' | null
  >(null);
  const [hasNewClue, setHasNewClue] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleEngineRef = useRef<ParticleRenderer | null>(null);

  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES['prologue_start'];

  // Initialize Canvas Particle Engine
  useEffect(() => {
    if (canvasRef.current) {
      particleEngineRef.current = new ParticleRenderer(canvasRef.current);
    }
    return () => {
      particleEngineRef.current?.destroy();
    };
  }, []);

  // Update particles based on scene effect or title screen
  useEffect(() => {
    if (!particleEngineRef.current) return;
    if (!isInGame) {
      particleEngineRef.current.setEffect('petals');
    } else {
      particleEngineRef.current.setEffect(currentNode.bgEffect || 'moonlight');
    }
  }, [isInGame, currentNode.bgEffect]);

  // Handle BGM and SFX on story node change
  useEffect(() => {
    if (!isInGame) {
      soundEngine.playBgm('night_mystery');
      return;
    }

    if (currentNode.bgm) {
      soundEngine.playBgm(currentNode.bgm);
    }

    if (currentNode.sfx) {
      soundEngine.playSfx(currentNode.sfx);
    }

    if (currentNode.gainClueId && !collectedClueIds.includes(currentNode.gainClueId)) {
      setCollectedClueIds((prev) => [...prev, currentNode.gainClueId!]);
      setHasNewClue(true);
      soundEngine.playSfx('chime');
    }

    if (currentNode.triggerMinigame) {
      setActiveMinigame(currentNode.triggerMinigame);
    } else {
      setActiveMinigame(null);
    }

    if (currentNode.isEndingNode && currentNode.endingId) {
      setCurrentEnding(currentNode.endingId);
    }

    // Add to history log
    const speakerChar = currentNode.speakerId ? CHARACTERS[currentNode.speakerId] : null;
    const speakerName = currentNode.speakerName || (speakerChar ? speakerChar.name : '나레이션');

    setDialogueHistory((prev) => [
      ...prev,
      { speaker: speakerName, text: currentNode.dialogue, chapter: currentNode.chapter },
    ]);
  }, [currentNodeId, isInGame]);

  // Synchronize Settings
  const handleUpdateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      soundEngine.setBgmVolume(updated.bgmVolume);
      soundEngine.setSfxVolume(updated.sfxVolume);
      soundEngine.setMute(updated.isMuted);
      return updated;
    });
  }, []);

  const handleStartNewGame = useCallback((startingChapter: number = 1) => {
    let startNode = 'prologue_start';
    if (startingChapter === 2) startNode = 'c2_intro';
    if (startingChapter === 3) startNode = 'c3_intro';

    setCurrentNodeId(startNode);
    setAffection(startingChapter === 1 ? 20 : startingChapter === 2 ? 45 : 70);
    setTrust(startingChapter === 1 ? 30 : startingChapter === 2 ? 55 : 75);
    setCollectedClueIds(
      startingChapter === 1
        ? []
        : startingChapter === 2
        ? ['silver_hairpin', 'chrysanthemum_tea', 'red_dasik_confection', 'gate_pass_log', 'herbal_prescription']
        : ['silver_hairpin', 'chrysanthemum_tea', 'red_dasik_confection', 'gate_pass_log', 'moonlight_cipher', 'jade_pendant_pair', 'escape_map']
    );
    setVisitedNodeIds([startNode]);
    setDialogueHistory([]);
    setActiveMinigame(null);
    setCurrentEnding(null);
    setIsInGame(true);
    setIsAutoPlay(false);
  }, []);

  const handleAdvance = useCallback(() => {
    if (currentNode.nextNodeId) {
      if (currentNode.affectionDelta) {
        setAffection((prev) => Math.min(100, prev + currentNode.affectionDelta!));
      }
      if (currentNode.trustDelta) {
        setTrust((prev) => Math.min(100, prev + currentNode.trustDelta!));
      }

      setVisitedNodeIds((prev) => [...prev, currentNode.nextNodeId!]);
      setCurrentNodeId(currentNode.nextNodeId);
    }
  }, [currentNode]);

  const handleSelectChoice = useCallback((choice: Choice) => {
    if (choice.affectionDelta) {
      setAffection((prev) => Math.min(100, prev + choice.affectionDelta!));
    }
    if (choice.trustDelta) {
      setTrust((prev) => Math.min(100, prev + choice.trustDelta!));
    }

    setVisitedNodeIds((prev) => [...prev, choice.nextNodeId]);
    setCurrentNodeId(choice.nextNodeId);
  }, []);

  const handleLoadGame = useCallback((slot: SaveSlot) => {
    setCurrentNodeId(slot.currentNodeId);
    setAffection(slot.affection);
    setTrust(slot.trust);
    setCollectedClueIds(slot.collectedClueIds);
    setVisitedNodeIds([slot.currentNodeId]);
    setCurrentEnding(null);
    setActiveMinigame(null);
    setIsInGame(true);
  }, []);

  const handleGainClue = useCallback((clueId: string) => {
    if (!collectedClueIds.includes(clueId)) {
      setCollectedClueIds((prev) => [...prev, clueId]);
      setHasNewClue(true);
    }
  }, [collectedClueIds]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07090e] font-serif">
      {/* Background Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {!isInGame ? (
        <TitleScreen
          onStartNewGame={handleStartNewGame}
          onOpenSaveLoad={() => setActiveModal('saveload')}
          onOpenSettings={() => setActiveModal('settings')}
        />
      ) : (
        <div className="relative w-full h-full">
          {/* Main Visual Background */}
          <BackgroundView bgType={currentNode.bgType} />

          {/* Character Portraits (Active in dialogue) */}
          <CharacterPortraits activeCharacters={currentNode.activeCharacters} />

          {/* Top Status & Controls Header */}
          <Header
            chapterTitle={currentNode.chapterTitle}
            affection={affection}
            trust={trust}
            cluesCount={collectedClueIds.length}
            hasNewClue={hasNewClue}
            isMuted={settings.isMuted}
            onToggleMute={() => handleUpdateSettings({ isMuted: !settings.isMuted })}
            onOpenNotebook={() => {
              setHasNewClue(false);
              setActiveModal('notebook');
            }}
            onOpenRelationship={() => setActiveModal('relationship')}
            onOpenSaveLoad={() => setActiveModal('saveload')}
            onOpenBacklog={() => setActiveModal('backlog')}
            onOpenSettings={() => setActiveModal('settings')}
          />

          {/* Point & Click Investigation Minigame */}
          {activeMinigame?.type === 'investigation' && (
            <InvestigationView
              scene={INVESTIGATION_SCENES[activeMinigame.dataId]}
              onCompleteInvestigation={() => {
                setActiveMinigame(null);
                setCurrentNodeId(INVESTIGATION_SCENES[activeMinigame.dataId].nextNodeIdAfterComplete);
              }}
              onGainClue={handleGainClue}
              collectedClueIds={collectedClueIds}
            />
          )}

          {/* Deduction Confrontation Battle Mode */}
          {activeMinigame?.type === 'deduction' && (
            <DeductionBattleView
              battle={DEDUCTION_BATTLES[activeMinigame.dataId]}
              collectedClueIds={collectedClueIds}
              onVictory={() => {
                setActiveMinigame(null);
                setCurrentNodeId(DEDUCTION_BATTLES[activeMinigame.dataId].successNodeId);
              }}
              onDefeat={() => {
                setActiveMinigame(null);
                setCurrentNodeId(DEDUCTION_BATTLES[activeMinigame.dataId].failNodeId);
              }}
            />
          )}

          {/* Cipher Decoding Minigame */}
          {activeMinigame?.type === 'cipher' && (
            <CipherMinigame
              puzzle={CIPHER_PUZZLES[activeMinigame.dataId]}
              onSuccess={() => {
                setActiveMinigame(null);
                setCurrentNodeId(CIPHER_PUZZLES[activeMinigame.dataId].successNodeId);
              }}
            />
          )}

          {/* Herb & Poison Identification Minigame */}
          {activeMinigame?.type === 'herb' && (
            <HerbMinigame
              puzzle={HERB_PUZZLES[activeMinigame.dataId]}
              onSuccess={() => {
                setActiveMinigame(null);
                setCurrentNodeId(HERB_PUZZLES[activeMinigame.dataId].successNodeId);
              }}
            />
          )}

          {/* Main Visual Novel Dialogue View (when no modal/minigame active) */}
          {!activeMinigame && !currentEnding && (
            <VisualNovelView
              speakerId={currentNode.speakerId}
              speakerName={currentNode.speakerName}
              dialogue={currentNode.dialogue}
              choices={currentNode.choices}
              onSelectChoice={handleSelectChoice}
              onAdvance={handleAdvance}
              textSpeed={settings.textSpeed}
              autoSpeed={settings.autoSpeed}
              isAutoPlay={isAutoPlay}
              onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
              heroineName={settings.heroineName}
              heroName={settings.heroName}
            />
          )}

          {/* Ending Screen */}
          {currentEnding && (
            <EndingView
              endingId={currentEnding}
              affection={affection}
              trust={trust}
              cluesCount={collectedClueIds.length}
              onRestart={() => handleStartNewGame(1)}
              onReturnTitle={() => {
                setIsInGame(false);
                setCurrentEnding(null);
              }}
            />
          )}
        </div>
      )}

      {/* Modals */}
      {activeModal === 'notebook' && (
        <ClueNotebookModal
          collectedClueIds={collectedClueIds}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'relationship' && (
        <RelationshipModal
          affection={affection}
          trust={trust}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'saveload' && (
        <SaveLoadModal
          currentChapter={currentNode.chapter}
          chapterTitle={currentNode.chapterTitle}
          currentNodeId={currentNodeId}
          currentPreviewText={currentNode.dialogue.slice(0, 50)}
          affection={affection}
          trust={trust}
          collectedClueIds={collectedClueIds}
          solvedPuzzles={[]}
          onLoadGame={handleLoadGame}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'backlog' && (
        <BacklogModal
          history={dialogueHistory}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'settings' && (
        <AudioSettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default App;
