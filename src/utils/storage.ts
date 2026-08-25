import { SaveSlot } from '../types/game';

const SAVE_PREFIX = 'joseon_mystery_save_';
const SETTINGS_KEY = 'joseon_mystery_settings';
const ACHIEVEMENTS_KEY = 'joseon_mystery_endings';

export interface GameSettings {
  textSpeed: number; // ms per char (15 = fast, 30 = normal, 50 = slow)
  autoSpeed: number; // ms wait before next dialogue in auto mode
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  heroineName?: string; // 여주인공 이름 (기본값: 연화)
  heroName?: string; // 남주인공 이름 (기본값: 무진)
  customDedication?: string; // 특별한 선물 메시지
}

export const defaultSettings: GameSettings = {
  textSpeed: 25,
  autoSpeed: 2500,
  bgmVolume: 0.4,
  sfxVolume: 0.6,
  isMuted: false,
  heroineName: '연화',
  heroName: '무진',
  customDedication: '',
};

export const getSaveSlots = (): (SaveSlot | null)[] => {
  const slots: (SaveSlot | null)[] = [null, null, null, null];
  for (let i = 0; i < 4; i++) {
    try {
      const data = localStorage.getItem(`${SAVE_PREFIX}${i}`);
      if (data) {
        slots[i] = JSON.parse(data);
      }
    } catch {
      slots[i] = null;
    }
  }
  return slots;
};

export const saveToSlot = (slotIndex: number, slotData: Omit<SaveSlot, 'id' | 'savedAt'>): boolean => {
  try {
    const fullData: SaveSlot = {
      ...slotData,
      id: slotIndex,
      savedAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
    localStorage.setItem(`${SAVE_PREFIX}${slotIndex}`, JSON.stringify(fullData));
    return true;
  } catch (e) {
    console.error('Failed to save to slot', e);
    return false;
  }
};

export const loadFromSlot = (slotIndex: number): SaveSlot | null => {
  try {
    const data = localStorage.getItem(`${SAVE_PREFIX}${slotIndex}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load from slot', e);
  }
  return null;
};

export const deleteSlot = (slotIndex: number): void => {
  try {
    localStorage.removeItem(`${SAVE_PREFIX}${slotIndex}`);
  } catch (e) {
    console.error('Failed to delete slot', e);
  }
};

export const loadSettings = (): GameSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return defaultSettings;
};

export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const getUnlockedEndings = (): string[] => {
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to get unlocked endings', e);
  }
  return [];
};

export const unlockEnding = (endingId: string): void => {
  try {
    const endings = getUnlockedEndings();
    if (!endings.includes(endingId)) {
      endings.push(endingId);
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(endings));
    }
  } catch (e) {
    console.error('Failed to unlock ending', e);
  }
};
