import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { GAME_HEIGHT, GAME_WIDTH } from '../constants';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x07131b);
    this.addGrid();
    this.add.text(GAME_WIDTH / 2, 86, 'Circuit Bros', { fontFamily: 'monospace', fontSize: '58px', color: '#ffe05d', stroke: '#07131b', strokeThickness: 6 }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 138, 'Debug Quest', { fontFamily: 'monospace', fontSize: '34px', color: '#45c4ff' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 184, 'Debug first, ask questions later.', { fontFamily: 'monospace', fontSize: '18px', color: '#f7fff7' }).setOrigin(0.5);
    new Button(this, GAME_WIDTH / 2, 250, 'Start Game', () => this.scene.start('Level1Scene'));
    new Button(this, GAME_WIDTH / 2, 306, 'Level Select', () => this.scene.start('LevelSelectScene'));
    new Button(this, GAME_WIDTH / 2, 362, 'Controls', () => this.showControls());
    new Button(this, GAME_WIDTH / 2, 418, 'Credits', () => this.scene.start('CreditsScene'));
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 28, 'Original electronics-themed prototype. No external art or audio assets.', { fontFamily: 'monospace', fontSize: '13px', color: '#9bd7e8' }).setOrigin(0.5);
  }

  private showControls(): void {
    const msg = 'Move A/D or Arrows   Jump Space/W/Up   Attack J   Dash K   Restart R   Pause Esc';
    this.add.text(GAME_WIDTH / 2, 476, msg, { fontFamily: 'monospace', fontSize: '16px', color: '#f7fff7', backgroundColor: '#102530cc', padding: { x: 12, y: 8 } }).setOrigin(0.5).setDepth(20);
  }

  private addGrid(): void {
    const g = this.add.graphics();
    g.lineStyle(1, 0x159947, 0.18);
    for (let x = 0; x < GAME_WIDTH; x += 48) g.lineBetween(x, 0, x, GAME_HEIGHT);
    for (let y = 0; y < GAME_HEIGHT; y += 48) g.lineBetween(0, y, GAME_WIDTH, y);
    g.lineStyle(3, 0xf3a33a, 0.5);
    g.lineBetween(0, 430, GAME_WIDTH, 350);
    g.lineBetween(0, 120, GAME_WIDTH, 200);
  }
}
