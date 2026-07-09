import { Boss } from './Boss';
import { Player } from './Player';
import { Hazard } from './Hazard';

export class CaptainOvercharge extends Boss {
  private homeX: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss-overcharge', 'Captain Overcharge');
    this.maxHealth = this.health = 10;
    this.homeX = x;
  }

  tick(time: number, player: Player): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (Math.abs(this.x - this.homeX) > 250) body.setVelocityX(this.x > this.homeX ? -80 : 80);
    if (time < this.nextAttack) return;
    this.nextAttack = time + (this.phase === 1 ? 1600 : this.phase === 2 ? 1250 : 950);
    this.setTint(0xffe05d);
    this.scene.time.delayedCall(360, () => {
      if (!this.active) return;
      this.clearTint();
      body.setVelocityX(player.x < this.x ? -360 : 360);
      const bomb = new Hazard(this.scene, this.x, this.y + 72, 34, 34, 'explosive');
      bomb.setData('bossObject', true);
      this.scene.time.delayedCall(1150, () => {
        if (!bomb.active) return;
        bomb.setSize(92, 70);
        (bomb.body as Phaser.Physics.Arcade.StaticBody).setSize(92, 70).updateFromGameObject();
        this.scene.cameras.main.shake(110, 0.006);
        this.scene.time.delayedCall(250, () => bomb.destroy());
      });
      if (this.phase >= 3) this.electricFloor(player.x);
    });
  }

  private electricFloor(targetX: number): void {
    const zone = new Hazard(this.scene, targetX, 448, 150, 16, 'shock');
    zone.setData('bossObject', true);
    zone.setAlpha(0.25);
    this.scene.tweens.add({ targets: zone, alpha: 0.88, scaleY: 1.35, yoyo: true, repeat: 3, duration: 120 });
    this.scene.time.delayedCall(980, () => {
      if (zone.active) zone.destroy();
    });
  }
}
