export type CharacterId = 'volt' | 'bit';

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  tagline: string;
  selectLine: string;
  levelLines: string[];
  color: number;
  accent: number;
  idleTexture: string;
  runTexture: string;
  jumpTexture: string;
  fallTexture: string;
  attackTexture: string;
  moveSpeed: number;
  acceleration: number;
  airControl: number;
  dashSpeed: number;
  dashCooldown: number;
  dashCost: number;
  dashRegenMs: number;
  maxHealth: number;
  attackDamage: number;
  attackCooldown: number;
  attackDuration: number;
  attackRange: number;
  beamDamage: number;
  beamCooldown: number;
  shieldBonus: number;
}

export const CHARACTER_CONFIGS: Record<CharacterId, CharacterConfig> = {
  volt: {
    id: 'volt',
    name: 'Volt',
    tagline: 'Fast, reckless, and probably already airborne.',
    selectLine: 'Pick me if you like speed and questionable decisions.',
    levelLines: [
      'Relax, I debugged this in my head.',
      'If it sparks, it works.',
      'Speed first, safety notes later.'
    ],
    color: 0x28c76f,
    accent: 0x45c4ff,
    idleTexture: 'volt-idle',
    runTexture: 'volt-run',
    jumpTexture: 'volt-jump',
    fallTexture: 'volt-fall',
    attackTexture: 'volt-attack',
    moveSpeed: 330,
    acceleration: 1750,
    airControl: 1,
    dashSpeed: 720,
    dashCooldown: 180,
    dashCost: 0.34,
    dashRegenMs: 780,
    maxHealth: 3,
    attackDamage: 1,
    attackCooldown: 170,
    attackDuration: 125,
    attackRange: 46,
    beamDamage: 1,
    beamCooldown: 340,
    shieldBonus: 0
  },
  bit: {
    id: 'bit',
    name: 'Bit',
    tagline: 'Slower, sturdier, and professionally unimpressed.',
    selectLine: 'Pick me if you prefer surviving those decisions.',
    levelLines: [
      'That is not a repair. That is a crime scene.',
      'I checked the schematic. We are doomed.',
      'Please stop fixing things with enthusiasm.'
    ],
    color: 0x2f80ff,
    accent: 0xffa33a,
    idleTexture: 'bit-idle',
    runTexture: 'bit-run',
    jumpTexture: 'bit-jump',
    fallTexture: 'bit-fall',
    attackTexture: 'bit-attack',
    moveSpeed: 250,
    acceleration: 1250,
    airControl: 0.74,
    dashSpeed: 560,
    dashCooldown: 290,
    dashCost: 0.46,
    dashRegenMs: 1050,
    maxHealth: 4,
    attackDamage: 2,
    attackCooldown: 320,
    attackDuration: 190,
    attackRange: 58,
    beamDamage: 2,
    beamCooldown: 470,
    shieldBonus: 1
  }
};

export function getCharacterConfig(id: string | undefined): CharacterConfig {
  return CHARACTER_CONFIGS[id === 'bit' ? 'bit' : 'volt'];
}
