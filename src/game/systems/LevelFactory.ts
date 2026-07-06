import Phaser from 'phaser';
import { COLORS } from '../constants';
import { CollectibleType, LevelSpec, PlatformSpec } from '../types';

export function makeLevel(id: number): LevelSpec {
  const themes = [
    { key: 'led', name: 'Level 1: LED Carnival', ground: COLORS.pcb, accent: COLORS.ledYellow, sky: 0x081a28, boss: 'diode' as const },
    { key: 'battery', name: 'Level 2: Battery Badlands', ground: 0x8a7a33, accent: COLORS.ledRed, sky: 0x1c1820, boss: 'overcharge' as const },
    { key: 'breadboard', name: 'Level 3: Breadboard Bazaar', ground: 0xe7e0c7, accent: COLORS.violet, sky: 0x101a2a, boss: 'loose' as const }
  ];
  const theme = themes[id - 1];
  const basePlatforms: PlatformSpec[] = [
    { x: 340, y: 500, w: 680, h: 48 },
    { x: 960, y: 452, w: 320, h: 30 },
    { x: 1320, y: 398, w: 300, h: 28 },
    { x: 1720, y: 460, w: 430, h: 36 },
    { x: 2180, y: 400, w: 340, h: 28 },
    { x: 2600, y: 462, w: 470, h: 36 },
    { x: 3140, y: 420, w: 420, h: 30 },
    { x: 3780, y: 498, w: 800, h: 48 }
  ];
  if (id === 1) {
    const level1Ground: PlatformSpec[] = [
      { x: 360, y: 500, w: 720, h: 48 },
      { x: 900, y: 465, w: 320, h: 30 },
      { x: 1250, y: 430, w: 300, h: 28 },
      { x: 1620, y: 455, w: 360, h: 36 },
      { x: 2020, y: 430, w: 340, h: 30 },
      { x: 2420, y: 455, w: 360, h: 36 },
      { x: 2860, y: 440, w: 360, h: 30 },
      { x: 3300, y: 430, w: 340, h: 30 },
      { x: 3860, y: 498, w: 880, h: 48 }
    ];
    const level1Platforms: PlatformSpec[] = [
      ...level1Ground,
      { x: 720, y: 405, w: 150, h: 20, kind: 'blink' },
      { x: 1120, y: 380, w: 150, h: 20, kind: 'blink' },
      { x: 1510, y: 350, w: 140, h: 20, kind: 'solid' },
      { x: 1980, y: 365, w: 170, h: 20, kind: 'blink' },
      { x: 2460, y: 365, w: 160, h: 20, kind: 'solid' },
      { x: 2880, y: 370, w: 170, h: 20, kind: 'blink' },
      { x: 3330, y: 375, w: 190, h: 20 }
    ];
    return {
      id,
      theme,
      width: 4300,
      start: new Phaser.Math.Vector2(80, 390),
      checkpoint: new Phaser.Math.Vector2(2080, 320),
      bossArenaX: 3520,
      platforms: level1Platforms,
      enemies: [
        { type: 'led', x: 780, y: 410 },
        { type: 'slime', x: 1260, y: 350 },
        { type: 'led', x: 1860, y: 410 },
        { type: 'bat', x: 2360, y: 260 },
        { type: 'led', x: 3100, y: 360 }
      ],
      collectibles: placeCollectibles(level1Platforms, pickups(id)),
      hazards: placeHazards(level1Platforms, [
        { type: 'beam', x: 1640, y: 428, w: 110, h: 18 },
        { type: 'beam', x: 2740, y: 428, w: 100, h: 18 }
      ])
    };
  }
  if (id === 2) {
    const level2Platforms: PlatformSpec[] = [
      ...basePlatforms,
      { x: 750, y: 360, w: 140, h: 20, kind: 'boost' },
      { x: 1220, y: 330, w: 150, h: 20, kind: 'moving' },
      { x: 1690, y: 300, w: 140, h: 20, kind: 'moving' },
      { x: 2340, y: 330, w: 150, h: 20, kind: 'boost' },
      { x: 2890, y: 305, w: 170, h: 20, kind: 'moving' }
    ];
    return {
      id,
      theme,
      width: 4500,
      start: new Phaser.Math.Vector2(80, 390),
      checkpoint: new Phaser.Math.Vector2(2200, 320),
      bossArenaX: 3650,
      platforms: level2Platforms,
      enemies: [
        { type: 'slime', x: 700, y: 410 },
        { type: 'bat', x: 1160, y: 250 },
        { type: 'led', x: 1760, y: 410 },
        { type: 'bug', x: 2360, y: 260 },
        { type: 'bat', x: 3060, y: 280 }
      ],
      collectibles: placeCollectibles(level2Platforms, pickups(id)),
      hazards: placeHazards(level2Platforms, [
        { type: 'explosive', x: 1460, y: 374, w: 42, h: 42 },
        { type: 'acid', x: 2020, y: 492, w: 150, h: 18 },
        { type: 'explosive', x: 2750, y: 438, w: 42, h: 42 },
        { type: 'acid', x: 3340, y: 492, w: 140, h: 18 }
      ])
    };
  }
  const level3Platforms: PlatformSpec[] = [
    ...basePlatforms,
    { x: 770, y: 360, w: 150, h: 20, kind: 'bounce' },
    { x: 1180, y: 320, w: 170, h: 20, kind: 'bridge' },
    { x: 1540, y: 280, w: 150, h: 20, kind: 'glitch' },
    { x: 2020, y: 300, w: 150, h: 20, kind: 'bounce' },
    { x: 2450, y: 260, w: 170, h: 20, kind: 'bridge' },
    { x: 2880, y: 330, w: 160, h: 20, kind: 'glitch' },
    { x: 1160, y: 145, w: 190, h: 20, kind: 'bridge' }
  ];
  return {
    id,
    theme,
    width: 4600,
    start: new Phaser.Math.Vector2(80, 390),
    checkpoint: new Phaser.Math.Vector2(2230, 320),
    bossArenaX: 3740,
    platforms: level3Platforms,
    enemies: [
      { type: 'bug', x: 720, y: 300 },
      { type: 'slime', x: 1300, y: 350 },
      { type: 'bat', x: 1840, y: 240 },
      { type: 'bug', x: 2460, y: 190 },
      { type: 'led', x: 3200, y: 370 }
    ],
    collectibles: placeCollectibles(level3Platforms, [...pickups(id).filter((item) => item.id !== 'chip-3-c'), { type: 'chip', x: 1160, y: 95, id: 'chip-3-secret' }, { type: 'powerup', x: 1220, y: 95, power: 'Fuse Shield' }]),
    hazards: placeHazards(level3Platforms, [
      { type: 'shock', x: 1700, y: 382, w: 110, h: 18 },
      { type: 'shock', x: 2750, y: 448, w: 130, h: 18 },
      { type: 'beam', x: 3320, y: 490, w: 110, h: 18 }
    ])
  };
}

function pickups(level: number): LevelSpec['collectibles'] {
  return [
    { type: 'coin', x: 360, y: 420 },
    { type: 'coin', x: 430, y: 420 },
    { type: 'coin', x: 980, y: 390 },
    { type: 'cell', x: 1320, y: 345 },
    { type: 'chip', x: 1510, y: 230, id: `chip-${level}-a` },
    { type: 'coin', x: 1880, y: 390 },
    { type: 'powerup', x: 2180, y: 350, power: level === 1 ? 'Solder Sword' : level === 2 ? 'Battery Boost' : 'Fuse Shield' },
    { type: 'coin', x: 2500, y: 260 },
    { type: 'chip', x: 2920, y: 270, id: `chip-${level}-b` },
    { type: 'cell', x: 3160, y: 360 },
    { type: 'chip', x: 3420, y: 320, id: `chip-${level}-c` }
  ];
}

function placeCollectibles(platforms: LevelSpec['platforms'], items: LevelSpec['collectibles']): LevelSpec['collectibles'] {
  return items.map((item) => {
    const platform = findSupportingPlatform(platforms, item.x, 24);
    if (!platform) return item;
    return { ...item, y: platformTop(platform) - pickupOffset(item.type) };
  });
}

function placeHazards(platforms: LevelSpec['platforms'], hazards: LevelSpec['hazards']): LevelSpec['hazards'] {
  return hazards.map((hazard) => {
    if (hazard.type === 'acid') return hazard;
    const platform = findSupportingPlatform(platforms, hazard.x, Math.max(28, hazard.w / 2));
    if (!platform) return hazard;
    return { ...hazard, y: platformTop(platform) - hazard.h / 2 };
  });
}

function findSupportingPlatform(platforms: LevelSpec['platforms'], x: number, margin: number): LevelSpec['platforms'][number] | undefined {
  const candidates = platforms.filter((platform) => x >= platform.x - platform.w / 2 - margin && x <= platform.x + platform.w / 2 + margin);
  return candidates.sort((a, b) => platformTop(a) - platformTop(b))[0];
}

function platformTop(platform: LevelSpec['platforms'][number]): number {
  return platform.y - platform.h / 2;
}

function pickupOffset(type: CollectibleType): number {
  return type === 'cell' ? 48 : 54;
}
