import { CharacterId } from '../characters';

export type PowerUpType = 'None' | 'Solder Sword' | 'Battery Boost' | 'Fuse Shield';
export type CollectibleType = 'coin' | 'cell' | 'chip' | 'powerup';
export type HazardType = 'acid' | 'explosive' | 'beam' | 'shock';

export interface SaveData {
  selectedCharacter: CharacterId;
  highScore: number;
  completedLevels: number[];
  debugChips: Record<string, string[]>;
  clockShards: number[];
  upgrades: {
    dashStabilizer: boolean;
    batteryBoost: boolean;
    checkpointReboot: boolean;
    chipBeamEnhancer: boolean;
    airControlModule: boolean;
    fuseShield: boolean;
    debugDrone: boolean;
  };
  musicEnabled: boolean;
  storySeen: boolean;
  settings: {
    screenShake: boolean;
    flashEffects: 'normal' | 'reduced' | 'off';
    touchOpacity: number;
    touchSize: number;
    leftHandedTouch: boolean;
    soundVolume: number;
    musicVolume: number;
    extraBatteryCell: boolean;
    slowerHazards: boolean;
    longerCoyoteTime: boolean;
    keepDebugChipsAfterDeath: boolean;
  };
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
