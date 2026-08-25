export type EmotionType = 'normal' | 'happy' | 'nervous' | 'blush' | 'serious' | 'shock' | 'resolute';

export type BgType = 
  | 'gyeonghoeru_night' 
  | 'donggung_room' 
  | 'sojubang' 
  | 'naeuwon' 
  | 'palace_gate' 
  | 'secret_pavilion' 
  | 'shrine_night' 
  | 'hanyang_street' 
  | 'palace_hall' 
  | 'ending_moon';

export type BgEffect = 'petals' | 'moonlight' | 'rain' | 'fog' | 'embers' | 'none';

export type BgmType = 'night_mystery' | 'romance_tender' | 'investigation' | 'suspense_climax' | 'triumph' | 'sorrow';

export type SfxType = 'footsteps' | 'sword' | 'chime' | 'heartbeat' | 'gong' | 'paper' | 'wind' | 'shock' | 'item' | 'reveal' | 'success' | 'fail';

export interface Character {
  id: string;
  name: string;
  title: string;
  role: string;
  color: string;
  description: string;
  avatarIcon: string;
  avatarArt: {
    baseColor: string;
    accentColor: string;
    clothing: string;
    hat?: string;
    accessory?: string;
  };
}

export interface Clue {
  id: string;
  title: string;
  chapter: number;
  category: 'physical' | 'testimony' | 'document' | 'secret';
  summary: string;
  detailedInfo: string;
  icon: string;
  secretHint?: string;
  discoveredAtNode?: string;
}

export interface Choice {
  text: string;
  nextNodeId: string;
  requiredClueId?: string;
  affectionDelta?: number;
  trustDelta?: number;
  hint?: string;
  actionFeedback?: string;
}

export interface InvestigationHotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  label: string;
  discoveredClueId?: string;
  dialogue: string;
  inspectIcon?: string;
}

export interface InvestigationScene {
  id: string;
  title: string;
  locationName: string;
  backgroundTheme: BgType;
  instructions: string;
  hotspots: InvestigationHotspot[];
  nextNodeIdAfterComplete: string;
  minHotspotsRequired?: number;
}

export interface DeductionContradiction {
  id: string;
  suspectStatement: string;
  speaker: string;
  hint: string;
  correctClueId: string;
  rebuttalDialogue: string;
  failDialogue: string;
}

export interface DeductionBattle {
  id: string;
  title: string;
  opponentName: string;
  opponentTitle: string;
  opponentAvatar: string;
  description: string;
  contradictions: DeductionContradiction[];
  successNodeId: string;
  failNodeId: string;
}

export interface CipherPuzzle {
  id: string;
  title: string;
  loreText: string;
  cipherGrid: {
    hanja: string;
    korean: string;
    code: string;
  }[];
  question: string;
  hint: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  successNodeId: string;
}

export interface HerbPuzzle {
  id: string;
  title: string;
  patientStatus: string;
  herbs: {
    id: string;
    name: string;
    hanja: string;
    category: 'cure' | 'poison' | 'neutral';
    description: string;
    smellOrColor: string;
  }[];
  targetHerbIds: string[];
  explanation: string;
  successNodeId: string;
}

export interface StoryNode {
  id: string;
  chapter: number;
  chapterTitle: string;
  bgType: BgType;
  bgEffect?: BgEffect;
  speakerId: string | null;
  speakerName?: string;
  dialogue: string;
  characterEmotion?: EmotionType;
  activeCharacters?: {
    id: string;
    position: 'left' | 'center' | 'right';
    emotion?: EmotionType;
    isSpeaking: boolean;
  }[];
  sfx?: SfxType;
  bgm?: BgmType;
  choices?: Choice[];
  nextNodeId?: string;
  gainClueId?: string;
  affectionDelta?: number;
  trustDelta?: number;
  triggerMinigame?: {
    type: 'investigation' | 'deduction' | 'cipher' | 'herb';
    dataId: string;
  };
  isEndingNode?: boolean;
  endingId?: string;
}

export interface Ending {
  id: string;
  title: string;
  type: 'true' | 'good' | 'normal' | 'bad';
  badge: string;
  summary: string;
  epilogue: string;
  quote: string;
}

export interface SaveSlot {
  id: number;
  savedAt: string;
  chapter: number;
  chapterTitle: string;
  currentNodeId: string;
  previewText: string;
  affection: number;
  trust: number;
  collectedClueIds: string[];
  solvedPuzzles: string[];
}
