import Phaser from 'phaser';
import { burst, floatingText } from '../systems/ParticleSystem';
import { Player } from './Player';

export abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
  health = 1;
  scoreValue = 100;
  protected spawnX: number;
  protected spawnY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.spawnX = x;
    this.spawnY = y;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(false);
  }

  abstract tick(time: number, player: Player): void;

  hurt(damage = 1): boolean {
    this.health -= damage;
    this.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => this.clearTint());
    if (this.health <= 0) {
      burst(this.scene, this.x, this.y, 0xffe05d, 14);
      floatingText(this.scene, this.x, this.y, `+${this.scoreValue}`);
      this.destroy();
      return true;
    }
    return false;
  }
}
