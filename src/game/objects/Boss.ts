import Phaser from 'phaser';
import { Player } from './Player';
import { burst, floatingText } from '../systems/ParticleSystem';

export abstract class Boss extends Phaser.Physics.Arcade.Sprite {
  maxHealth = 9;
  health = 9;
  protected nextAttack = 0;
  protected phase = 1;
  defeated = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, public title: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setSize(58, 62);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocity(0, 0);
    body.setImmovable(true);
  }

  abstract tick(time: number, player: Player): void;

  hurt(damage = 1): boolean {
    if (this.defeated) return false;
    this.health -= damage;
    this.phase = this.health <= this.maxHealth / 3 ? 3 : this.health <= (this.maxHealth * 2) / 3 ? 2 : 1;
    this.scene.cameras.main.shake(90, 0.006);
    this.setTint(0xffffff);
    this.scene.time.delayedCall(90, () => this.clearTint());
    floatingText(this.scene, this.x, this.y - 40, `-${damage}`);
    if (this.health <= 0) {
      this.defeated = true;
      burst(this.scene, this.x, this.y, 0xffe05d, 48);
      this.destroy();
      return true;
    }
    return false;
  }
}
