import Phaser from 'phaser';
import { CollectibleType, PowerUpType } from '../types';

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  readonly collectType: CollectibleType;
  readonly chipId?: string;
  readonly power?: PowerUpType;

  constructor(scene: Phaser.Scene, x: number, y: number, type: CollectibleType, id?: string, power?: PowerUpType) {
    const texture = type === 'coin' ? 'coin' : type === 'cell' ? 'cell' : type === 'chip' ? 'chip' : 'powerup';
    super(scene, x, y, texture);
    this.collectType = type;
    this.chipId = id;
    this.power = power;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(12);
    this.setTint(type === 'coin' ? 0xffe05d : type === 'chip' ? 0x45c4ff : type === 'cell' ? 0x77ff4f : 0x6dffcf);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setVelocity(0, 0);
    const ringColor = type === 'coin' ? 0xffe05d : type === 'chip' ? 0x45c4ff : type === 'cell' ? 0x77ff4f : 0xf7fff7;
    const ring = scene.add.ellipse(x, y, type === 'chip' ? 32 : 28, type === 'chip' ? 22 : 28, ringColor, 0.08)
      .setStrokeStyle(2, type === 'cell' ? 0x77ff4f : 0xf7fff7, 0.72)
      .setDepth(11);
    scene.tweens.add({ targets: [this, ring], y: y - 5, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
    scene.tweens.add({ targets: ring, scaleX: 1.14, scaleY: 1.14, alpha: 0.22, yoyo: true, repeat: -1, duration: 680 });
    this.once(Phaser.GameObjects.Events.DESTROY, () => ring.destroy());
  }
}
