import Phaser from 'phaser';
import { COLORS } from '../constants';
import { CollectibleType, LevelSpec, PlatformSpec } from '../types';

export function makeLevel(id: number): LevelSpec {
  const themes = [
    { key: 'led', name: 'Level 1: LED Carnival', ground: COLORS.pcb, accent: COLORS.ledYellow, sky: 0x081a28, boss: 'diode' as const },
    { key: 'battery', name: 'Level 2: Battery Badlands', ground: 0x8a7a33, accent: COLORS.ledRed, sky: 0x1c1820, boss: 'overcharge' as const },
    { key: 'breadboard', name: 'Level 3: Breadboard Bazaar', ground: 0xe7e0c7, accent: COLORS.violet, sky: 0x101a2a, boss: 'loose' as const },
    { key: 'logic', name: 'Level 4: Logic Gate Lab', ground: 0x2250a8, accent: COLORS.ledBlue, sky: 0x071324, boss: 'nand' as const }
  ];
  const theme = themes[id - 1];
  const basePlatforms: PlatformSpec[] = [
    { x: 360, y: 454, w: 720, h: 48 },
    { x: 1040, y: 440, w: 420, h: 34 },
    { x: 1580, y: 420, w: 460, h: 34 },
    { x: 2180, y: 440, w: 500, h: 36 },
    { x: 2820, y: 430, w: 520, h: 34 },
    { x: 3720, y: 454, w: 980, h: 48 }
  ];
  if (id === 1) {
    const level1Ground: PlatformSpec[] = [
      { x: 360, y: 454, w: 720, h: 48 },
      { x: 1020, y: 440, w: 420, h: 34 },
      { x: 1580, y: 430, w: 460, h: 34 },
      { x: 2200, y: 440, w: 520, h: 36 },
      { x: 2860, y: 438, w: 520, h: 34 },
      { x: 3780, y: 454, w: 1040, h: 48 }
    ];
    const level1Platforms: PlatformSpec[] = [
      ...level1Ground,
      { x: 1240, y: 360, w: 180, h: 20, kind: 'blink' },
      { x: 2480, y: 365, w: 180, h: 20, kind: 'solid' }
    ];
    return {
      id,
      theme,
      width: 4200,
      start: new Phaser.Math.Vector2(80, 350),
      checkpoint: new Phaser.Math.Vector2(2200, 330),
      bossArenaX: 3420,
      platforms: level1Platforms,
      enemies: [
        { type: 'led', x: 980, y: 370 },
        { type: 'slime', x: 1620, y: 360 },
        { type: 'bat', x: 2500, y: 270 },
        { type: 'led', x: 3040, y: 370 }
      ],
      collectibles: placeCollectibles(level1Platforms, pickups(id)),
      hazards: placeHazards(level1Platforms, [
        { type: 'beam', x: 1880, y: 428, w: 110, h: 18 }
      ])
    };
  }
  if (id === 2) {
    const level2Platforms: PlatformSpec[] = [
      ...basePlatforms,
      { x: 1180, y: 350, w: 170, h: 20, kind: 'boost' },
      { x: 2360, y: 350, w: 170, h: 20, kind: 'moving' }
    ];
    return {
      id,
      theme,
      width: 4300,
      start: new Phaser.Math.Vector2(80, 350),
      checkpoint: new Phaser.Math.Vector2(2180, 330),
      bossArenaX: 3500,
      platforms: level2Platforms,
      enemies: [
        { type: 'slime', x: 760, y: 410 },
        { type: 'bat', x: 1500, y: 260 },
        { type: 'bug', x: 2380, y: 280 },
        { type: 'led', x: 3060, y: 370 }
      ],
      collectibles: placeCollectibles(level2Platforms, pickups(id)),
      hazards: placeHazards(level2Platforms, [
        { type: 'explosive', x: 1780, y: 374, w: 42, h: 42 },
        { type: 'acid', x: 3200, y: 448, w: 140, h: 18 }
      ])
    };
  }
  if (id === 4) {
    const level4Platforms: PlatformSpec[] = [
      { x: 360, y: 454, w: 720, h: 48 },
      { x: 980, y: 426, w: 360, h: 34 },
      { x: 1380, y: 360, w: 170, h: 20, kind: 'blink' },
      { x: 1740, y: 420, w: 420, h: 34 },
      { x: 2140, y: 330, w: 170, h: 20, kind: 'moving' },
      { x: 2520, y: 418, w: 430, h: 34 },
      { x: 2920, y: 336, w: 190, h: 20, kind: 'glitch' },
      { x: 3330, y: 430, w: 470, h: 34 },
      { x: 4120, y: 454, w: 1060, h: 48 }
    ];
    return {
      id,
      theme,
      width: 4680,
      start: new Phaser.Math.Vector2(80, 350),
      checkpoint: new Phaser.Math.Vector2(2460, 330),
      bossArenaX: 3860,
      platforms: level4Platforms,
      enemies: [
        { type: 'bug', x: 820, y: 360 },
        { type: 'led', x: 1680, y: 350 },
        { type: 'bat', x: 2260, y: 240 },
        { type: 'bug', x: 3050, y: 270 },
        { type: 'slime', x: 3480, y: 370 }
      ],
      collectibles: placeCollectibles(level4Platforms, pickups(id)),
      hazards: placeHazards(level4Platforms, [
        { type: 'beam', x: 1220, y: 410, w: 112, h: 16 },
        { type: 'shock', x: 2700, y: 400, w: 120, h: 16 },
        { type: 'beam', x: 3560, y: 420, w: 116, h: 16 }
      ])
    };
  }
  const level3Platforms: PlatformSpec[] = [
    ...basePlatforms,
    { x: 1180, y: 350, w: 170, h: 20, kind: 'bounce' },
    { x: 2360, y: 335, w: 190, h: 20, kind: 'bridge' },
    { x: 2920, y: 330, w: 180, h: 20, kind: 'glitch' }
  ];
  return {
    id,
    theme,
    width: 4400,
    start: new Phaser.Math.Vector2(80, 350),
    checkpoint: new Phaser.Math.Vector2(2180, 330),
    bossArenaX: 3580,
    platforms: level3Platforms,
    enemies: [
      { type: 'bug', x: 760, y: 330 },
      { type: 'slime', x: 1600, y: 350 },
      { type: 'bat', x: 2380, y: 250 },
      { type: 'led', x: 3120, y: 370 }
    ],
    collectibles: placeCollectibles(level3Platforms, pickups(id)),
    hazards: placeHazards(level3Platforms, [
      { type: 'shock', x: 1780, y: 382, w: 110, h: 18 },
      { type: 'beam', x: 3180, y: 448, w: 110, h: 18 }
    ])
  };
}

function pickups(level: number): LevelSpec['collectibles'] {
  const power = level === 1 ? 'Solder Sword' : level === 2 ? 'Battery Boost' : level === 3 ? 'Fuse Shield' : 'Solder Sword';
  return [
    { type: 'coin', x: 360, y: 420 },
    { type: 'cell', x: 1040, y: 390 },
    { type: 'chip', x: 1500, y: 345, id: `chip-${level}-a` },
    { type: 'powerup', x: 2180, y: 350, power },
    { type: 'chip', x: 2820, y: 340, id: `chip-${level}-b` },
    { type: 'cell', x: 3180, y: 360 },
    { type: 'chip', x: 3420, y: 320, id: `chip-${level}-c` }
  ];
}

function placeCollectibles(platforms: LevelSpec['platforms'], items: LevelSpec['collectibles']): LevelSpec['collectibles'] {
  return items.map((item) => {
    const platform = findSupportingPlatform(platforms, item.x, 24);
    if (!platform) return item;
    return { ...item, y: Math.min(platformTop(platform) - pickupOffset(item.type), 332) };
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
  return type === 'cell' ? 70 : 76;
}
