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
    const sparkleColor = type === 'coin' ? 0xffe05d : type === 'chip' ? 0x45c4ff : type === 'cell' ? 0x77ff4f : 0xf7fff7;
    const shadow = scene.add.rectangle(x, y + 16, type === 'cell' ? 18 : 16, 3, 0x000000, 0.24).setDepth(10);
    const sparkles = [
      scene.add.rectangle(x - 14, y - 10, 3, 3, sparkleColor, 0.75).setDepth(11),
      scene.add.rectangle(x + 14, y + 8, 2, 2, 0xf7fff7, 0.7).setDepth(11)
    ];
    scene.tweens.add({ targets: this, y: y - 5, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
    scene.tweens.add({ targets: shadow, alpha: 0.12, scaleX: 0.7, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
    scene.tweens.add({ targets: sparkles, alpha: 0.2, yoyo: true, repeat: -1, duration: 520 });
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      shadow.destroy();
      sparkles.forEach((sparkle) => sparkle.destroy());
    });
  }
}
