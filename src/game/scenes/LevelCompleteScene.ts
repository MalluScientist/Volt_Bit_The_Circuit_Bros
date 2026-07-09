import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { SaveSystem } from '../systems/SaveSystem';
import { AudioSystem } from '../systems/AudioSystem';

export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super('LevelCompleteScene');
  }

  create(data: { level: number; levelName?: string; characterName?: string; score: number; coins?: number; chips: number; clockShardEarned?: boolean }): void {
    SaveSystem.completeLevel(data.level, data.score);
    new AudioSystem().complete();
    const save = SaveSystem.load();
    this.add.text(480, 78, 'Continuity restored!', { fontFamily: 'monospace', fontSize: '40px', color: '#77ff4f' }).setOrigin(0.5);
    this.add.text(480, 176, [
      data.levelName ?? `Level ${data.level}`,
      `Hero: ${data.characterName ?? 'Circuit Bro'}`,
      `Debug points: ${data.score}`,
      `Spark Coins: ${data.coins ?? 0}`,
      `Debug Chips: ${data.chips}/3`,
      data.clockShardEarned ? `Clock Shard ${data.level} recovered` : 'Clock Shard pending',
      `Total Clock Shards: ${save.clockShards.length}/8`,
      'Root cause analysis pending.'
    ].join('\n'), {
      fontFamily: 'monospace',
      fontSize: '19px',
      color: '#f7fff7',
      align: 'center',
      lineSpacing: 7
    }).setOrigin(0.5);
    if (data.level < 3) new Button(this, 480, 356, 'Continue', () => this.scene.start(`Level${data.level + 1}Scene`));
    else new Button(this, 480, 356, 'Level Select', () => this.scene.start('LevelSelectScene'));
    new Button(this, 300, 424, 'Retry', () => this.scene.start(`Level${data.level}Scene`), 190);
    new Button(this, 660, 424, 'Level Select', () => this.scene.start('LevelSelectScene'), 230);
    new Button(this, 480, 486, 'Main Menu', () => this.scene.start('MainMenuScene'), 210);
  }
}
