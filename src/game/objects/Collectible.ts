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
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    scene.tweens.add({ targets: this, y: y - 5, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
  }
}
