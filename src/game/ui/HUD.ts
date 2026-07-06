import Phaser from 'phaser';
import { PowerUpType } from '../types';

export interface HudState {
  health: number;
  maxHealth: number;
  dashRatio: number;
  coins: number;
  score: number;
  levelName: string;
  powerUp: PowerUpType;
  chips: number;
}

export class HUD {
  private hearts: Phaser.GameObjects.Rectangle[] = [];
  private dashBar: Phaser.GameObjects.Rectangle;
  private coinText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private powerText: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene) {
    scene.add.rectangle(480, 18, 960, 36, 0x07131b, 0.78).setScrollFactor(0).setDepth(90);
    for (let i = 0; i < 5; i++) {
      const cell = scene.add.rectangle(24 + i * 24, 18, 18, 22, 0x1c3c48).setStrokeStyle(2, 0xffe05d).setScrollFactor(0).setDepth(91);
      this.hearts.push(cell);
    }
    scene.add.rectangle(188, 18, 92, 12, 0x102530).setStrokeStyle(1, 0x45c4ff).setScrollFactor(0).setDepth(91);
    this.dashBar = scene.add.rectangle(143, 18, 0, 10, 0x45c4ff).setOrigin(0, 0.5).setScrollFactor(0).setDepth(92);
    this.coinText = this.text(250, 9);
    this.scoreText = this.text(350, 9);
    this.levelText = this.text(540, 9);
    this.powerText = this.text(770, 9);
  }

  update(state: HudState): void {
    this.hearts.forEach((cell, index) => cell.setFillStyle(index < state.health ? 0xffe05d : 0x1c3c48));
    this.dashBar.width = Phaser.Math.Clamp(state.dashRatio, 0, 1) * 90;
    this.coinText.setText(`Sparks ${state.coins}`);
    this.scoreText.setText(`Debug ${state.score}`);
    this.levelText.setText(state.levelName);
    this.powerText.setText(`Tool ${state.powerUp}  Chips ${state.chips}/3`);
  }

  private text(x: number, y: number): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#f7fff7'
    }).setScrollFactor(0).setDepth(92);
  }
}
