import Phaser from 'phaser';
import { Player } from './Player';
import { burst, floatingText } from '../systems/ParticleSystem';

export type BossDamageSource = 'melee' | 'beam' | 'dash' | 'stomp' | 'hazard' | 'debug';

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

  takeDamage(damage = 1, source: BossDamageSource = 'debug'): boolean {
    if (this.defeated) return false;
    const amount = Math.max(0, damage);
    this.health = Phaser.Math.Clamp(this.health - amount, 0, this.maxHealth);
    this.phase = this.health <= this.maxHealth / 3 ? 3 : this.health <= (this.maxHealth * 2) / 3 ? 2 : 1;
    this.scene.cameras.main.shake(source === 'beam' ? 120 : 90, source === 'beam' ? 0.007 : 0.006);
    this.setTint(0xffffff);
    this.scene.time.delayedCall(90, () => {
      if (this.active) this.clearTint();
    });
    floatingText(this.scene, this.x, this.y - 40, source === 'beam' ? `BEAM -${amount}` : `-${amount}`);
    if (this.health <= 0) {
      this.defeated = true;
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
      body.setEnable(false);
      burst(this.scene, this.x, this.y, 0xffe05d, 48);
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scaleX: 1.35,
        scaleY: 0.65,
        angle: 8,
        duration: 420,
        ease: 'Quad.easeIn',
        onComplete: () => this.destroy()
      });
      return true;
    }
    return false;
  }

  hurt(damage = 1): boolean {
    return this.takeDamage(damage, 'debug');
  }
}
