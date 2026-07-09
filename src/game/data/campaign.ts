export interface CampaignLevel {
  id: number;
  name: string;
  shortName: string;
  sceneKey?: string;
  boss: string;
  reward: string;
  implemented: boolean;
  finalLevel?: boolean;
}

export const CAMPAIGN_LEVELS: CampaignLevel[] = [
  { id: 1, name: 'LED Carnival', shortName: 'LED Carnival', sceneKey: 'Level1Scene', boss: 'Disco Diode', reward: 'Clock Shard 1', implemented: true },
  { id: 2, name: 'Battery Badlands', shortName: 'Battery Badlands', sceneKey: 'Level2Scene', boss: 'Captain Overcharge', reward: 'Clock Shard 2', implemented: true },
  { id: 3, name: 'Breadboard Bazaar', shortName: 'Breadboard Bazaar', sceneKey: 'Level3Scene', boss: 'The Loose Connection', reward: 'Clock Shard 3', implemented: true },
  { id: 4, name: 'Logic Gate Lab', shortName: 'Logic Gate Lab', sceneKey: 'Level4Scene', boss: 'NAND Knight', reward: 'Clock Shard 4', implemented: true },
  { id: 5, name: 'Capacitor Sky City', shortName: 'Capacitor Sky', boss: 'Storm Cap', reward: 'Clock Shard 5', implemented: false },
  { id: 6, name: 'Relay Robot Factory', shortName: 'Relay Factory', boss: 'Mecha Relay Rex', reward: 'Clock Shard 6', implemented: false },
  { id: 7, name: 'Wi-Fi Jungle', shortName: 'Wi-Fi Jungle', boss: 'Buffer Beast', reward: 'Clock Shard 7', implemented: false },
  { id: 8, name: 'Thermal Reactor', shortName: 'Thermal Reactor', boss: 'Heat Sink Hydra', reward: 'Clock Shard 8', implemented: false },
  { id: 9, name: 'Glitch Core Citadel', shortName: 'Glitch Core', boss: 'King Glitch', reward: 'Prime Clock reboot', implemented: false, finalLevel: true }
];

export const MAIN_CLOCK_SHARD_COUNT = 8;

export function getCampaignLevel(id: number): CampaignLevel {
  return CAMPAIGN_LEVELS.find((level) => level.id === id) ?? CAMPAIGN_LEVELS[0];
}
