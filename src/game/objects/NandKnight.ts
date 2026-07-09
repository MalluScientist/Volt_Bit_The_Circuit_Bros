import Phaser from 'phaser';
import { Boss } from './Boss';
import { Player } from './Player';
import { Hazard } from './Hazard';

export class NandKnight extends Boss {
  private homeX: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss-nand', 'NAND Knight');
    this.maxHealth = this.health = 11;
    this.homeX = x;
  }

  tick(time: number, player: Player): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (Math.abs(this.x - this.homeX) > 240) body.setVelocityX(this.x > this.homeX ? -70 : 70);
    if (time < this.nextAttack) return;

    this.nextAttack = time + (this.phase === 1 ? 1450 : this.phase === 2 ? 1100 : 820);
    this.setTint(0x45c4ff);
    this.scene.time.delayedCall(180, () => {
      if (!this.active) return;
      this.clearTint();
      this.fireSignal(player);
      if (this.phase >= 2) this.toggleGate(player.x);
      if (this.phase >= 3) this.reversePulse();
    });
  }

  private fireSignal(player: Player): void {
    const signal = this.scene.add.rectangle(this.x, this.y - 12, 18, 18, 0x45c4ff, 0.9).setStrokeStyle(2, 0xf7fff7, 0.45);
    this.scene.physics.add.existing(signal);
    const body = signal.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setBounce(1, 1);
    body.setVelocity(player.x < this.x ? -280 : 280, this.phase >= 2 ? -80 : 0);
    signal.setData('projectile', true);
    signal.setData('bossObject', true);
    signal.setData('damage', 1);
    this.scene.time.delayedCall(2400, () => {
      if (signal.active) signal.destroy();
    });
  }

  private toggleGate(targetX: number): void {
    const gate = new Hazard(this.scene, targetX, 448, 118, 16, 'shock');
    gate.setData('bossObject', true);
    gate.setAlpha(0.2);
    this.scene.tweens.add({ targets: gate, alpha: 0.86, yoyo: true, repeat: 3, duration: 130 });
    this.scene.time.delayedCall(1050, () => {
      if (gate.active) gate.destroy();
    });
  }

  private reversePulse(): void {
    const pulse = this.scene.add.rectangle(this.x, this.y + 12, 38, 20, 0xffe05d, 0.82).setStrokeStyle(2, 0x07131b, 0.6);
    this.scene.physics.add.existing(pulse);
    const body = pulse.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityX(this.x > this.homeX ? -360 : 360);
    pulse.setData('projectile', true);
    pulse.setData('bossObject', true);
    pulse.setData('damage', 1);
    this.scene.time.delayedCall(1500, () => {
      if (pulse.active) pulse.destroy();
    });
  }
}
