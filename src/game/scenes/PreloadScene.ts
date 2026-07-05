import Phaser from 'phaser';
import { COLORS } from '../constants';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create(): void {
    this.makeVolt('volt-idle', 0x159947, false);
    this.makeVolt('volt-run', 0x28c76f, false);
    this.makeVolt('volt-jump', 0x45c4ff, true);
    this.makeVolt('volt-fall', 0xffe05d, true);
    this.makeVolt('volt-attack', 0x159947, false, true);
    this.rectTexture('enemy-led', 24, 24, COLORS.ledRed, COLORS.ledYellow);
    this.rectTexture('enemy-slime', 30, 20, 0x77ff4f, 0x45c4ff);
    this.rectTexture('enemy-bat', 30, 22, 0x5641b6, 0xffe05d);
    this.rectTexture('enemy-bug', 26, 24, 0x8e6bff, 0x77ff4f);
    this.rectTexture('boss-diode', 64, 72, 0xff3e5f, 0xffe05d);
    this.rectTexture('boss-overcharge', 68, 76, 0x8a7a33, 0xff3e5f);
    this.rectTexture('boss-loose', 64, 70, 0xe7e0c7, 0x8e6bff);
    this.rectTexture('coin', 14, 14, 0xffe05d, 0xf3a33a);
    this.rectTexture('cell', 18, 24, 0x45c4ff, 0xffe05d);
    this.rectTexture('chip', 18, 18, 0x159947, 0xf7fff7);
    this.rectTexture('powerup', 22, 22, 0xff3e5f, 0x45c4ff);
    this.rectTexture('checkpoint', 28, 48, 0x45c4ff, 0xffe05d);
    this.scene.start('MainMenuScene');
  }

  private rectTexture(key: string, w: number, h: number, fill: number, accent: number): void {
    const g = this.add.graphics();
    g.fillStyle(fill);
    g.fillRect(0, 0, w, h);
    g.fillStyle(accent);
    g.fillRect(4, 4, w - 8, 4);
    g.fillRect(w - 8, h - 8, 4, 4);
    g.lineStyle(2, 0x07131b);
    g.strokeRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private makeVolt(key: string, suit: number, airborne: boolean, attack = false): void {
    const g = this.add.graphics();
    g.fillStyle(0x20242a);
    g.fillRect(8, 2, 18, 10);
    g.fillStyle(0x45c4ff);
    g.fillRect(10, 4, 6, 4);
    g.fillRect(18, 4, 6, 4);
    g.fillStyle(0xf3c08a);
    g.fillRect(10, 10, 14, 10);
    g.fillStyle(suit);
    g.fillRect(7, 20, 20, 18);
    g.fillStyle(0xffe05d);
    g.fillRect(7, 26, 20, 4);
    g.fillStyle(0x101014);
    g.fillRect(8, 38, 6, airborne ? 5 : 8);
    g.fillRect(20, 38, 6, airborne ? 8 : 5);
    g.fillStyle(0xf7fff7);
    g.fillRect(4, 22, 4, 12);
    g.fillRect(26, 22, 4, 12);
    if (attack) {
      g.fillStyle(0x45c4ff);
      g.fillRect(28, 22, 20, 4);
      g.fillStyle(0xffe05d);
      g.fillRect(46, 20, 5, 8);
    }
    g.generateTexture(key, attack ? 52 : 34, 48);
    g.destroy();
  }
}
