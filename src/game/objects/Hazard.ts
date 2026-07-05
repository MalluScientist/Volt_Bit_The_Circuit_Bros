import Phaser from 'phaser';
import { HazardType } from '../types';

export class Hazard extends Phaser.GameObjects.Rectangle {
  readonly hazardType: HazardType;
  armed = true;

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, type: HazardType) {
    const color = type === 'acid' ? 0x77ff4f : type === 'explosive' ? 0xff3e5f : type === 'shock' ? 0x45c4ff : 0xffe05d;
    super(scene, x, y, w, h, color, 0.82);
    this.hazardType = type;
    this.setData('hazard', true);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setStrokeStyle(2, 0xf7fff7, 0.45);
    if (type === 'explosive') {
      scene.tweens.add({ targets: this, alpha: 0.35, yoyo: true, repeat: -1, duration: 420 });
    } else {
      scene.tweens.add({ targets: this, scaleY: 1.12, yoyo: true, repeat: -1, duration: 700 });
    }
  }
}
