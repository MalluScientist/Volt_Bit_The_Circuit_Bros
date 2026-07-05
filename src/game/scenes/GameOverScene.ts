import Phaser from 'phaser';
import { Button } from '../ui/Button';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data: { level?: number; score?: number }): void {
    this.add.text(480, 132, 'Magic smoke detected!', { fontFamily: 'monospace', fontSize: '42px', color: '#ff3e5f' }).setOrigin(0.5);
    this.add.text(480, 206, `Debug points: ${data.score ?? 0}`, { fontFamily: 'monospace', fontSize: '22px', color: '#f7fff7' }).setOrigin(0.5);
    const scene = `Level${data.level ?? 1}Scene`;
    new Button(this, 480, 300, 'Retry', () => this.scene.start(scene));
    new Button(this, 480, 360, 'Level Select', () => this.scene.start('LevelSelectScene'));
    new Button(this, 480, 420, 'Main Menu', () => this.scene.start('MainMenuScene'));
  }
}
