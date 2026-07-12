import Phaser from 'phaser';
import { Button } from '../ui/Button';

export const RETRY_LEVEL_KEY = 'circuit-bros-retry-level';

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
    const level = Phaser.Math.Clamp(data.level ?? 1, 1, 4);
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

    // Scene-level fallback in case a stale interactive zone consumes the
    // object-specific event. Coordinates are in the fixed 960x540 game space.
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.x >= 332 && pointer.x <= 628 && pointer.y >= 268 && pointer.y <= 332) {
        this.retryLevel(level);
      }
    });
  }

  private transitionTo(target: string): void {
    this.queueTransition(() => this.scene.start(target));
  }

  private retryLevel(level: number): void {
    if (this.transitioning) return;
    this.transitioning = true;
    try {
      sessionStorage.setItem(RETRY_LEVEL_KEY, String(level));
      // A full runtime reset guarantees that no damaged Phaser scene, physics,
      // timer, input, or WebGL state survives the failed attempt.
      window.location.reload();
    } catch {
      this.transitioning = false;
      this.transitionTo(`Level${level}Scene`);
    }
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
