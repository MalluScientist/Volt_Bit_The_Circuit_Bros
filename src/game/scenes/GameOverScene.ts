import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { Level1Scene } from './Level1Scene';
import { Level2Scene } from './Level2Scene';
import { Level3Scene } from './Level3Scene';
import { Level4Scene } from './Level4Scene';

const LEVEL_SCENES = [Level1Scene, Level2Scene, Level3Scene, Level4Scene] as const;

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
    const level = Phaser.Math.Clamp(data.level ?? 1, 1, LEVEL_SCENES.length);
    new Button(this, 480, 300, 'Retry', () => this.retryLevel(level));
    new Button(this, 480, 360, 'Level Select', () => this.transitionTo('LevelSelectScene'));
    new Button(this, 480, 420, 'Main Menu', () => this.transitionTo('MainMenuScene'));
    this.add.text(480, 482, 'Press Enter/R to retry   L for level select   M for menu', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#9bd7e8'
    }).setOrigin(0.5);
    this.input.keyboard!.once('keydown-ENTER', () => this.retryLevel(level));
    this.input.keyboard!.once('keydown-R', () => this.retryLevel(level));
    this.input.keyboard!.once('keydown-SPACE', () => this.retryLevel(level));
    this.input.keyboard!.once('keydown-L', () => this.transitionTo('LevelSelectScene'));
    this.input.keyboard!.once('keydown-M', () => this.transitionTo('MainMenuScene'));
  }

  private transitionTo(target: string): void {
    this.queueTransition(() => this.scene.start(target));
  }

  private retryLevel(level: number): void {
    const key = `Level${level}Scene`;
    const LevelScene = LEVEL_SCENES[level - 1];
    this.queueTransition(() => {
      // Phaser normally reuses the original Scene instance after stop/start.
      // A failed Arcade world can retain plugin state even after shutdown, so
      // Retry discards it and installs a completely fresh level scene.
      this.scene.remove(key);
      this.scene.add(key, LevelScene, true);
      this.scene.stop();
    });
  }

  private queueTransition(action: () => void): void {
    if (this.transitioning) return;
    this.transitioning = true;
    this.input.resetPointers();
    this.input.keyboard?.resetKeys();
    this.input.enabled = false;

    // The game-level post-step event is independent of this Scene's clock and
    // runs after both input dispatch and physics have fully completed.
    this.game.events.once(Phaser.Core.Events.POST_STEP, action);
  }
}
