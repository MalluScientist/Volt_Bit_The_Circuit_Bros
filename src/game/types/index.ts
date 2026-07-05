export type PowerUpType = 'None' | 'Solder Sword' | 'Battery Boost' | 'Fuse Shield';
export type CollectibleType = 'coin' | 'cell' | 'chip' | 'powerup';
export type HazardType = 'acid' | 'explosive' | 'beam' | 'shock';

export interface SaveData {
  highScore: number;
  completedLevels: number[];
  debugChips: Record<string, string[]>;
}

export interface LevelTheme {
  key: string;
  name: string;
  ground: number;
  accent: number;
  sky: number;
  boss: 'diode' | 'overcharge' | 'loose';
}

export interface PlatformSpec {
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: 'solid' | 'blink' | 'moving' | 'boost' | 'bounce' | 'bridge' | 'glitch';
}

export interface SpawnSpec {
  type: 'led' | 'slime' | 'bat' | 'bug';
  x: number;
  y: number;
}

export interface CollectibleSpec {
  type: CollectibleType;
  x: number;
  y: number;
  id?: string;
  power?: PowerUpType;
}

export interface HazardSpec {
  type: HazardType;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LevelSpec {
  id: number;
  theme: LevelTheme;
  width: number;
  start: Phaser.Math.Vector2;
  checkpoint: Phaser.Math.Vector2;
  bossArenaX: number;
  platforms: PlatformSpec[];
  enemies: SpawnSpec[];
  collectibles: CollectibleSpec[];
  hazards: HazardSpec[];
}
