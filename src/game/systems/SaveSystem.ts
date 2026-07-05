import { SaveData } from '../types';

const KEY = 'circuit-bros-save-v1';

const DEFAULT_SAVE: SaveData = {
  highScore: 0,
  completedLevels: [],
  debugChips: {}
};

export class SaveSystem {
  static load(): SaveData {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...DEFAULT_SAVE, ...JSON.parse(raw) } : { ...DEFAULT_SAVE };
    } catch {
      return { ...DEFAULT_SAVE };
    }
  }

  static save(data: SaveData): void {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  static completeLevel(level: number, score: number): void {
    const data = SaveSystem.load();
    if (!data.completedLevels.includes(level)) data.completedLevels.push(level);
    data.highScore = Math.max(data.highScore, score);
    SaveSystem.save(data);
  }

  static collectChip(level: number, chipId: string): void {
    const data = SaveSystem.load();
    const key = String(level);
    data.debugChips[key] ??= [];
    if (!data.debugChips[key].includes(chipId)) data.debugChips[key].push(chipId);
    SaveSystem.save(data);
  }
}
