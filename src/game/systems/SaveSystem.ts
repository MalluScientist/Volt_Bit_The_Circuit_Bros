import { SaveData } from '../types';
import { CharacterId, getCharacterConfig } from '../characters';
import { MAIN_CLOCK_SHARD_COUNT } from '../data/campaign';

const KEY = 'circuit-bros-save-v1';

const DEFAULT_SAVE: SaveData = {
  selectedCharacter: 'volt',
  bitUnlocked: false,
  highScore: 0,
  completedLevels: [],
  debugChips: {},
  clockShards: [],
  deaths: {},
  attempts: {},
  upgrades: {
    dashStabilizer: false,
    batteryBoost: false,
    checkpointReboot: false,
    chipBeamEnhancer: false,
    airControlModule: false,
    fuseShield: false,
    debugDrone: false
  },
  musicEnabled: true,
  storySeen: false,
  settings: {
    screenShake: true,
    flashEffects: 'normal',
    touchOpacity: 0.64,
    touchSize: 1,
    leftHandedTouch: false,
    soundVolume: 1,
    musicVolume: 1,
    extraBatteryCell: false,
    slowerHazards: false,
    longerCoyoteTime: false,
    keepDebugChipsAfterDeath: true
  }
};

export class SaveSystem {
  static load(): SaveData {
    try {
      const raw = localStorage.getItem(KEY);
      return SaveSystem.normalize(raw ? JSON.parse(raw) : {});
    } catch {
      return SaveSystem.normalize({});
    }
  }

  static save(data: SaveData): void {
    localStorage.setItem(KEY, JSON.stringify(SaveSystem.normalize(data)));
  }

  static completeLevel(level: number, score: number): void {
    const data = SaveSystem.load();
    if (!data.completedLevels.includes(level)) data.completedLevels.push(level);
    if (level <= MAIN_CLOCK_SHARD_COUNT && !data.clockShards.includes(level)) data.clockShards.push(level);
    if (level >= SaveSystem.bitUnlockLevel()) data.bitUnlocked = true;
    data.highScore = Math.max(data.highScore, score);
    SaveSystem.unlockMilestoneRewards(data, level);
    SaveSystem.save(data);
  }

  static collectChip(level: number, chipId: string): void {
    const data = SaveSystem.load();
    const key = String(level);
    data.debugChips[key] ??= [];
    if (!data.debugChips[key].includes(chipId)) data.debugChips[key].push(chipId);
    SaveSystem.save(data);
  }

  static getDebugChipCount(level: number): number {
    return SaveSystem.load().debugChips[String(level)]?.length ?? 0;
  }

  static setSelectedCharacter(character: CharacterId): void {
    const data = SaveSystem.load();
    data.selectedCharacter = character === 'bit' && !data.bitUnlocked ? 'volt' : getCharacterConfig(character).id;
    SaveSystem.save(data);
  }

  static selectedCharacter(): CharacterId {
    return SaveSystem.load().selectedCharacter;
  }

  static bitUnlockLevel(): number {
    return 4;
  }

  static isBitUnlocked(): boolean {
    return SaveSystem.load().bitUnlocked;
  }

  static recordAttempt(level: number): number {
    const data = SaveSystem.load();
    const key = String(level);
    data.attempts[key] = (data.attempts[key] ?? 0) + 1;
    SaveSystem.save(data);
    return data.attempts[key];
  }

  static recordDeath(level: number): number {
    const data = SaveSystem.load();
    const key = String(level);
    data.deaths[key] = (data.deaths[key] ?? 0) + 1;
    SaveSystem.save(data);
    return data.deaths[key];
  }

  static setMusicEnabled(enabled: boolean): void {
    const data = SaveSystem.load();
    data.musicEnabled = enabled;
    SaveSystem.save(data);
  }

  static setStorySeen(): void {
    const data = SaveSystem.load();
    data.storySeen = true;
    SaveSystem.save(data);
  }

  private static normalize(raw: Partial<SaveData>): SaveData {
    const completedLevels = Array.isArray(raw.completedLevels) ? raw.completedLevels : [];
    const bitUnlocked = Boolean(raw.bitUnlocked) || completedLevels.includes(SaveSystem.bitUnlockLevel());
    const requestedCharacter = getCharacterConfig(raw.selectedCharacter).id;
    const selectedCharacter = requestedCharacter === 'bit' && !bitUnlocked ? 'volt' : requestedCharacter;
    return {
      ...DEFAULT_SAVE,
      ...raw,
      bitUnlocked,
      selectedCharacter,
      completedLevels,
      debugChips: raw.debugChips && typeof raw.debugChips === 'object' ? raw.debugChips : {},
      clockShards: Array.isArray(raw.clockShards) ? raw.clockShards : [],
      deaths: raw.deaths && typeof raw.deaths === 'object' ? raw.deaths : {},
      attempts: raw.attempts && typeof raw.attempts === 'object' ? raw.attempts : {},
      upgrades: { ...DEFAULT_SAVE.upgrades, ...(raw.upgrades ?? {}) },
      settings: { ...DEFAULT_SAVE.settings, ...(raw.settings ?? {}) }
    };
  }

  private static unlockMilestoneRewards(data: SaveData, level: number): void {
    if (level >= 1) data.upgrades.dashStabilizer = true;
    if (level >= 2) data.upgrades.batteryBoost = true;
    if (level >= 3) data.upgrades.checkpointReboot = true;
    if (level >= 4) data.upgrades.chipBeamEnhancer = true;
    if (level >= 5) data.upgrades.airControlModule = true;
    if (level >= 6) data.upgrades.fuseShield = true;
    if (level >= 7) data.upgrades.debugDrone = true;
  }
}
