import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { SaveSystem } from '../systems/SaveSystem';

export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super('LevelCompleteScene');
  }

  create(data: { level: number; score: number; chips: number }): void {
    SaveSystem.completeLevel(data.level, data.score);
    this.add.text(480, 112, 'Continuity restored!', { fontFamily: 'monospace', fontSize: '42px', color: '#77ff4f' }).setOrigin(0.5);
    this.add.text(480, 190, `Level ${data.level} complete\nDebug points: ${data.score}\nDebug chips: ${data.chips}/3\nThat was probably safe.`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#f7fff7',
      align: 'center',
      lineSpacing: 10
    }).setOrigin(0.5);
    if (data.level < 3) new Button(this, 480, 342, 'Next Level', () => this.scene.start(`Level${data.level + 1}Scene`));
    new Button(this, 480, data.level < 3 ? 402 : 360, 'Level Select', () => this.scene.start('LevelSelectScene'));
    new Button(this, 480, data.level < 3 ? 462 : 420, 'Main Menu', () => this.scene.start('MainMenuScene'));
  }
}
