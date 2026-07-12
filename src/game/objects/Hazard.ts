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
    this.setStrokeStyle(2, type === 'acid' ? 0xffe05d : 0xffa33a, 0.82);
    const warn = scene.add.rectangle(x, y, w + 10, h + 10, 0xff3e5f, 0.08)
      .setStrokeStyle(1, 0xff3e5f, 0.58)
      .setDepth(7);
    if (type === 'explosive') {
      scene.tweens.add({ targets: [this, warn], alpha: 0.35, yoyo: true, repeat: -1, duration: 420 });
    } else {
      scene.tweens.add({ targets: this, scaleY: 1.12, yoyo: true, repeat: -1, duration: 700 });
      scene.tweens.add({ targets: warn, alpha: 0.2, yoyo: true, repeat: -1, duration: 520 });
    }
    this.once(Phaser.GameObjects.Events.DESTROY, () => warn.destroy());
  }
}
