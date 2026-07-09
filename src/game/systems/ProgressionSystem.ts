import { CAMPAIGN_LEVELS, CampaignLevel, MAIN_CLOCK_SHARD_COUNT } from '../data/campaign';
import { SaveData } from '../types';

export interface LevelProgress {
  level: CampaignLevel;
  unlocked: boolean;
  completed: boolean;
  chips: number;
  clockShardEarned: boolean;
  stateLabel: 'Fixed' | 'Open' | 'Locked' | 'Future';
}

export class ProgressionSystem {
  static levelProgress(save: SaveData): LevelProgress[] {
    return CAMPAIGN_LEVELS.map((level) => {
      const completed = save.completedLevels.includes(level.id);
      const clockShardEarned = save.clockShards.includes(level.id);
      const unlocked = ProgressionSystem.isUnlocked(save, level);
      return {
        level,
        unlocked,
        completed,
        chips: save.debugChips[String(level.id)]?.length ?? 0,
        clockShardEarned,
        stateLabel: completed ? 'Fixed' : !level.implemented ? 'Future' : unlocked ? 'Open' : 'Locked'
      };
    });
  }

  static isUnlocked(save: SaveData, level: CampaignLevel): boolean {
    if (level.id === 1) return true;
    if (level.finalLevel) return save.clockShards.length >= MAIN_CLOCK_SHARD_COUNT;
    return save.completedLevels.includes(level.id - 1);
  }

  static shardText(save: SaveData): string {
    return `${save.clockShards.length}/${MAIN_CLOCK_SHARD_COUNT}`;
  }

  static lockedMessage(progress: LevelProgress): string {
    if (!progress.level.implemented) return `${progress.level.name} arrives in a later milestone.`;
    if (progress.level.finalLevel) return `Recover ${MAIN_CLOCK_SHARD_COUNT} Clock Shards to unlock the final level.`;
    return 'Restore the previous zone first.';
  }
}
