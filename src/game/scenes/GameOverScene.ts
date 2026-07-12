import Phaser from 'phaser';
import { Button } from '../ui/Button';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data: { level?: number; score?: number; message?: string }): void {
    this.input.enabled = true;
    this.input.topOnly = true;
    this.input.keyboard?.resetKeys();
    this.add.text(480, 132, 'Magic smoke detected!', { fontFamily: 'monospace', fontSize: '42px', color: '#ff3e5f' }).setOrigin(0.5);
    this.add.text(480, 196, data.message ?? 'Magic smoke detected.', { fontFamily: 'monospace', fontSize: '20px', color: '#ffe05d' }).setOrigin(0.5);
    this.add.text(480, 234, `Debug points: ${data.score ?? 0}`, { fontFamily: 'monospace', fontSize: '22px', color: '#f7fff7' }).setOrigin(0.5);
    const scene = `Level${data.level ?? 1}Scene`;
    new Button(this, 480, 300, 'Retry', () => this.scene.start(scene));
    new Button(this, 480, 360, 'Level Select', () => this.scene.start('LevelSelectScene'));
    new Button(this, 480, 420, 'Main Menu', () => this.scene.start('MainMenuScene'));
    this.add.text(480, 482, 'Press Enter/R to retry   L for level select   M for menu', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#9bd7e8'
    }).setOrigin(0.5);
    this.input.keyboard!.once('keydown-ENTER', () => this.scene.start(scene));
    this.input.keyboard!.once('keydown-R', () => this.scene.start(scene));
    this.input.keyboard!.once('keydown-SPACE', () => this.scene.start(scene));
    this.input.keyboard!.once('keydown-L', () => this.scene.start('LevelSelectScene'));
    this.input.keyboard!.once('keydown-M', () => this.scene.start('MainMenuScene'));
  }
}
