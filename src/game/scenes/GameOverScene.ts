import Phaser from 'phaser';
import { Button } from '../ui/Button';

export class GameOverScene extends Phaser.Scene {
  private transitioning = false;

  constructor() {
    super('GameOverScene');
  }

  create(data: { level?: number; score?: number; message?: string }): void {
    this.transitioning = false;
    this.input.enabled = true;
    this.input.topOnly = true;
    this.input.keyboard?.resetKeys();
    this.add.text(480, 132, 'Magic smoke detected!', { fontFamily: 'monospace', fontSize: '42px', color: '#ff3e5f' }).setOrigin(0.5);
    this.add.text(480, 196, data.message ?? 'Magic smoke detected.', { fontFamily: 'monospace', fontSize: '20px', color: '#ffe05d' }).setOrigin(0.5);
    this.add.text(480, 234, `Debug points: ${data.score ?? 0}`, { fontFamily: 'monospace', fontSize: '22px', color: '#f7fff7' }).setOrigin(0.5);
    const scene = `Level${data.level ?? 1}Scene`;
    new Button(this, 480, 300, 'Retry', () => this.transitionTo(scene));
    new Button(this, 480, 360, 'Level Select', () => this.transitionTo('LevelSelectScene'));
    new Button(this, 480, 420, 'Main Menu', () => this.transitionTo('MainMenuScene'));
    this.add.text(480, 482, 'Press Enter/R to retry   L for level select   M for menu', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#9bd7e8'
    }).setOrigin(0.5);
    this.input.keyboard!.once('keydown-ENTER', () => this.transitionTo(scene));
    this.input.keyboard!.once('keydown-R', () => this.transitionTo(scene));
    this.input.keyboard!.once('keydown-SPACE', () => this.transitionTo(scene));
    this.input.keyboard!.once('keydown-L', () => this.transitionTo('LevelSelectScene'));
    this.input.keyboard!.once('keydown-M', () => this.transitionTo('MainMenuScene'));
  }

  private transitionTo(target: string): void {
    if (this.transitioning) return;
    this.transitioning = true;
    this.input.enabled = false;

    // Starting a scene synchronously inside Phaser's pointer dispatch can
    // destroy the active hit zone while InputPlugin is still iterating it.
    // Move the transition to the next game step so shutdown is clean.
    this.time.delayedCall(0, () => {
      this.scene.start(target);
    });
  }
}
