import Phaser from 'phaser';
import { HazardType } from '../types';

export class Hazard extends Phaser.GameObjects.Rectangle {
  readonly hazardType: HazardType;
  armed = true;

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, type: HazardType) {
    const color = type === 'acid' ? 0x69d83f : type === 'explosive' ? 0xff3e5f : type === 'shock' ? 0x8e6bff : 0xff6b2a;
    super(scene, x, y, w, h, color, 0.76);
    this.hazardType = type;
    this.setData('hazard', true);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setDepth(8);
    this.setStrokeStyle(2, type === 'acid' ? 0x234b19 : 0x07131b, 0.9);
    const warningColor = type === 'acid' ? 0xffe05d : type === 'shock' ? 0xff3e5f : 0xffa33a;
    const markerTop = scene.add.rectangle(x, y - h / 2 - 4, w, 3, warningColor, 0.78).setDepth(9);
    const markerBottom = scene.add.rectangle(x, y + h / 2 + 4, w, 3, warningColor, 0.78).setDepth(9);
    const teeth = [
      scene.add.triangle(x - w / 2 + 9, y, 0, 10, 7, 0, 14, 10, warningColor, 0.72).setDepth(9),
      scene.add.triangle(x + w / 2 - 23, y, 0, 10, 7, 0, 14, 10, warningColor, 0.72).setDepth(9)
    ];
    if (type === 'explosive') {
      scene.tweens.add({ targets: [this, markerTop, markerBottom, ...teeth], alpha: 0.38, yoyo: true, repeat: -1, duration: 420 });
    } else {
      scene.tweens.add({ targets: this, scaleY: 1.12, yoyo: true, repeat: -1, duration: 700 });
      scene.tweens.add({ targets: [markerTop, markerBottom, ...teeth], alpha: 0.35, yoyo: true, repeat: -1, duration: 520 });
    }
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      markerTop.destroy();
      markerBottom.destroy();
      teeth.forEach((tooth) => tooth.destroy());
    });
  }
}
